<template>
  <header class="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-30 transition-colors">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
      <RouterLink to="/businesses" class="text-lg font-black tracking-tight text-slate-900 dark:text-white">
        Salon<span class="text-indigo-600 dark:text-indigo-400">Queue</span>
      </RouterLink>
      <div class="flex items-center gap-3">
        <RouterLink
          to="/client/my"
          class="text-sm font-medium transition"
          :class="isActive('/client') ? 'text-indigo-600 dark:text-indigo-400 font-semibold' : 'text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400'"
        >
          Navbatlarim
        </RouterLink>
        <RouterLink
          to="/profile"
          class="flex items-center gap-2 text-sm font-semibold rounded-lg px-3 py-1.5 transition"
          :class="isActive('/profile') ? 'bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300' : 'text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700'"
        >
          <span class="w-6 h-6 rounded-full bg-indigo-500 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
            {{ (authStore.user?.displayName || authStore.user?.login || '?').charAt(0).toUpperCase() }}
          </span>
          Profil
        </RouterLink>
        <button
          @click="toggleTheme"
          class="w-9 h-9 rounded-lg flex items-center justify-center text-slate-500 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex-shrink-0"
          :aria-label="theme === 'dark' ? 'Yorug\' rejimga o\'tish' : 'Tungi rejimga o\'tish'"
        >
          <svg v-if="theme === 'dark'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
          <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
        </button>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { RouterLink, useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useTheme } from '@/composables/useTheme';

const route = useRoute();
const authStore = useAuthStore();
const { theme, toggleTheme } = useTheme();

function isActive(prefix: string) {
  return route.path.startsWith(prefix);
}
</script>
