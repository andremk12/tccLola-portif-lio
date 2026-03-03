import "./contact.css"

import { useState, useEffect } from "react"
import {
    Linkedin,
    Instagram,
    Mail,
    Phone,
    Github,
    Globe
} from "lucide-react"

function ContactContent() {
    
    const initialContacts = [
        {
            name:"LinkedIn",
            link: "https://linkedin.com",
            color: "#0A66C2",
            status: "online"
        },
        {
            name:"Instagram",
            link: "https://instagram.com",
            color: "#E1306C",
            status: "online"
        },
        {
            name:"Email",
            link: "",
            color: "#EA4355",
            status: "offline"
        },
        {
            name:"Telefone",
            link: "",
            color: "#34A853",
            status: "offline"
        },
        {
            name:"Github",
            link: "https://github.com",
            color: "#333",
            status: "offline"
        },
        {
            name:"Portifólio",
            link: "#",
            color: "#8E44AD",
            status: "online"
        },
    ]

    const iconMap = {
        LinkedIn: <Linkedin size={50} />,
        Instagram: <Instagram size={50} />,
        Email: <Mail size={50} />,
        Telefone: <Phone size={50} />,
        Github: <Github size={50} />,
        Portifólio: <Globe size={50} />
}

    const [contacts, setContacts] = useState([])
    const [dragIndex, setDragIndex] = useState(null)

    useEffect(() => {
        const saved = localStorage.getItem("contactsOrder")
        if (saved) {
            setContacts(JSON.parse(saved))
        } else {
            setContacts(initialContacts)
        }
    }, [])

    useEffect(() => {
        if (contacts.length > 0) {
            localStorage.setItem("contactsOrder", JSON.stringify(contacts))
        }
    }, [contacts])

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
        setDragIndex(null)
    }

    return (
        <div className="contact-container">

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
                            key ={i}
                            href={item.link}
                            target="_blank"
                            rel = "noreferrer"
                            className="contact-item"
                            draggable
                            onDragStart={() => handleDragStart(i)}
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