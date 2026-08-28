<template>
  <div class="min-h-screen bg-slate-50 text-slate-950 transition-colors dark:bg-slate-950 dark:text-white">
    <AppHeader />

    <main>
      <section class="relative border-b border-slate-200 bg-[linear-gradient(135deg,#f8fafc_0%,#eefaf7_48%,#fff7ed_100%)] dark:border-slate-800 dark:bg-[linear-gradient(135deg,#020617_0%,#0f2f2c_58%,#1f1607_100%)]">
        <div class="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-slate-50 to-transparent dark:from-slate-950" />
        <div class="relative mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-14 lg:py-6">
          <div>
            <div class="mb-5 inline-flex items-center gap-2 rounded-full border border-teal-200 bg-white/80 px-3 py-1.5 text-xs font-semibold text-teal-800 shadow-sm dark:border-teal-700 dark:bg-slate-900/70 dark:text-teal-200">
              <span class="h-2 w-2 rounded-full bg-teal-500" />
              Tezkor qidiruv, aniq navbat
            </div>
            <h1 class="max-w-3xl text-4xl font-black leading-tight tracking-normal text-slate-950 dark:text-white sm:text-5xl lg:text-[58px]">
              Kerakli xizmatni toping, vaqtni o'zingiz tanlang
            </h1>
            <p class="mt-5 max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-300 sm:text-lg">
              Sartaroshdan tibbiyotgacha: yaqin xizmat ko'rsatuvchilar, reytinglar va band qilish jarayoni bitta sahifada.
            </p>

            <div class="mt-8 grid gap-3 rounded-3xl border border-slate-200 bg-white/95 p-3 shadow-[0_18px_55px_rgba(15,23,42,0.12)] backdrop-blur dark:border-slate-700 dark:bg-slate-900/90 md:grid-cols-[1.35fr_0.95fr_0.95fr_auto]">
              <label class="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-800/80">
                <span class="mb-1 flex items-center gap-2 text-xs font-semibold text-slate-400">
                  <svg
                      class="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-4.35-4.35m1.35-5.65a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  Qidiruv
                </span>
                <input
                  v-model="searchQuery"
                  type="search"
                  placeholder="Xizmat, biznes yoki manzil"
                  class="w-full bg-transparent text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none dark:text-white"
                />
              </label>
              <div
                  class="relative rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-800/80"
                  v-click-outside="() => (cityMenuOpen = false)"
              >
                <span class="mb-1 flex items-center gap-2 text-xs font-semibold text-slate-400">
                  <svg
                      class="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 21s7-4.35 7-11a7 7 0 10-14 0c0 6.65 7 11 7 11z" />
                    <circle cx="12" cy="10" r="2.5" />
                  </svg>
                  Hudud
                </span>
                <button
                  type="button"
                  @click="cityMenuOpen = !cityMenuOpen"
                  class="flex w-full items-center justify-between gap-3 text-left text-sm font-semibold text-slate-900 focus:outline-none dark:text-white"
                >
                  <span class="truncate">{{ cityFilter || 'Barcha shaharlar' }}</span>
                  <svg
                      class="h-4 w-4 shrink-0 text-slate-400 transition"
                      :class="cityMenuOpen &&
                      'rotate-180'" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                  </svg>
                </button>
                <div
                  v-if="cityMenuOpen"
                  class="absolute left-0 right-0 top-full z-30 mt-2 max-h-64 overflow-auto rounded-2xl border border-slate-200 bg-white p-1.5 shadow-xl shadow-slate-900/10 dark:border-slate-700 dark:bg-slate-800"
                >
                  <button
                    type="button"
                    @click="selectCity('')"
                    :class="dropdownItemClass(cityFilter === '')"
                  >
                    Barcha shaharlar
                  </button>
                  <button
                    v-for="c in availableCities"
                    :key="c"
                    type="button"
                    @click="selectCity(c)"
                    :class="dropdownItemClass(cityFilter === c)"
                  >
                    {{ c }}
                  </button>
                </div>
              </div>
              <div
                  class="relative rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-800/80"
                  v-click-outside="() => (sortMenuOpen = false)"
              >
                <span class="mb-1 flex items-center gap-2 text-xs font-semibold text-slate-400">
                  <svg
                      class="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3M4 11h16M5 5h14a1 1 0 011 1v14a1 1 0 01-1 1H5a1 1 0 01-1-1V6a1 1 0 011-1z" />
                  </svg>
                  Tartib
                </span>
                <button
                  type="button"
                  @click="sortMenuOpen = !sortMenuOpen"
                  class="flex w-full items-center justify-between gap-3 text-left text-sm font-semibold text-slate-900 focus:outline-none dark:text-white"
                >
                  <span class="truncate">{{ sortLabel }}</span>
                  <svg
                      class="h-4 w-4 shrink-0 text-slate-400 transition"
                      :class="sortMenuOpen &&
                       'rotate-180'" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                  </svg>
                </button>
                <div
                  v-if="sortMenuOpen"
                  class="absolute left-0 right-0 top-full z-30 mt-2 rounded-2xl border border-slate-200 bg-white p-1.5 shadow-xl shadow-slate-900/10 dark:border-slate-700 dark:bg-slate-800"
                >
                  <button
                    v-for="option in sortOptions"
                    :key="option.value"
                    type="button"
                    @click="selectSort(option.value)"
                    :class="dropdownItemClass(sortBy === option.value)"
                  >
                    {{ option.label }}
                  </button>
                </div>
              </div>
              <button
                type="button"
                @click="runSearch"
                class="inline-flex min-h-14 cursor-pointer items-center justify-center rounded-2xl bg-teal-600 px-7 text-sm font-black text-white transition hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-400"
              >
                Qidirish
              </button>
            </div>

            <div class="mt-5 flex flex-wrap items-center gap-2">
              <button
                v-for="cat in categoryOptions"
                :key="cat.value"
                type="button"
                @click="setCategory(cat.value)"
                class="inline-flex cursor-pointer items-center gap-2 rounded-2xl border px-3.5 py-2 text-sm font-bold transition"
                :class="categoryFilter === cat.value ?
                 'border-teal-600 bg-teal-600 text-white shadow-sm' :
                  'border-gray-200 bg-white/80 text-slate-500 hover:border-teal-600 hover:text-teal-600 dark:border-gray-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-teal-500'"
              >
                {{ cat.label }}
              </button>
            </div>
          </div>
        </div>
      </section>

      <section class="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
      <div class="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2
              class="text-2xl font-black text-slate-950 dark:text-white"
          >
            Tavsiya etilganlar
          </h2>
          <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {{ filteredCards.length }} ta natija
          </p>
        </div>
        <button
          v-if="hasActiveFilters"
          type="button"
          @click="clearFilters"
          class="self-start rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-teal-300 hover:text-teal-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
        >
          Filterlarni tozalash
        </button>
      </div>

      <div
          v-if="loading"
          class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
      >
        <div
            v-for="i in 6"
            :key="i"
            class="overflow-hidden rounded-[22px] border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900 animate-pulse"
        >
          <div class="h-48 bg-slate-100 dark:bg-slate-800" />
          <div class="p-5 space-y-2.5">
            <div class="h-4 bg-slate-100 dark:bg-slate-700 rounded w-2/3" />
            <div class="h-3 bg-slate-100 dark:bg-slate-700 rounded w-1/3" />
            <div class="h-3 bg-slate-100 dark:bg-slate-700 rounded w-full" />
          </div>
        </div>
      </div>
      <div
          v-else-if="error"
          class="text-center py-20 text-red-500"
      >
        {{ error }}
      </div>
      <div
          v-else-if="filteredCards.length === 0"
          class="text-center py-20 bg-white dark:bg-slate-900 rounded-[24px] border border-dashed border-slate-200 dark:border-slate-700"
      >
        <svg class="mx-auto h-10 w-10 text-slate-300 dark:text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <p
            class="mt-3 text-sm font-bold text-slate-900 dark:text-white"
        >
          Hech qanday xizmat ko'rsatuvchi topilmadi
        </p>
        <p
            class="mt-1 text-xs text-slate-400"
        >
          Qidiruv parametrlarini o'zgartirib ko'ring
        </p>
      </div>

      <div v-else class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <RouterLink
          v-for="card in filteredCards"
          :key="card.id"
          :to="`/business/${card.id}`"
          class="group flex flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-teal-300 hover:shadow-xl dark:border-slate-700 dark:bg-slate-900 dark:hover:border-teal-500"
        >
          <div class="relative h-44 w-full overflow-hidden bg-slate-900 flex-shrink-0">
            <img
              v-if="card.imageUrl"
              :src="getAvatarUrl(card.imageUrl)"
              :alt="card.name"
              class="h-full w-full object-cover object-center opacity-95 transition duration-500 group-hover:scale-105"
            />
            <div
                v-else
                class="h-full w-full bg-[linear-gradient(135deg,#0f766e,#f59e0b)]"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-950/10 to-transparent"
            />
            <div class="absolute bottom-4 left-4 right-4">
              <div class="flex items-end justify-between gap-3">
                <div
                    v-if="!card.imageUrl"
                    class="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white text-lg font-black text-teal-700 shadow-lg"
                >
                  {{ card.name.charAt(0).toUpperCase() }}
                </div>
                <div
                    v-if="card.avgRating > 0"
                    class="rounded-full bg-white/95 px-3 py-1.5 text-sm font-black text-slate-950 shadow-sm"
                >
                  <span class="text-yellow-500">★</span> {{ card.avgRating.toFixed(1) }}
                </div>
              </div>
            </div>
            <div class="absolute left-3 top-3 flex flex-wrap gap-2">
              <span
                  class="inline-flex items-center rounded-2xl bg-white/95 px-3 py-1.5 text-xs font-black text-slate-900 shadow-sm backdrop-blur-md"
              >
                {{ categoryLabel(card.category) }}
              </span>
            </div>
            <div class="absolute right-3 top-3">
              <span class="inline-flex items-center gap-1 rounded-2xl transition-all duration-200 bg-white px-3 py-1.5 text-xs font-black text-slate-900 shadow-sm backdrop-blur-md">
                <span class="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Faol
              </span>
            </div>
          </div>

          <div class="p-5 flex-1 flex flex-col">
            <div class="mb-2 flex items-start justify-between gap-2">
              <h3 class="line-clamp-1 text-lg font-black text-slate-950 transition-colors group-hover:text-teal-700 dark:text-white dark:group-hover:text-teal-300">
                {{ card.name }}
              </h3>
            </div>
            <div class="mb-4 flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400">
              <svg class="h-4 w-4 shrink-0 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 21s7-4.35 7-11a7 7 0 10-14 0c0 6.65 7 11 7 11z" /><circle cx="12" cy="10" r="2.5" />
              </svg>
              <span class="truncate">
                {{ [card.city, card.addressLine].filter(Boolean).join(', ') || 'Manzil kiritilmagan' }}
              </span>
            </div>
            <p
                class="mb-4 line-clamp-2 min-h-10 text-sm leading-5 text-slate-500 dark:text-slate-400"
            >
              {{ card.description || 'Xizmatlar, ustalar va bo\'sh vaqtlarni ko\'rib, o\'zingizga qulay navbatni tanlang.' }}
            </p>

            <div class="mt-auto grid grid-cols-2 gap-2 border-t border-slate-200 pt-4 text-xs dark:border-slate-700">
              <span
                  class="rounded-2xl bg-slate-50 px-3 py-2 font-black text-slate-700 dark:bg-slate-800 dark:text-slate-200"
              >
                {{ card.serviceCount }} xizmat
              </span>
              <span
                  class="rounded-2xl bg-slate-50 px-3 py-2 font-black text-slate-700 dark:bg-slate-800 dark:text-slate-200"
              >
                {{ card.reviewCount > 0 ? `${card.reviewCount} sharh` : 'Yangi' }}
              </span>
            </div>
            <div class="mt-3 flex items-center justify-between gap-3">
              <span class="text-xs font-semibold text-slate-400">Sahifaga kirib vaqt tanlang</span>
              <span
                  class="rounded-2xl bg-indigo-600 px-4 py-2 text-sm font-black text-white transition-colors duration-200 group-hover:bg-teal-600 dark:bg-white dark:text-slate-950 dark:group-hover:bg-teal-400"
              >
                Navbat olish
              </span>
            </div>
          </div>
        </RouterLink>
      </div>

      <div
          v-if="totalPages > 1"
          class="flex justify-center gap-2 pt-4"
      >
        <button
          v-for="p in totalPages"
          :key="p"
          @click="page = p - 1"
          class="w-8 h-8 rounded-lg text-xs font-semibold transition"
          :class="page === p - 1
          ? 'bg-teal-600 text-white'
          : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'"
        >
          {{ p }}
        </button>
      </div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { RouterLink } from 'vue-router';
import { businessesApi } from '@/api/businesses';
// import { mediaUrl } from '@/utils/media';
import { apiErrorMessage } from '@/utils/apiError';
import AppHeader from '@/components/AppHeader.vue';
import type { BusinessCategory, PublicBusinessSummary } from '@/types/api';

const cards = ref<PublicBusinessSummary[]>([]);
const cities = ref<string[]>([]);
const searchQuery = ref('');
const categoryFilter = ref<BusinessCategory | ''>('');
const cityFilter = ref('');
const sortBy = ref<'rating' | 'reviews' | 'name'>('rating');
const cityMenuOpen = ref(false);
const sortMenuOpen = ref(false);
const loading = ref(false);
const error = ref('');
const page = ref(0);
const totalPages = ref(1);

const categoryOptions: { value: BusinessCategory; label: string }[] = [
  { value: 'BARBER', label: 'Sartarosh' },
  { value: 'BEAUTY', label: "Go'zallik" },
  { value: 'MEDICAL', label: 'Tibbiyot' },
  { value: 'REPAIR', label: "Ta'mirlash" },
  { value: 'CONSULTING', label: 'Konsultatsiya' },
  { value: 'EDUCATION', label: "Ta'lim" },
  { value: 'FITNESS', label: 'Sport' },
  { value: 'AUTO', label: 'Avto xizmat' },
  { value: 'LEGAL', label: 'Yuridik xizmat' },
  { value: 'OTHER', label: 'Boshqa' },
];
const sortOptions: { value: typeof sortBy.value; label: string }[] = [
  { value: 'rating', label: 'Eng yuqori reyting' },
  { value: 'reviews', label: "Ko'p sharhlar" },
  { value: 'name', label: "Nomi bo'yicha" },
];

function categoryLabel(category?: BusinessCategory) {
  return categoryOptions.find((c) => c.value === category)?.label ?? 'Boshqa';
}

const hasActiveFilters = computed(() =>
  Boolean(searchQuery.value.trim() || categoryFilter.value || cityFilter.value)
);

function setCategory(category: BusinessCategory) {
  categoryFilter.value = categoryFilter.value === category ? '' : category;
  runSearch();
}

function clearFilters() {
  searchQuery.value = '';
  categoryFilter.value = '';
  cityFilter.value = '';
  runSearch();
}

function selectCity(city: string) {
  cityFilter.value = city;
  cityMenuOpen.value = false;
}

function selectSort(sort: typeof sortBy.value) {
  sortBy.value = sort;
  sortMenuOpen.value = false;
}

function dropdownItemClass(active: boolean) {
  return [
    'flex w-full items-center rounded-xl px-3 py-2 text-left text-sm font-semibold transition-colors',
    active
      ? 'bg-teal-600 text-white dark:bg-teal-500 dark:text-slate-950'
      : 'text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-700',
  ];
}

function runSearch() {
  if (page.value === 0) loadBusinesses();
  else page.value = 0;
}

async function loadBusinesses() {
  loading.value = true;
  error.value = '';
  try {
    const { data } = await businessesApi.getPublic({
      page: page.value,
      size: 12,
      q: searchQuery.value.trim() || undefined,
      city: cityFilter.value || undefined,
      category: categoryFilter.value || undefined,
      sort: sortParam.value,
    });
    totalPages.value = data.totalPages;
    cards.value = data.content;
  } catch (e) {
    error.value = apiErrorMessage(e, "Xizmat ko'rsatuvchilar ro'yxatini yuklab bo'lmadi");
  } finally {
    loading.value = false;
  }
}

async function loadCities() {
  try {
    const { data } = await businessesApi.getPublicCities();
    cities.value = data;
  } catch (e) {
    console.warn(apiErrorMessage(e, "Shaharlar ro'yxatini yuklab bo'lmadi"));
    cities.value = [];
  }
}

onMounted(() => {
  loadBusinesses();
  loadCities();
});
watch(page, loadBusinesses);
watch(cityFilter, runSearch);
watch(sortBy, runSearch);

const availableCities = computed(() => {
  return cities.value;
});

const filteredCards = computed(() => {
  return cards.value;
});

const sortParam = computed(() => {
  if (sortBy.value === 'rating') return 'rating,desc';
  if (sortBy.value === 'reviews') return 'reviews,desc';
  if (sortBy.value === 'name') return 'name,asc';
  return 'createdAt,desc';
});

const sortLabel = computed(() =>
  sortOptions.find((option) => option.value === sortBy.value)?.label ?? 'Tartiblash'
);

const BASE_URL = import.meta.env.VITE_BASE_API as string;

const getAvatarUrl = (url: string | undefined): string => {
  if (!url) return "";
  if (url.startsWith("https")) return url;
  return `${BASE_URL}${url}`;
};

</script>
