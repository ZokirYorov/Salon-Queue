<template>
  <div class="flex flex-col gap-4">
    <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
      <div>
        <h2 class="text-2xl font-bold text-slate-900">Kunlik jadval</h2>
        <p class="text-sm text-gray-500">Har bir xodimning band vaqtlari</p>
      </div>
      <div class="flex gap-2">
        <input
            type="date"
            v-model="scheduleDate"
            class="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-indigo-400 outline-none"
        />
        <button
            @click="showAddModal = true"
            class="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap"
        >
          + Navbat qo'shish
        </button>
      </div>
    </div>
    <div class="flex gap-2 flex-wrap text-sm">
      <div class="flex items-center gap-1 px-2 py-1 bg-gray-50 border border-gray-200 rounded-lg">
        <span class="w-2 h-2 bg-green-500 rounded-full"></span> Online
      </div>
      <div class="flex items-center gap-1 px-2 py-1 bg-gray-50 border border-gray-200 rounded-lg">
        <span class="w-2 h-2 bg-blue-500 rounded-full"></span> Qo'lda
      </div>
      <div class="flex items-center gap-1 px-2 py-1 bg-gray-50 border border-gray-200 rounded-lg">
        <span class="w-2 h-2 bg-indigo-500 rounded-full"></span> Bajarildi
      </div>
      <div class="flex items-center gap-1 px-2 py-1 bg-gray-50 border border-gray-200 rounded-lg">
        <span class="w-2 h-2 bg-red-500 rounded-full"></span> Bekor
      </div>
    </div>
    <div class="overflow-x-auto overflow-y-auto max-h-[680px] rounded-xl border border-gray-200 bg-white shadow-sm">
      <div class="min-w-max">
        <div
            class="grid bg-gray-50 border-b border-gray-200 sticky top-0 z-20"
            :style="{ gridTemplateColumns: gridCols }"
        >
          <div class="px-3 py-3 text-xs font-bold text-gray-400 border-r">
            Vaqt
          </div>
          <div
              v-for="emp in store.employees"
              :key="emp.id"
              class="flex items-center gap-2 px-3 py-2 border-r border-gray-200"
          >
            <div
                class="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold shrink-0"
                :style="{ background: emp.color }"
            >
              {{ emp.name.charAt(0) }}
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-semibold truncate">{{ emp.name }}</p>
              <p class="text-xs text-gray-400 truncate">{{ emp.role }}</p>
            </div>
            <span class="text-xs bg-gray-200 px-2 py-1 rounded-full">
             {{ store.getCellBookingsForDate(scheduleDate, emp.id).length }}
            </span>
          </div>
        </div>
        <div
            v-for="slot in store.timeSlots"
            :key="slot"
            class="grid border-b border-gray-100 hover:bg-gray-50"
            :style="{ gridTemplateColumns: gridCols }"
            :class="[
              isCurrentSlot(slot)
                ? 'bg-orange-50 relative before:absolute before:left-0 before:top-0 before:h-full before:w-[2px] before:bg-orange-400'
                : ''
            ]"
        >
          <div class="px-3 py-2 text-xs font-semibold text-gray-500 border-r border-gray-200 flex items-center">
            {{ slot }}
          </div>
          <div
              v-for="emp in store.employees"
              :key="emp.id"
              class="flex flex-col gap-1 px-2 py-1 border-r border-gray-200 min-h-[48px]"
          >
            <div
                v-for="b in store.getCellBookings(slot, scheduleDate, emp.id)"
                :key="b.id"
                @click="openDetail(b)"
                class="flex items-start gap-2 p-2 rounded-md text-xs cursor-pointer transition hover:shadow-sm"
                :class="[
                  b.status === 'Bajarildi' && 'bg-indigo-50 text-indigo-700',
                  b.status === 'Bekor' && 'bg-red-50 text-red-700 line-through',
                  b.source === 'online' && b.status !== 'Bajarildi' && 'bg-green-50 text-green-700',
                  b.source === 'staff' && b.status !== 'Bajarildi' && 'bg-blue-50 text-blue-700'
                ]"
            >
              <span class="shrink-0 mt-[2px]">
                {{ b.source === 'online' ? '🌐' : '👔' }}
              </span>
              <div class="flex flex-col flex-1 min-w-0">
                <span class="font-semibold truncate">{{ b.clientName }}</span>
                <span class="opacity-70 truncate">{{ b.service }}</span>
              </div>
              <span class="text-[10px] opacity-60 shrink-0">
               → {{ store.addMinutes(b.time, b.duration) }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <p v-if="dayBookings.length === 0" class="text-center text-gray-400 mt-4">
      {{ store.formatDate(scheduleDate) }} kuni navbat yo'q
    </p>
    <div
        v-if="selectedBooking"
        class="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
        @click.self="selectedBooking = null"
    >
      <div class="bg-white w-[420px] max-w-full rounded-2xl shadow-xl p-5 animate-[fadeIn_3.2s_ease]">
        <div class="flex border-b border-gray-200 pb-1 justify-between items-center mb-4">
          <h3 class="text-lg font-semibold text-slate-800">
            Navbat tafsilotlari
          </h3>
          <button
              class="text-gray-400 cursor-pointer hover:text-red-500 text-lg"
              @click="selectedBooking = null"
          >
            ✕
          </button>
        </div>
        <div class="flex flex-col gap-3 text-sm">
          <div class="flex justify-between">
            <span class="text-gray-500">Mijoz</span>
            <span class="font-semibold">{{ selectedBooking.clientName }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-500">Telefon</span>
            <span>{{ selectedBooking.phone || '—' }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-500">Xizmat</span>
            <span>{{ selectedBooking.service }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-500">Vaqt</span>
            <span>
          {{ selectedBooking.time }} —
          {{ store.addMinutes(selectedBooking.time, selectedBooking.duration) }}
        </span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-gray-500">Holat</span>
            <select
                :value="selectedBooking.status"
                @change="changeStatus($event)"
                class="text-xs border border-gray-200 rounded-lg px-2 py-1 focus:ring-2 focus:ring-indigo-400 outline-none"
            >
              <option>Kutilmoqda</option>
              <option>Bajarildi</option>
              <option>Bekor</option>
            </select>
          </div>
        </div>
        <div class="flex items-center w-full justify-center mt-5 gap-2">
          <button
              class="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg text-sm"
              @click="removeBooking"
          >
            O'chirish
          </button>
          <button
              class="bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-1.5 rounded-lg text-sm"
              @click="selectedBooking = null"
          >
            Yopish
          </button>
        </div>
      </div>
    </div>

  </div>
  <div
      v-if="showAddModal"
      class="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
      @click.self="showAddModal = false"
  >
    <div class="bg-white w-[350px] md:w-[400px] lg:w-[500px] rounded-2xl shadow-xl p-6 overflow-y-auto max-h-[90vh]">
      <div class="flex justify-between items-center mb-4 border-b pb-2">
        <div>
          <h3 class="text-lg font-semibold">Navbat qo'shish</h3>
          <p class="text-xs text-gray-500">Mijoz uchun qo'lda navbat yarating</p>
        </div>
        <button @click="showAddModal = false"
                class="text-gray-400 border border-gray-400 rounded-full w-8 h-8 cursor-pointer hover:text-red-500 text-md"
        >
          ✕
        </button>
      </div>
      <div class="flex flex-col gap-4 text-sm">
        <div class="grid grid-cols-1 gap-3">
          <div>
            <label class="text-gray-600 text-xs">Mijoz ismi *</label>
            <input @change="clearError('clientName')"
                   v-model="form.clientName"
                   placeholder="Mijoz ismi"
                   class="w-full border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400 outline-none"
            />
          </div>
          <div>
            <label class="text-gray-600 text-xs">Telefon</label>
            <input @change="clearError('phone')"
                   v-model="form.phone"
                   placeholder="Telefon nomer"
                   class="w-full border border-gray-200 rounded-lg px-3 py-2"/>
          </div>
        </div>
        <div class="grid grid-cols-1 gap-3">
          <div>
            <label class="text-gray-600 text-xs">Xizmat *</label>
            <select
                v-model="form.service"
                @change:modelValue="() => {
                  onServiceChange()
                  clearError('service')
            }"
                    class="w-full border border-gray-200 rounded-lg px-3 py-2">
              <option value="">Tanlang...</option>
              <option v-for="s in store.services" :key="s.name" :value="s.name">
                {{ s.name }} ({{ s.duration }} min)
              </option>
            </select>
          </div>
          <div>
            <label class="text-gray-600 text-xs">Sana *</label>
            <input @change="clearError('date')" type="date" v-model="form.date" :min="store.today"
                   class="w-full border border-gray-200 rounded-lg px-3 py-2"/>
          </div>
        </div>
        <div v-if="form.service && form.date">
          <p class="text-xs text-gray-500 mb-2">Xodim tanlang</p>

          <div class="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-2">
            <div
                v-for="emp in availableEmployees"
                :key="emp.id"
                @click="pickEmployee(emp.id)"
                class="border border-gray-200 rounded-lg p-2 cursor-pointer transition"
                :class="[
              form.employeeId === emp.id && 'border-indigo-500 bg-indigo-50',
              store.isEmployeeFull(emp.id, form.date, form.service) && 'opacity-50 pointer-events-none'
            ]"
            >
              <p class="font-medium text-sm">{{ emp.name }}</p>
              <p class="text-xs text-gray-400">{{ emp.role }}</p>
            </div>
          </div>
        </div>
        <div v-if="form.employeeId">
          <p class="text-xs text-gray-500 mb-2">Vaqt tanlang</p>

          <div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2">
            <button
                v-for="t in store.timeSlots"
                :key="t"
                @click="form.time = t"
                :disabled="store.isSlotBusy(t, form.date, form.service, form.employeeId, null)"
                class="text-xs font-semibold cursor-pointer rounded-lg border border-gray-200"
                :class="[
              form.time === t ? 'bg-indigo-500 text-white hover:bg-indigo-500 hover:text-white' : '',
              store.isSlotBusy(t, form.date, form.service, form.employeeId, null)
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'hover:bg-indigo-50 p-3 text-gray-600 border hover:border-indigo-500 hover:text-indigo-500',
            ]"
            >
              {{ t }}
            </button>
          </div>
        </div>

        <!-- ACTIONS -->
        <div class="flex justify-end gap-2 mt-4">
          <button @click="showAddModal = false"
                  class="px-4 py-2 cursor-pointer bg-gray-100 hover:bg-gray-200 rounded-lg">
            Bekor qilish
          </button>
          <button @click="submit"
                  class="px-4 py-2 cursor-pointer bg-indigo-500 text-white rounded-lg">
            Saqlash
          </button>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref, computed} from 'vue'
import { RouterLink } from 'vue-router'
import { useSalonStore, type Booking } from '@/stores/salonStore'

const store = useSalonStore()

const scheduleDate = ref(store.today)

const selectedBooking = ref<Booking | null>(null)
const showAddModal = ref(false)

const form = ref({
  clientName: '',
  phone: '',
  service: '',
  duration: 0,
  date: store.today,
  time: '',
  employeeId: 0,
  note: ''
})

const errors = ref<Record<string, string>>({})

const validate = () => {

  const f = form.value
  if (!f.clientName) errors.value.clientName = "Majburiy"
  if (!f.service) errors.value.service = "Majburiy"
  if (!f.date) errors.value.date = "Majburiy"
  if (!f.time) errors.value.time = "Majburiy"
  if (!f.employeeId) errors.value.employeeId = "Majburiy"

  return Object.keys(errors.value).length === 0
}

function submit() {
  if (!validate()) return

  store.addBooking({
    clientName: form.value.clientName,
    phone: form.value.phone,
    service: form.value.service,
    duration: form.value.duration,
    date: form.value.date,
    time: form.value.time,
    status: 'Kutilmoqda',
    source: 'staff',
    employeeId: form.value.employeeId,
    note: form.value.note
  })

  resetForm()
  showAddModal.value = false
}

function resetForm() {
  form.value = {
    clientName: '',
    phone: '',
    service: '',
    duration: 0,
    date: store.today,
    time: '',
    employeeId: 0,
    note: ''
  }

  Object.keys(errors.value).forEach(k => errors.value[k] = '')
}

const clearError = (key: string) => {
  delete errors.value[key]
}

const availableEmployees = computed(() =>
    store.employeesForService(form.value.service)
)

function pickEmployee(id: number) {
  if (store.isEmployeeFull(id, form.value.date, form.value.service)) return
  form.value.employeeId = id
  form.value.time = ''
}

function onServiceChange() {
  const svc = store.services.find(s => s.name === form.value.service)
  form.value.duration = svc?.duration ?? 0
  form.value.employeeId = 0
  form.value.time = ''
}

const dayBookings = computed(() =>
  store.bookings.filter(b => b.date === scheduleDate.value)
)

const gridCols = computed(() => {
  return `80px repeat(${store.employees.length}, minmax(180px, 1fr))`
})

function isCurrentSlot(slot: string): boolean {
  if (scheduleDate.value !== store.today) return false
  const now   = new Date()
  const nowM  = now.getHours() * 60 + now.getMinutes()
  const slotM = store.toMins(slot)
  return nowM >= slotM && nowM < slotM + 30
}

function openDetail(b: Booking) {
  selectedBooking.value = { ...b }
}

function changeStatus(e: Event) {
  const status = (e.target as HTMLSelectElement).value as Booking['status']
  if (!selectedBooking.value) return
  store.updateBookingStatus(selectedBooking.value.id, status)
  selectedBooking.value = { ...selectedBooking.value, status }
}

function removeBooking() {
  if (!selectedBooking.value) return
  store.deleteBooking(selectedBooking.value.id)
  selectedBooking.value = null
}

</script>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>