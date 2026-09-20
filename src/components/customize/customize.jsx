import "./customize.css"
import { wallpapers, cursors, themes } from "../../data/customization"

function Customize({ setDesktopTheme, setCursorStyle, setBackgroundStyle, theme, currentWallpaper, currentCursor}) {

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
                        <button
                            type="button"
                            aria-pressed={currentWallpaper === w.id}
                            key={w.id}
                            className={`wallpaper-card ${currentWallpaper === w.id ? "active" : ""}`}
                            style={{ background: w.color }}
                            onClick={() => setBackgroundStyle(w.id)}
                        >
                            <span>{w.label}</span>
                        </button>
                    ))}
                </div>


                <h2>Cursor</h2>

                <div className="cursor-options">
                    {cursors.map(c => (
                        <button
                            key={c.id}
                            className={currentCursor === c.id ? "active" : ""}
                            onClick={() => setCursorStyle(c.id)}
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
                            className={theme === t.id ? "active" : ""}
                            onClick={() => setDesktopTheme(t.id)}
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
