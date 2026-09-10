<template>
  <q-page class="p-4">
    <q-btn flat icon="arrow_back" label="Back" @click="router.back()" class="mb-4" />

    <q-card class="p-6" v-if="task">

      <q-btn outline color="primary" label="Translations" @click="openTranslations" />

      <div class="text-h5 font-bold mb-2">{{ task.title }}</div>
      <div class="text-body1 mb-4">
        {{ displayedDescription }}
      </div>
      <div class="text-caption text-grey mb-4">Term: {{ task.term }}</div>

      <div v-if="translation && needsTranslation" class="q-mt-md">
        <q-btn outline color="primary" label="Contribute translation" @click="goToTranslation" />
      </div>

      <div class="text-caption text-grey mt-4 mb-1">Code:</div>
      <div class="bg-grey-9 text-white p-4 rounded font-mono text-sm overflow-x-auto">
        <pre style="white-space: pre-wrap; word-break: break-word;"><code v-html="highlightedCode"></code></pre>
      </div>
    </q-card>

    <q-separator class="my-4" />

  </q-page>

  <q-dialog v-model="translationDialog">
    <q-card style="min-width: 450px; max-width: 700px; width: 90vw">

      <q-card-section>
        <div class="text-h6">
          Community translations
        </div>

        <div class="text-caption text-grey">
          Choose the translation you want to use.
        </div>
      </q-card-section>

      <q-separator />

      <q-card-section>

        <q-card v-for="item in translations" :key="item.id" bordered class="q-mb-md">

          <q-card-section>

            <div class="text-caption text-primary q-mb-sm">
              {{ item.locale }}
            </div>

            <div class="text-body1 q-mb-md">
              {{ item.text }}
            </div>

            <div class="text-caption text-grey">
              Translated by:
              {{ authors[item.authorId] ?? 'Loading...' }}
            </div>

          </q-card-section>

          <q-card-actions>

            <q-btn outline color="primary" label="Use this translation" @click="selectTranslation(item)" />

            <q-btn v-if="item.authorId === currentUserId" flat color="primary" label="Edit"
              @click="editTranslation(item)" />

            <q-btn v-if="item.authorId === currentUserId" flat color="negative" label="Delete"
              @click="deleteTranslation(item)" />

          </q-card-actions>

        </q-card>

        <div v-if="translations.length === 0" class="text-grey text-center">
          No translations available for this language.
        </div>

      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Close" v-close-popup />
      </q-card-actions>

    </q-card>
  </q-dialog>

</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getTask } from '@/services/TaskService'
import type { Translation } from '@/types/interfaces/Translation'
import type { Task } from '@/types/interfaces/Tasks'
import hljs from 'highlight.js'
import { useI18n } from 'vue-i18n'
import { deleteTranslations, getTranslationByLocale, getTranslationsByTask } from '@/services/TranslationSerivces'
import { getAuthorName, currentUserId } from '@/services/AuthService'


const { locale } = useI18n()

const translation = ref<Translation | null>(null)
const translations = ref<Translation[]>([])


const route = useRoute()
const router = useRouter()
const task = ref<Task | null>(null)
const translationDialog = ref(false)
const authors = ref<Record<string, string>>({})

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
  const taskId = String(route.params.id)

  await router.push(`/translation/${taskId}`)

}

/* async function openTranslations() {
  const taskId = task.value!.id

  const allTranslations = await getTranslationsByTask(taskId)

  translations.value = allTranslations.filter(
    translation => translation.locale === locale.value
  )

  translationDialog.value = true
} */

async function openTranslations() {
  const taskId = task.value!.id

  const allTranslations = await getTranslationsByTask(taskId)

  translations.value = allTranslations.filter(
    translation => translation.locale === locale.value
  )

  for (const item of translations.value) {
    authors.value[item.authorId] = await getAuthorName(item.authorId)
  }

  translationDialog.value = true
}

function selectTranslation(selected: Translation) {
  translation.value = selected
  translationDialog.value = false
}

async function editTranslation(item: Translation) {
  await router.push(`/translation/${task.value!.id}/edit/${item.id}`)
}

async function deleteTranslation(item: Translation) {
  await deleteTranslations(item.id)

  translations.value = translations.value.filter(
    translation => translation.id !== item.id
  )

  if (translation.value?.id === item.id) {
    translation.value = null
  }
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
