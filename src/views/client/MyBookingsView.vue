<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-xl font-bold text-slate-900 dark:text-white">Mening navbatlarim</h2>
        <p class="text-sm text-slate-500 dark:text-slate-400">Barcha buyurtmalaringiz shu yerda</p>
      </div>
      <RouterLink to="/businesses" class="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-3 py-2 rounded-lg transition">+ Yangi navbat</RouterLink>
    </div>

    <div v-if="loading" class="text-center py-16 text-slate-400">Yuklanmoqda...</div>
    <div v-else-if="bookings.length === 0" class="text-center py-16 bg-white dark:bg-slate-800 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
      <p class="text-slate-400">Hali navbatlaringiz yo'q</p>
      <RouterLink to="/businesses" class="inline-block mt-3 text-indigo-600 dark:text-indigo-400 font-semibold text-sm">Navbat olish →</RouterLink>
    </div>
    <div v-else class="space-y-3">
      <div
        v-for="b in bookings" :key="b.id"
        :class="['bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 border-l-4 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3', statusBorderClass(b.status)]"
      >
        <div>
          <h4 class="text-sm font-bold text-slate-900 dark:text-white">{{ b.offeredServiceName || 'Xizmat' }}</h4>
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{{ b.businessName }} · {{ b.staffName || '—' }}</p>
          <p class="text-xs text-slate-400 mt-0.5">{{ formatDateTime(b.startAt) }} — {{ formatTime(b.endAt) }}</p>
        </div>
        <div class="flex items-center gap-2 shrink-0">
          <span class="text-xs font-semibold px-2.5 py-1 rounded-full" :class="statusClass(b.status)">{{ statusLabel(b.status) }}</span>
          <button
            v-if="canCancel(b.status)"
            @click="cancelTarget = b"
            class="text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 px-2.5 py-1 rounded-lg transition"
          >
            Bekor qilish
          </button>
          <button
            v-if="b.status === 'COMPLETED' && !reviewedBookingIds.has(b.id)"
            @click="openReview(b)"
            class="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 px-2.5 py-1 rounded-lg transition"
          >
            Sharh qoldirish
          </button>
        </div>
      </div>
    </div>

    <div v-if="cancelTarget" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50">
      <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 max-w-sm w-full shadow-xl space-y-4">
        <h3 class="text-lg font-bold text-slate-900 dark:text-white">Navbatni bekor qilish</h3>
        <p class="text-sm text-slate-500 dark:text-slate-400">
          <strong>{{ cancelTarget.offeredServiceName || 'Xizmat' }}</strong> — {{ formatDateTime(cancelTarget.startAt) }} uchun navbatni bekor qilishni tasdiqlaysizmi?
        </p>
        <div class="grid grid-cols-2 gap-2">
          <button @click="cancelTarget = null" class="text-sm font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg py-2 transition">Yo'q</button>
          <button @click="confirmCancel" :disabled="cancelling" class="text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg py-2 transition disabled:opacity-60">
            {{ cancelling ? 'Bekor qilinmoqda...' : 'Ha, bekor qilish' }}
          </button>
        </div>
      </div>
    </div>

    <div v-if="reviewTarget" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50">
      <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 max-w-sm w-full shadow-xl space-y-4">
        <h3 class="text-lg font-bold text-slate-900 dark:text-white">Sharh qoldirish</h3>
        <div class="flex gap-1">
          <button v-for="n in 5" :key="n" @click="reviewForm.stars = n" type="button" class="text-2xl" :class="n <= reviewForm.stars ? 'text-amber-400' : 'text-slate-200 dark:text-slate-600'">★</button>
        </div>
        <textarea v-model="reviewForm.comment" rows="3" class="w-full border border-slate-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg px-3 py-2 text-sm" placeholder="Fikringiz..."></textarea>
        <p v-if="reviewError" class="text-sm text-red-600 dark:text-red-400">{{ reviewError }}</p>
        <div class="grid grid-cols-2 gap-2">
          <button @click="reviewTarget = null" class="text-sm font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg py-2 transition">Bekor qilish</button>
          <button @click="submitReview" :disabled="submittingReview" class="text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg py-2 transition disabled:opacity-60">Yuborish</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue';
import { RouterLink } from 'vue-router';
import { useToast } from 'vue-toastification';
import { bookingsApi } from '@/api/bookings';
import { reviewsApi } from '@/api/reviews';
import { useAuthStore } from '@/stores/auth';
import type { Booking } from '@/types/api';
import { statusLabel, statusClass, statusBorderClass } from '@/utils/format';

const authStore = useAuthStore();
const toast = useToast();
const bookings = ref<Booking[]>([]);
const loading = ref(false);
const reviewedBookingIds = ref<Set<string>>(new Set());

const reviewTarget = ref<Booking | null>(null);
const reviewForm = reactive({ stars: 5, comment: '' });
const reviewError = ref('');
const submittingReview = ref(false);

const cancelTarget = ref<Booking | null>(null);
const cancelling = ref(false);

function formatDateTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString('uz-UZ', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function formatTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' });
}

function canCancel(status: string): boolean {
  return status === 'PENDING' || status === 'CONFIRMED';
}

async function loadBookings() {
  if (!authStore.user) return;
  loading.value = true;
  try {
    const { data } = await bookingsApi.getAll({ customerId: authStore.user.userId, size: 100 });
    bookings.value = data.content.sort((a, b) => b.startAt.localeCompare(a.startAt));
  } finally {
    loading.value = false;
  }
}

async function confirmCancel() {
  if (!cancelTarget.value) return;
  cancelling.value = true;
  try {
    await bookingsApi.update(cancelTarget.value.id, { status: 'CANCELLED_BY_CUSTOMER' });
    cancelTarget.value = null;
    toast.success('Navbat bekor qilindi');
    await loadBookings();
  } catch (e: any) {
    toast.error(e?.response?.data?.message || 'Bekor qilishda xatolik yuz berdi');
  } finally {
    cancelling.value = false;
  }
}

function openReview(b: Booking) {
  reviewTarget.value = b;
  reviewForm.stars = 5;
  reviewForm.comment = '';
  reviewError.value = '';
}

async function submitReview() {
  if (!reviewTarget.value) return;
  submittingReview.value = true;
  reviewError.value = '';
  try {
    await reviewsApi.create({ bookingId: reviewTarget.value.id, stars: reviewForm.stars, comment: reviewForm.comment.trim() || undefined });
    reviewedBookingIds.value.add(reviewTarget.value.id);
    reviewTarget.value = null;
    toast.success('Sharh yuborildi, rahmat!');
  } catch (e: any) {
    reviewError.value = e?.response?.data?.message || 'Sharh yuborishda xatolik';
  } finally {
    submittingReview.value = false;
  }
}

onMounted(loadBookings);
</script>
