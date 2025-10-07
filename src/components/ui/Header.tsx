"use client"

import type React from "react"
import { Home, Users, Briefcase, HelpCircle, Mail, Menu, X } from "lucide-react"
import { useState, useEffect } from "react"

const navLinks = [
  { label: "Inicio", href: "#inicio", icon: Home },
  { label: "Servicios", href: "#servicios", icon: Briefcase },
  { label: "Quiénes Somos", href: "#quienes-somos", icon: Users },
  { label: "Cómo Funciona", href: "#como-funciona", icon: HelpCircle },
  { label: "Contacto", href: "#contact", icon: Mail },
]

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeLink, setActiveLink] = useState("#inicio")
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }

    window.addEventListener("scroll", handleScroll)

    const sections = document.querySelectorAll("section[id]")

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const href = `#${entry.target.id}`
            setActiveLink(href)
            history.replaceState(null, "", href)
          }
        })
      },
      { threshold: 0.4 },
    )

    sections.forEach((section) => observer.observe(section))

    return () => {
      window.removeEventListener("scroll", handleScroll)
      sections.forEach((section) => observer.unobserve(section))
    }
  }, [])

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith("#")) {
      e.preventDefault()
      const target = document.querySelector(href)
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" })
      }
      setIsMenuOpen(false)
    }
  }

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

  return (
    <header
      className={`fixed top-0 left-0 w-full bg-white shadow-md z-50 transition-all duration-300 ${
        isScrolled ? "shadow-lg bg-white/95 backdrop-blur-sm" : ""
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <a href="#inicio" className="flex items-center">
          <img src="/logo.png" alt="Logo MJE Imports" className="h-14 w-auto" />
        </a>

        <nav className="hidden lg:flex space-x-3">
          {navLinks.map(({ href, label, icon: Icon }) => (
            <a
              key={href}
              href={href}
              onClick={(e) => handleLinkClick(e, href)}
              className={`group flex items-center gap-2 px-3 py-2 rounded-lg font-medium text-sm transition-all duration-200 relative ${
                activeLink === href ? "text-[#002f6c] font-semibold" : "text-gray-700"
              }`}
            >
              <Icon size={18} className="text-[#002f6c]" />
              {label}
              <span
                className={`absolute bottom-0 left-0 h-[2px] bg-[#002f6c] rounded-full transition-all duration-300 ${
                  activeLink === href ? "w-full" : "w-0 group-hover:w-full"
                }`}
              ></span>
            </a>
          ))}
        </nav>

        <button
          onClick={toggleMenu}
          className="lg:hidden flex items-center justify-center w-10 h-10 rounded-lg border border-gray-300 text-gray-800 hover:bg-gray-100 transition-all duration-200"
          aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <nav
        className={`absolute left-0 w-full bg-white shadow-md flex flex-col items-center transition-all duration-300 overflow-hidden ${
          isMenuOpen
            ? "max-h-[400px] opacity-100 translate-y-0"
            : "max-h-0 opacity-0 -translate-y-2"
        }`}
      >
        {navLinks.map(({ href, label, icon: Icon }) => (
          <a
            key={href}
            href={href}
            onClick={(e) => handleLinkClick(e, href)}
            className={`w-full flex items-center justify-start gap-3 px-6 py-3 border-t border-gray-100 font-medium transition-all duration-200 hover:bg-[#002f6c]/10 hover:text-[#002f6c] ${
              activeLink === href ? "text-[#002f6c] font-semibold" : "text-gray-700"
            }`}
          >
            <Icon size={20} className="text-[#002f6c]" />
            {label}
          </a>
        ))}
      </nav>
    </header>
  )
}
