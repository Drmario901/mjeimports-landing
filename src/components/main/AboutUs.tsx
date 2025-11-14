import { useEffect, useRef, useState } from "react"
import { ShoppingBag, Plane, ShieldCheck } from "lucide-react"

export default function AboutUs() {
  const [isVisible, setIsVisible] = useState({
    header: false,
    content: false,
    cards: false,
    slogan: false,
  })

  const refs = {
    header: useRef<HTMLDivElement>(null),
    content: useRef<HTMLDivElement>(null),
    cards: useRef<HTMLDivElement>(null),
    slogan: useRef<HTMLDivElement>(null),
  }

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = Object.entries(refs).find(([_, ref]) => ref.current === entry.target)?.[0]
            if (id) setIsVisible((prev) => ({ ...prev, [id]: true }))
          }
        })
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" },
    )

    Object.values(refs).forEach((ref) => ref.current && observer.observe(ref.current))
    return () => observer.disconnect()
  }, [])

  return (
    <section
      id="quienes-somos"
      className="min-h-screen flex items-center justify-center py-24 px-6"
      style={{ backgroundColor: "#002f6c10" }}
    >
      <div className="max-w-5xl w-full mx-auto text-center">

        <div
          ref={refs.header}
          className={`mt-20 transition-all duration-700 ${
            isVisible.header ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <h2
            className="text-5xl md:text-6xl font-extrabold mb-4 tracking-tight"
            style={{ color: "#002f6c" }}
          >
            ¿Quiénes Somos?
          </h2>
          <p className="text-lg font-semibold" style={{ color: "#2ad37a" }}>
            📍 Maracay, Venezuela 
          </p>
        </div>

        <div
          ref={refs.content}
          className={`mt-10 transition-all duration-700 delay-200 ${
            isVisible.content ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <p className="text-lg text-gray-700 leading-relaxed max-w-3xl mx-auto">
            Somos una <strong>empresa venezolana</strong> dedicada a conectar tus compras en Estados Unidos con Venezuela.
            Ofrecemos un servicio confiable y transparente, encargándonos de todo el proceso con envíos aéreos y marítimos para que importar sea fácil, rápido y seguro.
          </p>
        </div>

        <div
          ref={refs.cards}
          className={`grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 justify-center transition-all duration-700 delay-400 ${
            isVisible.cards ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >

          <div className="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-2 transition-all duration-300 text-center">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ backgroundColor: "#002f6c15" }}
            >
              <ShoppingBag size={34} style={{ color: "#002f6c" }} />
            </div>
            <h3 className="text-xl font-semibold mb-2" style={{ color: "#002f6c" }}>
              Compras Internacionales
            </h3>
            <p className="text-gray-600 text-sm">
              Traemos tus productos favoritos de EE. UU. con atención personalizada y total transparencia.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-2 transition-all duration-300 text-center">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ backgroundColor: "#002f6c15" }}
            >
              <Plane size={34} style={{ color: "#002f6c" }} />
            </div>
            <h3 className="text-xl font-semibold mb-2" style={{ color: "#002f6c" }}>
              Envíos Seguros
            </h3>
            <p className="text-gray-600 text-sm">
              Ofrecemos envíos aéreos y marítimos adaptados a tus tiempos, con seguimiento en todo momento.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-2 transition-all duration-300 text-center">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ backgroundColor: "#002f6c15" }}
            >
              <ShieldCheck size={34} style={{ color: "#002f6c" }} />
            </div>
            <h3 className="text-xl font-semibold mb-2" style={{ color: "#002f6c" }}>
              Confianza Garantizada
            </h3>
            <p className="text-gray-600 text-sm">
              Nuestro compromiso es tu tranquilidad. Cumplimos cada entrega con seguridad y responsabilidad.
            </p>
          </div>
        </div>

        <div
          ref={refs.slogan}
          className={`mt-20 transition-all duration-700 delay-600 ${
            isVisible.slogan ? "opacity-100 scale-100" : "opacity-0 scale-95"
          }`}
        >
          <div
            className="text-center py-8 px-4 rounded-2xl shadow-lg border-t-4 md:py-10"
            style={{ backgroundColor: "#002f6c", borderColor: "#2ad37a" }}
          >
            <p className="text-xl sm:text-2xl md:text-3xl font-bold text-white leading-tight">
              Tu compra en Estados Unidos,<br className="sm:hidden" />
              más fácil que nunca.
            </p>

            <div
              className="mx-auto mt-4 w-16 sm:w-20 h-1 rounded-full"
              style={{ backgroundColor: "#2ad37a" }}
            ></div>
          </div>
        </div>

      </div>
    </section>
  )
}
