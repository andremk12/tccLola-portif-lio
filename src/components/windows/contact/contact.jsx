import "./contact.css"

import { useState } from "react"
import { initialContacts } from "../../../data/contacts"
import { readContactOrder, saveContactOrder } from "../../../utils/contacts"
import {
    Linkedin,
    Instagram,
    Mail,
    Phone,
    Github,
    Globe
} from "lucide-react"

function ContactContent({theme}) {
    
    const iconMap = {
        LinkedIn: <Linkedin size={50} />,
        Instagram: <Instagram size={50} />,
        Email: <Mail size={50} />,
        Telefone: <Phone size={50} />,
        Github: <Github size={50} />,
        Portifólio: <Globe size={50} />
}

    const [contacts, setContacts] = useState(() => readContactOrder(initialContacts))
    const [dragIndex, setDragIndex] = useState(null)

    const handleDragStart = (index) => {
        setDragIndex(index)
    }

    const handleDragOver = (e) => {
        e.preventDefault()
    }

    const handleDrop = (dropIndex) => {
        if (dragIndex === null) return

        const updated = [...contacts]
        const draggedItem = updated[dragIndex]

        updated.splice(dragIndex, 1)
        updated.splice(dropIndex, 0, draggedItem)

        setContacts(updated)
        saveContactOrder(updated)
        setDragIndex(null)
    }

    return (
        <div className={`contact-container theme-${theme}`}>

            <div className = "contact-sidebar">
                <h3>Acesso Rápido</h3>
                <p>Desktop</p>
                <p className="active">Contatos</p>
                <p>Músicas</p>
            </div>

            <div className = "contact-main">

            
                <div className = "contact-toolbar">
                        <div className="toolbar-left">
                            <button>📁 Arquivo</button>
                            <button>✉️ Enviar</button>
                            <button>⭐ Favoritos</button>
                        </div>
                            <div className="toolbar-right">
                        <span>{contacts.length} itens</span>
                    </div>

                </div>

        
                <div className="contact-grid">
                    {contacts.map((item, i) => (
                        <a 
                            key={item.name}
                            href={item.link && item.link !== "#" ? item.link : undefined}
                            aria-disabled={!item.link || item.link === "#"}
                            tabIndex={0}
                            title="Alt + setas para reordenar"
                            onKeyDown={(event) => {
                                if (!event.altKey || !["ArrowLeft", "ArrowRight"].includes(event.key)) return
                                event.preventDefault()
                                const target = Math.max(0, Math.min(contacts.length - 1, i + (event.key === "ArrowLeft" ? -1 : 1)))
                                const updated = [...contacts]
                                updated.splice(target, 0, updated.splice(i, 1)[0])
                                setContacts(updated)
                                saveContactOrder(updated)
                            }}
                            target="_blank"
                            rel = "noreferrer"
                            className="contact-item"
                            draggable
                            onDragStart={() => handleDragStart(i)}
                            onDragEnd={() => setDragIndex(null)}
                            onDragOver={handleDragOver}
                            onDrop = {() => handleDrop(i)}
                            style = {{"--accent": item.color}}
                            >
                        <div className="icon-wrapper">
                                {iconMap[item.name]}
                                <span className={`status ${item.status}`}></span>
                        </div>
                            <span>{item.name}</span>
                        </a>
                    ))

                    }
                </div>
         </div>  
        </div>
    )
}

export default ContactContent