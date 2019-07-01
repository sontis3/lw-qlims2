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
                <q-btn-dropdown outline dense size="sm" icon="add" @click="roleData = ''">
                  <div class="row">
                    <q-input v-model="roleData" dense clearable autofocus/>
                    <q-btn
                      outline
                      dense
                      size="sm"
                      color="primary"
                      label="Add"
                      @click="onAddRole"
                      v-close-popup
                    />
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
            @click="link = index"
          >
            <q-item-section>
              <q-item-label>{{item.name}}</q-item-label>
            </q-item-section>
            <!-- кнопка удалить Роль -->
            <q-item-section side>
              <q-btn
                class="text-grey-8 q-gutter-x-xs"
                flat
                dense
                round
                size="sm"
                icon="delete"
                @click.stop="changeActiveRole(index)"
              >
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
      <q-separator vertical class="self-stretch"/>
      <!-- таблица правил системных объектов -->
      <div class="col-8">
        <q-table
          title="Разрешения"
          dense
          separator="cell"
          :columns="columns"
          :visibleColumns="visibleColumns"
          :data="dsRolePermissions"
        >
          <!-- слот панели кнопок вверху справа -->
          <template v-slot:top-right="props">
            <!-- кнопка добавления правил для объекта -->
            <q-btn flat round dense icon="add_box" @click="onShowDialogAddRule"/>
          </template>

          <!-- слот тела таблицы -->
          <template v-slot:body="props">
            <q-tr :props="props">
              <q-td v-for="col in props.cols" :key="col.name" :props="props">
                <template v-if="col.classes === 'as-checkbox'" :props="props">
                  <q-checkbox
                    :value="props.row.viewActions[col.name]"
                    @input="(val) => onUpdateDocument(val, props.row, col, 'name')"
                  />
                </template>

                <template v-else>{{ col.value }}</template>
              </q-td>
            </q-tr>
          </template>
        </q-table>
      </div>
      <q-separator vertical class="self-stretch"/>
      <div class="col">Third column</div>
    </div>

    <!-- Диалог добавления правила -->
    <q-dialog v-model="showDialog" no-backdrop-dismiss>
      <q-card>
        <q-card-section>
          <div class="text-h6">Добавление нового правила</div>
        </q-card-section>
        <q-card-section>
          <!-- <div class="row q-mb-md">
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
          </div>-->
          <div class="row q-mb-md">
            <q-select
              v-model="addRuleFormFields.system_objects"
              :options="getRoleNotUsedSystemObjects"
              option-value="id"
              option-label="name"
              label="Системный объект"
              style="width: 240px"
              :error="$v.addRuleFormFields.system_objects.$error"
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
              v-model="addRuleFormFields.actionsGroup"
              :options="addRuleFormFields.actionsOptions"
              type="checkbox"
            />
          </div>
          <!-- <div class="row q-mb-md">
            <q-input
              v-model="addFormFields.phone_1"
              :error="$v.addFormFields.phone_1.$error"
              label="Телефон 1"
              type="tel"
              bottom-slots
            >
              <template v-slot:before>
                <q-icon name="phone"/>
              </template>
              <template v-slot:error>Ошибка формата номера телефона.</template>
            </q-input>
          </div>-->
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" v-close-popup/>
          <q-btn flat label="Add" @click="validateAndClose" v-close-popup="addRuleFormValid"/>
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

// import { PageContainer } from '../mixins/page-container';
import { DeletePopover } from '../mixins/delete-popover';

export default {
  mixins: [DeletePopover],

  data() {
    return {
      dataReady: false,           // флаг готовности данных для показа
      roleData: '',               // поле для добавления роли
      link: 0,                    // индекс выбранной роли в списке

      columns: [],                // колонки таблицы правил
      visibleColumns: [],
      showDialog: false,          // показать/скрыть диалог добавления
      addRuleFormFields: {        // поля формы добавления правила
        system_objects: null,     // массив системных объектов, для кот. добавляются правила
        actionsGroup: [],         // массив выбранных чекбоксов действий
        actionsOptions: [],       // весь массив чекбоксов действий
      },
      addRuleFormValid: true,    // форма добавления правил валидна?
    };
  },

  // правила валидации
  validations: {
    addRuleFormFields: {
      system_objects: { required },
    },
  },

  computed: {
    ...mapState({
      dsRoles: state => state.ds.dsRoles,        // источник данных Роли
      dsSystemObjectsActions: state => state.ds.dsSystemObjectsActions,   // источник данных Действия над системными объектами
      dsSystemObjects: state => state.ds.dsSystemObjects,   // источник данных Системные объекты
      dsRolePermissions: state => state.ds.dsRolePermissions,        // источник данных Правила Ролей
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
      getRules: 'ds/getRules',
      addRules: 'ds/addRules',
    }),

    // валидация формы добавления правил роли
    validateAndClose() {
      this.$v.addRuleFormFields.$touch();
      if (this.$v.addRuleFormFields.$error) {
        this.addRuleFormValid = false;
        return;
      }
      this.addRuleFormValid = true;
      this.onAddRule();
    },

    // показать диалог добавления правила для роли
    onShowDialogAddRule() {
      this.addRuleFormFields.system_objects = null;
      this.addRuleFormFields.actionsGroup = [];
      this.showDialog = true;
    },

    // обработка события закрытия диалога добавления новых правил
    async onAddRule() {
      const payload = {
        roleId: this.dsRoles[this.link].id,
        system_objectIds: this.addRuleFormFields.system_objects.map(item => item.id),
        actionIds: this.addRuleFormFields.actionsGroup,
      };
      const res = this.addRules(payload);
      res.then((response) => {
        this.$q.notify({
          color: 'positive',
          position: 'top',
          message: `Правила '${response.data}' успешно созданы.`,
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

    onUpdateDocument(val, row, col, fieldName) {
      debugger;
      console.log(val);
      console.log(row);
      console.log(col);
      return fieldName;
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
    changeActiveRole(index) {
      this.link = index;
    },

    // смена текущей роли
    onDeleteRole(row) {
      this.link = 0;
      this.onDeleteDocument(row, 'name', this.deleteRole);
    },

  },

  async mounted() {
    // если роли отсутствуют, то загружаем их
    if (this.dsRoles.length === 0) {
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
    }

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


    // загрузка правил роли
    this.setLoading(true);
    await this.getRules(this.dsRoles[this.link].id)
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

    // создание массива данных для показа действий над объектами
    // this.dsRolePermissions.forEach((element) => {
    //   element.boolActions = [];
    // });
    this.preparePermissionViewData(this.dsSystemObjectsActions.map(item => item.name));

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

    // настройка показываемых колонок таблицы
    this.visibleColumns = this.dsSystemObjectsActions.map(item => item.name);
    this.visibleColumns.unshift('system_object');

    // настройка показываемых чекбоксов акций в форме добавления правил
    this.addRuleFormFields.actionsOptions = this.dsSystemObjectsActions.map(item => ({ label: item.name, value: item.id }));

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
