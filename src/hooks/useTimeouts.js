import { useCallback, useEffect, useRef } from 'react'

// Named timers replace earlier work (for example, a second toast or animation).
export function useTimeouts() {
  const timers = useRef(new Map())
  const cancel = useCallback((key) => {
    clearTimeout(timers.current.get(key))
    timers.current.delete(key)
  }, [])
  const schedule = useCallback((key, callback, delay) => {
    cancel(key)
    timers.current.set(key, setTimeout(() => {
      timers.current.delete(key)
      callback()
    }, delay))
  }, [cancel])

  useEffect(() => {
    const pending = timers.current
    return () => {
      pending.forEach(clearTimeout)
      pending.clear()
    }
  }, [])

  return { schedule, cancel }
}

