<template>
  <div class="relative" v-click-outside="() => (open = false)">
    <button
      type="button"
      :aria-label="t('language.label')"
      :title="t('language.label')"
      class="flex h-9 cursor-pointer items-center gap-1 rounded-lg px-2 text-sm font-semibold text-slate-500 transition-colors hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
      @click="open = !open"
    >
      <Globe class="h-5 w-5" />
      <span class="hidden sm:inline">{{ currentShort }}</span>
    </button>

    <div
      v-if="open"
      class="absolute right-0 top-full z-50 mt-2 w-36 rounded-xl border border-slate-200 bg-white py-1 shadow-lg dark:border-slate-700 dark:bg-slate-800"
    >
      <button
        v-for="loc in SUPPORTED_LOCALES"
        :key="loc.code"
        type="button"
        class="flex w-full cursor-pointer items-center justify-between gap-2 px-4 py-2 text-sm text-slate-700 transition-colors hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-700"
        @click="select(loc.code)"
      >
        <span>{{ loc.label }}</span>
        <Check v-if="loc.code === locale" class="h-4 w-4 text-teal-600 dark:text-teal-400" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { Globe, Check } from 'lucide-vue-next'
import { SUPPORTED_LOCALES, setLocale, type SupportedLocale } from '@/i18n'

const { t, locale } = useI18n()
const open = ref(false)

const currentShort = computed(
  () => SUPPORTED_LOCALES.find((l) => l.code === locale.value)?.short ?? 'UZ'
)

function select(code: SupportedLocale) {
  setLocale(code)
  open.value = false
}
</script>
