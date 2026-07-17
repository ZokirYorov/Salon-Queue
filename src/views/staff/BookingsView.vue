<template>
  <div class="flex flex-col gap-6">
    <div class="flex items-center border-b border-gray-200 py-2 justify-between">
      <div class="flex flex-col w-full">
        <h2 class="font-bold w-full text-xl">Barcha navbatlar</h2>
        <p class="text-sm text-gray-600">Jami: {{ filteredBookings.length }} ta navbat</p>
      </div>
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 items-end gap-2 py-2">
        <div class="flex flex-col gap-1">
          <label for="userId">Xodimlar</label>
          <select v-model="filterEmpId" class="border border-gray-200 rounded-md p-2 py-1.5 cursor-pointer">
            <option value="">Xodimlar</option>
            <!-- Corrected: Use firebaseStore.employees -->
            <option v-for="e in firebaseStore.employees" :key="e.id" :value="e.id">
              {{ e.name }}
            </option>
          </select>
        </div>
        <div class="flex flex-col gap-1">
          <label for="typeId">Barcha tur</label>
          <select v-model="filterSource" class="border border-gray-200 rounded-md p-1.5 cursor-pointer">
            <option value="">Barcha tur</option>
            <option value="online">🌐 Online</option>
            <option value="manual">👔 Qo'lda</option>
          </select>
        </div>
        <div class="flex flex-col gap-1">
          <label for="statusId">Holat</label>
          <select v-model="filterStatus" id="statusId" class="border border-gray-200 rounded-md p-1.5 cursor-pointer">
            <option value="">Holat</option>
            <option value="Kutilmoqda">Kutilmoqda</option>
            <option value="Bajarildi">Bajarildi</option>
            <option value="Bekor">Bekor</option>
          </select>
        </div>
        <AppDatePicker
            v-model="filterDate"
            label="Sana"
            placeholder="Sana"
        />
        <button class=" hover:bg-gray-200 cursor-pointer text-blue-500 border border-gray-300 rounded px-2 py-1.5 font-semibold"
                @click="clearFilters"
        >
          <i class="fa-solid fa-filter-circle-xmark"></i>
          Tozalash
        </button>
      </div>
    </div>

    <div v-if="firebaseStore.loading" class="text-center p-8">
      <p>Yuklanmoqda...</p>
    </div>

    <div v-else class="bg-white border border-gray-200 rounded-xl overflow-x-auto">
      <table class="min-w-full text-sm">
        <thead class="bg-gray-50 text-gray-500 uppercase text-xs">
        <tr>
          <th class="px-4 py-3 text-left">№</th>
          <th class="px-4 py-3 text-left">Mijoz</th>
          <th class="px-4 py-3 text-left">Xizmat</th>
          <th class="px-4 py-3 text-left">Xodim</th>
          <th class="px-4 py-3 text-left">Sana / Vaqt</th>
          <th class="px-4 py-3 text-left">Tur</th>
          <th class="px-4 py-3 text-left">Holat</th>
          <th class="px-4 py-3 text-left">Amal</th>
        </tr>
        </thead>
        <tbody>
        <tr
            v-for="(b, index) in filteredBookings"
            :key="b.id"
            class="border-t hover:bg-gray-50 transition"
            :class="b.source === 'online' ? 'border-l-4 border-sky-500' : 'border-l-4 border-indigo-500'"
        >
          <td class="px-4 py-2">{{ index + 1 }}</td>
          <td class="px-4 py-2">
            <div class="flex flex-col">
              <span class="font-semibold text-gray-800 break-words">{{ b.clientName }}</span>
              <span class="text-xs text-gray-400">{{ b.phone }}</span>
            </div>
          </td>
          <td class="px-4 py-2 text-gray-600">{{ b.service }}</td>
          <td class="px-4 py-2">
            <div class="flex items-center gap-2">
              <div
                  class="w-7 h-7 flex items-center justify-center rounded-full text-white text-xs font-bold"
                  :style="{ background: emp(b.employeeId)?.color || '#94a3b8' }"
              >
                {{ emp(b.employeeId)?.name.charAt(0) || '?' }}
              </div>
              <span class="text-gray-700">{{ emp(b.employeeId)?.name || '—' }}</span>
            </div>
          </td>
          <td class="px-4 py-2">
            <div class="flex flex-col">
              <span class="text-xs text-gray-500">{{ formatDate(b.date) }}</span>
              <span class="font-semibold text-gray-800">{{ b.time }} — {{ addMinutes(b.time, b.duration) }}</span>
              <span class="text-xs text-gray-400">{{ b.duration }} daqiqa</span>
            </div>
          </td>
          <td class="px-4 py-2">
            <span class="px-2 py-1 text-xs rounded-md font-medium" :class="b.source === 'online' ? 'bg-sky-100 text-sky-600' : 'bg-indigo-100 text-indigo-600'">
              {{ b.source === 'online' ? '🌐 Online' : "👔 Qo'lda" }}
            </span>
          </td>
          <td class="px-4 py-2">
            <select :value="b.status" @change="changeStatus(b.id, $event)" class="border rounded-md px-2 py-1 text-sm" :class="statusColor[b.status]">
              <option>Kutilmoqda</option>
              <option>Bajarildi</option>
              <option>Bekor</option>
            </select>
          </td>
          <td class="px-4 py-2">
            <button class="text-red-500 hover:text-red-700 bg-red-200 px-2 py-1 rounded-md cursor-pointer transition" @click="remove(b.id)">
              O'chirish
            </button>
          </td>
        </tr>
        <tr v-if="filteredBookings.length === 0">
          <td colspan="8" class="text-center py-6 text-gray-500 font-semibold">
            Navbat topilmadi. Filtrlarni o‘zgartiring.
          </td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useFirebaseStore, type Booking } from '@/stores/firebaseStore';
import AppDatePicker from "@/components/AppDatePicker.vue";

const firebaseStore = useFirebaseStore();

// --- UTILS ---
const formatDate = (dateString: string) => { if (!dateString) return ''; const date = new Date(dateString); return date.toLocaleDateString('uz-UZ', { day: 'numeric', month: 'short' }); };
const toMins = (time: string) => { if(!time) return 0; const [h, m] = time.split(':').map(Number); return h * 60 + m; };
const addMinutes = (time: string, mins: number) => { const totalMins = toMins(time) + mins; const h = Math.floor(totalMins / 60); const m = totalMins % 60; return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`; };

// --- STATE ---
const filterEmpId  = ref<string | ''>('');
const filterSource = ref('');
const filterStatus = ref('');
const filterDate   = ref('');

// --- LIFECYCLE ---
onMounted(() => {
  if (firebaseStore.bookings.length === 0) firebaseStore.fetchAllBookings();
  if (firebaseStore.employees.length === 0) firebaseStore.fetchEmployees();
});

// --- METHODS ---
function clearFilters() {
  filterEmpId.value  = '';
  filterSource.value = '';
  filterStatus.value = '';
  filterDate.value   = '';
}

const filteredBookings = computed(() =>
  firebaseStore.bookings
    .filter(b => !filterEmpId.value  || b.employeeId === filterEmpId.value)
    .filter(b => !filterSource.value || b.source     === filterSource.value)
    .filter(b => !filterStatus.value || b.status     === filterStatus.value)
    .filter(b => !filterDate.value   || b.date       === filterDate.value)
    .sort((a, b) => (b.date + b.time).localeCompare(a.date + a.time))
);

// Corrected: Use firebaseStore.employees
const emp = (id: string) => firebaseStore.employees.find(e => e.id === id);

function changeStatus(id: string, e: Event) {
  const status = (e.target as HTMLSelectElement).value as Booking['status'];
  firebaseStore.updateBooking(id, { status });
}

const statusColor: Record<string, string> = {
  Kutilmoqda: 'bg-blue-50 text-blue-500',
  Bajarildi:  'bg-green-50 text-green-600',
  Bekor:      'bg-red-50 text-red-500',
};

function remove(id: string) {
  if (confirm("Bu navbatni o'chirishni tasdiqlaysizmi?")) {
    firebaseStore.deleteBooking(id);
  }
}
</script>
