<template>
  <div class="flex w-full h-full items-center mt-10 gap-4 justify-center">
    <button
        type="button"
        class="cursor-pointer bg-gray-200 rounded px-2 py-1"
        @click="router.back()">
      <i class="fa-solid fa-arrow-left"></i> Ortga
    </button>
    Foydalanuvchi profili
  </div>
</template>

<script setup lang="ts">

import router from "@/router";
</script>


<style scoped>

</style>