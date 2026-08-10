<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800 py-12 px-4 sm:px-6 lg:px-8 transition-colors">
    <RouterLink to="/businesses" class="mb-6 text-xl font-black tracking-tight text-slate-900 dark:text-white">
      Nav<span class="text-indigo-600 dark:text-indigo-400">bat</span>
    </RouterLink>

    <div class="max-w-md w-full bg-white dark:bg-slate-800 p-8 sm:p-10 rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-700">
      <div class="mb-8">
        <h2 class="text-center text-3xl font-extrabold text-gray-900 dark:text-white">
          Parolni tiklash
        </h2>
        <p class="mt-3 text-center text-sm text-gray-600 dark:text-slate-400">
          Loginni kiriting, emailingizga yuborilgan kod orqali yangi parol o'rnating.
        </p>
      </div>

      <p v-if="error" class="mb-4 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded-md px-3 py-2">
        {{ error }}
      </p>
      <p v-if="message" class="mb-4 text-sm text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 rounded-md px-3 py-2">
        {{ message }}
      </p>

      <form v-if="step === 'request'" class="space-y-5" @submit.prevent="sendCode">
        <div>
          <label for="reset-login" class="block text-sm font-medium text-gray-700 dark:text-slate-200 mb-1.5">Login</label>
          <input
            id="reset-login"
            v-model="form.login"
            type="text"
            autocomplete="username"
            required
            :disabled="loading"
            class="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 dark:bg-slate-700 placeholder-gray-500 dark:placeholder-slate-400 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all"
            placeholder="Login"
          />
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="w-full flex justify-center py-3 px-4 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all disabled:opacity-60"
        >
          {{ loading ? 'Yuborilmoqda...' : 'Kod yuborish' }}
        </button>
      </form>

      <form v-else class="space-y-5" @submit.prevent="resetPassword">
        <div>
          <label for="reset-code" class="block text-sm font-medium text-gray-700 dark:text-slate-200 mb-1.5">Kod</label>
          <input
            id="reset-code"
            v-model="form.code"
            type="text"
            inputmode="numeric"
            autocomplete="one-time-code"
            required
            maxlength="6"
            pattern="[0-9]{6}"
            :disabled="loading"
            @input="normalizeCode"
            class="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 dark:bg-slate-700 placeholder-gray-500 dark:placeholder-slate-400 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all"
            placeholder="6 xonali kod"
          />
        </div>

        <div>
          <label for="new-password" class="block text-sm font-medium text-gray-700 dark:text-slate-200 mb-1.5">Yangi parol</label>
          <div class="relative">
            <input
              id="new-password"
              v-model="form.newPassword"
              :type="showNewPassword ? 'text' : 'password'"
              autocomplete="new-password"
              required
              minlength="4"
              :disabled="loading"
              class="w-full px-4 py-3 pr-12 border border-gray-300 dark:border-slate-600 dark:bg-slate-700 placeholder-gray-500 dark:placeholder-slate-400 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all"
              placeholder="Kamida 4 belgi"
            />
            <button type="button" class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-slate-200 transition" :aria-label="showNewPassword ? 'Parolni yashirish' : 'Parolni ko\'rsatish'" @click="showNewPassword = !showNewPassword">
              <svg v-if="showNewPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3l18 18M10.58 10.58A2 2 0 0012 14a2 2 0 001.42-.58M9.88 4.24A10.44 10.44 0 0112 4c5 0 9 4 10 8a11.79 11.79 0 01-3.22 5.05M6.1 6.1A11.82 11.82 0 002 12c1 4 5 8 10 8a10.58 10.58 0 005.9-1.86" /></svg>
              <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" /><circle cx="12" cy="12" r="3" stroke-width="2" /></svg>
            </button>
          </div>
        </div>

        <div>
          <label for="confirm-password" class="block text-sm font-medium text-gray-700 dark:text-slate-200 mb-1.5">Parolni tasdiqlang</label>
          <div class="relative">
            <input
              id="confirm-password"
              v-model="form.confirmPassword"
              :type="showConfirmPassword ? 'text' : 'password'"
              autocomplete="new-password"
              required
              minlength="4"
              :disabled="loading"
              class="w-full px-4 py-3 pr-12 border border-gray-300 dark:border-slate-600 dark:bg-slate-700 placeholder-gray-500 dark:placeholder-slate-400 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all"
              placeholder="Yangi parolni qayta kiriting"
            />
            <button type="button" class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-slate-200 transition" :aria-label="showConfirmPassword ? 'Parolni yashirish' : 'Parolni ko\'rsatish'" @click="showConfirmPassword = !showConfirmPassword">
              <svg v-if="showConfirmPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3l18 18M10.58 10.58A2 2 0 0012 14a2 2 0 001.42-.58M9.88 4.24A10.44 10.44 0 0112 4c5 0 9 4 10 8a11.79 11.79 0 01-3.22 5.05M6.1 6.1A11.82 11.82 0 002 12c1 4 5 8 10 8a10.58 10.58 0 005.9-1.86" /></svg>
              <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" /><circle cx="12" cy="12" r="3" stroke-width="2" /></svg>
            </button>
          </div>
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="w-full flex justify-center py-3 px-4 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all disabled:opacity-60"
        >
          {{ loading ? 'Saqlanmoqda...' : 'Parolni almashtirish' }}
        </button>

        <div class="grid gap-2 sm:grid-cols-2">
          <button type="button" :disabled="loading" class="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 disabled:opacity-60" @click="changeLogin">
            Loginni o'zgartirish
          </button>
          <button type="button" :disabled="loading" class="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 disabled:opacity-60" @click="sendCode">
            Kodni qayta yuborish
          </button>
        </div>
      </form>

      <p class="mt-6 text-center text-sm text-gray-600 dark:text-slate-400">
        Parol esingizdami?
        <RouterLink :to="{ name: 'Login' }" class="font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500">
          Tizimga kiring
        </RouterLink>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useRouter, RouterLink } from 'vue-router';
import { authApi } from '@/api/auth';

const router = useRouter();
const step = ref<'request' | 'confirm'>('request');
const loading = ref(false);
const error = ref('');
const message = ref('');
const showNewPassword = ref(false);
const showConfirmPassword = ref(false);
const form = reactive({
  login: '',
  code: '',
  newPassword: '',
  confirmPassword: '',
});

async function sendCode() {
  error.value = '';
  message.value = '';

  if (form.login.trim().length < 3) {
    error.value = "Login kamida 3 ta belgi bo'lishi kerak";
    return;
  }

  loading.value = true;
  try {
    form.login = form.login.trim();
    await authApi.requestPasswordReset({ login: form.login });
    message.value = "Agar login mavjud bo'lsa, emailga kod yuborildi.";
    step.value = 'confirm';
  } catch (e: any) {
    error.value = e?.response?.data?.message || 'Kodni yuborishda xatolik yuz berdi';
  } finally {
    loading.value = false;
  }
}

function normalizeCode() {
  form.code = form.code.replace(/\D/g, '').slice(0, 6);
}

function changeLogin() {
  error.value = '';
  message.value = '';
  form.code = '';
  form.newPassword = '';
  form.confirmPassword = '';
  showNewPassword.value = false;
  showConfirmPassword.value = false;
  step.value = 'request';
}

async function resetPassword() {
  error.value = '';
  message.value = '';

  if (form.code.trim().length !== 6) {
    error.value = '6 xonali kodni kiriting';
    return;
  }
  if (form.newPassword.length < 4) {
    error.value = "Parol kamida 4 ta belgi bo'lishi kerak";
    return;
  }
  if (form.newPassword !== form.confirmPassword) {
    error.value = 'Parollar mos emas';
    return;
  }

  loading.value = true;
  try {
    await authApi.confirmPasswordReset({
      login: form.login.trim(),
      code: form.code.trim(),
      newPassword: form.newPassword,
    });
    form.code = '';
    form.newPassword = '';
    form.confirmPassword = '';
    router.push({ name: 'Login', query: { reset: 'success' } });
  } catch (e: any) {
    error.value = e?.response?.data?.message || "Kod noto'g'ri yoki muddati o'tgan";
  } finally {
    loading.value = false;
  }
}
</script>
