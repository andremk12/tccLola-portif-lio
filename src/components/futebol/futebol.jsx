import { useEffect, useState } from "react"
import "./futebol.css"

function Futebol({ booted }) {

    const [x, setX] = useState(50)
    const [direction, setDirection] = useState(1)
    const [state, setState] = useState("walk")
    const [lastActivity, setLastActivity] = useState(Date.now())

    /* ---------------- MOVIMENTO ---------------- */

    useEffect(() => {

        if (state !== "walk") return

        const interval = setInterval(() => {

            setX(prev => {

                let next = prev + direction * 15

                if (next > window.innerWidth - 96) {
                    setDirection(-1)
                    return prev
                }

                if (next < 0) {
                    setDirection(1)
                    return prev
                }

                return next

            })

        }, 400)

        return () => clearInterval(interval)

    }, [direction, state])



    /* ---------------- IA DO GATO ---------------- */

    useEffect(() => {

        const interval = setInterval(() => {

            if (state !== "walk") return

            const actions = [
                "idle",
                "sit",
                "lie",
                "stretch",
                "jump"
            ]

            if (Math.random() < 0.35) {

                const action =
                    actions[Math.floor(Math.random() * actions.length)]

                setState(action)

                setTimeout(() => {
                    setState("walk")
                }, 2500)

            }

        }, 5000)

        return () => clearInterval(interval)

    }, [state])



    /* ---------------- DORMIR ---------------- */

    useEffect(() => {

        const interval = setInterval(() => {

            if (Date.now() - lastActivity > 12000 && state !== "sleep") {

                setState("sleep")

            }

        }, 2000)

        return () => clearInterval(interval)

    }, [lastActivity, state])



    /* ---------------- ACORDAR ---------------- */

    useEffect(() => {

        const handleActivity = () => {

            setLastActivity(Date.now())

            if (state === "sleep") {

                setState("stretch")

                setTimeout(() => {
                    setState("walk")
                }, 2000)

            }

        }

        window.addEventListener("mousemove", handleActivity)
        window.addEventListener("click", handleActivity)

        return () => {

            window.removeEventListener("mousemove", handleActivity)
            window.removeEventListener("click", handleActivity)

        }

    }, [state])



    /* ---------------- SENTAR EM JANELAS ---------------- */

    const sitOnWindow = () => {

        if(state !== "walk") return

        setState("sit")

        setTimeout(()=>{
            setState("walk")
        },4000)

}

    useEffect(() => {

        const windows = document.querySelectorAll(".window")

        windows.forEach(w => {

            w.addEventListener("mouseenter", sitOnWindow)

        })

        return () => {

            windows.forEach(w => {

                w.removeEventListener("mouseenter", sitOnWindow)

            })

        }

    }, [])

    const petCat = () => {

        if(state === "sleep" || state === "jump") return

        setState("idle2")

        setTimeout(()=>{
            setState("walk")
        },2000)

    }


    if (!booted) return null



    return (

        <div
            className={`pet ${direction === -1 ? "flip" : ""}`}
            style={{ left: x }}
        >

            <div className={`sprite pet-${state}`} onMouseEnter = {petCat} />

        </div>

    )

}

export default Futebol