<template>
  <div class="flex flex-col h-full w-full">
    <RouterView/>
    <AuthModal />
    <MobileTabBar v-if="showTabBar" />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AuthModal from '@/components/AuthModal.vue'
import MobileTabBar from '@/components/MobileTabBar.vue'

const route = useRoute()

// Kirish sahifalarida tab bar kerak emas
const HIDDEN_ON = ['Login', 'Register', 'ForgotPassword']
const showTabBar = computed(() => !!route.name && !HIDDEN_ON.includes(route.name))
</script>
