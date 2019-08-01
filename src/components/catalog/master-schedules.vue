<template>
  <q-page>
    <q-table
      :title="'ОСНОВНОЙ ПЛАН ГРАФИК ИССЛЕДОВАНИЙ ЛАБОРАТОРИИ ( ' + $route.params.year + ' ГОД)'"
      :columns="columns"
      :visibleColumns="visibleColumns"
      :data="ds"
      dense
      separator="cell"
    >
    </q-table>
  </q-page>
</template>

<script>
import {
  mapState,
  // mapGetters,
  // mapMutations,
  // mapActions,
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
        label: 'Код исследования',
        align: 'left',
        field: 'reg_code',
        sortable: true,
        classes: 'popup-edit',
      },
      {
        name: 'customer',
        required: true,
        label: 'Заказчик исследования',
        align: 'left',
        field: row => ((row || {}).customer || {}).name, // защита от ошибки, если customer=undefined
        sortable: true,
      },
      {
        name: 'testObject',
        required: true,
        label: 'Тестируемый объект',
        align: 'left',
        field: row => ((row || {}).test_object || {}).name, // защита от ошибки, если customer=undefined
        sortable: true,
      },
      {
        name: 'dateCreated',
        label: 'Дата создания',
        align: 'center',
        field: 'dateCreated',
        sortable: true,
      },
      {
        name: 'dateUpdated',
        label: 'Дата изменения',
        align: 'center',
        field: 'dateUpdated',
        sortable: true,
      },
    ],
    visibleColumns: ['expandButton', 'studyNo', 'testObject', 'customer', 'dateCreated', 'dateUpdated'],
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
    // ...mapGetters({
    //   getErrorDescription: 'appMode/getErrorDescription',
    //   getEnabledCountries: 'ds/getEnabledCountries',
    // }),
  },
};

</script>

<style>

</style>
