<template>
    <q-page class="flex items-center justify-center">
        <q-card style="width: 380px;">
            <q-card-section class="q-gutter-md">
                    <h1 class="font-bold justify-center text-3xl text-center">Tasks</h1>
                <q-form @submit="handleLogin">
                    <q-input v-model="email" label="Email" type="email" />
                    <q-input v-model="password" label="Password" type="password"/>
                    <q-btn type="submit" style="width: 350px;"   class="bg-orange-500 text-white mt-5">Entrar</q-btn>
                </q-form>
            </q-card-section>
        </q-card>
    </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { login } from '@/services/AuthService';
import { triggerSuccess, triggerNegative } from '@/utils/Notify';

const email = ref('');
const password = ref('');

const router = useRouter();

async function handleLogin() {
    try {
        await login(email.value, password.value)
        triggerSuccess('Login Sucessful')
        await router.push('/tasks')
    } catch (err) {
        const message = err instanceof Error ? err.message: 'Invalid credentials'
        triggerNegative(message)
    }
}
</script>