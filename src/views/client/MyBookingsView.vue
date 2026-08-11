<template>
  <div class="space-y-6">
    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 class="text-xl font-black text-slate-900 dark:text-white">Mening navbatlarim</h2>
        <p class="text-sm font-semibold text-slate-500 dark:text-slate-400">Bronlaringiz, statuslar va sharhlar shu yerda</p>
      </div>
      <RouterLink to="/businesses" class="w-fit rounded-xl bg-teal-600 px-4 py-2.5 text-sm font-black text-white transition hover:bg-teal-700">+ Yangi navbat</RouterLink>
    </div>

    <div v-if="loading" class="space-y-3">
      <div v-for="i in 3" :key="i" class="flex animate-pulse items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
        <div class="h-12 w-12 flex-shrink-0 rounded-2xl bg-slate-100 dark:bg-slate-700" />
        <div class="flex-1 space-y-2">
          <div class="h-3.5 w-1/3 rounded bg-slate-100 dark:bg-slate-700" />
          <div class="h-3 w-1/2 rounded bg-slate-100 dark:bg-slate-700" />
        </div>
      </div>
    </div>

    <div v-else-if="bookings.length === 0" class="rounded-3xl border border-dashed border-slate-200 bg-white py-16 text-center dark:border-slate-700 dark:bg-slate-800">
      <div class="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-teal-50 dark:bg-teal-500/10">
        <svg class="h-7 w-7 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
      </div>
      <p class="text-sm font-semibold text-slate-500 dark:text-slate-400">Hali navbatlaringiz yo'q</p>
      <RouterLink to="/businesses" class="mt-3 inline-block text-sm font-black text-teal-600 transition hover:underline dark:text-teal-300">Navbat olish</RouterLink>
    </div>

    <template v-else>
      <div class="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <button
          v-for="card in summaryCards"
          :key="card.key"
          type="button"
          @click="activeFilter = card.key"
          class="rounded-2xl border p-4 text-left transition"
          :class="activeFilter === card.key ? 'border-teal-400 bg-teal-50 dark:border-teal-500/60 dark:bg-teal-500/10' : 'border-slate-200 bg-white hover:border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-slate-600'"
        >
          <p class="text-xs font-bold text-slate-400">{{ card.label }}</p>
          <p class="mt-1 text-2xl font-black text-slate-900 dark:text-white">{{ card.count }}</p>
        </button>
      </div>

      <section v-if="nextBooking" class="rounded-3xl border border-teal-200 bg-teal-50 p-5 dark:border-teal-500/30 dark:bg-teal-500/10">
        <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div class="flex min-w-0 items-center gap-4">
            <div class="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-teal-600 text-lg font-black text-white">
              {{ bookingInitial(nextBooking) }}
            </div>
            <div class="min-w-0">
              <p class="text-xs font-black uppercase tracking-wide text-teal-700 dark:text-teal-300">Eng yaqin navbat</p>
              <h3 class="mt-1 truncate text-lg font-black text-slate-700 dark:text-white">{{ nextBooking.offeredServiceName || 'Xizmat' }}</h3>
              <p class="mt-1 truncate text-sm font-semibold text-slate-500 dark:text-slate-300">{{ nextBooking.businessName }} · {{ nextBooking.staffName || 'Usta tanlanmagan' }}</p>
              <p class="mt-1 text-sm font-bold text-slate-700 dark:text-slate-200">
                <i class="fa-regular fa-calendar-check"></i>
                {{ formatDateTime(nextBooking.startAt) }} - {{ formatTime(nextBooking.endAt) }}
              </p>
            </div>
          </div>
          <div class="flex flex-wrap items-center gap-2">
            <span class="rounded-full px-3 py-1.5 text-xs font-black" :class="statusClass(nextBooking.status)">{{ statusLabel(nextBooking.status) }}</span>
            <RouterLink
                :to="`/business/${nextBooking.businessId}`"
                class="rounded-xl border border-slate-200 px-3 py-2 text-xs font-black text-slate-700 transition hover:border-teal-400 hover:text-teal-700 dark:border-slate-600 dark:text-slate-200 dark:hover:border-teal-400 dark:hover:text-teal-300"
            >
              {{nextBooking.businessName}} sahifasi
            </RouterLink>
            <button
              v-if="canCancel(nextBooking.status)"
              @click="cancelTarget = nextBooking"
              class="rounded-xl cursor-pointer bg-red-50 px-3 py-2 text-xs font-black text-red-600 transition hover:bg-red-100 dark:bg-red-500/10 dark:text-red-300 dark:hover:bg-red-500/20"
            >
              Bekor qilish
            </button>
          </div>
        </div>
      </section>

      <div class="flex gap-2 overflow-x-auto pb-1">
        <button
          v-for="tab in filterTabs"
          :key="tab.key"
          type="button"
          @click="activeFilter = tab.key"
          class="whitespace-nowrap cursor-pointer rounded-full px-4 py-2 text-xs font-black transition"
          :class="activeFilter === tab.key ? 'bg-teal-600 text-white' : 'bg-gray-200 text-slate-500 hover:text-indigo-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-gray-700 dark:hover:text-white'"
        >
          {{ tab.label }}
        </button>
      </div>

      <section class="space-y-3">
        <div v-if="filteredBookings.length === 0" class="rounded-2xl border border-dashed border-slate-200 bg-white p-8 text-center dark:border-slate-700 dark:bg-slate-800">
          <p class="text-sm font-semibold text-slate-500 dark:text-slate-400">Bu filter bo'yicha navbat topilmadi.</p>
        </div>
        <div
          v-for="b in filteredBookings"
          :key="b.id"
          :class="['flex flex-col gap-3 rounded-2xl border border-l-4 border-slate-200 bg-white p-4 transition hover:border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-slate-600 sm:flex-row sm:items-center', statusBorderClass(b.status)]"
        >
          <div class="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-sm font-black text-slate-500 dark:bg-slate-700 dark:text-slate-300">
            {{ bookingInitial(b) }}
          </div>
          <div class="min-w-0 flex-1">
            <div class="flex flex-wrap items-center gap-2">
              <h4 class="truncate text-sm font-black text-slate-900 dark:text-white">{{ b.offeredServiceName || 'Xizmat' }}</h4>
              <span class="rounded-full px-2.5 py-1 text-xs font-bold" :class="statusClass(b.status)">{{ statusLabel(b.status) }}</span>
            </div>
            <p class="mt-1 truncate text-xs text-slate-500 dark:text-slate-400">{{ b.businessName }} · {{ b.staffName || 'Usta tanlanmagan' }}</p>
            <p class="mt-1 flex items-center gap-1 text-xs text-slate-400">
              <i class="fa-regular fa-calendar-check"></i>
              {{ bookingTimeRange(b) }}
            </p>
          </div>
          <div class="flex flex-wrap items-center gap-2 shrink-0">
            <RouterLink
                :to="`/business/${b.businessId}`"
                class="rounded-lg px-2.5 py-1.5 text-sm font-black text-slate-500 transition hover:text-teal-600 dark:text-slate-300 dark:hover:text-teal-300"
            >
              {{b.businessName}} sahifasi
            </RouterLink>
            <button
              v-if="canCancel(b.status)"
              @click="cancelTarget = b"
              class="rounded-lg cursor-pointer px-2.5 py-1.5 text-xs font-black text-red-600 transition hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10"
            >
              Bekor qilish
            </button>
            <button
              v-if="b.status === 'COMPLETED'"
              @click="openReview(b)"
              class="cursor-pointer rounded-lg px-2.5 py-1.5 text-xs font-black text-teal-600 transition hover:bg-teal-50 dark:text-teal-300 dark:hover:bg-teal-500/10"
            >
              {{ reviewedBookingIds.has(b.id) ? 'Yana sharh qoldirish' : 'Sharh qoldirish' }}
            </button>
          </div>
        </div>
      </section>
    </template>

    <div v-if="cancelTarget" @click.self="cancelTarget = null" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
      <div class="w-full max-w-sm space-y-4 rounded-2xl bg-white p-6 shadow-xl dark:bg-slate-800">
        <div class="flex items-center justify-between gap-3">
          <h3 class="text-lg font-black text-slate-700 dark:text-white">Navbatni bekor qilish</h3>
          <button
              @click="cancelTarget = null"
              class="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
          >
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>

        <p class="text-sm text-slate-500 dark:text-slate-400">
          <strong>{{ cancelTarget.offeredServiceName || 'Xizmat' }}</strong> - {{ formatDateTime(cancelTarget.startAt) }} uchun navbatni bekor qilishni tasdiqlaysizmi?
        </p>
        <div class="grid grid-cols-2 gap-2">
          <button @click="cancelTarget = null" class="rounded-lg cursor-pointer bg-slate-100 py-2 text-sm font-bold text-slate-600 transition hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600">Yo'q</button>
          <button @click="confirmCancel" :disabled="cancelling" class="rounded-lg cursor-pointer bg-red-600 py-2 text-sm font-bold text-white transition hover:bg-red-700 disabled:opacity-60">
            {{ cancelling ? 'Bekor qilinmoqda...' : 'Ha, bekor qilish' }}
          </button>
        </div>
      </div>
    </div>

    <div v-if="reviewTarget" @click.self="reviewTarget = null" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
      <div class="w-full max-w-md space-y-4 rounded-2xl bg-white p-6 shadow-xl dark:bg-slate-800">
        <div class="flex items-center justify-between gap-3">
          <h3 class="text-lg font-black text-slate-700 dark:text-white">Sharh qoldirish</h3>
          <button
              @click="reviewTarget = null"
              class="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
          >
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>
        <div class="flex items-center gap-3 rounded-2xl bg-slate-100 p-3 dark:bg-slate-900/30">
          <div class="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-teal-50 text-sm font-black text-teal-600 dark:bg-teal-500/10 dark:text-teal-300">
            {{ bookingInitial(reviewTarget) }}
          </div>
          <div class="min-w-0">
            <p class="truncate text-sm font-black text-slate-900 dark:text-white">{{ reviewTarget.businessName }}</p>
            <p class="truncate text-xs font-semibold text-slate-400">{{ reviewTarget.staffName || 'Usta tanlanmagan' }}</p>
          </div>
        </div>
        <div>
          <div class="flex gap-1">
            <button
              v-for="n in 5"
              :key="n"
              type="button"
              @click="reviewForm.stars = n"
              class="text-3xl transition hover:scale-110"
              :class="n <= reviewForm.stars ? 'text-amber-400' : 'text-slate-200 dark:text-slate-600'"
            >
              ★
            </button>
          </div>
          <p class="mt-1 text-xs font-semibold text-slate-400">1-2 yomon, 3 o'rtacha, 4 yaxshi, 5 a'lo</p>
        </div>
        <label class="block">
          <span class="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-200">Xizmat haqida fikringiz (ixtiyoriy)</span>
          <textarea v-model="reviewForm.comment" rows="3" class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-white" placeholder="Fikringiz..." />
        </label>
        <p v-if="reviewError" class="text-sm text-red-600 dark:text-red-400">{{ reviewError }}</p>
        <div class="grid grid-cols-2 gap-2">
          <button @click="reviewTarget = null" class="rounded-lg cursor-pointer bg-slate-100 py-2 text-sm font-bold text-slate-600 transition hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600">Bekor qilish</button>
          <button @click="submitReview" :disabled="submittingReview" class="rounded-lg cursor-pointer bg-teal-600 py-2 text-sm font-bold text-white transition hover:bg-teal-700 disabled:opacity-60">
            {{ submittingReview ? 'Yuborilmoqda...' : 'Yuborish' }}
          </button>
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
import type { Booking, BookingStatus } from '@/types/api';
import { statusLabel, statusClass, statusBorderClass } from '@/utils/format';
import { apiErrorMessage } from '@/utils/apiError';

type BookingFilter = 'all' | 'upcoming' | 'completed' | 'cancelled';

const authStore = useAuthStore();
const toast = useToast();
const bookings = ref<Booking[]>([]);
const loading = ref(false);
const reviewedBookingIds = ref<Set<string>>(new Set());
const activeFilter = ref<BookingFilter>('all');

const reviewTarget = ref<Booking | null>(null);
const reviewForm = reactive({ stars: 5, comment: '' });
const reviewError = ref('');
const submittingReview = ref(false);

const cancelTarget = ref<Booking | null>(null);
const cancelling = ref(false);

const PAST_STATUSES: BookingStatus[] = ['COMPLETED', 'CANCELLED_BY_CUSTOMER', 'CANCELLED_BY_BUSINESS', 'NO_SHOW'];
const CANCELLED_STATUSES: BookingStatus[] = ['CANCELLED_BY_CUSTOMER', 'CANCELLED_BY_BUSINESS', 'NO_SHOW'];

const upcoming = computed(() => bookings.value.filter((b) => !PAST_STATUSES.includes(b.status)));
const completed = computed(() => bookings.value.filter((b) => b.status === 'COMPLETED'));
const cancelled = computed(() => bookings.value.filter((b) => CANCELLED_STATUSES.includes(b.status)));
const nextBooking = computed(() => [...upcoming.value].sort((a, b) => a.startAt.localeCompare(b.startAt))[0] ?? null);

const summaryCards = computed(() => [
  { key: 'all' as const, label: 'Jami', count: bookings.value.length },
  { key: 'upcoming' as const, label: 'Kelayotgan', count: upcoming.value.length },
  { key: 'completed' as const, label: 'Bajarilgan', count: completed.value.length },
  { key: 'cancelled' as const, label: 'Bekor / kelmagan', count: cancelled.value.length },
]);

const filterTabs = [
  { key: 'all' as const, label: 'Hammasi' },
  { key: 'upcoming' as const, label: 'Kelayotgan' },
  { key: 'completed' as const, label: 'Bajarilgan' },
  { key: 'cancelled' as const, label: 'Bekor qilingan' },
];

const filteredBookings = computed(() => {
  if (activeFilter.value === 'upcoming') return upcoming.value;
  if (activeFilter.value === 'completed') return completed.value;
  if (activeFilter.value === 'cancelled') return cancelled.value;
  return bookings.value;
});

function formatDateTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString('uz-UZ', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function formatTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' });
}

function bookingTimeRange(booking: Booking): string {
  return `${formatDateTime(booking.startAt)} - ${formatTime(booking.endAt)}`;
}

function bookingInitial(booking: Booking): string {
  return (booking.offeredServiceName || booking.businessName || 'N').trim().charAt(0).toUpperCase();
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
  } catch (e) {
    toast.error(apiErrorMessage(e, 'Bekor qilishda xatolik yuz berdi'));
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
  } catch (e) {
    reviewError.value = apiErrorMessage(e, 'Sharh yuborishda xatolik');
  } finally {
    submittingReview.value = false;
  }
}

onMounted(loadBookings);
</script>
