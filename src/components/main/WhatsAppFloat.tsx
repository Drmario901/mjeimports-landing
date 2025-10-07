"use client"

interface WhatsAppFloatProps {
  phoneNumber: string 
  message?: string 
}

export default function WhatsAppFloat({ phoneNumber, message = "" }: WhatsAppFloatProps) {
  const whatsappUrl = `https://wa.me/${phoneNumber}${message ? `?text=${encodeURIComponent(message)}` : ""}`

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        position: "fixed",
        bottom: "24px",
        right: "24px",
        width: "60px",
        height: "60px",
        backgroundColor: "#25D366",
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 4px 12px rgba(37, 211, 102, 0.4)",
        cursor: "pointer",
        transition: "all 0.3s ease",
        zIndex: 1000,
        textDecoration: "none",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "scale(1.1)"
        e.currentTarget.style.boxShadow = "0 6px 20px rgba(37, 211, 102, 0.6)"
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "scale(1)"
        e.currentTarget.style.boxShadow = "0 4px 12px rgba(37, 211, 102, 0.4)"
      }}
      aria-label="Contactar por WhatsApp"
    >
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))",
        }}
      >
        <path
          d="M16 0C7.164 0 0 7.164 0 16c0 2.825.738 5.488 2.031 7.794L0 32l8.394-2.031A15.923 15.923 0 0016 32c8.836 0 16-7.164 16-16S24.836 0 16 0zm0 29.333c-2.544 0-4.956-.706-7.006-1.931l-.5-.294-5.188 1.256 1.256-5.188-.294-.5A13.256 13.256 0 012.667 16c0-7.363 5.97-13.333 13.333-13.333S29.333 8.637 29.333 16 23.363 29.333 16 29.333z"
          fill="white"
        />
        <path
          d="M23.206 19.544c-.394-.2-2.331-1.15-2.694-1.281-.362-.131-.625-.2-.888.2-.262.4-1.019 1.281-1.25 1.544-.231.262-.462.294-.856.094-.394-.2-1.663-.613-3.169-1.956-1.169-1.044-1.956-2.331-2.188-2.725-.231-.394-.025-.606.175-.806.181-.181.394-.469.594-.706.2-.231.262-.394.394-.656.131-.262.069-.494-.031-.694-.1-.2-.888-2.137-1.219-2.925-.319-.769-.644-.663-.888-.675-.231-.012-.494-.012-.756-.012-.262 0-.688.1-1.05.494-.362.394-1.381 1.35-1.381 3.294 0 1.944 1.413 3.819 1.606 4.081.2.262 2.769 4.231 6.706 5.931.938.406 1.669.65 2.238.831.944.3 1.8.256 2.481.156.756-.113 2.331-.956 2.662-1.875.331-.919.331-1.706.231-1.875-.1-.169-.362-.269-.756-.469z"
          fill="white"
        />
      </svg>
    </a>
  )
}