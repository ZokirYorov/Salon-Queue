<template>
  <div class="flex flex-col gap-6">
    <div class="flex justify-between items-center">
      <div>
        <h2 class="text-2xl font-bold text-slate-900">Xizmatlar</h2>
        <p class="text-sm text-gray-500">Salon xizmatlarini boshqaring</p>
      </div>
      <button
          @click="showForm = true"
          class="px-4 py-2 bg-indigo-500 text-white rounded-lg text-sm hover:bg-indigo-600 transition"
      >
        + Xizmat qo‘shish
      </button>
    </div>
    <div class="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      <div
          v-for="svc in services"
          :key="svc.id"
          class="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition flex flex-col gap-3"
      >
        <div class="flex justify-between items-start">
          <div>
            <p class="font-semibold text-slate-800">{{ svc.name }}</p>
            <p class="text-xs text-gray-400">{{ svc.duration }} min</p>
          </div>
          <div class="flex items-center gap-1">
            <button
                @click="removeService(svc.id)"
                class="text-gray-500 bg-gray-200 hover:bg-gray-100 cursor-pointer px-2 py-1 rounded"
            >
              O'zgartirish
            </button>
            <button
                @click="removeService(svc.id)"
                class="text-red-500 bg-red-200 hover:bg-red-100 cursor-pointer px-2 py-1 rounded"
            >
              O'chirish
            </button>
          </div>
        </div>
        <div class="flex items-center justify-between">
          <span class="text-lg font-bold text-indigo-600">
            {{ formatPrice(svc.price) }}
          </span>
          <span class="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700">
            Aktiv
          </span>
        </div>
      </div>
    </div>
    <p v-if="services.length === 0" class="text-center text-gray-400 mt-10">
      Hali xizmatlar yo‘q
    </p>
    <div
        v-if="showForm"
        class="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex justify-center items-center"
        @click.self="closeModal"
    >
      <div class="bg-white w-full max-w-md rounded-2xl p-6 shadow-xl">
        <div class="flex justify-between items-center mb-4 border-b pb-2">
          <h3 class="text-lg font-semibold">Yangi xizmat</h3>
          <button @click="closeModal" class="text-gray-400 hover:text-red-500">✕</button>
        </div>
        <div class="flex flex-col gap-4 text-sm">
          <div>
            <label class="text-xs text-gray-500">Xizmat nomi *</label>
            <input
                v-model="form.name"
                @input="errors.name = ''"
                class="w-full border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400"
                :class="errors.name && 'border-red-400'"
                placeholder="Masalan: Soch olish"
            />
            <p v-if="errors.name" class="text-red-500 text-xs">{{ errors.name }}</p>
          </div>
          <div>
            <label class="text-xs text-gray-500">Narxi *</label>
            <input
                type="number"
                v-model="form.price"
                @input="errors.price = ''"
                class="w-full border border-gray-200 rounded-lg px-3 py-2"
                placeholder="50000"
            />
          </div>
          <div>
            <label class="text-xs text-gray-500">Davomiyligi (min) *</label>
            <input
                type="number"
                v-model="form.duration"
                @input="errors.duration = ''"
                class="w-full border border-gray-200 rounded-lg px-3 py-2"
                :class="errors.duration && 'border-red-400'"
                placeholder="30"
            />
            <p v-if="errors.duration" class="text-red-500 text-xs">{{ errors.duration }}</p>
          </div>
          <div class="flex justify-end gap-2 mt-2">
            <button @click="closeModal" class="px-4 py-2 bg-gray-100 rounded-lg">
              Bekor
            </button>
            <button
                @click="saveService"
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

interface Service {
  id: number
  name: string
  price: number
  duration: number
}

const services = ref<Service[]>([])

const showForm = ref(false)

const form = reactive({
  name: '',
  price: 0,
  duration: 0
})

const errors = reactive({
  name: '',
  price: '',
  duration: ''
})

function validate() {
  errors.name = form.name ? '' : 'Nom kiriting'
  errors.duration = form.duration > 0 ? '' : 'Vaqt kiriting'

  return !errors.name && !errors.price && !errors.duration
}

function saveService() {
  if (!validate()) return

  services.value.push({
    id: Date.now(),
    name: form.name,
    price: form.price,
    duration: form.duration
  })

  closeModal()
}

function removeService(id: number) {
  services.value = services.value.filter(s => s.id !== id)
}

function closeModal() {
  showForm.value = false

  form.name = ''
  form.price = 0
  form.duration = 0

  errors.name = ''
  errors.price = ''
  errors.duration = ''
}

function formatPrice(p: number) {
  return p.toLocaleString() + " so'm"
}
</script>