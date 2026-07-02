<template>
  <div class="flex flex-col gap-6">
    <div class="flex justify-between items-center">
      <div>
        <h2 class="text-2xl font-bold text-slate-900">Xodimlar</h2>
        <p class="text-sm text-gray-500">Xodimlar ro'yxati va statistikasi</p>
      </div>
      <button
          @click="showForm = true"
          class="px-4 py-2 rounded-lg text-sm font-medium text-white bg-indigo-500 hover:bg-indigo-600 transition"
      >
        + Xodim qo'shish
      </button>
    </div>
    <div class="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
      <div
          v-for="emp in store.employees"
          :key="emp.id"
          class="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition flex flex-col gap-3"
      >
        <div class="flex justify-between">
          <div class="flex gap-3">
            <div
                class="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold"
                :style="{ background: emp.color }"
            >
              {{ emp.name.charAt(0) }}
            </div>
            <div>
              <p class="font-semibold break-words">{{ emp.name }}</p>
              <p class="text-xs text-gray-400">{{ emp.role }}</p>
              <p class="text-xs text-gray-400">{{ emp.phone || '-' }}</p>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <button
                @click="editUserItem(emp)"
                class="text-gray-500 flex items-center cursor-pointer bg-gray-200 h-7 py-1 px-2 hover:bg-gray-100 rounded"
            >
              O'zgartirish
            </button>
            <button
                @click="remove(emp.id)"
                class="text-red-500 cursor-pointer flex items-center bg-red-200 h-7 px-2 py-1 hover:bg-red-100 rounded"
            >
              O'chirish
            </button>
          </div>
        </div>
        <div class="flex flex-wrap gap-1">
          <span
              v-if="!emp.services.length"
              class="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full"
          >
            Barcha xizmatlar
          </span>
          <span
              v-for="s in emp.services"
              :key="s"
              class="text-xs px-2 py-1 bg-indigo-100 text-indigo-600 rounded-full"
          >
            {{ s }}
          </span>
        </div>
        <div class="flex justify-between text-center border-t border-gray-200 pt-2 text-xs">
          <div>
            <p class="font-bold text-indigo-500">
              {{ store.busyCount(emp.id, store.today) }}
            </p>
            <p class="text-gray-400">Bugun</p>
          </div>

          <div>
            <p class="font-bold text-indigo-500">
              {{ totalCount(emp.id) }}
            </p>
            <p class="text-gray-400">Jami</p>
          </div>
          <div>
            <p class="font-bold text-indigo-500">
              {{ doneCount(emp.id) }}
            </p>
            <p class="text-gray-400">Bajarilgan</p>
          </div>
        </div>
      </div>
    </div>
    <p v-if="store.employees.length === 0" class="text-center text-gray-400 mt-10">
      Hali xodim yo'q
    </p>
    <div
        v-if="showForm"
        class="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex justify-center items-start overflow-y-auto"
        @click.self="closeModal"
    >
      <div class="w-full m-auto max-w-3xl bg-white rounded-2xl p-6 shadow-xl">
        <div class="flex justify-between items-center mb-4 border-b border-gray-200 pb-2">
          <div>
            <h3 class="text-lg font-semibold">Yangi xodim</h3>
            <p class="text-xs text-gray-500">Xodim ma'lumotlarini kiriting</p>
          </div>
          <button
              @click="closeModal"
              class="text-gray-400 hover:text-red-500 text-lg"
          >
            ✕
          </button>
        </div>
        <div class="flex flex-col gap-4 text-sm">
          <div class="grid grid-cols-2 gap-3">
            <AppInput
                v-model="form.name"
                label="Ism Familiya *"
                placeholder="Ismni kiriting"
                :externalError="errors.name"
            />
            <AppInput
                v-model="form.role"
                label="Lavozim *"
                placeholder="Lavozimni kiriting"
                :externalError="errors.role"
            />
          </div>
          <AppInput
              v-model="form.phone"
              label="Telefon *"
              placeholder="+998 ..."
              :externalError="errors.phone"
          />
          <div>
            <label class="text-gray-500 text-xs">Rang</label>
            <div class="flex gap-2 mt-2 flex-wrap">
              <button
                  v-for="c in empColors"
                  :key="c"
                  @click="form.color = c"
                  type="button"
                  class="w-8 h-8 rounded-full border-2"
                  :style="{ background: c }"
                  :class="form.color === c ? 'border-black scale-110' : 'border-transparent'"
              />
            </div>
          </div>
          <div>
            <label class="text-gray-500 text-xs">Ixtisoslik</label>
            <div class="flex flex-wrap gap-2 mt-2">
              <label
                  v-for="svc in store.services"
                  :key="svc.name"
                  class="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded text-xs cursor-pointer"
              >
                <input type="checkbox" :value="svc.name" v-model="form.services"/>
                {{ svc.name }}
              </label>
            </div>
          </div>
          <div class="flex justify-end gap-2 mt-4">
            <button
                @click="closeModal"
                class="px-4 py-2 bg-gray-100 rounded-lg"
            >
              Bekor
            </button>

            <button
                @click="save"
                class="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600"
            >
              Saqlash
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useSalonStore } from '@/stores/salonStore'
import { Employee } from "@/typeModules/useModules";
import AppDatePicker from "@/components/AppDatePicker.vue";
import AppInput from "@/components/ui/AppInput.vue";

const store = useSalonStore()

const showForm = ref(false)

function closeModal() {
  showForm.value = false
  resetForm()
}

const empColors = ['#6366f1', '#0ea5e9', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#ef4444', '#14b8a6']

const form = reactive({
  name: '',
  role: '',
  phone: '',
  color: '#6366f1',
  services: [] as string[],
})

const errors = reactive({ name: '', role: '', phone: '' })

function validate(): boolean {
  errors.name = form.name.trim() ? '' : 'Ism kiritilishi shart'
  errors.role = form.role.trim() ? '' : 'Lavozim kiritilishi shart'
  errors.phone = form.phone.trim() ? '' : 'Nomer kiritilishi shart'
  return !errors.name && !errors.role && !errors.phone
}

function save() {
  if (!validate()) return
  store.addEmployee({
    name:     form.name.trim(),
    role:     form.role.trim(),
    phone:    form.phone.trim(),
    color:    form.color,
    services: [...form.services],
  })
  resetForm()
}

function resetForm() {
  form.name     = ''
  form.role     = ''
  form.phone    = ''
  form.color    = '#6366f1'
  form.services = []
  errors.name   = ''
  errors.role   = ''
  errors.phone   = ''
  showForm.value = false
}

function remove(id: number) {
  if (confirm("Xodimni o'chirishni tasdiqlaysizmi?")) {
    store.deleteEmployee(id)
  }
}

const editUserItem = (user: Employee) => {
  alert("Xodim ma'lumotlarini yangilash!")
  console.log('Users',user)
}

function totalCount(empId: number): number {
  return store.bookings.filter(b => b.employeeId === empId).length
}

function doneCount(empId: number): number {
  return store.bookings.filter(b => b.employeeId === empId && b.status === 'Bajarildi').length
}
</script>

<style scoped>

input:focus, select:focus {
  border-color: #6366f1;
  outline: none;
}
</style>
