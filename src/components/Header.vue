<template>
  <div
      class="flex items-center w-full  h-[70px] bg-gray-800"
  >
    <div class="text-gray-200 px-1 gap-2 items-center justify-between max-w-[1400px] m-auto flex h-full w-full">
      <div class="flex items-center gap-1">
<!--        <span class="border border-gray-500 px-1 py-2 rounded">-->
<!--          <i class="fa-solid fa-scissors"></i>-->
<!--          Salon-->
<!--        </span>-->
        <div class="grid gap-1 grid-cols-3 items-center md:gap-2 lg:gap-2">
          <router-link
              v-for="item in items"
              :key="item.id"
              :to="item.path"
              class="p-2 text-sm items-center justify-center flex rounded hover:bg-gray-600 cursor-pointer"
              :class="$route.path === item.path ? 'bg-gray-700' : ''"
          >
            <div class="flex items-center">
              {{ item.name }}
            </div>
          </router-link>
        </div>
      </div>
      <div class="flex items-center gap-2 justify-center py-2">
        <button class="rounded-lg flex gap-1 items-center bg-blue-900 p-2 text-sm"><i class="fa-solid fa-user text-sm text-gray-200"></i> Xodim</button>
        <button class="cursor-pointer hover:border-gray-200 hover:text-white/50 border border-gray-400 rounded-lg px-2 flex items-center gap-1 py-1"><i class="fa-solid fa-arrow-right-from-bracket"></i> Chiqish</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

const items = [
  { id: 1, name: "Jadval", path: "/home", icon: "fa-regular fa-calendar-days" },
  { id: 2, name: "Navbatlar", path: "/queue", icon: "fa-regular fa-file-lines" },
  { id: 3, name: "Qo'shish", path: "/add", icon: "fa-solid fa-user-plus" },
]

</script>


<style scoped>

</style>