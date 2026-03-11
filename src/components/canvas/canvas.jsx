import "./canvas.css"
import { useRef, useState } from "react"

function Canvas( { onClose }) {

    const canvasRef = useRef(null)
    const [drawing, setDrawing] = useState(false)

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

        ctx.lineWidth = 3
        ctx.lineCap = "round"
        ctx.strokeStyle = "#000"

        ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY)
        ctx.stroke()
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

                    <div className="canvas-controls">
                            <button onClick = {clearCanvas}>Limpar</button>
                   </div>
                    
            </div>
  
        </div>
    )
}

export default Canvas