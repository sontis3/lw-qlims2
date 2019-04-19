<template>
  <div>
    <q-table title="Заказчики" :columns="columns" :data="ds"></q-table>
  </div>
</template>

<script>
import {
  mapState,
  mapGetters,
  // mapMutations,
  // mapActions,
} from 'vuex';

export default {
  // name: 'ComponentName',
  data() {
    return {
      columns: [
        {
          name: 'desc',
          required: true,
          label: 'Наименование',
          align: 'left',
          field: 'name',
          sortable: true,
          classes: 'popup-edit',
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
        {
          name: 'rowActions',
          label: 'Действия',
          align: 'right',
          field: 'rowActions',
          required: true,
        },
      ],
      visibleColumns: ['desc', 'enabled', 'row-actions'],
    };
  },

  computed: {
    ...mapState({
      // источник данных
      ds: state => state.ds.dsCustomers,
    }),
    ...mapGetters({
      getErrorMessage: 'appMode/getErrorMessage',
    }),
  },

};
</script>

<style>
</style>
