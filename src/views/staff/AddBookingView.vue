<template>
  <div>
    <div class="page-header">
      <div>
        <h2 class="page-title">Navbat qo'shish</h2>
        <p class="page-sub">Mijoz uchun qo'lda navbat yarating</p>
      </div>
      <RouterLink to="/staff/schedule" class="border border-gray-300 btn-primary">← Jadvalga qaytish</RouterLink>
    </div>
    <div class="form-card form-wrap">
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

      <div class="form-group" style="margin-top: 4px;">
        <label>Izoh (ixtiyoriy)</label>
        <textarea v-model="form.note" rows="2" placeholder="Qo'shimcha ma'lumot..."></textarea>
      </div>

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
.form-wrap {
  max-width: 820px;
  margin: 0 auto;
  padding: 28px;
  border-radius: 20px;
  background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
  box-shadow: 0 10px 30px rgba(0,0,0,0.05);
}

/* header */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.page-title {
  font-size: 24px;
  font-weight: 800;
  color: #0f172a;
}

.page-sub {
  font-size: 14px;
  color: #64748b;
}

/* step */
.step-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 32px 0 16px;
}

.step-num {
  width: 32px;
  height: 32px;
  border-radius: 10px;
  background: linear-gradient(135deg, #6366f1, #4f46e5);
  color: white;
  font-size: 14px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
}

.step-label {
  font-size: 16px;
  font-weight: 700;
  color: #1e293b;
}

/* inputs */
.form-group label {
  font-size: 13px;
  font-weight: 600;
  color: #334155;
  margin-bottom: 6px;
}

input, select, textarea {
  width: 100%;
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
  background: #fff;
  transition: all 0.2s ease;
  font-size: 14px;
}

input:focus,
select:focus,
textarea:focus {
  outline: none;
  border-color: #6366f1;
  box-shadow: 0 0 0 3px rgba(99,102,241,0.15);
}

/* error */
.error {
  border-color: #ef4444 !important;
}

.error-msg {
  font-size: 12px;
  color: #ef4444;
  margin-top: 4px;
}

/* employee cards */
.emp-picker {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
  gap: 12px;
}

.emp-pick-card {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px;
  border-radius: 14px;
  border: 1px solid #e2e8f0;
  background: #fff;
  cursor: pointer;
  transition: all 0.2s ease;
}

.emp-pick-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0,0,0,0.06);
}

.emp-pick-card.selected {
  border-color: #6366f1;
  background: #eef2ff;
}

.emp-pick-card.full {
  opacity: 0.5;
  cursor: not-allowed;
}

.ep-avatar {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  color: #fff;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
}

.ep-info {
  display: flex;
  flex-direction: column;
}

.ep-name {
  font-weight: 600;
  font-size: 14px;
}

.ep-role {
  font-size: 12px;
  color: #64748b;
}

.ep-right {
  margin-left: auto;
  text-align: right;
}

.ep-free {
  font-size: 12px;
  font-weight: 600;
  color: #16a34a;
}

.ep-free.none {
  color: #ef4444;
}

.ep-busy-count {
  font-size: 11px;
  color: #94a3b8;
}

/* time slots */
.slots-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(70px, 1fr));
  gap: 8px;
}

.slot-btn {
  padding: 8px;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
  background: #fff;
  cursor: pointer;
  font-size: 13px;
  transition: all 0.2s ease;
}

.slot-btn:hover {
  background: #f1f5f9;
}

.slot-btn.selected {
  background: #6366f1;
  color: white;
  border-color: #6366f1;
}

.slot-btn.busy {
  background: #f1f5f9;
  color: #94a3b8;
  cursor: not-allowed;
}

/* footer */
.form-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 30px;
}

/* buttons */
.btn-primary {
  background: linear-gradient(135deg, #6366f1, #4f46e5);
  color: white;
  padding: 10px 18px;
  border-radius: 10px;
  font-weight: 600;
  transition: 0.2s;
}

.btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 14px rgba(79,70,229,0.3);
}

.btn-secondary {
  background: #f1f5f9;
  padding: 10px 16px;
  border-radius: 10px;
  color: #334155;
}
</style>
