<template>
  <q-page class="p-4">
    <div class="flex justify-between items-center mb-4">
      <div class="text-xl font-bold">Tasks</div>
      <q-btn label="New Task" color="primary" @click="router.push('/tasks/new')" />
    </div>

    <q-table :rows="taskStore.myTasks" :columns="columns" row-key="id" :loading="loading" :filter="search" grid hide-header>
      <template #item="props">
        <q-card class="w-full mb-4 p-4 cursor-pointer" @click="goToDetail(props.row.id)">
          <div class="flex justify-between items-start">
            <div class="text-primary font-bold text-lg">{{ props.row.title }}</div>
            <div @click.stop>
              <q-btn flat round dense icon="edit" @click="router.push(`/tasks/${props.row.id}/edit`)" />
              <q-btn flat round dense icon="delete" color="negative" @click="askDelete(props.row.id)" />
            </div>
          </div>
          <p class="text-body2">{{ props.row.description }}</p>
          <div class="flex justify-between text-caption text-grey">
            <span>Term: {{ props.row.term }}</span>
            <span>Author: {{ userStore.getAuthorName(props.row.authorId) }}</span>
            <span>{{ props.row.conclusion ? 'Done' : 'Pending' }}</span>
          </div>
        </q-card>
      </template>
    </q-table>

    
    <q-dialog v-model="confirmDeleteOpen">
      <q-card class="p-4">
        <div class="text-lg font-bold mb-4">Delete this task?</div>
        <div class="flex justify-end gap-2">
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn color="negative" label="Delete" @click="confirmDelete" v-close-popup />
        </div>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { useTaskStore } from '@/stores/task-store';
import { onMounted, ref, watch } from 'vue';
import type { QTableColumn } from 'quasar';
import { triggerNegative, triggerSuccess } from '@/utils/Notify';
import { useRoute, useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user-store';

const taskStore = useTaskStore();
const userStore = useUserStore();
const loading = ref(true);
const route = useRoute()
const router = useRouter()
const confirmDeleteOpen = ref(false)
const deletingId = ref<string | null>(null)

async function goToDetail(id: string) {
    await router.push(`/tasks/${id}`)
}

function askDelete(id: string) {
    deletingId.value = id
    confirmDeleteOpen.value = true
}

async function confirmDelete() {
  if (!deletingId.value) return
  try {
    await taskStore.removeTask(deletingId.value)
    triggerSuccess('Task deleted')
  } catch {
    triggerNegative('Something went wrong')
  }
}

const search = ref((route.query.q as string) || '')

watch(
    () => route.query.q,
    (newValue) => {
        search.value = (newValue as string) || ''
    }
)


const columns: QTableColumn[] = [
    { name: 'title', label: 'Title', field: 'title', align: 'left', sortable: true },
    { name: 'description', label: 'Description', field: 'description', align: 'left' },
    { name: 'term', label: 'Term', field: 'term', align: 'left', sortable: true },
    { name: 'conclusion', label: 'Done', field: 'conclusion', align: 'left' },
    { name: 'actions', label: 'Actions', field: 'id', align: 'center' },
]





onMounted(async () => {
    try {
        await taskStore.fetchTasks()
        await userStore.fetchUsers()
    } catch (err) {
        console.error(err)
    } finally {
        loading.value = false
    }
})
</script>