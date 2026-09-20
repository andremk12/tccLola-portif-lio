import { useEffect, useEffectEvent, useRef } from 'react'

const dialogs = []
const focusableSelector = 'button:not(:disabled), a[href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex="0"]'

// Stacked windows share one keyboard owner; closing a child restores its opener.
export function useDialog(onClose) {
  const ref = useRef(null)
  const close = useEffectEvent(onClose)
  useEffect(() => {
    const dialog = ref.current
    const opener = document.activeElement
    dialogs.push(dialog)
    const focusable = () => [...dialog.querySelectorAll(focusableSelector)].filter(node => node.getClientRects().length > 0)
    const frame = requestAnimationFrame(() => {
      if (!dialog.contains(document.activeElement)) (focusable()[0] || dialog).focus()
    })
    const keydown = event => {
      if (dialogs.at(-1) !== dialog) return
      if (event.key === 'Escape') {
        event.preventDefault()
        event.stopImmediatePropagation()
        close()
      } else if (event.key === 'Tab') {
        const elements = focusable()
        const first = elements[0] || dialog
        const last = elements.at(-1) || dialog
        if (!dialog.contains(document.activeElement)) {
          event.preventDefault()
          first.focus()
        } else if (event.shiftKey && document.activeElement === first) {
          event.preventDefault()
          last.focus()
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault()
          first.focus()
        }
      }
    }
    document.addEventListener('keydown', keydown, true)
    return () => {
      cancelAnimationFrame(frame)
      document.removeEventListener('keydown', keydown, true)
      dialogs.splice(dialogs.indexOf(dialog), 1)
      if (opener?.isConnected) opener.focus()
    }
  }, [])
  return ref
}
