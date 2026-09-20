import { useEffect, useEffectEvent, useRef, useState } from 'react'
import { useTimeouts } from '../../hooks/useTimeouts'
import './futebol.css'

const ACTIONS = [
  { name: 'idle', time: 3000 },
  { name: 'lick', time: 2500 },
  { name: 'stretch', time: 2000 },
  { name: 'sitJump', time: 2000, end: 'sitIdle', endTime: 800 },
  { name: 'jumpLong', time: 1000, end: 'jumpLand', endTime: 400 },
]

function Futebol({ booted, unlockAchievements }) {
  const [state, setState] = useState('walkRight')
  const [ball, setBall] = useState(null)
  const [heart, setHeart] = useState(null)
  const petRef = useRef(null)
  const model = useRef({ x: 50, direction: 1, locked: false, state: 'walkRight', ball: null, lastInteraction: 0, pets: 0 })
  const { schedule } = useTimeouts()

  const transition = (next, locked = true) => {
    model.current.state = next
    model.current.locked = locked
    setState(next)
  }
  const resume = () => transition(model.current.direction === 1 ? 'walkRight' : 'walkLeft', false)
  const wake = () => {
    model.current.lastInteraction = Date.now()
    if (model.current.state === 'sleep') {
      transition('stretch')
      schedule('action', resume, 2000)
    }
  }

  const onFrame = useEffectEvent((elapsed) => {
    const pet = model.current
    const limit = Math.max(0, window.innerWidth - 96)
    if (pet.ball !== null && !pet.locked) {
      const target = Math.min(limit, pet.ball)
      const difference = target - pet.x
      if (Math.abs(difference) < 5) {
        transition('play')
        schedule('action', () => {
          pet.ball = null
          setBall(null)
          resume()
        }, 2000)
      } else {
        pet.direction = Math.sign(difference)
        pet.x += pet.direction * 2 * elapsed
        const next = pet.direction === 1 ? 'walkRight' : 'walkLeft'
        if (pet.state !== next) transition(next, false)
      }
    } else if (!pet.locked) {
      pet.x += pet.direction * 1.2 * elapsed
      if (pet.x >= limit || pet.x <= 0) {
        pet.direction *= -1
        resume()
      }
    }
    pet.x = Math.max(0, Math.min(limit, pet.x))
    if (petRef.current) petRef.current.style.left = `${pet.x}px`
  })

  const onInteraction = useEffectEvent(wake)
  const onDesktopClick = useEffectEvent((event) => {
    if (!event.target.matches('.desktop, .icons')) return
    wake()
    model.current.ball = event.clientX
    setBall({ x: event.clientX })
  })
  const onThink = useEffectEvent(() => {
    const pet = model.current
    if (pet.locked || pet.ball !== null || Math.random() >= 0.4) return
    const action = ACTIONS[Math.floor(Math.random() * ACTIONS.length)]
    transition(action.name)
    schedule('action', () => {
      if (action.end) {
        transition(action.end)
        schedule('action', resume, action.endTime)
      } else resume()
    }, action.time)
  })
  const onSleepCheck = useEffectEvent(() => {
    const pet = model.current
    if (Date.now() - pet.lastInteraction > 12000 && !pet.locked && pet.ball === null) transition('sleep')
  })

  useEffect(() => {
    if (!booted) return
    model.current.lastInteraction = Date.now()
    let frame
    let previous
    const loop = time => {
      const elapsed = previous === undefined ? 1 : Math.min(3, (time - previous) / (1000 / 60))
      previous = time
      onFrame(elapsed)
      frame = requestAnimationFrame(loop)
    }
    frame = requestAnimationFrame(loop)
    const think = setInterval(onThink, 5000)
    const sleep = setInterval(onSleepCheck, 2000)
    window.addEventListener('pointermove', onInteraction)
    window.addEventListener('click', onInteraction)
    window.addEventListener('click', onDesktopClick)
    return () => {
      cancelAnimationFrame(frame)
      clearInterval(think)
      clearInterval(sleep)
      window.removeEventListener('pointermove', onInteraction)
      window.removeEventListener('click', onInteraction)
      window.removeEventListener('click', onDesktopClick)
    }
  }, [booted])

  const petCat = () => {
    const pet = model.current
    if (pet.locked) return
    pet.lastInteraction = Date.now()
    transition('idle')
    pet.pets += 1
    if (pet.pets === 3) unlockAchievements('Melhor Amiga 🐱')
    setHeart(pet.x)
    schedule('heart', () => setHeart(null), 1000)
    schedule('action', resume, 2000)
  }

  if (!booted) return null
  return <>
    <div className="pet" ref={petRef} style={{ left: 50, transform: 'scale(3)' }}>
      <button className={`sprite pet-${state}`} onMouseEnter={petCat} onClick={petCat} aria-label="Fazer carinho na Futebol" />
    </div>
    {ball && <div className="ball" style={{ left: ball.x }} />}
    {heart !== null && <div className="heart" style={{ left: heart }} />}
  </>
}

export default Futebol
