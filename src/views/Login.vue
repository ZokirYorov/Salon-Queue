<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-2xl border border-gray-200">
      <div>
        <h2 class="mt-6 text-center text-4xl font-extrabold text-gray-900">
          Tizimga kirish
        </h2>
        <p class="mt-4 text-center text-base text-gray-600">
          Hisobingiz yo'qmi?
          <RouterLink to="/register" class="font-medium text-indigo-600 hover:text-indigo-500 transition-colors duration-200">
            Ro'yxatdan o'ting
          </RouterLink>
        </p>
      </div>
      <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
        <div class="rounded-md shadow-sm -space-y-px">
          <div>
            <label for="email-address" class="sr-only">Email manzili</label>
            <input id="email-address" name="email" type="email" autocomplete="email" required
                   class="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm transition-all duration-200"
                   placeholder="Email manzili" v-model="email">
          </div>
          <div>
            <label for="password" class="sr-only">Parol</label>
            <input id="password" name="password" type="password" autocomplete="current-password" required
                   class="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm transition-all duration-200"
                   placeholder="Parol" v-model="password">
          </div>
        </div>
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <input id="remember-me" name="remember-me" type="checkbox"
                   class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded">
            <label for="remember-me" class="ml-2 block text-sm text-gray-900">
              Meni eslab qol
            </label>
          </div>
          <div class="text-sm">
            <a href="#" class="font-medium text-indigo-600 hover:text-indigo-500 transition-colors duration-200">
              Parolni unutdingizmi?
            </a>
          </div>
        </div>
        <div>
          <button type="submit"
                  class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-lg font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300">
            <span class="absolute left-0 inset-y-0 flex items-center pl-3">
              <svg class="h-6 w-6 text-indigo-300 group-hover:text-indigo-200 transition-colors duration-300" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
              </svg>
            </span>
            Kirish
          </button>
          <div class="mt-4 flex items-center justify-between">
            <label class="flex items-center cursor-pointer select-none text-sm text-slate-600">
              <input type="checkbox" v-model="isEmployee" class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded mr-2" />
              Xodim (Master / Admin) sifatida kirish
            </label>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter, RouterLink } from 'vue-router';

const router = useRouter();
const email = ref('');
const password = ref('');
const isEmployee = ref(false); // Xodim sifatida kirish uchun yangi ref

const handleLogin = () => {
  console.log('Login urinish:', email.value, password.value, 'Xodim:', isEmployee.value);

  // Rolni isEmployee checkbox holatiga qarab belgilash
  const roleToSet = isEmployee.value ? 'staff' : 'client';
  localStorage.setItem('role', roleToSet);

  const selectedSalonId = localStorage.getItem('selectedSalonId');

  if (!selectedSalonId) {
    alert('Iltimos, avval Dashboard sahifasida salonni tanlang!');
    router.push('/home'); // Salon tanlanmagan bo'lsa, Dashboardga qaytarish
    return;
  }

  // Rolga qarab yo'naltirish
  if (roleToSet === 'staff') {
    router.push(`/staff/schedule?salonId=${selectedSalonId}`);
  } else { // client
    router.push(`/client/book?salonId=${selectedSalonId}`);
  }
};
</script>

<style scoped>
/* Tailwind CSS classes are used directly in the template */
</style>
