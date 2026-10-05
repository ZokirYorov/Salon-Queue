<template>
  <nav
      class="mobile-tabbar fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white/95 backdrop-blur pb-[env(safe-area-inset-bottom)] sm:hidden dark:border-slate-700 dark:bg-slate-900/95"
      :aria-label="t('header.navigation')"
  >
    <div class="grid h-16 grid-cols-4">
      <RouterLink
          v-for="tab in tabs"
          :key="tab.to"
          :to="tab.to"
          :aria-current="isActive(tab.to) ? 'page' : undefined"
          class="flex min-w-0 flex-col items-center justify-center gap-1 px-1 transition-colors"
          :class="isActive(tab.to)
            ? 'text-teal-600 dark:text-teal-400'
            : 'text-slate-500 active:text-teal-600 dark:text-slate-400'"
      >
        <component :is="tab.icon" class="h-5 w-5" :stroke-width="isActive(tab.to) ? 2.4 : 2" />
        <span
            class="w-full truncate text-center text-[11px] leading-none"
            :class="isActive(tab.to) ? 'font-bold' : 'font-medium'"
        >
          {{ tab.label }}
        </span>
      </RouterLink>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { RouterLink, useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { CalendarCheck, CalendarDays, CircleHelp, House } from 'lucide-vue-next';

const { t } = useI18n();
const route = useRoute();

const tabs = computed(() => [
  { to: '/businesses', label: t('header.homeTab'), icon: House },
  { to: '/client/my', label: t('header.myBookings'), icon: CalendarCheck },
  { to: '/client/calendar', label: t('header.calendar'), icon: CalendarDays },
  { to: '/client/support', label: t('header.help'), icon: CircleHelp },
]);

function isActive(prefix: string) {
  return route.path.startsWith(prefix);
}
</script>
