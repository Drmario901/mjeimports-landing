"use client"

import React from "react"

import { useEffect, useRef, useState } from "react"
import axios from "axios"
import Swal from "sweetalert2"
import "sweetalert2/dist/sweetalert2.min.css"
import { Mail, User, Phone, MessageSquare, Send } from "lucide-react"

interface ContactFormProps {
  desktopBackground?: string;
  mobileBackground?: string;
}

const desktopBackground = "/avion-desk.webp"
const mobileBackground = "/avion-res.webp"

declare global {
  interface Window {
    turnstile?: {
      render: (element: HTMLElement, options: { sitekey: string; callback: (token: string) => void }) => void
      reset: (element: HTMLElement) => void
    }
  }
}

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

  const turnstileRef = useRef<HTMLDivElement>(null)

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
          callback: (token: string) => {
            setTurnstileToken(token)
            setIsTokenUsed(false)
          },
        })
        setIsTurnstileLoaded(true)
      }
    }
  }, [isTurnstileLoaded])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
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
      if (axios.isAxiosError(error)) {
        const status = error?.response?.data?.status || error?.response?.status || 0
        const message = error?.response?.data?.message || "Ocurrió un problema al enviar tu mensaje."
        const errors = error?.response?.data?.errors || []
        const detail = error?.response?.data?.error_detail

        let fullMessage = message

        if (Array.isArray(errors) && errors.length > 0) {
          fullMessage += "\n\nDetalles:\n" + errors.join("\n")
        }

        if (detail && typeof detail === "object") {
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
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section
      id="contacto"
      className="w-full py-16 md:py-24 px-5 flex justify-center items-center relative overflow-hidden"
    >
      <div
        className="absolute inset-0 md:hidden bg-cover bg-center"
        style={{ backgroundImage: `url(${mobileBackground})` }}
      />
      <div
        className="absolute inset-0 hidden md:block bg-cover bg-center"
        style={{ backgroundImage: `url(${desktopBackground})` }}
      />
      <div className="absolute inset-0 bg-white/80" />

      <div className="w-full max-w-[600px] bg-white rounded-2xl shadow-lg p-8 md:p-10 border border-gray-200 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#002f6c] mb-3">
            Contáctanos
          </h2>
          <p className="text-base text-gray-500 leading-relaxed">
            Envíanos un mensaje y te responderemos lo antes posible.
          </p>
        </div>

        <form method="POST" onSubmit={handleSubmit}>
          <div className="mb-6">
            <label
              htmlFor="name"
              className="block text-sm font-semibold text-[#002f6c] mb-2"
            >
              Nombre completo *
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                id="name"
                name="name"
                type="text"
                placeholder="Tu nombre"
                value={formData.name}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-lg py-3 pl-11 pr-3 text-[15px] text-gray-800 outline-none transition-all duration-200 focus:border-[#2ad37a] focus:ring-[3px] focus:ring-[#2ad37a]/15"
              />
            </div>
          </div>

          <div className="mb-6">
            <label
              htmlFor="email"
              className="block text-sm font-semibold text-[#002f6c] mb-2"
            >
              Correo electrónico *
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                id="email"
                name="email"
                type="email"
                placeholder="tu@email.com"
                value={formData.email}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-lg py-3 pl-11 pr-3 text-[15px] text-gray-800 outline-none transition-all duration-200 focus:border-[#2ad37a] focus:ring-[3px] focus:ring-[#2ad37a]/15"
              />
            </div>
          </div>

          <div className="mb-6">
            <label
              htmlFor="phone"
              className="block text-sm font-semibold text-[#002f6c] mb-2"
            >
              Número de teléfono *
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                id="phone"
                name="phone"
                type="text"
                placeholder="Ejemplo: 0412-1234567"
                value={formData.phone}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-lg py-3 pl-11 pr-3 text-[15px] text-gray-800 outline-none transition-all duration-200 focus:border-[#2ad37a] focus:ring-[3px] focus:ring-[#2ad37a]/15"
              />
            </div>
          </div>

          <div className="mb-6">
            <label
              htmlFor="subject"
              className="block text-sm font-semibold text-[#002f6c] mb-2"
            >
              Producto de interés
            </label>
            <div className="relative">
              <MessageSquare className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                id="subject"
                name="subject"
                type="text"
                placeholder="Descripción del producto"
                value={formData.subject}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-lg py-3 pl-11 pr-3 text-[15px] text-gray-800 outline-none transition-all duration-200 focus:border-[#2ad37a] focus:ring-[3px] focus:ring-[#2ad37a]/15"
              />
            </div>
          </div>

          <div className="mb-6">
            <label
              htmlFor="message"
              className="block text-sm font-semibold text-[#002f6c] mb-2"
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
              className="w-full border border-gray-200 rounded-lg p-3 text-[15px] text-gray-800 outline-none transition-all duration-200 resize-y focus:border-[#2ad37a] focus:ring-[3px] focus:ring-[#2ad37a]/15"
            />
          </div>

          <div className="mb-6 flex justify-center" ref={turnstileRef} />

          <button
            type="submit"
            disabled={isFormUsed || isSubmitting}
            className={`w-full py-3.5 px-6 rounded-lg text-base font-semibold border-none flex items-center justify-center gap-2 transition-all duration-200 ${
              isFormUsed
                ? "bg-gray-400 text-white cursor-not-allowed"
                : "bg-[#002f6c] text-white cursor-pointer hover:bg-[#2ad37a] hover:text-[#002f6c] hover:-translate-y-0.5 hover:shadow-lg"
            } ${isSubmitting ? "opacity-85" : ""}`}
          >
            {isFormUsed ? (
              "Mensaje enviado"
            ) : (
              <>
                <Send className="w-[18px] h-[18px]" />
                {isSubmitting ? "Enviando..." : "Enviar mensaje"}
              </>
            )}
          </button>
        </form>
      </div>
    </section>
  )
}