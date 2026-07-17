<template>
  <div class="flex flex-col gap-4">
    <!-- Header and Filters (No changes) -->
    <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
      <div>
        <h2 class="text-2xl font-bold text-slate-900">Kunlik jadval</h2>
        <p class="text-sm text-gray-500">Har bir xodimning band vaqtlari</p>
      </div>
      <div class="flex gap-2">
        <AppDatePicker v-model="scheduleDate" placeholder="Sanani tanlang" class="max-w-50" />
        <button @click="showAddModal = true" class="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap">+ Navbat qo'shish</button>
      </div>
    </div>
    <div class="flex gap-2 flex-wrap text-sm">
      <button v-for="filter in filterButtons" :key="filter.value" type="button" @click="activeFilter = filter.value" class="flex items-center cursor-pointer gap-2 px-3 py-1.5 border rounded-lg transition-all duration-200" :class="activeFilter === filter.value ? filter.activeClass : 'bg-gray-50 border-gray-200 hover:bg-gray-100'">
        <span v-if="filter.color" class="w-2.5 h-2.5 rounded-full" :class="filter.color"></span>{{ filter.label }}
      </button>
      <span class="border-b-2 border-gray-300 text-gray-600 font-semibold p-2">Jami: {{ filteredDayBookings.length }}</span>
    </div>

    <!-- Schedule Grid: Corrected for proper sticky scrolling -->
    <div v-if="firebaseStore.loading && !showAddModal" class="text-center p-10"><p>Jadval yuklanmoqda...</p></div>
    <div v-else class="overflow-auto max-h-[75vh] rounded-xl border border-gray-200 bg-white shadow-sm">
      <div class="relative min-w-max">
        <!-- Sticky Header -->
        <div class="grid bg-gray-50 border-b border-gray-200 sticky top-0 z-20" :style="{ gridTemplateColumns: gridCols }">
          <div class="sticky left-0 bg-gray-100 p-3 text-xs font-bold text-gray-400 border-r z-30">Vaqt</div>
          <div v-for="emp in firebaseStore.employees" :key="emp.id" class="flex items-center gap-1 p-2 border-r border-gray-200">
            <div class="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold shrink-0" :style="{ background: emp.color }">{{ emp.name.charAt(0) }}</div>
            <div class="flex-1 min-w-0"><p class="text-sm font-semibold truncate break-words">{{ emp.name }}</p><p class="text-xs text-gray-400 truncate break-words">{{ emp.role }}</p></div>
            <span class="text-xs bg-gray-200 px-2 py-1 rounded-full">{{ getBookingsForEmployee(emp.id).length }}</span>
          </div>
        </div>

        <!-- Scrollable Body -->
        <div v-if="dayBookings.length === 0 && !firebaseStore.loading" class="text-center py-10 text-gray-400">Ushbu sanada navbatlar yo'q</div>
        <div v-else v-for="slot in timeSlots" :key="slot" class="grid border-b border-gray-100 hover:bg-gray-50" :style="{ gridTemplateColumns: gridCols }" :class="{'current-time-row': isCurrentSlot(slot)}">
          <div class="sticky left-0 px-3 z-10 py-2 text-xs font-semibold text-gray-500 border-r border-gray-200 flex items-center bg-white" :class="{'bg-orange-50': isCurrentSlot(slot)}">{{ slot }}</div>
          <div v-for="emp in firebaseStore.employees" :key="emp.id" class="flex flex-col gap-1 p-1 border-r border-gray-200 min-h-[48px]">
            <div v-for="b in getBookingsForCell(slot, emp.id)" :key="b.id" @click="openDetail(b)" class="flex items-start gap-2 z-10 p-2 rounded-lg text-xs font-semibold cursor-pointer transition-all hover:shadow-lg hover:scale-[1.02]" :class="statusClass(b)">
              <div class="flex flex-col w-0 flex-1"><span class="font-semibold break-words">{{ b.clientName }}</span><span class="opacity-70 font-normal">{{ b.service }}</span></div>
              <span class="text-[11px] opacity-60 font-normal">{{ b.time }}→{{ addMinutes(b.time, b.duration) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modals (No changes) -->
    <div v-if="selectedBooking" class="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50" @click.self="selectedBooking = null">
      <div class="bg-white w-[420px] max-w-full rounded-2xl shadow-xl p-5 animate-in">
        <div class="flex border-b border-gray-200 pb-2 justify-between items-center mb-4"><h3 class="text-lg font-semibold text-slate-800">Navbat tafsilotlari</h3><button class="text-gray-400 cursor-pointer hover:text-red-500 text-lg" @click="selectedBooking = null">✕</button></div>
        <div class="flex flex-col gap-3 text-sm">
          <div class="flex justify-between"><span class="text-gray-500 flex-1">Mijoz</span><span class="font-semibold break-words flex-1">{{ selectedBooking.clientName }}</span></div>
          <div class="flex justify-between"><span class="text-gray-500 flex-1">Telefon</span><span class="flex-1">{{ selectedBooking.phone || '—' }}</span></div>
          <div class="flex justify-between"><span class="text-gray-500 flex-1">Xizmat</span><span class="flex-1">{{ selectedBooking.service }}</span></div>
          <div class="flex justify-between"><span class="text-gray-500 flex-1">Vaqt</span><span class="flex-1">{{ selectedBooking.time }} — {{ addMinutes(selectedBooking.time, selectedBooking.duration) }}</span></div>
          <div class="flex justify-between items-center"><span class="text-gray-500 flex-1">Holat</span><select v-model="selectedBooking.status" @change="changeBookingStatus($event)" class="flex-1 text-sm border border-gray-200 rounded-lg px-2 py-1 focus:ring-2 focus:ring-indigo-400 outline-none"><option>Kutilmoqda</option><option>Bajarildi</option><option>Bekor</option></select></div>
        </div>
        <div class="flex items-center w-full justify-end mt-5 gap-2"><button class="bg-red-100 hover:bg-red-200 cursor-pointer text-red-600 px-3 py-1.5 rounded-lg text-sm" @click="removeBooking">O'chirish</button><button class="bg-indigo-500 hover:bg-indigo-600 cursor-pointer text-white px-4 py-1.5 rounded-lg text-sm" @click="selectedBooking = null">Yopish</button></div>
      </div>
    </div>
    <div v-if="showAddModal" class="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50" @click.self="closeAddModal">
      <div class="bg-white w-full max-w-2xl rounded-2xl shadow-xl p-6 max-h-[90vh] overflow-y-auto animate-in">
        <h3 class="text-lg font-semibold mb-4">Yangi Navbat Qo'shish</h3>
        <div class="form-wrap p-0 bg-transparent shadow-none">
          <div class="step-header"><span class="step-num">1</span><span class="step-label">Mijoz ma'lumotlari</span></div>
          <div class="form-row"><div class="form-group"><label>Mijoz ismi *</label><input v-model="form.clientName" placeholder="Masalan: Aziz Karimov" :class="{ error: errors.clientName }" /><span class="error-msg" v-if="errors.clientName">{{ errors.clientName }}</span></div><div class="form-group"><label>Telefon raqam</label><input v-model="form.phone" placeholder="+998 90 000 00 00" /></div></div>
          <div class="step-header"><span class="step-num">2</span><span class="step-label">Xizmat va sana</span></div>
          <div class="form-row"><div class="form-group"><label>Xizmat turi *</label><select v-model="form.service" @change="onServiceChange" :class="{ error: errors.service }"><option value="">Tanlang...</option><option v-for="s in firebaseStore.services" :key="s.id" :value="s.name">{{ s.name }} ({{ s.duration }} min)</option></select><span class="error-msg" v-if="errors.service">{{ errors.service }}</span></div><div class="form-group"><label>Sana *</label><input type="date" v-model="form.date" :min="today" @change="form.employeeId = ''" :class="{ error: errors.date }" /><span class="error-msg" v-if="errors.date">{{ errors.date }}</span></div></div>
          <div v-if="form.service && form.date" class="step-header"><span class="step-num">3</span><span class="step-label">Xodim tanlang</span></div>
          <div v-if="form.service && form.date" class="form-group">
            <div v-if="availableEmployees.length === 0" class="no-employees text-sm text-red-500">Shu xizmat uchun mos xodim topilmadi</div>
            <div v-else class="emp-picker"><div v-for="emp in availableEmployees" :key="emp.id" class="emp-pick-card" :class="{ selected: form.employeeId === emp.id }" @click="pickEmployee(emp.id)"><div class="ep-avatar" :style="{ background: emp.color }">{{ emp.name.charAt(0) }}</div><div class="ep-info"><span class="ep-name">{{ emp.name }}</span><span class="ep-role">{{ emp.role }}</span></div></div></div>
            <span class="error-msg" v-if="errors.employeeId">{{ errors.employeeId }}</span>
          </div>
          <div v-if="form.employeeId" class="step-header"><span class="step-num">4</span><span class="step-label">Vaqt tanlang</span></div>
          <div v-if="form.employeeId" class="form-group">
            <div class="slots-grid"><button v-for="t in timeSlots" :key="t" type="button" class="slot-btn" :class="{ selected: form.time === t, busy: isSlotBusy(t, form.date, form.service, form.employeeId) }" :disabled="isSlotBusy(t, form.date, form.service, form.employeeId)" @click="form.time = t">{{ t }}</button></div>
            <span class="error-msg" v-if="errors.time">{{ errors.time }}</span>
          </div>
          <p v-if="firebaseStore.error" class="text-red-500 text-xs mt-2">{{ firebaseStore.error }}</p>
          <div class="form-footer mt-6"><button class="btn-secondary" @click="closeAddModal">Bekor qilish</button><button class="btn-primary" @click="submitAddBooking" :disabled="firebaseStore.loading">{{ firebaseStore.loading ? 'Saqlanmoqda...' : 'Navbatni saqlash' }}</button></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, reactive } from 'vue';
import { useFirebaseStore, type Booking } from '@/stores/firebaseStore';
import AppDatePicker from "@/components/AppDatePicker.vue";

const today = new Date().toISOString().split('T')[0];
const timeSlots = Array.from({ length: 24 }, (_, i) => { const hour = Math.floor(i / 2) + 9; const minute = i % 2 === 0 ? '00' : '30'; return `${hour.toString().padStart(2, '0')}:${minute}`; });
function toMins(time: string) { if(!time) return 0; const [h, m] = time.split(':').map(Number); return h * 60 + m; };
function addMinutes(time: string, mins: number) { const totalMins = toMins(time) + mins; const h = Math.floor(totalMins / 60); const m = totalMins % 60; return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`; };
function formatDate(dateString: string) { if (!dateString) return ''; const date = new Date(dateString); return date.toLocaleDateString('uz-UZ', { day: 'numeric', month: 'long', year: 'numeric' }); };
const firebaseStore = useFirebaseStore();
const scheduleDate = ref(today);
const selectedBooking = ref<Booking | null>(null);
const showAddModal = ref(false);
type ActiveFilterType = 'all' | 'online' | 'manual' | 'Bajarildi' | 'Kutilmoqda' | 'Bekor';
const activeFilter = ref<ActiveFilterType>('all');
const filterButtons: { label: string; value: ActiveFilterType; color?: string; activeClass: string; }[] = [
  { label: 'Hammasi', value: 'all', activeClass: 'bg-gray-600 text-white border-gray-600' },
  { label: 'Online', value: 'online', color: 'bg-sky-500', activeClass: 'bg-sky-100 text-sky-700 border-sky-500' },
  { label: 'Qo\'lda', value: 'manual', color: 'bg-purple-500', activeClass: 'bg-purple-100 text-purple-700 border-purple-500' },
  { label: 'Bajarildi', value: 'Bajarildi', color: 'bg-green-500', activeClass: 'bg-green-100 text-green-700 border-green-500' },
  { label: 'Kutilmoqda', value: 'Kutilmoqda', color: 'bg-blue-500', activeClass: 'bg-blue-100 text-blue-700 border-blue-500' },
  { label: 'Bekor', value: 'Bekor', color: 'bg-red-500', activeClass: 'bg-red-100 text-red-700 border-red-500' },
];
onMounted(() => {
  firebaseStore.fetchAllBookings();
  firebaseStore.fetchServices();
  firebaseStore.fetchEmployees();
});
const dayBookings = computed(() => firebaseStore.bookings.filter(b => b.date === scheduleDate.value));
const filteredDayBookings = computed(() => {
  if (activeFilter.value === 'all') return dayBookings.value;
  if (['online', 'manual'].includes(activeFilter.value)) return dayBookings.value.filter(b => b.source === activeFilter.value);
  return dayBookings.value.filter(b => b.status === activeFilter.value);
});
const gridCols = computed(() => `80px repeat(${firebaseStore.employees.length}, minmax(180px, 1fr))`);
const availableEmployees = computed(() => {
  if (!form.service) return firebaseStore.employees;
  return firebaseStore.employees.filter(emp => emp.services.length === 0 || emp.services.includes(form.service));
});
const getBookingsForCell = (slot: string, empId: string) => filteredDayBookings.value.filter(b => b.employeeId === empId && b.time === slot);
const getBookingsForEmployee = (empId: string) => filteredDayBookings.value.filter(b => b.employeeId === empId);
const openDetail = (b: Booking) => { selectedBooking.value = { ...b }; };
const isCurrentSlot = (slot: string): boolean => { if (scheduleDate.value !== today) return false; const now = new Date(); const nowMins = now.getHours() * 60 + now.getMinutes(); const slotMins = toMins(slot); return nowMins >= slotMins && nowMins < slotMins + 30; };
const statusClass = (b: Booking) => ({ 'bg-green-100 text-green-800 border-l-4 border-green-500': b.status === 'Bajarildi', 'bg-blue-100 text-blue-800 border-l-4 border-blue-500': b.status === 'Kutilmoqda', 'bg-red-100 text-red-800 line-through border-l-4 border-red-500': b.status === 'Bekor', 'opacity-60': b.status === 'Bekor' });
async function changeBookingStatus(event: Event) { if (!selectedBooking.value) return; const newStatus = (event.target as HTMLSelectElement).value as Booking['status']; const success = await firebaseStore.updateBooking(selectedBooking.value.id, { status: newStatus }); if (success) { selectedBooking.value.status = newStatus; } }
async function removeBooking() { if (!selectedBooking.value) return; if (confirm("Bu navbatni o'chirishni tasdiqlaysizmi?")) { const success = await firebaseStore.deleteBooking(selectedBooking.value.id); if (success) { selectedBooking.value = null; } } }
const form = reactive({ clientName: '', phone: '', service: '', duration: 0, date: today, time: '', employeeId: '' });
const errors = reactive({ clientName: '', service: '', date: '', employeeId: '', time: '' });
const onServiceChange = () => { const svc = firebaseStore.services.find(s => s.name === form.service); form.duration = svc?.duration ?? 0; form.employeeId = ''; form.time = ''; };
const pickEmployee = (id: string) => { form.employeeId = id; form.time = ''; };
const isSlotBusy = (slot: string, date: string, service: string, employeeId: string): boolean => { if (!service || !employeeId) return false; const serviceDuration = firebaseStore.services.find(s => s.name === service)?.duration ?? 30; const slotStart = toMins(slot); const slotEnd = slotStart + serviceDuration; return firebaseStore.bookings.some(booking => { if (booking.date !== date || booking.employeeId !== employeeId) return false; const bookingStart = toMins(booking.time); const bookingEnd = bookingStart + booking.duration; return slotStart < bookingEnd && slotEnd > bookingStart; }); };
const validateAddBooking = (): boolean => { errors.clientName = form.clientName.trim() ? '' : 'Mijoz ismi kiritilishi shart'; errors.service = form.service ? '' : 'Xizmat turi tanlanishi shart'; errors.date = form.date ? '' : 'Sana tanlanishi shart'; errors.employeeId = form.employeeId ? '' : 'Xodim tanlanishi shart'; errors.time = form.time ? '' : 'Vaqt tanlanishi shart'; return Object.values(errors).every(e => !e); };
const submitAddBooking = async () => { if (!validateAddBooking()) return; const success = await firebaseStore.addBooking({ clientName: form.clientName.trim(), phone: form.phone.trim(), service: form.service, duration: form.duration, date: form.date, time: form.time, status: 'Kutilmoqda', source: 'manual', employeeId: form.employeeId }); if (success) { closeAddModal(); } };
const closeAddModal = () => { showAddModal.value = false; Object.assign(form, { clientName: '', phone: '', service: '', duration: 0, date: today, time: '', employeeId: '' }); Object.assign(errors, { clientName: '', service: '', date: '', employeeId: '', time: '' }); };
</script>

<style scoped>
@keyframes animate-in { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
.animate-in { animation: animate-in 0.2s ease-out; }
.current-time-row { position: relative; }
.current-time-row::before { content: ''; position: absolute; top: 50%; right: 0; left: 0; height: 2px; background-color: rgba(249, 115, 22, 0.6); z-index: 20; }
.form-wrap { max-width: 100%; padding: 0; }
.step-header { display: flex; align-items: center; gap: 12px; margin: 24px 0 12px; }
.step-num { width: 28px; height: 28px; border-radius: 8px; background: #6366f1; color: white; font-size: 13px; font-weight: 700; display: flex; align-items: center; justify-content: center; }
.step-label { font-size: 15px; font-weight: 700; color: #1e293b; }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.form-group { display: flex; flex-direction: column; gap: 4px; }
.form-group label { font-size: 13px; font-weight: 600; color: #334155; }
input, select, textarea { width: 100%; padding: 10px 12px; border-radius: 10px; border: 1px solid #e2e8f0; background: #fff; font-size: 14px; }
input:focus, select:focus, textarea:focus { outline: none; border-color: #6366f1; box-shadow: 0 0 0 3px rgba(99,102,241,0.15); }
.error { border-color: #ef4444 !important; }
.error-msg { font-size: 12px; color: #ef4444; }
.emp-picker { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 10px; }
.emp-pick-card { display: flex; align-items: center; gap: 10px; padding: 10px; border-radius: 12px; border: 1px solid #e2e8f0; background: #fff; cursor: pointer; }
.emp-pick-card.selected { border-color: #6366f1; background: #eef2ff; }
.ep-avatar { width: 36px; height: 36px; border-radius: 10px; color: #fff; font-weight: 700; display: flex; align-items: center; justify-content: center; }
.ep-info { display: flex; flex-direction: column; }
.ep-name { font-weight: 600; font-size: 13px; }
.ep-role { font-size: 11px; color: #64748b; }
.slots-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(65px, 1fr)); gap: 8px; }
.slot-btn { padding: 8px; border-radius: 8px; border: 1px solid #e2e8f0; background: #fff; cursor: pointer; font-size: 13px; }
.slot-btn.selected { background: #6366f1; color: white; border-color: #6366f1; }
.slot-btn.busy { background: #f1f5f9; color: #94a3b8; cursor: not-allowed; }
.form-footer { display: flex; justify-content: flex-end; gap: 10px; }
.btn-primary { background: #6366f1; color: white; padding: 10px 18px; border-radius: 10px; font-weight: 600; }
.btn-secondary { background: #f1f5f9; padding: 10px 16px; border-radius: 10px; color: #334155; }
</style>
