<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-2xl border border-gray-200">
      <div>
        <h2 class="mt-6 text-center text-4xl font-extrabold text-gray-900">
          Yangi Salon Yaratish
        </h2>
        <p class="mt-4 text-center text-base text-gray-600">
          Salon ma'lumotlarini kiriting
        </p>
      </div>
      <form class="mt-8 space-y-6" @submit.prevent="handleCreateSalon">
        <div class="rounded-md shadow-sm -space-y-px">
          <div>
            <label for="salon-name" class="sr-only">Salon nomi</label>
            <input id="salon-name" name="salon-name" type="text" required
                   class="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm transition-all duration-200"
                   placeholder="Salon nomi" v-model="salon.name">
          </div>
          <div>
            <label for="salon-address" class="sr-only">Manzil</label>
            <input id="salon-address" name="salon-address" type="text" required
                   class="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm transition-all duration-200"
                   placeholder="Manzil" v-model="salon.address">
          </div>
          <div>
            <label for="salon-image" class="sr-only">Rasm URL</label>
            <input id="salon-image" name="salon-image" type="url"
                   class="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm transition-all duration-200"
                   placeholder="Rasm URL (masalan: /src/assets/images/new_salon.jpg)" v-model="salon.imageUrl">
          </div>
          <div>
            <label for="salon-rating" class="sr-only">Reyting</label>
            <input id="salon-rating" name="salon-rating" type="number" step="0.1" min="0" max="5"
                   class="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm transition-all duration-200"
                   placeholder="Reyting (masalan: 4.5)" v-model="salon.rating">
          </div>
          <div>
            <label for="salon-reviews" class="sr-only">Sharhlar soni</label>
            <input id="salon-reviews" name="salon-reviews" type="number" min="0"
                   class="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm transition-all duration-200"
                   placeholder="Sharhlar soni (masalan: 50)" v-model="salon.reviews">
          </div>
        </div>

        <div>
          <button type="submit"
                  class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-lg font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300">
            <span class="absolute left-0 inset-y-0 flex items-center pl-3">
              <svg class="h-6 w-6 text-indigo-300 group-hover:text-indigo-200 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </span>
            Salonni yaratish
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const salon = ref({
  name: '',
  address: '',
  imageUrl: '',
  rating: 0,
  reviews: 0,
});

const handleCreateSalon = () => {
  // Yangi salon uchun unikal ID yaratish
  const newId = Date.now(); // Oddiy ID yaratish usuli

  const newSalon = {
    id: newId,
    name: salon.value.name,
    address: salon.value.address,
    imageUrl: salon.value.imageUrl || 'https://via.placeholder.com/400x250?text=New+Salon', // Agar rasm bo'lmasa default rasm
    rating: parseFloat(salon.value.rating.toString()) || 0,
    reviews: parseInt(salon.value.reviews.toString()) || 0,
  };

  // Mavjud salonlarni localStorage'dan olish
  const existingSalonsString = localStorage.getItem('salons');
  let salons = existingSalonsString ? JSON.parse(existingSalonsString) : [];

  // Yangi salonni ro'yxatga qo'shish
  salons.push(newSalon);

  // Yangilangan ro'yxatni localStorage'ga saqlash
  localStorage.setItem('salons', JSON.stringify(salons));

  alert(`"${newSalon.name}" saloni muvaffaqiyatli yaratildi!`);

  // Dashboardga qaytish
  router.push('/');
};
</script>

<style scoped>
/* Tailwind CSS classes are used directly in the template */
</style>
