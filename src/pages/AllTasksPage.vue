<template>
    <q-page class="p-4 page-container">
        <div class="text-xl font-bold mb-4">All Tasks</div>
        <q-tabs v-model="activeTab" dense class="mb-4" align="left">
            <q-tab name="all" label="Todas" />

            <q-tab name="recent" label="Recente" />

            <q-tab name="old" label="Antigos" />
        </q-tabs>
        <q-table :rows="filteredTasks" :columns="columns" row-key="id" :loading="loading" grid hide-header>
            <template #item="props">
                <q-card class="post-card w-full mb-4 p-4">
                    <router-link :to="`/tasks/${props.row.id}`" class="post-title-link">
                        {{ props.row.title }}
                    </router-link>

                    <p>{{ props.row.description }}</p>

                    <div class="flex flex-wrap gap-1 mt-2">
                        <q-chip v-for="tags in props.row.tags" :key="tags" dense size="sm" color="primary"
                            text-color="white">
                            {{ tags }}
                        </q-chip>
                    </div>
                </q-card>
            </template>
        </q-table>
    </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useTaskStore } from '@/stores/task-store'
import type { QTableColumn } from 'quasar'
import { computed } from 'vue'


const activeTab = ref('all')
const loading = ref(true)
const taskStore = useTaskStore()


const filteredTasks = computed(() => {
    const tasks = [...taskStore.tasks]

    if (activeTab.value === 'recent') {
        return tasks.sort(
            (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
        )
    }

    if (activeTab.value === 'old') {
        return tasks.sort(
            (a, b) =>
                new Date(a.createdAt).getTime() -
                new Date(b.createdAt).getTime()
        )
    }

    return tasks
})

const columns: QTableColumn[] = [
    { name: 'title', label: 'Title', field: 'title', align: 'left' },
]



onMounted(async () => {
    try {
        await taskStore.fetchTasks()
    } finally {
        loading.value = false
    }
})
</script>