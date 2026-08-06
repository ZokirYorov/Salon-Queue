import { ref } from 'vue'

type Mode = 'login' | 'register'

interface AnchorRect {
  top: number
  right: number
  centerRight: number
}

const isOpen = ref(false)
const mode = ref<Mode>('login')
const anchor = ref<AnchorRect | null>(null)
let successCallback: (() => void) | null = null

export function useAuthModal() {
  function open(opts?: { mode?: Mode; onSuccess?: () => void; anchorEl?: HTMLElement | null }) {
    mode.value = opts?.mode ?? 'login'
    successCallback = opts?.onSuccess ?? null
    if (opts?.anchorEl) {
      const rect = opts.anchorEl.getBoundingClientRect()
      anchor.value = {
        top: rect.bottom + 8,
        right: window.innerWidth - rect.right,
        centerRight: window.innerWidth - (rect.left + rect.width / 2),
      }
    } else {
      anchor.value = null
    }
    isOpen.value = true
  }

  function close() {
    isOpen.value = false
  }

  function handleSuccess() {
    isOpen.value = false
    successCallback?.()
    successCallback = null
  }

  return { isOpen, mode, anchor, open, close, handleSuccess }
}
