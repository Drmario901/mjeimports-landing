import type React from "react"
import { useEffect, useRef, useState } from "react"
import { Check, Shield, Zap, MapPin } from "lucide-react"

const ShippingSection: React.FC = () => {
  const [visibleElements, setVisibleElements] = useState<Set<string>>(new Set())
  const observerRef = useRef<IntersectionObserver | null>(null)

  const scrollerRef = useRef<HTMLDivElement | null>(null)
  const animationRef = useRef<number>()
  const positionRef = useRef(0)

  useEffect(() => {
    const speed = 0.90

    const animate = () => {
      if (scrollerRef.current) {
        positionRef.current -= speed
        scrollerRef.current.style.transform = `translateX(${positionRef.current}px)`

        if (Math.abs(positionRef.current) >= scrollerRef.current.scrollWidth / 2) {
          positionRef.current = 0
        }
      }
      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationRef.current!)
  }, [])

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleElements((prev) => new Set(prev).add(entry.target.id))
          }
        })
      },
      { threshold: 0.15 },
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

  return (
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
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(90deg, rgba(0,74,138,0.05) 1px, transparent 1px), linear-gradient(rgba(0,74,138,0.05) 1px, transparent 1px)",
          backgroundSize: "100px 100px",
          pointerEvents: "none",
        }}
      />

      <div style={{ maxWidth: "1200px", margin: "0 auto", position: "relative", zIndex: 1 }}>

        <div
          id="payment-methods"
          className="observe"
          style={{
            marginBottom: "4rem",
            opacity: visibleElements.has("payment-methods") ? 1 : 0,
            transform: visibleElements.has("payment-methods") ? "translateY(0)" : "translateY(30px)",
            transition: "opacity 0.7s ease, transform 0.7s ease",
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
              <div key={method} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <Check style={{ width: 20, height: 20, color: "#004a8a" }} />
                <span style={{ fontSize: "1.2rem", color: "#1f2937" }}>{method}</span>
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
            transition: "opacity 0.7s ease 0.2s, transform 0.7s ease 0.2s",
          }}
        >
          <h1
            style={{
              fontSize: "clamp(2.5rem, 8vw, 5rem)",
              fontWeight: 700,
              color: "#004a8a",
              marginBottom: "1.5rem",
            }}
          >
            Compra en USA,<br />Recibe en Venezuela
          </h1>
          <p style={{ fontSize: "1.25rem", color: "#6b7280", maxWidth: "600px", lineHeight: 1.6 }}>
            La forma más confiable y rápida de recibir tus compras internacionales
          </p>
        </div>

        <div
          id="store-logos"
          className="observe"
          style={{
            marginBottom: "2.5rem",
            opacity: visibleElements.has("store-logos") ? 1 : 0,
            transform: visibleElements.has("store-logos") ? "translateY(0)" : "translateY(30px)",
            transition: "opacity 0.7s ease 0.4s, transform 0.7s ease 0.4s",
          }}
        >
          <p
            style={{
              fontSize: "1.45rem",
              textTransform: "uppercase",
              textAlign: "center",
              color: "#004a8a",
              marginBottom: "2rem",
            }}
          >
            Compra en tus tiendas favoritas
          </p>

          <div style={{ overflow: "hidden", width: "100%" }}>
            <div
              ref={scrollerRef}
              style={{
                display: "flex",
                whiteSpace: "nowrap",
                userSelect: "none",
              }}
            >
              {[...stores, ...stores].map((store, index) => (
                <div
                  key={store.name + index}
                  style={{
                    flex: "0 0 auto",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "0 1rem",
                    minWidth: "80px",
                  }}
                >
                  <img
                    src={store.logo}
                    alt={store.name}
                    style={{ height: "45px", objectFit: "contain" }}
                  />
                </div>
              ))}
            </div>
          </div>

          <div
            style={{
              marginTop: "1.8rem",
              textAlign: "center",
              fontSize: "1.55rem",
              fontWeight: 600,
              color: "#004a8a",
              opacity: 0.85,
            }}
          >
            y muchas tiendas más...
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
                  borderRadius: "16px",
                  padding: "2.5rem",

                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? "translateY(0)" : "translateY(30px)",
                  transition: `opacity 0.8s ease ${delay}s, transform 0.8s ease ${delay}s`,

                  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                  border: "1px solid #e5e7eb",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transition = "box-shadow 0.2s ease, transform 0.2s ease, border-color 0.2s ease"
                  e.currentTarget.style.boxShadow = "0 12px 22px rgba(0,47,108,0.25)"
                  e.currentTarget.style.transform = "translateY(-6px)"
                  e.currentTarget.style.borderColor = "#002f6c"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transition = "box-shadow 0.2s ease, transform 0.2s ease, border-color 0.2s ease"
                  e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.08)"
                  e.currentTarget.style.transform = "translateY(0)"
                  e.currentTarget.style.borderColor = "#e5e7eb"
                }}
              >
                <div
                  style={{
                    width: "64px",
                    height: "64px",
                    borderRadius: "14px",
                    backgroundColor: "#002f6c15",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "1.5rem",
                  }}
                >
                  <Icon size={34} style={{ color: "#002f6c" }} />
                </div>

                <h3
                  style={{
                    fontSize: "1.5rem",
                    fontWeight: 700,
                    marginBottom: "1rem",
                    color: "#002f6c",
                  }}
                >
                  {feature.title}
                </h3>

                <p style={{ fontSize: "1rem", color: "#4b5563", lineHeight: 1.6 }}>
                  {feature.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default ShippingSection