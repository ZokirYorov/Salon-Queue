<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-lg w-full space-y-8 bg-white p-8 rounded-2xl shadow-2xl border border-gray-200">
      <div>
        <h2 class="text-center text-3xl font-extrabold text-gray-900">
          Yangi Tashkilot Yaratish
        </h2>
        <p class="mt-4 text-center text-base text-gray-600">
          Tashkilot ma'lumotlarini kiriting
        </p>
      </div>
      <form class="mt-8 space-y-6 w-full flex flex-col gap-2" @submit.prevent="handleCreateSalon">
        <div class="flex flex-col gap-2 w-full">
<!--          <div>-->
<!--            <label for="salon-name" class="sr-only">Salon nomi</label>-->
<!--            <input id="salon-name" name="salon-name" type="text" required-->
<!--                   class="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm transition-all duration-200"-->
<!--                   placeholder="Salon nomi" v-model="salon.name">-->
<!--          </div>-->
          <div class="flex items-center gap-2">
            <AppInput
                v-model="salon.name"
                label="Tashkilot nomi"
                placeholder="Nomini kiriting"
                class="w-full"
            />
            <AppInput
                v-model="salon.category"
                label="Tashkilot turi"
                placeholder="Turini kiriting"
                class="w-full"

            />
          </div>
<!--          <div>-->
<!--            <label for="salon-address" class="sr-only">Manzil</label>-->
<!--            <input id="salon-address" name="salon-address" type="text" required-->
<!--                   class="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm transition-all duration-200"-->
<!--                   placeholder="Manzil" v-model="salon.address">-->
<!--          </div>-->
<!--          <div>-->
          <!--            <label for="salon-image" class="sr-only">Rasm URL</label>-->
          <!--            <input id="salon-image" name="salon-image" type="file"-->
          <!--                   class="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm transition-all duration-200"-->
          <!--                   placeholder="Rasm URL (masalan: https://example.com/image.jpg)">-->
          <!--          </div>-->
          <div class="flex items-center gap-2">
            <AppInput
                v-model="salon.region"
                label="Viloyat"
                type="text"
                placeholder="Viloyat nomini kiritng"
                class="w-full"
            />
            <AppInput
                v-model="salon.district"
                label="Tuman"
                type="text"
                placeholder="Tuman nomini kiriting"
                class="w-full"
            />
          </div>
          <div class="flex items-center gap-2">
            <AppInput
                v-model="salon.address"
                label="Manzil"
                placeholder="Manzilni kiriting"
                class="w-full"
            />
            <AppInput
                v-model="salon.currentQueue"
                label="Faol xodimlar soni"
                type="number"
                placeholder="4"
                class="w-full"
            />
          </div>
          <div class="flex items-center gap-2">
            <AppInput
                v-model="salon.rating"
                label="Reyting"
                type="text"
                placeholder="4.5"
                class="w-full"
            />
            <AppInput
                v-model="salon.reviews"
                label="Sharhlar soni"
                type="number"
                class="w-full"
                placeholder="50"
            />
          </div>
          <AppInput
              v-model="salon.imageUrl"
              label="Rasm yuklash"
              type="file"
              @change="handleImageUpload($event)"
          />
        </div>

        <div class="flex items-center gap-2">
          <button
              type="button"
              class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-lg font-medium rounded-md text-white hover:text-white bg-gray-500 cursor-pointer hover:bg-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              @click="clearForm"
          >
            Tozalash
          </button>
          <button type="submit"
                  class="group relative w-full cursor-pointer flex justify-center py-3 px-4 border border-transparent text-lg font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300">
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
import AppInput from "@/components/ui/AppInput.vue";

const router = useRouter();

const salon = ref({
  name: '',
  category: '',
  region: '',
  district: '',
  address: '',
  imageUrl: '',
  currentQueue: '',
  rating: '',
  reviews: '',
});

const handleImageUpload = (event: Event) => {
  const file = event.target as HTMLInputElement;
  if (file.files && file.files[0]) {
    salon.value.imageUrl = URL.createObjectURL(file.files[0]);
  }
}

const clearForm = () => {
  salon.value = {
    name: '',
    category: '',
    region: '',
    district: '',
    address: '',
    imageUrl: '',
    currentQueue: '',
    rating: '',
    reviews: '',
  }
}

const handleCreateSalon = () => {
  // Yangi salon uchun unikal ID yaratish
  const newId = Date.now(); // Oddiy ID yaratish usuli

  const newSalon = {
    id: newId,
    name: salon.value.name,
    category: salon.value.category,
    region: salon.value.region,
    district: salon.value.district,
    address: salon.value.address,
    imageUrl: salon.value.imageUrl || 'https://via.placeholder.com/400x250?text=New+Salon', // Agar rasm bo'lmasa default rasm
    currentQueue: salon.value.currentQueue || 0,
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

  alert(`"${newSalon.category}" saloni muvaffaqiyatli yaratildi!`);

  // Dashboardga qaytish
  router.push('/');
};
</script>

<style scoped>
/* Tailwind CSS classes are used directly in the template */
</style>
