"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"
import { Check, Shield, Zap, MapPin } from "lucide-react"

const ShippingSection: React.FC = () => {
  const [visibleElements, setVisibleElements] = useState<Set<string>>(new Set())
  const observerRef = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleElements((prev) => new Set(prev).add(entry.target.id))
          }
        })
      },
      { threshold: 0.1 },
    )

    const elements = document.querySelectorAll(".observe")
    elements.forEach((el) => observerRef.current?.observe(el))
    return () => observerRef.current?.disconnect()
  }, [])

  const paymentMethods = ["Zelle", "Pago Móvil", "Efectivo", "Binance"]

  const stores = [
    { name: "Amazon", logo: "/stores/amazon.png" },
    { name: "Adidas", logo: "/stores/adidas.png" },
    { name: "Apple", logo: "/stores/apple.png" },
    { name: "Nike", logo: "/stores/nike.png" },
    { name: "Ebay", logo: "/stores/ebay.png" },
    { name: "Shein", logo: "/stores/shein.png" },
    { name: "Vans", logo: "/stores/vans.png" },
    { name: "Walmart", logo: "/stores/walmart.png" },
  ]

  const features = [
    {
      icon: Shield,
      title: "Seguridad Garantizada",
      description: "Tus paquetes están protegidos con seguro completo durante todo el trayecto.",
    },
    {
      icon: Zap,
      title: "Envío Rápido",
      description: "Recibe tus productos en tiempo récord con nuestro servicio express.",
    },
    {
      icon: MapPin,
      title: "Cobertura Nacional",
      description: "Entregamos en todo el territorio venezolano sin importar tu ubicación.",
    },
  ]

  const scrollAnimation = `
    @keyframes scroll {
      0% { transform: translateX(0); }
      100% { transform: translateX(-100%); }
    }
  `

  return (
    <>
      <style>{scrollAnimation}</style>

      <section
        id="servicios"
        className="observe"
        style={{
          background: "#ffffff",
          color: "#1f2937",
          position: "relative",
          overflow: "hidden",
          padding: "5rem 2rem 6rem", 
          minHeight: "calc(100vh - 60px)",
          scrollMarginTop: "80px", 
        }}
      >
        <div
          style={{
            content: '""',
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(90deg, rgba(0,74,138,0.05) 1px, transparent 1px), linear-gradient(rgba(0,74,138,0.05) 1px, transparent 1px)",
            backgroundSize: "100px 100px",
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            position: "relative",
            zIndex: 1,
          }}
        >

          <div
            id="payment-methods"
            className="observe"
            style={{
              marginBottom: "4rem",
              opacity: visibleElements.has("payment-methods") ? 1 : 0,
              transform: visibleElements.has("payment-methods") ? "translateY(0)" : "translateY(30px)",
              transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            <h3
              style={{
                fontSize: "2rem",
                fontWeight: 500,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                color: "#004a8a",
                marginBottom: "1.5rem",
              }}
            >
              Métodos de Pago
            </h3>

            <div style={{ display: "flex", flexWrap: "wrap", gap: "1.5rem" }}>
              {paymentMethods.map((method) => (
                <div
                  key={method}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    fontSize: "1.2rem",
                    color: "#1f2937",
                  }}
                >
                  <Check style={{ width: 20, height: 20, color: "#004a8a" }} />
                  <span>{method}</span>
                </div>
              ))}
            </div>
          </div>

          <div
            id="main-heading"
            className="observe"
            style={{
              marginBottom: "5rem",
              opacity: visibleElements.has("main-heading") ? 1 : 0,
              transform: visibleElements.has("main-heading") ? "translateY(0)" : "translateY(30px)",
              transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.2s",
            }}
          >
            <h1
              style={{
                fontSize: "clamp(2.5rem, 8vw, 5rem)",
                fontWeight: 700,
                lineHeight: 1.1,
                marginBottom: "1.5rem",
                color: "#004a8a",
              }}
            >
              Compra en USA,
              <br />
              Recibe en Venezuela
            </h1>
            <p
              style={{
                fontSize: "clamp(1rem, 2vw, 1.25rem)",
                color: "#6b7280",
                maxWidth: "600px",
                lineHeight: 1.6,
              }}
            >
              La forma más confiable y rápida de recibir tus compras internacionales
            </p>
          </div>

          <div
            id="store-logos"
            className="observe"
            style={{
              marginBottom: "5rem",
              opacity: visibleElements.has("store-logos") ? 1 : 0,
              transform: visibleElements.has("store-logos") ? "translateY(0)" : "translateY(30px)",
              transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.4s",
            }}
          >
            <p
              style={{
                fontSize: "1.45rem",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                color: "#004a8a",
                marginBottom: "2rem",
                textAlign: "center",
              }}
            >
              Compra en tus tiendas favoritas
            </p>

            <div
              style={{
                overflow: "hidden",
                position: "relative",
                width: "100%",
                padding: "2rem 0",
              }}
            >
              <div
                style={{
                  display: "flex",
                  animation: "scroll 25s linear infinite",
                  width: "200%",
                }}
              >
                {[...stores, ...stores].map((store, index) => (
                  <div
                    key={`${store.name}-${index}`}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "0 3rem",
                      opacity: 0.7,
                      transition: "opacity 0.3s ease",
                      flexShrink: 0,
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
                    onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.7")}
                  >
                    <img
                      src={store.logo}
                      alt={store.name}
                      style={{ height: 50, width: "auto", objectFit: "contain" }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "2rem",
              marginTop: "4rem",
            }}
          >
            {features.map((feature, index) => {
              const Icon = feature.icon
              const isVisible = visibleElements.has(`feature-${index}`)
              const delay = 0.6 + index * 0.1

              return (
                <div
                  key={feature.title}
                  id={`feature-${index}`}
                  className="observe"
                  style={{
                    background: "#ffffff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "12px",
                    padding: "2.5rem",
                    opacity: isVisible ? 1 : 0,
                    transform: isVisible ? "translateY(0)" : "translateY(30px)",
                    transition: `all 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s`,
                    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "#004a8a"
                    e.currentTarget.style.boxShadow = "0 10px 20px rgba(0,74,138,0.2)"
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "#e5e7eb"
                    e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.1)"
                  }}
                >
                  <div
                    style={{
                      width: "64px",
                      height: "64px",
                      background: "#e6f0f9",
                      borderRadius: "12px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: "1.5rem",
                    }}
                  >
                    <Icon size={32} color="#004a8a" />
                  </div>
                  <h3
                    style={{
                      fontSize: "1.5rem",
                      fontWeight: 600,
                      marginBottom: "1rem",
                      color: "#004a8a",
                    }}
                  >
                    {feature.title}
                  </h3>
                  <p style={{ fontSize: "1rem", color: "#6b7280", lineHeight: 1.6 }}>
                    {feature.description}
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

export default ShippingSection
