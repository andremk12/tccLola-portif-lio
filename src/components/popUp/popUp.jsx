import { useDialog } from "../../hooks/useDialog"
import './popUp.css'
import { Minus, Square, X, Pin } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import CurriculumWindow from '../windows/curriculum/curriculum'
import ContactContent from '../windows/contact/contact'
import Projects from '../windows/projects/projects'
import Works from '../works/works'
import Customize from '../customize/customize'
import SecretWindow from '../windows/segredo/segredo'

function PopUp({ type, onClose, unlockAchievements, setDesktopTheme, setCursorStyle, setBackgroundStyle, theme, currentCursor, currentWallpaper }) {
  const dialogRef = useDialog(onClose)
  const [windowState, setWindowState] = useState('normal')
  const [locked, setLocked] = useState(false)
  const windowRef = useRef(null)
  const drag = useRef(null)
  const large = type !== 'Contatos'
  const [position, setPosition] = useState(() => ({
    x: Math.max(8, (window.innerWidth - Math.min(large ? 1000 : 500, window.innerWidth - 16)) / 2),
    y: Math.max(8, (window.innerHeight - Math.min(large ? 660 : 400, window.innerHeight - 16)) / 2),
  }))
  const maximized = windowState === 'maximized'

  const centerWindow = () => {
    const rect = windowRef.current.getBoundingClientRect()
    setPosition({ x: Math.max(8, (window.innerWidth - rect.width) / 2), y: Math.max(8, (window.innerHeight - rect.height) / 2) })
  }

  useEffect(() => {
    const fitWindow = () => {
      const rect = windowRef.current.getBoundingClientRect()
      setPosition(current => ({
        x: Math.max(0, Math.min(current.x, window.innerWidth - rect.width)),
        y: Math.max(0, Math.min(current.y, window.innerHeight - rect.height)),
      }))
    }
    window.addEventListener('resize', fitWindow)
    return () => window.removeEventListener('resize', fitWindow)
  }, [])

  const startDrag = (event) => {
    if (maximized || locked || event.button !== 0 || event.target.closest('button')) return
    event.currentTarget.setPointerCapture(event.pointerId)
    drag.current = { x: event.clientX - position.x, y: event.clientY - position.y }
  }

  const moveDrag = (event) => {
    if (!drag.current) return
    const rect = windowRef.current.getBoundingClientRect()
    setPosition({
      x: Math.max(0, Math.min(event.clientX - drag.current.x, window.innerWidth - rect.width)),
      y: Math.max(0, Math.min(event.clientY - drag.current.y, window.innerHeight - rect.height)),
    })
  }

  const renderContent = () => {
    switch (type) {
      case 'Curriculum': return <CurriculumWindow theme={theme} />
      case 'Contatos': return <ContactContent theme={theme} />
      case 'Projetos': return <Projects theme={theme} />
      case 'Trabalhos': return <Works unlockAchievements={unlockAchievements} theme={theme} />
      case 'Personalizar': return <Customize setDesktopTheme={setDesktopTheme} setCursorStyle={setCursorStyle} setBackgroundStyle={setBackgroundStyle} theme={theme} currentWallpaper={currentWallpaper} currentCursor={currentCursor} />
      case 'segredo': return <SecretWindow unlockAchievements={unlockAchievements} />
      default: return null
    }
  }

  return (
    <div ref={dialogRef} tabIndex={-1} className="window-overlay">
      <section ref={windowRef} className={`window ${maximized ? 'window-maximized' : large ? 'window-large' : 'window-normal'} theme-${theme}`}
        role="dialog" aria-modal="true" aria-label={type}
        style={{ position: 'fixed', top: maximized ? 0 : position.y, left: maximized ? 0 : position.x }}>
        <div className="window-header" onPointerDown={startDrag} onPointerMove={moveDrag}
          onPointerUp={() => { drag.current = null }} onPointerCancel={() => { drag.current = null }}
          onLostPointerCapture={() => { drag.current = null }} style={{ cursor: maximized || locked ? 'default' : 'grab' }}>
          <span className="window-title">{type}</span>
          <div className="window-controls">
            <button className={`control-btn ${locked ? 'locked' : ''}`} aria-label={locked ? 'Destravar janela' : 'Fixar janela'} aria-pressed={locked}
              onClick={() => { setLocked(!locked); if (!locked) centerWindow() }}><Pin size={14} /></button>
            <button className="control-btn minimize" aria-label="Restaurar tamanho" onClick={() => setWindowState('normal')}><Minus size={14} /></button>
            <button className="control-btn maximize" aria-label={maximized ? 'Restaurar janela' : 'Maximizar janela'} onClick={() => setWindowState(maximized ? 'normal' : 'maximized')}><Square size={14} /></button>
            <button className="control-btn close" aria-label="Fechar janela" onClick={onClose}><X size={14} /></button>
          </div>
        </div>
        <div className={`window-content${type === 'Contatos' ? ' window-content--contacts' : type === 'segredo' ? ' window-content--secret' : ''}`}>{renderContent()}</div>
      </section>
    </div>
  )
}

export default PopUp
