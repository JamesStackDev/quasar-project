<template>
  <q-layout view="lHh Lpr lFf">
    <q-header class="bg-orange-500 p-6" elevated>
      <q-toolbar>

        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleDrawer" />

        <q-toolbar-title> Tarefa Fakes </q-toolbar-title>

        <q-btn @click="handleLogout"  class="bg-red-500">Logout</q-btn>

      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" :mini="miniState" show-if-above bordered>
      <q-list>
        <q-item-label header> Tasks Acess </q-item-label>

        <EssentialLink v-for="link in linksList" :key="link.label" v-bind="link" />
      </q-list>

    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import EssentialLink, { type EssentialLinkProps } from '@/components/EssentialLink.vue';
import { useQuasar } from 'quasar';
import { logout } from '@/services/AuthService';
import { useRouter } from 'vue-router';

const $q = useQuasar();
const miniState = ref(true)
const leftDrawerOpen = ref(false);
const router = useRouter();

async function handleLogout() {
  logout()
  await router.push('/login')
}

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
    label: 'Dashboard',
    caption: 'Statistic Tasks',
    icon: 'dashboard',
    link: '/dashboard',
  },
];



</script>
