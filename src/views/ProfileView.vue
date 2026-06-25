<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
    <div class="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
      <CButton
          is-has-fa-icon
          faClass="fa-solid fa-arrow-left"
          @click="router.back()"
          variant="ghost-accent"
      />
      <h1 class="text-3xl font-bold text-slate-900 mb-8 text-center">Mening Profilim</h1>

      <h2 class="text-2xl font-semibold text-indigo-700 mb-4 border-b pb-2">Foydalanuvchi ma'lumotlari</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-lg">
        <p><span class="font-medium text-slate-700">ID:</span> {{ currentUser?.id }}</p>
        <p><span class="font-medium text-slate-700">Foydalanuvchi nomi:</span> {{ currentUser?.username }}</p>
        <p><span class="font-medium text-slate-700">Email:</span> {{ currentUser?.email }}</p>
        <p><span class="font-medium text-slate-700">Rol:</span>
          <span :class="['px-3 py-1 rounded-full text-sm font-semibold', currentUser?.role === 'staff' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800']">
              {{ currentUser?.role === 'staff' ? 'Xodim (Admin)' : 'Mijoz' }}
            </span>
        </p>
      </div>
      <div v-if="currentUser" class="mb-10">
      </div>
      <div class="text-center text-slate-600 mb-10">
        <p>Profil ma'lumotlarini ko'rish uchun tizimga kiring.</p>
        <RouterLink to="/login" class="mt-4 inline-block px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
          Tizimga kirish
        </RouterLink>
      </div>

      <div class="mb-10">
        <h2 class="text-2xl font-semibold text-indigo-700 mb-4 border-b pb-2">Mening tashkilotlarim (Salonlarim)</h2>
        <div v-if="mySalons.length > 0" class="space-y-4">
          <div v-for="salon in mySalons" :key="salon.id" class="bg-gray-50 p-4 rounded-lg shadow-sm flex items-center justify-between">
            <div>
              <h3 class="text-lg font-semibold text-slate-800">{{ salon.name }}</h3>
              <p class="text-sm text-slate-600">{{ salon.address }}</p>
            </div>
            <div class="space-x-2">
              <button @click="editSalon(salon.id)" class="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-800 transition">
                Tahrirlash
              </button>
              <button @click="deleteSalon(salon.id)" class="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-800 transition">
                O'chirish
              </button>
            </div>
          </div>
        </div>
        <div class="text-center text-slate-600">
          <p>Siz hali hech qanday salon yaratmagansiz.</p>
          <RouterLink to="/create-salon" class="mt-4 inline-block px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition">
            Yangi salon yaratish
          </RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter, RouterLink } from 'vue-router';
import CButton from "@/components/CButton.vue";

interface Salon {
  id: number;
  name: string;
  address: string;
  imageUrl: string;
  rating: number;
  reviews: number;
  currentQueue: number;
  adminId?: number;
}

interface User {
  id: number;
  username: string;
  email: string;
  role: 'client' | 'staff';
}

const router = useRouter();
const currentUser = ref<User | null>(null);
const mySalons = ref<Salon[]>([]);

onMounted(() => {
  loadUserData();
  if (currentUser.value && currentUser.value.role === 'staff') {
    loadMySalons();
  }
});

const loadUserData = () => {
  const storedUser = localStorage.getItem('currentUser');
  if (storedUser) {
    currentUser.value = JSON.parse(storedUser);
  }
};

const loadMySalons = () => {
  const storedSalonsString = localStorage.getItem('salons');
  const allSalons: Salon[] = storedSalonsString ? JSON.parse(storedSalonsString) : [];
  if (currentUser.value) {
    mySalons.value = allSalons.filter(salon => salon.adminId === currentUser.value?.id);
  }
};

const editSalon = (salonId: number) => {
  router.push(`/create-salon/${salonId}`);
};

const deleteSalon = (salonId: number) => {
  if (confirm("Haqiqatan ham bu salonni o'chirmoqchimisiz?")) {
    const storedSalonsString = localStorage.getItem('salons');
    let salons: Salon[] = storedSalonsString ? JSON.parse(storedSalonsString) : [];

    salons = salons.filter(salon => salon.id !== salonId);
    localStorage.setItem('salons', JSON.stringify(salons));

    loadMySalons(); // Ro'yxatni yangilash
    alert('Salon muvaffaqiyatli o\'chirildi!');
  }
};
</script>


<style scoped>

</style>