import "./segredo.css";
import { useEffect, useState } from "react";
import nos from "../../../assets/nos.jpeg";
import ap from "../../../assets/apple.jpg";
import fl from "../../../assets/fluter.jpg";
import tw from "../../../assets/twilight.jpg";
import rbd from "../../../assets/rbd.jpg";
import pp from "../../../assets/pikie.png";
import rar from "../../../assets/rarity.jpg";

function SecretWindow({ unlockAchievements }) {
  const [code, setCode] = useState(["", "", "", "", ""]);
  const [unlocked, setUnlocked] = useState(false);
  const [hint, setHint] = useState("");
  const [error, setError] = useState(false);
  const [surprise, setSurprise] = useState(false);
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

  const [currentPony, setCurrentPony] = useState(poneis[0]);

  const randomPonei = () => {
    const random = poneis[Math.floor(Math.random() * poneis.length)]
    setCurrentPony(random)
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

  if (unlocked) {
    return (
      <div className="secret-container pony-mode">
          <h2 className="secret-title">🦄 Gerador de Poneis 🦄</h2>

          <div className="pony-box" style  = {{ boxShadow: `0 0 25px ${currentPony.color}`,  border: `1px solid ${currentPony.color}`}}>
              <img src={currentPony.img} className="pony-img"/>

              <h3>{currentPony.name}</h3>
              <p>{currentPony.desc}</p>

              <div className="code-tools">
                  <button className ="enter-btn" onClick={randomPonei}>
                      TROCAR
                  </button>


                  <button
                    className="enter-btn"
                    onClick={() => {
                      setUnlocked(false);
                      setCode(["", "", "", "", ""])
                    }}
                    >
                      VOLTAR
                  </button>
              </div>
          </div>

          <div className="scanlines"/>
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
