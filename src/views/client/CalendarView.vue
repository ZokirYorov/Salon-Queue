<template>
  <div class="space-y-6">
    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 class="text-xl font-black text-slate-900 dark:text-white">{{ t('calendar.title') }}</h2>
        <p class="text-sm font-semibold text-slate-500 dark:text-slate-400">
          {{ t('calendar.subtitle') }}
        </p>
      </div>
      <div class="flex items-center gap-2">
        <button
            type="button"
            class="flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:border-teal-400 hover:text-teal-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
            :aria-label="t('calendar.prevMonth')"
            @click="shiftMonth(-1)"
        >
          <ChevronLeft class="h-4 w-4" />
        </button>
        <DatePicker :model-value="selectedKey" @update:model-value="pickDate" />
        <button
            type="button"
            class="flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:border-teal-400 hover:text-teal-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
            :aria-label="t('calendar.nextMonth')"
            @click="shiftMonth(1)"
        >
          <ChevronRight class="h-4 w-4" />
        </button>
        <button
            type="button"
            class="cursor-pointer rounded-xl bg-teal-600 px-3 py-2 text-xs font-black text-white transition hover:bg-teal-700"
            @click="goToday"
        >
          {{ t('calendar.today') }}
        </button>
      </div>
    </div>

    <div class="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
      <section class="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <div class="grid grid-cols-7 border-b border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800/70">
          <span
              v-for="d in weekdayLabels"
              :key="d"
              class="py-2 text-center text-[11px] font-black uppercase text-slate-400"
          >
            {{ d }}
          </span>
        </div>

        <div class="grid grid-cols-7" :class="{ 'animate-pulse': loading }">
          <button
              v-for="cell in cells"
              :key="cell.key"
              type="button"
              @click="selectDay(cell)"
              class="flex min-h-16 cursor-pointer flex-col gap-1 border-b border-r border-slate-100 p-1.5 text-left transition sm:min-h-24 sm:p-2 dark:border-slate-700/60"
              :class="[
                cell.inMonth ? '' : 'bg-slate-50/60 dark:bg-slate-900/30',
                cell.key === selectedKey ? 'bg-teal-50 ring-2 ring-inset ring-teal-500 dark:bg-teal-500/10' : 'hover:bg-slate-50 dark:hover:bg-slate-700/40',
              ]"
          >
            <span
                class="flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold"
                :class="cell.key === todayKey
                  ? 'bg-teal-600 text-white'
                  : cell.inMonth ? 'text-slate-700 dark:text-slate-200' : 'text-slate-300 dark:text-slate-600'"
            >
              {{ cell.day }}
            </span>

            <template v-if="cell.bookings.length">
              <!-- Kichik ekranda faqat nuqtalar -->
              <span class="flex flex-wrap gap-0.5 sm:hidden">
                <span
                    v-for="b in cell.bookings.slice(0, 4)"
                    :key="b.id"
                    class="h-1.5 w-1.5 rounded-full"
                    :class="statusDotClass(b.status)"
                />
              </span>
              <span
                  v-for="b in cell.bookings.slice(0, 2)"
                  :key="b.id"
                  class="hidden truncate rounded-md px-1.5 py-0.5 text-[11px] font-bold sm:block"
                  :class="statusClass(b.status)"
              >
                {{ formatTime(b.startAt) }} {{ b.offeredServiceName || t('common.service') }}
              </span>
              <span
                  v-if="cell.bookings.length > 2"
                  class="hidden text-[11px] font-bold text-slate-400 sm:block"
              >
                {{ t('calendar.more', { n: cell.bookings.length - 2 }) }}
              </span>
            </template>
          </button>
        </div>
      </section>

      <section class="h-fit rounded-3xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <p class="text-sm font-black capitalize text-slate-800 dark:text-white">{{ selectedLabel }}</p>
        <p class="text-xs font-semibold text-slate-400">
          {{ t('calendar.bookingsCount', { n: selectedBookings.length }, selectedBookings.length) }}
        </p>

        <div
            v-if="selectedBookings.length === 0"
            class="mt-4 rounded-2xl border border-dashed border-slate-200 py-8 text-center dark:border-slate-700"
        >
          <CalendarDays class="mx-auto h-7 w-7 text-slate-300 dark:text-slate-600" />
          <p class="mt-2 text-sm font-semibold text-slate-500 dark:text-slate-400">{{ t('calendar.empty') }}</p>
          <RouterLink
              to="/businesses"
              class="mt-2 inline-block text-sm font-black text-teal-600 hover:underline dark:text-teal-300"
          >
            {{ t('bookings.book') }}
          </RouterLink>
        </div>

        <div v-else class="mt-4 space-y-2">
          <RouterLink
              v-for="b in selectedBookings"
              :key="b.id"
              :title="t('calendar.goToBusiness', { name: b.businessName })"
              :to="`/business/${b.businessId}`"
              :class="[
                'block rounded-2xl border border-l-4 border-slate-200 p-3 transition hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-700/40',
                statusBorderClass(b.status),
              ]"
          >
            <div class="flex items-center justify-between gap-2">
              <p class="text-xs font-black text-slate-500 dark:text-slate-300">
                {{ formatTime(b.startAt) }} – {{ formatTime(b.endAt) }}
              </p>
              <span class="rounded-full px-2 py-0.5 text-[11px] font-bold" :class="statusClass(b.status)">
                {{ statusLabel(b.status) }}
              </span>
            </div>
            <p class="mt-1 truncate text-sm font-black text-slate-900 dark:text-white">
              {{ b.offeredServiceName || t('common.service') }}
            </p>
            <p class="mt-1 flex items-center gap-1.5 truncate text-xs text-slate-500 dark:text-slate-400">
              <Building2 class="h-3.5 w-3.5 shrink-0" />
              {{ b.businessName }}
            </p>
            <p class="mt-0.5 flex items-center gap-1.5 truncate text-xs text-slate-500 dark:text-slate-400">
              <User class="h-3.5 w-3.5 shrink-0" />
              {{ bookingStaffName(b) }}
            </p>
          </RouterLink>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { RouterLink } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useToast } from 'vue-toastification';
import { Building2, CalendarDays, ChevronLeft, ChevronRight, User } from 'lucide-vue-next';
import DatePicker from '@/components/DatePicker.vue';
import { bookingsApi } from '@/api/bookings';
import { useAuthStore } from '@/stores/auth';
import type { Booking, BookingStatus } from '@/types/api';
import { statusLabel, statusClass, statusBorderClass } from '@/utils/format';
import { bookingStaffName } from '@/utils/names';
import { apiErrorMessage } from '@/utils/apiError';
import { dateLocale } from '@/i18n';

interface DayCell {
  key: string
  day: number
  inMonth: boolean
  bookings: Booking[]
}

const { t } = useI18n();
const toast = useToast();
const authStore = useAuthStore();

const bookings = ref<Booking[]>([]);
const loading = ref(false);

const now = new Date();
const viewYear = ref(now.getFullYear());
const viewMonth = ref(now.getMonth());
const todayKey = dayKey(now);
const selectedKey = ref(todayKey);

function dayKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function parseKey(key: string): Date {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m - 1, d);
}

// Hafta dushanbadan boshlanadi; tarjimadagi ro'yxat yakshanbadan boshlanadi
const weekdayLabels = computed(() => {
  const labels = t('datepicker.weekdays').split(',');
  return [...labels.slice(1), labels[0]];
});

const bookingsByDay = computed(() => {
  const map = new Map<string, Booking[]>();
  for (const b of bookings.value) {
    const key = dayKey(new Date(b.startAt));
    const list = map.get(key);
    if (list) list.push(b);
    else map.set(key, [b]);
  }
  for (const list of map.values()) list.sort((a, b) => a.startAt.localeCompare(b.startAt));
  return map;
});

const cells = computed<DayCell[]>(() => {
  const first = new Date(viewYear.value, viewMonth.value, 1);
  const offset = (first.getDay() + 6) % 7;
  const daysInMonth = new Date(viewYear.value, viewMonth.value + 1, 0).getDate();
  const total = Math.ceil((offset + daysInMonth) / 7) * 7;
  return Array.from({ length: total }, (_, i) => {
    const d = new Date(viewYear.value, viewMonth.value, i - offset + 1);
    const key = dayKey(d);
    return {
      key,
      day: d.getDate(),
      inMonth: d.getMonth() === viewMonth.value,
      bookings: bookingsByDay.value.get(key) ?? [],
    };
  });
});

const pad = (n: number) => String(n).padStart(2, '0');

const selectedBookings = computed(() => bookingsByDay.value.get(selectedKey.value) ?? []);

// 02.10.2026, Juma — brauzerlarda o'zbek locale ma'lumoti bo'lmagani uchun
// hafta kuni nomi Intl'dan emas, tarjimadan olinadi
const selectedLabel = computed(() => {
  const d = parseKey(selectedKey.value);
  const weekday = t('calendar.weekdaysFull').split(',')[d.getDay()];
  return `${pad(d.getDate())}.${pad(d.getMonth() + 1)}.${d.getFullYear()}, ${weekday}`;
});

function shiftMonth(delta: number) {
  const day = parseKey(selectedKey.value).getDate();
  const d = new Date(viewYear.value, viewMonth.value + delta, 1);
  const lastDay = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();

  d.setDate(Math.min(day,lastDay))
  viewYear.value = d.getFullYear();
  viewMonth.value = d.getMonth();
  selectedKey.value = dayKey(d);
}

function goToday() {
  viewYear.value = now.getFullYear();
  viewMonth.value = now.getMonth();
  selectedKey.value = todayKey;
}

function pickDate(key: string) {
  selectedKey.value = key;
  const d = parseKey(key);
  viewYear.value = d.getFullYear();
  viewMonth.value = d.getMonth();
}

function selectDay(cell: DayCell) {
  selectedKey.value = cell.key;
  if (!cell.inMonth) {
    const d = parseKey(cell.key);
    viewYear.value = d.getFullYear();
    viewMonth.value = d.getMonth();
  }
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString(dateLocale(), { hour: '2-digit', minute: '2-digit' });
}

const STATUS_DOTS: Record<BookingStatus, string> = {
  PENDING: 'bg-amber-400',
  CONFIRMED: 'bg-blue-500',
  IN_PROGRESS: 'bg-indigo-500',
  COMPLETED: 'bg-emerald-500',
  CANCELLED_BY_CUSTOMER: 'bg-red-400',
  CANCELLED_BY_BUSINESS: 'bg-red-500',
  NO_SHOW: 'bg-slate-400',
};

function statusDotClass(status: BookingStatus): string {
  return STATUS_DOTS[status] ?? 'bg-slate-400';
}

async function loadBookings() {
  if (!authStore.user) return;
  loading.value = true;
  try {
    const { data } = await bookingsApi.getAll({ customerAccountId: authStore.user.userId, size: 100 });
    bookings.value = data.content;
  } catch (e) {
    toast.error(apiErrorMessage(e, t('calendar.loadError')));
  } finally {
    loading.value = false;
  }
}

onMounted(loadBookings);
</script>
