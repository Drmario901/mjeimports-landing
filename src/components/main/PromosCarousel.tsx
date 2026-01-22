"use client"

import React, { useEffect, useMemo, useState } from "react"
import Modal from "react-modal"
import { X, ChevronLeft, ChevronRight, Sparkles } from "lucide-react"
import useEmblaCarousel from "embla-carousel-react"
import Autoplay from "embla-carousel-autoplay"

type PromoSlide = {
  id: string
  backgroundSrc: string

  badge?: string
  title: string
  subtitle?: string
  description?: string

  ctaText?: string
  ctaHref?: string

  overlayOpacity?: number
}

type PromotionsModalProps = {
  active?: boolean
  monthLabel?: string
  slides: PromoSlide[]
  storageKey?: string
  showDelayMs?: number
  minIntervalDays?: number
}

const MS_DAY = 86400000

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n))
}

export default function PromotionsModal({
  active = true,
  monthLabel = "Ofertas Especiales",
  slides,
  storageKey = "promotions_modal_last_shown",
  showDelayMs = 1000,
  minIntervalDays = 2,
}: PromotionsModalProps) {
  const [mounted, setMounted] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [closing, setClosing] = useState(false)

  useEffect(() => setMounted(true), [])

  const autoplay = useMemo(
    () =>
      Autoplay({
        delay: 5000,
        stopOnInteraction: true,
        stopOnMouseEnter: true,
      }),
    []
  )

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start" }, [autoplay])

  const [selectedIndex, setSelectedIndex] = useState(0)
  const [snapCount, setSnapCount] = useState(0)

  useEffect(() => {
    if (!emblaApi) return
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap())
    setSnapCount(emblaApi.scrollSnapList().length)
    onSelect()
    emblaApi.on("select", onSelect)
    emblaApi.on("reInit", () => {
      setSnapCount(emblaApi.scrollSnapList().length)
      onSelect()
    })
  }, [emblaApi])

  useEffect(() => {
    if (!mounted) return
    document.body.style.overflow = isOpen ? "hidden" : ""
    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen, mounted])

  useEffect(() => {
    if (!mounted) return
    if (!active) return
    if (!slides?.length) return

    const lastShownRaw = localStorage.getItem(storageKey)
    const lastShown = lastShownRaw ? Number(lastShownRaw) : 0

    const intervalMs = clamp(minIntervalDays, 1, 30) * MS_DAY
    const shouldShow = !lastShown || Date.now() - lastShown >= intervalMs

    if (shouldShow) {
      const t = window.setTimeout(() => setIsOpen(true), showDelayMs)
      return () => window.clearTimeout(t)
    }
  }, [mounted, active, slides, storageKey, showDelayMs, minIntervalDays])

  const handleClose = () => {
    setClosing(true)
    window.setTimeout(() => {
      localStorage.setItem(storageKey, String(Date.now()))
      setIsOpen(false)
      setClosing(false)
    }, 280)
  }

  const prev = () => emblaApi?.scrollPrev()
  const next = () => emblaApi?.scrollNext()
  const scrollTo = (i: number) => emblaApi?.scrollTo(i)

  if (!mounted) return null

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={handleClose}
      shouldCloseOnOverlayClick={false}
      ariaHideApp={false}
      style={{
        overlay: {
          backgroundColor: "rgba(0, 47, 108, 0.85)",
          backdropFilter: "blur(8px)",
          zIndex: 1000,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "16px", 
          opacity: closing ? 0 : 1,
          transition: "opacity 280ms ease",
        },
        content: {
          inset: "unset",
          border: "none",
          background: "transparent",
          padding: 0,
          maxWidth: "480px",
          width: "94%",
          height: "auto",
          maxHeight: "92vh", 
          display: "flex",
          flexDirection: "column",
        },
      }}
    >
      <div
        className={[
          "relative w-full overflow-hidden rounded-3xl bg-white shadow-[0_25px_60px_-12px_rgba(0,0,0,0.4)] transition-all duration-300",
          "flex flex-col max-h-[92vh]", 
          closing ? "scale-95 translate-y-4 opacity-0" : "scale-100 translate-y-0 opacity-100",
        ].join(" ")}
        style={{
          minHeight: "78vh",
        }}
      >
        <button
          onClick={handleClose}
          aria-label="Cerrar"
          className="absolute right-3 top-3 z-30 grid h-9 w-9 place-items-center rounded-full bg-[#002f6c]/80 text-white backdrop-blur-sm transition-all hover:bg-[#002f6c] hover:scale-105"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="relative flex-1">
          <div ref={emblaRef} className="overflow-hidden">
            <div className="flex">
              {slides.map((slide) => {
                const overlay = typeof slide.overlayOpacity === "number" ? slide.overlayOpacity : 0.25

                return (
                  <div key={slide.id} className="min-w-0 flex-[0_0_100%]">
                    <div className="relative w-full overflow-hidden aspect-[3/4] sm:aspect-[4/5]">
                      <img
                        src={slide.backgroundSrc || "/placeholder.svg"}
                        alt={slide.title}
                        className="absolute inset-0 h-full w-full object-cover"
                      />

                      <div
                        className="absolute inset-0"
                        style={{
                          background: `linear-gradient(to top, rgba(0,0,0,${overlay + 0.5}) 0%, rgba(0,0,0,${
                            overlay * 0.3
                          }) 40%, transparent 70%)`,
                        }}
                      />

                      {slide.badge && (
                        <div className="absolute left-4 top-4 z-10">
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#2ad37a] px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-[#002f6c] shadow-lg">
                            <Sparkles className="h-3 w-3" />
                            {slide.badge}
                          </span>
                        </div>
                      )}

                      <div className="absolute inset-x-0 bottom-0 z-10 p-5">
                        <h3 className="text-2xl font-bold leading-tight text-white drop-shadow-lg text-balance">
                          {slide.title}
                        </h3>

                        {slide.subtitle && (
                          <p className="mt-2 text-base font-medium text-white/95 drop-shadow-md">
                            {slide.subtitle}
                          </p>
                        )}

                        {slide.description && (
                          <p className="mt-2 text-sm leading-relaxed text-white/85 drop-shadow-md line-clamp-2">
                            {slide.description}
                          </p>
                        )}

                        {slide.ctaText && slide.ctaHref && (
                          <a
                            href={slide.ctaHref}
                            onClick={() => localStorage.setItem(storageKey, String(Date.now()))}
                            className="mt-4 inline-flex items-center justify-center rounded-full bg-[#2ad37a] px-6 py-3 text-sm font-bold text-[#002f6c] shadow-lg transition-all hover:brightness-110 hover:scale-[1.02] active:scale-[0.98]"
                          >
                            {slide.ctaText}
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {slides.length > 1 && (
            <>
              <button
                onClick={prev}
                aria-label="Anterior"
                className="absolute left-3 top-1/2 z-20 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-[#002f6c] shadow-lg transition-all hover:bg-white hover:scale-110 active:scale-95"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={next}
                aria-label="Siguiente"
                className="absolute right-3 top-1/2 z-20 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-[#002f6c] shadow-lg transition-all hover:bg-white hover:scale-110 active:scale-95"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          )}
        </div>

        <div className="bg-white px-5 py-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[#002f6c]/50">
                {monthLabel}
              </p>
              {snapCount > 1 && (
                <p className="mt-0.5 text-sm font-medium text-[#002f6c]/70">
                  {selectedIndex + 1} de {snapCount} ofertas
                </p>
              )}
            </div>

            {snapCount > 1 && (
              <div className="flex items-center gap-1.5">
                {Array.from({ length: snapCount }).map((_, i) => {
                  const activeDot = i === selectedIndex
                  return (
                    <button
                      key={i}
                      onClick={() => scrollTo(i)}
                      aria-label={`Ir a la promo ${i + 1}`}
                      className={[
                        "h-2 rounded-full transition-all duration-300",
                        activeDot ? "w-6 bg-[#2ad37a]" : "w-2 bg-[#002f6c]/20 hover:bg-[#002f6c]/30",
                      ].join(" ")}
                    />
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </Modal>
  )
}