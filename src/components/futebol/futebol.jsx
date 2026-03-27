import { useEffect, useRef, useState } from "react"
import "./futebol.css"

function Futebol({ booted,  unlockAchievements}) {

    const [x, setX] = useState(50)
    const [direction, setDirection] = useState(1)
    const [state, setState] = useState("walkRight")
    const [locked, setLocked] = useState(false)
    const [ball, setBall] = useState(null)
    const [lastInteraction, setLastInteraction] = useState(Date.now())
    const [petCount, setPetCount] = useState(0)

    const rafRef = useRef(null)

    /* ---------------- DETECÇÃO DE INTERAÇÃO ---------------- */

    useEffect(() => {

        let lastX = 0
        let lastY = 0

        const wakeUp = () => {
            if (state === "sleep") {
                setState("stretch")

                setTimeout(() => {
                    setLocked(false)
                    setState(direction === 1 ? "walkRight" : "walkLeft")
                }, 2000)
            }
        }

        const handleMove = (e) => {

            const dx = Math.abs(e.clientX - lastX)
            const dy = Math.abs(e.clientY - lastY)

            if (dx > 5 || dy > 5) {
                setLastInteraction(Date.now())
                wakeUp()

                lastX = e.clientX
                lastY = e.clientY
            }
        }

        const handleClick = () => {
            setLastInteraction(Date.now())
            wakeUp()
        }

        window.addEventListener("mousemove", handleMove)
        window.addEventListener("click", handleClick)

        return () => {
            window.removeEventListener("mousemove", handleMove)
            window.removeEventListener("click", handleClick)
        }

    }, [state, direction])



    /* ---------------- LOOP PRINCIPAL ---------------- */

    useEffect(() => {

        const loop = () => {

            setX(prev => {

                // 🔴 PRIORIDADE: BOLA
                if (ball) {

                    const diff = ball.x - prev

                    if (Math.abs(diff) < 5) {

                        if (!locked) {
                            setLocked(true)
                            setState("play")

                            setTimeout(() => {
                                setBall(null)
                                setLocked(false)
                                setState(direction === 1 ? "walkRight" : "walkLeft")
                            }, 2000)
                        }

                        return prev
                    }

                    setState(diff > 0 ? "walkRight" : "walkLeft")

                    return prev + Math.sign(diff) * 2
                }

                // 🔵 MOVIMENTO NORMAL
                if (!locked && state !== "sleep") {

                    let next = prev + direction * 1.2

                    if (next > window.innerWidth - 96) {
                        setDirection(-1)
                        setState("walkLeft")
                        return prev
                    }

                    if (next < 0) {
                        setDirection(1)
                        setState("walkRight")
                        return prev
                    }

                    return next
                }

                return prev
            })

            rafRef.current = requestAnimationFrame(loop)
        }

        rafRef.current = requestAnimationFrame(loop)

        return () => cancelAnimationFrame(rafRef.current)

    }, [ball, direction, locked, state])



    /* ---------------- CLICK → BOLINHA ---------------- */

    useEffect(() => {

        const handleClick = (e) => {

            const isDesktop = e.target.closest(".desktop")
            const isUI = e.target.closest(".icon, .window, .taskbar")

            if (!isDesktop || isUI) return

            setBall({ x: e.clientX })
        }

        window.addEventListener("click", handleClick)

        return () => window.removeEventListener("click", handleClick)

    }, [])



    /* ---------------- IA ---------------- */

    useEffect(() => {

        const interval = setInterval(() => {

            if (locked || ball || state === "sleep") return

            const actions = [
                { name: "idle", time: 3000 },
                { name: "lick", time: 2500 },
                { name: "stretch", time: 2000 },
                { name: "sitJump", time: 2000 }
            ]

            if (Math.random() < 0.4) {

                const action =
                    actions[Math.floor(Math.random() * actions.length)]

                setLocked(true)
                setState(action.name)

                setTimeout(() => {
                    setLocked(false)
                    setState(direction === 1 ? "walkRight" : "walkLeft")
                }, action.time)
            }

        }, 5000)

        return () => clearInterval(interval)

    }, [locked, ball, direction, state])



    /* ---------------- SISTEMA DE SONO ---------------- */

    useEffect(() => {

        const interval = setInterval(() => {

            const idleTime = Date.now() - lastInteraction

            if (idleTime > 12000 && state !== "sleep" && !ball) {
                setLocked(true)
                setState("sleep")
            }

        }, 2000)

        return () => clearInterval(interval)

    }, [lastInteraction, state, ball])



    /* ---------------- CARINHO ---------------- */

    const petCat = () => {

        if (locked) return

        setLocked(true)
        setState("idle")

        setPetCount(prev => {
            const newCount = prev + 1

            if (newCount === 3) {
                unlockAchievements("Melhor Amiga 🐱")
            }

            return newCount
        })

        const heart = document.createElement("div")
        heart.className = "heart"
        heart.style.left = `${x}px`
        document.body.appendChild(heart)

        setTimeout(() => heart.remove(), 1000)

        setTimeout(() => {
            setLocked(false)
            setState(direction === 1 ? "walkRight" : "walkLeft")
        }, 2000)
    }



    if (!booted) return null

    return (
        <>
            <div
                className="pet"
                style={{ left: x, transform: "scale(3)" }}
            >
                <div
                    className={`sprite pet-${state}`}
                    onMouseEnter={petCat}
                />
            </div>

            {ball && (
                <div className="ball" style={{ left: ball.x }} />
            )}
        </>
    )
}

export default Futebol