import "./contact.css"

import { useLayoutEffect, useRef, useState } from "react"
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
    const draggedName = useRef(null)
    const focusAfterMove = useRef(null)
    const contactElements = useRef(new Map())

    useLayoutEffect(() => {
        if (!focusAfterMove.current) return
        contactElements.current.get(focusAfterMove.current)?.focus()
        focusAfterMove.current = null
    }, [contacts])

    const moveContact = (name, target, restoreFocus = false) => {
        const from = contacts.findIndex(item => item.name === name)
        if (from < 0 || target < 0 || target >= contacts.length || from === target) return
        const updated = [...contacts]
        updated.splice(target, 0, updated.splice(from, 1)[0])
        if (restoreFocus) focusAfterMove.current = name
        setContacts(updated)
        saveContactOrder(updated)
    }

    const handleDrop = (event, dropIndex) => {
        event.preventDefault()
        moveContact(draggedName.current, dropIndex)
        draggedName.current = null
    }

    return (
        <div className={`contact-container theme-${theme}`}>

            <div className = "contact-sidebar">
                <h3>Acesso Rápido</h3>
                <div className="contact-shortcuts">
                <p>Desktop</p>
                <p className="active">Contatos</p>
                <p>Músicas</p>
                </div>
            </div>

            <div className = "contact-main">


                <div className = "contact-toolbar">
                        <div className="toolbar-left">
                            <button type="button" disabled title="Em desenvolvimento">📁 Arquivo</button>
                            <button type="button" disabled title="Em desenvolvimento">✉️ Enviar</button>
                            <button type="button" disabled title="Em desenvolvimento">⭐ Favoritos</button>
                        </div>
                            <div className="toolbar-right">
                        <span>{contacts.length} itens</span>
                    </div>

                </div>


                <div className="contact-grid">
                    {contacts.map((item, i) => (
                        <a
                            key={item.name}
                            ref={element => {
                                if (element) contactElements.current.set(item.name, element)
                                else contactElements.current.delete(item.name)
                            }}
                            href={item.link && item.link !== "#" ? item.link : undefined}
                            aria-disabled={!item.link || item.link === "#"}
                            tabIndex={0}
                            title={`${!item.link || item.link === "#" ? "Contato ainda não configurado. " : ""}Alt + setas para reordenar`}
                            onKeyDown={(event) => {
                                if (!event.altKey || !["ArrowLeft", "ArrowRight"].includes(event.key)) return
                                event.preventDefault()
                                const target = Math.max(0, Math.min(contacts.length - 1, i + (event.key === "ArrowLeft" ? -1 : 1)))
                                moveContact(item.name, target, true)
                            }}
                            target="_blank"
                            rel = "noreferrer"
                            className="contact-item"
                            draggable
                            onDragStart={(event) => {
                                draggedName.current = item.name
                                event.dataTransfer.effectAllowed = "move"
                                event.dataTransfer.setData("text/plain", item.name)
                            }}
                            onDragEnd={() => { draggedName.current = null }}
                            onDragOver={(event) => {
                                event.preventDefault()
                                event.dataTransfer.dropEffect = draggedName.current ? "move" : "none"
                            }}
                            onDrop={(event) => handleDrop(event, i)}
                            style = {{"--accent": item.color}}
                            >
                        <div className="icon-wrapper">
                                {iconMap[item.name]}
                                <span className={`status ${item.status}`} aria-hidden="true"></span>
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
