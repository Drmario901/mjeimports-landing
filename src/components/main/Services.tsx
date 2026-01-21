"use client"

import type React from "react"
import { useEffect, useRef, useState, useCallback } from "react"
import { Check, Shield, Zap, MapPin } from "lucide-react"
import useEmblaCarousel from "embla-carousel-react"
import AutoScroll from "embla-carousel-auto-scroll"

const ShippingSection: React.FC = () => {
  const [visibleElements, setVisibleElements] = useState<Set<string>>(new Set())
  const observerRef = useRef<IntersectionObserver | null>(null)

  const [emblaRef] = useEmblaCarousel(
    {
      align: "start",
      loop: true,
      dragFree: true,
    },
    [
      AutoScroll({
        speed: 1,
        stopOnInteraction: false,
        stopOnMouseEnter: false,
      }),
    ]
  )

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleElements((prev) => new Set(prev).add(entry.target.id))
          }
        })
      },
      { threshold: 0.15 }
    )

    const elements = document.querySelectorAll(".observe")
    elements.forEach((el) => observerRef.current?.observe(el))
    return () => observerRef.current?.disconnect()
  }, [])

  const paymentMethods = ["Zelle", "Pago Móvil", "Efectivo", "Binance"]
  const stores = [
    { name: "Amazon", logo: "/stores/amazon.webp" },
    { name: "Adidas", logo: "/stores/adidas.webp" },
    { name: "Apple", logo: "/stores/apple.webp" },
    { name: "Nike", logo: "/stores/nike.webp" },
    { name: "Ebay", logo: "/stores/ebay.webp" },
    { name: "Shein", logo: "/stores/shein.webp" },
    { name: "Vans", logo: "/stores/vans.webp" },
    { name: "Walmart", logo: "/stores/walmart.webp" },
  ]

  const features = [
    {
      icon: Shield,
      title: "Seguridad Garantizada",
      description:
        "Tus paquetes están protegidos con seguro completo durante todo el trayecto.",
    },
    {
      icon: Zap,
      title: "Envío Rápido",
      description:
        "Recibe tus productos en tiempo récord con nuestro servicio express.",
    },
    {
      icon: MapPin,
      title: "Cobertura Nacional",
      description:
        "Entregamos en todo el territorio venezolano sin importar tu ubicación.",
    },
  ]

  const duplicatedStores = [...stores, ...stores, ...stores]

  return (
    <section
      id="servicios"
      className="observe relative overflow-hidden text-gray-800 px-8 pt-28 pb-20 min-h-[calc(100vh-60px)]"
      style={{
        background: "linear-gradient(135deg, rgba(42, 211, 122, 0.18) 0%, rgba(255, 255, 255, 0.95) 50%, rgba(12, 57, 115, 0.22) 100%)",
      }}
    >

      <div className="max-w-[1200px] mx-auto relative z-10">
        <div
          id="payment-methods"
          className={`observe mb-16 transition-all duration-700 ${
            visibleElements.has("payment-methods")
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-8"
          }`}
        >
          <h3 className="text-2xl font-medium uppercase tracking-widest text-[#004a8a] mb-6">
            Métodos de Pago
          </h3>

          <div className="flex flex-wrap gap-6">
            {paymentMethods.map((method) => (
              <div key={method} className="flex items-center gap-2">
                <Check className="w-5 h-5 text-[#004a8a]" />
                <span className="text-xl text-gray-800">{method}</span>
              </div>
            ))}
          </div>
        </div>

        <div
          id="main-heading"
          className={`observe mb-20 transition-all duration-700 delay-200 ${
            visibleElements.has("main-heading")
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-8"
          }`}
        >
          <h1 className="text-[clamp(2.5rem,8vw,5rem)] font-bold text-[#004a8a] mb-6">
            Compra en USA,
            <br />
            Recibe en Venezuela
          </h1>
          <p className="text-xl text-gray-500 max-w-[600px] leading-relaxed">
            La forma más confiable y rápida de recibir tus compras
            internacionales
          </p>
        </div>

        <div
          id="store-logos"
          className={`observe mb-10 transition-all duration-700 delay-[400ms] ${
            visibleElements.has("store-logos")
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-8"
          }`}
        >
          <p className="text-[1.45rem] uppercase text-center text-[#004a8a] mb-8">
            Compra en tus tiendas favoritas
          </p>

          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex gap-8 md:gap-12">
              {duplicatedStores.map((store, index) => (
                <div
                  key={`${store.name}-${index}`}
                  className="flex-shrink-0"
                >
                  <img
                    src={store.logo || "/placeholder.svg"}
                    alt={store.name}
                    className="h-10 md:h-12 w-auto object-contain"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="mt-7 text-center text-2xl font-semibold text-[#004a8a] opacity-85">
            y muchas tiendas más...
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
          {features.map((feature, index) => {
            const Icon = feature.icon
            const isVisible = visibleElements.has(`feature-${index}`)

            return (
              <div
                key={feature.title}
                id={`feature-${index}`}
                className={`observe bg-white rounded-2xl p-10 shadow-sm border border-gray-200 transition-all duration-800 hover:shadow-[0_12px_22px_rgba(0,47,108,0.25)] hover:-translate-y-1.5 hover:border-[#002f6c] ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                }`}
                style={{
                  transitionDelay: isVisible ? `${600 + index * 100}ms` : "0ms",
                }}
              >
                <div className="w-16 h-16 rounded-[14px] bg-[#002f6c]/10 flex items-center justify-center mb-6">
                  <Icon size={34} className="text-[#002f6c]" />
                </div>

                <h3 className="text-2xl font-bold mb-4 text-[#002f6c]">
                  {feature.title}
                </h3>

                <p className="text-base text-gray-600 leading-relaxed">
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