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
                <!-- кнопка удалить Роль -->
                <q-btn outline dense size="sm" icon="delete"/>
              </q-btn-group>
            </q-item-section>
          </q-item>
          <q-item v-for="(item, index) in dsRoles" :key="index">
            <q-item-section>{{item.name}}</q-item-section>
          </q-item>
          <q-item
            clickable
            v-ripple
            :active="link === 'inbox'"
            @click="link = 'inbox'"
            active-class="my-menu-link"
          >
            <q-item-section>Role 1</q-item-section>
          </q-item>
          <q-item
            clickable
            :active="link === 'outbox'"
            @click="link = 'outbox'"
            active-class="my-menu-link"
          >
            <q-item-section>Role 2</q-item-section>
          </q-item>
          <q-item>
            <q-item-section>Role 3</q-item-section>
          </q-item>
        </q-list>
        <div class="col">row 1</div>
        <div class="col">row 2</div>
        <div class="col">row 3</div>
        <div class="self-end">row 4</div>
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

export default {
  data() {
    return {
      roleData: '',
      link: 'inbox',
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
      // deleteDocument: 'ds/deleteCustomer',
      // updateDocument: 'ds/updateCustomer',
      getRoles: 'ds/getRoles',
      addRole: 'ds/addRole',
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

<style lang="stylus">
.my-menu-link {
  color: white;
  background: #F2C037;
}
</style>
