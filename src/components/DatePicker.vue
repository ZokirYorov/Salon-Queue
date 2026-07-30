<template>
  <div class="relative" v-click-outside="() => (open = false)">
    <button
      type="button"
      @click="open = !open"
      class="flex items-center gap-2 border border-slate-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg px-3 py-1.5 text-sm hover:border-indigo-400 transition"
    >
      <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
      {{ displayLabel }}
    </button>

    <div
      v-if="open"
      class="absolute left-0 top-full mt-2 z-30 w-72 bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-slate-600 rounded-2xl shadow-xl p-4"
    >
      <div class="flex items-center justify-between mb-3">
        <button type="button" @click="shiftMonth(-1)" class="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>
        </button>
        <p class="text-sm font-semibold text-slate-800 dark:text-white">{{ monthLabel }}</p>
        <button type="button" @click="shiftMonth(1)" class="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
        </button>
      </div>

      <div class="grid grid-cols-7 gap-1 mb-1">
        <span v-for="d in weekdayLabels" :key="d" class="text-[10px] font-bold text-slate-400 text-center py-1">{{ d }}</span>
      </div>

      <div class="grid grid-cols-7 gap-1">
        <span v-for="n in leadingBlanks" :key="'b' + n" />
        <button
          v-for="day in daysInMonth"
          :key="day"
          type="button"
          :disabled="isDisabled(day)"
          @click="pick(day)"
          :class="[
            'h-8 rounded-lg text-xs font-semibold transition',
            isSelected(day) ? 'bg-indigo-600 text-white hover:bg-indigo-700' :
            isDisabled(day) ? 'text-slate-300 dark:text-slate-600 cursor-not-allowed' :
            isToday(day) ? 'border border-indigo-400 text-indigo-600 dark:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-500/10' :
            'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700'
          ]"
        >
          {{ day }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

const props = defineProps<{ modelValue: string; min?: string }>();
const emit = defineEmits<{ 'update:modelValue': [value: string] }>();

const open = ref(false);
const weekdayLabels = ['Ya', 'Du', 'Se', 'Ch', 'Pa', 'Ju', 'Sh'];

function parseIso(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
}
function toIso(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

const selectedDate = computed(() => parseIso(props.modelValue));
const viewMonth = ref(selectedDate.value.getMonth());
const viewYear = ref(selectedDate.value.getFullYear());
const minDate = computed(() => (props.min ? parseIso(props.min) : null));

const monthLabel = computed(() =>
  new Date(viewYear.value, viewMonth.value, 1).toLocaleDateString('uz-UZ', { month: 'long', year: 'numeric' })
);

const daysInMonth = computed(() => new Date(viewYear.value, viewMonth.value + 1, 0).getDate());
const leadingBlanks = computed(() => new Date(viewYear.value, viewMonth.value, 1).getDay());

const displayLabel = computed(() =>
  selectedDate.value.toLocaleDateString('uz-UZ', { day: '2-digit', month: '2-digit', year: 'numeric' })
);

function shiftMonth(delta: number) {
  let m = viewMonth.value + delta;
  let y = viewYear.value;
  if (m < 0) { m = 11; y -= 1; }
  if (m > 11) { m = 0; y += 1; }
  viewMonth.value = m;
  viewYear.value = y;
}

function isSelected(day: number): boolean {
  const d = selectedDate.value;
  return d.getDate() === day && d.getMonth() === viewMonth.value && d.getFullYear() === viewYear.value;
}

function isToday(day: number): boolean {
  const t = new Date();
  return t.getDate() === day && t.getMonth() === viewMonth.value && t.getFullYear() === viewYear.value;
}

function isDisabled(day: number): boolean {
  if (!minDate.value) return false;
  const d = new Date(viewYear.value, viewMonth.value, day);
  const min = new Date(minDate.value.getFullYear(), minDate.value.getMonth(), minDate.value.getDate());
  return d < min;
}

function pick(day: number) {
  if (isDisabled(day)) return;
  const d = new Date(viewYear.value, viewMonth.value, day);
  emit('update:modelValue', toIso(d));
  open.value = false;
}
</script>
