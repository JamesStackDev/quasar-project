<template>
  <q-layout view="lHh Lpr lFf">

    <MainHeader @toggle-drawer="toggleDrawer" />
    <q-drawer v-model="leftDrawerOpen" :mini="miniState" show-if-above bordered>
      <q-list>
        <q-item-label header> Tasks Acess </q-item-label>

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

const $q = useQuasar();
const miniState = ref(true)
const leftDrawerOpen = ref(false);


function toggleDrawer() {
  if ($q.screen.gt.xs) {
    miniState.value = !miniState.value
  } else {
    leftDrawerOpen.value = !leftDrawerOpen.value
  }
}


const linksList: EssentialLinkProps[] = [
  {
    label: 'Home',
    caption: 'Home to page',
    icon: 'house',
    link: '/'
  },
  {
    label: 'Tasks',
    caption: 'To make tasks',
    icon: 'checklist',
    link: '/tasks',
  },
  {
    label: 'All Tasks',
    caption: 'To view all tasks',
    icon: 'task',
    link: '/all-tasks',
  },
];



</script>
