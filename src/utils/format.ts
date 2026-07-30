export function formatPrice(price: number): string {
  return price.toLocaleString('uz-UZ') + " so'm"
}

export function formatDate(dateStr: string): string {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`
}

const STATUS_LABELS: Record<string, string> = {
  PENDING: 'Kutilmoqda',
  CONFIRMED: 'Tasdiqlandi',
  IN_PROGRESS: 'Jarayonda',
  COMPLETED: 'Bajarildi',
  CANCELLED_BY_CUSTOMER: 'Bekor qilindi',
  CANCELLED_BY_BUSINESS: 'Biznes tomonidan bekor qilindi',
  NO_SHOW: 'Kelmadi',
}

const STATUS_CLASSES: Record<string, string> = {
  PENDING: 'bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300',
  CONFIRMED: 'bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300',
  IN_PROGRESS: 'bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300',
  COMPLETED: 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300',
  CANCELLED_BY_CUSTOMER: 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300',
  CANCELLED_BY_BUSINESS: 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300',
  NO_SHOW: 'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-300',
}

export function statusLabel(status: string): string {
  return STATUS_LABELS[status] ?? status
}

export function statusClass(status: string): string {
  return STATUS_CLASSES[status] ?? 'bg-slate-100 text-slate-600'
}

const STATUS_BORDER_CLASSES: Record<string, string> = {
  PENDING: 'border-l-amber-400',
  CONFIRMED: 'border-l-blue-500',
  IN_PROGRESS: 'border-l-indigo-500',
  COMPLETED: 'border-l-emerald-500',
  CANCELLED_BY_CUSTOMER: 'border-l-slate-300',
  CANCELLED_BY_BUSINESS: 'border-l-slate-300',
  NO_SHOW: 'border-l-red-400',
}

export function statusBorderClass(status: string): string {
  return STATUS_BORDER_CLASSES[status] ?? 'border-l-slate-300'
}
