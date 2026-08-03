<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-xl font-bold text-slate-900 dark:text-white">Mening navbatlarim</h2>
        <p class="text-sm text-slate-500 dark:text-slate-400">Barcha buyurtmalaringiz shu yerda</p>
      </div>
      <RouterLink to="/businesses" class="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-3.5 py-2 rounded-lg transition flex-shrink-0">+ Yangi navbat</RouterLink>
    </div>

    <!-- Loading skeleton -->
    <div v-if="loading" class="space-y-3">
      <div v-for="i in 3" :key="i" class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 animate-pulse flex items-center gap-4">
        <div class="w-11 h-11 rounded-xl bg-slate-100 dark:bg-slate-700 flex-shrink-0" />
        <div class="flex-1 space-y-2">
          <div class="h-3.5 w-1/3 bg-slate-100 dark:bg-slate-700 rounded" />
          <div class="h-3 w-1/2 bg-slate-100 dark:bg-slate-700 rounded" />
        </div>
      </div>
    </div>

    <!-- Empty state -->
    <div v-else-if="bookings.length === 0" class="text-center py-16 bg-white dark:bg-slate-800 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
      <div class="w-14 h-14 mx-auto mb-3 rounded-full bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center">
        <svg class="w-7 h-7 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
      </div>
      <p class="text-slate-500 dark:text-slate-400 text-sm">Hali navbatlaringiz yo'q</p>
      <RouterLink to="/businesses" class="inline-block mt-3 text-indigo-600 dark:text-indigo-400 font-semibold text-sm transition hover:underline">Navbat olish →</RouterLink>
    </div>

    <template v-else>
      <!-- Upcoming -->
      <section v-if="upcoming.length > 0" class="space-y-3">
        <h3 class="text-xs font-bold uppercase tracking-wide text-slate-400">Kelayotgan navbatlar</h3>
        <div
          v-for="b in upcoming" :key="b.id"
          :class="['bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 border-l-4 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center gap-3', statusBorderClass(b.status)]"
        >
          <div class="w-11 h-11 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-500 dark:text-indigo-300 flex items-center justify-center font-bold text-sm flex-shrink-0">
            {{ (b.offeredServiceName || 'X').charAt(0).toUpperCase() }}
          </div>
          <div class="flex-1 min-w-0">
            <h4 class="text-sm font-bold text-slate-900 dark:text-white truncate">{{ b.offeredServiceName || 'Xizmat' }}</h4>
            <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">{{ b.businessName }} · {{ b.staffName || '—' }}</p>
            <p class="text-xs items-center flex gap-1 text-slate-400 mt-0.5">
              <i class="fa-regular fa-calendar-check"></i>
              {{ formatDateTime(b.startAt) }} — {{ formatTime(b.endAt) }}
            </p>
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
          </div>
        </div>
      </section>

      <!-- Past -->
      <section v-if="past.length > 0" class="space-y-3">
        <h3 class="text-xs font-bold uppercase tracking-wide text-slate-400">O'tgan navbatlar</h3>
        <div
          v-for="b in past" :key="b.id"
          :class="['bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 border-l-4 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center gap-3 opacity-90', statusBorderClass(b.status)]"
        >
          <div class="w-11 h-11 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-400 flex items-center justify-center font-bold text-sm flex-shrink-0">
            {{ (b.offeredServiceName || 'X').charAt(0).toUpperCase() }}
          </div>
          <div class="flex-1 min-w-0">
            <h4 class="text-sm font-bold text-slate-900 dark:text-white truncate">{{ b.offeredServiceName || 'Xizmat' }}</h4>
            <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">{{ b.businessName }} · {{ b.staffName || '—' }}</p>
            <p class="text-xs flex items-center gap-1 text-slate-400 mt-0.5">
              <i class="fa-regular fa-calendar-check"></i>
              {{ formatDateTime(b.startAt) }}
            </p>
          </div>
          <div class="flex items-center gap-2 shrink-0">
            <span class="text-xs font-semibold px-2.5 py-1 rounded-full" :class="statusClass(b.status)">{{ statusLabel(b.status) }}</span>
            <button
              v-if="b.status === 'COMPLETED'"
              @click="openReview(b)"
              class="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 px-2.5 py-1 rounded-lg transition"
            >
              {{ reviewedBookingIds.has(b.id) ? 'Yana sharh qoldirish' : 'Sharh qoldirish' }}
            </button>
          </div>
        </div>
      </section>
    </template>

    <div
        v-if="cancelTarget"
        @click.self="cancelTarget = null"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50">
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

    <div
        v-if="reviewTarget"
        @click.self="reviewTarget = null"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50"
    >
      <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 max-w-sm w-full shadow-xl space-y-4">
        <h3 class="text-lg font-bold text-slate-900 dark:text-white">Sharh qoldirish</h3>
        <div class="flex gap-1">
          <button v-for="n in 5" :key="n" @click="reviewForm.stars = n" type="button" class="text-2xl transition hover:scale-110 hover:text-amber-400" :class="n <= reviewForm.stars ? 'text-amber-400' : 'text-slate-200 dark:text-slate-600'">★</button>
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
import { ref, computed, onMounted, reactive } from 'vue';
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

const PAST_STATUSES = ['COMPLETED', 'CANCELLED_BY_CUSTOMER', 'CANCELLED_BY_BUSINESS', 'NO_SHOW'];

const upcoming = computed(() => bookings.value.filter((b) => !PAST_STATUSES.includes(b.status)));
const past = computed(() => bookings.value.filter((b) => PAST_STATUSES.includes(b.status)));

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
