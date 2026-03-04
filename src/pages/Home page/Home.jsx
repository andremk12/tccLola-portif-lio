import React, {useState, useEffect, useRef} from "react";

import {User, FileText, Folder, HelpCircle, Bell, BellOff} from "lucide-react"
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

function HomePage() {

    const [hora, setHora] = useState(new Date())
   

    useEffect(() => {
        const intervalo = setInterval(() => {
                setHora(new Date())
            }, 1000)

            return () => clearInterval(intervalo)
     },[])

     const [openWindow, setOpenWindow] = useState(null)

     const [toast, setToast] = useState(null)
     const [notificationsEnabled, setNotificatoinsEnabled] = useState(true)
     const [achievements, setAchievements] = useState([])

     const showToast = (message) => {
        if (!notificationsEnabled) return
        
        setToast(message)

        setTimeout(() => {
            setToast(null)
        }, 3000)
     }

     const unlockAchievements = (title) => {
        if (achievements.includes(title)) return

        setAchievements(prev => [...prev, title])
        showToast(`🏆 Conquista desbloqueada: ${title}`)
        
     }

     const [openedWindows, setOpenedWindows] = useState([])
     const [clickCount, setClickCount] = useState(0)
     const [clickedSkills, setClickedSkills] = useState([])

     const handleSkillClick = (skillName) => {

        if (!clickedSkills.includes(skillName)) {
            setClickedSkills(prev => [...prev, skillName])
        }

        showToast(`Ferramenta explorada: ${skillName}`)
    }

     const handleClick = (item) => {
        setOpenWindow(item)

        if  (!openedWindows.includes(item)) {
            setOpenedWindows(prev => [...prev, item])
        }

        if (item === "segredo") {
            unlockAchievements("Curioso Investigador 🕵️")
        } else {
              showToast(`${item} inciado com sucesso 🚀`) 
        }

        setClickCount(prev => prev + 1)
     }



     const [startMenuOpen, setStartMenuOpen] = useState(false)
     const [booting, setBooting] = useState(false)
     const [booted, setBooted] = useState(false)

     const clockClicksRef = useRef(0)
     const lastClockClickRef = useRef(0)
     const [glitch, setGlitch] = useState(false)
  
        const handleClock = () => {
            // eslint-disable-next-line react-hooks/purity
            const now = performance.now()

            if (now - lastClockClickRef.current < 1000) {
                clockClicksRef.current += 1
            } else {
                clockClicksRef.current = 1
            }

            lastClockClickRef.current = now

            if (clockClicksRef.current === 5) {
                activateTimeSecret()
                clockClicksRef.current = 0
            }
        }

     const activateTimeSecret = () => {
        setGlitch(true)

        setTimeout(() => {
            setGlitch(false)
        }, 1500)

        unlockAchievements("Manipulador do Tempo ⏳")
     }

     const [bgClicks, setBgClicks] = useState(0)
     const [devMode, setDevMode] = useState(false)

     const handleBackgroundClick = (e) => {
        if (e.target.classList.contains("desktop")) {
            setBgClicks(prev => prev + 1)
        }
     }

     const closeDevMode = () => {
            setDevMode(false)
            showToast("Modo Desenvolvedor desativado 📴")
        }

     useEffect(() => {
        if (bgClicks === 3) {
            setDevMode(true)
            unlockAchievements("Administrador do Sistema 🛠")
            setBgClicks(0)
        }
     }, [bgClicks])

     useEffect(() => {
        if (openedWindows.length >= 3) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            unlockAchievements("Explorador do Sistema")
        }
     }, [openedWindows])

     useEffect(() => {
        if (clickCount === 10) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            unlockAchievements("Cliqueiro Profissional")
        }
     }, [clickCount])

    useEffect(() => {
        const hour = new Date().getHours()

        if (hour >= 6 && hour < 12) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            showToast("☀️ Bom dia, desenvolvedor!")
        } else if (hour >= 12 && hour < 18) {
            showToast("🌤 Boa tarde! Hora de produzir!")
        } else if (hour >= 18 && hour < 22) {
            showToast("🌙 Boa noite! Portfólio noturno ativado.")
        } else {
            showToast("🌌 Trabalhando de madrugada? Respeito.")
        }

    }, [])

    useEffect(() => {
        if (clickedSkills.length >= 5) {
             // eslint-disable-next-line react-hooks/set-state-in-effect
             unlockAchievements("Mestre das Ferramentas 🎨")
        }
    }, [clickedSkills])

    return(
        <div className ={`desktop ${glitch ? "glitch" : ""}`} onClick={handleBackgroundClick}>

            <div className = "icons">
                <div className = "icon" onClick={() => handleClick("Contatos")}>
                    <User size = {40}/>
                    <span>Contatos</span>
                </div>

                <div className = "icon" onClick={() => handleClick("Curriculum")}>
                    <FileText size = {40}/>
                    <span>Curriculum</span>
                </div>

                <div className = "icon" onClick={() => handleClick("Trabalhos")}>
                    <Folder size = {40}/>
                    <span>Trabalhos</span>
                </div>

                <div className = "icon" onClick={() => handleClick("Projetos")}>
                     <img src={ex}/>
                    <span>Projetos</span>
                </div>
            </div>

            <div className="help-icon" onClick={() => handleClick("segredo")}>
                <HelpCircle size={40}/>
                <span>segredo super hiper secreto</span>
            </div>

            <div className="taskbar">
                <div 
                    className="start-button"
                    onClick={() => {
                        if (!booted) {
                        setBooting(true)

                        setTimeout(() => {
                            setBooting(false)
                            setBooted(true)
                            setStartMenuOpen(true)
                            unlockAchievements("Sistema incializado 💻")
                        }, 2500)
                    } else {
                        setStartMenuOpen(prev => !prev)
                    }
                    }}
                >
                    <img src={windows}/>
                </div>

                <div className="skills">
                   <span>Skills:</span>
                   <span onClick={()=> handleSkillClick("Photoshop")}><img src={ps}/></span>
                   <span onClick={()=> handleSkillClick("illustrator")}><img src={ai}/></span>
                   <span onClick={()=> handleSkillClick("Procreate")}><img src={pincel}/></span>
                   <span onClick={()=> handleSkillClick("Lightroom")}><img src={lr}/></span>
                   <span onClick={()=> handleSkillClick("DaVinci")}><img src={dv}/></span>
                </div>
            <div className="taskbar-right">
                <div
                    className="notification-toggle"
                    onClick={() => {{
                        setNotificatoinsEnabled(!notificationsEnabled)
                        showToast (notificationsEnabled ? "Notificações desativadas 🔕" : "Notificações ativadas 🔔" )
                    }}}
                >   
                    {notificationsEnabled ? <Bell size ={20}/> : <BellOff size={20}/>}
                </div>

                <div className ="clock" onClick={handleClock}>
                    {hora.toLocaleTimeString("pt-BR", {
                        hour: "2-digit",
                        minute: "2-digit"
                    })}
                </div>
            </div>
            </div>

              {openWindow && (
                <PopUp
                type={openWindow}
                onClose={() => setOpenWindow(null)}
                unlockAchievements ={unlockAchievements}
                />
            )
        }

        {toast && <Toast message={toast}/>}

        
        { booting && (
            <div className="boot-screen">
                <div className="boot-content">
                    <p>Iniciando sistema...</p>
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
                    {achievements.map((a, index) => (
                        <div key = {index}>✔ {a}</div>
                    ))}
                </div>

                <hr />
                
                <div onClick={() => handleClick("Projetos")}> 📁 Projetos </div>
                <div onClick={() => handleClick("Curriculum")}> 📄 Curriculum </div>
                <div onClick={() => handleClick("Contatos")}> 📞 Contatos</div>

            </div>
            )
        }
        </div>


      
    )
}

export default HomePage