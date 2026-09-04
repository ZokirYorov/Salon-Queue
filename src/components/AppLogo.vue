<script setup lang="ts">
const props = withDefaults(defineProps<{
  label?: string
  size?: 'sm' | 'md' | 'lg'
  tone?: 'light' | 'dark'
  showText?: boolean
}>(), {
  label: 'Navbat',
  size: 'md',
  tone: 'dark',
  showText: true,
})

const sizes = {
  sm: {
    mark: 'h-8 w-8 rounded-lg',
    text: 'text-lg',
  },
  md: {
    mark: 'h-10 w-10 rounded-xl',
    text: 'text-xl',
  },
  lg: {
    mark: 'h-12 w-12 rounded-2xl',
    text: 'text-2xl',
  },
}
</script>

<template>
  <div class="flex items-center gap-2.5">
    <span
      :class="[
        'inline-flex flex-shrink-0 items-center justify-center overflow-hidden shadow-lg shadow-teal-900/20',
        sizes[props.size].mark,
      ]"
    >
      <img
        src="/salon-logo.png"
        alt=""
        class="h-full w-full object-cover"
        aria-hidden="true"
      />
    </span>
    <span
      v-if="props.showText"
      :class="[
        'font-black tracking-tight',
        sizes[props.size].text,
        props.tone === 'light' ? 'text-white' : 'text-slate-900 dark:text-white',
      ]"
    >
      {{ props.label }}
    </span>
  </div>
</template>
