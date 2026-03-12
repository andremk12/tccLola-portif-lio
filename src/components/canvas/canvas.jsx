import "./canvas.css"
import { useRef, useState } from "react"

function Canvas( { onClose, unlockAchievements }) {

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

    const draw = (e) => {
        if (!drawing) return

        const canvas = canvasRef.current
        const ctx = canvas.getContext("2d")

        ctx.lineWidth = size
        ctx.lineCap = "round"

        if (tool === "eraser") {
            ctx.globalCompositeOperation = "destination-out"
        } else {
            ctx.globalCompositeOperation = "source-over"
            ctx.strokeStyle = color
        }


        ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY)
        ctx.stroke()

        setDrawCount((prev) => {
            const newCount = prev + 1
            console.log(drawCount)

            if (newCount === 200) {
                unlockAchievements("Artista do Caos 🔥")
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

        ctx.clearRect(0, 0, canvas.width,canvas.height)
    }


    return (
        <div className="canvas-overlay">
            
            <div className="canvas-window">

                <div className="canvas-header">
                         <h2> Rabisque algo aqui</h2>
            
                         <button className = "canvas-close" onClick={() => onClose()}>  ✕ </button>
                </div>

                <div className="canvas-tools">
                    <label>
                            Cor:
                            <input 
                                type="color" 
                                value={color}
                                onChange={(e) => setColor(e.target.value)}
                                />
                     </label>

                     <label>
                            Espessura:
                            <input 
                                type="range" 
                                min="1"
                                max="20"
                                value={size}
                                onChange={(e) => setSize(e.target.value)}
                                />
                     </label>

                     <button onClick={() => setTool("brush")}>
                            Pincel
                     </button>

                     <button onClick={() => setTool("eraser")}>
                            Borracha
                     </button>

                     <button onClick = {clearCanvas}>
                            limpar
                     </button>
                </div>

                 <canvas
                      ref = {canvasRef}
                      width={700}
                      height={400}
                      className="sketch-canvas" 
                      onMouseDown={startDraw}
                      onMouseMove={draw}
                      onMouseLeave={stopDraw}
                      onMouseUp={stopDraw}
                      />
            </div>
  
        </div>
    )
}

export default Canvas