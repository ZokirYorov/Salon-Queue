<template>
  <div>
    <div class="page-header">
      <div>
        <h2 class="page-title">Xodimlar</h2>
        <p class="page-sub">Xodimlar ro'yxati, ixtisoslik va ish statistikasi</p>
      </div>
      <button class="btn-primary" @click="showForm = !showForm">
        {{ showForm ? 'Yopish' : '+ Yangi xodim' }}
      </button>
    </div>

    <div v-if="showForm" class="form-card add-form">
      <h3 class="form-title">Yangi xodim qo'shish</h3>

      <div class="form-row">
        <div class="form-group">
          <label>Ism Familiya *</label>
          <input v-model="form.name" placeholder="Jasur Karimov" :class="{ error: errors.name }" />
          <span class="error-msg" v-if="errors.name">{{ errors.name }}</span>
        </div>
        <div class="form-group">
          <label>Lavozim *</label>
          <input v-model="form.role" placeholder="Sartarosh, Manikyurchi..." :class="{ error: errors.role }" />
          <span class="error-msg" v-if="errors.role">{{ errors.role }}</span>
        </div>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label>Telefon raqami</label>
          <input v-model="form.phone" placeholder="+998 90 000 00 00" />
        </div>
        <div class="form-group">
          <label>Rang (jadvalda ko'rinadi)</label>
          <div class="color-picker">
            <button
              v-for="c in empColors"
              :key="c"
              class="color-btn"
              :class="{ 'color-btn--active': form.color === c }"
              :style="{ background: c }"
              @click="form.color = c"
              type="button"
            ></button>
          </div>
        </div>
      </div>

      <div class="form-group">
        <label>Ixtisoslik (qaysi xizmatlarni bajaradi)</label>
        <p class="hint">Bo'sh qoldirsangiz — barcha xizmatlar uchun tayinlanadi</p>
        <div class="svc-checkboxes">
          <label
            v-for="svc in store.services"
            :key="svc.name"
            class="svc-checkbox"
          >
            <input type="checkbox" :value="svc.name" v-model="form.services" />
            <span>{{ svc.name }}</span>
          </label>
        </div>
      </div>

      <div class="form-footer">
        <button class="btn-secondary" @click="resetForm">Bekor qilish</button>
        <button class="btn-primary" @click="save">Saqlash</button>
      </div>
    </div>
    <div class="emp-grid">
      <div v-for="emp in store.employees" :key="emp.id" class="emp-card">

        <div class="emp-top">
          <div class="emp-avatar" :style="{ background: emp.color }">
            {{ emp.name.charAt(0) }}
          </div>
          <div class="emp-info">
            <h3 class="emp-name">{{ emp.name }}</h3>
            <p class="emp-role">{{ emp.role }}</p>
            <p class="emp-phone">{{ emp.phone || "Telefon ko'rsatilmagan" }}</p>
          </div>
          <button
            v-if="store.employees.length > 1"
            class="btn-icon"
            @click="remove(emp.id)"
            title="Xodimni o'chirish"
          >✕</button>
        </div>

        <div class="emp-services">
          <template v-if="emp.services.length">
            <span v-for="svc in emp.services" :key="svc" class="svc-tag">{{ svc }}</span>
          </template>
          <span v-else class="svc-tag svc-tag--all">Barcha xizmatlar</span>
        </div>

        <div class="emp-stats">
          <div class="stat-item">
            <span class="stat-val">{{ store.busyCount(emp.id, store.today) }}</span>
            <span class="stat-lbl">Bugun</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <span class="stat-val">{{ totalCount(emp.id) }}</span>
            <span class="stat-lbl">Jami navbat</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <span class="stat-val">{{ doneCount(emp.id) }}</span>
            <span class="stat-lbl">Bajarilgan</span>
          </div>
        </div>

      </div>
    </div>

    <p v-if="store.employees.length === 0" class="empty-state">
      Hali xodim yo'q. Birinchi xodimni qo'shing.
    </p>

  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useSalonStore } from '@/stores/salonStore'

const store = useSalonStore()

const showForm = ref(false)

const empColors = ['#6366f1', '#0ea5e9', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#ef4444', '#14b8a6']

const form = reactive({
  name: '',
  role: '',
  phone: '',
  color: '#6366f1',
  services: [] as string[],
})

const errors = reactive({ name: '', role: '' })

function validate(): boolean {
  errors.name = form.name.trim() ? '' : 'Ism kiritilishi shart'
  errors.role = form.role.trim() ? '' : 'Lavozim kiritilishi shart'
  return !errors.name && !errors.role
}

function save() {
  if (!validate()) return
  store.addEmployee({
    name:     form.name.trim(),
    role:     form.role.trim(),
    phone:    form.phone.trim(),
    color:    form.color,
    services: [...form.services],
  })
  resetForm()
}

function resetForm() {
  form.name     = ''
  form.role     = ''
  form.phone    = ''
  form.color    = '#6366f1'
  form.services = []
  errors.name   = ''
  errors.role   = ''
  showForm.value = false
}

function remove(id: number) {
  if (confirm("Xodimni o'chirishni tasdiqlaysizmi?")) {
    store.deleteEmployee(id)
  }
}

// Statistika yordamchilari
function totalCount(empId: number): number {
  return store.bookings.filter(b => b.employeeId === empId).length
}

function doneCount(empId: number): number {
  return store.bookings.filter(b => b.employeeId === empId && b.status === 'Bajarildi').length
}
</script>

<style scoped>
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 26px;
}
.page-title {
  font-size: 26px;
  font-weight: 800;
  color: #0f172a;
}
.page-sub {
  font-size: 14px;
  color: #64748b;
  margin-top: 4px;
}
.form-card {
  background: linear-gradient(180deg, #ffffff, #f8fafc);
  border-radius: 18px;
  padding: 22px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 10px 25px rgba(0,0,0,0.05);
  transition: 0.25s;
}
.form-card:hover {
  box-shadow: 0 14px 35px rgba(0,0,0,0.07);
}
.form-title {
  font-size: 17px;
  font-weight: 700;
  margin-bottom: 18px;
}
.form-group label {
  font-size: 13px;
  font-weight: 600;
  color: #334155;
}
input, select {
  width: 100%;
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
  background: white;
  font-size: 14px;
  transition: 0.2s;
}
input:focus, select:focus {
  border-color: #6366f1;
  box-shadow: 0 0 0 3px rgba(99,102,241,0.15);
  outline: none;
}
.error {
  border-color: #ef4444 !important;
}
.error-msg {
  font-size: 12px;
  color: #ef4444;
}
.color-picker {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}
.color-btn {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: 3px solid transparent;
  cursor: pointer;
  transition: 0.2s;
}
.color-btn:hover {
  transform: scale(1.15);
}
.color-btn--active {
  border-color: #0f172a;
  transform: scale(1.2);
}
.svc-checkboxes {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.svc-checkbox {
  background: #f1f5f9;
  padding: 6px 10px;
  border-radius: 8px;
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: 0.2s;
}
.svc-checkbox:hover {
  background: #e2e8f0;
}
.emp-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 18px;
}
.emp-card {
  background: linear-gradient(180deg, #ffffff, #f8fafc);
  border-radius: 18px;
  padding: 18px;
  border: 1px solid #e2e8f0;
  transition: 0.25s;
  position: relative;
}
.emp-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 14px 30px rgba(0,0,0,0.08);
}
.emp-top {
  display: flex;
  align-items: center;
  gap: 12px;
}
.emp-avatar {
  width: 50px;
  height: 50px;
  border-radius: 14px;
  font-size: 20px;
  font-weight: 800;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
}
.emp-name {
  font-size: 16px;
  font-weight: 700;
  color: #0f172a;
}
.emp-role {
  font-size: 13px;
  color: #64748b;
}
.emp-phone {
  font-size: 12px;
  color: #94a3b8;
}
.btn-icon {
  position: absolute;
  top: 10px;
  right: 10px;
  background: #fef2f2;
  color: #ef4444;
  border-radius: 8px;
  width: 30px;
  height: 30px;
  font-size: 14px;
  transition: 0.2s;
}
.btn-icon:hover {
  background: #fee2e2;
  transform: scale(1.1);
}
.emp-services {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin: 14px 0;
}
.svc-tag {
  font-size: 11px;
  padding: 4px 10px;
  border-radius: 20px;
  background: #eef2ff;
  color: #4f46e5;
  border: 1px solid #e0e7ff;
}
.svc-tag--all {
  background: #dcfce7;
  color: #166534;
  border-color: #bbf7d0;
}
.emp-stats {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
  padding-top: 12px;
  border-top: 1px solid #f1f5f9;
}
.stat-item {
  text-align: center;
  flex: 1;
}
.stat-val {
  font-size: 22px;
  font-weight: 800;
  color: #6366f1;
}
.stat-lbl {
  font-size: 11px;
  color: #94a3b8;
}
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
  transition: 0.2s;
}
.btn-secondary:hover {
  background: #e2e8f0;
}
.empty-state {
  text-align: center;
  margin-top: 40px;
  color: #94a3b8;
  font-size: 14px;
}
</style>
