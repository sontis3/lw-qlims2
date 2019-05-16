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
      <template v-slot:top-right="props">
        <!-- кнопка добавления документа -->
        <q-btn flat round dense icon="add_box" @click="AddDocument"/>
        <!-- поиск -->
        <q-input v-model="filter" filled dense type="search" debounce="300" color="secondary">
          <template v-slot:append>
            <q-icon name="search"/>
          </template>
        </q-input>
        <q-space/>
        <!-- выбор показуваемых столбцов -->
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

    <!-- Диалог добавления документа -->
    <q-dialog v-model="showDialog" no-backdrop-dismiss>
      <q-card>
        <q-card-section>
          <div class="text-h6">Добавление нового заказчика</div>
        </q-card-section>
        <q-card-section>
          <div class="row q-mb-md">
            <q-input v-model="addFormFields.name" autofocus label="Наименование"/>
          </div>
          <div class="row q-mb-md">
            <q-checkbox v-model="addFormFields.enabled" label="Активен"/>
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" v-close-popup/>
          <q-btn flat label="Add" @click="onAdd" v-close-popup/>
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

export default {
  // name: 'ComponentName',
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
      visibleColumns: ['desc', 'enabled', 'createdAt', 'row-actions'],
      filter: '',         // фильтр таблицы
      addFormFields: {    // поля формы добавления документа
        name: null,
        enabled: true,
      },
      showDialog: false,  // показать/скрыть диалог добавления
    };
  },

  computed: {
    ...mapState({
      ds: state => state.ds.dsCustomers,        // источник данных
      isLoading: state => state.ds.isLoading,
    }),
    ...mapGetters({
      getErrorDescription: 'appMode/getErrorDescription',
    }),
  },

  methods: {
    ...mapMutations({
      addErrorNotification: 'appMode/addErrorNotification',
      setLoading: 'ds/setLoading',
    }),

    ...mapActions({
      getDocuments: 'ds/getCustomers',
      addDocument: 'ds/addCustomer',
      deleteDocument: 'ds/deleteCustomer',
      updateDocument: 'ds/updateCustomer',
    }),

    // создать документ
    AddDocument() {
      this.showDialog = true;
    },

    async onAdd() {
      // const res = this.addDocument(this.addFormFields);
      // res.then((response) => {
      //   this.$q.notify({
      //     color: 'positive',
      //     position: 'top',
      //     message: `Документ '${response.data.name}' успешно создан.`,
      //     icon: 'save'
      //   });
      // })
      //   .catch((err) => {
      //     const errMessage = this.getErrorDescription('post', err);
      //     this.$q.notify({
      //       color: 'negative',
      //       position: 'top',
      //       message: errMessage,
      //       icon: 'report_problem'
      //     });
      //   });
    },

  },

  mounted() {
    this.setLoading(true);
    const res = this.getDocuments();
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
