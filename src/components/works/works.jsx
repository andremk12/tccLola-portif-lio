import "./work.css"
import { useState } from "react"

import ap from "../../assets/apple.jpg"
import fl from "../../assets/fluter.jpg"
import img from "../../assets/image.png"
import tw from "../../assets/twilight.jpg"
import gameA from "../../assets/matarhomis.png"
import cas from "../../assets/cassino.png"

import PongGame from "../games/pong/pong"
import AlienGame from "../games/alienGame/alienGame"
import CassinoGame from "../games/cassino/cassino"

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
                title:"Cassino Zee",
                img:cas,
                desc:"Cassino Retrô, teste sua sorte.",
                version:"1.0",
                developer:"Geração Zee",
                ideia:"Cassino recriado em JavaScript (Java convertido para p5.js) para ser um projeto grafico e interativo"
            },
            {
                title:"Alien Game",
                img:gameA,
                desc:"Jogo de matar homis",
                version:"1.0",
                developer:"Geração Zee",
                ideia:"Jogo inspirado no galaga, com objetivo de fazer uma moça chegar em segurança em casa"
            }
        ],

           artes: [
            {
                title:"Floral Study",
                img:fl,
                tech:"Digital painting",
                year:"2024",
                desc:"Estudo de cores e composição inspirado em botânica."
            },

            {
                title:"Character Sketch",
                img:ap,
                tech:"Digital sketch",
                year:"2023",
                desc:"Exploração de personagem em estilo estilizado."
            },

            {
                title:"Light Composition",
                img: tw,
                tech:"Digital illustration",
                year:"2024",
                desc:"Experimento com iluminação e atmosfera."
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
            title:"Foto teste 1",
            camera:"ISO 200 • f/8 • 1/250",
            location:"Florianópolis — 2023"
        },
        {
            src:"https://picsum.photos/800/500?random=5",
            title:"Foto teste 2",
            camera:"ISO 200 • f/8 • 1/250",
            location:"Florianópolis — 2023"
        },
        {
            src:"https://picsum.photos/800/500?random=6",
            title:"Foto teste 2",
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
    const [playingAlien, setPlayingAlien] = useState(false)
    const [playingCassino, setPlayingCassino] = useState(false)
    const [selectedArt, setSelectedArt] = useState(null)
    console.log(navyHistory)

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

            {category !== "fotos" && category !== "artes" && (

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

            {/* {VIZUALIZADOR DE ARTES} */}

            { category === "artes" && (
                <div className="art-gallery">
                    
                    {works.artes.map((art, i) => (
                        <div
                            key={i}
                            className="art-card"
                            onClick={() => setSelectedArt(art)}
                            >
                            <img src={art.img}/>
                            
                            <div className="art-overlay">
                                <h4>{art.title}</h4>
                            </div>

                        </div>
                    ))}

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
                                    onClick={()=> {
                                        if(selected.title === "Ping pong") {
                                            setPlaying(true)
                                        }

                                        if(selected.title === "Alien Game") {
                                            setPlayingAlien(true)
                                        }

                                        if(selected.title === "Cassino Zee") {
                                            setPlayingCassino(true)
                                        }
                                    }}
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

            {playingAlien && <AlienGame onClose={() => setPlayingAlien(false)}/>}

            {playingCassino && <CassinoGame onClose={() => setPlayingCassino(false)}/>}


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

            {selectedArt && (
                
                <div 
                 className="art-view"
                 onClick={() => setSelectedArt(null)} >
                    
                    <div className="art-view-content">
                        
                        <img src={selectedArt.img} />
                        
                        <div className="art-info">
                            <h2>{selectedArt.title}</h2>

                            <p>{selectedArt.tech} • {selectedArt.year} </p>

                            <p>{selectedArt.desc}</p>
                        </div>
                        
                    </div>
                
                </div>
            )   
                
            }

        </div>
    )
}

export default Works