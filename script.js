// ======================== CONFIGURAÇÕES ========================

// 1) Endpoint do serviço de formulário (ex.: Formspree)
// Crie um form em https://formspree.io, copie o endpoint e cole aqui:
const FORM_ENDPOINT = "https://formspree.io/f/xblenaak"

// 2) Link do grupo do WhatsApp (link de convite)
const WHATSAPP_GROUP_URL = "https://chat.whatsapp.com/LUfU4z8KkL1DpOsvGYJ0Mo"

// 3) Data/hora da live (para o countdown)
const LIVE_DATE = new Date("2025-12-16T19:30:00-03:00") // ajuste o horário

// ======================== CONTAGEM REGRESSIVA ====================================

function startCountdown() {
  const daysEl = document.getElementById("days")
  const hoursEl = document.getElementById("hours")
  const minutesEl = document.getElementById("minutes")
  const secondsEl = document.getElementById("seconds")

  if (!daysEl) return

  function updateCountdown() {
    const now = new Date()
    const diff = LIVE_DATE.getTime() - now.getTime()

    if (diff <= 0) {
      daysEl.textContent = "00"
      hoursEl.textContent = "00"
      minutesEl.textContent = "00"
      secondsEl.textContent = "00"
      return
    }

    const totalSeconds = Math.floor(diff / 1000)
    const days = Math.floor(totalSeconds / (3600 * 24))
    const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = totalSeconds % 60

    daysEl.textContent = String(days).padStart(2, "0")
    hoursEl.textContent = String(hours).padStart(2, "0")
    minutesEl.textContent = String(minutes).padStart(2, "0")
    secondsEl.textContent = String(seconds).padStart(2, "0")
  }

  updateCountdown()
  setInterval(updateCountdown, 1000)
}

// ======================== FORMULÁRIO ========================

function setupForm() {
  const form = document.getElementById("liveForm")
  if (!form) return

  const successEl = document.getElementById("formSuccess")

  function showError(fieldName, message) {
    const errorEl = document.querySelector(
      `.error-message[data-for="${fieldName}"]`
    )
    if (errorEl) {
      errorEl.textContent = message || ""
    }
  }

  function clearErrors() {
    const errorEls = document.querySelectorAll(".error-message")
    errorEls.forEach(el => (el.textContent = ""))
  }

  function validate() {
    clearErrors()

    const name = form.name.value.trim()
    const email = form.email.value.trim()
    const whatsapp = form.whatsapp.value.trim()
    const cnpj = form.cnpj.value.trim()
    const role = form.role.value.trim()

    let valid = true

    if (!name) {
      showError("name", "Informe seu nome completo.")
      valid = false
    }

    if (!email) {
      showError("email", "Informe seu e-mail.")
      valid = false
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      showError("email", "E-mail inválido.")
      valid = false
    }

    if (!whatsapp) {
      showError("whatsapp", "Informe seu WhatsApp.")
      valid = false
    }

    if (!cnpj) {
      showError("cnpj", "Informe o CNPJ da empresa.")
      valid = false
    } else if (cnpj.replace(/\D/g, "").length < 14) {
      showError("cnpj", "CNPJ aparentemente incompleto.")
      valid = false
    }

    if (!role) {
      showError("role", "Selecione seu cargo.")
      valid = false
    }

    return valid
  }

  form.addEventListener("submit", async event => {
    event.preventDefault()
    if (!validate()) return

    if (successEl) {
      successEl.hidden = true
      successEl.textContent = ""
    }

    const formData = {
      nome: form.name.value.trim(),
      email: form.email.value.trim(),
      whatsapp: form.whatsapp.value.trim(),
      cnpj: form.cnpj.value.trim(),
      cargo: form.role.value.trim(),
      origem: "Landing page Live NR-1",
    }

    try {
      const response = await fetch(FORM_ENDPOINT, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error("Falha ao enviar o formulário.")
      }

      // Sucesso: mensagem + limpar + abrir grupo do WhatsApp
      form.reset()
      if (successEl) {
        successEl.hidden = false
        successEl.textContent =
          "Inscrição enviada com sucesso! Confira seu e-mail e clique para entrar no grupo do WhatsApp."
      }

      // abre o grupo em nova aba
      if (WHATSAPP_GROUP_URL) {
        window.open(WHATSAPP_GROUP_URL, "_blank")
      }
    } catch (error) {
      console.error(error)
      showError("email", "Ocorreu um erro ao enviar. Tente novamente.")
    }
  })
}

// ======================== FAQ (ACORDEÃO) ========================

function setupFAQ() {
  const faqItems = document.querySelectorAll(".faq-item")
  if (!faqItems.length) return

  faqItems.forEach(item => {
    const btn = item.querySelector(".faq-question")
    if (!btn) return
    btn.addEventListener("click", () => {
      const isActive = item.classList.contains("active")
      faqItems.forEach(i => i.classList.remove("active"))
      if (!isActive) item.classList.add("active")
    })
  })
}

// ======================== FOOTER ANO ========================

function setYear() {
  const yearEl = document.getElementById("year")
  if (!yearEl) return
  yearEl.textContent = new Date().getFullYear()
}

// ======================== INIT ========================

document.addEventListener("DOMContentLoaded", () => {
  startCountdown()
  setupForm()
  setupFAQ()
  setYear()
})
