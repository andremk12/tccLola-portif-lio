import "./canvas.css"
import { useRef, useState } from "react"

function Canvas({ onClose, unlockAchievements }) {

    const canvasRef = useRef(null)

    const [drawing, setDrawing] = useState(false)
    const [color, setColor] = useState("#000000")
    const [size, setSize] = useState(3)
    const [tool, setTool] = useState("brush")
    const [drawCount, setDrawCount] = useState(0)

    const startDraw = (e) => {

        const canvas = canvasRef.current
        const ctx = canvas.getContext("2d")

        ctx.beginPath()
        ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY)

        setDrawing(true)
    }

    const spray = (x, y) => {

            const canvas = canvasRef.current
            const ctx = canvas.getContext("2d")

            const density = 30
            const radius = size * 2

            for (let i = 0; i < density; i++) {

                const offsetX = (Math.random() - 0.5) * radius
                const offsetY = (Math.random() - 0.5) * radius

                ctx.fillStyle = color

                ctx.fillRect(
                    x + offsetX,
                    y + offsetY,
                    1,
                    1
                )
            }
        }

   const draw = (e) => {

        if (!drawing) return

        const canvas = canvasRef.current
        const ctx = canvas.getContext("2d")

        const x = e.nativeEvent.offsetX
        const y = e.nativeEvent.offsetY

        ctx.lineCap = "round"

        if (tool === "eraser") {

            ctx.globalCompositeOperation = "destination-out"
            ctx.lineWidth = size

            ctx.lineTo(x, y)
            ctx.stroke()

        }

        else if (tool === "pixo") {

            ctx.globalCompositeOperation = "source-over"
            spray(x, y)

        }

        else {

            ctx.globalCompositeOperation = "source-over"
            ctx.strokeStyle = color
            ctx.lineWidth = size

            ctx.lineTo(x, y)
            ctx.stroke()

        }

        setDrawCount(prev => {

            const newCount = prev + 1

            if (newCount === 200) {
                unlockAchievements?.("Artista do Caos 🔥")
            }

            return newCount
        })
    }

    const stopDraw = () => {
        setDrawing(false)
    }

    const clearCanvas = () => {

        const canvas = canvasRef.current
        const ctx = canvas.getContext("2d")

        ctx.clearRect(0, 0, canvas.width, canvas.height)
    }

    return (

        <div className="canvas-overlay">

            <div className="paint-window">


                <div className="paint-titlebar">
                    <span>Geração Zee Paint</span>
                    <button onClick={onClose}>✕</button>
                </div>


                <div className="paint-toolbar">

                    <button
                        className={tool === "brush" ? "active" : ""}
                        onClick={() => setTool("brush")}
                    >
                        🖌
                    </button>

                    <button
                        className={tool === "eraser" ? "active" : ""}
                        onClick={() => setTool("eraser")}
                    >
                        🧽
                    </button>

                    <button
                      className={tool === "pixo" ? "active" : ""}
                      onClick={() => setTool("pixo")}
                    >
                        🧴
                    </button>

                    <button onClick={clearCanvas}>
                        🧹
                    </button>

                    <div className="brush-control">

                        <span>Espessura</span>

                        <input
                            type="range"
                            min="1"
                            max="30"
                            value={size}
                            onChange={(e) => setSize(Number(e.target.value))}
                        />

                    </div>

                </div>


                <div className="paint-canvas-area">

                    <canvas
                        ref={canvasRef}
                        width={700}
                        height={400}
                        className={`paint-canvas ${tool==="pixo" ? "pixo" : ""}`}
                        onMouseDown={startDraw}
                        onMouseMove={draw}
                        onMouseUp={stopDraw}
                        onMouseLeave={stopDraw}
                    />

                </div>


                <div className="paint-colors">

                    <button style={{ background: "#000" }} onClick={() => setColor("#000")} />
                    <button style={{ background: "#ff0000" }} onClick={() => setColor("#ff0000")} />
                    <button style={{ background: "#00ff00" }} onClick={() => setColor("#00ff00")} />
                    <button style={{ background: "#0000ff" }} onClick={() => setColor("#0000ff")} />
                    <button style={{ background: "#ffff00" }} onClick={() => setColor("#ffff00")} />
                    <button style={{ background: "#ff00ff" }} onClick={() => setColor("#ff00ff")} />
                    <button style={{ background: "#00ffff" }} onClick={() => setColor("#00ffff")} />

                    <input
                        type="color"
                        value={color}
                        onChange={(e) => setColor(e.target.value)}
                        className="color-picker"
                    />

                </div>

            </div>

        </div>
    )
}

export default Canvas