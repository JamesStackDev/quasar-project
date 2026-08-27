<template>
  <q-page class="p-4">
    <q-btn flat icon="arrow_back" label="Back" @click="router.back()" class="mb-4" />

    <q-card class="p-6" v-if="task">
      <div class="text-h5 font-bold mb-2">{{ task.title }}</div>
      <div class="text-caption text-grey mb-4">Term: {{ task.term }}</div>

      <div class="text-caption text-grey mt-4 mb-1">Example code block:</div>
      <div class="bg-grey-9 text-white p-4 rounded font-mono text-sm overflow-x-auto">
        <pre style="white-space: pre-wrap; word-break: break-word;"><code v-html="highlightedCode"></code></pre>
      </div>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getTask } from '@/services/TaskService'
import type { Task } from '@/types/interfaces/Tasks'
import hljs from 'highlight.js'

const route = useRoute()
const router = useRouter()
const task = ref<Task | null>(null)


const highlightedCode = computed(() => hljs.highlightAuto(task.value?.description ?? '').value)  

onMounted(async () => {
  const id = String(route.params.id)
  task.value = await getTask(id)
})
</script>