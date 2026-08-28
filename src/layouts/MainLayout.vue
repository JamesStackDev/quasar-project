<template>
  <q-layout view="lHh Lpr lFf">

    <MainHeader @toggle-drawer="toggleDrawer" />
    <q-drawer v-model="leftDrawerOpen" :mini="miniState" show-if-above bordered>
      <q-list>
        <div class="flex items-center justify-between px-2">
          <q-item-label header>{{ $t('sidebar.title') }}</q-item-label>
          <q-btn-dropdown flat dense :label="locale.toUpperCase()">
            <q-list>
              <q-item clickable v-close-popup @click="locale = 'en-US'"><q-item-section>English</q-item-section></q-item>
              <q-item clickable v-close-popup
                @click="locale = 'pt-BR'"><q-item-section>Português</q-item-section></q-item>
              <q-item clickable v-close-popup @click="locale = 'es-ES'"><q-item-section>Español</q-item-section></q-item>
            </q-list>
          </q-btn-dropdown>
        </div>

        

        <EssentialLink v-for="link in linksList" :key="link.label" v-bind="link" />
      </q-list>

    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

    <MainFooter />
  </q-layout>

</template>

<script setup lang="ts">
import { ref } from 'vue';
import EssentialLink, { type EssentialLinkProps } from '@/components/EssentialLink.vue';
import { useQuasar } from 'quasar';
import MainHeader from './components/MainHeader.vue';
import MainFooter from './components/MainFooter.vue';
import { useI18n } from 'vue-i18n';

const $q = useQuasar();
const miniState = ref(true)
const leftDrawerOpen = ref(false);
const { locale } = useI18n();

function toggleDrawer() {
  if ($q.screen.gt.xs) {
    miniState.value = !miniState.value
  } else {
    leftDrawerOpen.value = !leftDrawerOpen.value
  }
}


const linksList: EssentialLinkProps[] = [
  {
    label: 'sidebar.home',
    caption: 'sidebar.homeCaption',
    icon: 'house',
    link: '/',
  },
  {
    label: 'sidebar.tasks',
    caption: 'sidebar.tasksCaption',
    icon: 'checklist',
    link: '/tasks',
  },
  {
    label: 'sidebar.allTasks',
    caption: 'sidebar.allTasksCaption',
    icon: 'task',
    link: '/all-tasks',
  },
];


</script>
