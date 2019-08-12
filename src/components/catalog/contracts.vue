<template>
  <q-page>
    <q-table
      :title="'Договоры лаборатории (' + $route.params.year + ' ГОД)'"
      :columns="columns"
      :visibleColumns="visibleColumns"
      :data="ds"
      :filter="filter"
      dense
      separator="cell"
      selection="single"
    >
      <!-- слот панели кнопок вверху справа -->
      <template v-slot:top-right="props">
        <!-- кнопка добавления документа -->
        <!-- <q-btn flat round dense icon="add_box" @click="onAddDocument" /> -->
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
    </q-table>
  </q-page>
</template>

<script>
import {
  mapState,
  mapGetters,
  mapMutations,
  mapActions,
} from 'vuex';

export default {
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
        name: 'reg_date',
        label: 'Дата регистрации',
        align: 'center',
        field: 'reg_date',
        sortable: true,
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
        name: 'deadline_date',
        label: 'Срок действия договора',
        align: 'center',
        field: 'deadline_date',
        sortable: true,
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
        style: 'width: 80px',
      },
    ],
    visibleColumns: ['expandButton', 'reg_code', 'reg_date', 'theme', 'deadline_date', 'customer', 'createdAt', 'updatedAt', 'rowActions'],
    pagination: { rowsPerPage: 8 },
    filter: '',         // фильтр таблицы
    addFormFields: {
      studyNo: null,
      planYear: 2018,
      customerId: null,
      test_objectId: null,
      enabled: true,
    },
    showDialog: false,
    popoverStyle: {
      backgroundColor: 'red',
      minWidth: '0px',
      display: 'inline-flex',
      flexWrap: 'nowrap',
    },
  }),

  computed: {
    ...mapState({
      ds: state => state.ds.dsMasterSchedules,        // источник данных
      // dsCountries: state => state.ds.dsCountries,        // источник данных Страны
      // isLoading: state => state.ds.isLoading,
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
    }),
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
  },
};

</script>

<style>
</style>
