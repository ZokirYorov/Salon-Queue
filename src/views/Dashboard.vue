<template>
  <div class="min-h-screen bg-slate-50/50 dark:bg-slate-900 transition-colors">
    <AppHeader />

    <main class="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <div>
        <h1 class="text-2xl font-bold text-slate-900 dark:text-white">Salonlar</h1>
        <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">Navbat olish uchun salon tanlang</p>
      </div>

      <!-- Filters -->
      <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-4 space-y-3">
        <div class="flex flex-col sm:flex-row gap-3">
          <div class="relative flex-1">
            <span class="absolute inset-y-0 left-3 flex items-center text-slate-400">
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            </span>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Salon nomi yoki manzil bo'yicha qidirish..."
              class="w-full pl-9 pr-4 py-2.5 bg-slate-50 dark:bg-slate-700 dark:text-white border border-slate-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white dark:focus:bg-slate-700 text-sm transition"
            />
          </div>
          <select
            v-model="cityFilter"
            class="px-3 py-2.5 bg-slate-50 dark:bg-slate-700 dark:text-white border border-slate-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm cursor-pointer"
          >
            <option value="">Barcha shaharlar</option>
            <option v-for="c in availableCities" :key="c" :value="c">{{ c }}</option>
          </select>
          <select
            v-model="sortBy"
            class="px-3 py-2.5 bg-slate-50 dark:bg-slate-700 dark:text-white border border-slate-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm cursor-pointer"
          >
            <option value="rating">Eng yuqori reytingli</option>
            <option value="reviews">Ko'p sharhlar bo'yicha</option>
            <option value="name">Nomi bo'yicha (A-Z)</option>
          </select>
        </div>
      </div>

      <div v-if="loading" class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div v-for="i in 6" :key="i" class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden animate-pulse">
          <div class="h-40 bg-slate-100 dark:bg-slate-700" />
          <div class="p-5 space-y-2.5">
            <div class="h-4 bg-slate-100 dark:bg-slate-700 rounded w-2/3" />
            <div class="h-3 bg-slate-100 dark:bg-slate-700 rounded w-1/3" />
            <div class="h-3 bg-slate-100 dark:bg-slate-700 rounded w-full" />
          </div>
        </div>
      </div>
      <div v-else-if="error" class="text-center py-20 text-red-500">{{ error }}</div>
      <div v-else-if="filteredCards.length === 0" class="text-center py-20 bg-white dark:bg-slate-800 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
        <svg class="mx-auto h-10 w-10 text-slate-300 dark:text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        <p class="mt-3 text-sm font-bold text-slate-900 dark:text-white">Hech qanday salon topilmadi</p>
        <p class="mt-1 text-xs text-slate-400">Qidiruv parametrlarini o'zgartirib ko'ring</p>
      </div>

      <div v-else class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <RouterLink
          v-for="card in filteredCards"
          :key="card.business.id"
          :to="`/business/${card.business.id}`"
          class="group flex flex-col bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-500 transition duration-200 overflow-hidden"
        >
          <div class="relative h-40 w-full overflow-hidden bg-gradient-to-br from-indigo-500 to-cyan-400 flex-shrink-0">
            <img
              v-if="card.image"
              :src="mediaUrl(card.image)!"
              :alt="card.business.name"
              class="h-full w-full object-cover object-center transition duration-300 group-hover:scale-105"
            />
            <div v-else class="h-full w-full flex items-center justify-center text-white text-4xl font-black">
              {{ card.business.name.charAt(0).toUpperCase() }}
            </div>
            <div v-if="card.serviceCount > 0" class="absolute top-3 left-3">
              <span class="inline-flex items-center rounded-lg bg-slate-900/70 px-2 py-1 text-xs font-semibold text-white backdrop-blur-md">
                {{ card.serviceCount }} ta xizmat
              </span>
            </div>
          </div>

          <div class="p-5 flex-1 flex flex-col">
            <div class="flex items-start justify-between gap-2 mb-1">
              <h3 class="text-base font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-1">
                {{ card.business.name }}
              </h3>
              <div v-if="card.avgRating > 0" class="flex items-center gap-0.5 text-amber-500 font-bold text-sm shrink-0">
                <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.538 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.783.57-1.838-.197-1.538-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z"></path></svg>
                <span>{{ card.avgRating.toFixed(1) }}</span>
              </div>
            </div>
            <div class="text-xs text-slate-400 font-medium mb-3">{{ card.business.city }}</div>

            <div class="text-xs w-full text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mb-4 bg-slate-50 dark:bg-slate-700/50 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700">
              <svg class="w-4 h-4 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path></svg>
              <span class="truncate">{{ card.business.addressLine || card.business.city }}</span>
            </div>

            <div class="mt-auto pt-3 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
              <span class="text-slate-400 font-medium">
                {{ card.reviewCount > 0 ? `${card.reviewCount} ta sharh` : 'Hali sharh yo\'q' }}
              </span>
              <span class="text-sm font-bold text-indigo-600 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-500/20 group-hover:bg-indigo-600 group-hover:text-white dark:group-hover:bg-indigo-600 px-3 py-1.5 rounded-lg transition-colors duration-200">
                Navbat olish
              </span>
            </div>
          </div>
        </RouterLink>
      </div>

      <div v-if="totalPages > 1" class="flex justify-center gap-2 pt-4">
        <button
          v-for="p in totalPages"
          :key="p"
          @click="page = p - 1"
          class="w-8 h-8 rounded-lg text-xs font-semibold transition"
          :class="page === p - 1 ? 'bg-indigo-600 text-white' : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'"
        >
          {{ p }}
        </button>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { RouterLink } from 'vue-router';
import { businessesApi } from '@/api/businesses';
import { servicesApi } from '@/api/services';
import { reviewsApi } from '@/api/reviews';
import { mediaUrl } from '@/utils/media';
import AppHeader from '@/components/AppHeader.vue';
import type { Business } from '@/types/api';

interface BusinessCard {
  business: Business;
  image: string | null;
  avgRating: number;
  reviewCount: number;
  serviceCount: number;
}

const cards = ref<BusinessCard[]>([]);
const searchQuery = ref('');
const cityFilter = ref('');
const sortBy = ref<'rating' | 'reviews' | 'name'>('rating');
const loading = ref(false);
const error = ref('');
const page = ref(0);
const totalPages = ref(1);

async function loadBusinesses() {
  loading.value = true;
  error.value = '';
  try {
    const { data } = await businessesApi.getAll({ page: page.value, size: 12 });
    const list = data.content.filter((b) => b.accessAllowed);
    totalPages.value = data.totalPages;

    cards.value = await Promise.all(
      list.map(async (business): Promise<BusinessCard> => {
        const [svcRes, revRes] = await Promise.allSettled([
          servicesApi.getAll(business.id),
          reviewsApi.getAll({ businessId: business.id }),
        ]);
        const services = svcRes.status === 'fulfilled' ? svcRes.value.data.filter((s) => s.active) : [];
        const reviews = revRes.status === 'fulfilled' ? revRes.value.data : [];
        return {
          business,
          image: services.find((s) => s.imageUrl)?.imageUrl ?? null,
          avgRating: reviews.length ? reviews.reduce((sum, r) => sum + r.stars, 0) / reviews.length : 0,
          reviewCount: reviews.length,
          serviceCount: services.length,
        };
      })
    );
  } catch {
    error.value = 'Salonlar ro\'yxatini yuklab bo\'lmadi';
  } finally {
    loading.value = false;
  }
}

onMounted(loadBusinesses);
watch(page, loadBusinesses);

const availableCities = computed(() => {
  const cities = new Set(cards.value.map((c) => c.business.city).filter(Boolean));
  return [...cities].sort();
});

const filteredCards = computed(() => {
  const q = searchQuery.value.trim().toLowerCase();
  let result = cards.value.filter((c) => {
    const matchesSearch = !q || c.business.name.toLowerCase().includes(q) || c.business.addressLine?.toLowerCase().includes(q);
    const matchesCity = !cityFilter.value || c.business.city === cityFilter.value;
    return matchesSearch && matchesCity;
  });

  result = [...result].sort((a, b) => {
    if (sortBy.value === 'rating') return b.avgRating - a.avgRating;
    if (sortBy.value === 'reviews') return b.reviewCount - a.reviewCount;
    return a.business.name.localeCompare(b.business.name);
  });

  return result;
});
</script>
