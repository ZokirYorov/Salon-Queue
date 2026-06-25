<template>
  <div class="p-6 bg-slate-50 min-h-screen">
    <h1 class="text-3xl font-bold text-slate-900 mb-6">Admin Boshqaruvi</h1>

    <div class="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
      <h2 class="text-xl font-semibold text-slate-800 mb-4">Salonlar va Adminlar ro'yxati</h2>

      <div v-if="salonsWithAdmins.length > 0" class="overflow-x-auto">
        <table class="min-w-full divide-y divide-slate-200">
          <thead class="bg-slate-50">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Salon nomi
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Manzil
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Yaratgan Admin
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Admin Email
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Admin roli
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Amallar
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-slate-200">
            <tr v-for="item in salonsWithAdmins" :key="item.salon.id">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                {{ item.salon.name }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                {{ item.salon.address }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                {{ item.admin ? item.admin.username : 'Noma\'lum' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                {{ item.admin ? item.admin.email : 'Noma\'lum' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                <span :class="['px-2 inline-flex text-xs leading-5 font-semibold rounded-full', item.admin?.role === 'staff' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800']">
                  {{ item.admin ? item.admin.role : 'Noma\'lum' }}
                </span>
              </td>
              <td class="px-2 py-4 whitespace-nowrap text-sm font-medium">
                <button @click="deleteSalon(item.salon.id)" class="text-red-600 cursor-pointer bg-red-200 rounded-md px-2 py-1 hover:bg-red-100 hover:text-red-900 ml-4">
                  O'chirish
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-else class="text-center py-8 text-slate-500">
        <p>Hali hech qanday salon yoki admin ma'lumotlari topilmadi.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

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

const salonsWithAdmins = ref<{ salon: Salon; admin: User | undefined }[]>([]);

const loadSalonsAndAdmins = () => {
  const storedSalonsString = localStorage.getItem('salons');
  const storedUsersString = localStorage.getItem('users');

  const salons: Salon[] = storedSalonsString ? JSON.parse(storedSalonsString) : [];
  const users: User[] = storedUsersString ? JSON.parse(storedUsersString) : [];

  salonsWithAdmins.value = salons.map(salon => {
    const admin = users.find(user => user.id === salon.adminId);
    return { salon, admin };
  });
};

const deleteSalon = (salonId: number) => {
  if (confirm("Haqiqatan ham bu salonni o'chirmoqchimisiz?")) {
    const storedSalonsString = localStorage.getItem('salons');
    let salons: Salon[] = storedSalonsString ? JSON.parse(storedSalonsString) : [];

    salons = salons.filter(salon => salon.id !== salonId);
    localStorage.setItem('salons', JSON.stringify(salons));

    loadSalonsAndAdmins(); // Ro'yxatni yangilash
    alert('Salon muvaffaqiyatli o\'chirildi!');
  }
};

onMounted(() => {
  loadSalonsAndAdmins();
});
</script>

<style scoped>
/* Tailwind CSS classes are used directly in the template */
</style>
