<template>
  <q-page class="p-4">
    <q-btn flat icon="arrow_back" label="Back" @click="router.back()" class="mb-4" />

    <q-card class="p-6" v-if="task">
      <div class="text-h5 font-bold mb-2">{{ task.title }}</div>
      <div class="text-caption text-grey mb-4">Term: {{ task.term }}</div>
      <p class="text-body1">{{ task.description }}</p>

      <div class="text-caption text-grey mt-4 mb-1">Example code block:</div>
      <div class="bg-grey-9 text-white p-4 rounded font-mono text-sm overflow-x-auto">
        <pre>{{ task.description }}</pre>
      </div>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getTask } from '@/services/TaskService'
import type { Task } from '@/types/interfaces/Tasks'

const route = useRoute()
const router = useRouter()
const task = ref<Task | null>(null)

onMounted(async () => {
  const id = String(route.params.id)
  task.value = await getTask(id)
})
</script>