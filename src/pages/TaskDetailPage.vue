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

    <q-separator class="my-4" />

    <div class="text-subtitle1 font-bold mb-2">Comments</div>

    <div v-for="comment in commentStore.comments" :key="comment.id" class="mb-3 p-2 bg-grey-2 rounded">
      <div class="text-body2">{{ comment.content }}</div>
      <div class="text-caption text-grey">{{ userStore.getAuthorName(comment.authorId) }} · {{ comment.createdAt }}
      </div>
    </div>

    <q-form @submit="submitComment" class="flex gap-2 mt-2">
      <q-input v-model="newComment" placeholder="Write a comment..." dense outlined class="flex-grow" />
      <q-btn type="submit" label="Send" color="primary" />
    </q-form>
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
import { useCommentStore } from '@/stores/comment-store'
import { useUserStore } from '@/stores/user-store'



const route = useRoute()
const router = useRouter()
const task = ref<Task | null>(null)
const commentStore = useCommentStore()
const newComment = ref('')
const userStore = useUserStore()

const { locale } = useI18n();
const translatedDescription = ref('')

async function updatedTranslation() {
  if (!task.value) return

  const sourceLang = detectLanguage(task.value.description)
  const targetLang = locale.value.slice(0, 2)
  translatedDescription.value = await translateText(task.value.description, sourceLang, targetLang)
}

async function submitComment() {
  if (!newComment.value.trim()) return
  await commentStore.addComment(task.value!.id, newComment.value)
  newComment.value = ''
}

watch(locale, updatedTranslation)

onMounted(async () => {
  const id = String(route.params.id)
  task.value = await getTask(id)
  translatedDescription.value = task.value.description
  await updatedTranslation()
  await commentStore.fetchComments(id)
})

const highlightedCode = computed(() => hljs.highlightAuto(task.value?.code ?? '').value)
</script>