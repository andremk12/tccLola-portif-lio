import { useDialog } from "../../../hooks/useDialog"
import { useEffect, useRef, useState } from "react"
import p5 from "p5"
import { casinoFrames } from "../../../data/casinoFrames"
import "./cassino.css"

function CassinoGame({ onClose }) {
  const dialogRef = useDialog(onClose)

    const containerRef = useRef(null)
    const p5Instance = useRef(null)

    const [loading, setLoading] = useState(true)
    const [progress, setProgress] = useState(0)

    // loading fake estiloso
    useEffect(() => {

        let value = 0
        let finish

        const interval = setInterval(() => {

            value += Math.random() * 12

            if (value >= 100) {

                value = 100
                clearInterval(interval)

                finish = setTimeout(() => {
                    setLoading(false)
                }, 300)

            }

            setProgress(Math.floor(value))

        }, 70)

        return () => { clearInterval(interval); clearTimeout(finish) }

    }, [])

    useEffect(() => {

        if (loading) return
        if (!containerRef.current) return

        const sketch = (p) => {

            let grupo1 = []
            let grupo2 = []
            let grupo3 = []
            let grupo4 = []

            let currentImageIndex = 0
            let currentGroup = 1

            let isLooping = true
            let isDisplayingGroup = false

            let displayDelay = 60
            let lastDisplayTime = 0

            const images = new Map()
            p.preload = () => {
                const groups = casinoFrames.map(paths => paths.map(path => {
                    if (!images.has(path)) images.set(path, p.loadImage(import.meta.env.BASE_URL + path))
                    return images.get(path)
                }))
                ;[grupo1, grupo2, grupo3, grupo4] = groups
            }

            p.setup = () => {

                const canvas = p.createCanvas(1000, 600)
                canvas.parent(containerRef.current)

                p.pixelDensity(1)

                images.forEach(img => img.resize(1000, 600))
                canvas.elt.tabIndex = 0
                canvas.elt.dataset.game = ""
                canvas.elt.setAttribute("aria-label", "Cassino. Espaço ou toque para jogar.")
                canvas.elt.focus()

            }

            p.draw = () => {

                let selectedGroup = grupo1

                if (currentGroup === 2) selectedGroup = grupo2
                if (currentGroup === 3) selectedGroup = grupo3
                if (currentGroup === 4) selectedGroup = grupo4

                p.background(0)

                if (isLooping) {

                    p.image(grupo1[currentImageIndex], 0, 0)

                    if (p.millis() - lastDisplayTime > displayDelay) {

                        currentImageIndex = (currentImageIndex + 1) % grupo1.length
                        lastDisplayTime = p.millis()

                    }

                } else {

                    if (selectedGroup[currentImageIndex]) {
                        p.image(selectedGroup[currentImageIndex], 0, 0)
                    }

                    if (isDisplayingGroup) {

                        if (p.millis() - lastDisplayTime > displayDelay) {

                            currentImageIndex++
                            lastDisplayTime = p.millis()

                            if (currentImageIndex >= selectedGroup.length) {

                                currentImageIndex = selectedGroup.length - 1
                                isDisplayingGroup = false

                            }
                        }
                    }
                }
            }

            const play = () => {

                {

                    if (isLooping) {

                        isLooping = false
                        isDisplayingGroup = true
                        currentImageIndex = 0

                        const randomValue = p.random()

                        if (randomValue < 0.6) currentGroup = 4
                        else if (randomValue < 0.85) currentGroup = 3
                        else currentGroup = 2

                    } else {

                        isLooping = true
                        isDisplayingGroup = false
                        currentImageIndex = 0
                        currentGroup = 1

                    }
                }
            }
            p.keyPressed = () => {
                if (document.activeElement === p.canvas && p.key === " ") { play(); return false }
            }
            p.mousePressed = event => {
                if (event.target === p.canvas) { p.canvas.focus(); play(); return false }
            }
            p.touchStarted = event => {
                if (event.target === p.canvas) { p.canvas.focus(); play(); return false }
            }

        }

        // criar p5
        p5Instance.current = new p5(sketch, containerRef.current)

        return () => {

            if (p5Instance.current) {
                p5Instance.current.remove()
            }

        }

    }, [loading])

    return (

        <div ref={dialogRef} tabIndex={-1} role="dialog" aria-modal="true" aria-label="Cassino" className="cassino-overlay">

            <div className="cassino-header">
                <span>Cassino.exe</span>
                <button aria-label="Fechar Cassino" onClick={onClose}>X</button>
            </div>

            {loading ? (

                <div className="cassino-loading">

                    <div>INITIALIZING CASINO.EXE</div>

                    <div className="loading-bar">
                        <div
                            className="loading-fill"
                            style={{ width: `${progress}%` }}
                        />
                    </div>

                    <div>{progress}%</div>

                </div>

            ) : (

                <div ref={containerRef} className="cassino-game"></div>

            )}

        </div>
    )
}

export default CassinoGame
