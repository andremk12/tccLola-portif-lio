import "./work.css"
import { useState } from "react"

import ap from "../../assets/apple.jpg"
import tw from "../../assets/twilight.jpg"
import fl from "../../assets/fluter.jpg"

function Works({ unlockAchievements}) {

    const works = {
        jogos: [
            {title:"Game Concept", img:tw, desc:"Jogo experimental"}
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
    const [navyHistory, setNavyHistory] = useState([])

    const changeCategory = (cat) => {
        setCategory(cat)

        setNavyHistory(prev => {
            const updated = [...prev, cat].slice(-4)

            if (updated.join("-") === "jogos-fotos-artes-jogos") {
                unlockAchievements("Curador da Galeria 🖼")
            }

            return updated
        })


    }

    return (

        <div className="works-container">

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

            {selected && (

                <div className="preview-modal" onClick={()=>setSelected(null)}>

                    <div className="preview-content">

                        <img src={selected.img}/>
                        <h2>{selected.title}</h2>
                        <p>{selected.desc}</p>

                    </div>

                </div>

            )}

        </div>
    )
}

export default Works