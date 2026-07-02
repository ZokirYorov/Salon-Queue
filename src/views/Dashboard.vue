<template>
  <div class="min-h-screen bg-slate-50/50 font-sans text-slate-800 antialiased flex flex-col lg:flex-row">

    <!-- Mobile Menu Overlay -->
    <div v-if="isMobileMenuOpen" class="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm lg:hidden" @click="toggleMobileMenu"></div>

    <!-- LEFT SIDEBAR (SaaS Navigation) -->
<!--    <aside class="w-64 bg-slate-900 text-slate-400 hidden lg:flex flex-col border-r border-slate-800 shrink-0">-->
<!--      &lt;!&ndash; Brand/Logo Area &ndash;&gt;-->
<!--      <div class="h-20 flex items-center px-6 border-b border-slate-800">-->
<!--        <div class="flex items-center space-x-2.5">-->
<!--          <div class="flex items-end space-x-1 h-5 w-5">-->
<!--            <span class="w-1 h-2.5 bg-indigo-400 rounded-full"></span>-->
<!--            <span class="w-1 h-4 bg-indigo-500 rounded-full"></span>-->
<!--            <span class="w-1 h-5 bg-cyan-400 rounded-full"></span>-->
<!--          </div>-->
<!--          <span class="text-xl font-black tracking-tight text-white">-->
<!--            ORDO<span class="text-cyan-400 font-light">SaaS</span>-->
<!--          </span>-->
<!--        </div>-->
<!--      </div>-->
<!--      &lt;!&ndash; Navigation Links &ndash;&gt;-->
<!--      <nav class="flex-1 p-4 space-y-1.5">-->
<!--        <RouterLink to="/" class="flex items-center space-x-3 bg-indigo-600/10 text-indigo-400 px-4 py-2.5 rounded-xl text-sm font-semibold border border-indigo-500/10">-->
<!--          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z"></path></svg>-->
<!--          <span>Salonlar Monitoringi</span>-->
<!--        </RouterLink>-->
<!--        <a href="#" class="flex items-center space-x-3 hover:bg-slate-800/60 hover:text-slate-200 px-4 py-2.5 rounded-xl text-sm font-medium transition">-->
<!--          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>-->
<!--          <span>Jonli Navbatlar</span>-->
<!--        </a>-->
<!--        <a href="#" class="flex items-center space-x-3 hover:bg-slate-800/60 hover:text-slate-200 px-4 py-2.5 rounded-xl text-sm font-medium transition">-->
<!--          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2z"></path></svg>-->
<!--          <span>Statistika</span>-->
<!--        </a>-->
<!--        <RouterLink to="/create-salon" class="flex items-center space-x-3 hover:bg-slate-800/60 hover:text-slate-200 px-4 py-2.5 rounded-xl text-sm font-medium transition">-->
<!--          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>-->
<!--          <span>Yangi salon yaratish</span>-->
<!--        </RouterLink>-->
<!--        <RouterLink to="/admin/manage" class="flex items-center space-x-3 hover:bg-slate-800/60 hover:text-slate-200 px-4 py-2.5 rounded-xl text-sm font-medium transition">-->
<!--          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>-->
<!--          <span>Admin Boshqaruvi</span>-->
<!--        </RouterLink>-->
<!--      </nav>-->
<!--      &lt;!&ndash; Sidebar Footer &ndash;&gt;-->
<!--      <div class="p-4 border-t border-slate-800 text-xs flex items-center justify-between">-->
<!--        <span>Tizim holati: <span class="text-emerald-400 font-bold">● Online</span></span>-->
<!--        <span class="text-slate-600">v2.5</span>-->
<!--      </div>-->
<!--    </aside>-->
    <!-- RIGHT MAIN CONTENT WRAPPER -->
    <div class="flex-1 flex flex-col min-w-0 overflow-y-auto h-screen">
      <header class="h-20 bg-white border-b border-slate-200/80 px-4 sm:px-8 flex items-center justify-between shrink-0">
        <button @click="emit('toggle-sidebar')" class="lg:hidden p-2 -ml-2 rounded-md text-slate-500 hover:text-slate-900 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
          <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
        </button>
        <div></div>
        <div class="flex items-center space-x-4">
          <button @click="handleAuth('login')" class="text-sm border border-gray-400 py-2 px-3 hover:border-indigo-600 rounded-2xl cursor-pointer font-semibold text-slate-600 transition hover:text-indigo-600">
            Kirish
          </button>
          <button @click="handleAuth('register')" class="rounded-full cursor-pointer bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-200 transition hover:bg-indigo-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
            Ro'yxatdan o'tish
          </button>
          <router-link to="/profile"
                       class="flex px-2 py-1 gap-1 rounded-2xl cursor-pointer border border-blue-200 hover:bg-blue-200 bg-blue-100"
          >
            <div class=" sm:flex flex-col text-right">
              <span class="text-sm font-semibold text-slate-900">Administrator</span>
              <span class="text-xs text-slate-400">Premium Akkaunt</span>
            </div>
            <div class="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-cyan-400 flex items-center justify-center text-white font-bold shadow-sm">
              A
            </div>
          </router-link>
        </div>
      </header>
      <main class="flex-1 p-4 sm:p-8 space-y-8">
        <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div class="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm flex items-center justify-between">
            <div>
              <span class="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Umumiy Salonlar</span>
              <span class="text-2xl font-black text-slate-900 mt-1 block">{{ allSalons.length }} ta</span>
            </div>
            <div class="p-3 rounded-xl bg-indigo-50 text-indigo-600"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg></div>
          </div>
          <div class="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm flex items-center justify-between">
            <div>
              <span class="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Navbatdagi Mijozlar</span>
              <span class="text-2xl font-black text-slate-900 mt-1 block">
                {{ allSalons.reduce((acc, s) => acc + s.currentQueue, 0) }} nafar
              </span>
            </div>
            <div class="p-3 rounded-xl bg-amber-50 text-amber-600"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg></div>
          </div>
          <div class="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm flex items-center justify-between">
            <div>
              <span class="text-xs font-semibold text-slate-400 uppercase tracking-wider block">O'rtacha Reyting</span>
              <span class="text-2xl font-black text-slate-900 mt-1 block">4.7 / 5.0</span>
            </div>
            <div class="p-3 rounded-xl bg-emerald-50 text-emerald-600"><svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.538 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.783.57-1.838-.197-1.538-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z"></path></svg></div>
          </div>
          <div class="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm flex items-center justify-between">
            <div>
              <span class="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Jami Sharhlar</span>
              <span class="text-2xl font-black text-slate-900 mt-1 block">
                {{ allSalons.reduce((acc, s) => acc + s.reviews, 0) }} ta
              </span>
            </div>
            <div class="p-3 rounded-xl bg-cyan-50 text-cyan-600">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
              </svg>
            </div>
          </div>
        </section>
        <section class="bg-white rounded-2xl border border-slate-200/60 p-5 shadow-sm space-y-4">
          <div class="flex flex-col lg:flex-row gap-4 items-end lg:items-center justify-between">
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 flex-1 w-full">
              <div class="flex items-center space-x-4 flex-1 max-w-md lg:ml-0">
                <div class="relative w-full">
            <span class="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <svg class="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            </span>
                  <input
                      v-model="searchQuery"
                      type="text"
                      placeholder="Global qidiruv (Salon nomi yoki manzil)..."
                      class="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-sm transition"
                  />
                </div>
              </div>
              <div>
                <select
                    v-model="selectedRegion"
                    @change="selectedDistrict = ''"
                    class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm cursor-pointer"
                >
                  <option value="">Barcha viloyatlar</option>
                  <option v-for="region in regions" :key="region" :value="region">{{ region }}</option>
                </select>
              </div>
              <div>
                <select
                    v-model="selectedDistrict"
                    :disabled="!selectedRegion"
                    class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="">Barcha tumanlar</option>
                  <option v-for="district in availableDistricts" :key="district" :value="district">{{ district }}</option>
                </select>
              </div>
              <div>
                <select
                    v-model="sortBy"
                    class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm cursor-pointer"
                >
                  <option value="rating">Eng yuqori reytingli</option>
                  <option value="queue">Navbat kamligi bo'yicha</option>
                  <option value="reviews">Ko'p sharhlar bo'yicha</option>
                </select>
              </div>
            </div>
          </div>
          <div class="flex justify-between items-center gap-1.5 pt-2 border-t border-slate-100">
            <div class="w-full gap-2 flex items-center">
              <button
                  v-for="cat in categories"
                  :key="cat.slug"
                  @click="selectedCategory = cat.slug"
                  :class="[
                'px-3.5 py-1.5 rounded-xl cursor-pointer text-xs font-semibold transition border',
                selectedCategory === cat.slug
                  ? 'bg-slate-900 border-slate-900 text-white shadow-sm'
                  : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'
              ]"
              >
                {{ cat.name }}
              </button>
            </div>
            <div class="font-semibold text-gray-800 bg-slate-100 px-3 py-2 rounded-xl shrink-0">
              Topilgan natijalar: <span class="text-indigo-600 font-bold">{{ filteredSalons.length }} ta</span>
            </div>
          </div>
        </section>
        <section>
          <div v-if="filteredSalons.length > 0" class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <div
                v-for="salon in filteredSalons"
                :key="salon.id"
                :class="[
                'group relative flex flex-col bg-white border rounded-2xl shadow-sm hover:shadow-md transition duration-200 overflow-hidden',
                selectedSalonId === salon.id ? 'ring-2 ring-indigo-500 border-transparent' : 'border-slate-200/70'
              ]"
            >
              <div class="relative h-40 w-full overflow-hidden bg-slate-100 border-b border-slate-100">
                <img :src="salon.imageUrl" :alt="salon.name" class="h-full w-full object-cover object-center transition duration-300 group-hover:scale-102" />
                <div class="absolute top-3 left-3 right-3 flex justify-between items-start pointer-events-none">
                  <span class="inline-flex items-center rounded-lg bg-slate-900/70 px-2 py-1 text-xs font-semibold text-white backdrop-blur-md">
                    {{ getCategoryName(salon.category) }}
                  </span>
                  <span
                      :class="[
                      'inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-bold text-white shadow-sm backdrop-blur-md',
                      salon.currentQueue === 0 ? 'bg-emerald-600/90' : 'bg-amber-600/90'
                    ]"
                  >
                    <span class="h-1.5 w-1.5 rounded-full bg-white animate-pulse"></span>
                    {{ salon.currentQueue === 0 ? 'Navbat bo\'sh' : `${salon.currentQueue} ta faol` }}
                  </span>
                </div>
              </div>
              <div class="p-5 flex-1 flex flex-col">
                <div class="flex items-start justify-between gap-2 mb-1">
                  <h3 class="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
                    {{ salon.name }}
                  </h3>
                  <div class="flex items-center space-x-0.5 text-amber-500 font-bold text-sm shrink-0">
                    <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.538 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.783.57-1.838-.197-1.538-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z"></path></svg>
                    <span>{{ salon.rating }}</span>
                  </div>
                </div>
                <div class="text-xs text-slate-400 font-medium mb-3">
                  {{ salon.region }} • {{ salon.district }}
                </div>
                <div class="flex items-center gap-2">
                  <div class="text-xs w-full text-slate-500 flex items-center gap-1.5 mb-4 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <svg class="w-4 h-4 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path></svg>
                    <span class="truncate">{{ salon.address }}</span>
                  </div>
                  <div class="flex gap-2 mb-4 w-full">
                    <!--                  <button @click.stop="viewOnMap(salon.address)" class="flex-1 inline-flex items-center justify-center px-3 py-2 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50 transition">-->
                    <!--                    <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.553-.894L9 7m0 13l6-3m-6 3V7m6 10l4.447 2.223A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m-6 13V7m0 0L4 7m6 0L9 4m0 0l-1.5-1.5"></path></svg>-->
                    <!--                    Xaritada ko'rish-->
                    <!--                  </button>-->
                    <button @click.stop="getDirections(salon.address)" class="flex-1 cursor-pointer inline-flex items-center justify-center px-3 py-2 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50 transition">
                      <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                      Xaritada ko'rish
                    </button>
                  </div>
                </div>
                <div class="mt-auto pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span class="text-slate-400 font-medium"
                  >
                    {{ salon.reviews }} ta sharh
                  </span>
                  <button @click.stop="selectSalon(salon)" class="text-sm cursor-pointer font-bold text-indigo-600 bg-indigo-50 group-hover:bg-indigo-600 group-hover:text-white px-3 py-1.5 rounded-lg transition-colors duration-200">
                    Navbat olish
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div v-else class="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-200">
            <svg class="mx-auto h-10 w-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            <h3 class="mt-4 text-sm font-bold text-slate-900">Ushbu filtrlarga mos ma'lumot topilmadi</h3>
            <p class="mt-1 text-xs text-slate-400 max-w-xs mx-auto">Hech qanday salon topilmadi. Qidiruv parametringizni o'zgartirib ko'ring yoki filtrlarni tozalang.</p>
            <button @click="resetFilters" class="mt-4 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition">
              Filtrlarni boshlang'ich holatga qaytarish
            </button>
          </div>
        </section>
      </main>
    </div>
    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div class="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl border border-slate-100 transform transition-all">
        <div class="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mb-4">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path></svg>
        </div>
        <h3 class="text-lg font-bold text-slate-900 mb-1.5">Salon tanlandi!</h3>
        <p class="text-slate-500 text-xs mb-5 leading-relaxed">
          Tizimda <span class="font-bold text-slate-800">"{{ activeSalonName }}"</span> maskani tanlandi. Navbat hisoblagichlarini ko'rish yoki band qilish uchun hisobingizga kiring.
        </p>
        <div class="grid grid-cols-2 gap-2.5">
          <button @click="confirmAuth('login')" class="bg-indigo-600 text-white text-xs font-bold py-2.5 px-4 rounded-xl hover:bg-indigo-700 transition">
            Kirish
          </button>
          <button @click="confirmAuth('register')" class="bg-slate-100 text-slate-700 text-xs font-bold py-2.5 px-4 rounded-xl hover:bg-slate-200 transition">
            Ro'yxatdan o'tish
          </button>
        </div>
        <button @click="showModal = false" class="w-full mt-3 text-center text-xs text-slate-400 hover:text-slate-600 transition">
          Yopish
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import image from '@/assets/salonimg.jpg'
import barber from '@/assets/barber.avif'
import barber1 from '@/assets/barber.jpg'
import barber2 from '@/assets/barber2.png'

const emit = defineEmits(['toggle-sidebar'])

interface Salon {
  id: number;
  name: string;
  region: string;
  district: string;
  address: string;
  category: string;
  rating: number;
  reviews: number;
  imageUrl: string;
  currentQueue: number;
}

const router = useRouter();
const selectedSalonId = ref<number | null>(null);
const searchQuery = ref('');
const showModal = ref(false);
const activeSalonName = ref('');
const selectedRegion = ref('');
const selectedDistrict = ref('');
const selectedCategory = ref('all');
const sortBy = ref('rating');

const regions = ['Toshkent sh.', 'Samarqand', 'Buxoro', 'Farg`ona'];
const districtsMap: Record<string, string[]> = {
  'Toshkent sh.': ['Yunusobod t.', 'Mirzo Ulug`bek t.', 'Chilonzor t.', 'Yakkasaroy t.'],
  'Samarqand': ['Samarqand sh.', 'Pastdarg`om t.', 'Kattaqo`rg`on sh.'],
  'Buxoro': ['Buxoro sh.', 'Gʻijduvon t.', 'Kogon sh.'],
  'Farg`ona': ['Farg`ona sh.', 'Margʻilon sh.', 'Qoʻqon sh.']
};

const categories = [
  { name: 'Barchasi', slug: 'all' },
  { name: 'Barber Shop', slug: 'barber' },
  { name: 'Ayollar saloni', slug: 'beauty-female' },
  { name: 'Manikyur / Kosmetologiya', slug: 'nails-spa' },
  { name: 'Logistika', slug: 'Tranzit' },
];

const allSalons = ref<Salon[]>([]);

const defaultSalons: Salon[] = [
  { id: 1, name: 'Go`zallik Saloni', region: 'Toshkent sh.', district: 'Yunusobod t.', address: 'Amir Temur ko`chasi 15', category: 'beauty-female', rating: 4.8, reviews: 120, currentQueue: 3, imageUrl: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=2070' },
  { id: 2, name: 'Barber shop', region: 'Samarqand', district: 'Samarqand sh.', address: 'Registon ko`chasi 7', category: 'barber', rating: 4.5, reviews: 85, currentQueue: 0, imageUrl: barber2 },
  { id: 3, name: 'Sartarosh xona', region: 'Buxoro', district: 'Buxoro sh.', address: 'Naqshband ko`chasi 22', category: 'nails-spa', rating: 4.9, reviews: 150, currentQueue: 5, imageUrl: barber },
  { id: 4, name: 'Premium Go`zallik Markazi', region: 'Farg`ona', district: 'Farg`ona sh.', address: 'Mustaqillik ko`chasi 10', category: 'beauty-female', rating: 4.7, reviews: 95, currentQueue: 2, imageUrl: image },
  { id: 5, name: 'Yunusobod Barbershop', region: 'Toshkent sh.', district: 'Yunusobod t.', address: 'Megalife binosi', category: 'barber', rating: 4.6, reviews: 210, currentQueue: 1, imageUrl: barber1 }
];

const loadSalons = () => {
  const storedSalons = localStorage.getItem('salons');
  if (storedSalons) {
    allSalons.value = JSON.parse(storedSalons);
  } else {
    allSalons.value = defaultSalons;
    localStorage.setItem('salons', JSON.stringify(defaultSalons));
  }
};

onMounted(() => {
  loadSalons();
});

const availableDistricts = computed(() => {
  return selectedRegion.value ? districtsMap[selectedRegion.value] : [];
});

const getCategoryName = (slug: string) => {
  return categories.find(c => c.slug === slug)?.name || slug;
};

const filteredSalons = computed(() => {
  let result = allSalons.value.filter(salon => {
    const matchesSearch = searchQuery.value === '' || salon.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        salon.address.toLowerCase().includes(searchQuery.value.toLowerCase());
    const matchesRegion = selectedRegion.value === '' || salon.region === selectedRegion.value;
    const matchesDistrict = selectedDistrict.value === '' || salon.district === selectedDistrict.value;
    const matchesCategory = selectedCategory.value === 'all' || salon.category === selectedCategory.value;

    return matchesSearch && matchesRegion && matchesDistrict && matchesCategory;
  });

  if (sortBy.value === 'rating') {
    result.sort((a, b) => b.rating - a.rating);
  } else if (sortBy.value === 'queue') {
    result.sort((a, b) => a.currentQueue - b.currentQueue);
  } else if (sortBy.value === 'reviews') {
    result.sort((a, b) => b.reviews - a.reviews);
  }

  return result;
});

const selectSalon = (salon: Salon) => {
  selectedSalonId.value = salon.id;
  activeSalonName.value = salon.name;
  localStorage.setItem('selectedSalonId', salon.id.toString());
  showModal.value = true;
};

const resetFilters = () => {
  searchQuery.value = '';
  selectedRegion.value = '';
  selectedDistrict.value = '';
  selectedCategory.value = 'all';
  sortBy.value = 'rating';
};

const confirmAuth = (type: 'login' | 'register') => {
  showModal.value = false;
  router.push(`/${type}`);
};

const handleAuth = (type: 'login' | 'register') => {
  router.push(`/${type}`);
};

const viewOnMap = (address: string) => {
  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
  window.open(mapUrl, '_blank');
};

const getDirections = (address: string) => {
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`;
  window.open(directionsUrl, '_blank');
};

const isMobileMenuOpen = ref(false);
const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
};
</script>

<style scoped>
.black-gradient {
  background-image: linear-gradient(to bottom, rgba(15, 23, 42, 0.8), rgba(15, 23, 42, 0.95));
}
</style>
