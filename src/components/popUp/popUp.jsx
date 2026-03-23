import "./popUp.css"
import {Minus, Square, X, Pin} from "lucide-react"
import pie from "../../assets/download (8).png"

import CurriculumWindow from "../windows/curriculum/curriculum"
import ContactContent from "../windows/contact/contact"
import Projects from "../windows/projects/projects"
import Works from "../works/works"
import Customize from "../customize/customize"
import SecretWindow from "../windows/segredo/segredo"

import { useState, useRef, useEffect} from "react"

function PopUp({type, onClose, unlockAchievements, setDesktopTheme, setCursorStyle, setBackgroundStyle, theme,cursorStyle, backgroundStyle}){
    const [windowState, setWindowState] = useState("normal")

    const renderContent = () => {
        switch (type) {
            case "Curriculum":
                return <CurriculumWindow theme = {theme}/>
            case "Contatos":
                return <ContactContent theme = {theme}/>
            case "Projetos":
                return <Projects theme = {theme}/>
            case "Trabalhos":
                return <Works unlockAchievements = {unlockAchievements} theme = {theme}/>
            case "Personalizar":
                return <Customize
                        setDesktopTheme={setDesktopTheme}
                        setCursorStyle={setCursorStyle}
                        setBackgroundStyle={setBackgroundStyle}
                        currentWallpaper={backgroundStyle}
                        currentCursor={cursorStyle}
                />
            case "segredo":
                return <SecretWindow unlockAchievements  = {unlockAchievements}/>
        }
    }

    const getWindowSize = () => {
        if (windowState === "maximized") return "window-maximized"
        if (type === "Curriculum") return "window-large"
        if (type === "Contatos") return "window-normal"
        if (type === "Projetos") return "window-large"
        if (type === "Personalizar") return "window-large"
        return "window-normal"
    }

    const [position, setPosition] = useState({x: 250, y: 120})
    const dragging = useRef(false)
    const offset = useRef({x: 0, y: 0})

    const handleMouseDown = (e) => {
        if (windowState === "maximized" || locked) return

        e.preventDefault()

        dragging.current = true
        offset.current = {
            x: e.clientX - position.x,
            y: e.clientY - position.y
        }
    }

    const handleMouseMove = (e) => {
        if (!dragging.current) return

        setPosition({
            x: e.clientX - offset.current.x,
            y: e.clientY - offset.current.y
        })
    }

    const handleMouseUp = () => {
        dragging.current = false
    }

    const [locked, setLocked] = useState(false)

    const centerWindow = () => {
        const width = window.innerWidth
        const height = window.innerHeight

        let windowWidth = 500
        let windowHeight = 400

        if (type === "Curriculum" || type === "Projetos" || type === "Personalizar") {
            windowHeight = 660
            windowWidth = 1000
        }

        setPosition({
            x: (width - windowWidth) / 2,
            y: (height - windowHeight) / 2
        })
    }

    useEffect(() => {
        setTimeout(() => {
            centerWindow()
        }, 0)
    }, [])

    return (
        <div className="window-overlay">
            <div 
                className={`window ${getWindowSize()} theme-${theme}`}
                style = {{
                        position: windowState === "maximized" ? "fixed" : "absolute",
                        top: windowState === "maximized" ? 0 : position.y,
                        left: windowState === "maximized" ? 0 : position.x
                    }}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp} 
            >
                <div 
                    className="window-header"
                    onMouseDown={handleMouseDown}
                    style={{cursor: windowState === "maximized" ? "default" : "grab"}}
                   
                >
                    <span className="window-title">{type}</span>
                    
                    <div className="window-controls">
                        <button
                            className={`control-btn ${locked ? "locked" : ""}`}
                            onClick = {() => {
                                const newValue = !locked
                                setLocked(newValue)

                                 if (newValue) {
                                    centerWindow()
                                }
                            }}
                        >
                            <Pin size = {14}/>
                        </button>

                        <button className="control-btn minimize"  onClick={() => setWindowState("normal")}>
                            <Minus size ={14}/>
                        </button>
                        <button className="control-btn maximize" onClick={() => setWindowState (windowState === "maximized" ? "normal" : "maximized")}>
                             <Square size={14}/>
                        </button>
                        <button className="control-btn close" onClick={onClose}>
                            <X size={14}/>
                        </button>
                    </div>
                </div>

                <div className="window-content">
                     {renderContent()}
                </div>

            </div>
        </div>
    )
}

export default PopUp;