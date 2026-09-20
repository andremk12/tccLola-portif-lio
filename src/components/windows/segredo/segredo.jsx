import "./segredo.css";
import { useRef, useState } from "react";
import { useTimeouts } from "../../../hooks/useTimeouts";
import nos from "../../../assets/nos.jpeg";
import fut from "../../../assets/futebol.jpeg"

import { poneis, questions } from "../../../data/quiz";

function SecretWindow({ unlockAchievements }) {
  const inputs = useRef([]);
  const { schedule, cancel } = useTimeouts();
  const [code, setCode] = useState(["", "", "", "", ""]);
  const [unlocked, setUnlocked] = useState(false);
  const [hint, setHint] = useState("");
  const [error, setError] = useState(false);
  const [surprise, setSurprise] = useState(false);
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState([])
  const [result, setResult] = useState(null)
  const SECRET = "55555";

  const calculateResult = (answersList, surpriseRoll) => {

    if (surpriseRoll < 0.05) {
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

  const handleAnswer = (pony, surpriseRoll) => {
    const newAnswers = [...answers, pony]
    setAnswers(newAnswers)

    if(step + 1 >= questions.length) {
      calculateResult(newAnswers, surpriseRoll)
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
      inputs.current[index + 1]?.focus();
    }
  };

  const resetCode = () => {
    cancel("shake");
    setCode(["", "", "", "", ""]);
    setHint("");
    setError(false);
    inputs.current[0]?.focus();
  };

  const handlePaste = (event, index) => {
    const pasted = event.clipboardData.getData("text").trim();
    if (!/^\d+$/.test(pasted)) return;
    event.preventDefault();
    const start = pasted.length === code.length ? 0 : index;
    const digits = pasted.slice(0, code.length - start).split("");
    const next = [...code];
    digits.forEach((digit, offset) => { next[start + offset] = digit });
    setCode(next);
    inputs.current[Math.min(code.length - 1, start + digits.length)]?.focus();
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const entered = code.join("");

    if (entered === SECRET) {
      setUnlocked(true);
      unlockAchievements("Segredo descoberto 🔐");
    } else if (entered === "02408") {
      setSurprise(true);
    } else {
      setError(true);
      schedule("shake", () => setError(false), 800);

      if (entered === "00000") setHint("Nada é tão vazio assim...");
      else if (entered === "12345")
        setHint("Muito óbvio 😏, tente ao contrario");
      else if (entered === "54321") setHint(" oıʌqo̗ oʇınW");
      else if (entered === "99999") setHint("Quase... ou não 👀");
      else setHint("");
    }
  };

  if (surprise) {
    return (
      <div className="secret-love">
        <div className="love-card-horizontal">
          <div className="love-photo-wrapper">
            <img src={nos} alt="Nós dois" className="love-photo-horizontal" />

            <div className="photo-glow" aria-hidden="true"></div>
          </div>

          <div className="love-content">
            <h3>De André para Lola</h3>

            <p>
              Sei que estressada agora, por mudanças na rotina, mas respira… vai
              dar tudo certo. Você é talentosa, capaz e eu sempre vou estar aqui
              por você.
            </p>
            <p>
              Sei que não é muita coisa, mas foi de coração. Você é muito
              importante para mim!
            </p>
            <p>Te amo ❤️</p>

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

            <div className="quiz-progress" aria-live="polite">
              Pergunta {step + 1}/{questions.length}
            </div>


            <p>{currentQuestion.question}</p>

            <div className="quiz-options">
            {currentQuestion.options.map(option => (
                <button
                  key = {option.text}
                  className="enter-btn"
                  onClick={() => handleAnswer(option.pony, Math.random())}
                >
                  {option.text}
                </button>
            ))}
            </div>

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
                    alt={result.name}
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
    <form onSubmit={handleSubmit} className={`secret-container ${error ? "shake" : ""}`}>
      <h2 className="secret-title"> 🔐 Área Restrita </h2>

      <div className="code-inputs">
        {code.map((digit, i) => (
          <input
            key={i}
            ref={element => { inputs.current[i] = element }}
            aria-label={`Dígito ${i + 1} do código`}
            inputMode="numeric"
            value={digit}
            maxLength={1}
            onChange={(e) => handleChange(e.target.value, i)}
            onPaste={(event) => handlePaste(event, i)}
            onKeyDown={(event) => {
              if (event.key === "Backspace" && !digit && i > 0) {
                event.preventDefault();
                inputs.current[i - 1]?.focus();
              }
            }}
          />
        ))}
      </div>

      <div className="code-tools">
        <button className="enter-btn" type="submit">
          ENTER
        </button>

        <button
          className="enter-btn"
          type="button"
          onClick={resetCode}
        >
          RESET
        </button>
      </div>

      {hint && <p className="hint" role="status">{hint}</p>}

      <div className="scanlines" aria-hidden="true" />
    </form>
  );
}

export default SecretWindow;
