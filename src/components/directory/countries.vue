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

      <!-- слот тела таблицы -->
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td key="desc_ru" :props="props">
            {{ props.row.name_ru }}
            <q-popup-edit
              :value="props.row.name_ru"
              @save="(val, initialValue) => onUpdateDocument(val, props.row, 'name_ru', 'name_ru')"
              buttons
            >
              <q-input :value="props.row.name_ru" count/>
        <!-- <q-popup-edit v-model="props.row.name_ru"
          @save="(val, initialValue) => onUpdateDocument(val, props.row, 'name_ru', 'name_ru')"
          buttons>
        <q-input v-model="props.row.name_ru" count/>-->
        <!-- <q-popup-edit v-model="props.row.name_ru" buttons>
        <q-input v-model="props.row.name_ru" count/>-->
            </q-popup-edit>
          </q-td>
          <q-td key="desc_en" :props="props">{{ props.row.name_en }}</q-td>
          <q-td key="enabled" :props="props">
            <q-checkbox
              :value="props.row.enabled"
              @input="(val) => onUpdateDocument(val, props.row, 'enabled', 'name_ru')"
            />
          </q-td>

          <q-td key="rowActions" :props="props">
            <!-- <q-btn round size="xs" icon="edit" @click="onEditDocument(props.row)"/> -->
            <q-btn v-if="abilityDS.can('delete', 'Country')" round size="xs" icon="delete">
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
                    @click="onDeleteDocument(props.row)"
                  />
                </div>
              </q-menu>
            </q-btn>
          </q-td>

          <!-- <q-td v-for="col in props.cols" :key="col.name" :props="props">
            <template v-if="col.classes === 'popup-edit'">
              {{ col.value }}
              <q-popup-edit
                :value="props.row[col.field]"
                @save="(val, initialValue) => UpdateDocument(val, initialValue, props.row, col.label)"
              >
                <q-input v-model="props.row[col.field]" count/>
              </q-popup-edit>
            </template>
          </q-td>-->
        </q-tr>
      </template>
      <!-- слот ячейки Действующий -->
      <!-- <template v-slot:body-cell-enabled="props">
        <q-td :props="props">
          <q-checkbox
            :value="props.value"
            @input="(val) => UpdateDocument(val, props.row, props.col.field)"
          />
        </q-td>
      </template>-->
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
          <q-btn flat label="Add" @click="onAdd('name_ru')" v-close-popup/>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
// import { extend } from 'quasar';
import {
  mapState,
  mapGetters,
  mapMutations,
  mapActions,
} from 'vuex';
import { PageContainer } from '../mixins/page-container';

export default {
  // name: 'ComponentName',
  mixins: [PageContainer],
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
          name: 'enabled',
          label: 'Действующий',
          align: 'center',
          field: 'enabled',
          sortable: true,
          sort: (a, b) => a - b,
          classes: 'as-checkbox',
          style: 'width: 80px',
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
      ds: [
        {
          id: '5caf4dd959c33c3884502fb4',
          name_ru: 'йцу',
          name_en: 'qwe',
          enabled: true,
        },

      ],
      visibleColumns: ['desc_ru', 'desc_en', 'enabled', 'rowActions'],
      filter: '',         // фильтр таблицы
      addFormFields: {    // поля формы добавления документа
        name_ru: null,
        name_en: null,
        enabled: true,
      },
      popoverStyle: {
        backgroundColor: 'red',
        minWidth: '0px',
        display: 'inline-flex',
        flexWrap: 'nowrap',
      },
    };
  },

  computed: {
    ...mapState({
      isLoading: state => state.ds.isLoading,
      abilityDS: state => state.ds.ability,
    }),
    ...mapGetters({
      getErrorDescription: 'appMode/getErrorDescription',
    }),

    ds1: {
      get() {
        return this.$store.state.ds.dsCountries;
      },
      set(value) {
        this.$store.commit('setDsCountries', value);
      },
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

    // удалить документ
    onDeleteDocument(row) {
      const { id } = row;
      this.setLoading(true);
      const res = this.deleteDocument(id);
      res.then((response) => {
        this.$q.notify({
          color: 'positive',
          position: 'top',
          message: `Документ '${response.data.name_ru}' успешно удален.`,
          icon: 'delete',
        });
      })
        .catch((err) => {
          const errDescription = this.getErrorDescription('delete', err);
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

    showPopover() {
      // выставить ширину как у строки таблицы
      this.popoverStyle.minWidth = `${this.$el.querySelector('.q-table tbody tr').clientWidth}px`;
    },
  },

};
</script>

<style>
#popover-title {
  margin-left: 8px;
}

#del-buttons {
  display: inline-flex;
  margin-left: auto;
  justify-content: space-around;
  width: 176px;
}
</style>
