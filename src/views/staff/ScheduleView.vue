<template>
  <div class="flex flex-col gap-4">
    <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
      <div>
        <h2 class="text-2xl font-bold text-slate-900">Kunlik jadval</h2>
        <p class="text-sm text-gray-500">Har bir xodimning band vaqtlari</p>
      </div>
      <div class="flex gap-2">
        <AppDatePicker
            v-model="scheduleDate"
            placeholder="Sanani tanlang"
            class="max-w-50"
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
      <button
          type="button"
          @click="activeFilter = 'all'"
          class="flex items-center cursor-pointer gap-1 px-2 py-1 border rounded-lg transition-all duration-200"
          :class="activeFilter === 'all'
          ? 'bg-gray-500 text-white border-gray-200'
          : 'bg-gray-50 border-gray-200'"
      >
        Hammasi
      </button>
      <button
          @click="activeFilter = 'online'"
          class="flex items-center cursor-pointer gap-1 px-2 py-1 border rounded-lg transition-all duration-200"
          :class="activeFilter === 'online'
      ? 'bg-green-100 text-gray-600 border-green-500'
      : 'bg-gray-50 border-gray-200'"
      >
        <span class="w-2 h-2 bg-green-500 rounded-full"
        ></span>
        Online
      </button>

      <button
          @click="activeFilter = 'staff'"
          class="flex items-center cursor-pointer gap-1 px-2 py-1 border rounded-lg transition-all duration-200"
          :class="activeFilter === 'staff'
          ? 'bg-blue-100 text-gray-600 border-blue-500'
          : 'bg-gray-50 border-gray-200'"
      >
        <span class="w-2 h-2 bg-blue-500 rounded-full"></span>
        Qo'lda
      </button>
      <button
          @click="activeFilter = 'Bajarildi'"
          class="flex items-center cursor-pointer gap-1 px-2 py-1 border rounded-lg transition-all duration-200"
          :class="activeFilter === 'Bajarildi'
      ? 'bg-indigo-100 text-gray-600 border-indigo-500'
      : 'bg-gray-50 border-gray-200'"
      >
        <span class="w-2 h-2 bg-indigo-500 rounded-full"></span>
        Bajarildi
      </button>

      <button
          @click="activeFilter = 'Bekor'"
          class="flex items-center cursor-pointer gap-1 px-2 py-1 border rounded-lg transition-all duration-200"
          :class="activeFilter === 'Bekor'
      ? 'bg-red-100 text-gray-600 border-red-500'
      : 'bg-gray-50 border-gray-200'"
      >
        <span class="w-2 h-2 bg-red-500 rounded-full"></span>
        Bekor
      </button>
      <span class="border-b border-gray-300 text-gray-600 p-1">Jami: {{filteredTotal}}</span>
    </div>
    <div class="overflow-x-auto overflow-y-auto max-h-[665px] rounded-xl border border-gray-200 bg-white shadow-sm">
      <div class="min-w-max">
        <div
            class="grid bg-gray-50 border-b border-gray-200 sticky top-0 z-20"
            :style="{ gridTemplateColumns: gridCols }"
        >
          <div class="z-60 grid sticky top-0 left-0 bg-gray-100 p-3 text-xs font-bold text-gray-400 border-r">
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
        <p v-if="dayBookings.length === 0" class="text-center p-10 text-gray-400 mt-4">
          {{ store.formatDate(scheduleDate) }} kuni navbat yo'q
        </p>
        <div
            v-else
            v-for="slot in store.timeSlots"
            :key="slot"
            class="grid border-b border-gray-100 hover:bg-gray-50"
            :style="{ gridTemplateColumns: gridCols }"
            :class="[
              isCurrentSlot(slot)
                ? 'current-time-row bg-orange-50 relative border-t border-b border-orange-100 before:absolute before:left-0 before:top-0 before:h-full before:w-[2px] before:bg-orange-400'
                : ''
            ]"
        >
          <div
              class="sticky left-0 px-3 z-10 py-2 text-xs font-semibold text-gray-500 border-r border-gray-200 flex items-center bg-white"
              :class="[
                isCurrentSlot(slot)
                  ? 'bg-orange-50 z-10 relative before:absolute before:left-0 before:top-0 before:h-full before:w-[2px] before:bg-orange-400'
                  : ''
              ]"
          >
            {{ slot }}
          </div>
          <div
              v-for="emp in store.employees"
              :key="emp.id"
              class="flex flex-col gap-1 px-2 py-1 border-r border-gray-200 min-h-[48px]"
          >
            <div
                v-for="b in filteredBookings(slot, emp.id)"
                :key="b.id"
                @click="openDetail(b)"
                class="flex items-start gap-2 z-1 p-2 rounded-lg text-xs font-semibold cursor-pointer transition hover:shadow-sm"
                :class="[
                  b.status === 'Bajarildi' && 'bg-indigo-100 text-indigo-700',
                  b.status === 'Kutilmoqda' && 'bg-blue-300 text-indigo-700',
                  b.status === 'Bekor' && 'bg-red-200 text-red-700 line-through',
                  b.source === 'online' && b.status !== 'Bajarildi' && 'bg-green-100 text-green-700',
                  b.source === 'staff' && b.status !== 'Bajarildi' && 'bg-blue-100 text-blue-700'
                ]"
            >
              <span class="shrink-0 mt-[2px]">
                {{ b.source === 'online' ? '🌐' : '👔' }}
              </span>
              <div class="flex flex-col flex-1 min-w-0">
                <span class="font-semibold truncate">{{ b.clientName }}</span>
                <span class="opacity-70 truncate">{{ b.service }}</span>
              </div>
              <span class="text-[12px] opacity-60 shrink-0">
               → {{ store.addMinutes(b.time, b.duration) }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
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
                v-model="selectedBooking.status"
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
          <AppInput
              v-model="form.clientName"
              label="Mijoz ismi *"
              placeholder="Mijoz ismi"
              :externalError="errors.clientName"
          />
          <AppInput
              v-model="form.phone"
              label="Telefon *"
              placeholder="+998 ..."
              :externalError="errors.phone"
          />
        </div>
        <div class="grid grid-cols-1 gap-3">
          <div>
            <label class="text-gray-600 text-xs">Xizmat *</label>
            <select
                v-model="form.service"
                @change="() => {
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
            <AppDatePicker
                v-model="form.date"
                :isError="errors.date"
                label="Sana *"
                :minDate="store.today"
            />
          </div>
        </div>
        <div v-if="form.service && form.date">
          <p class="text-xs text-gray-500 mb-2">Xodim tanlang</p>

          <div class="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            <div
                v-for="emp in availableEmployees"
                :key="emp.id"
                @click="pickEmployee(emp.id)"
                class="flex rounded-md px-2 py-1 items-center gap-2 border border-gray-200 cursor-pointer justify-between"
                :class="[
                  form.employeeId === emp.id && 'border-indigo-500 bg-indigo-50',
                  store.isEmployeeFull(emp.id, form.date, form.service) && 'opacity-50 pointer-events-none'
                ]"
            >
              <div>
                <p class="font-medium text-sm">{{ emp.name }}</p>
                <p class="text-xs text-gray-400">{{ emp.role }}</p>
              </div>
              <div
                  class="ep-free"
                  :class="{ none: store.isEmployeeFull(emp.id, form.date, form.service) }"
              >
                <p v-if="store.isEmployeeFull(emp.id, form.date, form.service)">
                  To'liq band
                </p>
                <div v-else-if="store.freeSlotCount(emp.id, form.date, form.service)">
                  <p>
                    {{store.freeSlotCount(emp.id, form.date, form.service)}} ta
                  </p>
                  bo'sh
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-if="form.employeeId">
          <div class="step-header">
            <span>Vaqt tanlang — {{ selectedEmp?.name }}</span>
          </div>
          <div class="busy-bar">
            <span class="busy-lbl">{{ store.formatDateShort(form.date) }} kuni:</span>
            <div class="busy-dots">
              <div
                  v-for="t in store.timeSlots"
                  :key="t"
                  class="busy-dot"
                  :class="store.isSlotBusy(t, form.date, form.service, form.employeeId, null) ? 'red' : 'green'"
                  :title="t"
              ></div>
            </div>
            <span class="busy-hint">
            <span class="busy-dot green"></span> Bo'sh
            <span class="busy-dot red"></span> Band
          </span>
          </div>
          <div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2">
            <button
                v-for="t in store.timeSlots"
                :key="t"
                @click="form.time = t"
                type="button"
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
import { useSalonStore } from '@/stores/salonStore'
import {Booking} from "@/typeModules/useModules";
import AppDatePicker from "@/components/AppDatePicker.vue";
import AppInput from "@/components/ui/AppInput.vue";

const store = useSalonStore()

const scheduleDate = ref(store.today)

const selectedBooking = ref<Booking | null>(null)
const showAddModal = ref(false)

const activeFilter = ref<'all' | 'online' | 'staff' | 'Bajarildi' | 'Bekor'>('all')

const filteredBookings = (slot: string, empId: number) => {
  const bookings = store.getCellBookings(slot, scheduleDate.value, empId)

  if (activeFilter.value === 'all') {
    return bookings
  }

  return bookings.filter(b => {
    if (activeFilter.value === 'online') {
      return b.source === 'online'
    }

    if (activeFilter.value === 'staff') {
      return b.source === 'staff'
    }

    return b.status === activeFilter.value
  })
}

const filteredTotal = computed(() => {
  const bookings = store.bookings.filter(
      b => b.date === scheduleDate.value
  )

  if (activeFilter.value === 'all') {
    return bookings.length
  }

  return bookings.filter(b => {
    if (activeFilter.value === 'online') {
      return b.source === 'online'
    }

    if (activeFilter.value === 'staff') {
      return b.source === 'staff'
    }

    return b.status === activeFilter.value
  }).length
})

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

const selectedEmp = computed(() =>
    store.getEmployee(form.value.employeeId)
)

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
.current-time-row::before {
  content: '';
  position: absolute;
  top: 0;
  left: 30%;
  width: 20%;
  height: 100%;
  background: linear-gradient(
      90deg,
      transparent,
      rgba(301,196,80,.25),
      transparent
  );
  animation: scanLine 2.5s linear infinite;
}

@keyframes scanLine {
  from {
    left: 0;
  }
  to {
    left: 80%;
  }
}
.step-header {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 15px;
  font-weight: 700;
  color: #1e293b;
  margin: 24px 0 14px;
}
.step-num {
  width: 28px; height: 28px;
  border-radius: 50%;
  background: #0284c7;
  color: #fff;
  font-size: 13px; font-weight: 800;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.busy-bar {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 10px 14px;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 10px;
}
.busy-lbl  { font-size: 12px; font-weight: 700; color: #475569; flex-shrink: 0; }
.busy-dots { display: flex; gap: 3px; flex-wrap: wrap; flex: 1; }
.busy-dot  { width: 8px; height: 8px; border-radius: 50%; display: inline-block; flex-shrink: 0; }
.busy-dot.green { background: #22c55e; }
.busy-dot.red   { background: #ef4444; }
.busy-hint { font-size: 11px; color: #94a3b8; display: flex; align-items: center; gap: 4px; }
</style>