<template>
  <div class="min-h-screen flex flex-col">
    <nav class="bg-slate-900 sticky top-0 z-40">
      <div class="max-w-4xl mx-auto px-1.5 h-[60px] flex items-center gap-4">
<!--        <RouterLink to="/client/book" class="flex items-center gap-2 text-[17px] font-extrabold text-white no-underline flex-shrink-0">-->
<!--          ✂️ <span>SalonQueue</span>-->
<!--        </RouterLink>-->
        <div class="flex gap-0.5 flex-1">
          <RouterLink
            v-for="tab in tabs"
            :key="tab.to"
            :to="tab.to"
            class="p-[7px] rounded-lg text-slate-400 text-[13px] font-medium no-underline whitespace-nowrap transition-all duration-150 hover:bg-white/10 hover:text-white"
            active-class="bg-white/15 text-white"
          >{{ tab.label }}</RouterLink>
        </div>
        <div class="flex items-center gap-1 flex-shrink-0">
          <router-link
              to="/profile"
          >
            <span class="bg-blue-500 text-white rounded-xl px-2 py-1">👤 Mijoz</span>
          </router-link>
          <button class="text-xs py-1.5 px-3 rounded-lg border border-white/20 bg-transparent text-slate-400 cursor-pointer font-sans hover:text-white hover:border-white/40" @click="logout">Chiqish</button>
        </div>
      </div>
    </nav>
    <main class="flex-1 max-w-4xl w-full mx-auto py-6 px-5">
      <RouterView />
    </main>
  </div>
</template>

<script setup lang="ts">
import { RouterLink, RouterView, useRouter } from 'vue-router'
const router = useRouter()
const tabs = [
  { to: '/client/book', label: '📅 Navbat olish'       },
  { to: '/client/my',   label: '🕐 Navbatlar' },
]
function logout() {
  localStorage.removeItem('role')
  router.push('/')
}
</script>

<style scoped>
</style>
