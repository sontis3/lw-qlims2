<template>
  <q-layout view="hHh Lpr fFf">
    <q-header elevated class="glossy">
      <q-toolbar class="bg-secondary">
        <q-btn flat dense round @click="leftDrawerOpen = !leftDrawerOpen" aria-label="Menu">
          <q-icon name="menu"/>
        </q-btn>
        <q-toolbar-title>My App</q-toolbar-title>
        <!-- кнопки в незарегистрированном состоянии -->
        <q-btn-group v-if="userData === null">
          <q-btn push @click="showRegistrationDialog=true" label="Зарегистрироваться" icon="person_add"/>
          <q-btn push @click="showLoginDialog=true" label="Войти" icon="person"/>
        </q-btn-group>
        <!-- зарегистрирован -->
        <q-btn-group v-else>
          <q-btn-dropdown split :label="userData.name" icon="person">
            <q-list>
              <q-item clickable v-close-popup @click="showLogoutDialog=true">
                <q-item-section>
                  <q-item-label>Выход</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>
        </q-btn-group>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" content-class="bg-grey-4" :width="200">
      <q-tree
        :nodes="actionsTreeData"
        node-key="id"
        :selected.sync="selectedNode"
        :expanded.sync="expandedNodes"
        selected-color="secondary"
        @update:selected="actionNodeSelected"
        ref="actionsTree"
      ></q-tree>
    </q-drawer>

    <q-page-container>
      <router-view/>
    </q-page-container>

    <!-- настройка футера -->
    <q-footer class="bg-grey-8 text-white">
      <div class="row">
        <div class="col-11">Running on Quasar v {{ $q.version }}</div>
        <!-- уведомление об ошибках -->
        <div class="col-auto">
          <q-btn id="error-notification-btn" icon="cancel" dense size="sm" :style="styleObject">
            {{errorNotifications.length}}
            <q-tooltip :delay="1000">Ошибок: {{errorNotifications.length}}</q-tooltip>
            <q-menu anchor="top left" self="bottom left">
              <q-list separator link dense v-if="errorNotifications.length != 0">
                <q-expansion-item
                  v-for="(item, index) in errorNotifications"
                  :key="index"
                  expand-separator
                  dense
                  :header-style="styleObject2"
                  default-opened
                  expand-icon-toggle
                >
                  <template v-slot:header>
                    <q-item-section avatar>
                      <q-icon color="red" name="error"/>
                    </q-item-section>
                    <q-item-section lines="1">{{item.dateTime.toLocaleString()}}::{{item.message}}</q-item-section>
                    <q-item-section side>
                      <q-btn flat dense icon="clear" @click="deleteErrorNotification(index)"/>
                    </q-item-section>
                  </template>
                  <div>{{item.descr}}</div>
                </q-expansion-item>
              </q-list>
            </q-menu>
          </q-btn>
        </div>
      </div>
    </q-footer>

    <!-- Диалог выхода -->
    <q-dialog v-model="showLogoutDialog" no-backdrop-dismiss>
      <q-card>
        <q-card-section>
          <div class="text-h6">Вы хотите выйти из аккаунта?</div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Выйти" @click="onLogout" v-close-popup/>
          <q-btn flat label="Отмена" v-close-popup/>
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Диалог регистрации пользователя -->
    <q-dialog v-model="showRegistrationDialog" no-backdrop-dismiss>
      <q-card>
        <q-card-section>
          <div class="text-h6">Регистрация</div>
        </q-card-section>
        <q-card-section>
          <div class="row q-mb-md">
            <q-input
              v-model="regFormFields.name"
              autofocus
              label="Имя пользователя"
              :error="$v.regFormFields.name.$error"
            >
              <template v-slot:error>Введите имя пользователя длиной не менее 3-х сиволов.</template>
            </q-input>
          </div>
          <div class="row q-mb-md">
            <q-input
              v-model="regFormFields.email"
              :error="$v.regFormFields.email.$error"
              label="Электронная почта"
              bottom-slots
            >
              <template v-slot:before>
                <q-icon name="mail"/>
              </template>
              <template v-slot:error>Ошибка формата адреса эл. почты.</template>
            </q-input>
          </div>
          <div class="row q-mb-md">
            <q-input
              v-model="regFormFields.password"
              label="Пароль"
              :error="$v.regFormFields.password.$error"
            >
              <template v-slot:error>Длина пароля должна быть не менее 6 символов.</template>
            </q-input>
          </div>
          <div class="row q-mb-md">
            <q-input
              v-model="regFormFields.repeatPassword"
              label="Подтвердите пароль"
              :error="$v.regFormFields.repeatPassword.$error"
            >
              <template v-slot:error>Пароли должны быть идентичны.</template>
            </q-input>
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn
            flat
            label="Зарегистрироваться"
            @click="closeRegForm($v.regFormFields)"
            v-close-popup="regFormValid"
          />
          <q-btn flat label="Отмена" v-close-popup/>
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Диалог входа в систему -->
    <q-dialog v-model="showLoginDialog" no-backdrop-dismiss>
      <q-card>
        <q-card-section>
          <div class="text-h6">Войти</div>
        </q-card-section>
        <q-card-section>
          <div class="row q-mb-md">
            <q-input
              v-model="loginFormFields.name"
              autofocus
              label="Имя пользователя"
              :error="$v.loginFormFields.name.$error"
            >
              <template v-slot:error>Введите имя пользователя длиной не менее 3-х сиволов.</template>
            </q-input>
          </div>
          <div class="row q-mb-md">
            <q-input
              v-model="loginFormFields.password"
              label="Пароль"
              :error="$v.loginFormFields.password.$error"
            >
              <template v-slot:error>Длина пароля должна быть не менее 6 символов.</template>
            </q-input>
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Войти" @click="closeLoginForm($v.loginFormFields)" v-close-popup="loginFormValid"/>
          <q-btn flat label="Отмена" v-close-popup/>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-layout>
</template>

<script>
import { openURL } from 'quasar';
import {
  mapState,
  mapMutations,
  mapGetters,
  mapActions,
} from 'vuex';
import {
  required,
  minLength,
  maxLength,
  // between,
  email,
  sameAs,
} from 'vuelidate/lib/validators';

export default {
  name: 'MyLayout',
  data() {
    return {
      leftDrawerOpen: this.$q.platform.is.desktop,
      selectedNode: '', // выбранный узел дерева акций
      expandedNodes: ['Directory'],
      showLogoutDialog: false,      // флаг показа диалога выхода
      showRegistrationDialog: false,      // флаг показа диалога выхода
      showLoginDialog: false,      // флаг показа диалога выхода

      regFormValid: true,   // форма регистрации валидна?
      regFormFields: {    // поля формы регистрации
        name: null,
        email: null,
        password: null,
        repeatPassword: null,
      },
      loginFormValid: true,   // форма логина валидна?
      loginFormFields: {    // поля формы логина
        name: null,
        password: null,
      },
    };
  },

  // правила валидации
  validations: {
    regFormFields: {
      name: { required, minLength: minLength(3), maxLength: maxLength(24) },
      email: { required, email },
      password: { required, minLength: minLength(6), maxLength: maxLength(16) },
      repeatPassword: { sameAsPassword: sameAs('password') },
    },
    loginFormFields: {
      name: { required, minLength: minLength(3), maxLength: maxLength(24) },
      password: { required, minLength: minLength(6), maxLength: maxLength(16) },
    },
  },

  computed: {
    ...mapState({
      currentMode: state => state.appMode.currentMode,
      errorNotifications: state => state.appMode.errorNotifications,
      selectedActionId: state => state.appMode.selectedActionId,
      userData: state => state.ds.userData,
      abilityDS: state => state.ds.ability,
    }),
    ...mapGetters({
      currentActionsList: 'appMode/currentActionsList',
      currentAction: 'appMode/currentAction',
      actionsTreeData: 'appMode/getActionsTreeData',
      getErrorDescription: 'appMode/getErrorDescription',
    }),

    // объект для настройки стиля елемента уведомления об ошибках
    styleObject() {
      return {
        color: this.errorNotifications.length ? 'red' : '',
        animation: this.errorNotifications.length ? 'blinker 2s linear infinite' : '',
      };
    },
    // объект для настройки стиля сообщений об ошибках
    styleObject2() {
      return {
        opacity: 0.6,
        'font-weight': 'bold',
      };
    },
  },

  methods: {
    openURL,

    ...mapMutations({
      changeSelectedAction: 'appMode/changeSelectedAction',
      addErrorNotification: 'appMode/addErrorNotification',
      deleteErrorNotification: 'appMode/deleteErrorNotification',
      logout: 'ds/logout',
      cleanOutDs: 'ds/cleanOutDs',
      setAbility: 'ds/setAbility',
    }),

    ...mapActions({
      userRegistration: 'ds/userRegistration',
      userLogin: 'ds/userLogin',
    }),

    // выбрана акция в дереве
    actionNodeSelected(target) {
      this.changeSelectedAction(target);
      this.$router.push({ name: this.selectedActionId });
      console.log(target);
    },

    // валидация формы
    isFormValid(validModel) {
      validModel.$touch();
      if (validModel.$error) {
        return false;
      }
      return true;
    },

    // выход пользователя
    onLogout() {
      this.cleanOutDs();
      this.logout();
    },

    // закрытие формы регистрации
    closeRegForm(validModel) {
      if (!this.isFormValid(validModel)) {
        this.regFormValid = false;
        return;
      }
      this.regFormValid = true;

      const res = this.userRegistration(this.regFormFields);
      res.then((response) => {
        this.$q.notify({
          color: 'positive',
          position: 'top',
          message: `Пользователь '${response.data.name}' зарегистрирован.`,
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
        })
        .finally(() => {
          this.regFormFields = {    // поля формы регистрации
            name: null,
            email: null,
            password: null,
            repeatPassword: null,
          };
          this.regFormValid = true;
        });
    },

    // закрытие формы логина
    closeLoginForm(validModel) {
      if (!this.isFormValid(validModel)) {
        this.loginFormValid = false;
        return;
      }
      this.loginFormValid = true;

      const res = this.userLogin(this.loginFormFields);
      res.then((response) => {
        this.$q.notify({
          color: 'positive',
          position: 'top',
          message: `Пользователь '${response.data.name}' выполнил вход в систему.`,
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
        })
        .finally(() => {
          this.loginFormFields = {    // поля формы регистрации
            name: null,
            password: null,
          };
          this.loginFormValid = true;
        });
    },
  },

  mounted() {
    this.selectedNode = this.selectedActionId;
    // this.$refs.actionsTree.setExpanded(this.selectedNode, 'true');
    this.$router.push({ name: this.selectedActionId });
  },
};
</script>

<style>
/* установка ключевых кадров анимации элемента */
@keyframes blinker {
  50% {
    opacity: 0;
  }
}
</style>
