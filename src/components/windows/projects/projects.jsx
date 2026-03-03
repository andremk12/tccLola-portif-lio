import "./projects.css"
import { useState } from "react"

function Projects (){
    
    const projectsData = [
        {
            id:  1,
            name: "Projeto 1",
            color: "#e5738b",
            description: "Portifóio inspirado em um sistema de desktop interativo",
            details: "Construido com React, foco em interações e estética retrô",
            version: "v1.0.0"
        },
        {
            id:  2,
            name: "Projeto 2",
            color: "#7fd1c8",
            description: "Descrição do projeto 2",
            details: "Detalhes do projeto 2",
            version: "v0.8.2"
        },
        {
            id:  3,
            name: "Projeto 3",
            color: "#e7c37f",
            description: "Descrição do projeto 3",
            details: "Detalhes do projeto 3",
            version: "v2.1.4"
        },
    ]

    const [activeProject, setActiveProject] = useState(projectsData[0])

    return (
        <div className = "projects-container">
                <div className = "projects-tabs">
                            {projectsData.map( p => (
                                <button
                                key={p.id}
                                className={`tab ${activeProject.id === p.id ? "active" : ""}`}
                                style = {{"--tab-color": p.color}}
                                onClick={() => setActiveProject(p)}
                                >
                                    {p.name}
                                </button>
                            )
                        )}
                </div>

            <div key = {activeProject.id} className = "projects-content" style ={{background: activeProject.color}}> 
                    <div className="projects-preview">
                            <div className="preview-box">
                                <span>Preview</span>
                            </div>
                            <div className="preview-box large"/>
                    </div>

                    <div className="projects-text">
                       
                        <div className="project-header">
                            <h2>{activeProject.name}</h2>
                            <span className="project-version">
                                {activeProject.version}
                            </span>
                        </div>

                        <div className = "project-meta">
                            <span>Ano: 2024</span>
                            <span>Tecnologia: React + Vite</span>
                        </div>

                        <div className="project-description">
                            <p>{activeProject.description}</p> 
                            <p>{activeProject.details}</p> 
                        </div>

                        <div className="project-actions">
                            <button>Abrir Projeto</button>
                            <button>Ver inspirações</button>
                        </div>
                    </div>
            </div>
        </div>

    )
}

export default Projects