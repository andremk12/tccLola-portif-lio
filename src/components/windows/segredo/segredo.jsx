import "./segredo.css";
import { useEffect, useState } from "react";
import nos from "../../../assets/nos.jpeg";
import ap from "../../../assets/apple.jpg";
import fl from "../../../assets/fluter.jpg";
import tw from "../../../assets/twilight.jpg";
import rbd from "../../../assets/rbd.jpg";
import pp from "../../../assets/pikie.png";
import rar from "../../../assets/rarity.jpg";
import fut from "../../../assets/futebol.jpeg"

function SecretWindow({ unlockAchievements }) {
  const [code, setCode] = useState(["", "", "", "", ""]);
  const [unlocked, setUnlocked] = useState(false);
  const [hint, setHint] = useState("");
  const [error, setError] = useState(false);
  const [surprise, setSurprise] = useState(false);
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState([])
  const [result, setResult] = useState(null)
  const SECRET = "55555";

const poneis = [
  {
    name: "Twilight Sparkle",
    desc: "A princesa da amizade ✨",
    img: tw,
    color: "#a55eea",
  },
  {
    name: "Rainbow Dash",
    desc: "20% mais rápida ⚡",
    img: rbd,
    color: "#00a8ff",
  },
  {
    name: "Pinkie Pie",
    desc: "Caos e festas 🎉",
    img: pp,
    color: "#ff6bcb",
  },
  {
    name: "Fluttershy",
    desc: "Timidez nível máximo 🦋",
    img: fl,
    color: "#feca57",
  },
  {
    name: "Rarity",
    desc: "Elegância absoluta 💎",
    img: rar,
    color: "#dfe6e9",
  },
  {
    name: "Apple Jack",
    desc: "Honestidade acima de tudo 🍎",
    img: ap,
    color: "#e17055",
  },
];

const questions = [
  {
    question: "Qual sua atividade favorita?",
    options: [
      { text: "Ler livros", pony: "Twilight Sparkle" },
      { text: "Praticar esportes", pony: "Rainbow Dash" },
      { text: "Ir para festas", pony: "Pinkie Pie" },
      { text: "Cuidar de animais", pony: "Fluttershy" },
      { text: "Moda e arte", pony: "Rarity" },
      { text: "Trabalho ao ar livre", pony: "Apple Jack" }
    ]
  },

  {
    question: "Como seus amigos te descrevem?",
    options: [
      { text: "Inteligente", pony: "Twilight Sparkle" },
      { text: "Corajoso", pony: "Rainbow Dash" },
      { text: "Engraçado", pony: "Pinkie Pie" },
      { text: "Gentil", pony: "Fluttershy" },
      { text: "Elegante", pony: "Rarity" },
      { text: "Confiável", pony: "Apple Jack" }
    ]
  },

  {
    question: "Qual defeito combina mais com você?",
    options: [
      { text: "Perfeccionismo", pony: "Twilight Sparkle" },
      { text: "Impulsividade", pony: "Rainbow Dash" },
      { text: "Agitação", pony: "Pinkie Pie" },
      { text: "Timidez", pony: "Fluttershy" },
      { text: "Vaidade", pony: "Rarity" },
      { text: "Teimosia", pony: "Apple Jack" }
    ]
  },

  {
    question: "O que você faria num apocalipse?",
    options: [
      { text: "Montaria um plano", pony: "Twilight Sparkle" },
      { text: "Viraria herói", pony: "Rainbow Dash" },
      { text: "Tentaria animar todos", pony: "Pinkie Pie" },
      { text: "Salvaria os animais", pony: "Fluttershy" },
      { text: "Continuaria fabuloso", pony: "Rarity" },
      { text: "Resolveria na força bruta", pony: "Apple Jack" }
    ]
  },

  {
    question: "Escolha uma comida:",
    options: [
      { text: "Sanduíche", pony: "Twilight Sparkle" },
      { text: "Energético", pony: "Rainbow Dash" },
      { text: "Bolo", pony: "Pinkie Pie" },
      { text: "Salada", pony: "Fluttershy" },
      { text: "Macaron francês", pony: "Rarity" },
      { text: "Torta de maçã", pony: "Apple Jack" }
    ]
  }
]

  const calculateResult = (answersList) => {

    // eslint-disable-next-line react-hooks/purity
    if (Math.random() < 0.05) {
      setResult({
        name: "Futebol",
        desc: "Você não é um ponei. Você é um gato",
        img: fut,
        color: "#ff7675"
      })
      return
    }

    const scores = {}

    answersList.forEach(answer => {
      scores[answer] = (scores[answer] || 0) + 1
    })

    const winner = Object.keys(scores).reduce((a, b)=> scores[a] > scores[b] ? a:b) 

    const pony = poneis.find(p => p.name === winner)

    setResult(pony)
  }

  const answersQuestion = (pony) => {
    const newAnswers = [...answers, pony]
    setAnswers(newAnswers)

    if(step + 1 >= questions.length) {
      calculateResult(newAnswers)
    } else {
      setStep(step + 1)
    }
  }

  const handleChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < 4) {
      document.getElementById(`input-${index + 1}`).focus();
    }
  };

  const handleSubmit = () => {
    const entered = code.join("");

    if (entered === SECRET) {
      setUnlocked(true);
      unlockAchievements("Segredo descoberto 🔐");
    } else if (entered === "02408") {
      setSurprise(true);
    } else {
      setError(true);
      setTimeout(() => setError(false), 800);

      if (entered === "00000") setHint("Nada é tão vazio assim...");
      else if (entered === "12345")
        setHint("Muito óbvio 😏, tente ao contrario");
      else if (entered === "54321") setHint(" oıʌqo̗ oʇınW");
      else if (entered === "99999") setHint("Quase... ou não 👀");
      else setHint("");
    }
  };

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Enter") handleSubmit();
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  });

  if (surprise) {
    return (
      <div className="secret-love">
        <div className="love-card-horizontal big">
          <div className="love-photo-wrapper">
            <img src={nos} alt="Nós dois" className="love-photo-horizontal" />

            <div className="photo-glow"></div>
          </div>

          <div className="love-content">
            <h3>De André para Lola</h3>

            <p>
              Sei que estressada agora, por mudanças na rotina, mas respira… vai
              dar tudo certo. Você é talentosa, capaz e eu sempre vou estar aqui
              por você.
              <br />
              <br />
              Sei que não é muita coisa, mas foi de coração. Você é muito
              importante para mim!
              <br />
              <br />
              Te amo ❤️
            </p>

            <div className="hearts">💗 💖 💕</div>
          </div>
        </div>
      </div>
    );
  }

  if (unlocked && !result) {
   
    const currentQuestion = questions[step]

    return (
        <div className="secret-container pony-mode">
            <h2>Qual pônei você é</h2>
        
        <div className="quiz-box">

            <div className="quiz-progress">
              Pergunta {step + 1}/{questions.length}
            </div>


            <p>{currentQuestion.question}</p>

            {currentQuestion.options.map(option => (
                <button
                  key = {option.text}
                  className="enter-btn"
                  onClick={() => answersQuestion(option.pony)}
                >
                  {option.text}
                </button>
            ))}

        </div>
      </div>
      
    )
  }
  
  if (result) {
    return(

      <div className="secret-container pony-mode">
          <h2>✨ Resultado ✨</h2>


            <div
                className="pony-box"
                style={{
                    boxShadow: `0 0 25px ${result.color}`,
                    border: `1px solid ${result.color}`
                }}
            >
                <img
                    src={result.img}
                    className="pony-img"
                />

                <h3>{result.name}</h3>

                <p>{result.desc}</p>

                <button
                    className="enter-btn"
                    onClick={() => {
                        setStep(0)
                        setAnswers([])
                        setResult(null)
                    }}
                >
                    Fazer novamente
                </button>
            </div>
      </div>

    )
  } 


  return (
    <div className={`secret-container ${error ? "shake" : ""}`}>
      <h2 className="secret-title"> 🔐 Área Restrita </h2>

      <div className="code-inputs">
        {code.map((digit, i) => (
          <input
            key={i}
            id={`input-${i}`}
            value={digit}
            maxLength={1}
            onChange={(e) => handleChange(e.target.value, i)}
          />
        ))}
      </div>

      <div className="code-tools">
        <button className="enter-btn" onClick={handleSubmit}>
          ENTER
        </button>

        <button
          className="enter-btn"
          onClick={() => setCode(["", "", "", "", ""])}
        >
          RESET
        </button>
      </div>

      {hint && <p className="hint">{hint}</p>}

      <div className="scanlines" />
    </div>
  );
}

export default SecretWindow;
