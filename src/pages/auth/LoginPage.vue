<template>
  <q-page class="flex flex-center">
    <q-card style="width: 380px" class="p-2">
      <q-card-section>
        <div class="text-lg font-bold mb-4">Sign in</div>

        <q-form @submit="handleLogin" class="q-gutter-md">
          <q-input
            v-model="email"
            label="Email"
            type="email"
            :rules="[
              val => !!val || 'Email is required',
              val => /.+@.+\..+/.test(val) || 'Enter a valid email',
            ]"
          />

          <q-input
            v-model="password"
            label="Password"
            type="password"
            :rules="[val => !!val || 'Password is required']"
          />

          <q-btn
            type="submit"
            label="Entrar"
            color="primary"
            class="full-width"
            :loading="isSubmitting"
            :disable="isSubmitting"
          />
        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { login } from '@/services/AuthService'
import { triggerSuccess, triggerNegative } from '@/utils/Notify'

const email = ref('')
const password = ref('')
const isSubmitting = ref(false)
const router = useRouter()

async function handleLogin() {
  isSubmitting.value = true
  try {
    await login(email.value, password.value)
    triggerSuccess('Login successful!')
    await router.push('/tasks')
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Invalid credentials'
    triggerNegative(message)
  } finally {
    isSubmitting.value = false
  }
}
</script>