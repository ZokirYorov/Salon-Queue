<template>
  <div class="flex flex-col gap-6">
    <div class="flex justify-between items-center">
      <div>
        <h2 class="text-2xl font-bold text-slate-900">Xodimlar</h2>
        <p class="text-sm text-gray-500">Xodimlar ro'yxati va statistikasi</p>
      </div>
      <button @click="openModal()" class="px-4 py-2 rounded-lg text-sm font-medium text-white bg-indigo-500 hover:bg-indigo-600 transition">
        + Xodim qo'shish
      </button>
    </div>

    <div v-if="firebaseStore.loading && !showForm" class="text-center p-8"><p>Yuklanmoqda...</p></div>

    <div v-else class="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
      <div v-for="emp in firebaseStore.employees" :key="emp.id" class="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition flex flex-col gap-3">
        <div class="flex justify-between">
          <div class="flex gap-3">
            <div class="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold" :style="{ background: emp.color }">
              {{ emp.name.charAt(0) }}
            </div>
            <div>
              <p class="font-semibold break-words">{{ emp.name }}</p>
              <p class="text-xs text-gray-400">{{ emp.role }}</p>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <button @click="openModal(emp)" class="text-gray-500 flex items-center cursor-pointer bg-gray-200 h-7 py-1 px-2 hover:bg-gray-100 rounded">
              O'zgartirish
            </button>
            <button @click="removeEmployee(emp.id)" class="text-red-500 cursor-pointer flex items-center bg-red-200 h-7 px-2 py-1 hover:bg-red-100 rounded">
              O'chirish
            </button>
          </div>
        </div>
        <div class="flex flex-wrap gap-1">
          <span v-if="!emp.services || emp.services.length === 0" class="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">
            Barcha xizmatlar
          </span>
          <span v-for="s in emp.services" :key="s" class="text-xs px-2 py-1 bg-indigo-100 text-indigo-600 rounded-full">
            {{ s }}
          </span>
        </div>
      </div>
    </div>
    <p v-if="!firebaseStore.loading && firebaseStore.employees.length === 0" class="text-center text-gray-400 mt-10">
      Hali xodim yo'q
    </p>
    <div v-if="showForm" class="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex justify-center items-start overflow-y-auto" @click.self="closeModal">
      <div class="w-full m-auto max-w-3xl bg-white rounded-2xl p-6 shadow-xl mt-10">
        <div class="flex justify-between items-center mb-4 border-b border-gray-200 pb-2">
          <div>
            <h3 class="text-lg font-semibold">{{ isEditing ? 'Xodimni tahrirlash' : 'Yangi xodim' }}</h3>
            <p class="text-xs text-gray-500">Xodim ma'lumotlarini kiriting</p>
          </div>
          <button @click="closeModal" class="text-gray-400 hover:text-red-500 text-lg">✕</button>
        </div>
        <div class="flex flex-col gap-4 text-sm">
          <div class="grid grid-cols-2 gap-3">
            <AppInput v-model="form.name" label="Ism Familiya *" placeholder="Ismni kiriting" :external-error="errors.name" @input="errors.name = ''" />
            <AppInput v-model="form.role" label="Lavozim *" placeholder="Lavozimni kiriting" :external-error="errors.role" @input="errors.role = ''" />
          </div>
          <div>
            <label class="text-gray-500 text-xs">Rang</label>
            <div class="flex gap-2 mt-2 flex-wrap">
              <button v-for="c in empColors" :key="c" @click="form.color = c" type="button" class="w-8 h-8 rounded-full border-2" :style="{ background: c }" :class="form.color === c ? 'border-black scale-110' : 'border-transparent'" />
            </div>
          </div>
          <div>
            <label class="text-gray-500 text-xs">Ixtisoslik (Agar hech narsa tanlanmasa, barcha xizmatlarni bajara oladi)</label>
            <div class="flex flex-wrap gap-2 mt-2">
              <label v-for="svc in firebaseStore.services" :key="svc.id" class="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded text-xs cursor-pointer">
                <input type="checkbox" :value="svc.name" v-model="form.services"/>
                {{ svc.name }}
              </label>
            </div>
          </div>
          <p v-if="firebaseStore.error" class="text-red-500 text-xs mt-2">{{ firebaseStore.error }}</p>
          <div class="flex justify-end gap-2 mt-4">
            <button @click="closeModal" class="px-4 py-2 bg-gray-100 rounded-lg">Bekor</button>
            <button @click="saveEmployee" class="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600" :disabled="firebaseStore.loading">
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
import { useFirebaseStore, type Employee } from '@/stores/firebaseStore';
import AppInput from "@/components/ui/AppInput.vue";

const firebaseStore = useFirebaseStore();
const showForm = ref(false);
const isEditing = ref(false);
const editingId = ref<string | null>(null);
const empColors = ['#6366f1', '#0ea5e9', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#ef4444', '#14b8a6'];
const form = reactive({ name: '', role: '', color: '#6366f1', services: [] as string[] });
const errors = reactive({ name: '', role: '' });

onMounted(() => {
  if (firebaseStore.employees.length === 0) firebaseStore.fetchEmployees();
  if (firebaseStore.services.length === 0) firebaseStore.fetchServices();
});

function openModal(employee: Employee | null = null) {
  if (employee) {
    isEditing.value = true;
    editingId.value = employee.id;
    form.name = employee.name;
    form.role = employee.role;
    form.color = employee.color;
    form.services = [...employee.services];
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
  form.role = '';
  form.color = '#6366f1';
  form.services = [];
  errors.name = '';
  errors.role = '';
}

function validate(): boolean {
  errors.name = form.name.trim() ? '' : 'Ism kiritilishi shart';
  errors.role = form.role.trim() ? '' : 'Lavozim kiritilishi shart';
  return !errors.name && !errors.role;
}

async function saveEmployee() {
  if (!validate()) return;
  const employeeData = { name: form.name.trim(), role: form.role.trim(), color: form.color, services: form.services };
  let success = false;
  if (isEditing.value && editingId.value) {
    success = await firebaseStore.updateEmployee(editingId.value, employeeData);
  } else {
    success = await firebaseStore.addEmployee(employeeData);
  }
  if (success) {
    closeModal();
  }
}

async function removeEmployee(id: string) {
  if (confirm("Bu xodimni o'chirishni tasdiqlaysizmi?")) {
    await firebaseStore.deleteEmployee(id);
  }
}
</script>
