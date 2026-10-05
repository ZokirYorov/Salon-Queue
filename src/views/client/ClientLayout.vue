<template>
  <div class="min-h-screen flex flex-col bg-slate-50/50 dark:bg-slate-900 transition-colors">
    <AppHeader />
    <main class="flex-1 max-w-6xl w-full mx-auto py-8 px-4 sm:px-6">
      <RouterView v-if="authStore.user" />

      <div v-else class="flex min-h-[60vh] items-center justify-center">
        <div class="w-full max-w-sm rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <span class="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-50 text-teal-600 dark:bg-teal-500/15 dark:text-teal-300">
            <LogIn class="h-7 w-7" />
          </span>
          <h2 class="mt-4 text-lg font-black text-slate-900 dark:text-white">{{ t('auth.requiredTitle') }}</h2>
          <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">{{ t('auth.requiredText') }}</p>
          <div class="mt-6 flex flex-col gap-2">
            <RouterLink
                :to="{ name: 'Login', query: { redirect: route.fullPath } }"
                class="rounded-xl bg-teal-600 py-2.5 text-sm font-bold text-white transition hover:bg-teal-700"
            >
              {{ t('auth.signIn') }}
            </RouterLink>
            <RouterLink
                :to="{ name: 'Register', query: { redirect: route.fullPath } }"
                class="rounded-xl bg-slate-100 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
            >
              {{ t('auth.signUp') }}
            </RouterLink>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { RouterLink, RouterView, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { LogIn } from 'lucide-vue-next'
import AppHeader from '@/components/AppHeader.vue'
import { useAuthStore } from '@/stores/auth'

const { t } = useI18n()
const route = useRoute()
const authStore = useAuthStore()
</script>
