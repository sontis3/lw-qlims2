<template>
  <q-layout view="hHh Lpr fFf">
    <q-header elevated class="glossy">
      <q-toolbar class="bg-secondary">
        <q-btn flat dense round @click="leftDrawerOpen = !leftDrawerOpen" aria-label="Menu">
          <q-icon name="menu"/>
        </q-btn>
        <q-toolbar-title>My App</q-toolbar-title>
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
  </q-layout>
</template>

<script>
import { openURL } from 'quasar';
import { mapState, mapMutations, mapGetters } from 'vuex';

export default {
  name: 'MyLayout',
  data() {
    return {
      leftDrawerOpen: this.$q.platform.is.desktop,
      selectedNode: '', // выбранный узел дерева акций
      expandedNodes: ['Directory'],
    };
  },

  computed: {
    ...mapState({
      currentMode: state => state.appMode.currentMode,
      errorNotifications: state => state.appMode.errorNotifications,
      selectedActionId: state => state.appMode.selectedActionId,
    }),
    ...mapGetters({
      currentActionsList: 'appMode/currentActionsList',
      currentAction: 'appMode/currentAction',
      actionsTreeData: 'appMode/getActionsTreeData',
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
      deleteErrorNotification: 'appMode/deleteErrorNotification',
    }),

    // выбрана акция в дереве
    actionNodeSelected(target) {
      this.changeSelectedAction(target);
      this.$router.push({ name: this.selectedActionId });
      console.log(target);
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
