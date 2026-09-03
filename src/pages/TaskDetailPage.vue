<template>
  <q-page class="p-4">
    <q-btn flat icon="arrow_back" label="Back" @click="router.back()" class="mb-4" />

    <q-card class="p-6" v-if="task">
      <div class="text-h5 font-bold mb-2">{{ task.title }}</div>
      <div class="text-caption text-grey mb-4">Term: {{ task.term }}</div>

      <p class="text-body1 mb-4">{{ translatedDescription }}</p>

      <div class="text-caption text-grey mt-4 mb-1">Code:</div>
      <div class="bg-grey-9 text-white p-4 rounded font-mono text-sm overflow-x-auto">
        <pre style="white-space: pre-wrap; word-break: break-word;"><code v-html="highlightedCode"></code></pre>
      </div>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getTask } from '@/services/TaskService'
import type { Task } from '@/types/interfaces/Tasks'
import hljs from 'highlight.js'
import { useI18n } from 'vue-i18n'
import { detectLanguage } from '@/services/LanguageService'
import { translateText } from '@/services/TranslationService'

const route = useRoute()
const router = useRouter()
const task = ref<Task | null>(null)
const { locale } = useI18n()
const translatedDescription = ref('')

async function updateTranslation() {
  if (!task.value) return
  const sourceLang = detectLanguage(task.value.description)
  const targetLang = locale.value.slice(0, 2)
  translatedDescription.value = await translateText(task.value.description, sourceLang, targetLang)
}

watch(locale, updateTranslation)

onMounted(async () => {
  const id = String(route.params.id)
  task.value = await getTask(id)
  translatedDescription.value = task.value.description
  await updateTranslation()
})

const highlightedCode = computed(() => hljs.highlightAuto(task.value?.code ?? '').value)
</script>