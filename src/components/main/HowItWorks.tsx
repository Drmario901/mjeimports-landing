"use client"

import { useEffect, useRef, useState } from "react"
import { Send, Calculator, ShoppingCart, Package } from "lucide-react"

export default function HowItWorks() {
  const [visibleSteps, setVisibleSteps] = useState<boolean[]>([false, false, false, false])
  const stepRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const observers = stepRefs.current.map((ref, index) => {
      if (!ref) return null

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setVisibleSteps((prev) => {
                const newState = [...prev]
                newState[index] = true
                return newState
              })
            }
          })
        },
        { threshold: 0.2 },
      )

      observer.observe(ref)
      return observer
    })

    return () => {
      observers.forEach((observer, index) => {
        if (observer && stepRefs.current[index]) {
          observer.unobserve(stepRefs.current[index]!)
        }
      })
    }
  }, [])

  const steps = [
    {
      number: "1",
      title: "Envíanos lo que te gusta",
      description: "Mándanos una foto, enlace o descripción del producto que deseas traer.",
      icon: Send,
    },
    {
      number: "2",
      title: "Te cotizamos al instante",
      description: "Te explicamos el precio, proceso y tipo de envío más conveniente.",
      icon: Calculator,
    },
    {
      number: "3",
      title: "Hacemos tu compra",
      description: "Nos encargamos de adquirir el producto y traerlo hasta Venezuela.",
      icon: ShoppingCart,
    },
    {
      number: "4",
      title: "Lo recibes con confianza",
      description: "Te avisamos apenas llega y coordinamos la entrega rápidamente.",
      icon: Package,
    },
  ]

  return (
    <section
      id="como-funciona"
      className="min-h-screen flex flex-col items-center justify-center pt-32 pb-20 px-5 bg-gradient-to-br from-[#002f6c] via-[#004a8f] to-[#2ad37a]"
    >
      <div className="max-w-6xl w-full">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4 leading-tight text-balance">
            Así Funciona{" "}
            <span className="text-[#2ad37a] drop-shadow-lg">MJE Imports</span>
          </h2>
          <p className="text-lg text-white/80 max-w-xl mx-auto">
            Un proceso simple y transparente para que recibas tus productos sin complicaciones.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => {
            const Icon = step.icon
            return (
              <div
                key={index}
                ref={(el) => { stepRefs.current[index] = el }}
                className={`card bg-base-100 shadow-xl border border-base-200 relative pt-8 transition-all duration-500 ${
                  visibleSteps[index]
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                }`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <div className="badge badge-lg badge-success text-white font-bold absolute -top-4 left-1/2 -translate-x-1/2 shadow-lg">
                  {step.number}
                </div>

                <div className="card-body items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-[#002f6c]/10 flex items-center justify-center mb-4">
                    <Icon size={32} className="text-[#002f6c]" strokeWidth={2.2} />
                  </div>

                  <h3 className="card-title text-[#002f6c] text-lg">
                    {step.title}
                  </h3>

                  <p className="text-base-content/70 text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}