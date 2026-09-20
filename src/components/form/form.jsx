import { useEffect, useRef, useState } from 'react'
import { sendFeedback } from '../../services/feedback'
import './form.css'

function SuggestionsForm({ onClose, unlockAchievements }) {
  const [status, setStatus] = useState('idle')
  const inFlight = useRef(false)
  const mounted = useRef(false)
  const loading = status === 'loading'

  useEffect(() => {
    mounted.current = true
    return () => { mounted.current = false }
  }, [])

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (inFlight.current) return
    const form = event.currentTarget
    const values = Object.fromEntries(new FormData(form))
    values.nome = values.nome.trim()
    values.mensagem = values.mensagem.trim()
    values.email = values.email.trim()
    if (!values.nome || !values.mensagem) {
      setStatus('invalid')
      return
    }
    inFlight.current = true
    setStatus('loading')
    try {
      await sendFeedback(values)
    } catch {
      if (mounted.current) setStatus('error')
      return
    } finally {
      inFlight.current = false
    }
    if (!mounted.current) return
    setStatus('success')
    form.reset()
    unlockAchievements('Muito Obrigado 🤩')
  }

  return (
    <div className="form-overlay">
      <section className="form-window" role="dialog" aria-modal="true" aria-label="Deixe seu Feedback">
        <div className="form-header">
          <span>📡 Deixe seu Feedback</span>
          <button onClick={onClose} aria-label="Fechar feedback">✖</button>
        </div>
        <div className="form-status-bar">🟢 Sistema online • 🛰️ Conectado</div>
        {status !== 'success' && (
          <form onSubmit={handleSubmit} className="form-content" aria-busy={loading}>
            <label className="sr-only" htmlFor="feedback-name">Seu nome</label>
            <input id="feedback-name" name="nome" placeholder="Seu nome..." autoComplete="name" maxLength={120} required disabled={loading} />
            <label className="sr-only" htmlFor="feedback-email">Seu email (opcional)</label>
            <input id="feedback-email" name="email" type="email" placeholder="Seu email (opcional)" autoComplete="email" maxLength={254} disabled={loading} />
            <label className="sr-only" htmlFor="feedback-type">Tipo de feedback</label>
            <select id="feedback-type" name="tipo" disabled={loading}>
              <option>✨ Nova funcionalidade</option>
              <option>🐞 Bug</option>
              <option>🎨 Visual</option>
              <option>🎮 Ideia criativa</option>
            </select>
            <label className="sr-only" htmlFor="feedback-message">Descreva seu feedback</label>
            <textarea id="feedback-message" name="mensagem" placeholder="Descreva seu feedback" maxLength={5000} required disabled={loading} />
            {status === 'error' && <p role="alert" className="form-error">Não foi possível enviar. Seus dados foram mantidos; tente novamente.</p>}
            {status === 'invalid' && <p role="alert" className="form-error">Preencha seu nome e a mensagem.</p>}
            <button type="submit" disabled={loading}>{loading ? 'Enviando...' : 'Enviar'}</button>
          </form>
        )}
        {loading && <div className="loading" role="status"><p>📦 Compactando dados...</p><p>📡 Enviando pacote...</p></div>}
        {status === 'success' && (
          <div className="success" role="status">
            <p>✔ Feedback enviado!</p>
            <p>Agradecemos muito a colaboração!</p><br /><br />
            <p>Saiba que você foi importante para esse projeto 🫶</p>
          </div>
        )}
      </section>
    </div>
  )
}

export default SuggestionsForm

