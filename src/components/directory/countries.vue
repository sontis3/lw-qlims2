<template>
  <div>
    <q-table
      title="Страны"
      :columns="columns"
      :visibleColumns="visibleColumns"
      :data="ds1"
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

      <template v-slot:body-cell-enabled="props">
        <q-td :props="props">
          <q-checkbox v-model="props.value" @input="(val) => UpdateDocument(val, null, props.row, props.col.label)"/>
        </q-td>
      </template>
    </q-table>

    <!-- Диалог добавления документа -->
    <q-dialog v-model="showDialog" no-backdrop-dismiss>
      <q-card>
        <q-card-section>
          <div class="text-h6">Добавление новой страны</div>
        </q-card-section>
        <q-card-section>
          <div class="row q-mb-md">
            <q-input v-model="addFormFields.name_ru" autofocus label="Наименование рус"/>
          </div>
          <div class="row q-mb-md">
            <q-input v-model="addFormFields.name_en" label="Наименование англ"/>
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
      dsStore: state => state.ds.dsCountries,        // источник данных
      isLoading: state => state.ds.isLoading,
    }),
    ...mapGetters({
      getErrorDescription: 'appMode/getErrorDescription',
    }),

    ds1: {
      get() {
        return this.$store.state.ds.dsCountries;
      },
      // set(value) {
      //   this.$store.commit('setDsCountries', value);
      // },
    },
  },

  methods: {
    ...mapMutations({
      addErrorNotification: 'appMode/addErrorNotification',
      setLoading: 'ds/setLoading',
    }),

    ...mapActions({
      getDocuments: 'ds/getCountries',
      addDocument: 'ds/addCountry',
      deleteDocument: 'ds/deleteCountry',
      updateDocument: 'ds/updateCountry',
    }),
    // создать документ
    onAddDocument() {
      this.showDialog = true;
    },

    // обработка события закрытия диалога создания нового документа
    async onAdd() {
      const res = this.addDocument(this.addFormFields);
      res.then((response) => {
        this.$q.notify({
          color: 'positive',
          position: 'top',
          message: `Документ '${response.data.name_ru}' успешно создан.`,
          icon: 'save',
        });
      })
        .catch((err) => {
          const errDescription = this.getErrorDescription('post', err);
          this.addErrorNotification({ message: err.message, description: errDescription });

          this.$q.notify({
            color: 'negative',
            position: 'top',
            message: errDescription,
            icon: 'report_problem',
          });
        });
    },

    // изменить документ
    UpdateDocument(val, initialValue, row, cLabel) {
      this.setLoading(true);
      // для видимости в catch
      const initVal = initialValue;
      const updatedRow = row;
      const res = this.updateDocument(row);
      res.then((response) => {
        this.$q.notify({
          color: 'positive',
          position: 'top',
          message: `Документ '${response.data.name}' успешно изменен. Поле [${cLabel}]`,
          icon: 'update',
        });
      })
        .catch((err) => {
          const errMessage = this.getErrorMessage('put', err);
          this.$q.notify({
            color: 'negative',
            position: 'top',
            message: errMessage,
            icon: 'report_problem',
          });
          updatedRow.name = initVal;
        })
        .finally(() => {
          // принудительное обновление документов необходимо, т.к. чекбокс при ощибке остается в неправильном состоянии
          this.getDocuments();
          this.setLoading(false);
        });
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