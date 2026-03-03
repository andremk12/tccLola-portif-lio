import React, {useState, useEffect} from "react";

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


     useEffect(() => {
        if (openedWindows.length >= 3) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            unlockAchievements("Explorador do Sistema")
        }
     }, [openedWindows])

     useEffect(() => {
        if (clickCount === 10) {
            unlockAchievements("Cliqueiro Profissional")
        }
     }, [clickCount])

    useEffect(() => {
        const hour = new Date().getHours()

        if (hour >= 6 && hour < 12) {
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
             unlockAchievements("Mestre das Ferramentas 🎨")
        }
    }, [clickedSkills])

    return(
        <div className = "desktop">

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
                <div className="start-button">
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

                <div
                    className="notification-toggle"
                    onClick={() => {{
                        setNotificatoinsEnabled(!notificationsEnabled)
                        showToast (notificationsEnabled ? "Notificações desativadas 🔕" : "Notificações ativadas 🔔" )
                    }}}
                >   
                    {notificationsEnabled ? <Bell size ={20}/> : <BellOff size={20}/>}
                </div>

                <div className ="clock">
                    {hora.toLocaleTimeString("pt-BR", {
                        hour: "2-digit",
                        minute: "2-digit"
                    })}
                </div>

            </div>

              {openWindow && (
                <PopUp
                type={openWindow}
                onClose={() => setOpenWindow(null)}
                />
            )
        }

        {toast && <Toast message={toast}/>}
        </div>

      
    )
}

export default HomePage