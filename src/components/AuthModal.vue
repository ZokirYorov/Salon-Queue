<template>
  <Teleport to="body">
    <div v-if="isOpen" class="fixed inset-0 z-[60]" @click="close" @keydown.esc="close">
      <div
        class="absolute w-[22rem] max-w-[calc(100vw-1rem)] bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-2xl shadow-2xl dark:shadow-black/60 dark:ring-1 dark:ring-black/40"
        :style="panelStyle"
        @click.stop
      >
        <!-- Pointer caret towards the trigger button -->
        <div v-if="anchor" class="absolute -top-1.5 w-3 h-3 rotate-45 bg-white dark:bg-slate-800 border-t border-l border-slate-200 dark:border-slate-600" :style="caretStyle" />

        <div class="relative flex items-center justify-between px-5 pt-5">
          <h3 class="text-base font-bold text-slate-800 dark:text-white">
            {{ mode === 'login' ? 'Tizimga kirish' : "Ro'yxatdan o'tish" }}
          </h3>
          <button @click="close" class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <!-- Login form -->
        <form v-if="mode === 'login'" class="p-5 space-y-3" @submit.prevent="handleLogin">
          <p v-if="error" class="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded-md px-3 py-2">{{ error }}</p>
          <input v-model="loginForm.login" type="text" required autocomplete="username" placeholder="Login" autofocus
                 class="w-full px-4 py-2.5 border border-gray-300 dark:border-slate-500 dark:bg-slate-900/60 dark:text-white placeholder-gray-500 dark:placeholder-slate-400 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          <div class="relative">
            <input v-model="loginForm.password" :type="showLoginPassword ? 'text' : 'password'" required autocomplete="current-password" placeholder="Parol"
                   class="w-full px-4 py-2.5 pr-11 border border-gray-300 dark:border-slate-500 dark:bg-slate-900/60 dark:text-white placeholder-gray-500 dark:placeholder-slate-400 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            <button type="button" class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition" :aria-label="showLoginPassword ? 'Parolni yashirish' : 'Parolni ko\'rsatish'" @click="showLoginPassword = !showLoginPassword">
              <svg v-if="showLoginPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3l18 18M10.58 10.58A2 2 0 0012 14a2 2 0 001.42-.58M9.88 4.24A10.44 10.44 0 0112 4c5 0 9 4 10 8a11.79 11.79 0 01-3.22 5.05M6.1 6.1A11.82 11.82 0 002 12c1 4 5 8 10 8a10.58 10.58 0 005.9-1.86" /></svg>
              <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" /><circle cx="12" cy="12" r="3" stroke-width="2" /></svg>
            </button>
          </div>
          <div class="text-right">
            <button type="button" @click="goToForgotPassword" class="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
              Parolni unutdingizmi?
            </button>
          </div>
          <button type="submit" :disabled="loading" class="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-semibold py-2.5 rounded-lg transition">
            {{ loading ? 'Kirilmoqda...' : 'Kirish' }}
          </button>
          <p class="text-center text-xs text-slate-500 dark:text-slate-400">
            Hisobingiz yo'qmi?
            <button type="button" @click="mode = 'register'" class="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">Ro'yxatdan o'ting</button>
          </p>
        </form>

        <!-- Register form -->
        <form v-else class="p-5 space-y-3" @submit.prevent="handleRegister">
          <p v-if="error" class="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded-md px-3 py-2">{{ error }}</p>
          <input v-model="registerForm.fullName" type="text" required placeholder="Ism Familiya" autofocus
                 class="w-full px-4 py-2.5 border border-gray-300 dark:border-slate-500 dark:bg-slate-900/60 dark:text-white placeholder-gray-500 dark:placeholder-slate-400 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          <input v-model="registerForm.login" type="text" required placeholder="Login"
                 class="w-full px-4 py-2.5 border border-gray-300 dark:border-slate-500 dark:bg-slate-900/60 dark:text-white placeholder-gray-500 dark:placeholder-slate-400 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          <input v-model="registerForm.phone" type="text" required placeholder="+998 90 000 00 00"
                 class="w-full px-4 py-2.5 border border-gray-300 dark:border-slate-500 dark:bg-slate-900/60 dark:text-white placeholder-gray-500 dark:placeholder-slate-400 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          <input v-model="registerForm.email" type="email" required placeholder="Email manzili"
                 class="w-full px-4 py-2.5 border border-gray-300 dark:border-slate-500 dark:bg-slate-900/60 dark:text-white placeholder-gray-500 dark:placeholder-slate-400 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          <div class="relative">
            <input v-model="registerForm.password" :type="showRegisterPassword ? 'text' : 'password'" required placeholder="Parol (kamida 4 belgi)"
                   class="w-full px-4 py-2.5 pr-11 border border-gray-300 dark:border-slate-500 dark:bg-slate-900/60 dark:text-white placeholder-gray-500 dark:placeholder-slate-400 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            <button type="button" class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition" :aria-label="showRegisterPassword ? 'Parolni yashirish' : 'Parolni ko\'rsatish'" @click="showRegisterPassword = !showRegisterPassword">
              <svg v-if="showRegisterPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3l18 18M10.58 10.58A2 2 0 0012 14a2 2 0 001.42-.58M9.88 4.24A10.44 10.44 0 0112 4c5 0 9 4 10 8a11.79 11.79 0 01-3.22 5.05M6.1 6.1A11.82 11.82 0 002 12c1 4 5 8 10 8a10.58 10.58 0 005.9-1.86" /></svg>
              <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" /><circle cx="12" cy="12" r="3" stroke-width="2" /></svg>
            </button>
          </div>
          <button type="submit" :disabled="loading" class="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-semibold py-2.5 rounded-lg transition">
            {{ loading ? 'Yaratilmoqda...' : "Ro'yxatdan o'tish" }}
          </button>
          <p class="text-center text-xs text-slate-500 dark:text-slate-400">
            Hisobingiz bormi?
            <button type="button" @click="mode = 'login'" class="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">Tizimga kiring</button>
          </p>
        </form>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { reactive, ref, computed, watch, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useAuthModal } from '@/composables/useAuthModal';
import { splitFullName } from '@/utils/names';

const router = useRouter();
const authStore = useAuthStore();
const { isOpen, mode, anchor, close, handleSuccess } = useAuthModal();

const loading = ref(false);
const error = ref('');
const showLoginPassword = ref(false);
const showRegisterPassword = ref(false);

const loginForm = reactive({ login: '', password: '' });
const registerForm = reactive({ fullName: '', login: '', phone: '', email: '', password: '' });

// Agar tugma joyi ma'lum bo'lmasa (masalan BookView'dan ochilgan bo'lsa), sarlavha ostiga tushadi
const panelStyle = computed(() => {
  const width = Math.min(352, window.innerWidth - 16);
  if (anchor.value) {
    const right = Math.max(8, Math.min(anchor.value.right, window.innerWidth - width - 8));
    return { top: `${anchor.value.top}px`, right: `${right}px` };
  }
  return { top: '76px', left: '50%', transform: 'translateX(-50%)' };
});

const caretStyle = computed(() => {
  if (!anchor.value) return { right: '24px' };
  const width = Math.min(352, window.innerWidth - 16);
  const right = Math.max(8, Math.min(anchor.value.right, window.innerWidth - width - 8));
  const caretRight = Math.max(18, Math.min(anchor.value.centerRight - right - 6, width - 28));
  return { right: `${caretRight}px` };
});

watch(isOpen, (open) => {
  if (open) {
    error.value = '';
    loginForm.login = '';
    loginForm.password = '';
    showLoginPassword.value = false;
    showRegisterPassword.value = false;
    registerForm.fullName = '';
    registerForm.login = '';
    registerForm.phone = '';
    registerForm.email = '';
    registerForm.password = '';
  }
});

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && isOpen.value) close();
}
onMounted(() => document.addEventListener('keydown', onKeydown));
onUnmounted(() => document.removeEventListener('keydown', onKeydown));

function goToForgotPassword() {
  close();
  router.push({ name: 'ForgotPassword' });
}

async function handleLogin() {
  error.value = '';
  loading.value = true;
  try {
    await authStore.login({ login: loginForm.login.trim(), password: loginForm.password });
    handleSuccess();
  } catch (e: any) {
    error.value = e?.response?.data?.message || "Login yoki parol noto'g'ri";
  } finally {
    loading.value = false;
  }
}

async function handleRegister() {
  error.value = '';
  loading.value = true;
  try {
    const { firstName, lastName } = splitFullName(registerForm.fullName);
    await authStore.register({
      login: registerForm.login.trim(),
      password: registerForm.password,
      firstName,
      lastName,
      email: registerForm.email.trim(),
      phone: registerForm.phone.trim(),
    });
    handleSuccess();
  } catch (e: any) {
    error.value = e?.response?.data?.message || "Ro'yxatdan o'tishda xatolik yuz berdi";
  } finally {
    loading.value = false;
  }
}
</script>
