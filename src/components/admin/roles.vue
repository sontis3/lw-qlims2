<template>
  <q-page>
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
              <q-btn class="text-grey-8 q-gutter-x-xs" flat dense round size="sm" icon="delete" @click.stop="changeActiveRole(index)">
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
      <div class="col-8">
        Second column
        <q-tab-panel name="111">panel22</q-tab-panel>
      </div>
      <div class="col">Third column</div>
    </div>
  </q-page>
</template>

<script>
import {
  mapState,
  mapGetters,
  mapMutations,
  mapActions,
} from 'vuex';

// import { PageContainer } from '../mixins/page-container';
import { DeletePopover } from '../mixins/delete-popover';

export default {
  mixins: [DeletePopover],

  data() {
    return {
      roleData: '',
      link: 0,
    };
  },

  computed: {
    ...mapState({
      dsRoles: state => state.ds.dsRoles,        // источник данных Роли
    }),
    ...mapGetters({
      getErrorDescription: 'appMode/getErrorDescription',
      //   getEnabledCountries: 'ds/getEnabledCountries',
    }),
  },

  methods: {
    ...mapMutations({
      addErrorNotification: 'appMode/addErrorNotification',
      setLoading: 'ds/setLoading',
      //   // updateDsCustomers: 'ds/updateDsCustomers',
    }),

    ...mapActions({
      // getDocuments: 'ds/getCustomers',
      // updateDocument: 'ds/updateCustomer',
      getRoles: 'ds/getRoles',
      addRole: 'ds/addRole',
      deleteRole: 'ds/deleteRole',
    }),

    // обработка события закрытия диалога создания нового документа
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

  mounted() {
    // если роли отсутствуют, то загружаем их
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

    // установка ширины всплывающего сообщения об удалении роли
    this.popoverStyle.minWidth = '400px';
  },
};
</script>

<style lang="stylus">
.my-menu-link {
  color: white;
  background: #F2C037;
}
</style>
