<template>
  <router-view />
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useQuasar } from 'quasar'

const $q = useQuasar()

onMounted(() => {
  const darkMode = localStorage.getItem('darkMode')

  if (darkMode !== null) {
    $q.dark.set(darkMode === 'true')
  }
})
</script>
