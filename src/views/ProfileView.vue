<template>
  <div class="min-h-screen bg-slate-50/50 dark:bg-slate-900 transition-colors">
    <AppHeader />
    <div class="max-w-md mx-auto p-4 sm:p-6 lg:p-8">
      <div v-if="!authStore.user" class="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 text-center">
        <p class="text-slate-600 dark:text-slate-300 mb-4">Profilni ko'rish uchun tizimga kiring.</p>
        <RouterLink to="/login" class="inline-block px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">Tizimga kirish</RouterLink>
      </div>

      <template v-else>
        <!-- Avatar + stats -->
        <div class="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
          <div class="flex flex-col items-center">
            <div class="relative w-24 h-24 mb-4">
              <div class="w-24 h-24 rounded-full overflow-hidden bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-4xl font-bold">
                <img v-if="mediaUrl(profile?.avatarUrl)" :src="mediaUrl(profile?.avatarUrl)!" class="w-full h-full object-cover" alt="avatar" />
                <span v-else>{{ (profile?.displayName || authStore.user.login).charAt(0).toUpperCase() }}</span>
              </div>
              <label
                class="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-indigo-600 hover:bg-indigo-700 flex items-center justify-center cursor-pointer shadow-sm transition-colors"
                :class="{ 'opacity-60 pointer-events-none': uploadingAvatar }"
              >
                <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                <input type="file" accept="image/jpeg,image/png,image/webp" class="hidden" @change="onAvatarChange" />
              </label>
            </div>
            <h1 class="text-xl font-bold text-slate-900 dark:text-white">{{ profile?.displayName || authStore.user.login }}</h1>
            <p class="text-sm text-slate-500 dark:text-slate-400">@{{ authStore.user.login }}</p>
          </div>

          <div class="grid grid-cols-2 gap-3 mt-5 pt-5 border-t border-slate-200 dark:border-slate-700">
            <div class="text-center">
              <p class="text-2xl font-bold text-slate-900 dark:text-white">{{ stats.total }}</p>
              <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Jami navbat</p>
            </div>
            <div class="text-center">
              <p class="text-2xl font-bold text-slate-900 dark:text-white">{{ stats.businesses }}</p>
              <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Tashrif buyurgan salon</p>
            </div>
          </div>
        </div>

        <!-- Edit form -->
        <div class="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 mt-6">
          <h2 class="text-sm font-bold text-slate-800 dark:text-slate-100 mb-4">Ma'lumotlarni tahrirlash</h2>
          <form @submit.prevent="save" class="space-y-3">
            <div>
              <label class="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">Ism Familiya</label>
              <input v-model="form.displayName" type="text" class="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div>
              <label class="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">Email</label>
              <input v-model="form.email" type="email" class="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div>
              <label class="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">Telefon</label>
              <input v-model="form.phone" type="tel" placeholder="+998901234567" class="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div>
              <label class="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">Yangi parol</label>
              <input v-model="form.password" type="password" placeholder="O'zgartirmaslik uchun bo'sh qoldiring" class="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <button type="submit" :disabled="saving" class="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white text-sm font-semibold py-2.5 rounded-lg transition">
              {{ saving ? 'Saqlanmoqda...' : 'Saqlash' }}
            </button>
          </form>
        </div>

        <div class="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 mt-6">
          <button @click="showLogoutConfirm = true" class="w-full text-left flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clip-rule="evenodd" /></svg>
            Tizimdan chiqish
          </button>
        </div>
      </template>
    </div>

    <div v-if="showLogoutConfirm" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50">
      <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 max-w-sm w-full shadow-xl space-y-4">
        <h3 class="text-lg font-bold text-slate-900 dark:text-white">Tizimdan chiqish</h3>
        <p class="text-sm text-slate-500 dark:text-slate-400">Haqiqatan ham tizimdan chiqmoqchimisiz?</p>
        <div class="grid grid-cols-2 gap-2">
          <button @click="showLogoutConfirm = false" class="text-sm font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg py-2 transition">Bekor qilish</button>
          <button @click="logout" class="text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg py-2 transition">Chiqish</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { useRouter, RouterLink } from 'vue-router';
import { useToast } from 'vue-toastification';
import { useAuthStore } from '@/stores/auth';
import { usersApi } from '@/api/users';
import { bookingsApi } from '@/api/bookings';
import { mediaUrl } from '@/utils/media';
import AppHeader from '@/components/AppHeader.vue';
import type { User } from '@/types/api';

const router = useRouter();
const authStore = useAuthStore();
const toast = useToast();

const profile = ref<User | null>(null);
const saving = ref(false);
const uploadingAvatar = ref(false);
const showLogoutConfirm = ref(false);
const stats = reactive({ total: 0, businesses: 0 });

const form = reactive({ displayName: '', email: '', phone: '', password: '' });

const MAX_AVATAR_SIZE = 5 * 1024 * 1024;
const ALLOWED_AVATAR_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

function applyProfile(data: User) {
  profile.value = data;
  form.displayName = data.displayName ?? '';
  form.email = data.email ?? '';
  form.phone = data.phone ?? '';
  form.password = '';
}

async function loadProfile() {
  if (!authStore.user) return;
  const { data } = await usersApi.getById(authStore.user.userId);
  applyProfile(data);
}

async function loadStats() {
  if (!authStore.user) return;
  const { data } = await bookingsApi.getAll({ customerId: authStore.user.userId, size: 200 });
  stats.total = data.totalElements;
  stats.businesses = new Set(data.content.map((b) => b.businessId)).size;
}

onMounted(() => {
  loadProfile();
  loadStats();
});

async function onAvatarChange(e: Event) {
  const input = e.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file || !authStore.user) return;
  if (!ALLOWED_AVATAR_TYPES.includes(file.type)) {
    toast.error('Faqat JPEG, PNG yoki WEBP formatidagi rasm yuklang');
    input.value = '';
    return;
  }
  if (file.size > MAX_AVATAR_SIZE) {
    toast.error('Rasm hajmi 5MB dan oshmasligi kerak');
    input.value = '';
    return;
  }
  uploadingAvatar.value = true;
  try {
    const { data } = await usersApi.uploadAvatar(authStore.user.userId, file);
    applyProfile(data);
    authStore.updateAvatar(data.avatarUrl);
    toast.success('Rasm yangilandi');
  } catch {
    toast.error('Rasmni yuklashda xatolik');
  } finally {
    uploadingAvatar.value = false;
    input.value = '';
  }
}

async function save() {
  if (!authStore.user) return;
  saving.value = true;
  try {
    const { data } = await usersApi.update(authStore.user.userId, {
      displayName: form.displayName.trim() || undefined,
      email: form.email.trim() || undefined,
      phone: form.phone.trim() || undefined,
      password: form.password || undefined,
    });
    applyProfile(data);
    authStore.updateProfile({ displayName: data.displayName });
    toast.success('Profil yangilandi');
  } catch (e: any) {
    toast.error(e?.response?.data?.message || 'Saqlashda xatolik yuz berdi');
  } finally {
    saving.value = false;
  }
}

const logout = () => {
  authStore.logout();
  router.push('/login');
};
</script>
