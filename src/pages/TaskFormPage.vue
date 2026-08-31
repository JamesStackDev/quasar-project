<template>
  <q-page class="p-6">
    <div class="max-w-2xl mx-auto">
      <q-card class="p-6 shadow-2">
        <div class="text-xl font-bold mb-6">{{ isEditing ? 'Edit your task' : 'Share a new task' }}</div>

        <q-form @submit="handleSubmit" class="q-gutter-lg">
          <q-input
            v-model="form.title"
            label="Title"
            :rules="[val => !!val || 'Title is required']"
          />

          <q-input
            v-model="form.description"
            type="textarea"
            outlined
            autogrow
            label="Description"
            :rules="[val => !!val || 'Description is required']"
          />

          <div>
            <div class="text-subtitle2 text-grey-8 mb-2 flex items-center gap-1">
              <q-icon name="code" /> Code
            </div>
            <textarea
              v-model="form.code"
              rows="8"
              placeholder="Paste your code here..."
              class="w-full bg-grey-9 text-white font-mono text-sm p-4 rounded outline-none"
            ></textarea>
          </div>

          <q-input
            v-model="form.term"
            label="Term"
            :rules="[val => !!val || 'Term is required']"
          >
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

          <q-btn
            type="submit"
            label="Save"
            color="primary"
            class="full-width"
            size="lg"
            :loading="isSubmitting"
            :disable="isSubmitting"
          />
        </q-form>
      </q-card>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTaskStore } from '@/stores/task-store'
import { getTask } from '@/services/TaskService'
import { getUser } from '@/services/AuthService'
import { triggerSuccess, triggerNegative } from '@/utils/Notify'

const route = useRoute()
const router = useRouter()
const taskStore = useTaskStore()

const isEditing = computed(() => !!route.params.id)
const isSubmitting = ref(false)

const form = reactive({
  title: '',
  description: '',
  code: '',
  term: '',
  conclusion: false,
})

async function handleSubmit() {
  isSubmitting.value = true
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
  } finally {
    isSubmitting.value = false
  }
}

onMounted(async () => {
  if (isEditing.value) {
    const existing = await getTask(route.params.id as string)
    Object.assign(form, existing)
  }
})
</script>