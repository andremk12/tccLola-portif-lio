import { useEffect, useEffectEvent, useRef } from 'react'

const dialogs = []

export function useDialog(onClose) {
  const ref = useRef(null)
  const close = useEffectEvent(onClose)

  useEffect(() => {
    const dialog = ref.current
    const opener = document.activeElement

    dialogs.push(dialog)

    const keydown = event => {
      if (dialogs.at(-1) !== dialog) return

      if (event.key === 'Escape') {
        event.preventDefault()
        event.stopImmediatePropagation()
        close()
      }
    }

    document.addEventListener('keydown', keydown, true)

    return () => {
      document.removeEventListener('keydown', keydown, true)

      const index = dialogs.indexOf(dialog)

      if (index !== -1) {
        dialogs.splice(index, 1)
      }

      if (opener?.isConnected) {
        opener.focus()
      }
    }
  }, [])

  return ref
}