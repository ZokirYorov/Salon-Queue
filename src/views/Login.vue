<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800 py-12 px-4 sm:px-6 lg:px-8 transition-colors">
    <div class="max-w-md w-full space-y-8 bg-white dark:bg-slate-800 p-10 rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-700">
      <div>
        <h2 class="mt-6 text-center text-4xl font-extrabold text-gray-900 dark:text-white">
          Tizimga kirish
        </h2>
        <p class="mt-4 text-center text-base text-gray-600 dark:text-slate-400">
          Hisobingiz yo'qmi?
          <RouterLink to="/register" class="font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 transition-colors duration-200">
            Ro'yxatdan o'ting
          </RouterLink>
        </p>
      </div>
      <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
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
            <input id="password" name="password" type="password" autocomplete="current-password" required
                   class="appearance-none relative block w-full px-4 py-3 border border-gray-300 dark:border-slate-600 dark:bg-slate-700 placeholder-gray-500 dark:placeholder-slate-400 text-gray-900 dark:text-white rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm transition-all duration-200"
                   placeholder="Parol" v-model="password">
          </div>
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
import { useRouter, RouterLink } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const authStore = useAuthStore();
const login = ref('');
const password = ref('');
const loading = ref(false);
const error = ref('');

const handleLogin = async () => {
  error.value = '';
  loading.value = true;
  try {
    await authStore.login({ login: login.value.trim(), password: password.value });
    router.push('/businesses');
  } catch (e: any) {
    error.value = e?.response?.data?.message || 'Login yoki parol noto\'g\'ri';
  } finally {
    loading.value = false;
  }
};
</script>
