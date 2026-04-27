<template>
  <div>
    <!-- Sarlavha + filterlar -->
    <div class="page-header">
      <div>
        <h2 class="page-title">Barcha navbatlar</h2>
        <p class="page-sub">Jami: {{ filtered.length }} ta navbat</p>
      </div>
      <div class="header-actions">
        <!-- Xodim filtri -->
        <select v-model="filterEmpId" class="filter-select">
          <option value="">Barcha xodim</option>
          <option v-for="e in store.employees" :key="e.id" :value="e.id">
            {{ e.name }}
          </option>
        </select>
        <!-- Tur filtri -->
        <select v-model="filterSource" class="filter-select">
          <option value="">Barcha tur</option>
          <option value="online">🌐 Online</option>
          <option value="staff">👔 Qo'lda</option>
        </select>
        <!-- Holat filtri -->
        <select v-model="filterStatus" class="filter-select">
          <option value="">Barcha holat</option>
          <option value="Kutilmoqda">Kutilmoqda</option>
          <option value="Bajarildi">Bajarildi</option>
          <option value="Bekor">Bekor</option>
        </select>
        <!-- Sana filtri -->
        <input type="date" v-model="filterDate" class="date-input" title="Sana bo'yicha filtr" />
        <button v-if="hasFilters" class="btn-clear" @click="clearFilters">
          Tozalash ✕
        </button>
      </div>
    </div>

    <!-- Jadval -->
    <div class="bookings-table">
      <!-- Sarlavha satri -->
      <div class="t-head">
        <span>Mijoz</span>
        <span>Xizmat</span>
        <span>Xodim</span>
        <span>Sana / Vaqt</span>
        <span>Tur</span>
        <span>Holat</span>
        <span>Amal</span>
      </div>

      <!-- Bo'sh holat -->
      <div v-if="filtered.length === 0" class="empty-state">
        Navbat topilmadi. Filtrlarni o'zgartiring.
      </div>

      <!-- Navbat satrlari -->
      <div
        v-for="b in filtered"
        :key="b.id"
        class="t-row"
        :class="b.source === 'online' ? 'row--online' : 'row--manual'"
      >
        <!-- Mijoz -->
        <div class="td td-client">
          <span class="client-name">{{ b.clientName }}</span>
          <span class="client-phone">{{ b.phone }}</span>
        </div>

        <!-- Xizmat -->
        <div class="td">{{ b.service }}</div>

        <!-- Xodim -->
        <div class="td td-emp">
          <span class="emp-mini" :style="{ background: emp(b.employeeId)?.color || '#94a3b8' }">
            {{ emp(b.employeeId)?.name.charAt(0) || '?' }}
          </span>
          <span>{{ emp(b.employeeId)?.name || '—' }}</span>
        </div>

        <!-- Sana va vaqt -->
        <div class="td td-date">
          <span>{{ store.formatDateShort(b.date) }}</span>
          <strong>{{ b.time }} — {{ store.addMinutes(b.time, b.duration) }}</strong>
          <span class="duration">{{ b.duration }} daqiqa</span>
        </div>

        <!-- Tur -->
        <div class="td">
          <span class="src-badge" :class="b.source === 'online' ? 'src--online' : 'src--manual'">
            {{ b.source === 'online' ? '🌐 Online' : "👔 Qo'lda" }}
          </span>
        </div>

        <!-- Holat -->
        <div class="td">
          <select
            :value="b.status"
            @change="changeStatus(b.id, $event)"
            class="status-sel"
            :class="store.statusClass(b.status)"
          >
            <option>Kutilmoqda</option>
            <option>Bajarildi</option>
            <option>Bekor</option>
          </select>
        </div>

        <!-- O'chirish -->
        <div class="td">
          <button class="btn-icon" @click="remove(b.id)" title="O'chirish">🗑</button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useSalonStore, type Booking } from '@/stores/salonStore'

const store = useSalonStore()

// ── Filterlar ──
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

// ── Filtrlangan natijalar ──
const filtered = computed(() =>
  store.bookings
    .filter(b => !filterEmpId.value  || b.employeeId === filterEmpId.value)
    .filter(b => !filterSource.value || b.source     === filterSource.value)
    .filter(b => !filterStatus.value || b.status     === filterStatus.value)
    .filter(b => !filterDate.value   || b.date       === filterDate.value)
    .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time))
)

// ── Yordamchilar ──
function emp(id: number) {
  return store.getEmployee(id)
}

function changeStatus(id: number, e: Event) {
  const status = (e.target as HTMLSelectElement).value as Booking['status']
  store.updateBookingStatus(id, status)
}

function remove(id: number) {
  if (confirm('Bu navbatni o\'chirishni tasdiqlaysizmi?')) {
    store.deleteBooking(id)
  }
}
</script>

<style scoped>
/* ── Jadval konteyner ── */
.bookings-table {
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  overflow: hidden;
  overflow-x: auto;
}

/* ── Sarlavha satri ── */
.t-head {
  display: grid;
  grid-template-columns: 1.6fr 1.3fr 1.2fr 1.5fr 1fr 1.1fr 0.5fr;
  gap: 8px;
  padding: 12px 16px;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
  font-size: 11px;
  font-weight: 700;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  min-width: 800px;
}

/* ── Ma'lumot satri ── */
.t-row {
  display: grid;
  grid-template-columns: 1.6fr 1.3fr 1.2fr 1.5fr 1fr 1.1fr 0.5fr;
  gap: 8px;
  padding: 12px 16px;
  align-items: center;
  border-bottom: 1px solid #f1f5f9;
  font-size: 13px;
  transition: background 0.1s;
  min-width: 800px;
}
.t-row:hover { background: #fafbff; }
.t-row:last-child { border-bottom: none; }

/* Manba bo'yicha chiziq */
.row--online { border-left: 3px solid #0ea5e9; }
.row--manual { border-left: 3px solid #6366f1; }

/* ── Td stillari ── */
.td { color: #475569; }

.td-client {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.client-name  { font-weight: 700; color: #1e293b; }
.client-phone { font-size: 11px; color: #94a3b8; }

.td-emp {
  display: flex;
  align-items: center;
  gap: 6px;
}

.td-date {
  display: flex;
  flex-direction: column;
  gap: 1px;
}
.td-date span   { font-size: 12px; color: #64748b; }
.td-date strong { font-size: 13px; color: #1e293b; }
.duration       { font-size: 11px; color: #94a3b8; }

/* ── Filter tozalash tugmasi ── */
.btn-clear {
  padding: 8px 12px;
  border: 1px solid #fca5a5;
  border-radius: 8px;
  background: #fef2f2;
  color: #dc2626;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  white-space: nowrap;
  font-family: inherit;
}
.btn-clear:hover { background: #fee2e2; }
</style>
