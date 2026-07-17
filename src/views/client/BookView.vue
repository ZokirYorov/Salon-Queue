<template>
  <div class="gap-2 flex flex-col pb-4">
    <div class="page-header">
      <div>
        <h2 class="page-title font-bold">Navbat olish</h2>
        <p class="page-sub text-gray-600">Xizmat, usta va qulay vaqtni tanlang</p>
      </div>
    </div>

    <div class="form-card gap-4 flex flex-col form-wrap rounded border border-gray-200 p-6">
      <div class="step-header w-full"><span class="step-num">1</span><span>Sizning ma'lumotlaringiz</span></div>
      <div class="flex gap-3 w-full">
        <AppInput v-model="form.clientName" label="Ism Familiya *" class="w-full" placeholder="Masalan: Nodir Kamolov" :externalError="errors.clientName" @input="errors.clientName = ''" />
        <AppInput v-model="form.phone" label="Telefon raqam *" class="w-full" placeholder="+998 90 000 00 00" :externalError="errors.phone" @input="errors.phone = ''" />
      </div>

      <div class="step-header"><span class="step-num">2</span><span>Xizmat va sana</span></div>
      <div class="flex items-center gap-4">
        <AppSelect v-model="form.service" :options="optionServices" text-field="text" value-field="name" label="Xizmat turi" required class="w-full" disabledValue="Tanlang..." @change="onServiceChange" :errorText="errors.service" />
        <AppDatePicker v-model="form.date" label="Sana *" :minDate="today" :isError="errors.date" placeholder="Sanani tanlang" @change="onDateChange" class="w-full" />
      </div>
      <div v-if="selectedSvc" class="svc-info mt-2"><span>⏱ {{ selectedSvc.duration }} daqiqa</span><span>💰 {{ formatPrice(selectedSvc.price) }}</span></div>
      <template v-if="form.service && form.date">
        <div class="step-header"><span class="step-num">3</span><span>Usta tanlang</span></div>
        <div class="flex flex-col gap-2">
          <p class="font-bold text-gray-600">Har bir ustaning bo'sh vaqtlari ko'rsatilmoqda</p>
          <div class="flex gap-2">
            <div v-for="emp in availableEmployees" :key="emp.id" @click="pickEmployee(emp.id)" class="flex rounded-md p-1 items-center gap-2 border border-gray-200 cursor-pointer" :class="{'border-indigo-500 bg-indigo-50': form.employeeId === emp.id}">
              <div class="px-3 rounded-full py-1 text-white" :style="{ background: emp.color }">{{ emp.name.charAt(0) }}</div>
              <div class="flex flex-col"><span class="ep-name font-semibold">{{ emp.name }}</span><span class="text-gray-600 text-sm">{{ emp.role }}</span></div>
            </div>
          </div>
          <span class="error-msg" v-if="errors.employeeId">{{ errors.employeeId }}</span>
        </div>
      </template>
      <template v-if="form.employeeId">
        <div class="step-header"><span class="step-num">4</span><span class="flex items-center gap-2">Vaqt tanlang<i class="fa-solid fa-arrow-right-long"></i><span class="text-gray-600">{{ selectedEmp?.name }}</span></span></div>
        <div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-2">
          <button v-for="t in timeSlots" :key="t" @click="form.time = t" type="button" :disabled="isSlotBusy(t, form.date, form.service, form.employeeId)" class="text-xs text-white relative font-semibold p-3 cursor-pointer rounded-lg border" :class="[form.time === t ? 'bg-indigo-500' : 'bg-green-400', isSlotBusy(t, form.date, form.service, form.employeeId) ? 'bg-red-400 cursor-not-allowed' : 'hover:bg-indigo-500']">{{ t }}</button>
        </div>
        <span class="error-msg" v-if="errors.time">{{ errors.time }}</span>
      </template>
      <div v-if="form.time" class="booking-summary">
        <h4 class="summary-title">Navbat tafsilotlari</h4>
        <div class="summary-row"><span>Xizmat</span><strong>{{ form.service }}</strong></div>
        <div class="summary-row"><span>Usta</span><strong>{{ selectedEmp?.name }}</strong></div>
        <div class="summary-row"><span>Sana</span><strong>{{ formatDate(form.date) }}</strong></div>
        <div class="summary-row"><span>Vaqt</span><strong>{{ form.time }} — {{ addMinutes(form.time, selectedSvc?.duration ?? 0) }}</strong></div>
        <div class="summary-row"><span>Narx</span><strong>{{ formatPrice(selectedSvc?.price ?? 0) }}</strong></div>
      </div>
      <div class="form-footer mt-2">
        <button class="bg-blue-500 cursor-pointer text-white rounded px-2 py-1 wide" @click="submit" :disabled="firebaseStore.loading">
          {{ firebaseStore.loading ? 'Band qilinmoqda...' : 'Navbat olish →' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useFirebaseStore } from '@/stores/firebaseStore';
import AppDatePicker from "@/components/AppDatePicker.vue";
import AppSelect from "@/components/ui/AppSelect.vue";
import AppInput from "@/components/ui/AppInput.vue";

const today = new Date().toISOString().split('T')[0];
const timeSlots = Array.from({ length: 24 }, (_, i) => { const hour = Math.floor(i / 2) + 9; const minute = i % 2 === 0 ? '00' : '30'; return `${hour.toString().padStart(2, '0')}:${minute}`; });
const toMins = (time: string) => { if(!time) return 0; const [h, m] = time.split(':').map(Number); return h * 60 + m; };
const addMinutes = (time: string, mins: number) => { const totalMins = toMins(time) + mins; const h = Math.floor(totalMins / 60); const m = totalMins % 60; return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`; };
const formatDate = (dateString: string) => { if (!dateString) return ''; const date = new Date(dateString); return date.toLocaleDateString('uz-UZ', { day: 'numeric', month: 'long' }); };
const formatPrice = (p: number) => (p || 0).toLocaleString() + " so'm";

const firebaseStore = useFirebaseStore();
const router = useRouter();

const form = reactive({ clientName: '', phone: '', service: '', duration: 0, date: today, time: '', employeeId: '' });
const errors = reactive({ clientName: '', phone: '', service: '', date: '', employeeId: '', time: '' });

onMounted(() => {
  if (firebaseStore.services.length === 0) firebaseStore.fetchServices();
  if (firebaseStore.employees.length === 0) firebaseStore.fetchEmployees();
  if (firebaseStore.bookings.length === 0) firebaseStore.fetchAllBookings();
});

const optionServices = computed(() => firebaseStore.services.map(s => ({ name: s.name, text: `${s.name} - ${formatPrice(s.price)} - ${s.duration} min` })));
const selectedSvc = computed(() => firebaseStore.services.find(s => s.name === form.service));
const selectedEmp = computed(() => firebaseStore.employees.find(e => e.id === form.employeeId));
const availableEmployees = computed(() => {
  if (!form.service) return [];
  return firebaseStore.employees.filter(emp => emp.services.length === 0 || emp.services.includes(form.service));
});

const onServiceChange = () => { form.duration = selectedSvc.value?.duration ?? 0; form.employeeId = ''; form.time = ''; };
const onDateChange = () => { form.employeeId = ''; form.time = ''; };
const pickEmployee = (id: string) => { form.employeeId = id; form.time = ''; };

const isSlotBusy = (slot: string, date: string, service: string, employeeId: string): boolean => {
  if (!service || !employeeId) return false;
  const serviceDuration = selectedSvc.value?.duration ?? 30;
  const slotStart = toMins(slot);
  const slotEnd = slotStart + serviceDuration;
  return firebaseStore.bookings.some(booking => {
    if (booking.date !== date || booking.employeeId !== employeeId) return false;
    const bookingStart = toMins(booking.time);
    const bookingEnd = bookingStart + booking.duration;
    return slotStart < bookingEnd && slotEnd > bookingStart;
  });
};

const validate = (): boolean => {
  errors.clientName = form.clientName.trim() ? '' : 'Ism kiritilishi shart';
  errors.phone = form.phone.trim() ? '' : 'Raqam kiritilishi shart';
  errors.service = form.service ? '' : 'Xizmat tanlanishi shart';
  errors.date = form.date ? '' : 'Sana tanlanishi shart';
  errors.employeeId = form.employeeId ? '' : 'Usta tanlanishi shart';
  errors.time = form.time ? '' : 'Vaqt tanlanishi shart';
  return Object.values(errors).every(e => !e);
};

async function submit() {
  if (!validate()) return;
  const success = await firebaseStore.addBooking({
    clientName: form.clientName.trim(),
    phone: form.phone.trim(),
    service: form.service,
    duration: form.duration,
    date: form.date,
    time: form.time,
    status: 'Kutilmoqda',
    source: 'online',
    employeeId: form.employeeId,
    clientId: form.phone.trim().replace(/\s/g, ''),
  });

  if (success) {
    localStorage.setItem('lastPhone', form.phone.trim());
    router.push('/client/my-bookings');
  }
}
</script>

<style scoped>
.form-wrap { max-width: 680px; }
.step-header { display: flex; align-items: center; gap: 10px; font-size: 15px; font-weight: 700; color: #1e293b; margin: 24px 0 14px; }
.step-num { width: 28px; height: 28px; border-radius: 50%; background: #0284c7; color: #fff; font-size: 13px; font-weight: 800; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.svc-info { display: flex; gap: 16px; background: #f0f9ff; border: 1px solid #bae6fd; border-radius: 10px; padding: 10px 16px; font-size: 13px; font-weight: 600; color: #0369a1; margin-bottom: 8px; }
.booking-summary { background: #f0f9ff; border: 1px solid #bae6fd; border-radius: 12px; padding: 16px; margin-bottom: 16px; margin-top: 8px; }
.summary-title { font-size: 13px; font-weight: 700; color: #0369a1; margin: 0 0 12px; }
.summary-row { display: flex; justify-content: space-between; font-size: 14px; padding: 6px 0; border-bottom: 1px solid #bae6fd; color: #0369a1; }
.summary-row:last-child { border: none; }
.summary-row strong { color: #0c4a6e; }
.error-msg { font-size: 12px; color: #ef4444; }
</style>
