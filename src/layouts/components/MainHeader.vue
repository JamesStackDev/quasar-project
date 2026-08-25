<template>
    <q-header class="bg-orange 500 p-2" elevated>
        <q-toolbar>
            <q-btn flat dense round icon="menu" aria-label="Menu" @click="emit('toggle-drawer')" />
            <q-toolbar-title>Tasks False</q-toolbar-title>
            <q-btn round  flat>
                <q-avatar  text-color="white" icon="account_circle" />
                <span class="ml-2">{{  user?.name }}</span>

                <q-menu>
                    <q-list>
                        <q-item clickable v-close-popup @click="handleLogout" >
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
import { useRouter } from 'vue-router';


const user = getUser();
const router = useRouter();

const emit = defineEmits<{ (e: 'toggle-drawer'): void}>()

async function handleLogout() {
    logout()
    await router.push('/login')
}


</script>