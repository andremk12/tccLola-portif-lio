import { useEffect, useEffectEvent, useRef, useState } from 'react'
import { useTimeouts } from './useTimeouts'

const KONAMI_CODE = ['arrowup', 'arrowdown', 'arrowleft', 'arrowright', 'arrowup', 'arrowdown', 'a']

export function useDesktop() {
  const { schedule } = useTimeouts()
  const [mostrarAviso, setMostrarAviso] = useState(true)
  const [openWindow, setOpenWindow] = useState(null)
  const [toast, setToast] = useState(null)
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [achievements, setAchievements] = useState([])
  const unlocked = useRef(new Set())
  const toastId = useRef(0)
  const [openedWindows, setOpenedWindows] = useState([])
  const [clickCount, setClickCount] = useState(0)
  const clickedSkills = useRef(new Set())
  const [showTerminal, setShowTerminal] = useState(false)
  const [petActive, setPetActive] = useState(false)
  const [showStickers, setShowStickers] = useState(false)
  const [showCanvas, setShowCanvas] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [startMenuOpen, setStartMenuOpen] = useState(false)
  const [booting, setBooting] = useState(false)
  const [booted, setBooted] = useState(false)
  const [battery, setBattery] = useState(100)
  const [wifi, setWifi] = useState(4)
  const clockClicks = useRef({ count: 0, last: 0 })
  const [glitch, setGlitch] = useState(false)
  const bgClicks = useRef(0)
  const [devMode, setDevMode] = useState(false)
  const [desktopTheme, setDesktopTheme] = useState('default')
  const [cursorStyle, setCursorStyle] = useState('default')
  const [backGroundStyle, setBackgroundStyle] = useState('default')
  const customized = useRef(new Set())
  const [matrixMode, setMatrixMode] = useState(false)
  const [raveMode, setRaveMode] = useState(false)
  const [systemLoading, setSystemLoading] = useState(true)
  const [progress, setProgress] = useState(0)

  const showToast = (message, force = false) => {
    if (!notificationsEnabled && !force) return
    setToast({ message, id: ++toastId.current })
    schedule('toast', () => setToast(null), 3000)
  }

  const unlockAchievements = (title) => {
    if (unlocked.current.has(title)) return
    unlocked.current.add(title)
    setAchievements([...unlocked.current])
    showToast(`🏆 Conquista desbloqueada: ${title}`)
  }

  const handleSkillClick = (name) => {
    clickedSkills.current.add(name)
    showToast(`Ferramenta explorada: ${name}`)
    if (clickedSkills.current.size >= 5) unlockAchievements('Mestre das Ferramentas 🎨')
  }

  const handleClick = (item) => {
    setOpenWindow(item)
    setStartMenuOpen(false)
    const opened = openedWindows.includes(item) ? openedWindows : [...openedWindows, item]
    setOpenedWindows(opened)
    setClickCount(clickCount + 1)
    if (item === 'segredo') unlockAchievements('Curioso Investigador 🕵️')
    else showToast(`${item} inciado com sucesso 🚀`)
    if (opened.length >= 3) unlockAchievements('Explorador do Sistema')
    if (clickCount + 1 === 10) unlockAchievements('Cliqueiro Profissional')
  }

  const handleClock = () => {
    const now = Date.now()
    const clicks = clockClicks.current
    clicks.count = now - clicks.last < 1000 ? clicks.count + 1 : 1
    clicks.last = now
    if (clicks.count === 5) {
      clicks.count = 0
      setGlitch(true)
      schedule('glitch', () => setGlitch(false), 1500)
      unlockAchievements('Manipulador do Tempo ⏳')
    }
  }

  const handleBackgroundClick = (event) => {
    if (event.target !== event.currentTarget) return
    bgClicks.current += 1
    if (bgClicks.current === 3) {
      bgClicks.current = 0
      setDevMode(true)
      unlockAchievements('Administrador do Sistema 🛠')
    }
  }

  const closeDevMode = () => {
    setDevMode(false)
    showToast('Modo Desenvolvedor desativado 📴')
  }

  const recordCustomization = (kind) => {
    customized.current.add(kind)
    if (customized.current.size === 3) unlockAchievements('Mestre da Personalização 🎨')
  }
  const handleThemeChange = (value) => { setDesktopTheme(value); recordCustomization('theme') }
  const handleWallpaperChange = (value) => { setBackgroundStyle(value); recordCustomization('wallpaper') }
  const handleCursorChange = (value) => { setCursorStyle(value); recordCustomization('cursor') }

  const handleStart = () => {
    if (booting) return
    if (booted) {
      setStartMenuOpen(value => !value)
      return
    }
    setBooting(true)
    schedule('boot', () => {
      setBooting(false)
      setBooted(true)
      setStartMenuOpen(true)
      unlockAchievements('Sistema incializado 💻')
    }, 2500)
  }

  const toggleNotifications = () => {
    const enabled = !notificationsEnabled
    setNotificationsEnabled(enabled)
    showToast(enabled ? 'Notificações ativadas 🔔' : 'Notificações desativadas 🔕  (a?)', true)
  }

  const onSystemTick = useEffectEvent(() => {
    const next = battery <= 1 ? 100 : battery - 1
    setBattery(next)
    setWifi(Math.max(0, Math.min(4, wifi + (Math.random() > 0.7 ? 1 : -1))))
    if (next === 20) showToast(' ⚠️ Bateria fraca! ')
    if (next === 1) unlockAchievements('Sobrevivente 🔋')
  })
  useEffect(() => {
    const timer = setInterval(onSystemTick, 7000)
    return () => clearInterval(timer)
  }, [])

  const onBootComplete = useEffectEvent(() => {
    setSystemLoading(false)
    const hour = new Date().getHours()
    if (hour >= 6 && hour < 12) showToast('☀️ Bom dia, desenvolvedor!')
    else if (hour >= 12 && hour < 18) showToast('🌤 Boa tarde! Hora de produzir!')
    else if (hour >= 18 && hour < 22) showToast('🌙 Boa noite! Portfólio noturno ativado.')
    else showToast('🌌 Trabalhando de madrugada? Respeito.')
  })
  useEffect(() => {
    let value = 0
    let finish
    const timer = setInterval(() => {
      value = Math.min(100, value + 5)
      setProgress(value)
      if (value === 100) {
        clearInterval(timer)
        finish = setTimeout(onBootComplete, 920)
      }
    }, 120)
    return () => { clearInterval(timer); clearTimeout(finish) }
  }, [])

  const onSecretCode = useEffectEvent(() => {
    setShowTerminal(true)
    unlockAchievements('Hacker do Sistema 💻')
  })
  useEffect(() => {
    let index = 0
    const handleKey = (event) => {
      if (event.target.closest('input, textarea, select, [contenteditable="true"], [data-game]')) return
      const key = event.key.toLowerCase()
      index = key === KONAMI_CODE[index] ? index + 1 : key === KONAMI_CODE[0] ? 1 : 0
      if (index === KONAMI_CODE.length) {
        index = 0
        onSecretCode()
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [])

  return {
    mostrarAviso, setMostrarAviso, openWindow, setOpenWindow, toast,
    notificationsEnabled, toggleNotifications, achievements, openedWindows, clickCount,
    showToast, unlockAchievements, handleSkillClick, handleClick,
    showTerminal, setShowTerminal, petActive, setPetActive, showStickers, setShowStickers,
    showCanvas, setShowCanvas, showForm, setShowForm, startMenuOpen, booting, handleStart,
    battery, wifi, glitch, handleClock, devMode, closeDevMode, handleBackgroundClick,
    desktopTheme, cursorStyle, backGroundStyle, handleThemeChange, handleWallpaperChange,
    handleCursorChange, matrixMode, setMatrixMode, raveMode, setRaveMode, systemLoading, progress,
  }
}
