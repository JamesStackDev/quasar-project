<template>
  <q-page class="p-4">
    <div class="text-xl font-bold mb-4">Dashboard</div>

    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <q-card v-for="stat in stats" :key="stat.label" class="p-4 text-center">
        <q-icon :name="stat.icon" :color="stat.color" size="32px" class="mb-2" />
        <div class="text-h4 font-bold">{{ stat.value }}</div>
        <div class="text-caption text-grey">{{ stat.label }}</div>
      </q-card>
    </div>

    <div class="text-lg font-bold mb-2">Latest Tasks</div>
    <div class="flex overflow-x-auto gap-4 bg-orange-100 p-4 rounded">
      <q-card v-for="task in recentTasks" :key="task.id" style="min-width: 200px; max-width: 200px;" class="p-4">
        <div class="font-bold truncate">{{ task.title }}</div>
        <div class="text-caption">{{ task.term }}</div>
      </q-card>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useTaskStore } from '@/stores/task-store'

const taskStore = useTaskStore()

const stats = computed(() => [
  { label: 'Total Tasks', value: taskStore.tasks.length, icon: 'checklist', color: 'primary' },
  { label: 'Completed', value: taskStore.tasks.filter((t) => t.conclusion).length, icon: 'check_circle', color: 'positive' },
  { label: 'Pending', value: taskStore.tasks.filter((t) => !t.conclusion).length, icon: 'pending_actions', color: 'warning' },
  { label: 'Categories', value: new Set(taskStore.tasks.map((t) => t.term)).size, icon: 'category', color: 'secondary' },
])

const recentTasks = computed(() =>
  [...taskStore.myTasks]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime()
    )
    .slice(0, 5)
)

onMounted(async () => {
  if (taskStore.tasks.length === 0) await taskStore.fetchTasks()
})
</script>