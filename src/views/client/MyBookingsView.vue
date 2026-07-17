<template>
  <div>
    <div class="flex items-center justify-between">
      <div class="py-2">
        <h2 class="page-title">Mening navbatlarim</h2>
        <p class="text-sm text-gray-500">Telefon raqamingiz bilan qidiring</p>
      </div>
      <RouterLink to="/client/book" class="bg-blue-500 text-white px-2 py-1 rounded">+ Yangi navbat</RouterLink>
    </div>
    <div class="search-box">
      <span class="search-icon">🔍</span>
      <input
        v-model="phone"
        type="search"
        class="search-input"
        placeholder="Telefon raqamingizni kiriting..."
        @input="onInput"
        @keyup.enter="searchBookings"
      />
    </div>
    <div v-if="firebaseStore.loading" class="text-center p-8">
      <p>Yuklanmoqda...</p>
    </div>
    <template v-else-if="searched">
      <div v-if="firebaseStore.bookings.length === 0" class="empty-state">
        <span>📭</span>
        <p>Bu raqam bilan navbat topilmadi</p>
        <RouterLink to="/client/book" class="btn-primary">Navbat olish</RouterLink>
      </div>
      <div v-else class="bookings-list">
        <div v-for="b in firebaseStore.bookings" :key="b.id" class="booking-card">
          <div class="bc-left">
            <div class="bc-icon">🗓️</div>
            <div class="bc-info">
              <h4 class="bc-service">{{ b.service }}</h4>
              <p class="bc-meta">
                {{ formatDate(b.date) }} ·
                {{ b.time }} — {{ addMinutes(b.time, b.duration) }}
              </p>
              <p class="bc-emp">
                <span class="flex items-center justify-center w-7 h-7 rounded-full" :style="{ background: getEmployee(b.employeeId)?.color || '#94a3b8' }">
                  {{ getEmployee(b.employeeId)?.name.charAt(0) || '?' }}
                </span>
                {{ getEmployee(b.employeeId)?.name || '—' }}
              </p>
            </div>
          </div>
          <div class="bc-right">
            <span class="src-badge" :class="b.source === 'online' ? 'src--online' : 'src--manual'">
              {{ b.source === 'online' ? '🌐 Online' : "👔 Qo'lda" }}
            </span>
            <span class="status-badge" :class="statusClass(b.status)">
              {{ b.status }}
            </span>
          </div>
        </div>
      </div>
    </template>
    <div v-else class="search-hint">
      <p>Navbatlaringizni ko'rish uchun telefon raqamingizni kiriting va Enter tugmasini bosing</p>
    </div>
    <div class="today-schedule">
      <h3 class="section-title">Bugungi jadval — barcha ustalar</h3>
      <p class="section-sub">Band vaqtlarni ko'rib, navbat olishni rejalashtirishingiz mumkin</p>
      <div class="schedule-scroll">
        <div class="grid bg-gray-50 border-b border-gray-200 sticky top-0 z-20" :style="{ gridTemplateColumns: gridCols }">
          <div class="sticky left-0 z-30 bg-gray-100 p-3 text-xs font-bold text-gray-400 border-r">Vaqt</div>
          <div v-for="e in firebaseStore.employees" :key="e.id" class="sch-emp-hd">
            <span class="w-7 h-7 flex items-center justify-center rounded-full" :style="{ background: e.color }">{{ e.name.charAt(0) }}</span>
            {{ e.name }}
          </div>
        </div>
        <div v-for="slot in timeSlots" :key="slot" class="grid border-b border-gray-100 hover:bg-gray-50" :style="{ gridTemplateColumns: gridCols }">
          <div class="sticky left-0 z-20 px-3 py-2 text-xs font-semibold text-gray-500 border-r border-gray-200 flex items-center bg-white">{{ slot }}</div>
          <div v-for="e in firebaseStore.employees" :key="e.id" class="sch-cell">
            <template v-if="isSlotBusy(slot, today, e.id)">
              <span class="sch-chip chip-manual">Band</span>
            </template>
            <span v-else class="sch-free">Bo'sh</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { RouterLink } from 'vue-router';
import { useFirebaseStore } from '@/stores/firebaseStore';

const today = new Date().toISOString().split('T')[0];
const timeSlots = Array.from({ length: 24 }, (_, i) => { const hour = Math.floor(i / 2) + 9; const minute = i % 2 === 0 ? '00' : '30'; return `${hour.toString().padStart(2, '0')}:${minute}`; });
const toMins = (time: string) => { if(!time) return 0; const [h, m] = time.split(':').map(Number); return h * 60 + m; };
const addMinutes = (time: string, mins: number) => { const totalMins = toMins(time) + mins; const h = Math.floor(totalMins / 60); const m = totalMins % 60; return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`; };
const formatDate = (dateString: string) => { if (!dateString) return ''; const date = new Date(dateString); return date.toLocaleDateString('uz-UZ', { day: 'numeric', month: 'long', year: 'numeric' }); };
const statusClass = (status: string) => ({ 'bg-green-100 text-green-800': status === 'Bajarildi', 'bg-blue-100 text-blue-800': status === 'Kutilmoqda', 'bg-red-100 text-red-800': status === 'Bekor' });

const firebaseStore = useFirebaseStore();

const phone = ref('');
const searched = ref(false);

onMounted(() => {
  const saved = localStorage.getItem('lastPhone');
  if (saved) phone.value = saved;
  if (firebaseStore.employees.length === 0) firebaseStore.fetchEmployees();
  if (firebaseStore.bookings.length === 0) firebaseStore.fetchAllBookings();
});

function onInput() {
  localStorage.setItem('lastPhone', phone.value);
  if (searched.value) {
    searched.value = false;
    firebaseStore.bookings = [];
  }
}

async function searchBookings() {
  if (phone.value.length >= 5) {
    const cleanedPhone = phone.value.replace(/\s/g, '');
    await firebaseStore.fetchClientBookings(cleanedPhone);
    searched.value = true;
  }
}

const getEmployee = (id: string) => firebaseStore.employees.find(e => e.id === id);

const gridCols = computed(() => `80px repeat(${firebaseStore.employees.length}, minmax(180px, 1fr))`);

const isSlotBusy = (slot: string, date: string, employeeId: string): boolean => {
    const slotStart = toMins(slot);
    const slotEnd = slotStart + 30;
    return firebaseStore.bookings.some(booking => {
        if (booking.date !== date || booking.employeeId !== employeeId) return false;
        const bookingStart = toMins(booking.time);
        const bookingEnd = bookingStart + booking.duration;
        return slotStart < bookingEnd && slotEnd > bookingStart;
    });
};
</script>

<style scoped>
.page-title { font-size: 24px; font-weight: 800; color: #0f172a; }
.search-box { position: relative; display: flex; align-items: center; margin-bottom: 20px; }
.search-icon { position: absolute; left: 14px; font-size: 16px; pointer-events: none; }
.search-input { width: 100%; max-width: 480px; padding: 12px 40px; border: 1px solid #d1d5db; border-radius: 10px; font-size: 15px; background: #fff; color: #1e293b; outline: none; font-family: inherit; }
.search-input:focus { border-color: #0284c7; box-shadow: 0 0 0 3px rgba(2,132,199,0.1); }
.bookings-list { display: flex; flex-direction: column; gap: 10px; margin-bottom: 28px; }
.booking-card { background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 14px 18px; display: flex; align-items: center; justify-content: space-between; gap: 12px; }
.bc-left  { display: flex; align-items: center; gap: 12px; }
.bc-icon  { font-size: 28px; flex-shrink: 0; }
.bc-service { font-size: 15px; font-weight: 700; color: #1e293b; margin: 0 0 3px; }
.bc-meta    { font-size: 12px; color: #64748b; margin: 0 0 4px; }
.bc-emp     { font-size: 12px; color: #475569; margin: 0; display: flex; align-items: center; gap: 5px; }
.bc-right   { display: flex; flex-direction: column; gap: 6px; align-items: flex-end; flex-shrink: 0; }
.status-badge { font-size: 11px; font-weight: 600; padding: 3px 10px; border-radius: 20px; }
.search-hint { padding: 32px; text-align: center; color: #94a3b8; font-size: 15px; }
.today-schedule { margin-top: 32px; }
.section-title { font-size: 16px; font-weight: 700; color: #1e293b; margin: 0 0 4px; }
.section-sub   { font-size: 13px; color: #64748b; margin: 0 0 14px; }
.schedule-scroll { overflow-x: auto; border-radius: 12px; border: 1px solid #e2e8f0; background: #fff; }
.sch-emp-hd { flex: 1; padding: 8px 12px; font-size: 12px; font-weight: 700; color: #1e293b; border-right: 1px solid #e2e8f0; display: flex; align-items: center; gap: 6px; min-width: 120px; }
.sch-cell { flex: 1; padding: 4px 8px; border-right: 1px solid #f1f5f9; display: flex; align-items: center; flex-wrap: wrap; gap: 3px; min-width: 120px; }
.sch-chip { font-size: 11px; padding: 2px 8px; border-radius: 20px; font-weight: 500; }
.chip-manual { background: #ede9fe; color: #4c1d95; }
.sch-free    { font-size: 11px; color: #d1d5db; }
.empty-state { text-align: center; padding: 40px 20px; color: #94a3b8; }
.empty-state span { font-size: 40px; display: block; margin-bottom: 12px; }
.empty-state p    { font-size: 15px; margin: 0 0 16px; }
</style>
