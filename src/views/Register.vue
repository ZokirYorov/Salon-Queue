<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800 py-12 px-4 sm:px-6 lg:px-8">
    <RouterLink
        to="/businesses"
        class="mb-6 text-xl font-black tracking-tight text-slate-900 dark:text-white"
    >
      Nav<span class="text-indigo-600 dark:text-indigo-400">bat</span>
    </RouterLink>
    <div class="max-w-md w-full space-y-8 bg-white dark:bg-slate-800 p-10 rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-700">
      <div>
        <h2 class="mt-6 text-center text-4xl font-extrabold text-gray-900 dark:text-white">
          Ro'yxatdan o'tish
        </h2>
        <p class="mt-4 text-center text-base text-gray-600 dark:text-slate-400">
          Hisobingiz bormi?
          <RouterLink
              :to="{ name: 'Login', query: route.query }"
              class="font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 transition-colors duration-200"
          >
            Tizimga kiring
          </RouterLink>
        </p>
      </div>
      <form
          class="mt-8 space-y-6"
          @submit.prevent="handleRegister"
      >
        <p
            v-if="error"
            class="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded-md px-3 py-2"
        >
          {{ error }}
        </p>
        <div class="flex flex-col gap-2 rounded-md shadow-sm -space-y-px">
          <div>
            <label for="firstName" class="sr-only">Ism</label>
            <input v-model="firstName"
                   id="firstName"
                   type="text"
                   required
                   class="appearance-none relative block w-full px-4 py-3 border border-gray-300 dark:border-slate-600 dark:bg-slate-700 placeholder-gray-500 dark:placeholder-slate-400 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm transition-all duration-200"
                   placeholder="Ism"
            >
          </div>
          <div>
            <label for="lastName" class="sr-only">Familiya</label>
            <input v-model="lastName"
                   id="lastName"
                   type="text"
                   class="appearance-none relative block w-full px-4 py-3 border border-gray-300 dark:border-slate-600 dark:bg-slate-700 placeholder-gray-500 dark:placeholder-slate-400 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm transition-all duration-200"
                   placeholder="Familiya"
            >
          </div>
          <div>
            <label for="login" class="sr-only">Login</label>
            <input v-model="login"
                   id="login"
                   type="text"
                   required
                   class="appearance-none relative block w-full px-4 py-3 border border-gray-300 dark:border-slate-600 dark:bg-slate-700 placeholder-gray-500 dark:placeholder-slate-400 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm transition-all duration-200"
                   placeholder="Login"
            >
          </div>
          <div>
            <label for="phone" class="sr-only">Telefon</label>
            <input
                id="phone"
                :value="displayPhone"
                type="tel"
                inputmode="numeric"
                required
                class="appearance-none relative block w-full px-4 py-3 border border-gray-300 dark:border-slate-600 dark:bg-slate-700 placeholder-gray-500 dark:placeholder-slate-400 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm transition-all duration-200"
                placeholder="+998 90 000 00 00"
                @input="onPhoneInput"
                @keydown="onPhoneKeydown"
            >
          </div>
          <div>
            <label for="email-address" class="sr-only">Email manzili</label>
            <input v-model="email"
                   id="email-address"
                   type="email"
                   required
                   class="appearance-none relative block w-full px-4 py-3 border border-gray-300 dark:border-slate-600 dark:bg-slate-700 placeholder-gray-500 dark:placeholder-slate-400 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm transition-all duration-200"
                   placeholder="Email manzili"
            >
          </div>
          <div>
            <label for="password" class="sr-only">Parol</label>
            <input v-model="password"
                   id="password"
                   type="password"
                   required
                   class="appearance-none relative block w-full px-4 py-3 border border-gray-300 dark:border-slate-600 dark:bg-slate-700 placeholder-gray-500 dark:placeholder-slate-400 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm transition-all duration-200"
                   placeholder="Parol"
            >
          </div>
        </div>

        <div>
          <button type="submit"
                  :disabled="loading"
                  class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-lg font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 disabled:opacity-60"
          >
            {{ loading ? 'Yaratilmoqda...' : "Ro'yxatdan o'tish" }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import {computed, ref} from 'vue';
import { useRouter, useRoute, RouterLink } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();
const firstName = ref('');
const lastName = ref('');
const login = ref('');
const email = ref('');
const password = ref('');
const loading = ref(false);
const error = ref('');

const digits = ref('')

// Foydalanuvchiga ko'rinadigan, formatlangan qiymat: +998 90 123 45 67
const displayPhone = computed(() => {
  if (!digits.value) return '+998 '
  let result = '+998 '
  const d = digits.value
  if (d.length > 0) result += d.slice(0, 2)
  if (d.length > 2) result += ' ' + d.slice(2, 5)
  if (d.length > 5) result += ' ' + d.slice(5, 7)
  if (d.length > 7) result += ' ' + d.slice(7, 9)
  return result
})

// Tashqariga (submit uchun) toza formatda yuboriladigan qiymat: +998901234567
const phone = computed(() => (digits.value ? `+998${digits.value}` : ''))

function onPhoneInput(e: Event) {
  const input = e.target as HTMLInputElement
  // Faqat raqamlarni ajratib olamiz, "998" prefiksini (agar kiritilgan bo'lsa) olib tashlaymiz
  let raw = input.value.replace(/\D/g, '')
  if (raw.startsWith('998')) raw = raw.slice(3)
  digits.value = raw.slice(0, 9)
  // Kursorni oxiriga qo'yish uchun keyingi tikda qayta render bo'ladi
  input.value = displayPhone.value
}

function onPhoneKeydown(e: KeyboardEvent) {
  // Backspace bosilganda, agar oxirgi belgi bo'shliq bo'lsa, undan oldingi raqamni ham o'chirish
  if (e.key === 'Backspace' && digits.value.length > 0) {
    const cursorAtEnd = (e.target as HTMLInputElement).selectionStart === displayPhone.value.length
    if (cursorAtEnd) {
      e.preventDefault()
      digits.value = digits.value.slice(0, -1)
    }
  }
}

defineExpose({ phone })
const handleRegister = async () => {
  error.value = '';
  loading.value = true;
  try {
    await authStore.register({
      login: login.value.trim(),
      password: password.value,
      firstName: firstName.value.trim(),
      lastName: lastName.value.trim() || undefined,
      email: email.value.trim(),
      phone: phone.value.trim(),
    });
    const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : '/businesses';
    await router.push(redirect);
  } catch (e: any) {
    error.value = e?.response?.data?.message || "Ro'yxatdan o'tishda xatolik yuz berdi";
  } finally {
    loading.value = false;
  }
};
</script>
