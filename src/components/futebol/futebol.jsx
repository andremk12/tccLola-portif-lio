import { use, useEffect, useState } from "react"
import "./futebol.css"

function Futebol({booted}) {
    
    const [x, setX] = useState(50)
    const [direction, setDirection] = useState(1)
    const [state, setState] = useState("walk")
    const [lastActivity, setLastActivity] = useState(Date.now())
    const [clicks, setClicks] = useState(0)


    useEffect(() => {
        
        if(state !== "walk") return

        const interval = setInterval(() => {
            
            setX(prev => {
                let next = prev + direction * 15

                if(next > window.innerWidth - 80) {
                    setDirection(-1)
                    return prev
                }

                if(next < 0) {
                    setDirection(1)
                    return prev
                }

                return next
            })

        }, 700)

        return ()=>clearInterval(interval)
    }, [direction, state])

    useEffect(() => {
        const handleActivity = () => {
            setLastActivity(Date.now())
            if(state === "sleep") setState("walk")
        }

        window.addEventListener("mousemove", handleActivity)
        window.addEventListener("click", handleActivity)

        return () => {
            window.removeEventListener("mousemove",handleActivity)
            window.removeEventListener("click", handleActivity)

        }
    }, [state])

    useEffect(() => {
        const interval = setInterval(() => {

            if(Date.now() - lastActivity > 8000) {
                setState("sleep")
            }

        }, 2000)

        return () => clearInterval(interval)
    }, [lastActivity])

    useEffect(() => {
        const handleClick = () => {
            setClicks( prev => {
                const next = prev + 1


                if (next > 8){
                    setState("angry")

                    setTimeout(() => {
                        setState("walk")
                        setClicks(0)
                    }, 3000)
                }
                return
            })
        }

        window.addEventListener("click", handleClick)

        return () => window.removeEventListener("click", handleClick)
        
    }, [])

     const sitOnWindow = () => {
        setState("sit")

        setTimeout(()=>{
            setState("walk")
        },4000)
    }

    useEffect(()=>{

        const windows = document.querySelectorAll(".window")

        windows.forEach(w=>{
            w.addEventListener("mouseenter",sitOnWindow)
        })

        return ()=>{
            windows.forEach(w=>{
                w.removeEventListener("mouseenter",sitOnWindow)
            })
        }

    })

    if(!booted) return null

    return (
        <div
            className="pet"
            style={{left:x}}
        >
             🐱
        </div>
    )
}

export default Futebol