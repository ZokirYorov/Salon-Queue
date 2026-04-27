<template>
  <div class="flex flex-col w-full h-full">
    <Header/>
    <div class="w-full min-h-screen flex-1 max-w-[1400px] m-auto">
      <RouterView/>
    </div>
  </div>
</template>

<script setup lang="ts">

import Header from "@/components/Header.vue";
</script>


<style scoped>

</style>