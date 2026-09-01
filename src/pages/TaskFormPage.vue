<template>
  <q-page class="p-6">
    <div class="max-w-2xl mx-auto">
      <q-card class="shadow-2">
        <q-card-section class="bg-primary text-white">
          <div class="text-xl font-bold flex items-center gap-2">
            <q-icon :name="isEditing ? 'edit' : 'add_circle'" />
            {{ isEditing ? 'Edit your task' : 'Share a new task' }}
          </div>
        </q-card-section>

        <q-card-section class="p-6">
          <q-form @submit="handleSubmit" class="q-gutter-lg">
            <q-input
              v-model="form.title"
              label="Title"
              outlined
              :rules="[val => !!val || 'Title is required']"
            />

            <q-input
              v-model="form.description"
              type="textarea"
              outlined
              autogrow
              label="Description"
              hint="A short summary of the problem"
              :rules="[val => !!val || 'Description is required']"
            />

            <q-separator />

            <div>
              <div class="text-subtitle2 text-grey-8 mb-2 flex items-center gap-1">
                <q-icon name="code" /> Code
                <q-space />
                <span class="text-caption text-grey">{{ form.code.length }} chars</span>
              </div>
              <textarea
                v-model="form.code"
                rows="8"
                placeholder="Paste your code here..."
                class="w-full bg-grey-9 text-white font-mono text-sm p-4 rounded outline-none"
              ></textarea>
            </div>

            <q-input v-model="form.term" label="Term" outlined :rules="[val => !!val || 'Term is required']">
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

            <div class="flex gap-2">
              <q-btn flat label="Cancel" class="col" @click="router.back()" />
              <q-btn
                type="submit"
                label="Save"
                color="primary"
                class="col"
                size="lg"
                :loading="isSubmitting"
                :disable="isSubmitting"
              />
            </div>
          </q-form>
        </q-card-section>
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