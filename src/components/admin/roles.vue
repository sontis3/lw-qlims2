<template>
  <q-page v-if="dataReady">
    <div class="row no-wrap" style="min-height: calc(100vh - 73px);">
      <!-- колонка ролей -->
      <div class="column col-2 full-height">
        <q-list dense bordered separator>
          <q-item dense>
            <q-item-section>
              <q-item-label>Роли</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-btn-group outline stretch spread>
                <!-- кнопка добавить Роль -->
                <q-btn-dropdown
                  outline
                  dense
                  size="sm"
                  icon="add"
                  @click="roleData={name:'',tag:'',}"
                >
                  <div class="col">
                    <q-input
                      v-model="roleData.name"
                      label="Наименование"
                      dense
                      clearable
                      autofocus
                    />
                    <q-input v-model="roleData.tag" label="Тег" dense clearable />
                    <q-btn
                      outline
                      dense
                      size="sm"
                      color="primary"
                      label="Add"
                      @click="onAddRole"
                      v-close-popup
                    />
                    <q-btn outline dense size="sm" color="primary" label="Cancel" v-close-popup />
                  </div>
                </q-btn-dropdown>
              </q-btn-group>
            </q-item-section>
          </q-item>
          <!-- список ролей -->
          <q-item
            v-for="(item, index) in dsRoles"
            :key="index"
            clickable
            v-ripple
            :active="link === index"
            active-class="my-menu-link"
            @click="changeActiveRole(index)"
          >
            <q-item-section>
              <q-item-label>{{item.name}}</q-item-label>
            <!-- </q-item-section> -->
            <!-- кнопка удалить Роль -->
            <!-- <q-item-section side> -->
              <q-btn
                class="text-grey-8 q-gutter-x-xs"
                flat
                dense
                round
                size="sm"
                icon="delete"
                @click.stop="changeActiveRole(index)"
              >
                <q-tooltip>Удаление роли</q-tooltip>
                <q-menu
                  anchor="bottom left"
                  self="top left"
                  :content-style="popoverStyle"
                  auto-close
                >
                  <span id="popover-title">Роль выбрана для удаления</span>
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
                      @click="onDeleteRole(item)"
                    />
                  </div>
                </q-menu>
              </q-btn>
            </q-item-section>
          </q-item>
        </q-list>
      </div>
      <q-separator vertical class="self-stretch" />
      <!-- таблица разрешений системных объектов -->
      <div class="col-9">
        <q-table
          title="Разрешения"
          dense
          separator="cell"
          :columns="columns"
          :visibleColumns="visibleColumns"
          :data="dsRoles.length != 0 ? dsRoles[link].permissions : []"
          :pagination.sync="pagination"
        >
          <!-- слот панели кнопок вверху справа -->
          <template v-slot:top-right="props">
            <!-- кнопка добавления разрешений для объекта -->
            <q-btn flat round dense icon="add_box" @click="onShowDialogAddRule" />
          </template>

          <!-- слот тела таблицы -->
          <template v-slot:body="props">
            <q-tr :props="props">
              <q-td v-for="col in props.cols" :key="col.name" :props="props">
                <template v-if="col.classes === 'as-checkbox'" :props="props">
                  <q-checkbox
                    :value="props.row.viewActions[col.name]"
                    @input="(val) => onUpdatePermission(val, props.row, col)"
                  />
                </template>

                <template v-else-if="col.name === 'rowActions'" :props="props">
                  <q-btn round size="xs" icon="delete">
                    <q-tooltip>Удаление разрешения</q-tooltip>
                    <q-menu
                      anchor="bottom left"
                      self="top left"
                      :content-style="popoverStyle"
                      @show="showPopover"
                      auto-close
                    >
                      <span id="popover-title">Разрешение выбрано для удаления</span>
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
                          @click="onDeletePermission(props.row)"
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
      <!-- <q-separator vertical class="self-stretch" />
      <div class="col">Third column</div> -->
    </div>

    <!-- Диалог добавления правила -->
    <q-dialog v-model="showDialog" no-backdrop-dismiss>
      <q-card>
        <q-card-section>
          <div class="text-h6">Добавление нового правила</div>
        </q-card-section>
        <q-card-section>
          <div class="row q-mb-md">
            <q-select
              v-model="addPermissionsFormFields.system_objects"
              :options="getRoleNotUsedSystemObjects(link)"
              option-value="id"
              option-label="name"
              label="Системный объект"
              style="width: 240px"
              :error="$v.addPermissionsFormFields.system_objects.$error"
              filled
              dense
              options-dense
              multiple
              use-chips
              stack-label
            ></q-select>
          </div>
          <div class="row q-mb-md">
            <q-option-group
              v-model="addPermissionsFormFields.actionsGroup"
              :options="addPermissionsFormFields.actionsOptions"
              type="checkbox"
            />
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn
            flat
            label="Add"
            @click="validateAndClose"
            v-close-popup="addPermissionsFormValid"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import {
  mapState,
  mapGetters,
  mapMutations,
  mapActions,
} from 'vuex';
import { required } from 'vuelidate/lib/validators';

import { DeletePopover } from '../mixins/delete-popover';

export default {
  mixins: [DeletePopover],

  data() {
    return {
      dataReady: false,           // флаг готовности данных для показа
      roleData: {                 // поле для добавления роли
        name: '',
        tag: '',
      },
      link: 0,                    // индекс выбранной роли в списке

      columns: [],                // колонки таблицы разрешений
      visibleColumns: [],
      pagination: {
        rowsPerPage: 8,
      },
      showDialog: false,          // показать/скрыть диалог добавления
      addPermissionsFormFields: {        // поля формы добавления разрешений
        system_objects: null,     // массив системных объектов, для кот. добавляются разрешения
        actionsGroup: [],         // массив выбранных чекбоксов действий
        actionsOptions: [],       // весь массив чекбоксов действий
      },
      addPermissionsFormValid: true,    // форма добавления разрешений валидна?
    };
  },

  // правила валидации
  validations: {
    addPermissionsFormFields: {
      system_objects: { required },
    },
  },

  computed: {
    ...mapState({
      dsRoles: state => state.ds.dsRoles,        // источник данных Роли
      dsSystemObjectsActions: state => state.ds.dsSystemObjectsActions,   // источник данных Действия над системными объектами
      dsSystemObjects: state => state.ds.dsSystemObjects,   // источник данных Системные объекты
    }),
    ...mapGetters({
      getErrorDescription: 'appMode/getErrorDescription',
      getRoleNotUsedSystemObjects: 'ds/getRoleNotUsedSystemObjects',
    }),
  },

  methods: {
    ...mapMutations({
      addErrorNotification: 'appMode/addErrorNotification',
      setLoading: 'ds/setLoading',
      preparePermissionViewData: 'ds/preparePermissionViewData',
    }),

    ...mapActions({
      getRoles: 'ds/getRoles',
      addRole: 'ds/addRole',
      deleteRole: 'ds/deleteRole',
      getSystemObjectsActions: 'ds/getSystemObjectsActions',
      getSystemObjects: 'ds/getSystemObjects',
      addPermissions: 'ds/addPermissions',
      updatePermission: 'ds/updatePermission',
      deletePermission: 'ds/deletePermission',
    }),

    // валидация формы добавления разрешений роли
    validateAndClose() {
      this.$v.addPermissionsFormFields.$touch();
      if (this.$v.addPermissionsFormFields.$error) {
        this.addPermissionsFormValid = false;
        return;
      }
      this.addPermissionsFormValid = true;
      this.onAddPermissions();
    },

    // показать диалог добавления правила для роли
    onShowDialogAddRule() {
      this.addPermissionsFormFields.system_objects = null;
      this.addPermissionsFormFields.actionsGroup = [];
      this.showDialog = true;
    },

    // обработка события закрытия диалога добавления новых разрешений
    async onAddPermissions() {
      const permData = {
        roleId: this.dsRoles[this.link].id,
        system_objectIds: this.addPermissionsFormFields.system_objects.map(item => item.id),
        actionIds: this.addPermissionsFormFields.actionsGroup,
      };
      const res = this.addPermissions(permData);
      // eslint-disable-next-line no-unused-vars
      res.then((response) => {
        this.$q.notify({
          color: 'positive',
          position: 'top',
          message: 'Разрешения успешно созданы.',
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

    // изменить разрешение объекта
    async onUpdatePermission(val, row, col) {
      // найти акцию по имени
      const action = this.dsSystemObjectsActions.find(a => a.name === col.name);

      const permData = {
        roleId: this.dsRoles[this.link].id,
        // permissionId: row.id,
        system_objectId: row.system_object.id,
        actionId: action.id,
        granted: val,
      };

      const res = this.updatePermission(permData);
      res.then((response) => {
        this.$q.notify({
          color: 'positive',
          position: 'top',
          message: `Роль '${response.data.name}' успешно изменена. Объект [${row.system_object.name}]. Действие [${col.name}]`,
          icon: 'update',
        });
      })
        .catch((err) => {
          const errDescription = this.getErrorDescription('put', err);
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

    // изменить разрешение объекта
    async onDeletePermission(row) {
      const permData = {
        roleId: this.dsRoles[this.link].id,
        // permissionId: row.id,
        system_objectId: row.system_object.id,
      };

      const res = this.deletePermission(permData);
      res.then((response) => {
        this.$q.notify({
          color: 'positive',
          position: 'top',
          message: `Роль '${response.data.name}' успешно изменена. Удалены разрешения для объекта [${row.system_object.name}].`,
          icon: 'update',
        });
      })
        .catch((err) => {
          const errDescription = this.getErrorDescription('put', err);
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

    // обработка события закрытия диалога создания новой роли
    async onAddRole() {
      const res = this.addRole(this.roleData);
      res.then((response) => {
        this.$q.notify({
          color: 'positive',
          position: 'top',
          message: `Роль '${response.data.name}' успешно создана.`,
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

    // смена текущей роли
    async changeActiveRole(index) {
      this.link = index;
    },

    // смена текущей роли
    onDeleteRole(row) {
      this.link = 0;
      this.onDeleteDocument(row, 'name', this.deleteRole);
    },

  },

  async mounted() {
    // если действия над системными объектами отсутствуют, то загружаем их
    if (this.dsSystemObjectsActions.length === 0) {
      this.setLoading(true);
      await this.getSystemObjectsActions()
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

    // если системные объекты отсутствуют, то загружаем их
    if (this.dsSystemObjects.length === 0) {
      this.setLoading(true);
      await this.getSystemObjects()
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

    // загрузка ролей (обязательно перед этим заполнить dsSystemObjectsActions)
    this.setLoading(true);
    await this.getRoles()
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

    // установка ширины всплывающего сообщения об удалении роли
    this.popoverStyle.minWidth = '400px';

    // установка колонок таблицы
    this.columns = this.dsSystemObjectsActions.map(item => ({
      name: item.name,
      label: item.name,
      align: 'center',
      field: row => row.viewActions[item.name],
      sortable: true,
      sort: (a, b) => a - b,
      classes: 'as-checkbox',
    }));
    this.columns.unshift({
      name: 'system_object',
      label: 'Системный объект',
      align: 'center',
      field: row => row.system_object.name,
      sortable: true,         // сортируемый столбец
    });
    this.columns.push({
      name: 'rowActions',
      // label: 'Действия',
      align: 'right',
      field: 'rowActions',
      required: true,
      style: 'width: 60px',
    });

    // настройка показываемых колонок таблицы
    this.visibleColumns = this.dsSystemObjectsActions.map(item => item.name);
    this.visibleColumns.unshift('system_object');
    this.visibleColumns.push('rowActions');

    // настройка показываемых чекбоксов акций в форме добавления правил
    this.addPermissionsFormFields.actionsOptions = this.dsSystemObjectsActions.map(item => ({ label: item.name, value: item.id }));

    this.dataReady = true;
  },
};
</script>

<style lang="stylus">
.my-menu-link {
  color: white;
  background: #F2C037;
}
</style>
