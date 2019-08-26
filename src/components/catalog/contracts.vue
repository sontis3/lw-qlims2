<template>
  <q-page>
    <q-table
      :title="'Договоры лаборатории (' + $route.params.year + ' ГОД)'"
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
                @input="(val) => onUpdateDocument(val, props.row, col.field, 'name')"
              />
            </template>

            <template v-else-if="col.classes === 'as-select'" :props="props">
              <q-select
                :value="props.row[col.rowFieldName]"
                :options="getEnabledCountries"
                @input="(val) => onUpdateDocument(val, props.row, col.rowFieldName, 'name')"
                option-value="id"
                option-label="name_ru"
                style="width: 120px"
                filled
                dense
                options-dense
              />
            </template>

            <template
              v-else-if="col.classes === 'as-date-time'"
              :props="props"
            >{{ formatDateTime(col.value) }}</template>

            <template v-else-if="col.classes === 'popup-edit'" :props="props">
              {{ col.value }}
              <q-popup-edit
                v-model="popupEditData"
                buttons
                @show="() => onShowPopup(props.row, col.field)"
                @save="(val, initval) => { onUpdateDocument(val, props.row, col.field, 'name'); popupEditData = ''; }"
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
                      @click="onDeleteDocument(props.row, 'name', deleteDocument)"
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
          <div class="text-h6">Добавление нового контракта</div>
        </q-card-section>
        <q-card-section>
          <div class="row q-mb-md">
            <q-input
              v-model="addFormFields.reg_code"
              autofocus
              label="Регистрационный номер"
              :error="$v.addFormFields.reg_code.$error"
            >
              <template v-slot:error>Введите регистрационный номер</template>
            </q-input>
          </div>
          <div class="row q-mb-md">
            <q-input
              v-model="addFormFields.theme"
              label="Тема"
              :error="$v.addFormFields.theme.$error"
            >
              <template v-slot:error>Введите тему</template>
            </q-input>
          </div>
          <div class="row q-mb-md">
            <q-input
              filled
              v-model="addFormFields.reg_date"
              label="Дата регистрации"
              mask="##.##.####"
              :rules="['validDate']"
            >
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy ref="qDateProxy1" transition-show="scale" transition-hide="scale">
                    <q-date
                      v-model="addFormFields.reg_date"
                      mask="DD.MM.YYYY"
                      @input="() => $refs.qDateProxy1.hide()"
                    />
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>
          <div class="row q-mb-md">
            <q-input
              filled
              v-model="addFormFields.deadline_date"
              label="Срок действия договора"
              mask="##.##.####"
              :rules="['validDate']"
            >
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy ref="qDateProxy2" transition-show="scale" transition-hide="scale">
                    <q-date
                      v-model="addFormFields.deadline_date"
                      mask="DD.MM.YYYY"
                      @input="() => $refs.qDateProxy2.hide()"
                    />
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>
          <div class="row q-mb-md">
            <q-select
              v-model="addFormFields.customer"
              :options="dsCustomers"
              option-value="id"
              option-label="name"
              label="Заказчик"
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
  </q-page>
</template>

<script>
import { date } from 'quasar';
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
import { DeletePopover } from '../mixins/delete-popover';

export default {
  mixins: [PageContainer, DeletePopover],
  data: () => ({
    columns: [
      {
        name: 'expandButton',
        required: true,
        label: '',
        align: 'center',
        field: '',
        classes: 'expand-btn',
      },
      {
        name: 'reg_code',
        required: true,
        label: 'Регистрационный номер',
        align: 'left',
        field: 'reg_code',
        sortable: true,
        classes: 'popup-edit',
      },
      {
        name: 'theme',
        required: true,
        label: 'Тема',
        align: 'left',
        field: 'theme',
        sortable: true,
        classes: 'popup-edit',
      },
      {
        name: 'reg_date',
        label: 'Дата регистрации',
        align: 'center',
        field: 'reg_date',
        sortable: true,
        classes: 'as-date-time',
      },
      {
        name: 'deadline_date',
        label: 'Срок действия договора',
        align: 'center',
        field: 'deadline_date',
        sortable: true,
        classes: 'as-date-time',
      },
      {
        name: 'customer',
        required: true,
        label: 'Заказчик',
        align: 'left',
        field: row => ((row || {}).customer || {}).name, // защита от ошибки, если customer=undefined
        sortable: true,
      },
      {
        name: 'createdAt',
        label: 'Дата создания',
        align: 'center',
        field: 'createdAt',
        sortable: true,
        classes: 'as-date-time',
      },
      {
        name: 'updatedAt',
        label: 'Дата изменения',
        align: 'center',
        field: 'updatedAt',
        sortable: true,
        classes: 'as-date-time',
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
    visibleColumns: ['expandButton', 'reg_code', 'reg_date', 'deadline_date', 'theme', 'customer', 'createdAt', 'updatedAt', 'rowActions'],
    pagination: { rowsPerPage: 8 },
    filter: '',         // фильтр таблицы
    addFormFields: {
      reg_code: null,
      reg_date: null,
      deadline_date: null,
      theme: null,
      customer: null,
    },
    showDialog: false,
    popoverStyle: {
      backgroundColor: 'red',
      minWidth: '0px',
      display: 'inline-flex',
      flexWrap: 'nowrap',
    },
  }),

  // правила валидации
  validations() {
    return {
      addFormFields: {
        reg_code: { required, minLength: minLength(6) },
        // reg_date: { minLength: minLength(2) },
        // deadline_date: { minLength: minLength(2) },
        theme: { required, minLength: minLength(6) },
        // customerId: { minLength: minLength(2) },
      },
    };
  },

  computed: {
    ...mapState({
      ds: state => state.ds.dsContracts,        // источник данных
      dsCustomers: state => state.ds.dsCustomers,     // источник данных Заказчики
      isLoading: state => state.ds.isLoading,
      // abilityDS: state => state.ds.ability,
    }),
    ...mapGetters({
      getErrorDescription: 'appMode/getErrorDescription',
      // getEnabledCountries: 'ds/getEnabledCountries',
    }),
  },

  methods: {
    ...mapMutations({
      addErrorNotification: 'appMode/addErrorNotification',
      setLoading: 'ds/setLoading',
    }),
    ...mapActions({
      getDocuments: 'ds/getContracts',
      addDocument: 'ds/addContract',
      getCustomers: 'ds/getCustomers',
    }),

    // Валидация даты в формате DD.MM.YYYY
    validDate(value) {
      const valueParsed = value.split('.');
      if (!valueParsed.length === 3) {
        return false;
      }
      const dateParsed = date.buildDate({
        year: valueParsed[2],
        month: valueParsed[1],
        date: valueParsed[0],
      });
      return date.isValid(dateParsed.toString());
    },
  },

  mounted() {
    this.setLoading(true);
    const res = this.getDocuments(this.$route.params.year);
    res.then()
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

    if (this.dsCustomers.length === 0) {
      this.setLoading(true);
      this.getCustomers().then()
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
