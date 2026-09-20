import { lazy, Suspense } from "react"
import { useDesktop } from "../../hooks/useDesktop"
import DesktopClock from "../../components/DesktopClock"

import {User, FileText, Folder, HelpCircle, Bell, BellOff, Palette, Sticker, NotebookPen, Archive} from "lucide-react"
import "./Home.css"

import windows from "../../assets/windows.png"
import ps from "../../assets/ps.png"
import ai from "../../assets/ai.png"
import pincel from "../../assets/pincel.png"
import lr from "../../assets/lr.png"
import dv from "../../assets/davinci.png"
import ex from "../../assets/explorer.png"

import PopUp from "../../components/popUp/popUp";
import Toast from "../../components/toast/toast";
import Terminal from "../../components/terminal/terminal";
import MatrixRain from "../../components/matrixRain/matrix";
import Futebol from "../../components/futebol/futebol";
const StickerBook = lazy(() => import("../../components/stickerbook/sticker"))
import Canvas from "../../components/canvas/canvas";
import AvisoPop from "../../components/aviso/aviso";
import SugestionsForm from "../../components/form/form";


function HomePage() {
    const { mostrarAviso, setMostrarAviso, openWindow, setOpenWindow, toast,
    notificationsEnabled, toggleNotifications, achievements, openedWindows, clickCount,
    showToast, unlockAchievements, handleSkillClick, handleClick,
    showTerminal, setShowTerminal, petActive, setPetActive, showStickers, setShowStickers,
    showCanvas, setShowCanvas, showForm, setShowForm, startMenuOpen, booting, handleStart,
    battery, wifi, glitch, handleClock, devMode, closeDevMode, handleBackgroundClick,
    desktopTheme, cursorStyle, backGroundStyle, handleThemeChange, handleWallpaperChange,
    handleCursorChange, matrixMode, setMatrixMode, raveMode, setRaveMode, systemLoading, progress,} = useDesktop()

    if (systemLoading) {
        return (
            <div className="initial-boot">

                <h1 className="boot-logo"> Geração Zee OS </h1>

                <div className="boot-status">
                    <p>Inicializando sitema</p>
                    <p>Carregando módulos...</p>
                    <p>Preparando interface...</p>
                    <p>Dica: Explore todo o portifolio e para encontrar os mistérios, Clique bastante!</p>
                </div>

                <div className="boot-bar-container">
                    <div className="boot-bar" style={{width: `${progress}%`}}></div>
                </div>

                <span className="boot-percent">{progress}%</span>

            </div>
        )
    }



    return(
       <>
         {mostrarAviso && (
            <AvisoPop onClose={() => setMostrarAviso(false)}/>
         )}
       <div className ={`desktop theme-${desktopTheme} cursor-${cursorStyle} wallpaper-${backGroundStyle} ${glitch ? "glitch" : ""} ${matrixMode ? "matrix-mode": ""} ${raveMode ? "rave-mode" : ""}`} onClick= { handleBackgroundClick}>

            <div className = "icons">
                <button type="button" className = "icon desktop-button" onClick={() => handleClick("Contatos")}>
                    <User size = {40}/>
                    <span>Contatos</span>
                </button>

                <button type="button" className = "icon desktop-button" onClick={() => handleClick("Curriculum")}>
                    <FileText size = {40}/>
                    <span>Curriculum</span>
                </button>

                <button type="button" className = "icon desktop-button" onClick={() => handleClick("Trabalhos")}>
                    <Folder size = {40}/>
                    <span>Trabalhos</span>
                </button>

                <button type="button" className = "icon desktop-button" onClick={() => handleClick("Projetos")}>
                     <img src={ex} alt=""/>
                    <span>Projetos</span>
                </button>

                <button type="button" className = "icon desktop-button" onClick={() => handleClick("Personalizar")}>
                     <Palette size = {40}/>
                    <span>Personalizar</span>
                </button>

                <button type="button" className="icon desktop-button" onClick={() => setShowStickers(true)}>
                 <Sticker size={40}/>
                <span>Albúm de figurinhas</span>
            </button>
            </div>

            <button type="button" className="help-icon desktop-button" onClick={() => handleClick("segredo")}>
                <HelpCircle size={40}/>
                <span>segredo super hiper secreto</span>
            </button>

            <button type="button" className="notebook-icon desktop-button" onClick={() => setShowCanvas(true)}>
                <NotebookPen size={40}/>
                <span>Mostre seu talento</span>
            </button>

             <button type="button" className="form-icon desktop-button" onClick={() => setShowForm(true)}>
                <Archive size={40}/>
                <span>Colabore!</span>
            </button>



            <div className="taskbar">
                <button type="button"
                    className="start-button desktop-button" aria-label="Iniciar" aria-expanded={startMenuOpen}
                    onClick={handleStart}
                >
                    <img src={windows} alt="Iniciar"/>
                </button>

                <div className="skills">
                   <span>Skills:</span>
                   <button className="desktop-button" type="button" aria-label="Photoshop" onClick={()=> handleSkillClick("Photoshop")}><img src={ps} alt="Photoshop"/></button>
                   <button className="desktop-button" type="button" aria-label="Illustrator" onClick={()=> handleSkillClick("illustrator")}><img src={ai} alt="Illustrator"/></button>
                   <button className="desktop-button" type="button" aria-label="Procreate" onClick={()=> handleSkillClick("Procreate")}><img src={pincel} alt="Procreate"/></button>
                   <button className="desktop-button" type="button" aria-label="Lightroom" onClick={()=> handleSkillClick("Lightroom")}><img src={lr} alt="Lightroom"/></button>
                   <button className="desktop-button" type="button" aria-label="DaVinci" onClick={()=> handleSkillClick("DaVinci")}><img src={dv} alt="DaVinci"/></button>
                </div>
            <div className="taskbar-right">
                <button type="button"
                    className="notification-toggle desktop-button" aria-label="Notificações" aria-pressed={notificationsEnabled}
                    onClick={toggleNotifications}
                >
                    {notificationsEnabled ? <Bell size ={20}/> : <BellOff size={20}/>}
                </button>

                <div className="system-icons">

                    <button type="button"
                        className = "wifi desktop-button"
                        aria-label="Rede Wi-Fi" title={`Sinal: ${wifi}/4`}
                        onClick={() => showToast("Conectado à rede: Geração_zee_net")}>
                            {[0, 1, 2, 3].map((level) => (
                                <span
                                    key={level}
                                    className={`bar ${wifi > level ? "active": ""}`}
                                />
                            ))}
                    </button>

                    <div className="battery">
                        🔋{battery}%
                    </div>

                </div>

                <DesktopClock onClick={handleClock} />
            </div>
            </div>

              {openWindow && (
                <PopUp
                    key={openWindow}
                    type={openWindow}
                    onClose={() => setOpenWindow(null)}
                    unlockAchievements ={unlockAchievements}
                    setDesktopTheme={handleThemeChange}
                    setCursorStyle={handleCursorChange}
                    setBackgroundStyle={handleWallpaperChange}
                    theme={desktopTheme}
                    currentWallpaper={backGroundStyle}
                    currentCursor={cursorStyle}
                />
            )
        }

        {toast && <Toast key={toast.id} message={toast.message}/>}


        { booting && (
            <div className="boot-screen">
                <div className="boot-content">
                    <p>Reiniciando sistema...</p>
                    <p>Carregando módulos...</p>
                    <p>Preparando portifólio...</p>
                </div>
            </div>
        )
        }


        {devMode && (
            <div className="dev-panel">
                <div className="dev-header">
                    <h4>Modo Desenvolvedor</h4>
                    <button className="close-dev" onClick={closeDevMode}>✖</button>
                </div>

                <p>Cliques totais: {clickCount}</p>
                <p>Janelas abertas: {openedWindows.length}</p>
                <p>Versão: 1.0.0</p>
            </div>
    )}


        { startMenuOpen && !booting && (
            <div className="start-menu">
                <h3> 🖥 Sistema Heloysa OS</h3>

                <p> 🏆 Conquistas: {achievements.length} </p>

                <div className="achievement-list">
                    {achievements.map((a) => (
                        <div key={a}>✔ {a}</div>
                    ))}
                </div>

                <hr />

                <button className="desktop-button" type="button" onClick={() => handleClick("Projetos")}> 📁 Projetos </button>
                <button className="desktop-button" type="button" onClick={() => handleClick("Curriculum")}> 📄 Curriculum </button>
                <button className="desktop-button" type="button" onClick={() => handleClick("Contatos")}> 📞 Contatos</button>

            </div>
            )
        }

        {showCanvas && (<Canvas onClose={()=> setShowCanvas(false)} unlockAchievements={unlockAchievements}/>)}
        {showForm && <SugestionsForm onClose={() => setShowForm(false) } unlockAchievements={unlockAchievements}/>}

        {showTerminal && (
            <Terminal
            onClose={() => setShowTerminal(false)}
            setMatrixMode={setMatrixMode}
            setRaveMode={setRaveMode}
            unlockAchievements={unlockAchievements}
            achievements={achievements}
            activatePet = {() => setPetActive(true)}
            deactivatePet={() => setPetActive(false)}
            />
        )}

         <MatrixRain active={matrixMode}/>



         {petActive && <Futebol booted={!systemLoading}  unlockAchievements ={unlockAchievements}/>}

         {showStickers && <Suspense fallback={<div className="stickerbook-overlay" role="status">Carregando álbum...</div>}><StickerBook onClose={() => setShowStickers(false)} onContact={() => { setShowStickers(false); handleClick("Contatos") }} unlockAchievements={unlockAchievements}/></Suspense>}

        </div>

        </>


    )
}

export default HomePage
