<template>
  <div class="min-h-screen flex flex-col bg-slate-50/50 dark:bg-slate-900 transition-colors">
    <AppHeader />
    <main class="flex-1 max-w-6xl w-full mx-auto py-8 px-4 sm:px-6">
      <RouterView />
    </main>
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import AppHeader from '@/components/AppHeader.vue'
</script>
