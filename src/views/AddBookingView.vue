<template>
  <div>
    <div class="page-header">
      <div>
        <h2 class="page-title">Navbat qo'shish</h2>
        <p class="page-sub">Mijoz uchun qo'lda navbat yarating</p>
      </div>
      <RouterLink to="/staff/schedule" class="btn-secondary">← Jadvalga qaytish</RouterLink>
    </div>

    <div class="form-card form-wrap">

      <!-- 1-qadam: Mijoz ma'lumotlari -->
      <div class="step-header">
        <span class="step-num">1</span>
        <span class="step-label">Mijoz ma'lumotlari</span>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label>Mijoz ismi *</label>
          <input
              v-model="form.clientName"
              placeholder="Masalan: Aziz Karimov"
              :class="{ error: errors.clientName }"
          />
          <span class="error-msg" v-if="errors.clientName">{{ errors.clientName }}</span>
        </div>
        <div class="form-group">
          <label>Telefon raqam</label>
          <input v-model="form.phone" placeholder="+998 90 000 00 00" />
        </div>
      </div>

      <!-- 2-qadam: Xizmat va sana -->
      <div class="step-header">
        <span class="step-num">2</span>
        <span class="step-label">Xizmat va sana</span>
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
              {{ s.name }} — {{ store.formatPrice(s.price ?? 0) }} ({{ s.duration }} min)
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

      <!-- 3-qadam: Xodim tanlash -->
      <div v-if="form.service && form.date" class="step-header">
        <span class="step-num">3</span>
        <span class="step-label">Xodim tanlang</span>
      </div>

      <div v-if="form.service && form.date" class="form-group">
        <p class="hint">Shu xizmatni bajara oladigan xodimlar ko'rsatilmoqda</p>

        <div v-if="availableEmployees.length === 0" class="no-employees">
          Shu xizmat uchun mos xodim topilmadi
        </div>

        <div v-else class="emp-picker">
          <div
              v-for="emp in availableEmployees"
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
                  :class="{ none: store.freeSlotCount(emp.id, form.date, form.service) === 0 }"
              >
                {{ store.isEmployeeFull(emp.id, form.date, form.service)
                  ? "To'liq band"
                  : store.freeSlotCount(emp.id, form.date, form.service) + ' ta bo\'sh' }}
              </span>
              <span class="ep-busy-count">
                {{ store.busyCount(emp.id, form.date) }} navbat band
              </span>
            </div>
          </div>
        </div>
        <span class="error-msg" v-if="errors.employeeId">{{ errors.employeeId }}</span>
      </div>

      <!-- 4-qadam: Vaqt tanlash -->
      <div v-if="form.employeeId" class="step-header">
        <span class="step-num">4</span>
        <span class="step-label">Vaqt tanlang</span>
      </div>

      <div v-if="form.employeeId" class="form-group">
        <p class="hint">
          <span class="slot-legend free-legend"></span> Bo'sh &nbsp;&nbsp;
          <span class="slot-legend busy-legend"></span> Band
        </p>
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

      <!-- Izoh -->
      <div class="form-group" style="margin-top: 4px;">
        <label>Izoh (ixtiyoriy)</label>
        <textarea v-model="form.note" rows="2" placeholder="Qo'shimcha ma'lumot..."></textarea>
      </div>

      <!-- Tugmalar -->
      <div class="form-footer">
        <RouterLink to="/staff/schedule" class="btn-secondary">Bekor qilish</RouterLink>
        <button class="btn-primary" @click="submit">Navbatni saqlash</button>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useSalonStore } from '@/stores/salonStore'

const store  = useSalonStore()
const router = useRouter()

// ── Forma state ──
const form = reactive({
  clientName: '',
  phone:      '',
  service:    '',
  duration:   0,
  date:       store.today,
  time:       '',
  employeeId: 0,
  note:       '',
})

const errors = reactive({
  clientName:  '',
  service:     '',
  date:        '',
  employeeId:  '',
  time:        '',
})

// ── Faqat mos xodimlar ──
const availableEmployees = computed(() =>
    store.employeesForService(form.service)
)

// ── Voqealar ──
function onServiceChange() {
  const svc = store.services.find(s => s.name === form.service)
  form.duration    = svc?.duration ?? 0
  form.employeeId  = 0
  form.time        = ''
}

function pickEmployee(id: number) {
  if (store.isEmployeeFull(id, form.date, form.service)) return
  form.employeeId = id
  form.time       = ''
}

function validate(): boolean {
  errors.clientName  = form.clientName.trim()  ? '' : 'Mijoz ismi kiritilishi shart'
  errors.service     = form.service            ? '' : 'Xizmat turi tanlanishi shart'
  errors.date        = form.date               ? '' : 'Sana tanlanishi shart'
  errors.employeeId  = form.employeeId         ? '' : 'Xodim tanlanishi shart'
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
    source:     'staff',
    employeeId: form.employeeId,
    note:       form.note.trim() || undefined,
  })

  router.push('/staff/schedule')
}
</script>


<style scoped>
.form-wrap { max-width: 760px; }

.step-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 24px 0 14px;
}
.step-num {
  width: 28px; height: 28px;
  border-radius: 50%;
  background: #4f46e5;
  color: #fff;
  font-size: 13px;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.step-label { font-size: 15px; font-weight: 700; color: #1e293b; }

/* ── Slot legenda ── */
.slot-legend {
  display: inline-block;
  width: 12px; height: 12px;
  border-radius: 3px;
  vertical-align: middle;
}
.free-legend { background: #f8fafc; border: 1px solid #e2e8f0; }
.busy-legend { background: #f1f5f9; border: 1px solid #e2e8f0; }

/* ── Xodim yo'q holat ── */
.no-employees {
  padding: 16px;
  text-align: center;
  color: #94a3b8;
  font-size: 14px;
  background: #f8fafc;
  border-radius: 10px;
  border: 1px dashed #e2e8f0;
}
</style>
