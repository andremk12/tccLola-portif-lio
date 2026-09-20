import { useDialog } from "../../hooks/useDialog"
import { allAchievements } from "../../data/achievements"
import { useTimeouts } from "../../hooks/useTimeouts"
import "./terminal.css"
import { useEffect, useState } from "react"

function Terminal({onClose, setMatrixMode, setRaveMode, unlockAchievements, achievements, activatePet, deactivatePet}) {
  const dialogRef = useDialog(onClose)

    const { schedule } = useTimeouts()
    const [input, setInput] = useState("")
    const [history,setHistory] = useState([
        "Geração Zee OS Terminal v1.0",
        "Digite 'help' para ver os comandos"
    ])
    const [commandHistory, setCommandHistory] = useState([])
    const [historyIndex, setHistoryIndex] = useState(-1)

    const commands = {
        help: () => [
            "Comandos disponíveis:",
            "about - sobre o sistema",
            "skills - mostrar skills",
            "clear - limpar terminal",
            "dev - sobre o desenvolvedor",
            "futebol - ativa a futebol",
            "tchaufutebol - desativa a futebol",
            "matrix - efeito matrix (!!!Luz piscando)",
            "rave - modo festa (!!!Luz piscando)",
            "achievements - ver progresso das conquistas",
            "exit - fechar terminal",
            "",
            "Dica: pressione TAB para autocompletar comandos."
        ],

        about: () => [
            "Geração Zee OS",
            "Sistema interativo criado em React",
            "Portifólio criativo estilo desktop",
            "Criado por: André Michalsky S2"
        ],

        dev: () => [
                "Desenvolvedor: André Michalsky",
                "",
                "Formado em Ciência da Computação pela Universidade Vila Velha (UVV).",
                "Atualmente atuo como Analista de Redes, trabalhando com infraestrutura,conectividade e soluções tecnológicas.",
                "Tenho interesse em desenvolvimento, sistemas interativos e criação de experiências digitais criativas, como este portfólio em formato de sistema operacional.",
                "",
                "E acima de tudo: sou feliz fazendo o que gosto. :)"
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

                schedule("matrix", () => {
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

        schedule("rave", () => {
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
    },

    achievements: () => {
        const unlocked = achievements.length
        const total = Object.keys(allAchievements).length

        const remaining = Object.keys(allAchievements).filter(a => !achievements.includes(a))

        return [
                `Conquistas desbloqueadas: ${unlocked}/${total}`,
            "",
            "Desbloqueadas:",
            ...achievements,
            "",
            "Dicas para as restantes:",
        ...remaining.map(a => `• ${allAchievements[a]}`)
        ]
    },

    futebol: () => {
        activatePet()

        return [
            "Inicializando módulo...",
            "A futebol chegou!"
        ]
    },

    tchaufutebol: () => {
        deactivatePet()

        return [
            "Miaaau (Em Gatês, significa tchau)"
        ]
    }

    }


    const commandList = Object.keys(commands)

    const handleKeyDown = (e) => {
        if (e.key === "Tab") {
            e.preventDefault()


        const matches = commandList.filter(cmd => cmd.startsWith(input.toLowerCase()))

        if (matches.length === 1) {
            setInput(matches[0])
        }
     }

     if (e.key === "ArrowUp") {
        e.preventDefault()

        if (commandHistory.length === 0) return

        const newIndex = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1)

        setHistoryIndex(newIndex)
        setInput(commandHistory[newIndex])
     }

     if (e.key === "ArrowDown") {
        e.preventDefault()

        if (historyIndex === -1) return

        const newIndex = historyIndex + 1

        if(newIndex >= commandHistory.length) {
            setHistoryIndex(-1)
            setInput("")
            return
        }

        setHistoryIndex(newIndex)
        setInput(commandHistory[newIndex])
     }
    }

    const handleCommand = (cmd) => {
        const command = cmd.trim().toLowerCase()

        if (Object.hasOwn(commands, command)) {
            const result = commands[command]()
            if (command === "clear" || command === "exit") return

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

        if (!input.trim()) return

        handleCommand(input)

        setCommandHistory(prev => [...prev, input])
        setHistoryIndex(-1)

        setInput("")

    }


    useEffect(() => () => {
        setMatrixMode(false)
        setRaveMode(false)
    }, [setMatrixMode, setRaveMode])

    return (
      <div ref={dialogRef} tabIndex={-1} className="terminal-overlay">
            <div className="terminal-window">
                    <div className ="terminal-header">
                            <span>Terminal</span>
                            <button onClick={onClose} aria-label="Fechar terminal">X</button>
                    </div>

                    <div className="terminal-body">
                        {history.map((line, i) => (
                            <div key={i}> {line} </div>
                        ))}
                    </div>

                    <form onSubmit={handleSubmit}>
                        <span>{">"}</span>

                        <input
                            aria-label="Comando do terminal"
                            value={input}
                            onChange={(e) => {
                                setInput(e.target.value)
                            }}
                            onKeyDown={handleKeyDown}
                            autoFocus
                        />
                    </form>
            </div>
      </div>
    )
}

export default Terminal
