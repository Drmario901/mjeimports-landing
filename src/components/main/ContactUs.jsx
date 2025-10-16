"use client"

import { useEffect, useRef, useState } from "react"
import axios from "axios"
import Swal from "sweetalert2"
import "sweetalert2/dist/sweetalert2.min.css"
import { Mail, User, Phone, MessageSquare, Send } from "lucide-react"

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  })

  const [turnstileToken, setTurnstileToken] = useState("")
  const [isTokenUsed, setIsTokenUsed] = useState(false)
  const [isTurnstileLoaded, setIsTurnstileLoaded] = useState(false)
  const [isFormUsed, setIsFormUsed] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const turnstileRef = useRef(null)

  const siteKey = "0x4AAAAAAB5TGhst11CC1wiv"
  const ONE_HOUR_MS = 60 * 60 * 1000
  const API_URL = "https://form.mjeimports.store/api/contact"

  useEffect(() => {
    const lastSent = localStorage.getItem("contactFormUsedAt")
    if (lastSent) {
      const elapsed = Date.now() - Number.parseInt(lastSent, 10)
      if (elapsed < ONE_HOUR_MS) {
        setIsFormUsed(true)
      } else {
        localStorage.removeItem("contactFormUsed")
        localStorage.removeItem("contactFormUsedAt")
      }
    }
  }, [])

  useEffect(() => {
    if (isTurnstileLoaded) return

    const script = document.createElement("script")
    script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js"
    script.async = true
    document.body.appendChild(script)

    script.onload = () => {
      if (window.turnstile && turnstileRef.current) {
        window.turnstile.render(turnstileRef.current, {
          sitekey: siteKey,
          callback: (token) => {
            setTurnstileToken(token)
            setIsTokenUsed(false)
          },
        })
        setIsTurnstileLoaded(true)
      }
    }
  }, [isTurnstileLoaded])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (isSubmitting) return

    if (isFormUsed) {
      Swal.fire({
        icon: "warning",
        title: "Formulario ya enviado",
        text: "Ya enviaste este formulario. Puedes volver a intentarlo dentro de 1 hora.",
        confirmButtonColor: "#2ad37a",
      })
      return
    }

    // Validación rápida (mensaje opcional)
    if (!formData.name || !formData.email || !formData.phone) {
      Swal.fire({
        icon: "warning",
        title: "Campos incompletos",
        text: "Por favor completa los campos obligatorios (nombre, correo y teléfono).",
        confirmButtonColor: "#2ad37a",
      })
      return
    }

    if (!turnstileToken) {
      Swal.fire({
        icon: "warning",
        title: "Verificación requerida",
        text: "Por favor completa la verificación de seguridad (captcha).",
        confirmButtonColor: "#2ad37a",
      })
      return
    }

    if (isTokenUsed) {
      Swal.fire({
        icon: "warning",
        title: "Token ya usado",
        text: "Actualiza la página para volver a intentar el envío.",
        confirmButtonColor: "#2ad37a",
      })
      return
    }

    Swal.fire({
      title: "Enviando tu mensaje...",
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    })
    setIsSubmitting(true)

    const payload = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      subject: formData.subject.trim(),
      message: formData.message?.trim() || "",
      turnstileToken,
    }

    try {
      const { data } = await axios.post(API_URL, payload, {
        headers: { "Content-Type": "application/json" },
        timeout: 20000,
      })

      console.log("✅ Respuesta del servidor:", data)

      if (data?.status === 200 && data?.success) {
        setIsTokenUsed(true)
        setIsFormUsed(true)
        localStorage.setItem("contactFormUsed", "true")
        localStorage.setItem("contactFormUsedAt", Date.now().toString())

        Swal.fire({
          icon: "success",
          title: "Mensaje enviado correctamente",
          text: data?.message || "Gracias por contactarnos. Te responderemos lo antes posible.",
          confirmButtonColor: "#2ad37a",
        })
      } else {
        Swal.fire({
          icon: "warning",
          title: "Respuesta inesperada",
          text: data?.message || "El servidor respondió pero no confirmó el envío.",
          confirmButtonColor: "#002f6c",
        })
      }
    } catch (error) {
      console.error("❌ Error al enviar:", error)

      const status = error?.response?.data?.status || error?.response?.status || 0
      const message = error?.response?.data?.message || "Ocurrió un problema al enviar tu mensaje."
      const errors = error?.response?.data?.errors || []
      const detail = error?.response?.data?.error_detail

      let fullMessage = message

      if (Array.isArray(errors) && errors.length > 0) {
        fullMessage += "\n\nDetalles:\n" + errors.join("\n")
      }

      if (detail && typeof detail === "object") {
        // p.ej. Turnstile error-codes
        if (Array.isArray(detail["error-codes"])) {
          fullMessage += `\n\nCódigos: ${detail["error-codes"].join(", ")}`
        } else {
          fullMessage += `\n\nDetalle técnico: ${JSON.stringify(detail)}`
        }
      } else if (typeof detail === "string") {
        fullMessage += `\n\nDetalle técnico: ${detail}`
      }

      if (status === 400) {
        Swal.fire({
          icon: "warning",
          title: "Error en los datos",
          text: fullMessage,
          confirmButtonColor: "#002f6c",
        })
      } else if (status === 403) {
        // Resetear Turnstile al fallar verificación
        try {
          if (window?.turnstile && turnstileRef.current) {
            window.turnstile.reset(turnstileRef.current)
          }
        } catch (_) {}
        setTurnstileToken("")
        setIsTokenUsed(false)

        Swal.fire({
          icon: "error",
          title: "Verificación fallida",
          text: fullMessage,
          confirmButtonColor: "#002f6c",
        })
      } else if (status === 405) {
        Swal.fire({
          icon: "info",
          title: "Método no permitido",
          text: "Este endpoint solo acepta peticiones POST.",
          confirmButtonColor: "#2ad37a",
        })
      } else if (status === 500) {
        Swal.fire({
          icon: "error",
          title: "Error del servidor",
          text: fullMessage,
          confirmButtonColor: "#002f6c",
        })
      } else {
        Swal.fire({
          icon: "error",
          title: "Error de red",
          text: fullMessage,
          confirmButtonColor: "#002f6c",
        })
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section
      id="contacto"
      style={{
        width: "100%",
        backgroundColor: "#ffffff",
        padding: "100px 20px 80px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "600px",
          backgroundColor: "#ffffff",
          borderRadius: "16px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
          padding: "40px",
          border: "1px solid #e5e7eb",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <h2
            style={{
              fontSize: "36px",
              fontWeight: "700",
              color: "#002f6c",
              marginBottom: "12px",
            }}
          >
            Contáctanos
          </h2>
          <p
            style={{
              fontSize: "16px",
              color: "#6b7280",
              lineHeight: "1.6",
            }}
          >
            Envíanos un mensaje y te responderemos lo antes posible.
          </p>
        </div>

        <form method="POST" onSubmit={handleSubmit}>
          <div style={{ marginBottom: "24px" }}>
            <label
              htmlFor="name"
              style={{
                display: "block",
                fontSize: "14px",
                fontWeight: "600",
                color: "#002f6c",
                marginBottom: "8px",
              }}
            >
              Nombre completo *
            </label>
            <div style={{ position: "relative" }}>
              <User
                style={{
                  position: "absolute",
                  left: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  width: "20px",
                  height: "20px",
                  color: "#9ca3af",
                }}
              />
              <input
                id="name"
                name="name"
                type="text"
                placeholder="Tu nombre"
                value={formData.name}
                onChange={handleChange}
                style={{
                  width: "100%",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  padding: "12px 12px 12px 44px",
                  fontSize: "15px",
                  color: "#1f2937",
                  outline: "none",
                  transition: "all 0.2s",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#2ad37a"
                  e.target.style.boxShadow = "0 0 0 3px rgba(42, 211, 122, 0.15)"
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#e5e7eb"
                  e.target.style.boxShadow = "none"
                }}
              />
            </div>
          </div>

          <div style={{ marginBottom: "24px" }}>
            <label
              htmlFor="email"
              style={{
                display: "block",
                fontSize: "14px",
                fontWeight: "600",
                color: "#002f6c",
                marginBottom: "8px",
              }}
            >
              Correo electrónico *
            </label>
            <div style={{ position: "relative" }}>
              <Mail
                style={{
                  position: "absolute",
                  left: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  width: "20px",
                  height: "20px",
                  color: "#9ca3af",
                }}
              />
              <input
                id="email"
                name="email"
                type="email"
                placeholder="tu@email.com"
                value={formData.email}
                onChange={handleChange}
                style={{
                  width: "100%",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  padding: "12px 12px 12px 44px",
                  fontSize: "15px",
                  color: "#1f2937",
                  outline: "none",
                  transition: "all 0.2s",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#2ad37a"
                  e.target.style.boxShadow = "0 0 0 3px rgba(42, 211, 122, 0.15)"
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#e5e7eb"
                  e.target.style.boxShadow = "none"
                }}
              />
            </div>
          </div>

          <div style={{ marginBottom: "24px" }}>
            <label
              htmlFor="phone"
              style={{
                display: "block",
                fontSize: "14px",
                fontWeight: "600",
                color: "#002f6c",
                marginBottom: "8px",
              }}
            >
              Número de teléfono *
            </label>
            <div style={{ position: "relative" }}>
              <Phone
                style={{
                  position: "absolute",
                  left: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  width: "20px",
                  height: "20px",
                  color: "#9ca3af",
                }}
              />
              <input
                id="phone"
                name="phone"
                type="text"
                placeholder="Ejemplo: 0412-1234567"
                value={formData.phone}
                onChange={handleChange}
                style={{
                  width: "100%",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  padding: "12px 12px 12px 44px",
                  fontSize: "15px",
                  color: "#1f2937",
                  outline: "none",
                  transition: "all 0.2s",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#2ad37a"
                  e.target.style.boxShadow = "0 0 0 3px rgba(42, 211, 122, 0.15)"
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#e5e7eb"
                  e.target.style.boxShadow = "none"
                }}
              />
            </div>
          </div>

          <div style={{ marginBottom: "24px" }}>
            <label
              htmlFor="subject"
              style={{
                display: "block",
                fontSize: "14px",
                fontWeight: "600",
                color: "#002f6c",
                marginBottom: "8px",
              }}
            >
              Producto de interés
            </label>
            <div style={{ position: "relative" }}>
              <MessageSquare
                style={{
                  position: "absolute",
                  left: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  width: "20px",
                  height: "20px",
                  color: "#9ca3af",
                }}
              />
              <input
                id="subject"
                name="subject"
                type="text"
                placeholder="Descripción del producto"
                value={formData.subject}
                onChange={handleChange}
                style={{
                  width: "100%",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  padding: "12px 12px 12px 44px",
                  fontSize: "15px",
                  color: "#1f2937",
                  outline: "none",
                  transition: "all 0.2s",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#2ad37a"
                  e.target.style.boxShadow = "0 0 0 3px rgba(42, 211, 122, 0.15)"
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#e5e7eb"
                  e.target.style.boxShadow = "none"
                }}
              />
            </div>
          </div>

          <div style={{ marginBottom: "24px" }}>
            <label
              htmlFor="message"
              style={{
                display: "block",
                fontSize: "14px",
                fontWeight: "600",
                color: "#002f6c",
                marginBottom: "8px",
              }}
            >
              Mensaje (opcional)
            </label>
            <textarea
              id="message"
              name="message"
              rows={5}
              placeholder="Escribe tu mensaje aquí..."
              value={formData.message}
              onChange={handleChange}
              style={{
                width: "100%",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                padding: "12px",
                fontSize: "15px",
                color: "#1f2937",
                outline: "none",
                transition: "all 0.2s",
                resize: "vertical",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "#2ad37a"
                e.target.style.boxShadow = "0 0 0 3px rgba(42, 211, 122, 0.15)"
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#e5e7eb"
                e.target.style.boxShadow = "none"
              }}
            />
          </div>

          <div style={{ marginBottom: "24px", display: "flex", justifyContent: "center" }} ref={turnstileRef}></div>

          <button
            type="submit"
            disabled={isFormUsed || isSubmitting}
            style={{
              width: "100%",
              backgroundColor: isFormUsed ? "#9ca3af" : "#002f6c",
              color: "#ffffff",
              padding: "14px 24px",
              borderRadius: "8px",
              fontSize: "16px",
              fontWeight: "600",
              border: "none",
              cursor: isFormUsed ? "not-allowed" : "pointer",
              transition: "all 0.2s",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              opacity: isSubmitting ? 0.85 : 1,
            }}
            onMouseEnter={(e) => {
              if (!isFormUsed) {
                e.currentTarget.style.backgroundColor = "#2ad37a"
                e.currentTarget.style.color = "#002f6c"
                e.currentTarget.style.transform = "translateY(-1px)"
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(42, 211, 122, 0.3)"
              }
            }}
            onMouseLeave={(e) => {
              if (!isFormUsed) {
                e.currentTarget.style.backgroundColor = "#002f6c"
                e.currentTarget.style.color = "#ffffff"
                e.currentTarget.style.transform = "translateY(0)"
                e.currentTarget.style.boxShadow = "none"
              }
            }}
          >
            {isFormUsed ? "Mensaje enviado ✅" : (
              <>
                <Send style={{ width: "18px", height: "18px" }} />
                {isSubmitting ? "Enviando..." : "Enviar mensaje"}
              </>
            )}
          </button>
        </form>
      </div>
    </section>
  )
}
