<template>
  <div class="flex flex-col gap-6">
    <div class="flex items-center border-b border-gray-200 py-2 justify-between">
      <div>
        <h2 class="font-semibold text-lg">Barcha navbatlar</h2>
        <p class="text-sm text-gray-600">Jami: {{ filtered.length }} ta navbat</p>
      </div>
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 items-center gap-2 py-2">
        <select v-model="filterEmpId" class="border border-gray-200 rounded-md p-2 py-1 cursor-pointer">
          <option value="">Xodimlar</option>
          <option v-for="e in store.employees" :key="e.id" :value="e.id">
            {{ e.name }}
          </option>
        </select>
        <select v-model="filterSource" class="border border-gray-200 rounded-md p-1 cursor-pointer">
          <option value="">Barcha tur</option>
          <option value="online">🌐 Online</option>
          <option value="staff">👔 Qo'lda</option>
        </select>
        <select v-model="filterStatus" class="border border-gray-200 rounded-md p-1 cursor-pointer">
          <option value="">Holat</option>
          <option value="Kutilmoqda">Kutilmoqda</option>
          <option value="Bajarildi">Bajarildi</option>
          <option value="Bekor">Bekor</option>
        </select>
        <input type="date" v-model="filterDate" class="border border-gray-200 rounded-md p-1 cursor-pointer" title="Sana bo'yicha filtr" />
        <button class="bg-gray-500 cursor-pointer text-white rounded px-2 py-1" @click="clearFilters">
          Tozalash
        </button>
      </div>
    </div>
    <div class="bg-white border border-gray-200 rounded-xl overflow-x-auto">
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
            v-for="(b, index) in filtered"
            :key="b.id"
            class="border-t hover:bg-gray-50 transition"
            :class="b.source === 'online' ? 'border-l-4 border-sky-500' : 'border-l-4 border-indigo-500'"
        >
          <td class="px-4 py-2">{{ index + 1 }}</td>
          <td class="px-4 py-2">
            <div class="flex flex-col">
              <span class="font-semibold text-gray-800">{{ b.clientName }}</span>
              <span class="text-xs text-gray-400">{{ b.phone }}</span>
            </div>
          </td>
          <td class="px-4 py-2 text-gray-600">
            {{ b.service }}
          </td>
          <td class="px-4 py-2">
            <div class="flex items-center gap-2">
              <div
                  class="w-7 h-7 flex items-center justify-center rounded-full text-white text-xs font-bold"
                  :style="{ background: emp(b.employeeId)?.color || '#94a3b8' }"
              >
                {{ emp(b.employeeId)?.name.charAt(0) || '?' }}
              </div>
              <span class="text-gray-700">
              {{ emp(b.employeeId)?.name || '—' }}
            </span>
            </div>
          </td>
          <td class="px-4 py-2">
            <div class="flex flex-col">
            <span class="text-xs text-gray-500">
              {{ store.formatDateShort(b.date) }}
            </span>
              <span class="font-semibold text-gray-800">
              {{ b.time }} — {{ store.addMinutes(b.time, b.duration) }}
            </span>
              <span class="text-xs text-gray-400">
              {{ b.duration }} daqiqa
            </span>
            </div>
          </td>
          <td class="px-4 py-2">
          <span
              class="px-2 py-1 text-xs rounded-md font-medium"
              :class="b.source === 'online'
              ? 'bg-sky-100 text-sky-600'
              : 'bg-indigo-100 text-indigo-600'"
          >
            {{ b.source === 'online' ? '🌐 Online' : "👔 Qo'lda" }}
          </span>
          </td>
          <td class="px-4 py-2">
            <select
                v-model="b.status"
                @change="changeStatus(b.id, $event)"
                class="border rounded-md px-2 py-1 text-sm"
                :class="[store.statusClass(b.status), statusColor[b.status]]"
            >
              <option>Kutilmoqda</option>
              <option>Bajarildi</option>
              <option>Bekor</option>
            </select>
          </td>
          <td class="px-4 py-2">
            <button
                class="text-red-500 hover:text-red-700 bg-red-200 px-2 py-1 rounded-md cursor-pointer transition"
                @click="remove(b.id)"
            >
              O'chirish
            </button>
          </td>
        </tr>
        <tr v-if="filtered.length === 0">
          <td colspan="8" class="text-center py-6 text-gray-400">
            Navbat topilmadi. Filtrlarni o‘zgartiring.
          </td>
        </tr>
        </tbody>
      </table>
    </div>
<!--    <div class="bookings-table">-->
<!--      <div class="t-head">-->
<!--        <span>№</span>-->
<!--        <span>Mijoz</span>-->
<!--        <span>Xizmat</span>-->
<!--        <span>Xodim</span>-->
<!--        <span>Sana / Vaqt</span>-->
<!--        <span>Tur</span>-->
<!--        <span>Holat</span>-->
<!--        <span>Amal</span>-->
<!--      </div>-->
<!--      <div v-if="filtered.length === 0" class="empty-state">-->
<!--        Navbat topilmadi. Filtrlarni o'zgartiring.-->
<!--      </div>-->
<!--      <div-->
<!--        v-for="(b, index) in filtered"-->
<!--        :key="b.id"-->
<!--        class="t-row"-->
<!--        :class="b.source === 'online' ? 'row&#45;&#45;online' : 'row&#45;&#45;manual'"-->
<!--      >-->
<!--        <div>{{index + 1}}</div>-->
<!--        <div class="td td-client">-->
<!--          <span class="client-name">{{ b.clientName }}</span>-->
<!--          <span class="client-phone">{{ b.phone }}</span>-->
<!--        </div>-->
<!--        <div class="td">{{ b.service }}</div>-->
<!--        <div class="td td-emp">-->
<!--          <span class="flex items-center justify-center text-white font-semibold w-7 h-7 rounded-full" :style="{ background: emp(b.employeeId)?.color || '#94a3b8' }">-->
<!--            {{ emp(b.employeeId)?.name.charAt(0) || '?' }}-->
<!--          </span>-->
<!--          <span>{{ emp(b.employeeId)?.name || '—' }}</span>-->
<!--        </div>-->
<!--        <div class="td td-date">-->
<!--          <span>{{ store.formatDateShort(b.date) }}</span>-->
<!--          <strong>{{ b.time }} — {{ store.addMinutes(b.time, b.duration) }}</strong>-->
<!--          <span class="duration">{{ b.duration }} daqiqa</span>-->
<!--        </div>-->
<!--        <div class="td">-->
<!--          <span class="src-badge" :class="b.source === 'online' ? 'src&#45;&#45;online' : 'src&#45;&#45;manual'">-->
<!--            {{ b.source === 'online' ? '🌐 Online' : "👔 Qo'lda" }}-->
<!--          </span>-->
<!--        </div>-->
<!--        <div class="td">-->
<!--          <select-->
<!--            :value="b.status"-->
<!--            @change="changeStatus(b.id, $event)"-->
<!--            class="status-sel"-->
<!--            :class="store.statusClass(b.status)"-->
<!--          >-->
<!--            <option>Kutilmoqda</option>-->
<!--            <option>Bajarildi</option>-->
<!--            <option>Bekor</option>-->
<!--          </select>-->
<!--        </div>-->
<!--        <div class="td">-->
<!--          <button class="btn-icon" @click="remove(b.id)" title="O'chirish">🗑</button>-->
<!--        </div>-->
<!--      </div>-->
<!--    </div>-->
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useSalonStore, type Booking } from '@/stores/salonStore'

const store = useSalonStore()
const filterEmpId  = ref<number | ''>('')
const filterSource = ref('')
const filterStatus = ref('')
const filterDate   = ref('')

const hasFilters = computed(
  () => !!filterEmpId.value || !!filterSource.value || !!filterStatus.value || !!filterDate.value
)

function clearFilters() {
  filterEmpId.value  = ''
  filterSource.value = ''
  filterStatus.value = ''
  filterDate.value   = ''
}
const filtered = computed(() =>
  store.bookings
    .filter(b => !filterEmpId.value  || b.employeeId === filterEmpId.value)
    .filter(b => !filterSource.value || b.source     === filterSource.value)
    .filter(b => !filterStatus.value || b.status     === filterStatus.value)
    .filter(b => !filterDate.value   || b.date       === filterDate.value)
    .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time))
)

function emp(id: number) {
  return store.getEmployee(id)
}

function changeStatus(id: number, e: Event) {
  const status = (e.target as HTMLSelectElement).value as Booking['status']
  store.updateBookingStatus(id, status)
}

const statusColor = ref<Record<string, string>>({
  Kutilmoqda: 'bg-blue-50 text-blue-500',
  Bajarildi:  'bg-green-50 text-green-600',
  Bekor:      'bg-red-50 text-red-500',
})

function remove(id: number) {
  if (confirm('Bu navbatni o\'chirishni tasdiqlaysizmi?')) {
    store.deleteBooking(id)
  }
}
</script>

<style scoped>
</style>
