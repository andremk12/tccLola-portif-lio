import "./work.css"
import { useState } from "react"

import ap from "../../assets/apple.jpg"
import tw from "../../assets/twilight.jpg"
import fl from "../../assets/fluter.jpg"
import img from "../../assets/image.png"

import PongGame from "../games/pong/pong"

function Works({ unlockAchievements, theme}) {

    const works = {
        jogos: [
            {title:"Ping pong", img:img, desc:"Ping pong com estética retro bem legal", version: "1.0", developer: "André Michalsky",ideia: "Criar um mini jogo retrô jogável dentro do portfólio para demonstrar interação e criatividade."},
            {title:"Neon Runner", img:fl, desc:"Runner cyberpunk em uma cidade neon infinita."},
            {title:"Chrono Drift", img:ap, desc:"Corrida onde o tempo desacelera em curvas perigosas"},
            

        ],
        fotos: [
            {title:"Retrato artístico", img:ap, desc:"Fotografia autoral"}
        ],
        artes: [
            {title:"Ilustração digital", img:fl, desc:"Arte digital"}
        ]
    }

    const [category,setCategory] = useState("jogos")
    const [selected,setSelected] = useState(null)
    const [showInfo, setShowInfo] = useState(false)
    const [navyHistory, setNavyHistory] = useState([])

    const [playing, setPlaying] = useState(false)

    const changeCategory = (cat) => {
        setCategory(cat)
        setSelected(null)

        setNavyHistory(prev => {
            const updated = [...prev, cat].slice(-4)

            if (updated.join("-") === "jogos-fotos-artes-jogos") {
                unlockAchievements("Curador da Galeria 🖼")
            }

            return updated
        })


    }

    return (

        <div className={`works-container theme-${theme}`}>

            <div className="works-sidebar">

                <h3>Galeria</h3>

                <button onClick={()=>changeCategory("jogos")}>🎮 Jogos</button>
                <button onClick={()=>changeCategory("fotos")}>📷 Fotografia</button>
                <button onClick={()=>changeCategory("artes")}>🎨 Artes</button>

            </div>


            <div className="works-grid">

                {works[category].map((item,i)=>(
                    <div 
                        className="work-card"
                        key={i}
                        onClick={()=>setSelected(item)}
                    >

                        <img src={item.img}/>

                        <div className="work-overlay">
                            <h4>{item.title}</h4>
                            <p>{item.desc}</p>
                        </div>

                    </div>
                ))}

            </div>

               { selected && category === "jogos" && (
                <div className= "launcher-modal">
                    
                    <div className = "launcher-window">
                         <div className="launcher-header">
                                <span>{selected.title}.exe</span>
                                <button onClick={() => setSelected(null)}>X</button>
                          </div>

                          <div className="launcher-body">
                                <img src={selected.img} alt={selected.title}/>
                                
                                <div className="launcher-info"> 
                                    <h2>{selected.title}</h2>
                                    <p>{selected.desc}</p>
                                </div>

                                <div className="launcher-buttons">
                                    <button className="play-btn" onClick = {() => setPlaying(true)}>▶ Jogar</button>
                                    <button className="info-btn" onClick={() => setShowInfo(true)}>📖 Sobre</button>
                                </div>
                          </div>
                    </div>
                
                </div>
            )}


            {selected && category !== "jogos" && (

                <div className="preview-modal" onClick={()=>setSelected(null)}>

                    <div className="preview-content">

                        <img src={selected.img}/>
                        <h2>{selected.title}</h2>
                        <p>{selected.desc}</p>

                    </div>

                </div>

            )}

            {playing && <PongGame onClose={() => setPlaying(false)}/>}

            {showInfo && selected &&(
                <div className = "info-modal">
                    
                    <div className ="info-window">

                        <div className="info-header">
                            
                            <span> Sobre {selected.title} </span>
                            <button onClick={() => setShowInfo(false)}> x </button>

                        </div>

                        <div className="info-content">
                            <h2> {selected.title} </h2>
                            <p><b>Versão:</b> {selected.version} </p>
                            <p><b>Desenvolvedor:</b> {selected.developer}</p>
                            <p><b>Ideia:</b></p>
                            <p>{selected.ideia}</p>
                        </div>

                    </div>

                </div>
            )}
         
        </div>
    )
}

export default Works