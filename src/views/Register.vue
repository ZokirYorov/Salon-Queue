<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8 bg-white dark:bg-slate-800 p-10 rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-700">
      <div>
        <h2 class="mt-6 text-center text-4xl font-extrabold text-gray-900 dark:text-white">
          Ro'yxatdan o'tish
        </h2>
        <p class="mt-4 text-center text-base text-gray-600 dark:text-slate-400">
          Hisobingiz bormi?
          <RouterLink to="/login" class="font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 transition-colors duration-200">
            Tizimga kiring
          </RouterLink>
        </p>
      </div>
      <form class="mt-8 space-y-6" @submit.prevent="handleRegister">
        <p v-if="error" class="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded-md px-3 py-2">{{ error }}</p>
        <div class="rounded-md shadow-sm -space-y-px">
          <div>
            <label for="displayName" class="sr-only">Ism Familiya</label>
            <input id="displayName" type="text" required
                   class="appearance-none relative block w-full px-4 py-3 border border-gray-300 dark:border-slate-600 dark:bg-slate-700 placeholder-gray-500 dark:placeholder-slate-400 text-gray-900 dark:text-white rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm transition-all duration-200"
                   placeholder="Ism Familiya" v-model="displayName">
          </div>
          <div>
            <label for="login" class="sr-only">Login</label>
            <input id="login" type="text" required
                   class="appearance-none relative block w-full px-4 py-3 border border-gray-300 dark:border-slate-600 dark:bg-slate-700 placeholder-gray-500 dark:placeholder-slate-400 text-gray-900 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm transition-all duration-200"
                   placeholder="Login" v-model="login">
          </div>
          <div>
            <label for="phone" class="sr-only">Telefon</label>
            <input id="phone" type="text" required
                   class="appearance-none relative block w-full px-4 py-3 border border-gray-300 dark:border-slate-600 dark:bg-slate-700 placeholder-gray-500 dark:placeholder-slate-400 text-gray-900 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm transition-all duration-200"
                   placeholder="+998 90 000 00 00" v-model="phone">
          </div>
          <div>
            <label for="email-address" class="sr-only">Email manzili</label>
            <input id="email-address" type="email" required
                   class="appearance-none relative block w-full px-4 py-3 border border-gray-300 dark:border-slate-600 dark:bg-slate-700 placeholder-gray-500 dark:placeholder-slate-400 text-gray-900 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm transition-all duration-200"
                   placeholder="Email manzili" v-model="email">
          </div>
          <div>
            <label for="password" class="sr-only">Parol</label>
            <input id="password" type="password" required
                   class="appearance-none relative block w-full px-4 py-3 border border-gray-300 dark:border-slate-600 dark:bg-slate-700 placeholder-gray-500 dark:placeholder-slate-400 text-gray-900 dark:text-white rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm transition-all duration-200"
                   placeholder="Parol" v-model="password">
          </div>
        </div>

        <div>
          <button type="submit" :disabled="loading"
                  class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-lg font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 disabled:opacity-60">
            {{ loading ? 'Yaratilmoqda...' : "Ro'yxatdan o'tish" }}
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
const displayName = ref('');
const login = ref('');
const phone = ref('');
const email = ref('');
const password = ref('');
const loading = ref(false);
const error = ref('');

const handleRegister = async () => {
  error.value = '';
  loading.value = true;
  try {
    await authStore.register({
      login: login.value.trim(),
      password: password.value,
      displayName: displayName.value.trim(),
      email: email.value.trim(),
      phone: phone.value.trim(),
    });
    router.push('/businesses');
  } catch (e: any) {
    error.value = e?.response?.data?.message || "Ro'yxatdan o'tishda xatolik yuz berdi";
  } finally {
    loading.value = false;
  }
};
</script>
