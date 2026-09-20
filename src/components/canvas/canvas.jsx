import { useDialog } from "../../hooks/useDialog"
import "./canvas.css"
import { canvasPoint } from "../../utils/canvas"
import { useRef, useState } from "react"

function Canvas({ onClose, unlockAchievements }) {
  const dialogRef = useDialog(onClose)

    const canvasRef = useRef(null)

    const drawing = useRef(false)
    const [color, setColor] = useState("#000000")
    const [size, setSize] = useState(3)
    const [tool, setTool] = useState("brush")
    const drawCount = useRef(0)
    const getPoint = event => {
        const canvas = canvasRef.current
        const bounds = canvas.getBoundingClientRect()
        return canvasPoint(event.clientX, event.clientY, { left: bounds.left + canvas.clientLeft, top: bounds.top + canvas.clientTop, width: canvas.clientWidth, height: canvas.clientHeight }, canvas.width, canvas.height)
    }


    const startDraw = (e) => {

        const canvas = canvasRef.current
        const ctx = canvas.getContext("2d")

        ctx.beginPath()
        const point = getPoint(e)
        ctx.moveTo(point.x, point.y)
        canvas.setPointerCapture(e.pointerId)

        drawing.current = true
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

        if (!drawing.current) return

        const canvas = canvasRef.current
        const ctx = canvas.getContext("2d")

        const { x, y } = getPoint(e)

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

        drawCount.current += 1
        if (drawCount.current === 200) unlockAchievements("Artista do Caos 🔥")
    }

    const stopDraw = () => {
        drawing.current = false
    }

    const clearCanvas = () => {

        const canvas = canvasRef.current
        const ctx = canvas.getContext("2d")

        ctx.clearRect(0, 0, canvas.width, canvas.height)
    }

    return (

        <div ref={dialogRef} tabIndex={-1} className="canvas-overlay">

            <div className="paint-window">


                <div className="paint-titlebar">
                    <span>Geração Zee Paint</span>
                    <button onClick={onClose} aria-label="Fechar Paint">✕</button>
                </div>


                <div className="paint-toolbar">

                    <button
                        aria-label="Pincel" aria-pressed={tool === "brush"}
                        className={tool === "brush" ? "active" : ""}
                        onClick={() => setTool("brush")}
                    >
                        🖌
                    </button>

                    <button
                        aria-label="Borracha" aria-pressed={tool === "eraser"}
                        className={tool === "eraser" ? "active" : ""}
                        onClick={() => setTool("eraser")}
                    >
                        🧽
                    </button>

                    <button
                      aria-label="Spray" aria-pressed={tool === "pixo"}
                        className={tool === "pixo" ? "active" : ""}
                      onClick={() => setTool("pixo")}
                    >
                        🧴
                    </button>

                    <button onClick={clearCanvas} aria-label="Limpar desenho">
                        🧹
                    </button>

                    <div className="brush-control">

                        <span>Espessura</span>

                        <input
                            type="range" aria-label="Espessura"
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
                        onPointerDown={startDraw}
                        onPointerMove={draw}
                        onPointerUp={stopDraw}
                        onPointerCancel={stopDraw}
                        onLostPointerCapture={stopDraw}
                        aria-label="Área para desenhar"
                    />

                </div>


                <div className="paint-colors">

                    <button aria-label="Cor #000" style={{ background: "#000" }} onClick={() => setColor("#000")} />
                    <button aria-label="Cor #ff0000" style={{ background: "#ff0000" }} onClick={() => setColor("#ff0000")} />
                    <button aria-label="Cor #00ff00" style={{ background: "#00ff00" }} onClick={() => setColor("#00ff00")} />
                    <button aria-label="Cor #0000ff" style={{ background: "#0000ff" }} onClick={() => setColor("#0000ff")} />
                    <button aria-label="Cor #ffff00" style={{ background: "#ffff00" }} onClick={() => setColor("#ffff00")} />
                    <button aria-label="Cor #ff00ff" style={{ background: "#ff00ff" }} onClick={() => setColor("#ff00ff")} />
                    <button aria-label="Cor #00ffff" style={{ background: "#00ffff" }} onClick={() => setColor("#00ffff")} />

                    <input
                        type="color" aria-label="Escolher cor"
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
