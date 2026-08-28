<template>
  <q-item clickable v-ripple :to="link" exact
    active-class="bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300"
    class="hover:bg-gray-100 dark:hover:bg-gray-800">
    <q-item-section v-if="icon" avatar>
      <q-icon :name="icon" />
    </q-item-section>

    <q-item-section>
      <q-item-label>  {{ $t(label) }}
</q-item-label>
      <q-item-label caption>  {{ $t(caption) }}</q-item-label>
    </q-item-section>
  </q-item>
</template>

<script setup lang="ts">
export interface EssentialLinkProps {
  label: string;
  caption?: string;
  link?: string;
  icon?: string;
}

withDefaults(defineProps<EssentialLinkProps>(), {
  caption: '',
  link: '#',
  icon: '',
});
</script>
