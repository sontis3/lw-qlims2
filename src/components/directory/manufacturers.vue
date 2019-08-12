<template>
  <div>
    <q-table
      title="Производители"
      :columns="columns"
      :visibleColumns="visibleColumns"
      :data="ds"
      :filter="filter"
      :loading="isLoading"
      :pagination.sync="pagination"
      dense
      separator="cell"
    >
      <!-- слот панели кнопок вверху справа -->
      <template v-slot:top-right="props">
        <!-- кнопка добавления документа -->
        <q-btn flat round dense icon="add_box" @click="onAddDocument" />
        <!-- поиск -->
        <q-input v-model="filter" filled dense type="search" debounce="300" color="secondary">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
        <q-space />
        <!-- выбор показываемых столбцов -->
        <q-select
          v-model="visibleColumns"
          multiple
          borderless
          dense
          options-dense
          :display-value="$q.lang.table.columns"
          emit-value
          map-options
          :options="columns"
          option-value="name"
          style="min-width: 150px"
        />
        <q-btn
          flat
          round
          dense
          :icon="props.inFullscreen ? 'fullscreen_exit' : 'fullscreen'"
          @click="props.toggleFullscreen"
          class="q-ml-md"
        />
      </template>

      <!-- слот тела таблицы -->
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td v-for="col in props.cols" :key="col.name" :props="props">
            <template v-if="col.classes === 'as-checkbox'" :props="props">
              <q-checkbox
                :value="props.row[col.field]"
                @input="(val) => onUpdateDocument(val, props.row, col.field, 'name_ru')"
              />
            </template>

            <template v-else-if="col.classes === 'as-select'" :props="props">
              <q-select
                :value="props.row[col.rowFieldName]"
                :options="getEnabledCountries"
                @input="(val) => onUpdateDocument(val, props.row, col.rowFieldName, 'name_ru')"
                option-value="id"
                option-label="name_ru"
                style="width: 120px"
                filled
                dense
                options-dense
              />
            </template>

            <template v-else-if="col.classes === 'popup-edit'" :props="props">
              {{ col.value }}
              <q-popup-edit
                v-model="popupEditData"
                buttons
                @show="() => onShowPopup(props.row, col.field)"
                @save="(val, initval) => { onUpdateDocument(val, props.row, col.field, 'name_ru'); popupEditData = val; }"
              >
                <q-input v-model="popupEditData" dense counter autofocus />
              </q-popup-edit>
            </template>

            <template v-else-if="col.name === 'rowActions'" :props="props">
              <q-btn round size="xs" icon="delete">
                <q-tooltip>Удаление документа</q-tooltip>
                <q-menu
                  anchor="bottom left"
                  self="top left"
                  :content-style="popoverStyle"
                  @show="showPopover"
                  auto-close
                >
                  <span id="popover-title">Документ выбран для удаления</span>
                  <div id="del-buttons">
                    <q-btn
                      outliner
                      rounded
                      dense
                      size="form-label-inverted"
                      color="red-14"
                      text-color="white"
                      label="Отменить"
                    />
                    <q-btn
                      outliner
                      rounded
                      dense
                      color="red-4"
                      text-color="white"
                      label="Удалить"
                      @click="onDeleteDocument(props.row, 'name_ru', deleteDocument)"
                    />
                  </div>
                </q-menu>
              </q-btn>
            </template>
            <template v-else>{{ col.value }}</template>
          </q-td>
        </q-tr>
      </template>
    </q-table>

    <!-- Диалог добавления документа -->
    <q-dialog v-model="showDialog" no-backdrop-dismiss>
      <q-card>
        <q-card-section>
          <div class="text-h6">Добавление нового производителя</div>
        </q-card-section>
        <q-card-section>
          <div class="row q-mb-md">
            <q-input
              v-model="addFormFields.name_ru"
              autofocus
              label="Наименование рус."
              :error="$v.addFormFields.name_ru.$error"
            >
              <template v-slot:error>Введите производителя рус.</template>
            </q-input>
          </div>
          <div class="row q-mb-md">
            <q-input
              v-model="addFormFields.name_en"
              label="Наименование англ."
              :error="$v.addFormFields.name_en.$error"
            >
              <template v-slot:error>Введите производителя англ.</template>
            </q-input>
          </div>
          <div class="row q-mb-md">
            <q-select
              v-model="addFormFields.country"
              :options="getEnabledCountries"
              option-value="id"
              option-label="name_ru"
              label="Страна"
              style="width: 120px"
              filled
              dense
              options-dense
            ></q-select>
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn
            flat
            label="Add"
            @click="validateAndClose('name_ru')"
            v-close-popup="addFormValid"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import {
  mapState,
  mapGetters,
  mapMutations,
  mapActions,
} from 'vuex';
import {
  required,
  minLength,
  // sameAs
} from 'vuelidate/lib/validators';
import { PageContainer } from '../mixins/page-container';
import { DefaultMounted } from '../mixins/default-mounted';
import { DeletePopover } from '../mixins/delete-popover';

export default {
  // name: 'ComponentName',
  mixins: [PageContainer, DefaultMounted, DeletePopover],
  data() {
    return {
      columns: [
        {
          name: 'desc_ru',            // уникальный ид столбца
          required: true,             // обязательный
          label: 'Наименование рус',  // заголовок столбца
          align: 'left',              // выравнивание
          field: 'name_ru',           // поле источник значений
          sortable: true,             // сортируемый столбец
          classes: 'popup-edit',      // пользовательские классы
        },
        {
          name: 'desc_en',
          required: true,
          label: 'Наименование англ',
          align: 'left',
          field: 'name_en',
          sortable: true,
          classes: 'popup-edit',
        },
        {
          name: 'country',
          required: true,
          label: 'Страна',
          align: 'left',
          field: row => row.country.name_ru,
          rowFieldName: 'country',    // для ссылочных полей указывает на имя поля в строке
          sortable: true,
          classes: 'as-select',
        },
        {
          name: 'rowActions',
          label: 'Действия',
          align: 'right',
          field: 'rowActions',
          required: true,
          style: 'width: 80px',
        },
      ],
      visibleColumns: ['desc_ru', 'desc_en', 'country', 'rowActions'],
      pagination: {
        rowsPerPage: 8,
      },
      filter: '',         // фильтр таблицы
      addFormFields: {    // поля формы добавления документа
        name_ru: null,
        name_en: null,
        country: null,
      },
    };
  },

  // правила валидации
  validations() {
    if (this.addFormFields.name_en === '') {
      return {
        addFormFields: {
          name_ru: { required, minLength: minLength(2) },
        },
      };
    }
    return {
      addFormFields: {
        name_ru: { required, minLength: minLength(2) },
        name_en: { minLength: minLength(2) },
      },
    };
    // addFormFields: {
    //   name_ru: { required, minLength: minLength(2) },
    //   name_en: { minLength: minLength(2) },
    // },
  },

  computed: {
    ...mapState({
      ds: state => state.ds.dsManufacturers,        // источник данных
      dsCountries: state => state.ds.dsCountries,        // источник данных Страны
      isLoading: state => state.ds.isLoading,
      abilityDS: state => state.ds.ability,
    }),
    ...mapGetters({
      getErrorDescription: 'appMode/getErrorDescription',
      getEnabledCountries: 'ds/getEnabledCountries',
    }),
  },

  methods: {
    ...mapMutations({
      addErrorNotification: 'appMode/addErrorNotification',
      setLoading: 'ds/setLoading',
    }),

    ...mapActions({
      getDocuments: 'ds/getManufacturers',
      addDocument: 'ds/addManufacturer',
      deleteDocument: 'ds/deleteManufacturer',
      updateDocument: 'ds/updateManufacturer',
      getCountries: 'ds/getCountries',
    }),

  },

  mounted() {
    if (this.dsCountries.length === 0) {
      this.setLoading(true);
      this.getCountries().then()
        .catch((err) => {
          const errDescription = this.getErrorDescription('get', err);
          this.addErrorNotification({ message: err.message, description: errDescription });
          this.$q.notify({
            color: 'negative',
            position: 'top',
            message: errDescription,
            icon: 'report_problem',
          });
        })
        .finally(() => {
          this.setLoading(false);
        });
    }
  },
};
</script>

<style>
</style>
