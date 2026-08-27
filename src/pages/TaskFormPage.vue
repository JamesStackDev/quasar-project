<template>
  <q-page class="p-6">
    <div class="max-w-2xl mx-auto">
      <q-card class="p-6 shadow-2">

        <div class="flex items-center gap-2 mb-6">
          <q-icon name="edit_note" size="28px" color="primary" />
          <div class="text-xl font-bold">{{ isEditing ? 'Edit your task' : 'Share a new task' }}</div>
        </div>

        <q-form @submit="handleSubmit" class="q-gutter-lg">

          <q-input v-model="form.title" label="Title" borderless class="text-h6" placeholder="What's this about?" />

          <q-separator />

          <div>
            <div class="text-subtitle2 text-grey-8 mb-2">Description</div>
            <q-input v-model="form.description" type="textarea" outlined autogrow placeholder="Describe it..." />
          </div>

          <div>
            <div class="text-subtitle2 text-grey-8 mb-2 flex items-center gap-1">
              <q-icon name="code" /> Code
            </div>
            <textarea
              v-model="form.description"
              rows="8"
              placeholder="Paste your code here..."
              class="w-full bg-grey-9 text-white font-mono text-sm p-4 rounded outline-none"
            ></textarea>
          </div>

          <q-input v-model="form.term" label="Term">
            <template #append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                  <q-date v-model="form.term" mask="YYYY-MM-DD">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="close" color="negative" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>

          <q-btn type="submit" label="Save" color="primary" class="full-width" size="lg" />
        </q-form>

      </q-card>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTaskStore } from '@/stores/task-store'
import { getTask } from '@/services/TaskService'
import { getUser } from '@/services/AuthService'
import { triggerSuccess, triggerNegative } from '@/utils/Notify'

const route = useRoute()
const router = useRouter()
const taskStore = useTaskStore()

const isEditing = computed(() => !!route.params.id)

const form = reactive({
  title: '',
  description: '',
  term: '',
  code: '',
  conclusion: false,
})

async function handleSubmit() {
  try {
    if (isEditing.value) {
      await taskStore.editTask(route.params.id as string, { ...form })
      triggerSuccess('Task updated!')
    } else {
      await taskStore.addTask({ ...form, authorId: getUser()!.id })
      triggerSuccess('Task created!')
    }
    await router.push('/tasks')
  } catch {
    triggerNegative('Something went wrong')
  }
}

onMounted(async () => {
  if (isEditing.value) {
    const existing = await getTask(route.params.id as string)
    Object.assign(form, existing)
  }
})
</script>