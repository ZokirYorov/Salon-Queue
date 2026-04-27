<template>
  <div>
    <div class="page-header">
      <div>
        <h2 class="page-title">Navbat olish</h2>
        <p class="page-sub">Xizmat, usta va qulay vaqtni tanlang</p>
      </div>
    </div>

    <div class="form-card form-wrap">

      <!-- 1-qadam: Shaxsiy ma'lumot -->
      <div class="step-header">
        <span class="step-num">1</span>
        <span>Sizning ma'lumotlaringiz</span>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label>Ism Familiya *</label>
          <input
            v-model="form.clientName"
            placeholder="Masalan: Nodira Karimova"
            :class="{ error: errors.clientName }"
          />
          <span class="error-msg" v-if="errors.clientName">{{ errors.clientName }}</span>
        </div>
        <div class="form-group">
          <label>Telefon raqam *</label>
          <input
            v-model="form.phone"
            placeholder="+998 90 000 00 00"
            :class="{ error: errors.phone }"
          />
          <span class="error-msg" v-if="errors.phone">{{ errors.phone }}</span>
        </div>
      </div>

      <!-- 2-qadam: Xizmat va sana -->
      <div class="step-header">
        <span class="step-num">2</span>
        <span>Xizmat va sana</span>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label>Xizmat turi *</label>
          <select
            v-model="form.service"
            @change="onServiceChange"
            :class="{ error: errors.service }"
          >
            <option value="">Tanlang...</option>
            <option v-for="s in store.services" :key="s.name" :value="s.name">
              {{ s.name }} — {{ store.formatPrice(s.price ?? 0) }}
            </option>
          </select>
          <span class="error-msg" v-if="errors.service">{{ errors.service }}</span>
        </div>
        <div class="form-group">
          <label>Sana *</label>
          <input
            type="date"
            v-model="form.date"
            :min="store.today"
            @change="form.employeeId = 0; form.time = ''"
            :class="{ error: errors.date }"
          />
          <span class="error-msg" v-if="errors.date">{{ errors.date }}</span>
        </div>
      </div>

      <!-- Xizmat haqida ma'lumot -->
      <div v-if="selectedSvc" class="svc-info">
        <span>⏱ {{ selectedSvc.duration }} daqiqa</span>
        <span>💰 {{ store.formatPrice(selectedSvc.price ?? 0) }}</span>
      </div>

      <!-- 3-qadam: Usta tanlash -->
      <template v-if="form.service && form.date">
        <div class="step-header">
          <span class="step-num">3</span>
          <span>Usta tanlang</span>
        </div>

        <div class="form-group">
          <p class="hint">Har bir ustaning bo'sh vaqtlari ko'rsatilmoqda</p>
          <div class="emp-picker">
            <div
              v-for="emp in store.employeesForService(form.service)"
              :key="emp.id"
              class="emp-pick-card"
              :class="{
                selected: form.employeeId === emp.id,
                full: store.isEmployeeFull(emp.id, form.date, form.service)
              }"
              @click="pickEmployee(emp.id)"
            >
              <div class="ep-avatar" :style="{ background: emp.color }">
                {{ emp.name.charAt(0) }}
              </div>
              <div class="ep-info">
                <span class="ep-name">{{ emp.name }}</span>
                <span class="ep-role">{{ emp.role }}</span>
              </div>
              <div class="ep-right">
                <span
                  class="ep-free"
                  :class="{ none: store.isEmployeeFull(emp.id, form.date, form.service) }"
                >
                  {{ store.isEmployeeFull(emp.id, form.date, form.service)
                      ? "To'liq band"
                      : store.freeSlotCount(emp.id, form.date, form.service) + " ta bo'sh" }}
                </span>
              </div>
            </div>
          </div>
          <span class="error-msg" v-if="errors.employeeId">{{ errors.employeeId }}</span>
        </div>
      </template>

      <!-- 4-qadam: Vaqt tanlash -->
      <template v-if="form.employeeId">
        <div class="step-header">
          <span class="step-num">4</span>
          <span>Vaqt tanlang — {{ selectedEmp?.name }}</span>
        </div>

        <!-- Band/bo'sh vizual ko'rsatgich -->
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
            <span class="busy-dot green"></span> Bo'sh &nbsp;
            <span class="busy-dot red"></span> Band
          </span>
        </div>

        <div class="form-group">
          <div class="slots-grid">
            <button
              v-for="t in store.timeSlots"
              :key="t"
              type="button"
              class="slot-btn"
              :class="{
                selected: form.time === t,
                busy: store.isSlotBusy(t, form.date, form.service, form.employeeId, null),
                free: !store.isSlotBusy(t, form.date, form.service, form.employeeId, null),
              }"
              :disabled="store.isSlotBusy(t, form.date, form.service, form.employeeId, null)"
              @click="form.time = t"
            >{{ t }}</button>
          </div>
          <span class="error-msg" v-if="errors.time">{{ errors.time }}</span>
        </div>
      </template>

      <!-- Navbat xulosasi -->
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

      <div class="form-footer">
        <button class="btn-primary wide" @click="submit">
          Navbat olish →
        </button>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useSalonStore } from '@/stores/salonStore'

const store  = useSalonStore()
const router = useRouter()

// ── Forma ──
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

// ── Computed ──
const selectedSvc = computed(() =>
  store.services.find(s => s.name === form.service)
)

const selectedEmp = computed(() =>
  store.getEmployee(form.employeeId)
)

// ── Voqealar ──
function onServiceChange() {
  form.duration    = selectedSvc.value?.duration ?? 0
  form.employeeId  = 0
  form.time        = ''
}

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
  // Telefon raqamni localStorage ga saqlash (MyBookings da qidirish uchun)
  localStorage.setItem('lastPhone', form.phone.trim())
  router.push('/client/my')
}
</script>

<style scoped>
.form-wrap { max-width: 680px; }

/* ── Qadam sarlavhasi ── */
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

/* ── Xizmat info ── */
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

/* ── Band ko'rsatgich ── */
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

/* ── Xulosa ── */
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
