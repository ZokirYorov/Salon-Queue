<template>
  <div>
    <div class="page-header">
      <div>
        <h2 class="page-title">Mening navbatlarim</h2>
        <p class="page-sub">Telefon raqamingiz bilan qidiring</p>
      </div>
      <RouterLink to="/client/book" class="btn-primary">+ Yangi navbat</RouterLink>
    </div>

    <!-- Qidiruv -->
    <div class="search-box">
      <span class="search-icon">🔍</span>
      <input
        v-model="phone"
        class="search-input"
        placeholder="Telefon raqamingizni kiriting..."
        @input="onInput"
      />
      <button v-if="phone" class="search-clear" @click="phone = ''">✕</button>
    </div>

    <!-- Natijalar -->
    <template v-if="phone.length >= 5">
      <div v-if="myBookings.length === 0" class="empty-state">
        <span>📭</span>
        <p>Bu raqam bilan navbat topilmadi</p>
        <RouterLink to="/client/book" class="btn-primary">Navbat olish</RouterLink>
      </div>

      <div v-else class="bookings-list">
        <div v-for="b in myBookings" :key="b.id" class="booking-card">
          <div class="bc-left">
            <div class="bc-icon">{{ store.serviceIcon(b.service) }}</div>
            <div class="bc-info">
              <h4 class="bc-service">{{ b.service }}</h4>
              <p class="bc-meta">
                {{ store.formatDate(b.date) }} ·
                {{ b.time }} — {{ store.addMinutes(b.time, b.duration) }}
              </p>
              <p class="bc-emp">
                <span class="emp-mini" :style="{ background: emp(b.employeeId)?.color || '#94a3b8' }">
                  {{ emp(b.employeeId)?.name.charAt(0) || '?' }}
                </span>
                {{ emp(b.employeeId)?.name || '—' }}
              </p>
            </div>
          </div>
          <div class="bc-right">
            <span class="src-badge" :class="b.source === 'online' ? 'src--online' : 'src--manual'">
              {{ b.source === 'online' ? '🌐 Online' : "👔 Qo'lda" }}
            </span>
            <span class="status-badge" :class="store.statusClass(b.status)">
              {{ b.status }}
            </span>
          </div>
        </div>
      </div>
    </template>

    <!-- Qidiruvsiz ko'rsatma -->
    <div v-else class="search-hint">
      <p>Navbatlaringizni ko'rish uchun telefon raqamingizni kiriting</p>
    </div>

    <!-- Bugungi umumiy jadval -->
    <div class="today-schedule">
      <h3 class="section-title">Bugungi jadval — barcha ustalar</h3>
      <p class="section-sub">Band vaqtlarni ko'rib, navbat olishni rejalashtirishingiz mumkin</p>

      <div class="schedule-scroll">
        <!-- Sarlavha -->
        <div class="sch-head">
          <div class="sch-time-hd">Vaqt</div>
          <div v-for="e in store.employees" :key="e.id" class="sch-emp-hd">
            <span class="emp-mini" :style="{ background: e.color }">{{ e.name.charAt(0) }}</span>
            {{ e.name }}
          </div>
        </div>

        <!-- Vaqt satrlari -->
        <div v-for="slot in store.timeSlots" :key="slot" class="sch-row">
          <div class="sch-time">{{ slot }}</div>
          <div v-for="e in store.employees" :key="e.id" class="sch-cell">
            <template v-if="store.getCellBookings(slot, store.today, e.id).length">
              <span
                v-for="b in store.getCellBookings(slot, store.today, e.id)"
                :key="b.id"
                class="sch-chip"
                :class="b.source === 'online' ? 'chip-online' : 'chip-manual'"
              >{{ b.service }}</span>
            </template>
            <span v-else class="sch-free">Bo'sh</span>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useSalonStore } from '@/stores/salonStore'

const store = useSalonStore()

const phone = ref('')

// Oxirgi navbat telefoni avtomatik to'ldiriladi
onMounted(() => {
  const saved = localStorage.getItem('lastPhone')
  if (saved) phone.value = saved
})

function onInput() {
  localStorage.setItem('lastPhone', phone.value)
}

// Telefon bo'yicha navbatlar
const myBookings = computed(() =>
  store.bookings.filter(b =>
    b.phone.replace(/\s/g, '').includes(phone.value.replace(/\s/g, ''))
  ).sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time))
)

function emp(id: number) {
  return store.getEmployee(id)
}
</script>

<style scoped>
/* ── Qidiruv ── */
.search-box {
  position: relative;
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}
.search-icon {
  position: absolute;
  left: 14px;
  font-size: 16px;
  pointer-events: none;
}
.search-input {
  width: 100%;
  max-width: 480px;
  padding: 12px 40px;
  border: 1px solid #d1d5db;
  border-radius: 10px;
  font-size: 15px;
  background: #fff;
  color: #1e293b;
  outline: none;
  font-family: inherit;
}
.search-input:focus { border-color: #0284c7; box-shadow: 0 0 0 3px rgba(2,132,199,0.1); }
.search-clear {
  position: absolute;
  left: calc(480px - 36px);
  background: none;
  border: none;
  color: #94a3b8;
  font-size: 16px;
  cursor: pointer;
}

/* ── Navbat ro'yxati ── */
.bookings-list { display: flex; flex-direction: column; gap: 10px; margin-bottom: 28px; }
.booking-card {
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 14px 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}
.bc-left  { display: flex; align-items: center; gap: 12px; }
.bc-icon  { font-size: 28px; flex-shrink: 0; }
.bc-service { font-size: 15px; font-weight: 700; color: #1e293b; margin: 0 0 3px; }
.bc-meta    { font-size: 12px; color: #64748b; margin: 0 0 4px; }
.bc-emp     { font-size: 12px; color: #475569; margin: 0; display: flex; align-items: center; gap: 5px; }
.bc-right   { display: flex; flex-direction: column; gap: 6px; align-items: flex-end; flex-shrink: 0; }

.status-badge {
  font-size: 11px;
  font-weight: 600;
  padding: 3px 10px;
  border-radius: 20px;
}

/* ── Ko'rsatma ── */
.search-hint {
  padding: 32px;
  text-align: center;
  color: #94a3b8;
  font-size: 15px;
}

/* ── Bugungi jadval ── */
.today-schedule { margin-top: 32px; }
.section-title { font-size: 16px; font-weight: 700; color: #1e293b; margin: 0 0 4px; }
.section-sub   { font-size: 13px; color: #64748b; margin: 0 0 14px; }

.schedule-scroll {
  overflow-x: auto;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  background: #fff;
}

.sch-head {
  display: flex;
  background: #f8fafc;
  border-bottom: 2px solid #e2e8f0;
  position: sticky;
  top: 0;
}
.sch-time-hd {
  width: 60px;
  flex-shrink: 0;
  padding: 10px 12px;
  font-size: 11px;
  font-weight: 700;
  color: #94a3b8;
  border-right: 1px solid #e2e8f0;
}
.sch-emp-hd {
  flex: 1;
  padding: 8px 12px;
  font-size: 12px;
  font-weight: 700;
  color: #1e293b;
  border-right: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  gap: 6px;
  min-width: 120px;
}

.sch-row {
  display: flex;
  border-bottom: 1px solid #f1f5f9;
  min-height: 40px;
}
.sch-time {
  width: 60px;
  flex-shrink: 0;
  padding: 8px 12px;
  font-size: 12px;
  font-weight: 600;
  color: #94a3b8;
  border-right: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
}
.sch-cell {
  flex: 1;
  padding: 4px 8px;
  border-right: 1px solid #f1f5f9;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 3px;
  min-width: 120px;
}
.sch-chip {
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 20px;
  font-weight: 500;
}
.chip-online { background: #e0f2fe; color: #0369a1; }
.chip-manual { background: #ede9fe; color: #4c1d95; }
.sch-free    { font-size: 11px; color: #d1d5db; }

/* ── Bo'sh holat ── */
.empty-state {
  text-align: center;
  padding: 40px 20px;
  color: #94a3b8;
}
.empty-state span { font-size: 40px; display: block; margin-bottom: 12px; }
.empty-state p    { font-size: 15px; margin: 0 0 16px; }
</style>
