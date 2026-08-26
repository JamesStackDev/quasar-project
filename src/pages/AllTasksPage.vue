<template>
    <q-page class="p-4">
        <div class="text-xl font-bold mb-4">All Tasks</div>
        <q-tabs v-model="activeTab" dense class="mb-4" align="left">
            <q-tab name="all" label="All" />
            <q-tab name="pending" label="Pending" />
            <q-tab name="done" label="Done" />
        </q-tabs>
        <q-table :rows="filteredTasks" :columns="columns" row-key="id" :loading="loading" grid hide-header>
            <template #item="props">
                <q-card class="w-full mb-4 p-4 cursor-pointer" @click="goToDetail(props.row.id)">
                    <div class="text-primary font-bold text-lg">{{ props.row.title }}</div>
                    <p class="text-body2">{{ props.row.description }}</p>
                </q-card>
            </template>
        </q-table>
    </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useTaskStore } from '@/stores/task-store'
import type { QTableColumn } from 'quasar'
import { computed } from 'vue'

const activeTab = ref('all')
const loading = ref(true)
const taskStore = useTaskStore()
const router = useRouter()

const filteredTasks = computed(() => {
  if (activeTab.value === 'pending') return taskStore.tasks.filter((t) => !t.conclusion)
  if (activeTab.value === 'done') return taskStore.tasks.filter((t) => t.conclusion)
  return taskStore.tasks
})

const columns: QTableColumn[] = [
    { name: 'title', label: 'Title', field: 'title', align: 'left' },
]

async function goToDetail(id: string) {
    await router.push(`/tasks/${id}`)
}

onMounted(async () => {
    try {
        await taskStore.fetchTasks()
    } finally {
        loading.value = false
    }
})
</script>