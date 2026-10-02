import { createI18n } from 'vue-i18n'
import uz from './locales/uz.json'
import uzCyrl from './locales/uz-Cyrl.json'
import ru from './locales/ru.json'
import en from './locales/en.json'

export type SupportedLocale = 'uz' | 'uz-Cyrl' | 'ru' | 'en'

export const SUPPORTED_LOCALES: { code: SupportedLocale; label: string; short: string }[] = [
  { code: 'uz', label: "O'zbekcha", short: 'UZ' },
  { code: 'uz-Cyrl', label: 'Ўзбекча', short: 'ЎЗ' },
  { code: 'ru', label: 'Русский', short: 'RU' },
  { code: 'en', label: 'English', short: 'EN' },
]

const STORAGE_KEY = 'navbat-locale'

function getInitialLocale(): SupportedLocale {
  const saved = localStorage.getItem(STORAGE_KEY) as SupportedLocale | null
  if (saved && SUPPORTED_LOCALES.some((l) => l.code === saved)) return saved
  return 'uz'
}

const i18n = createI18n({
  legacy: false,
  locale: getInitialLocale(),
  fallbackLocale: 'uz',
  messages: {
    uz,
    'uz-Cyrl': uzCyrl,
    ru,
    en,
  },
})

function htmlLang(locale: string) {
  return locale === 'uz-Cyrl' ? 'uz' : locale
}

export function setLocale(locale: SupportedLocale) {
  i18n.global.locale.value = locale
  localStorage.setItem(STORAGE_KEY, locale)
  document.documentElement.setAttribute('lang', htmlLang(locale))
}

document.documentElement.setAttribute('lang', htmlLang(i18n.global.locale.value as string))

export default i18n

/** Komponentdan tashqarida (utils, store, router) tarjima olish uchun. */
export const t = (key: string, params?: Record<string, unknown>) =>
  params ? i18n.global.t(key, params) : i18n.global.t(key)

/** toLocaleString / toLocaleDateString uchun joriy tilga mos BCP-47 locale. */
export function dateLocale(): string {
  const map: Record<string, string> = { uz: 'uz-UZ', 'uz-Cyrl': 'uz-Cyrl-UZ', ru: 'ru-RU', en: 'en-US' }
  return map[i18n.global.locale.value as string] ?? 'uz-UZ'
}
