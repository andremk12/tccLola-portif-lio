import "./customize.css"
import { useState, useEffect } from "react"

function Customize({ setDesktopTheme, setCursorStyle, setBackgroundStyle, theme, currentWallpaper, currentCursor}) {

    const [selectedWallpaper, setSelectedWallpaper] = useState(currentWallpaper)
    const [selectedCursor, setSelectedCursor] = useState(currentCursor)
    const [selectedTheme, setSelectedTheme] = useState(theme)

    const wallpapers = [
        { id: "default", label: "Default", color: "#2f8f94" },
        { id: "night", label: "Night", color: "#1b1b2f" },
        { id: "sunset", label: "Sunset", color: "#ff7a18" },
        { id: "galaxy", label: "Galaxy", color: "#0b0f2a" }
    ]

    const cursors = [
        { id: "default", label: "Normal" },
        { id: "pointer", label: "Pointer" },
        { id: "crosshair", label: "Crosshair" }
    ]

    const themes = [
        { id: "default", label: "Default" },
        { id: "dark", label: "Dark" },
        { id: "neon", label: "Neon" },
        { id: "cyber", label: "Cyber" }
    ]

    const changeWallpaper = (wall) => {
        setSelectedWallpaper(wall.id)
        setBackgroundStyle(wall.id)
    }

    const changeCursor = (cursor) => {
        setSelectedCursor(cursor.id)
        setCursorStyle(cursor.id)
    }

    const changeTheme = (theme) => {
        setSelectedTheme(theme.id)
        setDesktopTheme(theme.id)
    }

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setSelectedWallpaper(currentWallpaper)
        setSelectedCursor(currentCursor)

    }, [currentWallpaper, currentCursor])

    return (
        <div className="customize-container">

            <div className="customize-sidebar">

                <h3>⚙ Personalizar OS</h3>

                <p>🎨 Wallpapers</p>
                <p>🖱 Cursor</p>
                <p>🌈 Tema</p>

            </div>

            <div className= {`customize-content theme-${theme}`}>

                <h2>Wallpapers</h2>

                <div className="wallpaper-grid">
                    {wallpapers.map(w => (
                        <div
                            key={w.id}
                            className={`wallpaper-card ${selectedWallpaper === w.id ? "active" : ""}`}
                            style={{ background: w.color }}
                            onClick={() => changeWallpaper(w)}
                        >
                            <span>{w.label}</span>
                        </div>
                    ))}
                </div>


                <h2>Cursor</h2>

                <div className="cursor-options">
                    {cursors.map(c => (
                        <button
                            key={c.id}
                            className={selectedCursor === c.id ? "active" : ""}
                            onClick={() => changeCursor(c)}
                        >
                            {c.label}
                        </button>
                    ))}
                </div>


                <h2>Tema</h2>

                <div className="theme-options">
                    {themes.map(t => (
                        <button
                            key={t.id}
                            className={selectedTheme === t.id ? "active" : ""}
                            onClick={() => changeTheme(t)}
                            style={{
                            background:
                                t.id === "dark"
                                ? "#111827"
                                : t.id === "neon"
                                ? "#001f2f"
                                : t.id === "cyber"
                                ? "#1b1025"
                                : "#ececec",
                            color:
                                t.id === "dark"
                                ? "#e5e7eb"
                                : t.id === "neon"
                                ? "#00ffff"
                                : t.id === "cyber"
                                ? "#ff00ff"
                                : "#111"
                                }}
                             >
                            {t.label}
                        </button>
                    ))}
                </div>

            </div>

        </div>
    )
}

export default Customize