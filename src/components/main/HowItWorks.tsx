"use client"

import { useEffect, useRef, useState } from "react"
import { Send, Calculator, ShoppingCart, Package } from "lucide-react"

interface HowItWorksProps {
  phoneNumber?: string
}

export default function HowItWorks({ phoneNumber = "1234567890" }: HowItWorksProps) {
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
    <>
      <style>{`
        .steps-grid {
          display: grid;
          gap: 24px;
          grid-template-columns: repeat(4, 1fr);
        }

        @media (max-width: 1024px) {
          .steps-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 640px) {
          .steps-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <section
        id="como-funciona"
        style={{
          padding: "120px 20px 80px", 
          backgroundColor: "#002f6c08",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ maxWidth: "1200px", width: "100%" }}>

          <div style={{ textAlign: "center", marginBottom: "60px" }}>
            <h2
              style={{
                fontSize: "48px",
                fontWeight: "800",
                color: "#002f6c",
                marginBottom: "16px",
                lineHeight: "1.2",
              }}
            >
              🚀 Así Funciona{" "}
              <span style={{ color: "#2ad37a" }}>
                MJE Imports
              </span>
            </h2>
            <p
              style={{
                fontSize: "18px",
                color: "#4b5563",
                maxWidth: "600px",
                margin: "0 auto",
              }}
            >
              Un proceso simple y transparente para que recibas tus productos sin complicaciones.
            </p>
          </div>

          <div className="steps-grid">
            {steps.map((step, index) => {
              const Icon = step.icon
              return (
                <div
                  key={index}
                  ref={(el) => (stepRefs.current[index] = el)}
                  style={{
                    opacity: visibleSteps[index] ? 1 : 0,
                    transform: visibleSteps[index] ? "translateY(0)" : "translateY(30px)",
                    transition: `all 0.6s ease ${index * 0.15}s`,
                    padding: "32px 24px",
                    backgroundColor: "#ffffff",
                    borderRadius: "20px",
                    border: "1px solid #e5e7eb",
                    textAlign: "center",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                  }}
                >

                  <div
                    style={{
                      position: "absolute",
                      top: "-20px",
                      left: "50%",
                      transform: "translateX(-50%)",
                      width: "42px",
                      height: "42px",
                      borderRadius: "50%",
                      backgroundColor: "#2ad37a",
                      color: "#fff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "18px",
                      fontWeight: "700",
                      boxShadow: "0 4px 10px rgba(42, 211, 122, 0.3)",
                    }}
                  >
                    {step.number}
                  </div>

                  <div
                    style={{
                      width: "75px",
                      height: "75px",
                      margin: "20px auto 20px",
                      backgroundColor: "#002f6c15",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Icon size={38} color="#002f6c" strokeWidth={2.2} />
                  </div>

                  <h3
                    style={{
                      fontSize: "20px",
                      fontWeight: "600",
                      color: "#002f6c",
                      marginBottom: "10px",
                    }}
                  >
                    {step.title}
                  </h3>

        
                  <p
                    style={{
                      fontSize: "15px",
                      color: "#6b7280",
                      lineHeight: "1.6",
                    }}
                  >
                    {step.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>
    </>
  )
}
