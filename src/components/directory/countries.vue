<template>
  <div>
    <q-table
      title="Страны"
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
    <q-dialog v-model="showDialog" persistent @show="onShow">
      <q-card>
        <q-card-section>
          <div class="text-h6">Добавление новой страны</div>
        </q-card-section>
        <q-card-section>
          <div slot="body">
            <div class="row q-mb-md">
              <q-input
                v-model="addFormFields.name_ru"
                type="text"
                float-label="Наименование заказчика"
                ref="ff"
              />
            </div>
            <div class="row q-mb-md">
              <q-checkbox v-model="addFormFields.enabled" label="Активен"/>
            </div>
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
  // mapMutations,
  mapActions,
} from 'vuex';

export default {
  // name: 'ComponentName',
  data() {
    return {
      columns: [
        {
          name: 'desc_ru',               // уникальный ид столбца
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
          name: 'enabled',
          label: 'Действующий',
          align: 'center',
          field: 'enabled',
          sortable: true,
          sort: (a, b) => a - b,
          classes: 'as-checkbox',
        },
        {
          name: 'rowActions',
          label: 'Действия',
          align: 'right',
          field: 'rowActions',
          required: true,
        },
      ],
      visibleColumns: ['desc_ru', 'desc_en', 'enabled', 'row-actions'],
      filter: '',         // фильтр таблицы
      addFormFields: {    // поля формы добавления документа
        name_ru: null,
        name_en: null,
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
      getErrorMessage: 'appMode/getErrorMessage',
    }),
    ...mapActions({
      getDocuments: 'ds/getCountries',
      addDocument: 'ds/addCountry',
      deleteDocument: 'ds/deleteCountry',
      updateDocument: 'ds/updateCountry',
    }),
  },

  methods: {
    // создать документ
    AddDocument() {
      this.showDialog = true;
    },

    onShow() {
      // this.$refs.ff.select();
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
      //     const errMessage = this.getErrorMessage('post', err);
      //     this.$q.notify({
      //       color: 'negative',
      //       position: 'top',
      //       message: errMessage,
      //       icon: 'report_problem'
      //     });
      //   });
    },

  },
};
</script>

<style>
</style>
