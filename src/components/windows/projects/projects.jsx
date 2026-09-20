import "./projects.css"
import { useState } from "react"
import { projectsData } from "../../../data/projects"

function Projects ({theme}){

    const [activeProject, setActiveProject] = useState(projectsData[0])

    return (
        <div  className={`projects-container theme-${theme}`}>
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
