<template>
    <q-page class="p-6">
        <div class="max-w-2xl mx-auto">
            <q-card class="shadow-2">
                <q-card-section class="bg-primary text-white">
                    <div class="text-xl font-bold">
                        Contribute translation
                    </div>
                </q-card-section>

                <q-card-section class="p-6">
                    <div class="text-caption text-grey mb-2">
                        Original description
                    </div>

                    <div class="text-body1 q-mb-lg">
                        {{ task?.description }}
                    </div>

                    <q-separator class="q-mb-lg" />

                    <div class="text-caption text-grey mb-2">
                        Translation — {{ locale }}
                    </div>

                    <q-input v-model="text" type="textarea" outlined autogrow label="Translation" :rules="[
                        val => !!val || 'Translation is required'
                    ]" />

                    <div class="flex gap-2 q-mt-lg">
                        <q-btn flat label="Cancel" class="col" @click="router.back()" />

                        <q-btn label="Submit translation" color="primary" class="col" :loading="isSubmitting"
                            :disable="isSubmitting" @click="submitTranslation" />
                    </div>
                </q-card-section>
            </q-card>
        </div>
    </q-page>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { getTask } from '@/services/TaskService'
import { getUser } from '@/services/AuthService'
import type { Task } from '@/types/interfaces/Tasks'
import { createTranslations } from '@/services/TranslationSerivces'

import {
    triggerSuccess,
    triggerNegative
} from '@/utils/Notify'


const route = useRoute()
const router = useRouter()

const { locale } = useI18n()

const task = ref<Task | null>(null)
const text = ref('')
const isSubmitting = ref(false)

onMounted(async () => {
    const taskId = String(route.params.taskId)

    task.value = await getTask(taskId)
})

async function submitTranslation() {
    if (!text.value.trim()) {
        triggerNegative('Translation is required')
        return
    }

    isSubmitting.value = true

    try {
        await createTranslations({
            id: crypto.randomUUID(),
            taskId: String(route.params.taskId),
            locale: locale.value,
            text: text.value,
            authorId: getUser()!.id
        })

        triggerSuccess('Translation submitted!')

        await router.push(
            `/tasks/${route.params.taskId}`
        )
    } catch {
        triggerNegative(
            'Could not submit translation'
        )
    } finally {
        isSubmitting.value = false
    }
}
</script>