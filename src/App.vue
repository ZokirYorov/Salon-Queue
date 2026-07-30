<template>
  <div class="flex flex-col h-full w-full">
    <RouterView/>
    <AuthModal />
  </div>
</template>

<script setup>
import AuthModal from '@/components/AuthModal.vue'
</script>
