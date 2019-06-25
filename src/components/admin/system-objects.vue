<template>
  <div>
    <q-table
      title="Системные объекты"
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

            <template v-else-if="col.name === 'rowActions'" :props="props">
              <q-btn round size="xs" icon="delete">
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
          <div class="text-h6">Добавление нового Системного объекта</div>
        </q-card-section>
        <q-card-section>
          <div class="row q-mb-md">
            <q-input
              v-model="addFormFields.name"
              autofocus
              label="Наименование"
              :error="$v.addFormFields.name.$error"
            >
              <template v-slot:error>Введите имя системного объекта.</template>
            </q-input>
          </div>
          <div class="row q-mb-md">
            <q-checkbox v-model="addFormFields.enabled" label="Действующий"/>
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Add" @click="validateAndClose('name')" v-close-popup="addFormValid"/>
          <q-btn flat label="Cancel" v-close-popup/>
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
import { required, minLength } from 'vuelidate/lib/validators';
import { PageContainer } from '../mixins/page-container';
import { DeletePopover } from '../mixins/delete-popover';

export default {
  // name: 'ComponentName',
  mixins: [PageContainer, DeletePopover],
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
      visibleColumns: ['desc', 'enabled', 'rowActions'],
      filter: '',         // фильтр таблицы
      addFormFields: {    // поля формы добавления документа
        name: null,
        enabled: true,
      },
      selectData: {},       // буфер для селекта в ячейке таблицы
    };
  },

  // правила валидации
  validations: {
    addFormFields: {
      name: { required, minLength: minLength(3) },
    },
  },

  computed: {
    ...mapState({
      ds: state => state.ds.dsSystemObjects,        // источник данных
      isLoading: state => state.ds.isLoading,
      // abilityDS: state => state.ds.ability,
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
      getDocuments: 'ds/getSystemObjects',
      addDocument: 'ds/addSystemObject',
      deleteDocument: 'ds/deleteSystemObject',
      updateDocument: 'ds/updateSystemObject',
    }),

  },
};
</script>

<style>
</style>
