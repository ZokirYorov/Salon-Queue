<template>
  <div class="min-h-screen bg-slate-50/50 dark:bg-slate-900 transition-colors">
    <AppHeader />

    <main class="max-w-6xl mx-auto px-4 sm:px-6 py-6" :class="selectedService ? 'pb-28' : 'pb-6'">
      <button
          type="button"
          @click="router.back()"
          class="text-gray-800 rounded-lg cursor-pointer dark:hover:bg-gray-800 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 border border-gray-200 px-2 py-1 mb-2"
      >
        <i class="fa-solid fa-arrow-left"></i>
        Orqaga
      </button>
      <p v-if="loadError" class="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded-md px-3 py-2 mb-6">{{ loadError }}</p>

      <!-- Business info -->
      <div v-if="!loadingServices && business" class="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden mb-5">
        <div class="h-40 bg-slate-950 relative">
          <img v-if="businessImage" :src="getAvatarUrl(businessImage)" :alt="business.name" class="absolute inset-0 w-full h-full object-cover opacity-80" />
          <div v-else class="absolute inset-0 bg-[linear-gradient(135deg,#0f766e,#f59e0b)]" />
          <div class="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-slate-950/10" />
          <div class="absolute left-4 right-4 bottom-4 flex flex-wrap items-end justify-between gap-3">
            <div class="min-w-0">
              <span class="inline-flex rounded-full bg-white/95 px-3 py-1 text-xs font-black text-slate-900 mb-2">{{ categoryLabel(business.category) }}</span>
              <h1 class="text-2xl sm:text-3xl font-black text-white truncate">{{ business.name }}</h1>
            </div>
            <span class="rounded-full px-3 py-1.5 text-xs font-black shadow-sm" :class="todayOpen ? 'bg-teal-500 text-white' : 'bg-amber-400 text-slate-950'">
              {{ todayOpen ? `Bugun ${todayHoursLabel}` : 'Bugun yopiq' }}
            </span>
          </div>
        </div>
        <div class="p-4">
        <div class="flex items-start justify-between gap-2">
          <div class="min-w-0">
            <h2 class="text-sm font-bold text-slate-900 dark:text-white">Tashkilot haqida</h2>
            <p class="text-xs text-slate-500 dark:text-slate-400 truncate">{{ business.addressLine || business.city }}</p>
          </div>
          <div v-if="businessReviewCount > 0" class="flex-shrink-0 flex items-center gap-1 bg-amber-50 dark:bg-amber-500/10 rounded-full px-2.5 py-1">
            <span class="text-amber-500 text-sm">⭐</span>
            <span class="text-xs font-bold text-slate-800 dark:text-white">{{ businessAvgRating.toFixed(1) }}</span>
            <span class="text-xs text-slate-500 dark:text-slate-400">({{ businessReviewCount }})</span>
          </div>
        </div>
        <p v-if="business.description" class="text-sm text-slate-600 dark:text-slate-300 mt-2 line-clamp-2">{{ business.description }}</p>
        <div class="mt-4 grid grid-cols-2 gap-3 text-gray-600 dark:text-slate-400 text-xs sm:grid-cols-4">
          <div class="border-l-2 border-teal-500 pl-3">
            <p class="font-semibold">Reyting</p>
            <p class="mt-1 font-black text-slate-900 dark:text-white">{{ businessReviewCount > 0 ? businessAvgRating.toFixed(1) : 'Yangi' }}</p>
          </div>
          <div class="border-l-2 border-amber-400 pl-3">
            <p class="font-semibold">Sharhlar</p>
            <p class="mt-1 font-black text-slate-900 dark:text-white">{{ businessReviewCount }} ta</p>
          </div>
          <div class="border-l-2 border-indigo-400 pl-3">
            <p class="font-semibold">Bugun</p>
            <p class="mt-1 font-black text-slate-900 dark:text-white">{{ todayOpen ? todayHoursLabel : 'Yopiq' }}</p>
          </div>
          <div class="border-l-2 border-slate-300 pl-3 dark:border-slate-600">
            <p class="font-semibold">Hudud</p>
            <p class="mt-1 truncate font-black text-slate-900 dark:text-white">{{ business.city || 'Kiritilmagan' }}</p>
          </div>
        </div>
        <div class="flex flex-wrap items-center gap-2 mt-4 text-xs">
          <a v-if="business.contactPhone" :href="`tel:${business.contactPhone}`" class="inline-flex items-center gap-1.5 rounded-full bg-teal-600 px-3 py-2 font-black text-white transition hover:bg-teal-700">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
            Qo'ng'iroq qilish
          </a>
          <a
            v-if="business.addressLine"
            :href="`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${business.addressLine}, ${business.city || ''}`)}`"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-1.5 rounded-full border border-slate-200 px-3 py-2 font-black text-slate-600 transition hover:border-indigo-400 hover:text-indigo-600 dark:border-slate-600 dark:text-slate-300 dark:hover:border-indigo-400 dark:hover:text-indigo-300"
          >
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>
            Yo'nalish
          </a>
          <span v-if="business.contactPhone" class="font-semibold text-slate-400">{{ business.contactPhone }}</span>
          <span class="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 font-medium">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <template v-if="todayHours && !todayHours.closed && todayHours.opensAt && todayHours.closesAt">
              Bugun {{ todayHours.opensAt.slice(0, 5) }}–{{ todayHours.closesAt.slice(0, 5) }}
            </template>
            <template v-else>Bugun yopiq</template>
          </span>
        </div>
      </div>
      </div>

      <!-- Reviews -->
      <div v-if="!loadingServices" class="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm p-4 sm:p-5 mb-4">
        <button
            type="button"
            @click="reviewsOpen = !reviewsOpen"
            class="w-full flex cursor-pointer items-center justify-between gap-3 text-left rounded-2xl bg-slate-50 px-4 py-3 transition hover:bg-slate-100 dark:bg-slate-900/30 dark:hover:bg-slate-900/50"
        >
          <div class="flex min-w-0 items-center gap-3">
            <span class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl bg-amber-50 text-amber-500 dark:bg-amber-500/10">★</span>
            <span class="min-w-0">
              <span class="block text-sm font-black text-slate-800 dark:text-white">Mijozlar sharhlari</span>
              <span class="block text-xs font-semibold text-slate-400">Oxirgi fikrlar va xizmat sifati</span>
            </span>
          </div>
          <div class="flex items-center gap-2">
            <div v-if="businessReviewCount > 0" class="flex items-center gap-1 rounded-full bg-white px-3 py-1.5 text-xs shadow-sm dark:bg-slate-800">
              <span class="text-amber-500">⭐</span>
              <span class="font-bold text-slate-800 dark:text-white">{{ businessAvgRating.toFixed(1) }}</span>
              <span class="text-slate-400">({{ businessReviewCount }} ta sharh)</span>
            </div>
            <svg class="w-4 h-4 text-slate-400 transition-transform" :class="{ 'rotate-180': reviewsOpen }" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
          </div>
        </button>

        <template v-if="reviewsOpen">
          <p v-if="loadingReviews" class="text-sm text-slate-400 mt-3">Yuklanmoqda...</p>
          <p v-else-if="businessReviews.length === 0" class="text-sm text-slate-400 mt-3">Hozircha sharhlar yo'q. Birinchi bo'lib fikr bildiring!</p>
          <div v-else class="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
          <div v-for="r in visibleBusinessReviews" :key="r.id" class="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 transition hover:border-teal-300 hover:bg-white dark:border-slate-700 dark:bg-slate-900/30 dark:hover:border-teal-500/50 dark:hover:bg-slate-900/50">
            <div class="flex items-start justify-between gap-3">
              <div class="flex min-w-0 items-center gap-2">
                <span class="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-teal-600 text-xs font-black text-white">{{ reviewInitial(r) }}</span>
                <div class="min-w-0">
                  <p class="truncate text-sm font-black text-slate-800 dark:text-white">{{ r.customerName || 'Mijoz' }}</p>
                  <p v-if="r.staffName" class="truncate text-xs font-semibold text-slate-400">Xodim: {{ r.staffName }}</p>
                </div>
              </div>
              <span class="text-amber-400 text-xs">{{ '★'.repeat(r.stars) }}{{ '☆'.repeat(5 - r.stars) }}</span>
            </div>
            <template v-if="r.comment">
              <p
                class="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300"
                :class="expandedReviewIds.has(r.id) ? '' : 'line-clamp-2'"
              >
                {{ r.comment }}
              </p>
              <button
                v-if="isLongReview(r.comment)"
                type="button"
                @click="toggleReviewExpanded(r.id)"
                class="mt-2 text-xs font-black text-teal-600 hover:underline dark:text-teal-300"
              >
                {{ expandedReviewIds.has(r.id) ? 'Kamroq ko\'rsatish' : 'Ko\'proq ko\'rsatish' }}
              </button>
            </template>
            <p class="mt-3 border-t border-slate-200 pt-3 text-[11px] font-semibold text-slate-400 dark:border-slate-700">{{ formatDate(r.createdAt) }}</p>
          </div>
          </div>
          <button
            v-if="businessReviews.length > visibleBusinessReviews.length"
            type="button"
            class="mt-4 cursor-pointer rounded-full border border-slate-200 px-4 py-2 text-xs font-black text-slate-600 transition hover:border-teal-400 hover:text-teal-700 dark:border-slate-600 dark:text-slate-300 dark:hover:border-teal-400 dark:hover:text-teal-300"
            @click="showAllReviews = true"
          >
            Yana {{ businessReviews.length - visibleBusinessReviews.length }} ta sharhni ko'rsatish
          </button>
        </template>
      </div>

      <!-- Loading skeleton -->
      <div v-if="loadingServices" class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-5 animate-pulse space-y-4">
        <div class="h-3.5 w-32 bg-slate-100 dark:bg-slate-700 rounded" />
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <div class="h-16 bg-slate-100 dark:bg-slate-700 rounded-xl" />
          <div class="h-16 bg-slate-100 dark:bg-slate-700 rounded-xl" />
        </div>
      </div>

      <div v-else class="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <div class="border-b border-slate-200 bg-slate-50 px-5 py-4 dark:border-slate-700 dark:bg-slate-800/70">
          <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 class="text-base font-black text-slate-900 dark:text-white">Navbat olish</h2>
              <p class="mt-0.5 text-xs font-semibold text-slate-400">{{ bookingProgressLabel }}</p>
            </div>
            <div class="flex flex-wrap gap-1.5">
              <span
                v-for="step in bookingSteps"
                :key="step.key"
                class="rounded-full px-3 py-1.5 text-xs font-black"
                :class="step.done ? 'bg-teal-600 text-white' : step.active ? 'bg-teal-50 text-teal-700 dark:bg-teal-500/10 dark:text-teal-300' : 'bg-white text-slate-400 dark:bg-slate-700 dark:text-slate-400'"
              >
                {{ step.label }}
              </span>
            </div>
          </div>
        </div>
        <!-- Step 1: service -->
        <div class="step-row">
          <div class="step-rail">
            <span class="step-num" :class="{ done: step1Done, active: !step1Done }">
              <svg v-if="step1Done" class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" /></svg>
              <template v-else>1</template>
            </span>
            <span class="step-line" />
          </div>
          <div class="step-body">
            <p class="text-sm font-bold text-slate-800 dark:text-white">Xizmatni tanlang</p>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3">
              <button
                v-for="svc in services"
                :key="svc.id"
                type="button"
                @click="selectService(svc)"
                class="flex items-center cursor-pointer gap-3 text-left border rounded-xl p-2.5 transition"
                :class="form.offeredServiceId === svc.id ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-500/10 hover:bg-indigo-100 dark:hover:bg-indigo-500/20' : 'border-slate-200 dark:border-slate-600 hover:border-indigo-300 hover:bg-slate-50 dark:hover:bg-slate-700/50'"
              >
                <div class="w-12 h-12 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-700 flex-shrink-0 flex items-center justify-center">
                  <img v-if="svc.imageUrl" :src="getAvatarUrl(svc.imageUrl)" :alt="svc.name" class="w-full h-full object-cover" />
                  <span v-else class="text-indigo-400 text-lg font-bold">{{ svc.name.charAt(0).toUpperCase() }}</span>
                </div>
                <div class="min-w-0">
                  <div class="text-sm font-semibold text-slate-900 dark:text-white truncate">{{ svc.name }}</div>
                  <div class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{{ svc.durationMinutes }} daqiqa · {{ formatPrice(svc.basePrice) }}</div>
                </div>
              </button>
            </div>
            <p v-if="!loadingServices && services.length === 0" class="text-sm text-slate-400 mt-2">Bu xizmat ko'rsatuvchida hali xizmatlar mavjud emas.</p>
            <p v-if="selectedService?.description" class="text-xs text-slate-500 dark:text-slate-400 mt-3 leading-relaxed">{{ selectedService.description }}</p>
          </div>
        </div>

        <!-- Step 2: date -->
        <div class="step-row" :class="{ 'step-locked': !step2Reachable }">
          <div class="step-rail">
            <span class="step-num" :class="{ done: step2Done, active: step2Reachable && !step2Done }">
              <svg v-if="step2Done" class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" /></svg>
              <template v-else>2</template>
            </span>
            <span class="step-line" />
          </div>
          <div class="step-body">
            <p class="text-sm font-bold text-slate-800 dark:text-white">Sana tanlang</p>
            <div class="flex flex-wrap items-center gap-2 mt-3">
              <button
                type="button"
                @click="form.date = todayIso()"
                :class="['px-3 py-1.5 cursor-pointer rounded-lg text-xs font-semibold border transition', form.date === todayIso() ? 'bg-indigo-600 text-white border-indigo-600 hover:bg-indigo-700' : 'border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:border-indigo-300 hover:bg-slate-50 dark:hover:bg-slate-700/50']"
              >
                Bugun
              </button>
              <button
                type="button"
                @click="form.date = tomorrowIso()"
                :class="['px-3 py-1.5 cursor-pointer rounded-lg text-xs font-semibold border transition', form.date === tomorrowIso() ? 'bg-indigo-600 text-white border-indigo-600 hover:bg-indigo-700' : 'border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:border-indigo-300 hover:bg-slate-50 dark:hover:bg-slate-700/50']"
              >
                Ertaga
              </button>
              <DatePicker v-model="form.date" :min="todayIso()" />
            </div>
          </div>
        </div>

        <!-- Step 3: staff -->
        <div class="step-row" :class="{ 'step-locked': !step3Reachable }">
          <div class="step-rail">
            <span class="step-num" :class="{ done: step3Done, active: step3Reachable && !step3Done }">
              <svg v-if="step3Done" class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" /></svg>
              <template v-else>3</template>
            </span>
            <span class="step-line" />
          </div>
          <div class="step-body">
            <p class="text-sm font-bold text-slate-800 dark:text-white">Xodimni tanlang</p>
            <div v-if="filteredStaff.length === 0" class="text-sm text-slate-400 mt-2">Bu xizmat uchun faol xodim topilmadi.</div>
            <div class="flex gap-3 mt-3 flex-wrap pb-1 -mx-1 px-1">
              <button
                v-for="s in filteredStaff"
                :key="s.id"
                type="button"
                @click="selectStaff(s.id)"
                class="flex flex-col cursor-pointer items-center gap-1.5 text-center border rounded-xl px-3 py-3 flex-shrink-0 w-28 transition"
                :class="form.staffId === s.id ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-500/10 hover:bg-indigo-100 dark:hover:bg-indigo-500/20' : 'border-slate-200 dark:border-slate-600 hover:border-indigo-300 hover:bg-slate-50 dark:hover:bg-slate-700/50'"
              >
                <span class="w-10 h-10 rounded-full bg-indigo-500 text-white text-sm font-bold flex items-center justify-center">
                  {{ firstInitial(s) }}
                </span>
                <span class="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate w-full">{{ personName(s) }}</span>
                <span v-if="staffRatings[s.id]" class="text-[11px] text-amber-500 font-semibold flex items-center gap-0.5">
                  ⭐ {{ staffRatings[s.id].toFixed(1) }}
                </span>
              </button>
            </div>
          </div>
        </div>

        <!-- Step 4: time -->
        <div class="step-row" :class="{ 'step-locked': !step4Reachable }">
          <div class="step-rail">
            <span class="step-num" :class="{ done: step4Done, active: step4Reachable && !step4Done }">
              <svg v-if="step4Done" class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" /></svg>
              <template v-else>4</template>
            </span>
            <span class="step-line" />
          </div>
          <div class="step-body">
            <div class="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p class="text-sm font-bold text-slate-800 dark:text-white">Vaqtni tanlang</p>
                <p v-if="dayHoursLabel" class="mt-1 text-xs font-semibold text-slate-400">
                  {{ dayHoursLabel }} · {{ availableStarts.length }} ta bo'sh vaqt
                </p>
              </div>
              <button
                v-if="unavailableStarts.length > 0"
                type="button"
                class="w-fit cursor-pointer rounded-full border border-slate-200 px-3 py-1.5 text-xs font-black text-slate-500 transition hover:border-teal-400 hover:text-teal-700 dark:border-slate-600 dark:text-slate-300 dark:hover:border-teal-400 dark:hover:text-teal-300"
                @click="showUnavailableSlots = !showUnavailableSlots"
              >
                {{ showUnavailableSlots ? 'Band vaqtlarni yashirish' : 'Band vaqtlarni ko\'rsatish' }}
              </button>
            </div>
            <p v-if="dayClosed" class="text-sm text-amber-600 dark:text-amber-400 mt-2">Bu kunda xizmat ko'rsatuvchi yopiq.</p>
            <p v-else-if="availableStarts.length === 0" class="text-sm text-slate-400 mt-2">Bu xodim uchun bo'sh vaqt topilmadi. Boshqa sana yoki xodimni tanlab ko'ring.</p>
            <div v-else class="grid grid-cols-4 sm:grid-cols-6 gap-2 mt-3">
              <button
                v-for="min in availableStarts"
                :key="min"
                type="button"
                @click="form.startMinutes = min"
                class="text-xs cursor-pointer font-semibold py-2 rounded-lg border transition"
                :class="[
                  form.startMinutes === min ? 'bg-indigo-600 text-white border-indigo-600 hover:bg-indigo-700' : '',
                  form.startMinutes !== min ? 'border-slate-200 dark:border-slate-600 hover:border-indigo-400 hover:bg-slate-50 dark:hover:bg-slate-700/50 text-slate-700 dark:text-slate-300' : ''
                ]"
              >
                {{ minutesToLabel(min) }}
              </button>
            </div>
            <div v-if="showUnavailableSlots && unavailableStarts.length > 0" class="mt-4">
              <p class="text-xs font-black uppercase tracking-wide text-slate-400">Band yoki o'tib ketgan vaqtlar</p>
              <div class="grid grid-cols-4 sm:grid-cols-6 gap-2 mt-2">
                <button
                  v-for="min in unavailableStarts"
                  :key="min"
                  type="button"
                  disabled
                  class="rounded-lg border border-slate-200 bg-slate-50 py-2 text-xs font-semibold text-slate-500 line-through decoration-2 opacity-70 dark:border-slate-500 dark:bg-slate-700 dark:text-slate-500"
                  :title="slotUnavailableReason(min)"
                >
                  {{ minutesToLabel(min) }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Step 5: note -->
        <div class="step-row last" :class="{ 'step-locked': !step5Reachable }">
          <div class="step-rail">
            <span class="step-num" :class="{ active: step5Reachable }">5</span>
          </div>
          <div class="step-body">
            <p class="text-sm font-bold text-slate-800 dark:text-white">Izoh <span class="font-normal text-slate-400">(ixtiyoriy)</span></p>
            <textarea v-model="form.customerNote" rows="2" class="w-full border border-slate-200 dark:border-slate-600 dark:bg-slate-700 font-bold text-slate-800 dark:text-white dark:placeholder-slate-400 rounded-lg px-3 py-2 text-sm mt-3" placeholder="Qo'shimcha izoh"></textarea>
            <p v-if="submitError" class="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded-md px-3 py-2 mt-3">{{ submitError }}</p>
          </div>
        </div>
      </div>
    </main>

    <!-- Sticky summary bar -->
    <div
      v-if="selectedService"
      class="fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 shadow-[0_-4px_16px_rgba(0,0,0,0.06)]"
    >
      <div class="max-w-3xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-4">
        <div class="min-w-0 flex-1">
          <p class="text-sm font-semibold text-slate-900 dark:text-white truncate">
            {{ selectedService.name }}
            <span v-if="selectedStaff" class="text-slate-400 font-normal">· {{ personName(selectedStaff) }}</span>
          </p>
          <p class="text-xs text-slate-500 dark:text-slate-400 truncate">
            <template v-if="form.startMinutes !== null">
              {{ formatDate(form.date) }}, {{ minutesToLabel(form.startMinutes) }} — {{ formatPrice(selectedService.basePrice) }}
            </template>
            <template v-else>
              Davom eting — xodim, sana va vaqtni tanlang
            </template>
          </p>
        </div>
        <button
            type="button"
            @click="openModal = true"
            class="flex-shrink-0 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 p-2.5 rounded-xl transition cursor-pointer"
        >
          Bekor qilish
        </button>
        <button
          type="button"
          :disabled="submitting || form.startMinutes === null"
          @click="submit"
          class="flex-shrink-0 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white text-sm font-semibold cursor-pointer px-5 py-2.5 rounded-xl transition"
          :class="{ 'disabled:opacity-40 cursor-not-allowed': submitting || form.startMinutes === null }"
        >
          {{ submitting ? 'Yuborilmoqda...' : authStore.user ? 'Navbat olish' : 'Tizimga kirish' }}
        </button>
      </div>
    </div>
  </div>
  <div
      v-if="openModal === true"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 transition-opacity w-full h-full"
      @click.self="openModal = false"
  >
    <div
        class=" bg-white dark:bg-gray-800 p-6 rounded-2xl flex flex-col justify-between gap-4 relative"
    >
      <button
          class="w-4 h-4 p-3.5 cursor-pointer hover:border-gray-300 dark:hover:border-gray-400 dark:border-gray-600 border text-lg border-gray-200 dark:text-gray-400 dark:hover:text-gray-200 text-gray-500 flex items-center justify-center absolute rounded-md top-2 right-2"
          @click="openModal = false"
      >
        <i class="fa-solid fa-xmark"></i>
      </button>
      <div class="flex flex-col items-center border-b border-slate-200 dark:border-slate-700 py-6">
        <p class="text-lg font-bold text-slate-600 dark:text-white">Tanlanganlarni bekor qilishni xohlaysizmi ?</p>
        <p class="text-blue-800 dark:text-blue-400 text-sm font-semibold">Unda qaytadan tanlashga harakat qilish mumkin !</p>
      </div>
      <div class="flex items-center gap-2 justify-center">
        <button class="text-red-600 bg-red-100 hover:bg-red-200 hover:text-red-700 cursor-pointer rounded-lg px-4 py-2 text-sm font-semibold" @click="openModal = false">Yo'q</button>
        <button
            class="bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer rounded-lg px-4 py-2 text-sm font-semibold"
            @click="formCleaned"
        >
          Ha, bekor
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed, watch, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { businessesApi } from '@/api/businesses';
import { servicesApi } from '@/api/services';
import { staffApi } from '@/api/staff';
import { businessHoursApi } from '@/api/businessHours';
import { bookingsApi } from '@/api/bookings';
import { reviewsApi } from '@/api/reviews';
import { useAuthStore } from '@/stores/auth';
import { useAuthModal } from '@/composables/useAuthModal';
import type { Business, OfferedService, StaffMember, BusinessHours, Booking, Review } from '@/types/api';
import { weekdayFromDate, toMinutes, todayIso, isStaffBusy, generatePossibleStarts, minutesToLabel, dateAndMinutesToIso } from '@/utils/scheduling';
import { formatPrice, formatDate } from '@/utils/format';
import { firstInitial, personName } from '@/utils/names';
import { apiErrorMessage } from '@/utils/apiError';
// import { mediaUrl } from '@/utils/media';
import DatePicker from '@/components/DatePicker.vue';
import AppHeader from '@/components/AppHeader.vue';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const authModal = useAuthModal();
const businessId = route.params.id as string;

const business = ref<Business | null>(null);
const services = ref<OfferedService[]>([]);
const staff = ref<StaffMember[]>([]);
const hours = ref<BusinessHours[]>([]);
const dayBookings = ref<Booking[]>([]);
const loadingServices = ref(false);
const loadError = ref('');
const submitting = ref(false);
const submitError = ref('');
const openModal = ref(false);
const showUnavailableSlots = ref(false);

const form = reactive({
  offeredServiceId: '',
  date: todayIso(),
  staffId: '',
  startMinutes: null as number | null,
  customerNote: '',
});

const formCleaned = () => {
  form.offeredServiceId = '';
  form.staffId = '';
  form.startMinutes = null;
  form.customerNote = '';
}



function tomorrowIso(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

const selectedService = computed(() => services.value.find((s) => s.id === form.offeredServiceId) || null);
const selectedStaff = computed(() => staff.value.find((s) => s.id === form.staffId) || null);
const filteredStaff = computed(() => {
  if (!form.offeredServiceId) return staff.value;
  return staff.value.filter((s) => s.serviceIds?.includes(form.offeredServiceId));
});
const staffRatings = ref<Record<string, number>>({});
const businessAvgRating = ref(0);
const businessReviewCount = ref(0);
const businessReviews = ref<Review[]>([]);
const reviewsOpen = ref(true);
const showAllReviews = ref(false);
const expandedReviewIds = ref<Set<string>>(new Set());
const visibleBusinessReviews = computed(() => showAllReviews.value ? businessReviews.value : businessReviews.value.slice(0, 3));

const categoryOptions: { value: Business['category']; label: string }[] = [
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

function categoryLabel(category?: Business['category']) {
  return categoryOptions.find((item) => item.value === category)?.label ?? 'Boshqa';
}

function toggleReviewExpanded(id: string) {
  if (expandedReviewIds.value.has(id)) {
    expandedReviewIds.value.delete(id);
  } else {
    expandedReviewIds.value.add(id);
  }
  expandedReviewIds.value = new Set(expandedReviewIds.value);
}

function reviewInitial(review: Review) {
  return (review.customerName || 'Mijoz').trim().charAt(0).toUpperCase();
}

function isLongReview(comment?: string | null) {
  if (!comment) return false;
  return comment.trim().length > 90 || comment.includes('\n');
}

const loadingReviews = ref(false);

const step1Done = computed(() => !!selectedService.value);
const step2Reachable = computed(() => step1Done.value);
const step2Done = computed(() => step2Reachable.value && !!form.date);
const step3Reachable = computed(() => step2Done.value);
const step3Done = computed(() => step3Reachable.value && !!form.staffId);
const step4Reachable = computed(() => step3Done.value);
const step4Done = computed(() => step4Reachable.value && form.startMinutes !== null);
const step5Reachable = computed(() => step4Done.value);

const todayHours = computed(() => hours.value.find((h) => h.weekday === weekdayFromDate(todayIso())));
const dayHours = computed(() => hours.value.find((h) => h.weekday === weekdayFromDate(form.date)));
const dayClosed = computed(() => !dayHours.value || dayHours.value.closed || !dayHours.value.opensAt || !dayHours.value.closesAt);
const dayHoursLabel = computed(() =>
  !dayClosed.value && dayHours.value?.opensAt && dayHours.value?.closesAt
    ? `${dayHours.value.opensAt.slice(0, 5)}-${dayHours.value.closesAt.slice(0, 5)}`
    : ''
);
const todayOpen = computed(() => !!todayHours.value && !todayHours.value.closed && !!todayHours.value.opensAt && !!todayHours.value.closesAt);
const todayHoursLabel = computed(() =>
  todayOpen.value && todayHours.value?.opensAt && todayHours.value?.closesAt
    ? `${todayHours.value.opensAt.slice(0, 5)}-${todayHours.value.closesAt.slice(0, 5)}`
    : ''
);
const businessImage = computed(() => services.value.find((service) => service.imageUrl)?.imageUrl ?? null);
const bookingSteps = computed(() => [
  { key: 'service', label: 'Xizmat', done: step1Done.value, active: !step1Done.value },
  { key: 'date', label: 'Sana', done: step2Done.value, active: step2Reachable.value && !step2Done.value },
  { key: 'staff', label: 'Xodim', done: step3Done.value, active: step3Reachable.value && !step3Done.value },
  { key: 'time', label: 'Vaqt', done: step4Done.value, active: step4Reachable.value && !step4Done.value },
]);
const bookingProgressLabel = computed(() => {
  if (!step1Done.value) return 'Avval xizmatni tanlang';
  if (!step2Done.value) return 'Keyin sana tanlang';
  if (!step3Done.value) return 'Keyin ustani tanlang';
  if (!step4Done.value) return 'Endi bo\'sh vaqtni tanlang';
  return 'Navbatni tasdiqlashga tayyor';
});

const possibleStarts = computed(() => {
  if (dayClosed.value || !selectedService.value || !dayHours.value?.opensAt || !dayHours.value?.closesAt) return [];
  return generatePossibleStarts(
    toMinutes(dayHours.value.opensAt),
    toMinutes(dayHours.value.closesAt),
    selectedService.value.durationMinutes,
    15
  );
});
const availableStarts = computed(() => possibleStarts.value.filter((min) => !isSlotDisabled(min)));
const unavailableStarts = computed(() => possibleStarts.value.filter((min) => isSlotDisabled(min)));

function isSlotBusy(min: number): boolean {
  if (!form.staffId || !selectedService.value) return false;
  return isStaffBusy(dayBookings.value, form.staffId, min, min + selectedService.value.durationMinutes);
}

function isSlotPast(min: number): boolean {
  if (form.date !== todayIso()) return false;
  const now = new Date();
  return min <= now.getHours() * 60 + now.getMinutes();
}

function isSlotDisabled(min: number): boolean {
  return isSlotBusy(min) || isSlotPast(min);
}

function slotUnavailableReason(min: number): string {
  if (isSlotPast(min)) return "Bu vaqt o'tib ketgan";
  if (isSlotBusy(min)) return 'Bu vaqt band';
  return "Tanlab bo'lmaydi";
}

async function loadStatic() {
  loadError.value = '';
  try {
    const [bizRes, svcRes, staffRes, hoursRes] = await Promise.all([
      businessesApi.getById(businessId),
      servicesApi.getAll(businessId),
      staffApi.getAll(businessId),
      businessHoursApi.getAll(businessId),
    ]);
    business.value = bizRes.data;
    services.value = svcRes.data.filter((s) => s.active);
    staff.value = staffRes.data.filter((s) => s.active);
    hours.value = hoursRes.data;
    await loadStaffRatings();
    await loadBusinessRating();
  } catch (e) {
    loadError.value = apiErrorMessage(e, "Xizmat ko'rsatuvchi ma'lumotlarini yuklab bo'lmadi");
  } finally {
    loadingServices.value = false;
  }
}

async function loadBusinessRating() {
  loadingReviews.value = true;
  try {
    const { data } = await reviewsApi.getAll({ businessId });
    businessReviewCount.value = data.length;
    businessAvgRating.value = data.length ? data.reduce((sum, r) => sum + r.stars, 0) / data.length : 0;
    businessReviews.value = [...data].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  } catch {
    // reyting yuklanmasa jim o'tkazamiz
  } finally {
    loadingReviews.value = false;
  }
}

async function loadStaffRatings() {
  await Promise.all(
    staff.value.map(async (s) => {
      try {
        const { data } = await reviewsApi.getAll({ staffId: s.id });
        if (data.length > 0) {
          staffRatings.value[s.id] = data.reduce((sum, r) => sum + r.stars, 0) / data.length;
        }
      } catch {
        // reyting yuklanmasa jim o'tkazamiz
      }
    })
  );
}

async function loadDayBookings() {
  if (!form.date) return;
  try {
    const { data } = await bookingsApi.availability({ businessId, date: form.date });
    dayBookings.value = data.map((booking) => ({
      ...booking,
      customerId: null,
      guestName: null,
      guestPhone: null,
      businessId,
      offeredServiceId: '',
      customerNote: '',
      createdAt: booking.startAt,
      updatedAt: booking.endAt,
    }));
  } catch {
    dayBookings.value = [];
  }
}

onMounted(() => {
  loadingServices.value = true;
  loadStatic();
  loadDayBookings();
});

watch(() => form.date, () => {
  form.startMinutes = null;
  showUnavailableSlots.value = false;
  loadDayBookings();
});

watch(() => form.offeredServiceId, () => {
  if (form.staffId && !filteredStaff.value.some((s) => s.id === form.staffId)) {
    form.staffId = '';
  }
  showUnavailableSlots.value = false;
});

watch(() => form.staffId, () => {
  showUnavailableSlots.value = false;
});

watch(availableStarts, () => {
  if (form.startMinutes !== null && !availableStarts.value.includes(form.startMinutes)) {
    form.startMinutes = null;
  }
});

// Login/registerdan keyin band vaqtlarni yangilab olamiz.
watch(() => authStore.user, (user) => {
  if (user) loadDayBookings();
});

function selectService(svc: OfferedService) {
  form.offeredServiceId = svc.id;
  form.staffId = '';
  form.startMinutes = null;
}

const BASE_URL = import.meta.env.VITE_BASE_API as string;

const getAvatarUrl = (url: string | undefined): string => {
  if (!url) return "";
  if (url.startsWith("https")) return url;
  return `${BASE_URL}${url}`;
};

function selectStaff(id: string) {
  form.staffId = id;
  form.startMinutes = null;
}

async function submit() {
  if (!selectedService.value || form.startMinutes === null) return;
  if (!authStore.user) {
    authModal.open({ mode: 'login', onSuccess: submit });
    return;
  }
  submitting.value = true;
  submitError.value = '';
  try {
    // Yuborishdan oldin eng so'nggi bandlikni qayta tekshiramiz.
    await loadDayBookings();
    if (isSlotDisabled(form.startMinutes)) {
      submitError.value = "Bu vaqt endi band. Iltimos, boshqa vaqt tanlang.";
      form.startMinutes = null;
      submitting.value = false;
      return;
    }
    const startAt = dateAndMinutesToIso(form.date, form.startMinutes);
    const endAt = dateAndMinutesToIso(form.date, form.startMinutes + selectedService.value.durationMinutes);
    await bookingsApi.create({
      customerId: authStore.user.userId,
      businessId,
      offeredServiceId: form.offeredServiceId,
      staffId: form.staffId,
      startAt,
      endAt,
      customerNote: form.customerNote.trim() || undefined,
    });
    await router.push('/client/my');
  } catch (e: any) {
    submitError.value = apiErrorMessage(e, 'Navbat olishda xatolik yuz berdi');
  } finally {
    submitting.value = false;
  }
}
</script>

<style scoped>
.step-row {
  display: flex;
  gap: 14px;
  padding: 20px 20px 4px;
  transition: opacity 0.2s;
}
.step-row.last {
  padding-bottom: 20px;
}
.step-row.step-locked {
  opacity: 0.45;
  pointer-events: none;
}
.step-rail {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
}
.step-num {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: transparent;
  border: 2px solid #cbd5e1;
  color: #94a3b8;
  font-size: 12px;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: background-color 0.2s, color 0.2s, border-color 0.2s;
}
:global(.dark) .step-num {
  border-color: #475569;
  color: #64748b;
}
.step-num.active {
  border-color: #0d9488;
  color: #0d9488;
}
:global(.dark) .step-num.active {
  border-color: #2dd4bf;
  color: #2dd4bf;
}
.step-num.done {
  background: #0d9488;
  border-color: #0d9488;
  color: #fff;
}
.step-line {
  width: 2px;
  flex: 1;
  background: #e2e8f0;
  margin-top: 4px;
  border-radius: 1px;
}
:global(.dark) .step-line {
  background: #334155;
}
.step-body {
  flex: 1;
  min-width: 0;
  padding-bottom: 16px;
}
.step-title {
  font-size: 14px;
  font-weight: 700;
  color: #1e293b;
}
:global(.dark) .step-title {
  color: #f1f5f9;
}
</style>
