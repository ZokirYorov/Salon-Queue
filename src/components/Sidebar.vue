<template>
  <div v-if="isMobileOpen" class="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm lg:hidden" @click="$emit('toggleMenu')"></div>

  <aside :class="['fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-slate-400 flex-col border-r border-slate-800 shrink-0 transform transition-transform duration-300 ease-in-out',
                 isMobileOpen ? 'translate-x-0' : '-translate-x-full',
                 'lg:relative lg:translate-x-0 lg:flex']">
    <div class="h-20 flex items-center px-6 border-b border-slate-800">
      <div class="flex items-center space-x-2.5">
        <div class="flex items-end space-x-1 h-5 w-5">
          <span class="w-1 h-2.5 bg-indigo-400 rounded-full"></span>
          <span class="w-1 h-4 bg-indigo-500 rounded-full"></span>
          <span class="w-1 h-5 bg-cyan-400 rounded-full"></span>
        </div>
        <span class="text-xl font-black tracking-tight text-white">
          CUE<span class="text-cyan-400 font-light">SaaS</span>
        </span>
      </div>
      <button v-if="isMobileOpen" @click="$emit('toggleMenu')" class="ml-auto lg:hidden p-2 rounded-md text-slate-500 hover:text-white hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
        <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
      </button>
    </div>
    <nav class="flex-1 p-4 space-y-1.5">
      <RouterLink
          v-for="(item, index) in menuItems"
          :key="index"
          :to="item.path"
          @click="openRoute(item.id)"
          class="flex items-center gap-2 space-x-3 hover:bg-slate-800/60 border-transparent hover:text-slate-200 px-4 py-2.5 rounded-xl text-sm font-medium transition"
          active-class="bg-gray-700 text-white"
      >
        <i v-if="item.iconType === 'fa'" :class="item.icon"></i>
        <span
            v-else
            v-html="item.icon"
        >
        </span>
        {{item.name}}
      </RouterLink>
<!--      <RouterLink to="/"-->
<!--                  class="flex items-center space-x-3   px-4 py-2.5 rounded-xl text-sm font-semibold border "-->
<!--                  :class="isMobileOpen ? '' : ''"-->
<!--                  @click="isMobileOpen && $emit('toggleMenu')"-->
<!--      >-->
<!--        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z"></path></svg>-->
<!--        <span>Salonlar Monitoringi</span>-->
<!--      </RouterLink>-->
<!--      <a href="/staff"-->
<!--         class="flex items-center space-x-3 hover:bg-slate-800/60 hover:text-slate-200 px-4 py-2.5 rounded-xl text-sm font-medium transition"-->
<!--         :class="isMobileOpen ? 'bg-indigo-600/10 text-indigo-400 border-indigo-500/10' : ''"-->
<!--         @click="isMobileOpen && $emit('toggleMenu')"-->
<!--      >-->
<!--        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>-->
<!--        <span>Jonli Navbatlar</span>-->
<!--      </a>-->
<!--      <a href="#"-->
<!--         class="flex items-center space-x-3 hover:bg-slate-800/60 hover:text-slate-200 px-4 py-2.5 rounded-xl text-sm font-medium transition"-->
<!--         :class="isMobileOpen ? 'bg-indigo-600/10 text-indigo-400 border-indigo-500/10' : ''"-->
<!--         @click="isMobileOpen && $emit('toggleMenu')"-->
<!--      >-->
<!--        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2z"></path></svg>-->
<!--        <span>Statistika</span>-->
<!--      </a>-->
<!--      <RouterLink to="/create-salon" class="flex items-center space-x-3 hover:bg-slate-800/60 hover:text-slate-200 px-4 py-2.5 rounded-xl text-sm font-medium transition" @click="isMobileOpen && $emit('toggleMenu')">-->
<!--        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>-->
<!--        <span>Yangi salon yaratish</span>-->
<!--      </RouterLink>-->
<!--      <RouterLink to="/admin/manage" class="flex items-center space-x-3 hover:bg-slate-800/60 hover:text-slate-200 px-4 py-2.5 rounded-xl text-sm font-medium transition" @click="isMobileOpen && $emit('toggleMenu')">-->
<!--        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>-->
<!--        <span>Admin Boshqaruvi</span>-->
<!--      </RouterLink>-->
<!--      <RouterLink to="/client" class="flex items-center space-x-3 hover:bg-slate-800/60 hover:text-slate-200 px-4 py-2.5 rounded-xl text-sm font-medium transition" @click="isMobileOpen && $emit('toggleMenu')">-->
<!--        <i class="fa-solid fa-house-user"></i>-->
<!--         <span>Klient profili</span>-->
<!--      </RouterLink>-->
    </nav>
    <div class="p-4 border-t border-slate-800 text-xs flex items-center justify-between">
      <span>Tizim holati: <span class="text-emerald-400 font-bold">● Online</span></span>
      <span class="text-slate-600">v2.5</span>
    </div>
  </aside>
</template>

<script setup lang="ts">
import {defineProps, defineEmits, computed, ref} from 'vue';
import { RouterLink } from 'vue-router';

const props = defineProps({
  isMobileOpen: Boolean,
});

const emit = defineEmits(['toggleMenu']);

const activeClass = ref<number | null>(null);
const openRoute = (id: number) => {
  activeClass.value = id;
  if (props.isMobileOpen) {
    emit('toggleMenu', id);
  }
}

const menuItems = [
  {
    id: 1,
    name: 'Salon monitoringi',
    path: '/home',
    iconType: 'svg',
    icon: `
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z"></path></svg>
    `
  },
  {
    id: 2,
    name: 'Jonli navbatlar',
    path: '/staff',
    iconType: 'fa',
    icon: 'fa-regular fa-clock'
  },
  {
    id: 3,
    name: 'Statistika',
    path: '/asdd',
    iconType: 'scg',
    icon: `
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2z"></path></svg>
    `
  },
  {
    id: 4,
    name: 'Yangi salon yaratish',
    path: '/create-salon',
    iconType: 'svg',
    icon: `
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
    `
  },
  {
    id: 5,
    name: 'Admin boshqaruvi',
    path: '/admin/manage',
    iconType: 'svg',
    icon: `
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
    `
  },
  {
    id: 6,
    name: 'Klient profili',
    path: '/client',
    iconType: 'fa',
    icon: 'fa-regular fa-user'
  }
]

</script>

<style scoped>
</style>
