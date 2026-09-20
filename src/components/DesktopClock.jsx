import { useEffect, useState } from 'react'

export default function DesktopClock({ onClick }) {
  const [time, setTime] = useState(() => new Date())
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])
  return <button className="clock desktop-button" onClick={onClick} aria-label="Relógio">
    {time.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
  </button>
}
