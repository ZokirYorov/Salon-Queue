<template>
  <div class="mx-auto max-w-4xl space-y-5 pb-6">
    <header class="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <div
            class="mb-2 inline-flex items-center gap-2 rounded-full bg-teal-50 px-3 py-1 text-xs font-bold text-teal-700 dark:bg-teal-500/10 dark:text-teal-300"
        >
          <span class="h-1.5 w-1.5 rounded-full bg-teal-500" />
          {{ t('support.badge') }}
        </div>
        <h1
            class="text-3xl font-black tracking-tight text-slate-900 dark:text-white"
        >
          {{ t('support.title') }}
        </h1>
        <p
            class="mt-1.5 text-sm font-medium text-slate-500 dark:text-slate-400"
        >
          {{ t('support.subtitle') }}
        </p>
      </div>
      <button
          @click="loadTickets"
          :disabled="loading"
          class="inline-flex w-fit items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-bold text-slate-700 transition hover:border-teal-300 hover:text-teal-700 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
      >
        <RefreshCw
            :class="['h-4 w-4',
             loading && 'animate-spin']"
        />
        {{ t('common.refresh') }}
      </button>
    </header>

    <section
        class="relative overflow-hidden rounded-3xl bg-gradient-to-br from-teal-600 via-teal-600 to-cyan-600 p-6 text-white shadow-lg shadow-teal-900/10 sm:p-8"
    >
      <div class="absolute -right-12 -top-12 h-44 w-44 rounded-full bg-white/10" />
      <div class="absolute -bottom-16 right-24 h-32 w-32 rounded-full bg-cyan-300/10" />
      <div
          class="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between"
      >
        <div class="flex max-w-xl gap-4">
          <div
              class="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/15"
          >
            <MessageCircle class="h-6 w-6" />
          </div>
          <div>
            <h2 class="text-lg font-black">
              {{ t('support.telegramTitle') }}
            </h2>
            <p
                class="mt-1 text-sm leading-6 text-teal-50"
            >
              {{ t('support.telegramText') }}
            </p>
          </div>
        </div>
        <button
            @click="openTelegram"
            :disabled="openingBot"
            class="inline-flex shrink-0 items-center justify-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-black text-teal-700 shadow-sm transition hover:bg-teal-50 disabled:opacity-60"
        >
          <Send class="h-4 w-4" />
          {{ openingBot ? t('support.opening') : t('support.openBot') }}
          <ExternalLink class="h-3.5 w-3.5" />
        </button>
      </div>
    </section>

    <section
        class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800 sm:p-6"
    >
      <div
          class="flex items-center gap-3"
      >
        <div
            class="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-200"
        >
          <History class="h-5 w-5" />
        </div>
        <div>
          <h2
              class="font-black text-slate-900 dark:text-white"
          >
            {{ t('support.myTickets') }}
          </h2>
          <p class="text-sm text-slate-500">
            {{ t('support.ticketsHint') }}
          </p>
        </div>
      </div>
      <p
          v-if="loading"
          class="py-10 text-center text-sm text-slate-400"
      >
        {{ t('support.loading') }}
      </p>
      <div
          v-else-if="!tickets.length"
          class="mt-5 rounded-2xl border border-dashed border-slate-200 py-10 text-center dark:border-slate-700"
      >
        <CircleHelp class="mx-auto h-8 w-8 text-slate-300" />
        <p
            class="mt-2 text-sm font-medium text-slate-500"
        >
          {{ t('support.empty') }}
        </p>
        <button
            @click="openTelegram"
            class="mt-3 text-sm font-bold text-teal-600"
        >
          {{ t('support.writeBot') }}
          <ArrowUpRight class="inline h-4 w-4" />
        </button>
      </div>
      <div v-else class="mt-5 space-y-2">
        <button
            v-for="ticket in tickets"
            :key="ticket.id"
            @click="openTicket(ticket.id)"
            class="group cursor-pointer flex w-full items-center gap-3 rounded-2xl border border-transparent bg-slate-50 p-4 text-left transition hover:border-teal-200 hover:bg-teal-50/50 dark:bg-slate-700/40 dark:hover:border-teal-500/30 dark:hover:bg-teal-500/10"
        >
          <div class="h-9 w-1 shrink-0 rounded-full bg-teal-500/70" />
          <div class="min-w-0 flex-1">
            <p class="truncate text-sm font-black text-slate-800 dark:text-white">
              {{ ticket.subject }}
            </p>
            <p class="mt-1 text-xs text-slate-400">
              {{ date(ticket.updatedAt) }}
            </p>
          </div>
          <span
              :class="['shrink-0 rounded-full px-2.5 py-1 text-xs font-bold',
               statusClass[ticket.status]]"
          >
            {{ t(`support.status.${ticket.status}`) }}
          </span>
          <ArrowUpRight class="h-4 w-4 shrink-0 text-slate-300 transition group-hover:text-teal-600" />
        </button>
      </div>
      <div
          v-if="selected"
          ref="conversationEl"
          class="mt-5 flex h-[calc(100dvh-4.5rem)] scroll-mt-[4.5rem] flex-col overflow-hidden rounded-2xl border border-teal-100 bg-teal-50/40 dark:border-teal-500/20 dark:bg-teal-500/5 sm:h-[calc(100dvh-5.5rem)] sm:scroll-mt-[5.5rem]"
      >
        <div
            class="flex shrink-0 items-center justify-between gap-3 border-b border-teal-100 px-4 py-3 dark:border-teal-500/20"
        >
          <div class="min-w-0">
            <p class="text-xs font-bold uppercase tracking-wide text-teal-600">
              {{ t('support.conversation') }}
            </p>
            <h3 class="truncate font-black text-slate-900 dark:text-white">
              {{ selected.subject }}
            </h3>
          </div>
          <button
              @click="selected = null"
              class="shrink-0 cursor-pointer rounded-lg px-2 py-1 text-xs font-bold text-slate-500 hover:bg-white dark:hover:bg-slate-700"
          >
            {{ t('common.close') }}
          </button>
        </div>
        <div
            ref="messagesEl"
            class="flex-1 space-y-2 overflow-y-auto overscroll-contain p-4"
        >
          <div
              v-for="message in selected?.messages"
              :key="message.id"
              :class="['w-fit max-w-[85%] rounded-2xl p-3 text-sm shadow-sm sm:max-w-[75%]',
               message.sender === 'OPERATOR'
               ? 'mr-auto bg-white text-slate-800 dark:bg-slate-700 dark:text-white'
               : 'ml-auto bg-teal-600 text-white']"
          >
            <p class="whitespace-pre-wrap break-words">{{ message.content }}</p>
            <p class="mt-1 text-[11px] opacity-60">
              {{ message.sender === 'OPERATOR' ? t('support.operator') : t('support.you') }} · {{ date(message.createdAt) }}
            </p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { nextTick, onMounted, ref } from 'vue'
import { ArrowUpRight, CircleHelp, ExternalLink, History, MessageCircle, RefreshCw, Send } from 'lucide-vue-next'
import { useToast } from 'vue-toastification'
import { useI18n } from 'vue-i18n'
import { dateLocale } from '@/i18n'
import { supportApi, type SupportStatus, type SupportTicket } from '@/api/support'

const toast = useToast()
const { t } = useI18n()
const openingBot = ref(false)
const loading = ref(false)
const tickets = ref<SupportTicket[]>([])
const selected = ref<SupportTicket | null>(null)
const conversationEl = ref<HTMLElement | null>(null)
const messagesEl = ref<HTMLElement | null>(null)

const statusClass: Record<SupportStatus, string> = {
  NEW: 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300',
  IN_PROGRESS: 'bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300',
  WAITING_USER: 'bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300',
  RESOLVED: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300',
  CLOSED: 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300',
}

async function loadTickets() {
  loading.value = true
  try {
    tickets.value = (await supportApi.mine()).data.content
  }
  catch {
    toast.error(t('support.loadError'))
  }
  finally {
    loading.value = false
  }
}

async function openTelegram() {
  openingBot.value = true
  try {
    window.location.assign((await supportApi.createTelegramLink()).data.url)
  }
  catch {
    toast.error(t('support.botError'))
  }
  finally {
    openingBot.value = false
  }
}

async function openTicket(id: string) {
  try {
    selected.value = (await supportApi.mineGet(id)).data
    await nextTick()
    // Yozishmalar bloki ekranga to'liq sig'adi: unga scroll qilamiz va oxirgi xabarni ko'rsatamiz
    conversationEl.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    messagesEl.value?.scrollTo({ top: messagesEl.value.scrollHeight })
  }
  catch {
    toast.error(t('support.ticketError'))
  }
}

function date(value: string) {
  return new Date(value).toLocaleString(dateLocale(), {
    dateStyle: 'short', timeStyle: 'short'
  })
}

onMounted(loadTickets)
</script>