import "./terminal.css"
import { useEffect, useState } from "react"

function Terminal({onClose, setMatrixMode, setRaveMode, unlockAchievements}) {

    const [input, setInput] = useState("")
    const [ready, setReady] = useState(false)
    const [history,setHistory] = useState([
        "Heloysa OS Terminal v1.0",
        "Digite 'help' para ver os comandos"
    ])

    const commands = {
        help: () => [
            "Comandos disponíveis:",
            "about - sobre o sistema",
            "skills - mostrar skills",
            "clear - limpar terminal",
            "exit - fechar terminal",
            "matrix - efeito matrix (!!!Luz piscando)",
            "rave - modo festa (!!!Luz piscando)"
        ],

        about: () => [
            "Geração Zee OS",
            "Sistema interativo criado em React",
            "Portifólio criativo estilo desktop",
            "Criado por: André Michalsky S2"
        ],

        skills: () => [
            "Skills carregadas:",
            "Desing",
            "Fotografia",
            "Animação",
            "Modelagem 3d",
            "Desenho"
        ],

        clear: () => {
            setHistory([])
            return []
        },

        exit: () => {
            onClose()
            return[]
        },

        matrix: () => {

                setMatrixMode(true)

                setTimeout(() => {
                    setMatrixMode(false)
                }, 8000)

                return [
                    "Conectando ao mainframe...",
                    "Carregando protocolos...",
                    "Matrix iniciada."
                ]
    },

    rave: () => {
        setRaveMode(true)

        setTimeout(() => {
            setRaveMode(false)
        }, 5000)

        return [
            "Modo festa ativado 🕺",
            "Cuidado com as cores..."
    ]
    },

    easteregg: () => {
        unlockAchievements("Essa tava obvia 😁")

        return [
            "Easter Egg encontrado"
        ]
    }


    }

    const handleCommand = (cmd) => {
        const command = cmd.toLowerCase()

        if (commands[command]) {
            const result = commands[command]()

            setHistory(prev => [
                ...prev,
                `> ${cmd}`,
                ...result
            ])
        } else {
             setHistory(prev => [
                ...prev,
                `> ${cmd}`,
                "Comando não encontrado"
            ])
        }
    }

    const handleSubmit = (e) => {
        
        e.preventDefault()

        if (!input) return

        handleCommand(input)

        setInput("")

    }

    useEffect(() => {
        setTimeout(() => {
            setReady(true)
        },100)
    }, [])

    return (
      <div className="terminal-overlay">
            <div className="terminal-window">
                    <div className ="terminal-header">
                            <span>Terminal</span>
                            <button onClick={onClose}>X</button>
                    </div>

                    <div className="terminal-body">
                        {history.map((line, i) => (
                            <div key={i}> {line} </div>
                        ))}
                    </div>

                    <form onSubmit={handleSubmit}>
                        <span>{">"}</span>

                        <input
                            value={input}
                            onChange={(e) => {
                                if(!ready) return
                                setInput(e.target.value)
                            }}
                            autoFocus
                        />
                    </form>
            </div>
      </div>
    )
}

export default Terminal