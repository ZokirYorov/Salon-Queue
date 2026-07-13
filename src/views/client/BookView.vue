<template>
  <div class="min-h-screen bg-slate-50/50 dark:bg-slate-900 transition-colors">
    <!-- Hero banner -->
    <div class="relative h-40 sm:h-48 w-full overflow-hidden bg-gradient-to-br from-indigo-500 to-cyan-400">
      <img v-if="businessImage" :src="mediaUrl(businessImage)!" :alt="business?.name" class="h-full w-full object-cover" />
      <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
      <RouterLink
        to="/businesses"
        class="absolute top-4 left-4 w-9 h-9 rounded-full bg-white/90 backdrop-blur flex items-center justify-center text-slate-700 hover:bg-white transition"
      >
        <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>
      </RouterLink>
      <div class="absolute bottom-4 left-4 right-4">
        <h1 class="text-lg sm:text-xl font-bold text-white drop-shadow-sm">{{ business?.name || 'Yuklanmoqda...' }}</h1>
        <p class="text-xs sm:text-sm text-white/80">{{ business?.addressLine || business?.city }}</p>
      </div>
    </div>

    <main class="max-w-3xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      <p v-if="loadError" class="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded-md px-3 py-2">{{ loadError }}</p>

      <section class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 space-y-3">
        <div class="step-header">
          <span class="step-num">1</span>
          <span>Xizmatni tanlang</span>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <button
            v-for="svc in services"
            :key="svc.id"
            type="button"
            @click="selectService(svc)"
            class="flex items-center gap-3 text-left border rounded-xl p-2.5 transition"
            :class="form.offeredServiceId === svc.id ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-500/10' : 'border-slate-200 dark:border-slate-600 hover:border-indigo-300'"
          >
            <div class="w-12 h-12 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-700 flex-shrink-0 flex items-center justify-center">
              <img v-if="svc.imageUrl" :src="mediaUrl(svc.imageUrl)!" :alt="svc.name" class="w-full h-full object-cover" />
              <span v-else class="text-indigo-400 text-lg font-bold">{{ svc.name.charAt(0).toUpperCase() }}</span>
            </div>
            <div class="min-w-0">
              <div class="text-sm font-semibold text-slate-900 dark:text-white truncate">{{ svc.name }}</div>
              <div class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{{ svc.durationMinutes }} daqiqa · {{ formatPrice(svc.basePrice) }}</div>
            </div>
          </button>
        </div>
        <p v-if="!loadingServices && services.length === 0" class="text-sm text-slate-400">Bu salonda hali xizmatlar mavjud emas.</p>
      </section>

      <section v-if="selectedService" class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 space-y-3">
        <div class="step-header">
          <span class="step-num">2</span>
          <span>Sana tanlang</span>
        </div>
        <input v-model="form.date" type="date" :min="todayIso()" class="border border-slate-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg px-3 py-2 text-sm" />
      </section>

      <section v-if="selectedService && form.date" class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 space-y-3">
        <div class="step-header">
          <span class="step-num">3</span>
          <span>Ustani tanlang</span>
        </div>
        <div v-if="staff.length === 0" class="text-sm text-slate-400">Bu salonda faol xodim topilmadi.</div>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="s in staff"
            :key="s.id"
            type="button"
            @click="selectStaff(s.id)"
            class="flex items-center gap-2 border rounded-full pl-1.5 pr-4 py-1.5 transition"
            :class="form.staffId === s.id ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-500/10' : 'border-slate-200 dark:border-slate-600 hover:border-indigo-300'"
          >
            <span class="w-7 h-7 rounded-full bg-indigo-500 text-white text-xs font-bold flex items-center justify-center">
              {{ s.displayName.charAt(0).toUpperCase() }}
            </span>
            <span class="text-sm font-medium text-slate-800 dark:text-slate-200">{{ s.displayName }}</span>
          </button>
        </div>
      </section>

      <section v-if="form.staffId" class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 space-y-3">
        <div class="step-header">
          <span class="step-num">4</span>
          <span>Vaqtni tanlang</span>
        </div>
        <p v-if="dayClosed" class="text-sm text-amber-600 dark:text-amber-400">Bu kunda salon yopiq.</p>
        <p v-else-if="possibleStarts.length === 0" class="text-sm text-slate-400">Bo'sh vaqt topilmadi.</p>
        <div v-else class="grid grid-cols-4 sm:grid-cols-6 gap-2">
          <button
            v-for="min in possibleStarts"
            :key="min"
            type="button"
            :disabled="isSlotBusy(min)"
            @click="form.startMinutes = min"
            class="text-xs font-semibold py-2 rounded-lg border transition"
            :class="[
              form.startMinutes === min ? 'bg-indigo-600 text-white border-indigo-600' : '',
              isSlotBusy(min)
                ? 'bg-slate-100 dark:bg-slate-700 text-slate-300 dark:text-slate-500 border-slate-200 dark:border-slate-700 cursor-not-allowed'
                : form.startMinutes !== min ? 'border-slate-200 dark:border-slate-600 hover:border-indigo-400 text-slate-700 dark:text-slate-300' : ''
            ]"
          >
            {{ minutesToLabel(min) }}
          </button>
        </div>
      </section>

      <section v-if="form.startMinutes !== null" class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 space-y-3">
        <div class="step-header">
          <span class="step-num">5</span>
          <span>Izoh (ixtiyoriy)</span>
        </div>
        <textarea v-model="form.customerNote" rows="2" class="w-full border border-slate-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg px-3 py-2 text-sm" placeholder="Qo'shimcha izoh"></textarea>

        <div class="bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/30 rounded-xl p-4 text-sm text-indigo-900 dark:text-indigo-200 space-y-1">
          <div class="flex justify-between"><span>Xizmat</span><strong>{{ selectedService?.name }}</strong></div>
          <div class="flex justify-between"><span>Usta</span><strong>{{ selectedStaff?.displayName }}</strong></div>
          <div class="flex justify-between"><span>Sana</span><strong>{{ formatDate(form.date) }}</strong></div>
          <div class="flex justify-between"><span>Vaqt</span><strong>{{ minutesToLabel(form.startMinutes) }} — {{ minutesToLabel(form.startMinutes + (selectedService?.durationMinutes || 0)) }}</strong></div>
          <div class="flex justify-between"><span>Narx</span><strong>{{ formatPrice(selectedService?.basePrice || 0) }}</strong></div>
        </div>

        <p v-if="submitError" class="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded-md px-3 py-2">{{ submitError }}</p>

        <button
          type="button"
          :disabled="submitting"
          @click="submit"
          class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition disabled:opacity-60"
        >
          {{ submitting ? 'Yuborilmoqda...' : 'Navbat olish' }}
        </button>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed, watch, onMounted } from 'vue';
import { useRoute, useRouter, RouterLink } from 'vue-router';
import { businessesApi } from '@/api/businesses';
import { servicesApi } from '@/api/services';
import { staffApi } from '@/api/staff';
import { businessHoursApi } from '@/api/businessHours';
import { bookingsApi } from '@/api/bookings';
import { useAuthStore } from '@/stores/auth';
import type { Business, OfferedService, StaffMember, BusinessHours, Booking } from '@/types/api';
import { weekdayFromDate, toMinutes, todayIso, isStaffBusy, generatePossibleStarts, minutesToLabel, dateAndMinutesToIso } from '@/utils/scheduling';
import { formatPrice, formatDate } from '@/utils/format';
import { mediaUrl } from '@/utils/media';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const businessId = route.params.id as string;

const business = ref<Business | null>(null);
const services = ref<OfferedService[]>([]);
const staff = ref<StaffMember[]>([]);
const hours = ref<BusinessHours[]>([]);
const dayBookings = ref<Booking[]>([]);
const loadingServices = ref(false);
const loadError = ref('');
const submitting = ref(false);
const submitError = ref('');

const form = reactive({
  offeredServiceId: '',
  date: todayIso(),
  staffId: '',
  startMinutes: null as number | null,
  customerNote: '',
});

const businessImage = computed(() => services.value.find((s) => s.imageUrl)?.imageUrl ?? null);
const selectedService = computed(() => services.value.find((s) => s.id === form.offeredServiceId) || null);
const selectedStaff = computed(() => staff.value.find((s) => s.id === form.staffId) || null);

const dayHours = computed(() => hours.value.find((h) => h.weekday === weekdayFromDate(form.date)));
const dayClosed = computed(() => !dayHours.value || dayHours.value.closed || !dayHours.value.opensAt || !dayHours.value.closesAt);

const possibleStarts = computed(() => {
  if (dayClosed.value || !selectedService.value || !dayHours.value?.opensAt || !dayHours.value?.closesAt) return [];
  return generatePossibleStarts(
    toMinutes(dayHours.value.opensAt),
    toMinutes(dayHours.value.closesAt),
    selectedService.value.durationMinutes,
    30
  );
});

function isSlotBusy(min: number): boolean {
  if (!form.staffId || !selectedService.value) return false;
  return isStaffBusy(dayBookings.value, form.staffId, min, min + selectedService.value.durationMinutes);
}

async function loadStatic() {
  loadError.value = '';
  try {
    const [bizRes, svcRes, staffRes, hoursRes] = await Promise.all([
      businessesApi.getById(businessId),
      servicesApi.getAll(businessId),
      staffApi.getAll(businessId),
      businessHoursApi.getAll(businessId),
    ]);
    business.value = bizRes.data;
    services.value = svcRes.data.filter((s) => s.active);
    staff.value = staffRes.data.filter((s) => s.active);
    hours.value = hoursRes.data;
  } catch {
    loadError.value = "Salon ma'lumotlarini yuklab bo'lmadi";
  } finally {
    loadingServices.value = false;
  }
}

async function loadDayBookings() {
  if (!form.date) return;
  try {
    const { data } = await bookingsApi.getAll({ businessId, date: form.date, size: 200 });
    dayBookings.value = data.content;
  } catch {
    dayBookings.value = [];
  }
}

onMounted(() => {
  loadingServices.value = true;
  loadStatic();
  loadDayBookings();
});

watch(() => form.date, () => {
  form.startMinutes = null;
  loadDayBookings();
});

function selectService(svc: OfferedService) {
  form.offeredServiceId = svc.id;
  form.staffId = '';
  form.startMinutes = null;
}

function selectStaff(id: string) {
  form.staffId = id;
  form.startMinutes = null;
}

async function submit() {
  if (!selectedService.value || form.startMinutes === null || !authStore.user) return;
  submitting.value = true;
  submitError.value = '';
  try {
    const startAt = dateAndMinutesToIso(form.date, form.startMinutes);
    const endAt = dateAndMinutesToIso(form.date, form.startMinutes + selectedService.value.durationMinutes);
    await bookingsApi.create({
      customerId: authStore.user.userId,
      businessId,
      offeredServiceId: form.offeredServiceId,
      staffId: form.staffId,
      startAt,
      endAt,
      customerNote: form.customerNote.trim() || undefined,
    });
    router.push('/client/my');
  } catch (e: any) {
    submitError.value = e?.response?.data?.message || 'Navbat olishda xatolik yuz berdi';
  } finally {
    submitting.value = false;
  }
}
</script>

<style scoped>
.step-header {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  font-weight: 700;
  color: #1e293b;
}
:global(.dark) .step-header {
  color: #f1f5f9;
}
.step-num {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: #4f46e5;
  color: #fff;
  font-size: 12px;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
</style>
