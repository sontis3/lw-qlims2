<template>
  <div>
    <q-table
      title="Заказчики"
      :columns="columns"
      :visibleColumns="visibleColumns"
      :data="ds"
      :filter="filter"
      :loading="isLoading"
      dense
      separator="cell"
    >
      <!-- слот панели кнопок вверху справа -->
      <template v-slot:top-right="props">
        <!-- кнопка добавления документа -->
        <q-btn flat round dense icon="add_box" @click="onAddDocument"/>
        <!-- поиск -->
        <q-input v-model="filter" filled dense type="search" debounce="300" color="secondary">
          <template v-slot:append>
            <q-icon name="search"/>
          </template>
        </q-input>
        <q-space/>
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

            <template v-if="col.classes === 'as-select'" :props="props">
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

            <template v-else-if="col.classes === 'popup-edit'" :props="props">
              {{ col.value }}
              <q-popup-edit
                v-model="popupEditData"
                buttons
                @show="() => onShowPopup(props.row, col.field)"
                @save="(val, initval) => { onUpdateDocument(val, props.row, col.field, 'name'); popupEditData = ''; }"
              >
                <q-input v-model="popupEditData" dense counter autofocus/>
              </q-popup-edit>
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
          <div class="text-h6">Добавление нового заказчика</div>
        </q-card-section>
        <q-card-section>
          <div class="row q-mb-md">
            <q-input
              v-model="addFormFields.name"
              autofocus
              label="Наименование"
              :error="$v.addFormFields.name.$error"
            >
              <template v-slot:error>Введите заказчика.</template>
            </q-input>
          </div>
          <div class="row q-mb-md">
            <q-checkbox v-model="addFormFields.enabled" label="Действующий"/>
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
          <div class="row q-mb-md">
            <q-input
              v-model="addFormFields.email"
              :error="$v.addFormFields.email.$error"
              label="Почта"
              bottom-slots
            >
              <template v-slot:before>
                <q-icon name="mail"/>
              </template>
              <template v-slot:error>Ошибка формата адреса эл. почты.</template>
            </q-input>
          </div>
          <div class="row q-mb-md">
            <q-input
              v-model="addFormFields.phone_1"
              :error="$v.addFormFields.phone_1.$error"
              label="Телефон 1"
              type="tel"
              bottom-slots
            >
              <template v-slot:before>
                <q-icon name="phone"/>
              </template>
              <template v-slot:error>Ошибка формата номера телефона.</template>
            </q-input>
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" v-close-popup/>
          <q-btn flat label="Add" @click="validateAndClose('name')" v-close-popup="addFormValid"/>
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
  email,
  // sameAs
} from 'vuelidate/lib/validators';
import { PageContainer } from '../mixins/page-container';

export default {
  // name: 'ComponentName',
  mixins: [PageContainer],
  data() {
    return {
      columns: [
        {
          name: 'desc',           // уникальный ид столбца
          required: true,         // обязательный
          label: 'Наименование',  // заголовок столбца
          align: 'left',          // выравнивание
          field: 'name',          // поле источник значений
          sortable: true,         // сортируемый столбец
          classes: 'popup-edit',  // пользовательские классы
        },
        {
          name: 'enabled',
          label: 'Действующий',
          align: 'center',
          field: 'enabled',
          sortable: true,
          sort: (a, b) => a - b,
          classes: 'as-checkbox',
        },
        {
          name: 'country',
          required: true,
          label: 'Страна',
          align: 'left',
          field: row => row.country.name_ru,
          rowFieldName: 'country',
          sortable: true,
          classes: 'as-select',
        },
        {
          name: 'zip_code',
          required: true,
          label: 'Почтовый индекс',
          align: 'left',
          field: 'zip_code',
          sortable: true,
          classes: 'popup-edit',
        },
        {
          name: 'city',
          required: true,
          label: 'Город',
          align: 'left',
          field: 'city',
          sortable: true,
          classes: 'popup-edit',
        },
        {
          name: 'region',
          required: true,
          label: 'Регион',
          align: 'left',
          field: 'region',
          sortable: true,
          classes: 'popup-edit',
        },
        {
          name: 'address_line_1',
          required: true,
          label: 'Адрес 1',
          align: 'left',
          field: 'address_line_1',
          sortable: true,
          classes: 'popup-edit',
        },
        {
          name: 'address_line_2',
          required: true,
          label: 'Адрес 2',
          align: 'left',
          field: 'address_line_2',
          sortable: true,
          classes: 'popup-edit',
        },
        {
          name: 'address_line_3',
          required: true,
          label: 'Адрес 3',
          align: 'left',
          field: 'address_line_3',
          sortable: true,
          classes: 'popup-edit',
        },
        {
          name: 'email',
          required: true,
          label: 'Почта',
          align: 'left',
          field: 'email',
          sortable: true,
          classes: 'popup-edit',
        },
        {
          name: 'phone_1',
          required: true,
          label: 'Телефон1',
          align: 'left',
          field: 'phone_1',
          sortable: true,
          classes: 'popup-edit',
        },
        {
          name: 'createdAt',
          label: 'Дата создания',
          align: 'center',
          field: 'createdAt',
          sortable: true,
        },
        {
          name: 'updatedAt',
          label: 'Дата изменения',
          align: 'center',
          field: 'updatedAt',
          sortable: true,
        },
        {
          name: 'rowActions',
          label: 'Действия',
          align: 'right',
          field: 'rowActions',
          required: true,
        },
      ],
      visibleColumns: ['desc', 'enabled', 'country', 'zip_code', 'city', 'region', 'address_line_1', 'address_line_2', 'address_line_3',
        'email', 'phone_1', 'createdAt', 'updatedAt', 'row-actions'],
      filter: '',         // фильтр таблицы
      addFormFields: {    // поля формы добавления документа
        name: null,
        enabled: true,
        country: null,
        email: '123@456.com',
        phone_1: '89161234567',
      },
      selectData: {},       // буфер для селекта в ячейке таблицы
    };
  },

  // правила валидации
  validations: {
    addFormFields: {
      name: { required, minLength: minLength(2) },
      email: { required, email },
      phone_1: { required },
    },
  },

  computed: {
    ...mapState({
      ds: state => state.ds.dsCustomers,        // источник данных
      dsCountries: state => state.ds.dsCountries,        // источник данных Страны
      isLoading: state => state.ds.isLoading,
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
      updateDsCustomers: 'ds/updateDsCustomers',
    }),

    ...mapActions({
      getDocuments: 'ds/getCustomers',
      addDocument: 'ds/addCustomer',
      deleteDocument: 'ds/deleteCustomer',
      updateDocument: 'ds/updateCustomer',
      getCountries: 'ds/getCountries',
    }),

  },

  mounted() {
    if (this.dsCountries.length === 0) {
      this.getCountries();
    }
  },
};
</script>

<style>
</style>
