<template>
  <q-page class="p-4">
    <q-btn flat icon="arrow_back" label="Back" @click="router.back()" class="mb-4" />

    <q-card class="p-6" v-if="task">
      <div class="text-h5 font-bold mb-2">{{ task.title }}</div>
      <div class="text-body1 mb-4">
        {{ displayedDescription }}
      </div>
      <div class="text-caption text-grey mb-4">Term: {{ task.term }}</div>

      <div v-if="!translation && needsTranslation" class="q-mt-md">
        <q-btn outline color="primary" label="Contribute translation" @click="goToTranslation" />
      </div>

      <div class="text-caption text-grey mt-4 mb-1">Code:</div>
      <div class="bg-grey-9 text-white p-4 rounded font-mono text-sm overflow-x-auto">
        <pre style="white-space: pre-wrap; word-break: break-word;"><code v-html="highlightedCode"></code></pre>
      </div>
    </q-card>

    <q-separator class="my-4" />

  </q-page>

</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getTask } from '@/services/TaskService'
import type { Translation } from '@/types/interfaces/Translation'
import type { Task } from '@/types/interfaces/Tasks'
import hljs from 'highlight.js'
import { useI18n } from 'vue-i18n'
import { getTranslationByLocale } from '@/services/TranslationSerivces'


const { locale } = useI18n()

const translation = ref<Translation | null>(null)


const route = useRoute()
const router = useRouter()
const task = ref<Task | null>(null)

const highlightedCode = computed(() => hljs.highlightAuto(task.value?.code ?? '').value)


const displayedDescription = computed(() => {
  if (translation.value) {
    return translation.value.text
  }

  return task.value?.description ?? ''
})

const needsTranslation = computed(() => {
  if (!task.value) {
    return false
  }

  return task.value.locale !== locale.value
})

async function loadTranslation() {
  if (!task.value) {
    return
  }

  translation.value = null

  if (needsTranslation.value) {
    translation.value = await getTranslationByLocale(
      task.value.id,
      locale.value
    )
  }
}

async function goToTranslation() {
  await router.push({
    name: 'translation',
    params: {
      taskId: task.value?.id
    }
  })

}

onMounted(async () => {
  const id = String(route.params.id)

  task.value = await getTask(id)

  console.log('Task locale:', task.value.locale)
  console.log('User locale:', locale.value)
  console.log('Needs translation:', needsTranslation.value)

  if (needsTranslation.value) {
    translation.value = await getTranslationByLocale(
      id,
      locale.value
    )

    console.log('Translation:', translation.value)
  }
  await loadTranslation()
})

watch(locale, async () => {
  await loadTranslation()
})



</script>
