<template>
  <div class="min-h-screen bg-slate-50/50 dark:bg-slate-900 transition-colors">
    <AppHeader />
    <div class="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">
      <div v-if="!authStore.user" class="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 text-center">
        <p class="text-slate-600 dark:text-slate-300 mb-4">Profilni ko'rish uchun tizimga kiring.</p>
        <RouterLink to="/login" class="inline-block px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition">Tizimga kirish</RouterLink>
      </div>

      <div v-else-if="loading" class="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-4">
        <div class="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 animate-pulse">
          <div class="flex items-center gap-4">
            <div class="w-16 h-16 rounded-full bg-slate-200 dark:bg-slate-700" />
            <div class="space-y-2">
              <div class="h-4 w-32 bg-slate-200 dark:bg-slate-700 rounded" />
              <div class="h-3 w-20 bg-slate-200 dark:bg-slate-700 rounded" />
            </div>
          </div>
        </div>
        <div class="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 animate-pulse space-y-3">
          <div class="h-3 w-40 bg-slate-200 dark:bg-slate-700 rounded" />
          <div class="h-9 bg-slate-100 dark:bg-slate-700 rounded-lg" />
          <div class="h-9 bg-slate-100 dark:bg-slate-700 rounded-lg" />
        </div>
      </div>

      <template v-else>
        <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div class="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center gap-4 border-b border-slate-200 dark:border-slate-700">
            <div class="relative w-16 h-16 flex-shrink-0">
              <div class="w-16 h-16 rounded-full overflow-hidden bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center text-white text-2xl font-bold ring-4 ring-teal-50 dark:ring-slate-700">
                <img v-if="profile?.avatarUrl" :src="getAvatarUrl(profile?.avatarUrl)!" class="w-full h-full object-cover" alt="avatar" />
                <span v-else>{{ firstInitial(profile || authStore.user) }}</span>
              </div>
              <label
                class="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-teal-600 hover:bg-teal-700 flex items-center justify-center cursor-pointer shadow-sm transition-colors"
                :class="{ 'opacity-60 pointer-events-none': uploadingAvatar }"
              >
                <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                <input type="file" accept="image/jpeg,image/png,image/webp" class="hidden" @change="onAvatarChange" />
              </label>
            </div>
            <div class="min-w-0 flex-1">
              <h1 class="text-lg font-bold text-slate-900 dark:text-white truncate">{{ personName(profile || authStore.user) || authStore.user.login }}</h1>
              <p class="text-sm text-slate-500 dark:text-slate-400 truncate">@{{ authStore.user.login }}</p>
            </div>
            <div class="flex flex-wrap gap-2">
              <RouterLink to="/client/my" class="rounded-xl border border-slate-200 px-3 py-2 text-xs font-black text-slate-600 transition hover:border-teal-400 hover:text-teal-700 dark:border-slate-600 dark:text-slate-300 dark:hover:border-teal-400 dark:hover:text-teal-300">
                Navbatlarim
              </RouterLink>
              <a
                  class="rounded-xl cursor-pointer bg-teal-600 px-3 py-2 text-xs font-black text-white transition hover:bg-teal-700"
                  href="https://onetime-managment.netlify.app/register"
              >
                Biznes yaratish
              </a>
<!--              <button type="button"-->
<!--                      @click="openBusinessApp" -->
<!--                      class="rounded-xl cursor-pointer bg-teal-600 px-3 py-2 text-xs font-black text-white transition hover:bg-teal-700"-->
<!--              >-->
<!--                Biznes yaratish-->
<!--              </button>-->
            </div>
          </div>

          <div class="p-5 sm:p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <form @submit.prevent="save" class="space-y-3.5">
              <div class="flex items-center justify-between gap-3">
                <h2 class="text-sm font-bold text-slate-800 dark:text-slate-100">Shaxsiy ma'lumotlar</h2>
                <span class="text-[11px] text-slate-400">Profil</span>
              </div>
              <div>
                <label class="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">Ism</label>
                <div class="relative">
                  <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                  <input v-model="form.firstName" type="text" autocomplete="given-name" placeholder="Masalan: Shaxzod" class="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
                </div>
              </div>
              <div>
                <label class="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">Familiya</label>
                <div class="relative">
                  <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                  <input v-model="form.lastName" type="text" autocomplete="family-name" placeholder="Masalan: Ruziqulov" class="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
                </div>
              </div>
              <div>
                <label class="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">Email</label>
                <div class="relative">
                  <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                  <input v-model="form.email" type="email" autocomplete="email" placeholder="name@example.com" class="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
                </div>
              </div>
              <div>
                <label class="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">Telefon</label>
                <div class="relative">
                  <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                  <input v-model="form.phone" type="tel" autocomplete="tel" placeholder="+998901234567" class="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
                </div>
              </div>
              <button type="submit" :disabled="saving" class="w-full sm:w-auto px-5 bg-teal-600 hover:bg-teal-700 disabled:opacity-60 text-white text-sm font-semibold py-2.5 rounded-lg transition">
                {{ saving ? 'Saqlanmoqda...' : "Ma'lumotlarni saqlash" }}
              </button>
            </form>

            <form @submit.prevent="changePassword" class="space-y-3.5 lg:border-l lg:border-slate-200 lg:dark:border-slate-700 lg:pl-6">
              <div class="flex items-center justify-between gap-3">
                <h2 class="text-sm font-bold text-slate-800 dark:text-slate-100">Parolni o'zgartirish</h2>
                <span class="text-[11px] text-slate-400">Xavfsizlik</span>
              </div>
              <div>
                <label class="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">Joriy parol</label>
                <div class="relative">
                  <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                  <input v-model="passwordForm.currentPassword" :type="showCurrentPassword ? 'text' : 'password'" autocomplete="current-password" placeholder="Joriy parol" class="w-full pl-9 pr-10 py-2 rounded-lg border border-slate-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
                  <button type="button" class="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-md transition-colors" @click="showCurrentPassword = !showCurrentPassword" :aria-label="showCurrentPassword ? 'Parolni yashirish' : 'Parolni ko‘rsatish'">
                    <svg v-if="showCurrentPassword" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3l18 18M10.58 10.58A2 2 0 0012 14a2 2 0 001.42-.58M9.88 4.24A9.77 9.77 0 0112 4c5 0 9 4 10 8a11.8 11.8 0 01-2.1 3.62M6.1 6.1A11.8 11.8 0 002 12c1 4 5 8 10 8 1.4 0 2.72-.31 3.9-.86" /></svg>
                    <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15a3 3 0 100-6 3 3 0 000 6z" /></svg>
                  </button>
                </div>
              </div>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label class="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">Yangi parol</label>
                  <div class="relative">
                    <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                    <input v-model="passwordForm.newPassword" :type="showNewPassword ? 'text' : 'password'" autocomplete="new-password" placeholder="Kamida 4 belgi" class="w-full pl-9 pr-10 py-2 rounded-lg border border-slate-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
                    <button type="button" class="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-md transition-colors" @click="showNewPassword = !showNewPassword" :aria-label="showNewPassword ? 'Parolni yashirish' : 'Parolni ko‘rsatish'">
                      <svg v-if="showNewPassword" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3l18 18M10.58 10.58A2 2 0 0012 14a2 2 0 001.42-.58M9.88 4.24A9.77 9.77 0 0112 4c5 0 9 4 10 8a11.8 11.8 0 01-2.1 3.62M6.1 6.1A11.8 11.8 0 002 12c1 4 5 8 10 8 1.4 0 2.72-.31 3.9-.86" /></svg>
                      <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15a3 3 0 100-6 3 3 0 000 6z" /></svg>
                    </button>
                  </div>
                </div>
                <div>
                  <label class="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">Tasdiqlash</label>
                  <div class="relative">
                    <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                    <input v-model="passwordForm.confirmPassword" :type="showConfirmPassword ? 'text' : 'password'" autocomplete="new-password" placeholder="Yangi parolni qayta kiriting" class="w-full pl-9 pr-10 py-2 rounded-lg border border-slate-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
                    <button type="button" class="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-md transition-colors" @click="showConfirmPassword = !showConfirmPassword" :aria-label="showConfirmPassword ? 'Parolni yashirish' : 'Parolni ko‘rsatish'">
                      <svg v-if="showConfirmPassword" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3l18 18M10.58 10.58A2 2 0 0012 14a2 2 0 001.42-.58M9.88 4.24A9.77 9.77 0 0112 4c5 0 9 4 10 8a11.8 11.8 0 01-2.1 3.62M6.1 6.1A11.8 11.8 0 002 12c1 4 5 8 10 8 1.4 0 2.72-.31 3.9-.86" /></svg>
                      <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15a3 3 0 100-6 3 3 0 000 6z" /></svg>
                    </button>
                  </div>
                </div>
              </div>
              <button type="submit" :disabled="passwordSaving" class="w-full sm:w-auto px-5 bg-teal-600 hover:bg-teal-700 disabled:opacity-60 text-white text-sm font-semibold py-2.5 rounded-lg transition">
                {{ passwordSaving ? "O'zgartirilmoqda..." : "Parolni saqlash" }}
              </button>
            </form>
          </div>
        </div>

      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { RouterLink } from 'vue-router';
import { useToast } from 'vue-toastification';
import { useAuthStore } from '@/stores/auth';
import { usersApi } from '@/api/users';
import { mediaUrl } from '@/utils/media';
import { firstInitial, personName } from '@/utils/names';
import { apiErrorMessage } from '@/utils/apiError';
import AppHeader from '@/components/AppHeader.vue';
import type { User } from '@/types/api';

const authStore = useAuthStore();
const toast = useToast();

const profile = ref<User | null>(null);
const loading = ref(true);
const saving = ref(false);
const passwordSaving = ref(false);
const uploadingAvatar = ref(false);
const showCurrentPassword = ref(false);
const showNewPassword = ref(false);
const showConfirmPassword = ref(false);
// const businessAppUrl = (import.meta.env.VITE_BUSINESS_APP_URL as string | undefined) || 'http://localhost:5174';

const form = reactive({ firstName: '', lastName: '', email: '', phone: '' });
const passwordForm = reactive({ currentPassword: '', newPassword: '', confirmPassword: '' });

const MAX_AVATAR_SIZE = 5 * 1024 * 1024;
const ALLOWED_AVATAR_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

function applyProfile(data: User) {
  profile.value = data;
  form.firstName = data.firstName ?? '';
  form.lastName = data.lastName ?? '';
  form.email = data.email ?? '';
  form.phone = data.phone ?? '';
}

async function loadProfile() {
  if (!authStore.user) return;
  const { data } = await usersApi.getById(authStore.user.userId);
  applyProfile(data);
}

// function openBusinessApp() {
  // window.location.href = businessAppUrl;
// }

onMounted(async () => {
  try {
    await loadProfile();
  } finally {
    loading.value = false;
  }
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
  } catch (e) {
    toast.error(apiErrorMessage(e, 'Rasmni yuklashda xatolik'));
  } finally {
    uploadingAvatar.value = false;
    input.value = '';
  }
}

async function save() {
  if (!authStore.user) return;
  if (!form.firstName.trim()) {
    toast.error('Ism kiritilishi shart');
    return;
  }
  saving.value = true;
  try {
    const { data } = await usersApi.update(authStore.user.userId, {
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim() || undefined,
      email: form.email.trim() || undefined,
      phone: form.phone.trim() || undefined,
    });
    applyProfile(data);
    authStore.updateProfile({ firstName: data.firstName, lastName: data.lastName });
    toast.success('Profil yangilandi');
  } catch (e) {
    toast.error(apiErrorMessage(e, 'Saqlashda xatolik yuz berdi'));
  } finally {
    saving.value = false;
  }
}

async function changePassword() {
  if (!passwordForm.currentPassword || !passwordForm.newPassword) {
    toast.error('Joriy parol va yangi parolni kiriting');
    return;
  }
  if (passwordForm.newPassword.length < 4) {
    toast.error("Yangi parol kamida 4 belgidan iborat bo'lishi kerak");
    return;
  }
  if (passwordForm.newPassword !== passwordForm.confirmPassword) {
    toast.error('Yangi parollar mos kelmadi');
    return;
  }
  passwordSaving.value = true;
  try {
    await usersApi.changePassword({
      currentPassword: passwordForm.currentPassword,
      newPassword: passwordForm.newPassword,
    });
    passwordForm.currentPassword = '';
    passwordForm.newPassword = '';
    passwordForm.confirmPassword = '';
    toast.success("Parol o'zgartirildi");
  } catch (e) {
    toast.error(apiErrorMessage(e, "Parolni o'zgartirishda xatolik yuz berdi"));
  } finally {
    passwordSaving.value = false;
  }
}

const BASE_URL = import.meta.env.VITE_BASE_API as string;

const getAvatarUrl = (url: string | undefined): string => {
  if (!url) return "";
  if (url.startsWith("https")) return url;
  return `${BASE_URL}${url}`;
};

</script>
