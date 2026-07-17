<template>
  <div class="flex flex-col gap-6">
    <div class="flex justify-between items-center">
      <div>
        <h2 class="text-2xl font-bold text-slate-900">Xizmatlar</h2>
        <p class="text-sm text-gray-500">Salon xizmatlarini boshqaring</p>
      </div>
      <button @click="openModal()" class="px-4 py-2 bg-indigo-500 text-white rounded-lg text-sm hover:bg-indigo-600 transition">
        + Xizmat qo‘shish
      </button>
    </div>

    <div v-if="firebaseStore.loading && !showForm" class="text-center p-8"><p>Yuklanmoqda...</p></div>

    <div v-else class="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      <div v-for="svc in firebaseStore.services" :key="svc.id" class="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition flex flex-col gap-3">
        <div class="flex justify-between items-start">
          <div>
            <p class="font-semibold text-slate-800">{{ svc.name }}</p>
            <p class="text-xs text-gray-400">{{ svc.duration }} min</p>
          </div>
          <div class="flex items-center gap-1">
            <button @click="openModal(svc)" class="text-gray-500 bg-gray-200 hover:bg-gray-100 cursor-pointer px-2 py-1 rounded">
              O'zgartirish
            </button>
            <button @click="removeService(svc.id)" class="text-red-500 bg-red-200 hover:bg-red-100 cursor-pointer px-2 py-1 rounded">
              O'chirish
            </button>
          </div>
        </div>
        <div class="flex items-center justify-between">
          <span class="text-lg font-bold text-indigo-600">{{ formatPrice(svc.price) }}</span>
          <span class="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700">Aktiv</span>
        </div>
      </div>
    </div>
    <p v-if="!firebaseStore.loading && firebaseStore.services.length === 0" class="text-center text-gray-400 mt-10">
      Hali xizmatlar yo‘q
    </p>
    <div v-if="showForm" class="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex justify-center items-center" @click.self="closeModal">
      <div class="bg-white w-full max-w-md rounded-2xl p-6 shadow-xl">
        <div class="flex justify-between items-center mb-4 border-b pb-2">
          <h3 class="text-lg font-semibold">{{ isEditing ? 'Xizmatni tahrirlash' : 'Yangi xizmat' }}</h3>
          <button @click="closeModal" class="text-gray-400 hover:text-red-500">✕</button>
        </div>
        <div class="flex flex-col gap-4 text-sm">
          <AppInput v-model="form.name" label="Xizmat nomi *" placeholder="Masalan: Soch olish" :external-error="errors.name" @input="errors.name = ''" />
          <AppInput v-model.number="form.price" label="Narxi *" type="number" placeholder="50000" :external-error="errors.price" @input="errors.price = ''" />
          <AppInput v-model.number="form.duration" label="Davomiyligi (daqiqa) *" type="number" placeholder="30" :external-error="errors.duration" @input="errors.duration = ''" />
          <p v-if="firebaseStore.error" class="text-red-500 text-xs mt-2">{{ firebaseStore.error }}</p>
          <div class="flex justify-end gap-2 mt-2">
            <button @click="closeModal" class="px-4 py-2 bg-gray-100 rounded-lg">Bekor</button>
            <button @click="saveService" class="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600" :disabled="firebaseStore.loading">
              {{ firebaseStore.loading ? 'Saqlanmoqda...' : 'Saqlash' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { useFirebaseStore, type Service } from '@/stores/firebaseStore';
import AppInput from "@/components/ui/AppInput.vue";

const firebaseStore = useFirebaseStore();
const showForm = ref(false);
const isEditing = ref(false);
const editingId = ref<string | null>(null);
const form = reactive({ name: '', price: 0, duration: 0 });
const errors = reactive({ name: '', price: '', duration: '' });

onMounted(() => {
  if (firebaseStore.services.length === 0) firebaseStore.fetchServices();
});

function openModal(service: Service | null = null) {
  if (service) {
    isEditing.value = true;
    editingId.value = service.id;
    form.name = service.name;
    form.price = service.price;
    form.duration = service.duration;
  } else {
    isEditing.value = false;
    editingId.value = null;
    resetForm();
  }
  showForm.value = true;
}

function closeModal() {
  showForm.value = false;
  resetForm();
}

function resetForm() {
  form.name = '';
  form.price = 0;
  form.duration = 0;
  errors.name = '';
  errors.price = '';
  errors.duration = '';
}

function validate(): boolean {
  errors.name = form.name.trim() ? '' : 'Xizmat nomini kiriting';
  errors.price = form.price > 0 ? '' : 'Narxni 0 dan katta kiriting';
  errors.duration = form.duration > 0 ? '' : 'Davomiyligini 0 dan katta kiriting';
  return !errors.name && !errors.price && !errors.duration;
}

async function saveService() {
  if (!validate()) return;
  const serviceData = { name: form.name.trim(), price: form.price, duration: form.duration };
  let success = false;
  if (isEditing.value && editingId.value) {
    success = await firebaseStore.updateService(editingId.value, serviceData);
  } else {
    success = await firebaseStore.addService(serviceData);
  }
  if (success) {
    closeModal();
  }
}

async function removeService(id: string) {
  if (confirm("Bu xizmatni o'chirishni tasdiqlaysizmi?")) {
    await firebaseStore.deleteService(id);
  }
}

function formatPrice(p: number) {
  return (p || 0).toLocaleString() + " so'm";
}
</script>