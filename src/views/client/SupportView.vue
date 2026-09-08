<template>
  <div class="mx-auto max-w-4xl space-y-5 pb-6">
    <header class="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <div
            class="mb-2 inline-flex items-center gap-2 rounded-full bg-teal-50 px-3 py-1 text-xs font-bold text-teal-700 dark:bg-teal-500/10 dark:text-teal-300"
        >
          <span class="h-1.5 w-1.5 rounded-full bg-teal-500" />
          Yordam markazi
        </div>
        <h1
            class="text-3xl font-black tracking-tight text-slate-900 dark:text-white"
        >
          Qanday yordam bera olamiz?
        </h1>
        <p
            class="mt-1.5 text-sm font-medium text-slate-500 dark:text-slate-400"
        >
          Telegram orqali yozing, javob va jarayon holati shu yerda saqlanadi.
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
        Yangilash
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
              Telegram orqali murojaat qiling
            </h2>
            <p
                class="mt-1 text-sm leading-6 text-teal-50"
            >
              Savol, rasm, ovozli xabar yoki fayl yuboring. Operator javobi bevosita botga keladi.
            </p>
          </div>
        </div>
        <button
            @click="openTelegram"
            :disabled="openingBot"
            class="inline-flex shrink-0 items-center justify-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-black text-teal-700 shadow-sm transition hover:bg-teal-50 disabled:opacity-60"
        >
          <Send class="h-4 w-4" />
          {{ openingBot ? 'Ochilyapti...' : 'Botni ochish' }}
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
            Murojaatlarim
          </h2>
          <p class="text-sm text-slate-500">
            Kartani bosib yozishmalarni oching
          </p>
        </div>
      </div>
      <p
          v-if="loading"
          class="py-10 text-center text-sm text-slate-400"
      >
        Murojaatlar yuklanmoqda...
      </p>
      <div
          v-else-if="!tickets.length"
          class="mt-5 rounded-2xl border border-dashed border-slate-200 py-10 text-center dark:border-slate-700"
      >
        <CircleHelp class="mx-auto h-8 w-8 text-slate-300" />
        <p
            class="mt-2 text-sm font-medium text-slate-500"
        >
          Hali murojaatingiz yo‘q
        </p>
        <button
            @click="openTelegram"
            class="mt-3 text-sm font-bold text-teal-600"
        >
          Bot orqali yozish
          <ArrowUpRight class="inline h-4 w-4" />
        </button>
      </div>
      <div v-else class="mt-5 space-y-2">
        <button
            v-for="ticket in tickets"
            :key="ticket.id"
            @click="openTicket(ticket.id)"
            class="group flex w-full items-center gap-3 rounded-2xl border border-transparent bg-slate-50 p-4 text-left transition hover:border-teal-200 hover:bg-teal-50/50 dark:bg-slate-700/40 dark:hover:border-teal-500/30 dark:hover:bg-teal-500/10"
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
            {{ statusLabel[ticket.status] }}
          </span>
          <ArrowUpRight class="h-4 w-4 shrink-0 text-slate-300 transition group-hover:text-teal-600" />
        </button>
      </div>
      <div
          v-if="selected"
          class="mt-5 rounded-2xl border border-teal-100 bg-teal-50/40 p-4 dark:border-teal-500/20 dark:bg-teal-500/5"
      >
        <div class="flex items-center justify-between gap-3">
          <div class="min-w-0">
            <p class="text-xs font-bold uppercase tracking-wide text-teal-600">
              Yozishma
            </p>
            <h3 class="truncate font-black text-slate-900 dark:text-white">
              {{ selected.subject }}
            </h3>
          </div>
          <button
              @click="selected=null"
              class="rounded-lg px-2 py-1 text-xs font-bold text-slate-500 hover:bg-white dark:hover:bg-slate-700"
          >
            Yopish
          </button>
        </div>
        <div class="mt-4 max-h-80 space-y-2 overflow-y-auto pr-1">
          <div
              v-for="message in selected.messages"
              :key="message.id"
              :class="['rounded-2xl p-3 text-sm shadow-sm',
               message.sender === 'OPERATOR'
               ? 'mr-8 bg-white text-slate-800 dark:bg-slate-700 dark:text-white'
               : 'ml-8 bg-teal-600 text-white']"
          >
            <p>{{ message.content }}</p>
            <p class="mt-1 text-[11px] opacity-60">
              {{ message.sender === 'OPERATOR' ? 'Support' : 'Siz' }} · {{ date(message.createdAt) }}
            </p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { ArrowUpRight, CircleHelp, ExternalLink, History, MessageCircle, RefreshCw, Send } from 'lucide-vue-next'
import { useToast } from 'vue-toastification'
import { supportApi, type SupportStatus, type SupportTicket } from '@/api/support'

const toast = useToast()
const openingBot = ref(false)
const loading = ref(false)
const tickets = ref<SupportTicket[]>([])
const selected = ref<SupportTicket | null>(null)

const statusLabel: Record<SupportStatus, string> = {
  NEW: 'Yangi',
  IN_PROGRESS: 'Jarayonda',
  WAITING_USER: 'Javobingiz kutilmoqda',
  RESOLVED: 'Hal qilindi',
  CLOSED: 'Yopildi',
}
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
    toast.error('Murojaatlar tarixini yuklab bo‘lmadi')
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
    toast.error('Telegram botni ochib bo‘lmadi')
  }
  finally {
    openingBot.value = false
  }
}

async function openTicket(id: string) {
  try {
    selected.value = (await supportApi.mineGet(id)).data
  }
  catch {
    toast.error('Murojaat tafsilotini yuklab bo‘lmadi')
  }
}

function date(value: string) {
  return new Date(value).toLocaleString('uz-UZ', {
    dateStyle: 'short', timeStyle: 'short'
  })
}

onMounted(loadTickets)
</script>