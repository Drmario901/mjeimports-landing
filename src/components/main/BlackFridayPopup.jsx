import React, { useEffect, useMemo, useState } from "react";
import Modal from "react-modal";
import { X } from "lucide-react";

const MS_DAY = 86400000;

function getBlackFridayRange(year = new Date().getFullYear()) {
  const nov1 = new Date(year, 10, 1);
  const day = nov1.getDay();
  const toFirstThu = (4 - day + 7) % 7;
  const firstThu = new Date(year, 10, 1 + toFirstThu);
  const fourthThu = new Date(firstThu);
  fourthThu.setDate(firstThu.getDate() + 21);
  const bf = new Date(fourthThu);
  bf.setDate(fourthThu.getDate() + 1);
  const start = new Date(bf.getFullYear(), bf.getMonth(), bf.getDate(), 0, 0, 0);
  const end = new Date(bf.getFullYear(), bf.getMonth(), bf.getDate(), 23, 59, 59);
  return { start, end, date: bf };
}

function diffParts(ms) {
  if (ms < 0) ms = 0;
  const s = Math.floor(ms / 1000);
  const days = Math.floor(s / 86400);
  const hours = Math.floor((s % 86400) / 3600);
  const minutes = Math.floor((s % 3600) / 60);
  const seconds = s % 60;
  return { days, hours, minutes, seconds };
}

export default function BlackFridayModal({ active = true }) {
  const [isOpen, setIsOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const [now, setNow] = useState(() => new Date());
  const { start, end, date } = useMemo(() => getBlackFridayRange(), []);

  const isBefore = now < start;
  const isDuring = now >= start && now <= end;
  const target = isBefore ? start : isDuring ? end : null;

  const headerText = isBefore ? "¡Black Friday!" : isDuring ? "¡Es hoy! 🎉" : "Black Friday finalizó";

  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => (document.body.style.overflow = "");
  }, [isOpen]);

  useEffect(() => {
    if (!active) return;
    if (new Date() > end) return;

    const lastShownRaw = localStorage.getItem("blackfriday_last_shown");
    const lastShown = lastShownRaw ? Number(lastShownRaw) : 0;

    const daysUntil = Math.ceil((start.getTime() - Date.now()) / MS_DAY);
    const intervalMs = daysUntil <= 7 ? MS_DAY : MS_DAY * 2;
    const shouldShow = !lastShown || Date.now() - lastShown >= intervalMs;

    if (shouldShow) {
      const t = setTimeout(() => setIsOpen(true), 1500);
      return () => clearTimeout(t);
    }
  }, [active, start, end]);

  useEffect(() => {
    if (!isOpen) return;
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, [isOpen]);

  const handleClose = () => {
    setClosing(true);
    setTimeout(() => {
      localStorage.setItem("blackfriday_last_shown", String(Date.now()));
      setIsOpen(false);
      setClosing(false);
    }, 300);
  };

  const remaining = target ? diffParts(target - now) : { days: 0, hours: 0, minutes: 0, seconds: 0 };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={handleClose}
      shouldCloseOnOverlayClick={false} 
      style={{
        overlay: {
          backgroundColor: "rgba(0, 47, 108, 0.75)",
          zIndex: 1000,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "opacity 0.3s ease",
          opacity: closing ? 0 : 1,
        },
        content: {
          inset: "unset",
          border: "none",
          borderRadius: "14px",
          background: "#fff",
          padding: "26px 18px",
          maxWidth: "420px",
          width: "90%",
          textAlign: "center",
          boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
          position: "relative",
          transform: closing ? "scale(0.9) translateY(20px)" : "scale(1) translateY(0)",
          opacity: closing ? 0 : 1,
          transition: "all 0.3s ease",
        },
      }}
    >

      <button
        onClick={handleClose}
        aria-label="Cerrar"
        style={{
          position: "absolute",
          top: "12px",
          right: "12px",
          background: "transparent",
          border: "none",
          color: "#002f6c",
          cursor: "pointer",
        }}
      >
        <X size={24} />
      </button>

      <h2 style={{ color: "#2ad37a", fontSize: "1.8rem", fontWeight: 800, marginBottom: 8 }}>
        {headerText}
      </h2>

      <p style={{ color: "#002f6c", fontSize: "1rem", fontWeight: 600, marginBottom: 12 }}>
        Aprovecha <span style={{ color: "#2ad37a", fontWeight: 700 }}>Black Friday</span> de tus tiendas favoritas con nosotros
      </p>

      <p style={{ color: "#002f6c", fontSize: "0.9rem", opacity: 0.85, marginBottom: 10 }}>
        {`Este año: ${date.toLocaleDateString("es-VE", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        })}`}
      </p>

      {isBefore || isDuring ? (
        <div
          style={{
            border: "1px solid rgba(42,211,122,0.35)",
            background: "rgba(42,211,122,0.08)",
            borderRadius: 12,
            padding: "10px 12px",
            marginBottom: 14,
          }}
        >
          <div style={{ color: "#002f6c", fontWeight: 700, marginBottom: 6 }}>
            {isBefore ? "Comienza en" : "¡Es hoy! Aprovecha"}
          </div>

          {isBefore ? (
            <div style={{ display: "flex", justifyContent: "center", gap: 10, color: "#002f6c" }}>
              {[
                { label: "d", value: remaining.days },
                { label: "h", value: remaining.hours },
                { label: "m", value: remaining.minutes },
                { label: "s", value: remaining.seconds },
              ].map((p) => (
                <div key={p.label} style={{ minWidth: 56 }}>
                  <div style={{ fontSize: "1.25rem", fontWeight: 800 }}>
                    {String(p.value).padStart(2, "0")}
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "#2ad37a", fontWeight: 700 }}>
                    {p.label}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ fontSize: "1.05rem", fontWeight: 800, color: "#002f6c", margin: 0 }}>
              ¡Es hoy! Aprovecha
            </p>
          )}
        </div>
      ) : null}

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          flexWrap: "wrap",
          gap: 8,
          alignItems: "center",
          opacity: 0.9,
        }}
      >
        {["amazon", "shein", "nike", "apple", "adidas", "ebay", "vans", "walmart"].map((s) => (
          <img
            key={s}
            src={`/stores/${s}.png`}
            alt={s}
            style={{ height: 28, width: "auto", objectFit: "contain" }}
            loading="lazy"
          />
        ))}
        <span style={{ color: "#002f6c", fontWeight: 600, fontSize: "0.9rem" }}>y más…</span>
      </div>
    </Modal>
  );
}
