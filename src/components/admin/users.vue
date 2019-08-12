<template>
  <div>
    <q-table
      title="Пользователи"
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

            <template v-else-if="col.classes === 'as-select'" :props="props">
              <q-select
                :value="props.row[col.rowFieldName]"
                :options="getEnabledRoles"
                @input="(val) => onUpdateDocument(val, props.row, col.rowFieldName, 'name')"
                option-value="id"
                option-label="name"
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

            <template v-else-if="col.name === 'rowActions'" :props="props">
              <q-btn round size="xs" icon="delete">
                <q-tooltip>Удаление документа</q-tooltip>
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
    <!-- <q-dialog v-model="showDialog" no-backdrop-dismiss>
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
              :options="getEnabledRoles"
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
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" v-close-popup/>
          <q-btn flat label="Add" @click="validateAndClose('name')" v-close-popup="addFormValid"/>
        </q-card-actions>
      </q-card>
    </q-dialog> -->
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
import { DefaultMounted } from '../mixins/default-mounted';
import { DeletePopover } from '../mixins/delete-popover';

export default {
  // name: 'ComponentName',
  mixins: [PageContainer, DefaultMounted, DeletePopover],
  data() {
    return {
      columns: [
        {
          name: 'desc',           // уникальный ид столбца
          required: true,         // обязательный
          label: 'Имя',  // заголовок столбца
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
          name: 'role',
          required: true,
          label: 'Роль',
          align: 'left',
          field: row => row.role.name,
          rowFieldName: 'role',    // для ссылочных полей указывает на имя поля в строке
          sortable: true,
          classes: 'as-select',
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
          // label: 'Действия',
          align: 'right',
          field: 'rowActions',
          required: true,
          style: 'width: 64px',
        },
      ],
      visibleColumns: ['desc', 'enabled', 'role', 'email', 'createdAt', 'updatedAt', 'rowActions'],
      pagination: {
        rowsPerPage: 8,
      },
      filter: '',         // фильтр таблицы
      addFormFields: {    // поля формы добавления документа
        name: null,
        enabled: true,
        role: null,
        email: '123@456.com',
      },
    };
  },

  // правила валидации
  validations: {
    addFormFields: {
      name: { required, minLength: minLength(2) },
      email: { required, email },
    },
  },

  computed: {
    ...mapState({
      ds: state => state.ds.dsUsers,        // источник данных
      dsRoles: state => state.ds.dsRoles,        // источник данных Роли
      isLoading: state => state.ds.isLoading,
      abilityDS: state => state.ds.ability,
    }),
    ...mapGetters({
      getErrorDescription: 'appMode/getErrorDescription',
      getEnabledRoles: 'ds/getEnabledRoles',
    }),
  },

  methods: {
    ...mapMutations({
      addErrorNotification: 'appMode/addErrorNotification',
      setLoading: 'ds/setLoading',
      // updateDsCustomers: 'ds/updateDsCustomers',
    }),

    ...mapActions({
      getDocuments: 'ds/getUsers',
      addDocument: 'ds/addCustomer',
      deleteDocument: 'ds/deleteUser',
      updateDocument: 'ds/updateUser',
      getRoles: 'ds/getRoles',
    }),

  },

  mounted() {
    if (this.dsRoles.length === 0) {
      this.setLoading(true);
      this.getRoles().then()
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
    }
  },
};
</script>

<style>
</style>
