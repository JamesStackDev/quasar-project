<template>
    <q-page class="p-4">

        <div class="flex justify-between items-center mb-4">
            <div class="text-xl font-bold">Tasks</div>
            <q-btn label="New Task" color="primary" @click="openCreate"/>
        </div>

        <q-input v-model="search" label="Search" dense clearable>
            <template #prepend>
                <q-icon name="search"/>
            </template>
        </q-input>

        <q-table :rows="taskStore.tasks" :columns="columns" row-key="id" :loading="loading" :filter="search">
            
            <template #body-cell-actions="props">
                <q-td :props="props">
                    <q-btn flat round icon="edit" @click="openEdit(props.row)"/>
                    <q-btn flat round icon="delete" color="negative" @click="handleDelete(props.row.id)"/>
                </q-td>
            </template>

        </q-table>


        <q-dialog v-model="dialogOpen">
            <q-card style="width: 400px;">

                <q-card-section>
                    <div class="text-lg font-bold">{{ isEditing ? 'Edit Task' : 'Create Task' }}</div>
                </q-card-section>

                <q-card-section>
                    <q-form class="q-gutter-md" @submit="handleSubmit">
                        
                        <q-input v-model="form.title" label="Title"/>
                        <q-input v-model="form.description" label="Description"/>


                        <q-input v-model="form.term" label="Term">
                            <template #append>
                                <q-icon name="event" class="cursor-pointer">
                                    <q-popup-proxy cover transition-show="scale"  transition-hide="scale">
                                        <q-date v-model="form.term" mask="YYYY-MM-DD">
                                            <div class="row items-center justify-end">
                                                <q-btn v-close-popup label="close" color="negative" flat/>
                                            </div>
                                        </q-date>
                                    </q-popup-proxy>
                                </q-icon>
                            </template>
                        </q-input>

                        <q-btn type="submit" label="Save" color="primary" class="full-width"/>
                    </q-form>
                </q-card-section>

            </q-card>
        </q-dialog>


    </q-page>
</template>

<script setup lang="ts">
import { useTaskStore } from '@/stores/task-store';
import { onMounted, reactive, ref } from 'vue';
import type { QTableColumn } from 'quasar';
import type { Task } from '@/types/interfaces/Tasks';
import { triggerNegative, triggerSuccess } from '@/utils/Notify';

const taskStore = useTaskStore();
const search = ref('');
const loading = ref(true);
const dialogOpen = ref(false);
const isEditing = ref(false)
const editingId = ref<number | null>(null)

const form = reactive({
    title: '',
    description: '',
    term: '',
    conclusion: false,
})

const columns: QTableColumn[] = [
    { name: 'title', label: 'Title', field: 'title', align: 'left', sortable: true },
    { name: 'description', label: 'Description', field: 'description', align: 'left' },
    { name: 'term', label: 'Term', field: 'term', align: 'left', sortable: true },
    { name: 'conclusion', label: 'Done', field: 'conclusion', align: 'left' },
    { name: 'actions', label: 'Actions', field: 'id', align: 'center' },
]

function openCreate() {
    isEditing.value = false
    editingId.value = null
    form.title = ''
    form.description = ''
    form.term = ''
    form.conclusion = false
    dialogOpen.value = true
}

function openEdit(task: Task) {
    isEditing.value = true
    editingId.value = task.id
    form.title = task.title
    form.description = task.description
    form.term = task.term
    form.conclusion = task.conclusion
    dialogOpen.value = true
} 

async function handleSubmit() {
    try {
        if( isEditing.value && editingId.value !== null ) {
            await taskStore.editTask(editingId.value, {...form})
            triggerSuccess('Taks Updated')
        } else {
            await taskStore.addTask({...form})
            triggerSuccess('Task Created')
        }
        dialogOpen.value = false
    } catch {
        triggerNegative('Something went wrong')
    }
}

async function handleDelete(id: number) {
    try {
        await taskStore.removeTask(id)
        triggerSuccess('Task deleted')
    } catch {
        triggerNegative('Something went wrong')
    }
}
  
onMounted(async () => {
   try{
    await taskStore.fetchTasks()
   } catch (err) {
    console.error(err)
   } finally {
    loading.value = false
   }
})
</script>   