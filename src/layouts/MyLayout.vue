<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated class="glossy">
      <q-toolbar>
        <q-btn flat dense round @click="leftDrawerOpen = !leftDrawerOpen" aria-label="Menu">
          <q-icon name="menu"/>
        </q-btn>

        <q-toolbar-title>Quasar App</q-toolbar-title>

        <div>Quasar v{{ $q.version }}</div>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" bordered content-class="bg-grey-2">
      <q-list>
        <q-item-label header>Essential Links</q-item-label>
        <q-item clickable tag="a" target="_blank" href="http://v1.quasar-framework.org">
          <q-item-section avatar>
            <q-icon name="school"/>
          </q-item-section>
          <q-item-section>
            <q-item-label>Docs</q-item-label>
            <q-item-label caption>v1.quasar-framework.org</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable tag="a" target="_blank" href="https://github.com/quasarframework/">
          <q-item-section avatar>
            <q-icon name="code"/>
          </q-item-section>
          <q-item-section>
            <q-item-label>Github</q-item-label>
            <q-item-label caption>github.com/quasarframework</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable tag="a" target="_blank" href="http://chat.quasar-framework.org">
          <q-item-section avatar>
            <q-icon name="chat"/>
          </q-item-section>
          <q-item-section>
            <q-item-label>Discord Chat Channel</q-item-label>
            <q-item-label caption>chat.quasar-framework.org</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable tag="a" target="_blank" href="https://forum.quasar-framework.org">
          <q-item-section avatar>
            <q-icon name="record_voice_over"/>
          </q-item-section>
          <q-item-section>
            <q-item-label>Forum</q-item-label>
            <q-item-label caption>forum.quasar-framework.org</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable tag="a" target="_blank" href="https://twitter.com/quasarframework">
          <q-item-section avatar>
            <q-icon name="rss_feed"/>
          </q-item-section>
          <q-item-section>
            <q-item-label>Twitter</q-item-label>
            <q-item-label caption>@quasarframework</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
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
                      <q-btn flat dense icon="clear" @click="onDeleteNotification(index)"/>
                    </q-item-section>
                  </template>
                  <div>{{item.status}}</div>
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
import { mapState, mapGetters } from 'vuex';

export default {
  name: 'MyLayout',
  data() {
    return {
      leftDrawerOpen: this.$q.platform.is.desktop,
    };
  },

  computed: {
    ...mapState({
      currentMode: state => state.appMode.currentMode,
      errorNotifications: state => state.appMode.errorNotifications,
    }),
    ...mapGetters({
      currentActionsList: 'appMode/currentActionsList',
      currentAction: 'appMode/currentAction',
    }),
    // объект для настройки стиля елемента уведомления об ошибках
    styleObject() {
      return {
        color: this.errorNotifications.length ? 'red' : '',
        animation: this.errorNotifications.length ? 'blinker 2s linear infinite' : '',
      };
    },
    // объект для настройки стиля сщщбщений об ошибках
    styleObject2() {
      return {
        opacity: 0.6,
        'font-weight': 'bold',
      };
    },
  },

  methods: {
    openURL,
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
