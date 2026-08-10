<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800 py-12 px-4 sm:px-6 lg:px-8 transition-colors">
    <RouterLink to="/businesses" class="mb-6 text-xl font-black tracking-tight text-slate-900 dark:text-white">
      Nav<span class="text-indigo-600 dark:text-indigo-400">bat</span>
    </RouterLink>
    <div class="max-w-md w-full space-y-8 bg-white dark:bg-slate-800 p-10 rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-700">
      <div>
        <h2 class="mt-6 text-center text-4xl font-extrabold text-gray-900 dark:text-white">
          Tizimga kirish
        </h2>
        <p class="mt-4 text-center text-base text-gray-600 dark:text-slate-400">
          Hisobingiz yo'qmi?
          <RouterLink :to="{ name: 'Register', query: route.query }" class="font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 transition-colors duration-200">
            Ro'yxatdan o'ting
          </RouterLink>
        </p>
      </div>
      <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
        <p v-if="route.query.reset === 'success'" class="text-sm text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 rounded-md px-3 py-2">
          Parol almashtirildi. Yangi parol bilan tizimga kiring.
        </p>
        <p v-if="error" class="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded-md px-3 py-2">{{ error }}</p>
        <div class="rounded-md shadow-sm -space-y-px">
          <div>
            <label for="login" class="sr-only">Login</label>
            <input id="login" name="login" type="text" autocomplete="username" required
                   class="appearance-none relative block w-full px-4 py-3 border border-gray-300 dark:border-slate-600 dark:bg-slate-700 placeholder-gray-500 dark:placeholder-slate-400 text-gray-900 dark:text-white rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm transition-all duration-200"
                   placeholder="Login" v-model="login">
          </div>
          <div>
            <label for="password" class="sr-only">Parol</label>
            <div class="relative">
              <input id="password" name="password" :type="showPassword ? 'text' : 'password'" autocomplete="current-password" required
                     class="appearance-none relative block w-full px-4 py-3 pr-12 border border-gray-300 dark:border-slate-600 dark:bg-slate-700 placeholder-gray-500 dark:placeholder-slate-400 text-gray-900 dark:text-white rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm transition-all duration-200"
                     placeholder="Parol" v-model="password">
              <button
                type="button"
                class="absolute right-3 top-1/2 -translate-y-1/2 z-20 text-gray-400 hover:text-gray-600 dark:hover:text-slate-200 transition"
                :aria-label="showPassword ? 'Parolni yashirish' : 'Parolni ko\'rsatish'"
                @click="showPassword = !showPassword"
              >
                <svg v-if="showPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3l18 18M10.58 10.58A2 2 0 0012 14a2 2 0 001.42-.58M9.88 4.24A10.44 10.44 0 0112 4c5 0 9 4 10 8a11.79 11.79 0 01-3.22 5.05M6.1 6.1A11.82 11.82 0 002 12c1 4 5 8 10 8a10.58 10.58 0 005.9-1.86" />
                </svg>
                <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
                  <circle cx="12" cy="12" r="3" stroke-width="2" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        <div class="flex justify-end">
          <RouterLink :to="{ name: 'ForgotPassword' }" class="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 transition-colors">
            Parolni unutdingizmi?
          </RouterLink>
        </div>
        <div>
          <button type="submit" :disabled="loading"
                  class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-lg font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 disabled:opacity-60">
            {{ loading ? 'Kirilmoqda...' : 'Kirish' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter, useRoute, RouterLink } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();
const login = ref('');
const password = ref('');
const showPassword = ref(false);
const loading = ref(false);
const error = ref('');

const handleLogin = async () => {
  error.value = '';
  loading.value = true;
  try {
    await authStore.login({ login: login.value.trim(), password: password.value });
    const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : '/businesses';
    router.push(redirect);
  } catch (e: any) {
    error.value = e?.response?.data?.message || 'Login yoki parol noto\'g\'ri';
  } finally {
    loading.value = false;
  }
};
</script>
