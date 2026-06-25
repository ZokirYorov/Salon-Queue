<template>
  <div class="gap-2 flex flex-col pb-4">
    <div class="page-header">
      <div>
        <h2 class="page-title font-bold">Navbat olish</h2>
        <p class="page-sub text-gray-600">Xizmat, usta va qulay vaqtni tanlang</p>
      </div>
    </div>

    <div class="form-card gap-4 flex flex-col form-wrap rounded border border-gray-200 p-6">
      <div class="step-header w-full">
        <span class="step-num">1</span>
        <span>Sizning ma'lumotlaringiz</span>
      </div>

      <div class="flex gap-3 w-full">
        <AppInput
            v-model="form.clientName"
            label="Ism Familiya *"
            class="w-full"
            placeholder="Masalan: Nodir Kamolov"
            :externalError="errors.clientName"
        />
        <AppInput
            v-model="form.phone"
            label="Telefon raqam *"
            class="w-full"
            placeholder="+998 90 000 00 00"
            :externalError="errors.phone"
        />
      </div>
      <div class="step-header">
        <span class="step-num">2</span>
        <span>Xizmat va sana</span>
      </div>

      <div class="flex items-center gap-4">
        <AppSelect
            v-model="form.service"
            :options="optionServices"
            text-field="text"
            value-field="name"
            label="Xizmat turi"
            required
            class="w-full"
            disabledValue="Tanlang..."
            @change="onServiceChange"
            :errorText="errors.service"
        />
        <AppDatePicker
            v-model="form.date"
            label="Sana *"
            :minDate="store.today"
            :isError="errors.date"
            placeholder="Sanani tanlang"
            @change=" () => {
              form.employeeId = 0
              form.time = ''
             }"
            class="w-full"
        />
      </div>
      <div v-if="selectedSvc" class="svc-info mt-2">
        <span>⏱ {{ selectedSvc.duration }} daqiqa</span>
        <span>💰 {{ store.formatPrice(selectedSvc.price ?? 0) }}</span>
      </div>
      <template v-if="form.service && form.date">
        <div class="step-header">
          <span class="step-num">3</span>
          <span>Usta tanlang</span>
        </div>
        <div class="flex flex-col gap-2">
          <p class="font-bold text-gray-600">Har bir ustaning bo'sh vaqtlari ko'rsatilmoqda</p>
          <div class="flex gap-2">
            <div
                v-for="emp in availableEmployees"
                :key="emp.id"
                @click="pickEmployee(emp.id)"
                class="flex rounded-md p-1 items-center gap-2 border border-gray-200 cursor-pointer"
                :class="[
                  form.employeeId === emp.id && 'border-indigo-500 bg-indigo-50',
                  store.isEmployeeFull(emp.id, form.date, form.service) && 'opacity-50 pointer-events-none'
                ]"
            >
              <div class="px-3 rounded-full py-1 text-white" :style="{ background: emp.color }">
                {{ emp.name.charAt(0) }}
              </div>
              <div class="flex flex-col">
                <span class="ep-name">{{ emp.name }}</span>
                <span class="text-gray-600 text-sm">{{ emp.role }}</span>
              </div>
              <div class="ep-right">
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
          <span class="error-msg" v-if="errors.employeeId">{{ errors.employeeId }}</span>
        </div>
      </template>
      <template v-if="form.employeeId">
        <div class="step-header">
          <span class="step-num">4</span>
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
        <div class="">
          <div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-2">
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
                    ? 'bg-gray-200 text-gray-400 cursor-none'
                    : 'hover:bg-indigo-50 p-3 text-gray-600 border hover:border-indigo-500 hover:text-indigo-500'
                ]"
            >
              {{ t }}
            </button>
          </div>
          <span class="error-msg" v-if="errors.time">{{ errors.time }}</span>
        </div>
      </template>
      <div v-if="form.time" class="booking-summary">
        <h4 class="summary-title">Navbat tafsilotlari</h4>
        <div class="summary-row">
          <span>Xizmat</span>
          <strong>{{ form.service }}</strong>
        </div>
        <div class="summary-row">
          <span>Usta</span>
          <strong>{{ selectedEmp?.name }}</strong>
        </div>
        <div class="summary-row">
          <span>Sana</span>
          <strong>{{ store.formatDate(form.date) }}</strong>
        </div>
        <div class="summary-row">
          <span>Vaqt</span>
          <strong>{{ form.time }} — {{ store.addMinutes(form.time, selectedSvc?.duration ?? 0) }}</strong>
        </div>
        <div class="summary-row">
          <span>Narx</span>
          <strong>{{ store.formatPrice(selectedSvc?.price ?? 0) }}</strong>
        </div>
      </div>
      <div class="form-footer mt-2">
        <button class="bg-blue-500 cursor-pointer text-white rounded px-2 py-1 wide" @click="submit">
          Navbat olish →
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {reactive, computed, watch} from 'vue'
import { useRouter } from 'vue-router'
import { useSalonStore } from '@/stores/salonStore'
import AppDatePicker from "@/components/AppDatePicker.vue";
import AppSelect from "@/components/ui/AppSelect.vue";
import AppInput from "@/components/ui/AppInput.vue";

const store  = useSalonStore()
const router = useRouter()

const form = reactive({
  clientName: '',
  phone:      '',
  service:    '',
  duration:   0,
  date:       store.today,
  time:       '',
  employeeId: 0,
})

const errors = reactive({
  clientName: '',
  phone:      '',
  service:    '',
  date:       '',
  employeeId: '',
  time:       '',
})

const optionServices = computed(() => {
  return store.services.map((s: any) => ({
    value: s.name,
    text: `${s.name} - ${s.price} so'm`,
  }))
})

watch(
    () => form,
    () => {
      if (form.clientName.trim()) {
        errors.clientName = ''
      }
      if (form.phone.trim()) {
        errors.phone = ''
      }
      if (form.service) {
        errors.service = ''
      }
      if (form.date) {
        errors.date = ''
      }
    },
    { deep: true }
)

const selectedSvc = computed(() =>
  store.services.find(s => s.name === form.service)
)

const selectedEmp = computed(() =>
  store.getEmployee(form.employeeId)
)

function onServiceChange() {
  form.duration    = selectedSvc.value?.duration ?? 0
  form.employeeId  = 0
  form.time        = ''
}

const availableEmployees = computed(() =>
    store.employeesForService(form.service)
)

function pickEmployee(id: number) {
  if (store.isEmployeeFull(id, form.date, form.service)) return
  form.employeeId = id
  form.time       = ''
}

function validate(): boolean {
  errors.clientName  = form.clientName.trim()  ? '' : 'Ism kiritilishi shart'
  errors.phone       = form.phone.trim()       ? '' : 'Telefon raqam kiritilishi shart'
  errors.service     = form.service            ? '' : 'Xizmat tanlanishi shart'
  errors.date        = form.date               ? '' : 'Sana tanlanishi shart'
  errors.employeeId  = form.employeeId         ? '' : 'Usta tanlanishi shart'
  errors.time        = form.time               ? '' : 'Vaqt tanlanishi shart'
  return Object.values(errors).every(e => !e)
}

function submit() {
  if (!validate()) return
  store.addBooking({
    clientName: form.clientName.trim(),
    phone:      form.phone.trim(),
    service:    form.service,
    duration:   form.duration,
    date:       form.date,
    time:       form.time,
    status:     'Kutilmoqda',
    source:     'online',
    employeeId: form.employeeId,
  })

  localStorage.setItem('lastPhone', form.phone.trim())
  router.push('/client/my')
}
</script>

<style scoped>
.form-wrap { max-width: 680px; }

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
.svc-info {
  display: flex;
  gap: 16px;
  background: #f0f9ff;
  border: 1px solid #bae6fd;
  border-radius: 10px;
  padding: 10px 16px;
  font-size: 13px;
  font-weight: 600;
  color: #0369a1;
  margin-bottom: 8px;
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
  flex-wrap: wrap;
}
.busy-lbl  { font-size: 12px; font-weight: 700; color: #475569; flex-shrink: 0; }
.busy-dots { display: flex; gap: 3px; flex-wrap: wrap; flex: 1; }
.busy-dot  { width: 8px; height: 8px; border-radius: 50%; display: inline-block; flex-shrink: 0; }
.busy-dot.green { background: #22c55e; }
.busy-dot.red   { background: #ef4444; }
.busy-hint { font-size: 11px; color: #94a3b8; display: flex; align-items: center; gap: 4px; }

.booking-summary {
  background: #f0f9ff;
  border: 1px solid #bae6fd;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 16px;
  margin-top: 8px;
}
.summary-title {
  font-size: 13px;
  font-weight: 700;
  color: #0369a1;
  margin: 0 0 12px;
}
.summary-row {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  padding: 6px 0;
  border-bottom: 1px solid #bae6fd;
  color: #0369a1;
}
.summary-row:last-child { border: none; }
.summary-row strong     { color: #0c4a6e; }
</style>
