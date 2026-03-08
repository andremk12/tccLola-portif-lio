import "./work.css"
import { useState } from "react"

import ap from "../../assets/apple.jpg"
import fl from "../../assets/fluter.jpg"
import img from "../../assets/image.png"

import PongGame from "../games/pong/pong"

function Works({ unlockAchievements, theme }) {

    const works = {
        jogos: [
            {
                title:"Ping pong",
                img:img,
                desc:"Ping pong com estética retro bem legal",
                version:"1.0",
                developer:"André Michalsky",
                ideia:"Criar um mini jogo retrô jogável dentro do portfólio para demonstrar interação e criatividade."
            },
            {
                title:"Neon Runner",
                img:fl,
                desc:"Runner cyberpunk em uma cidade neon infinita."
            },
            {
                title:"Chrono Drift",
                img:ap,
                desc:"Corrida onde o tempo desacelera em curvas perigosas"
            }
        ],

        artes: [
            {
                title:"Ilustração digital",
                img:fl,
                desc:"Arte digital"
            }
        ]
    }

    const photos = [
        {
            src:"https://picsum.photos/800/500?random=1",
            title:"Aurora no campo",
            camera:"ISO 200 • f/2.8 • 1/500",
            location:"São Paulo — 2024"
        },

        {
            src:"https://picsum.photos/800/500?random=2",
            title:"Luz da manhã",
            camera:"ISO 100 • f/4 • 1/320",
            location:"Curitiba — 2023"
        },

        {
            src:"https://picsum.photos/800/500?random=3",
            title:"Reflexos urbanos",
            camera:"ISO 400 • f/5.6 • 1/125",
            location:"Rio de Janeiro — 2024"
        },

        {
            src:"https://picsum.photos/800/500?random=4",
            title:"Horizonte azul",
            camera:"ISO 200 • f/8 • 1/250",
            location:"Florianópolis — 2023"
        }
]
    const [category,setCategory] = useState("jogos")
    const [selected,setSelected] = useState(null)
    const [showInfo,setShowInfo] = useState(false)
    const [selectedPhoto,setSelectedPhoto] = useState(null)
    const [navyHistory,setNavyHistory] = useState([])
    const [playing,setPlaying] = useState(false)

    const changeCategory = (cat) => {

        setCategory(cat)
        setSelected(null)
        setSelectedPhoto(null)
        setShowInfo(false)

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

            {/* SIDEBAR */}

            <div className="works-sidebar">

                <h3>Galeria</h3>

                <button onClick={()=>changeCategory("jogos")}>🎮 Jogos</button>
                <button onClick={()=>changeCategory("fotos")}>📷 Fotografia</button>
                <button onClick={()=>changeCategory("artes")}>🎨 Artes</button>

            </div>


            {/* GRID NORMAL */}

            {category !== "fotos" && (

                <div className="works-grid">

                    {works[category].map((item,i)=>(
                        <div
                            className="work-card"
                            key={i}
                            onClick={()=>setSelected(item)}
                        >

                            <img src={item.img} alt={item.title}/>

                            <div className="work-overlay">
                                <h4>{item.title}</h4>
                                <p>{item.desc}</p>
                            </div>

                        </div>
                    ))}

                </div>

            )}


            {/* GALERIA DE FOTOS */}

            {category === "fotos" && (

                <div className="photo-gallery">

                    {photos.map((photo,i)=>(
                        <div
                            key={i}
                            className="photo-card"
                            onClick={()=>setSelectedPhoto(photo)}
                        >
                            <img src={photo.src} alt="photo"/>


                        </div>
                    ))}

                </div>

            )}


            {/* VISUALIZADOR DE FOTO */}

            {selectedPhoto && (

                <div
                    className="photo-view"
                    onClick={()=>setSelectedPhoto(null)}
                >
                    <div className="photo-view-content">
                         <img src={selectedPhoto.src} alt="view"/>

                         <div className="photo-info">
                             <h3>{selectedPhoto.title}</h3>

                             <p>{selectedPhoto.camera}</p>

                             <p>{selectedPhoto.location}</p>
                         </div>
                    </div>


                   
                </div>

            )}


            {/* LAUNCHER DOS JOGOS */}

            {selected && category === "jogos" && (

                <div className="launcher-modal">

                    <div className="launcher-window">

                        <div className="launcher-header">
                            <span>{selected.title}.exe</span>
                            <button onClick={()=>setSelected(null)}>X</button>
                        </div>

                        <div className="launcher-body">

                            <img src={selected.img} alt={selected.title}/>

                            <div className="launcher-info">
                                <h2>{selected.title}</h2>
                                <p>{selected.desc}</p>
                            </div>

                            <div className="launcher-buttons">
                                <button
                                    className="play-btn"
                                    onClick={()=>setPlaying(true)}
                                >
                                    ▶ Jogar
                                </button>

                                <button
                                    className="info-btn"
                                    onClick={()=>setShowInfo(true)}
                                >
                                    📖 Sobre
                                </button>
                            </div>

                        </div>

                    </div>

                </div>

            )}


            {/* PREVIEW ARTES */}

            {selected && category !== "jogos" && category !== "fotos" && (

                <div
                    className="preview-modal"
                    onClick={()=>setSelected(null)}
                >

                    <div className="preview-content">

                        <img src={selected.img} alt={selected.title}/>
                        <h2>{selected.title}</h2>
                        <p>{selected.desc}</p>

                    </div>

                </div>

            )}


            {/* JOGO */}

            {playing && (
                <PongGame onClose={()=>setPlaying(false)}/>
            )}


            {/* MODAL SOBRE */}

            {showInfo && selected && (

                <div className="info-modal">

                    <div className="info-window">

                        <div className="info-header">

                            <span>Sobre {selected.title}</span>

                            <button onClick={()=>setShowInfo(false)}>X</button>

                        </div>

                        <div className="info-content">

                            <h2>{selected.title}</h2>

                            <p><b>Versão:</b> {selected.version || "N/A"}</p>
                            <p><b>Desenvolvedor:</b> {selected.developer || "N/A"}</p>

                            <p><b>Ideia:</b></p>

                            <p>{selected.ideia || "Descrição não disponível."}</p>

                        </div>

                    </div>

                </div>

            )}

        </div>
    )
}

export default Works