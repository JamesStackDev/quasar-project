<template>
  <q-page class="p-4">
    <q-btn flat icon="arrow_back" label="Back" @click="router.back()" class="mb-4" />

    <q-card class="p-6" v-if="task">
      <div class="text-h5 font-bold mb-2">{{ task.title }}</div>
      <div class="text-caption text-grey mb-4">Term: {{ task.term }}</div>

      <div v-if="task.description[locale]" class="text-body1 mb-4">
        {{ task.description[locale] }}
      </div>
      <q-banner v-else class="bg-orange-1 mb-4">
        <div class="text-caption text-grey mb-1">Not translated yet — original text:</div>
        <div class="text-body2 mb-2">{{ originalText }}</div>
        <template #action>
          <q-btn flat color="primary" label="Add translation" @click="dialogOpen = true" />
        </template>
      </q-banner>

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


    <q-dialog v-model="dialogOpen">
      <q-card class="p-4" style="width: 400px">
        <div class="text-lg font-bold mb-4">Add translation ({{ locale }})</div>
        <q-form @submit="submitTranslation" class="q-gutter-md">
          <q-input v-model="translationText" type="textarea" outlined autogrow label="Description" />
          <q-btn type="submit" label="Save" color="primary" class="full-width" />
        </q-form>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getTask } from '@/services/TaskService'
import type { Task } from '@/types/interfaces/Tasks'
import hljs from 'highlight.js'
import { useI18n } from 'vue-i18n'
import { useCommentStore } from '@/stores/comment-store'
import { useUserStore } from '@/stores/user-store'
import { useTaskStore } from '@/stores/task-store'



const route = useRoute()
const router = useRouter()
const task = ref<Task | null>(null)
const commentStore = useCommentStore()
const newComment = ref('')
const userStore = useUserStore()
const taskStore = useTaskStore()

const { locale } = useI18n();
const dialogOpen = ref(false)
const translationText = ref('')
const originalText = computed(() =>
  Object.values(task.value?.description ?? {})[0] ?? ''
)

async function submitTranslation() {
  if (!task.value) return
  task.value.description = { ...task.value.description, [locale.value]: translationText.value }
  await taskStore.editTask(task.value.id, { description: task.value.description })
  dialogOpen.value = false
  translationText.value = ''
}


async function submitComment() {
  if (!newComment.value.trim()) return
  await commentStore.addComment(task.value!.id, newComment.value)
  newComment.value = ''
}



onMounted(async () => {
  const id = String(route.params.id)
  task.value = await getTask(id)
  await commentStore.fetchComments(id)
})

const highlightedCode = computed(() => hljs.highlightAuto(task.value?.code ?? '').value)
</script>