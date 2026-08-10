<template>
  <header class="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-30 transition-colors">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
      <RouterLink to="/businesses" class="text-lg font-black tracking-tight text-slate-900 dark:text-white">
        Nav<span class="text-teal-600 dark:text-teal-400">bat</span>
      </RouterLink>
      <div class="flex items-center gap-3">
        <RouterLink
          v-if="authStore.user"
          to="/client/my"
          class="text-sm font-medium transition"
          :class="isActive('/client') ? 'text-teal-600 dark:text-teal-400 font-semibold' : 'text-slate-600 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400'"
        >
          Navbatlarim
        </RouterLink>

        <button
          @click="toggleTheme"
          class="w-9 h-9 rounded-lg cursor-pointer flex items-center justify-center text-slate-500 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex-shrink-0"
          :title="theme === 'dark' ? 'Yorug\' rejimga o\'tish' : 'Tungi rejimga o\'tish'"
        >
          <svg v-if="theme === 'dark'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
          <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
        </button>

        <!-- Anonymous: Kirish / Ro'yxatdan o'tish -->
        <template v-if="!authStore.user">
          <button
            @click="openAuth($event, 'login')"
            class="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400 transition"
          >
            Kirish
          </button>
          <button
            @click="openAuth($event, 'register')"
            class="text-sm font-semibold bg-teal-600 hover:bg-teal-700 text-white px-3.5 py-1.5 rounded-lg transition"
          >
            Ro'yxatdan o'tish
          </button>
        </template>

        <!-- Profile dropdown -->
        <div v-else class="relative" v-click-outside="() => (dropdownOpen = false)">
          <button
            @click="dropdownOpen = !dropdownOpen"
            class="flex items-center cursor-pointer gap-2 text-sm font-semibold rounded-lg px-2 py-1.5 transition"
            :class="isActive('/profile') ? 'bg-teal-100 dark:bg-teal-500/20 text-teal-700 dark:text-teal-300 hover:bg-teal-200 dark:hover:bg-teal-500/30' : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'"
          >
            <span class="w-7 h-7 rounded-full bg-teal-500 text-white text-xs font-bold flex items-center justify-center flex-shrink-0 overflow-hidden">
              <img v-if="mediaUrl(authStore.user?.avatarUrl)" :src="mediaUrl(authStore.user?.avatarUrl)!" class="w-full h-full object-cover" alt="avatar" />
              <template v-else>{{ firstInitial(authStore.user) }}</template>
            </span>
            <svg class="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
          </button>

          <div
            v-if="dropdownOpen"
            class="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg py-1 z-50"
          >
            <div class="flex items-center gap-3 px-4 py-3 border-b border-slate-100 dark:border-slate-700">
              <span class="w-9 h-9 rounded-full bg-teal-500 text-white text-sm font-bold flex items-center justify-center flex-shrink-0 overflow-hidden">
                <img v-if="mediaUrl(authStore.user?.avatarUrl)" :src="mediaUrl(authStore.user?.avatarUrl)!" class="w-full h-full object-cover" alt="avatar" />
                <template v-else>{{ firstInitial(authStore.user) }}</template>
              </span>
              <div class="min-w-0">
                <p class="text-sm font-semibold text-slate-800 dark:text-white truncate">{{ personName(authStore.user) || authStore.user?.login }}</p>
                <p class="text-xs text-slate-400 truncate">@{{ authStore.user?.login }}</p>
              </div>
            </div>
            <RouterLink
              to="/profile"
              class="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              @click="dropdownOpen = false"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
              Profilim
            </RouterLink>
            <button
              @click="openBusinessApp"
              class="w-full flex cursor-pointer items-center gap-2 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 21h18M5 21V7l8-4v18M19 21V11l-6-3M9 9h1m-1 4h1m-1 4h1" /></svg>
              Biznes boshqaruvi
            </button>
            <button
              @click="dropdownOpen = false; showLogoutConfirm = true"
              class="w-full flex items-center cursor-pointer gap-2 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
              Tizimdan chiqish
            </button>
          </div>
        </div>
      </div>
    </div>
  </header>

  <Teleport to="body">
    <div v-if="showLogoutConfirm"
         class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50"
         @click="showLogoutConfirm = false"
    >
      <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 max-w-sm w-full shadow-xl space-y-4">
        <div class="flex items-center justify-between gap-3">
          <h3 class="text-lg font-bold text-slate-900 dark:text-white">Tizimdan chiqish</h3>
          <button
              @click="showLogoutConfirm = false"
              class="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700 "
          >
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>
        <p class="text-sm text-slate-500 dark:text-slate-400">Haqiqatan ham tizimdan chiqmoqchimisiz?</p>
        <div class="grid grid-cols-2 gap-2">
          <button
              @click="showLogoutConfirm = false"
              class="text-sm cursor-pointer font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg py-2 transition"
          >
            Bekor qilish
          </button>
          <button
              @click="logout"
              class="text-sm cursor-pointer font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg py-2 transition"
          >
            Chiqish
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { RouterLink, useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useTheme } from '@/composables/useTheme';
import { useAuthModal } from '@/composables/useAuthModal';
import { mediaUrl } from '@/utils/media';
import { firstInitial, personName } from '@/utils/names';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const { theme, toggleTheme } = useTheme();
const authModal = useAuthModal();

const dropdownOpen = ref(false);
const showLogoutConfirm = ref(false);
// const businessAppUrl = (import.meta.env.VITE_BUSINESS_APP_URL as string | undefined) || 'http://localhost:5174';

function isActive(prefix: string) {
  return route.path.startsWith(prefix);
}

function openAuth(event: MouseEvent, mode: 'login' | 'register') {
  authModal.open({ mode, anchorEl: event.currentTarget as HTMLElement });
}

function logout() {
  showLogoutConfirm.value = false;
  authStore.logout();
  router.push('/businesses');
}

function openBusinessApp() {
  // dropdownOpen.value = false;
  // window.location.href = businessAppUrl;
}
</script>
