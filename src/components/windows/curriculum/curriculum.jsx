import "./curriculum.css"
import perfil from "../../../assets/lindaprincesa.png"

import {
    User,
    GraduationCap,
    Briefcase,
    Mail,
    Phone,
    MapPin,
    Code,
    Languages,
    School
} from "lucide-react"

function CurriculumWindow ({theme}) {
    return (
        <div className={`curriculum-container theme-${theme}`}>
            <div className="left-panel">

        
            <div className="photo-card-c">
                <img src={perfil} className="profile-photo"/>
            </div>
            <div className="languages-card">
                <h3> <Languages size ={18}/>IDIOMAS</h3>
                
                 <div className="language-item">
                    <span>Português</span>
                    <div className="progress-bar">
                        <div className="progress fill-100"></div>
                    </div>
                 </div>
                 
                 <div className="language-item">
                    <span>Inglês</span>
                    <div className="progress-bar">
                        <div className="progress fill-70"></div>
                    </div>
                 </div>
                 
                 <div className="language-item">
                    <span>Italiano</span>
                    <div className="progress-bar">
                        <div className="progress fill-60"></div>
                    </div>
                 </div>


            </div>
         </div>

        <div className="right-panel">
            <div className="bio-card">
                <h2> <User size = {20}/>BIOGRAFIA</h2>
                <p>
                    Me chamo Lola, mais conhecida como Geração Zee, tenho 22 anos e sou uma pessoa muito comunicativa, que adora aprender e conhecer pessoas novas. Criativa por natureza, estou sempre em busca de inovação e de propor ideias e soluções que contribuam positivamente nos ambientes profissionais. Durante minha graduação em Artes Visuais, descobri minha paixão por Design Gráfico, Fotografia e Animação, áreas que me ecantam e nas quais atuo com hobby ou em projetos academicos. Apesar de ainda não ter tido esperiências profissionais diretas nessas áreas, meu objetivo é, no futuro, construir uma carreira sólida nesse univérso criativo
                </p>
            </div>

            <div className="education-card">
                <h2> <GraduationCap/> FORMAÇÃO ACADEMICA</h2>
                <p><strong> <School size = {16}/>EEEM Francelina Carneiro Setúbal</strong></p>
                <p>Técnico em Administração de Empresas</p>
                <p>2019 - 2021</p>

                <br />

                <p><strong> <School size ={16}/>UFRB - Universidade Federal do Recôncavo da Bahia</strong></p>
                <p>Bacharelado em Artes Visuais</p>
                <p>2022 - 2026</p>
            </div>
        </div>

        </div>

    )
}

export default CurriculumWindow