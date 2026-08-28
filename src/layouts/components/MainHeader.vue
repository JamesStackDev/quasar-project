<template>
    <q-header class="bg-orange-500 dark:bg-orange-800 p-2" elevated>
        <q-toolbar>
            <q-btn flat dense round icon="menu" aria-label="Menu" @click="emit('toggle-drawer')" />
            <q-toolbar-title class="flex-none">Tasks False</q-toolbar-title>

            <div class="flex flex-grow justify-center">
                <q-input v-model="searchTerm" dense outlined bg-color="white" class="w-full max-w-5xl"
                    placeholder="Search..." @keyup.enter="handleSearch">
                    <template #prepend>
                        <q-icon name="search" />
                    </template>
                </q-input>
            </div>

            <q-btn flat round :icon="$q.dark.isActive ? 'light_mode' : 'dark_mode'" @click="toggleDarkMode" />

            <q-btn round flat>
                <q-avatar text-color="white" icon="account_circle" />
                <span class="ml-2">{{ user?.name }}</span>

                <q-menu>
                    <q-list>
                        <q-item clickable v-close-popup @click="handleLogout">
                            <q-item-section>Logout</q-item-section>
                        </q-item>
                    </q-list>
                </q-menu>
            </q-btn>
        </q-toolbar>
    </q-header>
</template>

<script setup lang="ts">

import { getUser, logout } from '@/services/AuthService';
import { useQuasar } from 'quasar';
import { ref } from 'vue';
import { useRouter } from 'vue-router';



const user = getUser();
const searchTerm = ref('');
const router = useRouter();
const $q = useQuasar();

function toggleDarkMode() {
    $q.dark.toggle()
    document.documentElement.classList.toggle('dark', $q.dark.isActive)
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