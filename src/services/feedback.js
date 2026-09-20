import emailjs from '@emailjs/browser'

// Public identifiers, not private secrets. Defaults preserve the existing deploy.
// VITE_* overrides are public too; never put a private key in them.
const config = {
  serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID || 'service_sw9p3np',
  templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'template_8u0reyz',
  publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY || '4YEaVy23Wp6QlIbIJ',
}

export function sendFeedback(values) {
  return emailjs.send(config.serviceId, config.templateId, {
    ...values,
    data: new Date().toLocaleString('pt-BR'),
  }, { publicKey: config.publicKey })
}

