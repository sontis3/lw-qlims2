<template>
  <div>
    <q-table
      title="Коллекции"
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
        <!-- переключатель на полный экран -->
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
            <template v-if="col.name === 'rowActions'" :props="props">
              <!-- удаление коллекции -->
              <q-btn round size="xs" icon="clear" :disable="props.row.canDropCollection === false">
                <q-tooltip>Удаление коллекции</q-tooltip>
                <q-menu
                  anchor="bottom left"
                  self="top left"
                  :content-style="popoverStyle"
                  @show="showPopover"
                  auto-close
                >
                  <span id="popover-title">Коллекция выбрана для очистки</span>
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
                      label="Очистить"
                      @click="onTreatCollection(props.row, 'name', dropCollection)"
                    />
                  </div>
                </q-menu>
              </q-btn>
              <!-- восстановление коллекции по-умолчанию -->
              <q-btn round size="xs" icon="restore" :disable="props.row.canRestoreCollection === false">
                <q-tooltip>Восстановление коллекции</q-tooltip>
                <q-menu
                  anchor="bottom left"
                  self="top left"
                  :content-style="popoverStyle"
                  @show="showPopover"
                  auto-close
                >
                  <span id="popover-title">Коллекция выбрана <br> для восстановления</span>
                  <div id="rec-buttons">
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
                      label="Восстановить"
                      @click="onTreatCollection(props.row, 'name', restoreCollection)"
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
  </div>
</template>

<script>
import {
  mapState,
  mapGetters,
  mapMutations,
  mapActions,
} from 'vuex';
import { DeletePopover } from '../mixins/delete-popover';

export default {
  // name: 'ComponentName',
  mixins: [DeletePopover],
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
        },
        {
          name: 'rowActions',
          label: 'Действия',
          align: 'center',
          field: 'rowActions',
          required: true,
          style: 'width: 120px',
        },
      ],
      visibleColumns: ['desc', 'rowActions'],
      pagination: {
        rowsPerPage: 8,
      },
      filter: '',         // фильтр таблицы
    };
  },

  computed: {
    ...mapState({
      ds: state => state.appMode.dsCollections,        // источник данных
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
      dropCollection: 'ds/dropCollection',
      restoreCollection: 'ds/restoreCollection',
    }),

    // обработка коллекции
    // row - строка таблицы коллекций
    // fieldName - имя поля для сообщения
    // treatFunc - функция обработки
    onTreatCollection(row, fieldName, treatFunc) {
      const { tag } = row;
      this.setLoading(true);
      const res = treatFunc(tag);
      res.then(() => {
        this.$q.notify({
          color: 'positive',
          position: 'top',
          message: `Коллекция ['${row[fieldName]}'] успешно обработана.`,
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

  },
};
</script>

<style>
#popover-title {
  margin-left: 8px;
  display: inline-flex;
}

#rec-buttons {
  display: inline-flex;
  margin-left: auto;
  justify-content: space-around;
  width: 216px;
}
</style>
