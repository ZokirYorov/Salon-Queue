<template>
  <div class="app">

    <!-- ── ROLE SELECTOR ── -->
    <div v-if="!role" class="role-screen">
      <div class="role-logo">
        <h1>SalonQueue</h1>
<!--        <p>Kimligingizni tanlang</p>-->
      </div>
      <div class="role-cards">
        <button class="role-card role-card--staff" @click="role = 'staff'">
<!--          <span class="role-icon">👔</span>-->
          <h3>Xodim / Admin</h3>
          <p>Navbatlarni boshqarish, yangi navbat qo'shish, kunlik jadval</p>
        </button>
<!--        <button class="role-card role-card&#45;&#45;client" @click="role = 'client'">-->
<!--          <span class="role-icon">👤</span>-->
<!--          <h3>Mijoz</h3>-->
<!--          <p>Online navbat olish, band vaqtlarni ko'rish</p>-->
<!--        </button>-->
      </div>
    </div>

    <!-- ── MAIN APP ── -->
    <div v-else>

      <!-- NAVBAR -->
      <nav class="navbar">
        <div class="nav-inner">
<!--          <div class="nav-logo" @click="resetView">-->
<!--            <span>✂️</span>-->
<!--            <span class="nav-title">SalonQueue</span>-->
<!--          </div>-->
          <div class="nav-tabs">
            <button
                v-if="role === 'staff'"
                v-for="tab in staffTabs" :key="tab.key"
                class="nav-tab" :class="{ 'nav-tab--active': activeTab === tab.key }"
                @click="activeTab = tab.key"
            >{{ tab.label }}</button>
            <button
                v-if="role === 'client'"
                v-for="tab in clientTabs" :key="tab.key"
                class="nav-tab" :class="{ 'nav-tab--active': activeTab === tab.key }"
                @click="activeTab = tab.key"
            >{{ tab.label }}</button>
          </div>
          <div class="nav-right">
            <span class="role-pill" :class="role === 'staff' ? 'role-pill--staff' : 'role-pill--client'">
              {{ role === 'staff' ? '👔 Xodim' : '👤 Mijoz' }}
            </span>
            <button class="btn-switch" @click="role = null">Chiqish</button>
          </div>
        </div>
      </nav>

      <!-- ════════════════════ STAFF VIEWS ════════════════════ -->
      <div v-if="role === 'staff'" class="page">

        <!-- ── STAFF: SCHEDULE (jadval) ── -->
        <div v-if="activeTab === 'schedule'">
          <div class="page-header">
            <div>
              <h2 class="page-title">Kunlik jadval</h2>
              <p class="page-sub">Barcha navbatlar — online va qo'lda qo'shilgan</p>
            </div>
            <div class="header-actions">
              <input type="date" v-model="scheduleDate" class="date-input" />
              <button class="btn-primary" @click="activeTab = 'add'">+ Navbat qo'shish</button>
            </div>
          </div>

          <!-- Legend -->
          <div class="legend">
            <span class="legend-item">
              <span class="dot dot--online"></span> Online navbat
            </span>
            <span class="legend-item">
              <span class="dot dot--staff"></span> Xodim qo'shgan
            </span>
          </div>

          <!-- Schedule grid -->
          <div class="schedule-grid">
            <div class="time-col">
              <div class="time-header">Vaqt</div>
              <div v-for="slot in timeSlots" :key="slot" class="time-cell">{{ slot }}</div>
            </div>
            <div class="bookings-col">
              <div class="time-header">Navbatlar — {{ formatDateLabel(scheduleDate) }}</div>
              <div v-for="slot in timeSlots" :key="slot" class="booking-cell">
                <div
                    v-for="b in getBookingsForSlot(slot, scheduleDate)"
                    :key="b.id"
                    class="booking-chip"
                    :class="b.source === 'online' ? 'chip--online' : 'chip--staff'"
                >
                  <span class="chip-source">{{ b.source === 'online' ? '🌐' : '👔' }}</span>
                  <div class="chip-info">
                    <span class="chip-name">{{ b.clientName }}</span>
                    <span class="chip-service">{{ b.service }}</span>
                  </div>
                  <span class="chip-time">{{ b.time }} — {{ addMinutes(b.time, b.duration) }}</span>
                  <button class="chip-delete" @click="deleteBooking(b.id)" title="O'chirish">✕</button>
                </div>
              </div>
            </div>
          </div>
          <p v-if="bookingsForDate(scheduleDate).length === 0" class="empty-msg">
            Bu kunda navbat yo'q
          </p>
        </div>

        <!-- ── STAFF: ALL BOOKINGS ── -->
        <div v-if="activeTab === 'bookings'">
          <div class="page-header">
            <div>
              <h2 class="page-title">Barcha navbatlar</h2>
              <p class="page-sub">Online va xodim qo'shgan navbatlar</p>
            </div>
            <div class="header-actions">
              <select v-model="filterSource" class="filter-select">
                <option value="">Hammasi</option>
                <option value="online">Online</option>
                <option value="staff">Xodim qo'shgan</option>
              </select>
              <select v-model="filterStatus" class="filter-select">
                <option value="">Barcha holat</option>
                <option value="Kutilmoqda">Kutilmoqda</option>
                <option value="Bajarildi">Bajarildi</option>
                <option value="Bekor">Bekor</option>
              </select>
            </div>
          </div>

          <div class="bookings-table">
            <div class="table-head">
              <span>Mijoz</span>
              <span>Xizmat</span>
              <span>Sana & Vaqt</span>
              <span>Davomiylik</span>
              <span>Tur</span>
              <span>Holat</span>
              <span>Amal</span>
            </div>
            <div v-if="filteredAllBookings.length === 0" class="table-empty">Navbat topilmadi</div>
            <div
                v-for="b in filteredAllBookings" :key="b.id"
                class="table-row"
                :class="b.source === 'online' ? 'row--online' : 'row--staff'"
            >
              <span class="td-name">{{ b.clientName }}</span>
              <span class="td-service">{{ b.service }}</span>
              <span class="td-date">{{ formatDateLabel(b.date) }}<br/><strong>{{ b.time }}</strong></span>
              <span class="td-dur">{{ b.duration }} min</span>
              <span class="td-source">
                <span class="source-badge" :class="b.source === 'online' ? 'badge--online' : 'badge--staff'">
                  {{ b.source === 'online' ? '🌐 Online' : '👔 Xodim' }}
                </span>
              </span>
              <span class="td-status">
                <select
                    :value="b.status"
                    @change="updateStatus(b.id, ($event.target as HTMLSelectElement).value as Booking['status'])"
                    class="status-select"
                    :class="statusClass(b.status)"
                >
                  <option>Kutilmoqda</option>
                  <option>Bajarildi</option>
                  <option>Bekor</option>
                </select>
              </span>
              <span class="td-action">
                <button class="btn-del" @click="deleteBooking(b.id)">🗑</button>
              </span>
            </div>
          </div>
        </div>

        <!-- ── STAFF: ADD BOOKING ── -->
        <div v-if="activeTab === 'add'">
          <div class="page-header">
            <div>
              <h2 class="page-title">Navbat qo'shish</h2>
              <p class="page-sub">Mijoz uchun qo'lda navbat yozing</p>
            </div>
          </div>
          <div class="form-card">
            <div class="form-row">
              <div class="form-group">
                <label>Mijoz ismi *</label>
                <input v-model="staffForm.clientName" placeholder="Masalan: Aziz Karimov" :class="{ err: staffErrors.clientName }" />
                <span v-if="staffErrors.clientName" class="err-msg">{{ staffErrors.clientName }}</span>
              </div>
              <div class="form-group">
                <label>Telefon</label>
                <input v-model="staffForm.phone" placeholder="+998 90 000 00 00" />
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Xizmat turi *</label>
                <select v-model="staffForm.service" @change="onStaffServiceChange" :class="{ err: staffErrors.service }">
                  <option value="">Tanlang...</option>
                  <option v-for="s in services" :key="s.name" :value="s.name">
                    {{ s.name }} ({{ s.duration }} min)
                  </option>
                </select>
                <span v-if="staffErrors.service" class="err-msg">{{ staffErrors.service }}</span>
              </div>
              <div class="form-group">
                <label>Sana *</label>
                <input type="date" v-model="staffForm.date" :min="today" :class="{ err: staffErrors.date }" />
                <span v-if="staffErrors.date" class="err-msg">{{ staffErrors.date }}</span>
              </div>
            </div>
            <div class="form-group">
              <label>Vaqt tanlang *</label>
              <div class="slots-grid">
                <button
                    v-for="t in timeSlots" :key="t"
                    class="slot-btn"
                    :class="{
                    'slot--selected': staffForm.time === t,
                    'slot--booked': isSlotBooked(t, staffForm.date, staffForm.service, null),
                    'slot--available': !isSlotBooked(t, staffForm.date, staffForm.service, null)
                  }"
                    :disabled="isSlotBooked(t, staffForm.date, staffForm.service, null)"
                    @click="staffForm.time = t"
                >{{ t }}</button>
              </div>
              <span v-if="staffErrors.time" class="err-msg">{{ staffErrors.time }}</span>
            </div>
            <div class="form-group">
              <label>Izoh</label>
              <textarea v-model="staffForm.note" rows="2" placeholder="Qo'shimcha izoh..."></textarea>
            </div>
            <div class="form-footer">
              <button class="btn-secondary" @click="activeTab = 'schedule'">Bekor qilish</button>
              <button class="btn-primary" @click="addStaffBooking">Navbat saqlash</button>
            </div>
          </div>
        </div>

      </div><!-- /staff -->

      <!-- ════════════════════ CLIENT VIEWS ════════════════════ -->
      <div v-if="role === 'client'" class="page">

        <!-- ── CLIENT: BOOK ── -->
        <div v-if="activeTab === 'book'">
          <div class="page-header">
            <div>
              <h2 class="page-title">Navbat olish</h2>
              <p class="page-sub">Xizmat va qulay vaqtni tanlang</p>
            </div>
          </div>

          <div class="form-card">
            <div class="form-row">
              <div class="form-group">
                <label>Ismingiz *</label>
                <input v-model="clientForm.clientName" placeholder="Ism Familiya" :class="{ err: clientErrors.clientName }" />
                <span v-if="clientErrors.clientName" class="err-msg">{{ clientErrors.clientName }}</span>
              </div>
              <div class="form-group">
                <label>Telefon *</label>
                <input v-model="clientForm.phone" placeholder="+998 90 000 00 00" :class="{ err: clientErrors.phone }" />
                <span v-if="clientErrors.phone" class="err-msg">{{ clientErrors.phone }}</span>
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Xizmat turi *</label>
                <select v-model="clientForm.service" @change="onClientServiceChange" :class="{ err: clientErrors.service }">
                  <option value="">Tanlang...</option>
                  <option v-for="s in services" :key="s.name" :value="s.name">
                    {{ s.name }} — {{ s.price?.toLocaleString() }} so'm ({{ s.duration }} min)
                  </option>
                </select>
                <span v-if="clientErrors.service" class="err-msg">{{ clientErrors.service }}</span>
              </div>
              <div class="form-group">
                <label>Sana *</label>
                <input type="date" v-model="clientForm.date" :min="today" :class="{ err: clientErrors.date }" />
                <span v-if="clientErrors.date" class="err-msg">{{ clientErrors.date }}</span>
              </div>
            </div>

            <!-- Busy indicator -->
            <div v-if="clientForm.date && clientForm.service" class="busy-bar">
              <span class="busy-label">{{ formatDateLabel(clientForm.date) }} — band vaqtlar:</span>
              <div class="busy-slots">
                <span
                    v-for="t in timeSlots" :key="t"
                    class="busy-dot"
                    :class="isSlotBooked(t, clientForm.date, clientForm.service, null) ? 'busy-dot--red' : 'busy-dot--green'"
                    :title="t"
                ></span>
              </div>
              <span class="busy-hint">
                <span class="busy-dot busy-dot--green"></span> Bo'sh &nbsp;
                <span class="busy-dot busy-dot--red"></span> Band
              </span>
            </div>

            <div class="form-group">
              <label>Vaqt tanlang *</label>
              <div class="slots-grid">
                <button
                    v-for="t in timeSlots" :key="t"
                    class="slot-btn"
                    :class="{
                    'slot--selected': clientForm.time === t,
                    'slot--booked': isSlotBooked(t, clientForm.date, clientForm.service, null),
                    'slot--available': !isSlotBooked(t, clientForm.date, clientForm.service, null)
                  }"
                    :disabled="isSlotBooked(t, clientForm.date, clientForm.service, null)"
                    @click="clientForm.time = t"
                >{{ t }}</button>
              </div>
              <span v-if="clientErrors.time" class="err-msg">{{ clientErrors.time }}</span>
            </div>

            <!-- Service info -->
            <div v-if="selectedClientService" class="service-info-box">
              <span>💈 {{ selectedClientService.name }}</span>
              <span>⏱ {{ selectedClientService.duration }} daqiqa</span>
              <span>💰 {{ selectedClientService.price?.toLocaleString() }} so'm</span>
            </div>

            <div class="form-footer">
              <button class="btn-primary btn-wide" @click="addClientBooking">
                Navbat olish →
              </button>
            </div>
          </div>

          <!-- Success toast -->
          <div v-if="bookingSuccess" class="success-toast">
            ✅ Navbatiz qabul qilindi! {{ bookingSuccess }}
          </div>
        </div>

        <!-- ── CLIENT: MY BOOKINGS ── -->
        <div v-if="activeTab === 'mybookings'">
          <div class="page-header">
            <div>
              <h2 class="page-title">Mening navbatlarim</h2>
              <p class="page-sub">Telefon raqam bo'yicha qidiring</p>
            </div>
          </div>
          <div class="search-box">
            <input v-model="myPhone" placeholder="Telefon raqamingizni kiriting..." class="search-input" />
          </div>
          <div v-if="myPhone.length >= 5" class="my-bookings-list">
            <div v-if="myBookings.length === 0" class="empty-msg">
              Bu raqam bilan navbat topilmadi
            </div>
            <div v-for="b in myBookings" :key="b.id" class="my-booking-card">
              <div class="mb-left">
                <div class="mb-icon">{{ serviceIcon(b.service) }}</div>
                <div>
                  <h4 class="mb-service">{{ b.service }}</h4>
                  <p class="mb-meta">{{ formatDateLabel(b.date) }} · {{ b.time }} — {{ addMinutes(b.time, b.duration) }}</p>
                  <p class="mb-dur">⏱ {{ b.duration }} daqiqa</p>
                </div>
              </div>
              <div class="mb-right">
                <span class="source-badge" :class="b.source === 'online' ? 'badge--online' : 'badge--staff'">
                  {{ b.source === 'online' ? '🌐 Online' : '👔 Qo\'lda' }}
                </span>
                <span class="status-badge" :class="statusClass(b.status)">{{ b.status }}</span>
              </div>
            </div>
          </div>

          <!-- Schedule view for client -->
          <div class="client-schedule">
            <h3 class="section-title">Bugungi band vaqtlar</h3>
            <div class="client-slots">
              <div v-for="slot in timeSlots" :key="slot" class="cs-row">
                <span class="cs-time">{{ slot }}</span>
                <div class="cs-bookings">
                  <span
                      v-for="b in getBookingsForSlot(slot, today)"
                      :key="b.id"
                      class="cs-chip"
                      :class="b.source === 'online' ? 'cs-chip--online' : 'cs-chip--staff'"
                  >{{ b.service }} · {{ b.clientName }}</span>
                  <span v-if="getBookingsForSlot(slot, today).length === 0" class="cs-free">Bo'sh</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div><!-- /client -->
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface Service {
  name: string
  duration: number
  price?: number
}

interface Booking {
  id: number
  clientName: string
  phone: string
  service: string
  duration: number
  date: string
  time: string
  status: 'Kutilmoqda' | 'Bajarildi' | 'Bekor'
  source: 'online' | 'staff'
  note?: string
}

// ─── State ────────────────────────────────────────────────────────────────────
const role      = ref<'staff' | 'client' | null>(null)
const activeTab = ref('schedule')

const staffTabs  = [
  { key: 'schedule',  label: '📅 Jadval'   },
  { key: 'bookings',  label: '📋 Navbatlar' },
  { key: 'add',       label: '+ Qo\'shish'  },
]
const clientTabs = [
  { key: 'book',        label: '📅 Navbat olish' },
  { key: 'mybookings',  label: '🕐 Mening navbatlarim' },
]

const today = new Date().toISOString().split('T')[0]
const scheduleDate = ref(today)
const filterSource = ref('')
const filterStatus = ref('')
const myPhone      = ref('')
const bookingSuccess = ref('')

// ─── Services ─────────────────────────────────────────────────────────────────
const services = ref<Service[]>([
  { name: 'Soch olish',      duration: 30,  price: 50000  },
  { name: 'Manikyur',        duration: 60,  price: 80000  },
  { name: 'Qosh olish',      duration: 20,  price: 30000  },
  { name: 'Soch bo\'yash',   duration: 90,  price: 150000 },
  { name: 'Yuz parvarishi',  duration: 60,  price: 100000 },
  { name: 'Soqol olish',     duration: 20,  price: 25000  },
])

// ─── Bookings ─────────────────────────────────────────────────────────────────
const bookings = ref<Booking[]>([
  {
    id: 1, clientName: 'Aziz Karimov', phone: '+998901234567',
    service: 'Soch olish', duration: 30,
    date: today, time: '09:00',
    status: 'Kutilmoqda', source: 'online'
  },
  {
    id: 2, clientName: 'Malika Rahimova', phone: '+998932345678',
    service: 'Manikyur', duration: 60,
    date: today, time: '10:00',
    status: 'Kutilmoqda', source: 'staff'
  },
  {
    id: 3, clientName: 'Jamshid Toshev', phone: '+998933456789',
    service: 'Qosh olish', duration: 20,
    date: today, time: '11:00',
    status: 'Bajarildi', source: 'online'
  },
])

// ─── Forms ────────────────────────────────────────────────────────────────────
const emptyStaffForm = () => ({
  clientName: '', phone: '', service: '', date: today, time: '', note: '', duration: 0
})
const emptyClientForm = () => ({
  clientName: '', phone: '', service: '', date: today, time: '', duration: 0
})

const staffForm  = ref(emptyStaffForm())
const clientForm = ref(emptyClientForm())
const staffErrors  = ref<Record<string, string>>({})
const clientErrors = ref<Record<string, string>>({})

// ─── Computed ─────────────────────────────────────────────────────────────────
const filteredAllBookings = computed(() => {
  return bookings.value
      .filter(b => !filterSource.value || b.source === filterSource.value)
      .filter(b => !filterStatus.value || b.status === filterStatus.value)
      .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time))
})

const myBookings = computed(() => {
  return bookings.value.filter(b =>
      b.phone.replace(/\s/g, '').includes(myPhone.value.replace(/\s/g, ''))
  )
})

const selectedClientService = computed(() =>
    services.value.find(s => s.name === clientForm.value.service)
)

// ─── Time helpers ─────────────────────────────────────────────────────────────
const timeSlots: string[] = (() => {
  const s: string[] = []
  for (let h = 9; h < 19; h++) {
    for (const m of [0, 30]) {
      s.push(`${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`)
    }
  }
  return s
})()

function addMinutes(time: string, mins: number): string {
  const [h, m] = time.split(':').map(Number)
  const d = new Date(2000, 0, 1, h, m + mins)
  return `${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`
}

function toMins(time: string): number {
  const [h, m] = time.split(':').map(Number)
  return h * 60 + m
}

function isSlotBooked(time: string, date: string, serviceName: string, excludeId: number | null): boolean {
  if (!date) return false
  const svc     = services.value.find(s => s.name === serviceName)
  const dur     = svc?.duration || 30
  const start   = toMins(time)
  const end     = start + dur

  return bookings.value.some(b => {
    if (b.date !== date) return false
    if (excludeId !== null && b.id === excludeId) return false
    const bStart = toMins(b.time)
    const bEnd   = bStart + b.duration
    return start < bEnd && end > bStart
  })
}

function getBookingsForSlot(slot: string, date: string): Booking[] {
  const slotMins = toMins(slot)
  return bookings.value.filter(b => {
    if (b.date !== date) return false
    const bStart = toMins(b.time)
    const bEnd   = bStart + b.duration
    return slotMins >= bStart && slotMins < bEnd && b.time === slot
  })
}

function bookingsForDate(date: string): Booking[] {
  return bookings.value.filter(b => b.date === date)
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatDateLabel(dateStr: string): string {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleDateString('uz-UZ', { day: '2-digit', month: 'long', year: 'numeric' })
}

function statusClass(status: string): string {
  if (status === 'Bajarildi') return 'status--done'
  if (status === 'Bekor')     return 'status--cancel'
  return 'status--pending'
}

function serviceIcon(name: string): string {
  if (name.includes('Soch')) return '✂️'
  if (name.includes('Manikyur')) return '💅'
  if (name.includes('Qosh')) return '✨'
  if (name.includes('bo\'yash')) return '🎨'
  if (name.includes('Yuz')) return '🌸'
  if (name.includes('Soqol')) return '🪒'
  return '💈'
}

// ─── Actions ──────────────────────────────────────────────────────────────────
function resetView() {
  activeTab.value = role.value === 'staff' ? 'schedule' : 'book'
}

function onStaffServiceChange() {
  const s = services.value.find(x => x.name === staffForm.value.service)
  staffForm.value.duration = s?.duration || 0
  staffForm.value.time = ''
}

function onClientServiceChange() {
  const s = services.value.find(x => x.name === clientForm.value.service)
  clientForm.value.duration = s?.duration || 0
  clientForm.value.time = ''
}

function validateStaff(): boolean {
  staffErrors.value = {}
  if (!staffForm.value.clientName.trim()) staffErrors.value.clientName = 'Ism majburiy'
  if (!staffForm.value.service)           staffErrors.value.service    = 'Xizmat tanlang'
  if (!staffForm.value.date)              staffErrors.value.date       = 'Sana tanlang'
  if (!staffForm.value.time)              staffErrors.value.time       = 'Vaqt tanlang'
  return Object.keys(staffErrors.value).length === 0
}

function validateClient(): boolean {
  clientErrors.value = {}
  if (!clientForm.value.clientName.trim()) clientErrors.value.clientName = 'Ism majburiy'
  if (!clientForm.value.phone.trim())      clientErrors.value.phone      = 'Telefon majburiy'
  if (!clientForm.value.service)           clientErrors.value.service    = 'Xizmat tanlang'
  if (!clientForm.value.date)              clientErrors.value.date       = 'Sana tanlang'
  if (!clientForm.value.time)              clientErrors.value.time       = 'Vaqt tanlang'
  return Object.keys(clientErrors.value).length === 0
}

function addStaffBooking() {
  if (!validateStaff()) return
  bookings.value.push({
    id:          Date.now(),
    clientName:  staffForm.value.clientName,
    phone:       staffForm.value.phone,
    service:     staffForm.value.service,
    duration:    staffForm.value.duration,
    date:        staffForm.value.date,
    time:        staffForm.value.time,
    status:      'Kutilmoqda',
    source:      'staff',
    note:        staffForm.value.note,
  })
  staffForm.value = emptyStaffForm()
  scheduleDate.value = staffForm.value.date || today
  activeTab.value = 'schedule'
}

function addClientBooking() {
  if (!validateClient()) return
  bookings.value.push({
    id:          Date.now(),
    clientName:  clientForm.value.clientName,
    phone:       clientForm.value.phone,
    service:     clientForm.value.service,
    duration:    clientForm.value.duration,
    date:        clientForm.value.date,
    time:        clientForm.value.time,
    status:      'Kutilmoqda',
    source:      'online',
  })
  const t = clientForm.value.time
  const d = formatDateLabel(clientForm.value.date)
  bookingSuccess.value = `${d} soat ${t}`
  myPhone.value = clientForm.value.phone
  clientForm.value = emptyClientForm()
  setTimeout(() => { bookingSuccess.value = '' }, 5000)
  activeTab.value = 'mybookings'
}

function deleteBooking(id: number) {
  bookings.value = bookings.value.filter(b => b.id !== id)
}

function updateStatus(id: number, status: Booking['status']) {
  const b = bookings.value.find(b => b.id === id)
  if (b) b.status = status
}
</script>

<style scoped>
* { box-sizing: border-box; }

.app {
  min-height: 100vh;
  background: #f0f2f5;
  font-family: 'Segoe UI', system-ui, sans-serif;
}

/* ── Role screen ── */
.role-screen {
  min-height: 100vh;
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  padding: 24px; gap: 40px;
}
.role-logo { text-align: center; }
.role-logo-icon { font-size: 48px; display: block; margin-bottom: 8px; }
.role-logo h1 { font-size: 32px; font-weight: 800; color: #1e293b; margin: 0 0 6px; }
.role-logo p  { font-size: 16px; color: #64748b; margin: 0; }

.role-cards { display: flex; gap: 20px; flex-wrap: wrap; justify-content: center; }
.role-card {
  width: 240px; padding: 28px 24px;
  border-radius: 16px; border: 2px solid transparent;
  background: #fff; cursor: pointer; text-align: left;
  transition: all 0.2s;
}
.role-card:hover { transform: translateY(-4px); box-shadow: 0 12px 32px rgba(0,0,0,0.1); }
.role-card--staff:hover { border-color: #6366f1; }
.role-card--client:hover { border-color: #0ea5e9; }
.role-icon { font-size: 36px; display: block; margin-bottom: 12px; }
.role-card h3 { font-size: 17px; font-weight: 700; color: #1e293b; margin: 0 0 8px; }
.role-card p  { font-size: 13px; color: #64748b; margin: 0; line-height: 1.5; }
.role-card--staff  { border-left: 4px solid #6366f1; }
.role-card--client { border-left: 4px solid #0ea5e9; }

/* ── Navbar ── */
.navbar { background: #1e293b; position: sticky; top: 0; z-index: 20; }
.nav-inner {
  max-width: 1200px; margin: 0 auto;
  padding: 0 20px; height: 60px;
  display: flex; align-items: center; gap: 16px;
}
.nav-logo {
  display: flex; align-items: center; gap: 8px;
  font-size: 18px; font-weight: 800; color: #fff; cursor: pointer; flex-shrink: 0;
}
.nav-title { color: #fff; }
.nav-tabs { display: flex; gap: 4px; flex: 1; }
.nav-tab {
  padding: 7px 14px; border-radius: 8px; border: none;
  background: transparent; color: #94a3b8; font-size: 13px;
  font-weight: 500; cursor: pointer; transition: all 0.15s; white-space: nowrap;
}
.nav-tab:hover { background: rgba(255,255,255,0.08); color: #fff; }
.nav-tab--active { background: rgba(255,255,255,0.15); color: #fff; }
.nav-right { display: flex; align-items: center; gap: 10px; flex-shrink: 0; }

.role-pill {
  font-size: 12px; font-weight: 600; padding: 5px 12px;
  border-radius: 20px;
}
.role-pill--staff  { background: #4f46e5; color: #fff; }
.role-pill--client { background: #0284c7; color: #fff; }
.btn-switch {
  font-size: 12px; padding: 6px 12px; border-radius: 8px;
  border: 1px solid rgba(255,255,255,0.2); background: transparent;
  color: #94a3b8; cursor: pointer;
}
.btn-switch:hover { color: #fff; border-color: rgba(255,255,255,0.4); }

/* ── Page ── */
.page { max-width: 1200px; margin: 0 auto; padding: 24px 20px; }

.page-header {
  display: flex; align-items: flex-start;
  justify-content: space-between; margin-bottom: 20px; gap: 16px;
}
.page-title { font-size: 22px; font-weight: 700; color: #1e293b; margin: 0 0 4px; }
.page-sub   { font-size: 13px; color: #64748b; margin: 0; }
.header-actions { display: flex; gap: 10px; align-items: center; flex-shrink: 0; }

/* ── Buttons ── */
.btn-primary {
  padding: 10px 20px; border: none; border-radius: 10px;
  background: #4f46e5; color: #fff; font-size: 14px;
  font-weight: 600; cursor: pointer; white-space: nowrap; transition: background 0.15s;
}
.btn-primary:hover { background: #4338ca; }
.btn-primary.btn-wide { width: 100%; padding: 14px; font-size: 15px; }
.btn-secondary {
  padding: 10px 20px; border: 1px solid #d1d5db; border-radius: 10px;
  background: #fff; color: #374151; font-size: 14px;
  font-weight: 500; cursor: pointer;
}
.btn-secondary:hover { background: #f9fafb; }
.btn-del {
  background: none; border: none; cursor: pointer;
  font-size: 16px; padding: 4px; color: #ef4444; opacity: 0.7;
}
.btn-del:hover { opacity: 1; }

/* ── Legend ── */
.legend { display: flex; gap: 16px; margin-bottom: 16px; }
.legend-item { display: flex; align-items: center; gap: 6px; font-size: 13px; color: #64748b; }
.dot { width: 10px; height: 10px; border-radius: 50%; display: inline-block; }
.dot--online { background: #0ea5e9; }
.dot--staff  { background: #6366f1; }

/* ── Schedule grid ── */
.schedule-grid {
  background: #fff; border: 1px solid #e2e8f0;
  border-radius: 14px; overflow: hidden; display: flex;
}
.time-col { width: 80px; flex-shrink: 0; border-right: 1px solid #e2e8f0; }
.bookings-col { flex: 1; }
.time-header {
  padding: 12px 16px; background: #f8fafc;
  font-size: 12px; font-weight: 700; color: #64748b;
  text-transform: uppercase; letter-spacing: 0.05em;
  border-bottom: 1px solid #e2e8f0;
}
.time-cell {
  padding: 8px 12px; font-size: 12px; font-weight: 600;
  color: #94a3b8; border-bottom: 1px solid #f1f5f9;
  height: 52px; display: flex; align-items: center;
}
.booking-cell {
  height: 52px; border-bottom: 1px solid #f1f5f9;
  padding: 4px 8px; display: flex; align-items: center; gap: 6px; flex-wrap: wrap;
}

.booking-chip {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 4px 10px; border-radius: 8px; font-size: 12px;
  max-width: 100%; overflow: hidden;
}
.chip--online { background: #e0f2fe; border: 1px solid #7dd3fc; color: #0369a1; }
.chip--staff  { background: #ede9fe; border: 1px solid #c4b5fd; color: #4c1d95; }
.chip-source { font-size: 14px; flex-shrink: 0; }
.chip-info { display: flex; flex-direction: column; min-width: 0; }
.chip-name { font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.chip-service { font-size: 11px; opacity: 0.8; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.chip-time { font-size: 11px; opacity: 0.7; flex-shrink: 0; }
.chip-delete {
  background: none; border: none; cursor: pointer;
  font-size: 12px; color: inherit; opacity: 0.5; padding: 0 2px; flex-shrink: 0;
}
.chip-delete:hover { opacity: 1; }

/* ── Table ── */
.bookings-table { background: #fff; border: 1px solid #e2e8f0; border-radius: 14px; overflow: hidden; }
.table-head {
  display: grid; grid-template-columns: 1.2fr 1.2fr 1.4fr 0.8fr 1fr 1fr 0.5fr;
  gap: 8px; padding: 12px 16px;
  background: #f8fafc; border-bottom: 1px solid #e2e8f0;
  font-size: 11px; font-weight: 700; color: #64748b;
  text-transform: uppercase; letter-spacing: 0.05em;
}
.table-empty { padding: 32px; text-align: center; color: #94a3b8; font-size: 14px; }
.table-row {
  display: grid; grid-template-columns: 1.2fr 1.2fr 1.4fr 0.8fr 1fr 1fr 0.5fr;
  gap: 8px; padding: 12px 16px; align-items: center;
  border-bottom: 1px solid #f1f5f9; font-size: 13px;
  transition: background 0.1s;
}
.table-row:hover { background: #fafbff; }
.row--online { border-left: 3px solid #0ea5e9; }
.row--staff  { border-left: 3px solid #6366f1; }
.td-name { font-weight: 600; color: #1e293b; }
.td-service { color: #475569; }
.td-date { font-size: 12px; color: #64748b; line-height: 1.5; }
.td-dur  { color: #64748b; }

.source-badge {
  display: inline-flex; align-items: center; gap: 4px;
  font-size: 11px; font-weight: 600; padding: 3px 8px; border-radius: 20px;
}
.badge--online { background: #e0f2fe; color: #0369a1; }
.badge--staff  { background: #ede9fe; color: #4c1d95; }

.status-select {
  font-size: 12px; padding: 4px 8px; border-radius: 8px;
  border: 1px solid #d1d5db; outline: none; cursor: pointer;
  font-family: inherit;
}
.status-badge {
  display: inline-block; font-size: 11px; font-weight: 600;
  padding: 3px 10px; border-radius: 20px;
}
.status--pending { background: #fef3c7; color: #92400e; }
.status--done    { background: #dcfce7; color: #166534; }
.status--cancel  { background: #fee2e2; color: #991b1b; }

.filter-select {
  padding: 8px 12px; border: 1px solid #d1d5db;
  border-radius: 8px; font-size: 13px; background: #fff;
  color: #374151; outline: none; cursor: pointer;
}
.date-input {
  padding: 8px 12px; border: 1px solid #d1d5db;
  border-radius: 8px; font-size: 13px; background: #fff;
  color: #374151; outline: none;
}

/* ── Form ── */
.form-card {
  background: #fff; border: 1px solid #e2e8f0;
  border-radius: 16px; padding: 28px; max-width: 800px;
}
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px; }
.form-group { display: flex; flex-direction: column; gap: 5px; margin-bottom: 16px; }
.form-group label { font-size: 13px; font-weight: 600; color: #374151; }
.form-group input,
.form-group select,
.form-group textarea {
  padding: 10px 12px; border: 1px solid #d1d5db;
  border-radius: 8px; font-size: 14px; color: #1e293b;
  background: #fff; outline: none; width: 100%;
  transition: border 0.15s; font-family: inherit;
}
.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus { border-color: #6366f1; box-shadow: 0 0 0 3px rgba(99,102,241,0.1); }
.form-group input.err,
.form-group select.err { border-color: #f87171; }
.err-msg { font-size: 12px; color: #ef4444; }

/* ── Slots ── */
.slots-grid {
  display: grid; grid-template-columns: repeat(auto-fill, minmax(72px, 1fr));
  gap: 6px; margin-top: 4px;
}
.slot-btn {
  padding: 8px 4px; border-radius: 8px; border: 1px solid #e2e8f0;
  font-size: 13px; font-weight: 500; cursor: pointer;
  background: #f8fafc; color: #475569;
  transition: all 0.12s;
}
.slot--available:hover { border-color: #6366f1; color: #4f46e5; background: #eef2ff; }
.slot--selected { background: #4f46e5 !important; color: #fff !important; border-color: #4f46e5 !important; }
.slot--booked {
  background: #f1f5f9 !important; color: #cbd5e1 !important;
  border-color: #e2e8f0 !important; cursor: not-allowed !important; text-decoration: line-through;
}

/* ── Busy bar ── */
.busy-bar {
  background: #f8fafc; border: 1px solid #e2e8f0;
  border-radius: 10px; padding: 10px 14px;
  margin-bottom: 16px; display: flex;
  align-items: center; gap: 10px; flex-wrap: wrap;
}
.busy-label { font-size: 12px; font-weight: 600; color: #475569; flex-shrink: 0; }
.busy-slots { display: flex; gap: 3px; flex-wrap: wrap; flex: 1; }
.busy-dot { width: 8px; height: 8px; border-radius: 50%; display: inline-block; }
.busy-dot--green { background: #22c55e; }
.busy-dot--red   { background: #ef4444; }
.busy-hint { font-size: 11px; color: #94a3b8; display: flex; align-items: center; gap: 4px; }

/* ── Service info ── */
.service-info-box {
  display: flex; gap: 16px; align-items: center;
  background: #eef2ff; border: 1px solid #c7d2fe;
  border-radius: 10px; padding: 12px 16px;
  font-size: 13px; font-weight: 600; color: #3730a3;
  margin-bottom: 16px; flex-wrap: wrap;
}

/* ── Success toast ── */
.success-toast {
  margin-top: 16px; padding: 14px 20px;
  background: #dcfce7; border: 1px solid #86efac;
  border-radius: 10px; font-size: 14px; font-weight: 600; color: #166534;
}

/* ── My bookings ── */
.search-box { margin-bottom: 20px; }
.search-input {
  width: 100%; max-width: 440px;
  padding: 12px 16px; border: 1px solid #d1d5db;
  border-radius: 10px; font-size: 15px; background: #fff;
  color: #1e293b; outline: none;
}
.search-input:focus { border-color: #6366f1; }

.my-bookings-list { display: flex; flex-direction: column; gap: 10px; margin-bottom: 28px; }
.my-booking-card {
  background: #fff; border: 1px solid #e2e8f0;
  border-radius: 12px; padding: 14px 18px;
  display: flex; align-items: center;
  justify-content: space-between; gap: 12px;
}
.mb-left { display: flex; align-items: center; gap: 12px; }
.mb-icon { font-size: 28px; }
.mb-service { font-size: 15px; font-weight: 700; color: #1e293b; margin: 0 0 3px; }
.mb-meta { font-size: 12px; color: #64748b; margin: 0 0 2px; }
.mb-dur  { font-size: 12px; color: #94a3b8; margin: 0; }
.mb-right { display: flex; flex-direction: column; gap: 6px; align-items: flex-end; }

/* ── Client schedule ── */
.client-schedule { margin-top: 28px; }
.section-title { font-size: 15px; font-weight: 700; color: #1e293b; margin-bottom: 12px; }
.client-slots {
  background: #fff; border: 1px solid #e2e8f0;
  border-radius: 12px; overflow: hidden;
}
.cs-row {
  display: flex; align-items: center; gap: 12px;
  padding: 8px 16px; border-bottom: 1px solid #f1f5f9;
}
.cs-time { font-size: 12px; font-weight: 700; color: #94a3b8; width: 50px; flex-shrink: 0; }
.cs-bookings { display: flex; gap: 6px; flex-wrap: wrap; flex: 1; min-height: 28px; align-items: center; }
.cs-chip {
  font-size: 11px; padding: 3px 10px; border-radius: 20px;
  font-weight: 500;
}
.cs-chip--online { background: #e0f2fe; color: #0369a1; }
.cs-chip--staff  { background: #ede9fe; color: #4c1d95; }
.cs-free { font-size: 12px; color: #d1d5db; }

.form-footer { display: flex; justify-content: flex-end; gap: 10px; margin-top: 8px; }
.empty-msg { text-align: center; color: #94a3b8; font-size: 14px; padding: 32px; }

/* ── Responsive ── */
</style>