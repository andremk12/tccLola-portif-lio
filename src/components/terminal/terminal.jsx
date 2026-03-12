import Futebol from "../futebol/futebol"
import "./terminal.css"
import { useEffect, useState } from "react"

function Terminal({onClose, setMatrixMode, setRaveMode, unlockAchievements, achievements, activatePet}) {

    const [input, setInput] = useState("")
    const [ready, setReady] = useState(false)
    const [history,setHistory] = useState([
        "Geração Zee OS Terminal v1.0",
        "Digite 'help' para ver os comandos"
    ])

    const allAchievements = {
        "Curioso Investigador 🕵️": "Clique no ícone secreto no desktop",
        "Sistema incializado 💻": "Abra o menu iniciar pela primeira vez",
        "Explorador do Sistema": "Abra várias janelas do sistema",
        "Cliqueiro Profissional": "Clique bastante pelo desktop",
        "Administrador do Sistema 🛠": "Clique no desktop algumas vezes seguidas",
        "Manipulador do Tempo ⏳": "Clique várias vezes no relógio",
        "Mestre das Ferramentas 🎨": "Explore todas as ferramentas na taskbar",
        "Hacker do Sistema 💻": "Descubra o código secreto do terminal",
        "Mestre da Personalização 🎨": "Altere tema, wallpaper e cursor",
        "Curador da Galeria 🖼":"Busque uma ordem nos trabalhos",
        "Artista do Caos 🔥": "Rabisque bastante no quadro"
    }

    const commands = {
        help: () => [
            "Comandos disponíveis:",
            "about - sobre o sistema",
            "skills - mostrar skills",
            "clear - limpar terminal",
            "dev - sobre o desenvolvedor",
            "futebol - ativa a futebol",
            "matrix - efeito matrix (!!!Luz piscando)",
            "rave - modo festa (!!!Luz piscando)",
            "achievements - ver progresso das conquistas",
            "exit - fechar terminal",
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