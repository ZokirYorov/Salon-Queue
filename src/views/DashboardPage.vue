<template>
  <div class="app">

    <!-- NAVBAR -->
    <nav class="navbar">
      <div class="navbar__inner">
        <div class="navbar__logo">
          <span class="logo-text">UstaTop<span class="logo-uz">.uz</span></span>
        </div>
        <div class="navbar__links">
          <button
              v-for="tab in navs"
              :key="tab.id"
              class="nav-btn"
              :class="{ 'nav-btn--active': view === tab.link }"
              @click="view = tab.link"
          >
            {{ tab.link }}
          </button>
        </div>
      </div>
    </nav>

    <!-- ─── LIST VIEW ─────────────────────────────────────────────── -->
    <div v-if="view === 'list'" class="page">

      <!-- Stats -->
      <div class="stats">
        <div class="stat">
          <span class="stat__val">{{ ustalar.length }}</span>
          <span class="stat__lbl">Faol usta</span>
        </div>
        <div class="stat">
          <span class="stat__val">{{ categories.length }}</span>
          <span class="stat__lbl">Kasb turi</span>
        </div>
        <div class="stat">
          <span class="stat__val">{{ totalReviews }}</span>
          <span class="stat__lbl">Baholash</span>
        </div>
      </div>

      <!-- Search & Filter -->
      <div class="search-box">
        <input
            v-model="search"
            class="search-input"
            placeholder="Kasb, ism yoki shahar..."
        />
      </div>
      <div class="filter-row">
        <button
            class="chip"
            :class="{ 'chip--on': activeCategory === '' }"
            @click="activeCategory = ''"
        >Barchasi</button>
        <button
            v-for="cat in categories"
            :key="cat"
            class="chip"
            :class="{ 'chip--on': activeCategory === cat }"
            @click="activeCategory = cat"
        >{{ cat }}</button>
      </div>

      <p class="result-count">{{ filteredUstalar.length }} ta e'lon</p>

      <!-- Cards -->
      <div class="cards">
        <div
            v-for="u in filteredUstalar"
            :key="u.id"
            class="card"
            @click="openDetail(u)"
        >
          <!-- Image gallery -->
          <div class="card__gallery">
            <img
                v-if="u.workImages.length"
                :src="u.workImages[0]"
                class="card__img"
                alt=""
            />
            <div v-else class="card__img-placeholder">
              <span class="cat-icon">{{ categoryIcon(u.category) }}</span>
            </div>
            <span class="card__badge" :style="badgeStyle(u.category)">
              {{ u.category }}
            </span>
            <span v-if="u.isVerified" class="card__verified">✓ Tasdiqlangan</span>
          </div>

          <div class="card__body">
            <div class="card__head">
              <div>
                <h3 class="card__name">{{ u.name }}</h3>
                <p class="card__location">📍 {{ u.city }} · {{ u.experience }} yil</p>
              </div>
              <div class="card__rating">
                ⭐ {{ u.rating.toFixed(1) }}
                <span class="card__reviews">({{ u.reviewCount }})</span>
              </div>
            </div>

            <p class="card__desc">{{ u.description }}</p>

            <!-- Services -->
            <div v-if="u.services.length" class="card__services">
              <div
                  v-for="s in u.services.slice(0, 3)"
                  :key="s.name"
                  class="service-item"
              >
                <span class="service-name">{{ s.name }}</span>
                <span class="service-price">{{ formatPrice(s.price) }}</span>
              </div>
              <p v-if="u.services.length > 3" class="service-more">
                +{{ u.services.length - 3 }} ta xizmat
              </p>
            </div>

            <!-- Tags -->
            <div class="card__tags">
              <span v-for="tag in u.tags.slice(0, 4)" :key="tag" class="tag">
                {{ tag }}
              </span>
            </div>

            <div class="card__footer">
              <div class="card__price">
                {{ formatPrice(minPrice(u)) }} dan
              </div>
              <div class="card__actions">
                <a :href="'tel:' + u.phone" class="btn-call" @click.stop>
                  📞 Qo'ng'iroq
                </a>
                <a
                    :href="'https://t.me/' + u.telegram"
                    target="_blank"
                    class="btn-tg"
                    @click.stop
                >
                  Telegram
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <p v-if="filteredUstalar.length === 0" class="empty">
        Hech narsa topilmadi. Qidiruvni o'zgartiring.
      </p>
    </div>

    <!-- ─── DETAIL VIEW ────────────────────────────────────────────── -->
    <div v-if="view === 'detail' && selected" class="page">
      <button class="back-btn" @click="view = 'list'">← Orqaga</button>

      <div class="detail">
        <!-- Gallery -->
        <div v-if="selected.workImages.length" class="detail__gallery">
          <img
              v-for="(img, i) in selected.workImages"
              :key="i"
              :src="img"
              class="detail__img"
              alt=""
          />
        </div>
        <div v-else class="detail__no-img">
          <span style="font-size:48px;">{{ categoryIcon(selected.category) }}</span>
        </div>

        <!-- Info -->
        <div class="detail__info">
          <div class="detail__head">
            <div>
              <h2 class="detail__name">{{ selected.name }}</h2>
              <p class="detail__meta">
                📍 {{ selected.city }} &nbsp;·&nbsp;
                {{ selected.category }} &nbsp;·&nbsp;
                {{ selected.experience }} yil tajriba
              </p>
            </div>
            <div>
              <div class="detail__rating">⭐ {{ selected.rating.toFixed(1) }}</div>
              <p class="detail__reviews">{{ selected.reviewCount }} ta baho</p>
            </div>
          </div>

          <p class="detail__desc">{{ selected.description }}</p>

          <!-- Services table -->
          <h4 class="section-title">Xizmatlar va narxlar</h4>
          <div class="services-table">
            <div
                v-for="s in selected.services"
                :key="s.name"
                class="services-row"
            >
              <span>{{ s.name }}</span>
              <span class="service-price-lg">{{ formatPrice(s.price) }}</span>
            </div>
          </div>

          <!-- Tags -->
          <h4 class="section-title">Ko'nikmalar</h4>
          <div class="card__tags" style="margin-bottom:1.5rem;">
            <span v-for="tag in selected.tags" :key="tag" class="tag">{{ tag }}</span>
          </div>

          <!-- Contact -->
          <div class="detail__contact">
            <a :href="'tel:' + selected.phone" class="btn-call-lg">
              📞 {{ selected.phone }}
            </a>
            <a
                :href="'https://t.me/' + selected.telegram"
                target="_blank"
                class="btn-tg-lg"
            >
              ✈️ @{{ selected.telegram }}
            </a>
          </div>
        </div>
      </div>
    </div>

    <!-- ─── REGISTER VIEW ─────────────────────────────────────────── -->
    <div v-if="view === 'register'" class="page">
      <div class="form-card">
        <h2 class="form-title">Usta sifatida e'lon berish</h2>
        <p class="form-sub">Ma'lumotlaringizni to'ldiring. Mijozlar siz bilan bog'lanadi.</p>

        <div class="form-section">Shaxsiy ma'lumotlar</div>
        <div class="form-row">
          <div class="form-group">
            <label>Ism Familiya *</label>
            <input v-model="form.name" placeholder="Masalan: Ali Karimov" />
          </div>
          <div class="form-group">
            <label>Kasb / Yo'nalish *</label>
            <input v-model="form.job" placeholder="Masalan: Santexnik" />
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>Kategoriya *</label>
            <select v-model="form.category">
              <option value="">Tanlang...</option>
              <option v-for="c in categories" :key="c">{{ c }}</option>
              <option value="Boshqa">Boshqa</option>
            </select>
          </div>
          <div class="form-group">
            <label>Shahar *</label>
            <select v-model="form.city">
              <option value="">Tanlang...</option>
              <option v-for="c in cities" :key="c">{{ c }}</option>
            </select>
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>Telefon *</label>
            <input v-model="form.phone" placeholder="+998 90 123 45 67" />
          </div>
          <div class="form-group">
            <label>Telegram</label>
            <input v-model="form.telegram" placeholder="username (@ siz)" />
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>Tajriba (yil)</label>
            <input v-model.number="form.experience" type="number" min="0" placeholder="5" />
          </div>
        </div>

        <div class="form-group" style="margin-top:4px;">
          <label>O'z haqingizda *</label>
          <textarea
              v-model="form.description"
              rows="3"
              placeholder="Qisqacha o'zingiz va xizmatlaringiz haqida yozing..."
          />
        </div>

        <div class="form-section" style="margin-top:1.5rem;">Xizmatlar va narxlar</div>
        <div
            v-for="(s, i) in form.services"
            :key="i"
            class="service-add-row"
        >
          <input v-model="s.name" placeholder="Xizmat nomi" style="flex:2;" />
          <input
              v-model.number="s.price"
              type="number"
              placeholder="Narx (so'm)"
              style="flex:1;"
          />
          <button class="remove-btn" @click="removeService(i)">✕</button>
        </div>
        <button class="add-service-btn" @click="addService">+ Xizmat qo'shish</button>

        <div class="form-section" style="margin-top:1.5rem;">Ko'nikmalar (teglar)</div>
        <div class="tags-input-row">
          <input
              v-model="tagInput"
              placeholder="Tag nomi yozing va Enter bosing"
              @keydown.enter.prevent="addTag"
          />
        </div>
        <div class="card__tags" style="margin-top:8px;">
          <span
              v-for="(tag, i) in form.tags"
              :key="i"
              class="tag tag--removable"
              @click="removeTag(i)"
          >{{ tag }} ✕</span>
        </div>

        <div class="form-section" style="margin-top:1.5rem;">Ish rasmlari</div>
        <input type="file" multiple accept="image/*" @change="handleImage" class="file-input" />
        <div v-if="form.images.length" class="preview-grid">
          <div
              v-for="(img, i) in form.images"
              :key="i"
              class="preview-item"
          >
            <img :src="img" alt="" />
            <button class="preview-remove" @click="removeImage(i)">✕</button>
          </div>
        </div>

        <div class="form-errors" v-if="errors.length">
          <p v-for="e in errors" :key="e" class="error">⚠ {{ e }}</p>
        </div>

        <div class="form-footer">
          <button class="btn-cancel" @click="resetForm">Bekor qilish</button>
          <button class="btn-submit" @click="submitUsta">
            E'lonni joylashtirish →
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

// ─── Types ────────────────────────────────────────────────────────────────────
interface Service { name: string; price: number }
interface Usta {
  id: number
  name: string
  job: string
  category: string
  city: string
  phone: string
  telegram: string
  experience: number
  description: string
  rating: number
  reviewCount: number
  isVerified: boolean
  services: Service[]
  tags: string[]
  workImages: string[]
}

// ─── State ────────────────────────────────────────────────────────────────────
const search   = ref('')
const activeCategory = ref('')
const selected = ref<Usta | null>(null)
const tagInput = ref('')
const errors   = ref<string[]>([])

type ViewType = 'list' | 'register' | 'detail'

const view  = ref<ViewType>('list')

const navs = ref<{id: number, link: ViewType}[]>([
    {id: 1, link: 'list'},
    {id: 2, link: 'register'},
])
const categories = [
  'Santexnik', 'Elektrik', 'Qurilish', 'Rassomchi',
  'Marangoz', 'Konditsioner', 'Kompyuter ta\'miri', 'Qulfchi', 'Haydovchi',
]

const cities = [
  'Toshkent', 'Samarqand', 'Buxoro', 'Namangan',
  'Andijon', 'Farg\'ona', 'Qarshi', 'Nukus', 'Termiz',
]

const ustalar = ref<Usta[]>([
  {
    id: 1,
    name: 'Ali Karimov',
    job: 'Santexnik',
    category: 'Santexnik',
    city: 'Toshkent',
    phone: '+998901234567',
    telegram: 'aliusta',
    experience: 8,
    description: 'Har qanday santexnik ishlarini professional darajada bajaraman. Quvur almashtirish, bosim tiklash, yangi o\'rnatish.',
    rating: 4.9,
    reviewCount: 42,
    isVerified: true,
    services: [
      { name: 'Kran almashtirish', price: 80000 },
      { name: 'Quvur ta\'miri', price: 120000 },
      { name: 'Унитаз o\'rnatish', price: 200000 },
    ],
    tags: ['Kran', 'Quvur', 'WC', 'Bosim tiklash'],
    workImages: [],
  },
  {
    id: 2,
    name: 'Bobur Toshmatov',
    job: 'Elektrik',
    category: 'Elektrik',
    city: 'Samarqand',
    phone: '+998932345678',
    telegram: 'boburelektrik',
    experience: 6,
    description: 'Uy va ofis elektr ishlari. Rozetka, o\'chirg\'ich o\'rnatish, sxema chizish, simlash.',
    rating: 4.7,
    reviewCount: 29,
    isVerified: false,
    services: [
      { name: 'Rozetka o\'rnatish', price: 50000 },
      { name: 'Sxema chizish', price: 150000 },
      { name: 'Щitkа yig\'ish', price: 300000 },
    ],
    tags: ['Rozetka', 'Simlash', 'Щit', '220V'],
    workImages: [],
  },
  {
    id: 3,
    name: 'Sardor Ergashev',
    job: 'Usta qurilishchi',
    category: 'Qurilish',
    city: 'Namangan',
    phone: '+998903456789',
    telegram: 'sardorqurilish',
    experience: 12,
    description: 'Devor suvoq, pol yotqizish, plitka qo\'yish, gips, shipga plita o\'rnatish kabi ishlarni tez va sifatli bajaraman.',
    rating: 5.0,
    reviewCount: 61,
    isVerified: true,
    services: [
      { name: 'Devor suvoq (1 m²)', price: 25000 },
      { name: 'Plitka qo\'yish (1 m²)', price: 40000 },
      { name: 'Gips qilish (1 m²)', price: 35000 },
    ],
    tags: ['Suvoq', 'Plitka', 'Gips', 'Pol', 'Shiр'],
    workImages: [],
  },
  {
    id: 4,
    name: 'Dilnoza Rahimova',
    job: 'Rassomchi',
    category: 'Rassomchi',
    city: 'Toshkent',
    phone: '+998905678901',
    telegram: 'dilnoza_paint',
    experience: 5,
    description: 'Uy va ofislarni bo\'yash. Dekorativ bo\'yash, fon rasmlari, textura — barcha uslublar.',
    rating: 4.8,
    reviewCount: 37,
    isVerified: true,
    services: [
      { name: 'Oddiy bo\'yash (1 m²)', price: 15000 },
      { name: 'Dekorativ bo\'yash (1 m²)', price: 45000 },
      { name: 'Fon rasm', price: 500000 },
    ],
    tags: ["Bo'yash", 'Dekor', 'Fon rasm', 'Emulsion'],
    workImages: [],
  },
])

// ─── Form ─────────────────────────────────────────────────────────────────────
const emptyForm = () => ({
  name: '', job: '', category: '', city: '',
  phone: '', telegram: '', experience: 0,
  description: '', services: [] as Service[],
  tags: [] as string[], images: [] as string[],
})

const form = ref(emptyForm())

// ─── Computed ─────────────────────────────────────────────────────────────────
const totalReviews = computed(() =>
    ustalar.value.reduce((s, u) => s + u.reviewCount, 0)
)

const filteredUstalar = computed(() => {
  const q = search.value.toLowerCase()
  return ustalar.value.filter(u => {
    const matchCat = !activeCategory.value || u.category === activeCategory.value
    const matchQ   = !q ||
        u.name.toLowerCase().includes(q) ||
        u.job.toLowerCase().includes(q)  ||
        u.city.toLowerCase().includes(q) ||
        u.tags.some(t => t.toLowerCase().includes(q))
    return matchCat && matchQ
  })
})

// ─── Helpers ─────────────────────────────────────────────────────────────────
function formatPrice(p: number): string {
  return p.toLocaleString('uz-UZ') + ' so\'m'
}

function minPrice(u: Usta): number {
  if (!u.services.length) return 0
  return Math.min(...u.services.map(s => s.price))
}

const categoryColors: Record<string, string> = {
  'Santexnik':           '#E6F1FB',
  'Elektrik':            '#FAEEDA',
  'Qurilish':            '#EAF3DE',
  'Rassomchi':           '#FBEAF0',
  'Marangoz':            '#FAECE7',
  'Konditsioner':        '#E1F5EE',
  "Kompyuter ta'miri":   '#EEEDFE',
  'Qulfchi':             '#F1EFE8',
  'Haydovchi':           '#FCEBEB',
}

const categoryTextColors: Record<string, string> = {
  'Santexnik':           '#0C447C',
  'Elektrik':            '#633806',
  'Qurilish':            '#27500A',
  'Rassomchi':           '#72243E',
  'Marangoz':            '#712B13',
  'Konditsioner':        '#085041',
  "Kompyuter ta'miri":   '#3C3489',
  'Qulfchi':             '#444441',
  'Haydovchi':           '#791F1F',
}

const categoryIcons: Record<string, string> = {
  'Santexnik': '🔧',
  'Elektrik': '⚡',
  'Qurilish': '🏗️',
  'Rassomchi': '🎨',
  'Marangoz': '🪚',
  'Konditsioner': '❄️',
  "Kompyuter ta'miri": '💻',
  'Qulfchi': '🔑',
  'Haydovchi': '🚗',
}

function badgeStyle(cat: string) {
  return {
    background: categoryColors[cat] || '#F1EFE8',
    color: categoryTextColors[cat] || '#444441',
  }
}

function categoryIcon(cat: string): string {
  return categoryIcons[cat] || '🛠️'
}

// ─── Actions ──────────────────────────────────────────────────────────────────
function openDetail(u: Usta) {
  selected.value = u
  view.value = 'detail'
}

function handleImage(e: Event) {
  const files = (e.target as HTMLInputElement).files
  if (!files) return
  for (const f of files) {
    form.value.images.push(URL.createObjectURL(f))
  }
}

function removeImage(i: number) {
  form.value.images.splice(i, 1)
}

function addService() {
  form.value.services.push({ name: '', price: 0 })
}

function removeService(i: number) {
  form.value.services.splice(i, 1)
}

function addTag() {
  const t = tagInput.value.trim()
  if (t && !form.value.tags.includes(t)) {
    form.value.tags.push(t)
  }
  tagInput.value = ''
}

function removeTag(i: number) {
  form.value.tags.splice(i, 1)
}

function resetForm() {
  form.value = emptyForm()
  errors.value = []
  view.value = 'list'
}

function submitUsta() {
  errors.value = []
  if (!form.value.name.trim())        errors.value.push('Ism majburiy')
  if (!form.value.category)           errors.value.push('Kategoriya tanlang')
  if (!form.value.city)               errors.value.push('Shahar tanlang')
  if (!form.value.phone.trim())       errors.value.push('Telefon majburiy')
  if (!form.value.description.trim()) errors.value.push("O'z haqingizda yozing")
  if (errors.value.length) return

  ustalar.value.unshift({
    id:          Date.now(),
    name:        form.value.name,
    job:         form.value.job || form.value.category,
    category:    form.value.category,
    city:        form.value.city,
    phone:       form.value.phone,
    telegram:    form.value.telegram,
    experience:  form.value.experience,
    description: form.value.description,
    rating:      5.0,
    reviewCount: 0,
    isVerified:  false,
    services:    form.value.services.filter(s => s.name.trim()),
    tags:        form.value.tags,
    workImages:  form.value.images,
  })

  resetForm()
}
</script>

<style scoped>
/* ─── Base ─────────────────────────────────────────────────────────────────── */
* { box-sizing: border-box; }

.app {
  min-height: 100vh;
  background: #f4f5f7;
  font-family: 'Segoe UI', system-ui, sans-serif;
}

/* ─── Navbar ───────────────────────────────────────────────────────────────── */
.navbar {
  background: #fff;
  border-bottom: 1px solid #e5e7eb;
  position: sticky;
  top: 0;
  z-index: 10;
}
.navbar__inner {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 20px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.navbar__logo {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 20px;
  font-weight: 700;
  color: #1d4ed8;
}
.logo-icon { font-size: 22px; }
.logo-uz { color: #16a34a; }
.navbar__links { display: flex; gap: 8px; }

.nav-btn {
  padding: 7px 18px;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  background: transparent;
  color: #374151;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s;
}
.nav-btn:hover { background: #f3f4f6; }
.nav-btn--active {
  background: #1d4ed8;
  color: #fff;
  border-color: #1d4ed8;
}

/* ─── Page ─────────────────────────────────────────────────────────────────── */
.page {
  max-width: 1100px;
  margin: 0 auto;
  padding: 24px 20px;
}

/* ─── Stats ────────────────────────────────────────────────────────────────── */
.stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-bottom: 20px;
}
.stat {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 16px;
  text-align: center;
}
.stat__val { display: block; font-size: 26px; font-weight: 700; color: #1d4ed8; }
.stat__lbl { display: block; font-size: 12px; color: #6b7280; margin-top: 4px; }

/* ─── Search ───────────────────────────────────────────────────────────────── */
.search-box { margin-bottom: 12px; }
.search-input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #d1d5db;
  border-radius: 10px;
  font-size: 15px;
  background: #fff;
  color: #111827;
  outline: none;
  transition: border 0.15s;
}
.search-input:focus { border-color: #1d4ed8; }

.filter-row {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 16px;
}
.chip {
  font-size: 13px;
  padding: 6px 14px;
  border-radius: 20px;
  border: 1px solid #d1d5db;
  background: #fff;
  color: #374151;
  cursor: pointer;
  transition: all 0.15s;
}
.chip:hover { border-color: #6b7280; }
.chip--on {
  background: #1d4ed8;
  color: #fff;
  border-color: #1d4ed8;
}

.result-count { font-size: 13px; color: #6b7280; margin-bottom: 14px; }

/* ─── Cards grid ───────────────────────────────────────────────────────────── */
.cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}

.card {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.15s, box-shadow 0.15s;
}
.card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.08);
}

.card__gallery { position: relative; }
.card__img {
  width: 100%;
  height: 160px;
  object-fit: cover;
  display: block;
}
.card__img-placeholder {
  height: 120px;
  background: #f9fafb;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 42px;
}
.card__badge {
  position: absolute;
  top: 10px;
  left: 10px;
  font-size: 11px;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 20px;
}
.card__verified {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 11px;
  background: #dcfce7;
  color: #166534;
  padding: 4px 10px;
  border-radius: 20px;
  font-weight: 500;
}

.card__body { padding: 14px; }
.card__head { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px; }
.card__name { font-size: 16px; font-weight: 600; color: #111827; margin: 0 0 3px; }
.card__location { font-size: 12px; color: #6b7280; margin: 0; }
.card__rating { font-size: 14px; font-weight: 600; color: #d97706; text-align: right; }
.card__reviews { font-size: 12px; color: #9ca3af; font-weight: 400; }

.card__desc {
  font-size: 13px;
  color: #4b5563;
  line-height: 1.5;
  margin-bottom: 10px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card__services {
  background: #f9fafb;
  border-radius: 8px;
  padding: 8px 10px;
  margin-bottom: 10px;
}
.service-item {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  padding: 3px 0;
  border-bottom: 1px dashed #e5e7eb;
}
.service-item:last-child { border: none; }
.service-name { color: #374151; }
.service-price { color: #1d4ed8; font-weight: 600; }
.service-more { font-size: 11px; color: #9ca3af; margin: 4px 0 0; }

.card__tags {
  display: flex;
  gap: 5px;
  flex-wrap: wrap;
  margin-bottom: 12px;
}
.tag {
  font-size: 11px;
  padding: 4px 10px;
  border-radius: 20px;
  background: #f3f4f6;
  color: #374151;
  border: 1px solid #e5e7eb;
}
.tag--removable { cursor: pointer; }
.tag--removable:hover { background: #fee2e2; color: #dc2626; border-color: #fca5a5; }

.card__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top: 1px solid #f3f4f6;
  padding-top: 12px;
  gap: 8px;
}
.card__price { font-size: 14px; font-weight: 700; color: #111827; }
.card__actions { display: flex; gap: 6px; }

.btn-call {
  font-size: 12px;
  padding: 7px 12px;
  border-radius: 8px;
  background: #1d4ed8;
  color: #fff;
  text-decoration: none;
  font-weight: 500;
  white-space: nowrap;
}
.btn-tg {
  font-size: 12px;
  padding: 7px 12px;
  border-radius: 8px;
  background: #f0f9ff;
  color: #0369a1;
  border: 1px solid #bae6fd;
  text-decoration: none;
  font-weight: 500;
}

/* ─── Empty ────────────────────────────────────────────────────────────────── */
.empty {
  text-align: center;
  color: #9ca3af;
  font-size: 15px;
  padding: 48px;
}

/* ─── Detail ───────────────────────────────────────────────────────────────── */
.back-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: #1d4ed8;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  margin-bottom: 20px;
  font-weight: 500;
}

.detail {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  overflow: hidden;
}
.detail__gallery {
  display: flex;
  gap: 4px;
  overflow-x: auto;
  padding: 4px;
  background: #f9fafb;
}
.detail__img {
  width: 220px;
  height: 160px;
  object-fit: cover;
  border-radius: 8px;
  flex-shrink: 0;
}
.detail__no-img {
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f9fafb;
}
.detail__info { padding: 24px; }
.detail__head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}
.detail__name { font-size: 22px; font-weight: 700; color: #111827; margin: 0 0 6px; }
.detail__meta { font-size: 13px; color: #6b7280; margin: 0; }
.detail__rating { font-size: 20px; font-weight: 700; color: #d97706; }
.detail__reviews { font-size: 12px; color: #9ca3af; text-align: right; }
.detail__desc {
  font-size: 14px;
  color: #4b5563;
  line-height: 1.7;
  margin-bottom: 20px;
}

.section-title {
  font-size: 14px;
  font-weight: 600;
  color: #111827;
  margin-bottom: 10px;
  padding-bottom: 6px;
  border-bottom: 1px solid #f3f4f6;
}

.services-table { margin-bottom: 20px; }
.services-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px dashed #e5e7eb;
  font-size: 14px;
  color: #374151;
}
.service-price-lg { font-weight: 700; color: #1d4ed8; }

.detail__contact { display: flex; gap: 12px; flex-wrap: wrap; margin-top: 20px; }
.btn-call-lg {
  flex: 1;
  padding: 14px;
  border-radius: 10px;
  background: #1d4ed8;
  color: #fff;
  text-align: center;
  text-decoration: none;
  font-weight: 600;
  font-size: 15px;
  min-width: 160px;
}
.btn-tg-lg {
  flex: 1;
  padding: 14px;
  border-radius: 10px;
  background: #f0f9ff;
  color: #0369a1;
  border: 1px solid #bae6fd;
  text-align: center;
  text-decoration: none;
  font-weight: 600;
  font-size: 15px;
  min-width: 160px;
}

/* ─── Form ─────────────────────────────────────────────────────────────────── */
.form-card {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  padding: 32px;
  max-width: 720px;
  margin: 0 auto;
}
.form-title { font-size: 22px; font-weight: 700; color: #111827; margin: 0 0 6px; }
.form-sub { font-size: 14px; color: #6b7280; margin-bottom: 24px; }

.form-section {
  font-size: 12px;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin-bottom: 14px;
  padding-bottom: 8px;
  border-bottom: 1px solid #f3f4f6;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
  margin-bottom: 14px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
}
.form-group label {
  font-size: 13px;
  font-weight: 500;
  color: #374151;
}
.form-group input,
.form-group select,
.form-group textarea {
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  color: #111827;
  background: #fff;
  outline: none;
  width: 100%;
  transition: border 0.15s;
  font-family: inherit;
}
.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus { border-color: #1d4ed8; }

.service-add-row {
  display: flex;
  gap: 8px;
  align-items: center;
  margin-bottom: 8px;
}
.service-add-row input {
  padding: 9px 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 13px;
  color: #111827;
  outline: none;
}
.service-add-row input:focus { border-color: #1d4ed8; }
.remove-btn {
  padding: 9px 12px;
  border: 1px solid #fca5a5;
  background: #fef2f2;
  color: #dc2626;
  border-radius: 8px;
  cursor: pointer;
  font-size: 13px;
  flex-shrink: 0;
}

.add-service-btn {
  font-size: 13px;
  color: #1d4ed8;
  background: #eff6ff;
  border: 1px dashed #93c5fd;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  margin-top: 4px;
}

.tags-input-row input {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  outline: none;
  color: #111827;
}
.tags-input-row input:focus { border-color: #1d4ed8; }

.file-input {
  font-size: 13px;
  color: #374151;
  margin: 8px 0;
}

.preview-grid {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 10px;
}
.preview-item {
  position: relative;
  width: 80px;
  height: 80px;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #e5e7eb;
}
.preview-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
.preview-remove {
  position: absolute;
  top: 3px;
  right: 3px;
  width: 20px;
  height: 20px;
  background: rgba(0,0,0,0.5);
  color: #fff;
  border: none;
  border-radius: 50%;
  font-size: 11px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.form-errors { margin-top: 16px; }
.error { font-size: 13px; color: #dc2626; margin-bottom: 4px; }

.form-footer {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 28px;
  padding-top: 20px;
  border-top: 1px solid #f3f4f6;
}

.btn-cancel {
  padding: 11px 24px;
  border: 1px solid #d1d5db;
  border-radius: 10px;
  background: #fff;
  color: #374151;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
}
.btn-cancel:hover { background: #f9fafb; }

.btn-submit {
  padding: 11px 28px;
  border: none;
  border-radius: 10px;
  background: #1d4ed8;
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s;
}
.btn-submit:hover { background: #1e40af; }

/* ─── Responsive ───────────────────────────────────────────────────────────── */
@media (max-width: 600px) {
  .stats { grid-template-columns: 1fr 1fr 1fr; }
  .form-row { grid-template-columns: 1fr; }
  .cards { grid-template-columns: 1fr; }
  .service-add-row { flex-wrap: wrap; }
}
</style>
