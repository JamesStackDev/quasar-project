<template>
    <q-header class="bg-orange-500 dark:bg-orange-800 p-2" elevated>
        <q-toolbar class="px-2 sm:px-4">
            <q-btn flat dense round icon="menu" aria-label="Menu" @click="emit('toggle-drawer')" />
            <q-toolbar-title class="truncate min-w-0">Tasks False</q-toolbar-title>

            <div class="hidden sm:flex flex-grow justify-center">
                <q-input v-model="searchTerm" dense outlined bg-color="white" class="w-full max-w-5xl"
                    placeholder="Search..." @keyup.enter="handleSearch">
                    <template #prepend>
                        <q-icon name="search" />
                    </template>
                </q-input>
            </div>

            <q-btn v-if="!$q.screen.gt.xs" flat round icon="search" @click="mobileSearchOpen = true" />

            <q-btn round flat>
                <q-avatar text-color="white" icon="account_circle" />
                <span class="hidden sm:inline ml-2">{{ user?.name }}</span>

                <q-menu>
                    <q-list>
                        <q-item clickable v-close-popup @click="toggleDarkMode">
                            <q-item-section avatar>
                                <q-icon :name="$q.dark.isActive ? 'light_mode' : 'dark_mode'" />
                            </q-item-section>
                            <q-item-section>{{ $q.dark.isActive ? 'Light mode' : 'Dark mode' }}</q-item-section>
                        </q-item>
                        <q-item clickable v-close-popup @click="handleLogout">
                            <q-item-section>Logout</q-item-section>
                        </q-item>
                    </q-list>
                </q-menu>
            </q-btn>
        </q-toolbar>
        <q-dialog v-model="mobileSearchOpen" position="top">
            <q-card class="w-full p-2">
                <q-input v-model="searchTerm" autofocus dense outlined placeholder="Search..."
                    @keyup.enter="handleSearch">
                    <template #prepend><q-icon name="search" /></template>
                </q-input>
            </q-card>
        </q-dialog>
    </q-header>
</template>

<script setup lang="ts">

import { getUser, logout } from '@/services/AuthService';
import { useQuasar } from 'quasar';
import { ref } from 'vue';
import { useRouter } from 'vue-router';



const user = getUser();
const searchTerm = ref('');
const mobileSearchOpen = ref(false);
const router = useRouter();
const $q = useQuasar();

function toggleDarkMode() {
    $q.dark.toggle()

    localStorage.setItem(
        'darkMode',
        String($q.dark.isActive)
    )
}

async function handleSearch() {
    await router.push({ path: '/tasks', query: { q: searchTerm.value } })
}

const emit = defineEmits<{ (e: 'toggle-drawer'): void }>()

async function handleLogout() {
    logout()
    await router.push('/login')
}


</script>