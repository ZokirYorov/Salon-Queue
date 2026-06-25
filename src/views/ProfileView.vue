<template>
  <div class="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
    <div class="max-w-6xl mx-auto">
      <!-- Back Button -->
      <div class="mb-4">
        <button @click="router.back()" class="flex items-center gap-2 text-sm font-medium border border-gray-200 p-2 rounded-lg cursor-pointer bg-blue-50 hover:bg-blue-100 text-slate-600 hover:text-indigo-600 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
          </svg>
          Ortga
        </button>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Left Column: User Info -->
        <div class="lg:col-span-1 space-y-8">
          <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/60">
            <div class="flex flex-col items-center">
              <div class="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-4xl font-bold mb-4">
                {{ currentUser?.username.charAt(0).toUpperCase() }}
              </div>
              <h1 class="text-2xl font-bold text-slate-900">{{ currentUser?.username }}</h1>
              <p class="text-sm text-slate-500">{{ currentUser?.email }}</p>
              <span :class="['mt-3 px-3 py-1 rounded-full text-xs font-semibold', currentUser?.role === 'staff' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800']">
                {{ currentUser?.role === 'staff' ? 'Tashkilot Egasi' : 'Mijoz' }}
              </span>
            </div>
          </div>
          <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/60">
             <h3 class="text-lg font-semibold text-slate-800 mb-3">Profil Boshqaruvi</h3>
             <button @click="logout" class="w-full text-left flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clip-rule="evenodd" /></svg>
                Tizimdan chiqish
             </button>
          </div>
        </div>

        <!-- Right Column: Salon Management -->
        <div class="lg:col-span-2">
          <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/60">
            <div v-if="!currentUser">
                <p class="text-center text-slate-600">Profil ma'lumotlarini ko'rish va salonlarni boshqarish uchun tizimga kiring.</p>
                <RouterLink to="/login" class="mt-4 w-full block text-center px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
                  Tizimga kirish
                </RouterLink>
            </div>
            <div v-else-if="currentUser.role === 'staff'">
              <div class="flex justify-between items-center mb-6">
                <h2 class="text-2xl font-bold text-slate-800">Mening Salonlarim</h2>
                <button v-if="mySalons.length > 0 && !showCreateForm" @click="showCreateForm = true" class="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 transition-all">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" /></svg>
                  Yangi salon qo'shish
                </button>
              </div>

              <!-- Salon Creation Form -->
              <div v-if="mySalons.length === 0 || showCreateForm" class="space-y-6 bg-slate-50 p-6 rounded-xl border border-slate-200">
                 <h3 class="text-xl font-semibold text-slate-800">{{ salonForm.id ? 'Salonni Tahrirlash' : 'Yangi Salon Yaratish' }}</h3>
                 <form @submit.prevent="handleSaveSalon" class="space-y-4">
                    <AppInput v-model="salonForm.name" label="Salon nomi" placeholder="Masalan, 'King Barbershop'" required />
                    <AppInput v-model="salonForm.address" label="Manzil" placeholder="Masalan, 'Toshkent, Amir Temur ko`chasi 15'" required />
                    <AppInput v-model="salonForm.imageUrl" label="Rasm URL" placeholder="https://..." />
                    <div class="flex items-center justify-end gap-3 pt-4">
                        <button type="button" @click="cancelCreation" class="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition">
                            Bekor qilish
                        </button>
                        <button type="submit" class="px-6 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition">
                            {{ salonForm.id ? 'Saqlash' : 'Yaratish' }}
                        </button>
                    </div>
                 </form>
              </div>

              <!-- My Salons List -->
              <div v-if="mySalons.length > 0 && !showCreateForm" class="space-y-4 mt-6">
                <div v-for="salon in mySalons"
                     :key="Number(salon.id)"
                     class="bg-slate-50 p-4 rounded-xl border border-slate-200/80 flex items-center justify-between hover:border-indigo-300 transition"
                >
                  <div class="flex items-center gap-4">
                      <img :src="salon.imageUrl || 'https://via.placeholder.com/100'" alt="Salon" class="w-16 h-16 rounded-lg object-cover bg-slate-200">
                      <div>
                        <h3 class="text-base font-bold text-slate-800">{{ salon.name }}</h3>
                        <p class="text-xs text-slate-500">{{ salon.address }}</p>
                      </div>
                  </div>
                  <div class="flex gap-2">
                    <button @click="editSalon(salon)" class="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-100 rounded-md transition">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" /><path fill-rule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clip-rule="evenodd" /></svg>
                    </button>
                    <button @click="deleteSalon(salon.id)" class="p-2 text-slate-500 hover:text-red-600 hover:bg-red-100 rounded-md transition">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clip-rule="evenodd" /></svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
             <div v-else>
                <p class="text-center text-slate-600">Sizda salonlarni boshqarish huquqi yo'q.</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive, computed } from 'vue';
import { useRouter, RouterLink } from 'vue-router';
import AppInput from "@/components/ui/AppInput.vue";

interface Salon {
  id: number | null;
  name: string;
  address: string;
  imageUrl: string;
  adminId?: number;
}

interface SalonForm{
  id: number | null;
  name: string;
  address: string;
  imageUrl: string;
}

interface User {
  id: number;
  username: string;
  email: string;
  role: 'client' | 'staff';
}

const router = useRouter();
const currentUser = ref<User | null>(null);
const allSalons = ref<Salon[]>([]);
const showCreateForm = ref(false);

const salonForm = reactive<SalonForm>({
  id: null,
  name: '',
  address: '',
  imageUrl: '',
});

const mySalons = computed(() => {
    if (!currentUser.value) return [];
    return allSalons.value.filter(salon => salon.adminId === currentUser.value?.id);
});

onMounted(() => {
  loadUserData();
  loadAllSalons();
  if (currentUser.value && currentUser.value.role === 'staff' && mySalons.value.length === 0) {
    showCreateForm.value = true;
  }
});

const loadUserData = () => {
  const storedUser = localStorage.getItem('currentUser');
  if (storedUser) {
    currentUser.value = JSON.parse(storedUser);
  }
};

const loadAllSalons = () => {
  const storedSalons = localStorage.getItem('salons');
  if (storedSalons) {
    allSalons.value = JSON.parse(storedSalons);
  }
};

const persistSalons = () => {
    localStorage.setItem('salons', JSON.stringify(allSalons.value));
};

const resetForm = () => {
    salonForm.id = null;
    salonForm.name = '';
    salonForm.address = '';
    salonForm.imageUrl = '';
}

const editSalon = (salon: Salon) => {
  salonForm.id = salon.id;
  salonForm.name = salon.name;
  salonForm.address = salon.address;
  salonForm.imageUrl = salon.imageUrl;
  showCreateForm.value = true;
};

const cancelCreation = () => {
    resetForm();
    if (mySalons.value.length > 0) {
        showCreateForm.value = false;
    }
}

const handleSaveSalon = () => {
    if (!salonForm.name || !salonForm.address) {
        alert("Iltimos, salon nomi va manzilini to'ldiring.");
        return;
    }

    if (salonForm.id) { // Editing existing salon
        const index = allSalons.value.findIndex(s => s.id === salonForm.id);
        if (index !== -1) {
            allSalons.value[index] = { ...allSalons.value[index], ...salonForm };
        }
    } else { // Creating new salon
        const newSalon: Salon = {
            id: Date.now(),
            name: salonForm.name,
            address: salonForm.address,
            imageUrl: salonForm.imageUrl || 'https://via.placeholder.com/400x250?text=Salon',
            adminId: currentUser.value?.id,
        };
        allSalons.value.push(newSalon);
    }

    persistSalons();
    alert(`Salon ma'lumotlari muvaffaqiyatli saqlandi!`);
    resetForm();
    showCreateForm.value = false;
}

const deleteSalon = (salonId: number | null) => {
  if (confirm("Haqiqatan ham bu salonni o'chirmoqchimisiz? Bu amalni ortga qaytarib bo'lmaydi.")) {
    allSalons.value = allSalons.value.filter(salon => salon.id !== salonId);
    persistSalons();
    alert('Salon muvaffaqiyatli o\'chirildi!');
  }
};

const logout = () => {
    if (confirm("Haqiqatan ham tizimdan chiqmoqchimisiz?")) {
        localStorage.removeItem('currentUser');
        localStorage.removeItem('role');
        localStorage.removeItem('selectedSalonId');
        currentUser.value = null;
        router.push('/login');
    }
}
</script>
