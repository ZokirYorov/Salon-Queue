<template>
  <div class="flex flex-col w-full h-full">
<!--    <Header/>-->
    <div class="min-h-screen bg-slate-50/50 w-full flex">
      <Sidebar :isMobileOpen="isMobileOpen" @toggleMenu="toggleSidebar" />
      <RouterView class="w-full" @toggle-sidebar="toggleSidebar"/>
    </div>
  </div>
</template>

<script setup lang="ts">
import Sidebar from '@/components/Sidebar.vue'
import {ref} from "vue";
import Header from "@/components/Header.vue";

const isMobileOpen = ref(false)

const toggleSidebar = () => {
  isMobileOpen.value = !isMobileOpen.value
}
</script>


<style scoped>

</style>