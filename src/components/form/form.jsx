import { useState } from "react";
import emailjs from "@emailjs/browser"
import "./form.css";

function SugestionsForm({ onClose, unlockAchievements }) {
  const [loading, setLoading] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [erro, setErro] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setErro(false)

        const form = e.target

        // cria campo hidden para data
        const dataInput = document.createElement("input")
        dataInput.type = "hidden"
        dataInput.name = "data"
        dataInput.value = new Date().toLocaleString()
        form.appendChild(dataInput)

        try {
            await emailjs.sendForm(
                "service_sw9p3np",   
                "template_8u0reyz",  
                form,
                "4YEaVy23Wp6QlIbIJ"   
            )

            setEnviado(true)
            unlockAchievements("Muito Obrigado 🤩")

            form.reset()

        } catch (error) {
            console.error("Erro ao enviar:", error)
            setErro(true)
        }

        setLoading(false)
    }

  return (
    <div className="form-overlay">
      <div className="form-window">
        <div className="form-header">
          <span>📡 Deixe seu Feedback</span>
          <button onClick={onClose}>✖</button>
        </div>

        <div className="form-status-bar">🟢 Sistema online • 🛰️ Conectado</div>

        {!enviado && !loading && (
          <form onSubmit={handleSubmit} className="form-content">
            <input name="nome" placeholder="Seu nome..." required />

            <input name="email" placeholder="Seu email (opcional)" />

            <select name="tipo">
              <option>✨ Nova funcionalidade</option>
              <option>🐞 Bug</option>
              <option>🎨 Visual</option>
              <option>🎮 Ideia criativa</option>
            </select>

            <textarea
              name="mensagem"
              placeholder="Descreva seu feedback"
              required
            ></textarea>

            <button type="submit"> Enviar </button>
          </form>
        )}

        {loading && (
          <div className="loading">
            <p>📦 Compactando dados...</p>
            <p>📡 Enviando pacote...</p>
          </div>
        )}

        {enviado && (
          <div className="success">
            <p>✔ Feedback enviado!</p>
            <p>Agradecemos muito a colaboração!</p>
            <br />
            <br />
            <p>Saiba que você foi importante para esse projeto 🫶</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default SugestionsForm;
