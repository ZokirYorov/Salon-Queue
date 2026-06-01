<template>
  <div class="min-h-screen bg-slate-100 font-sans text-slate-800 antialiased flex">

    <!-- Sidebar (SaaS Navigation) -->
    <aside class="w-64 bg-slate-900 text-slate-400 p-6 flex-col justify-between hidden md:flex">
      <div>
        <div class="flex items-center space-x-2 text-white text-xl font-black tracking-tight mb-8">
          <svg class="h-7 w-7 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          <span>Navbat<span class="text-indigo-400">Pro</span></span>
        </div>
        <nav class="space-y-2">
          <a href="#" class="flex items-center space-x-3 bg-indigo-600 text-white p-3 rounded-xl font-medium transition">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
            <span>Bugungi Navbatlar</span>
          </a>
          <a href="#" class="flex items-center space-x-3 hover:bg-slate-800 hover:text-slate-200 p-3 rounded-xl font-medium transition">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            <span>Ish Grafigim</span>
          </a>
          <a href="#" class="flex items-center space-x-3 hover:bg-slate-800 hover:text-slate-200 p-3 rounded-xl font-medium transition">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
            <span>Mijozlar Bazasi</span>
          </a>
        </nav>
      </div>
      <!-- Profile section inside Sidebar -->
      <div class="border-t border-slate-800 pt-4 flex items-center justify-between">
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 rounded-full bg-indigo-500 text-white font-bold flex items-center justify-center">A</div>
          <div>
            <p class="text-sm font-semibold text-white">Asilbek M.</p>
            <p class="text-xs text-slate-500">Top Stilist</p>
          </div>
        </div>
        <button @click="logout" class="text-slate-500 hover:text-rose-400 transition">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
        </button>
      </div>
    </aside>

    <!-- Main Dashboard Content -->
    <main class="flex-1 p-6 md:p-10 overflow-y-auto">

      <!-- Top Header Summary -->
      <header class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 class="text-2xl font-black text-slate-900">Salom, Asilbek! 👋</h1>
          <p class="text-sm text-slate-500">Bugun sizni <span class="font-bold text-slate-700">"Go'zal Salon"</span>da 5 ta mijoz kutmoqda.</p>
        </div>
        <!-- Quick Action Badge -->
        <div class="flex items-center space-x-2 bg-emerald-50 text-emerald-700 px-4 py-2 rounded-full border border-emerald-200 text-sm font-semibold">
          <span class="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Siz hozir: Aktiv ish rejimidasiz</span>
        </div>
      </header>

      <!-- Mini KPI Dashboard Stats Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        <div class="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm flex items-center space-x-4">
          <div class="p-3 bg-indigo-50 text-indigo-600 rounded-xl"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg></div>
          <div><p class="text-xs text-slate-400 font-medium uppercase tracking-wider">Kutilayotganlar</p><p class="text-2xl font-bold text-slate-900">{{ queueList.length }} ta mijoz</p></div>
        </div>
        <div class="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm flex items-center space-x-4">
          <div class="p-3 bg-emerald-50 text-emerald-600 rounded-xl"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg></div>
          <div><p class="text-xs text-slate-400 font-medium uppercase tracking-wider">Xizmat ko'rsatildi</p><p class="text-2xl font-bold text-slate-900">{{ completedCount }} ta</p></div>
        </div>
        <div class="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm flex items-center space-x-4">
          <div class="p-3 bg-amber-50 text-amber-600 rounded-xl"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg></div>
          <div><p class="text-xs text-slate-400 font-medium uppercase tracking-wider">Bugungi daromad</p><p class="text-2xl font-bold text-slate-900">450,000 so'm</p></div>
        </div>
      </div>

      <!-- Current / Next Client Card (Fokus markazi) -->
      <section v-if="currentClient" class="bg-gradient-to-r from-indigo-600 to-violet-700 rounded-3xl p-6 text-white shadow-xl shadow-indigo-100 mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <span class="bg-white/20 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">Hozirgi Jarayon</span>
          <h2 class="text-3xl font-bold mt-2">{{ currentClient.name }}</h2>
          <p class="opacity-80 mt-1 text-sm">Xizmat turi: <span class="font-bold underline">{{ currentClient.service }}</span></p>
          <p class="opacity-80 text-sm">Kelgan vaqti: {{ currentClient.time }}</p>
        </div>
        <div class="flex gap-3 w-full md:w-auto">
          <button @click="completeService" class="w-full md:w-auto bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 px-6 rounded-xl text-sm shadow-md transition flex items-center justify-center gap-1">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
            Tugatish va To'lovga yuborish
          </button>
        </div>
      </section>

      <!-- Live Queue List (Navbatdagi mijozlar ro'yxati) -->
      <section class="bg-white rounded-3xl border border-slate-200/60 shadow-sm overflow-hidden">
        <div class="p-6 border-b border-slate-100 flex justify-between items-center">
          <h3 class="text-lg font-bold text-slate-900">Jonli navbat tartibi</h3>
          <span class="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg">Navbatdagilar: {{ queueList.length }}</span>
        </div>

        <div v-if="queueList.length > 0" class="divide-y divide-slate-100">
          <div v-for="(client, index) in queueList" :key="client.id" class="p-6 flex items-center justify-between hover:bg-slate-50 transition">
            <div class="flex items-center space-x-4">
              <!-- Queue Number Badge -->
              <div class="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 font-black flex items-center justify-center text-sm">
                #{{ index + 1 }}
              </div>
              <div>
                <h4 class="font-bold text-slate-900">{{ client.name }}</h4>
                <p class="text-xs text-slate-400 mt-0.5">{{ client.service }} • {{ client.time }}</p>
              </div>
            </div>

            <!-- Contextual CTA based on position -->
            <div class="flex items-center space-x-2">
              <button
                  v-if="index === 0 && !currentClient"
                  @click="startService(client)"
                  class="bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white px-4 py-2 rounded-xl text-xs font-bold transition"
              >
                Kresloga taklif qilish
              </button>
              <button @click="cancelQueue(client.id)" class="text-slate-400 hover:text-rose-500 p-2 rounded-lg transition" title="Bekor qilish">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-16v1a3 3 0 003 3h10M9 3h6m2 5H7"></path></svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Bo'sh navbat holati -->
        <div v-else-if="!currentClient" class="p-12 text-center">
          <svg class="mx-auto h-12 w-12 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path></svg>
          <p class="text-sm text-slate-500 mt-2">Hozircha navbatlar tugadi. Yangi mijozlar qo'shilsa shu yerda ko'rinadi.</p>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

interface QueueClient {
  id: number;
  name: string;
  service: string;
  time: string;
}

const router = useRouter();
const completedCount = ref(12);

// Hozir kresloda o'tirgan xizmat olayotgan mijoz
const currentClient = ref<QueueClient | null>({
  id: 99,
  name: "Jasur Shodiyev",
  service: "Soch kesish + Soqol parvarishi",
  time: "17:45"
});

// Navbat kutayotgan mijozlar ro'yxati
const queueList = ref<QueueClient[]>([
  { id: 1, name: 'Malika Axmedova', service: 'Soch turmaklash (Kechki)', time: '18:15' },
  { id: 2, name: 'Sardor Komilov', service: 'Soch boʻyash', time: '18:50' },
  { id: 3, name: 'Diyora Umarova', service: 'Yuz parvarishi / Maskalar', time: '19:30' }
]);

// Xizmatni boshlash
const startService = (client: QueueClient) => {
  currentClient.value = client;
  queueList.value = queueList.value.filter(c => c.id !== client.id);
};

// Xizmatni muvaffaqiyatli tugatish
const completeService = () => {
  if (currentClient.value) {
    completedCount.value++;
    alert(`${currentClient.value.name} uchun xizmat yakunlandi. To'lov cheki terminalga yuborildi.`);
    currentClient.value = null;
  }
};

// Navbatni bekor qilish (Mijoz kelmay qolsa yoki rad etilsa)
const cancelQueue = (clientId: number) => {
  if(confirm("Mijozni navbatdan o'chirishni xohlaysizmi?")) {
    queueList.value = queueList.value.filter(c => c.id !== clientId);
  }
};

const logout = () => {
  localStorage.removeItem('selectedSalonId');
  router.push('/login');
};
</script>