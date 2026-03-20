import { useState } from "react";
import { 
  Instagram, 
  Linkedin, 
  Dribbble, 
  Twitter, 
  Mail, 
  Calendar, 
  Copy, 
  Check, 
  X,
  Palette 
} from "lucide-react";
import { SITE } from "../lib/constants";

const SOCIALS = [
  { label: "Instagram", icon: Instagram, key: "instagram" },
  { label: "Behance", icon: Palette, key: "behance" },
  { label: "LinkedIn", icon: Linkedin, key: "linkedin" },
  { label: "Dribbble", icon: Dribbble, key: "dribbble" },
  { label: "X", icon: Twitter, key: "twitter" },
];

export default function ContactPanel({ onClose }) {
  const [copied, setCopied] = useState(false);

  const accent   = "#C98B8B";
  const bgPanel  = "#FAF7F2";
  const textMain = "#2D2A26";

  const myEmail = SITE.email || "hello@designer.com";

  const copyEmail = () => {
    navigator.clipboard.writeText(myEmail);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const openMail = () => {
  window.open(
    `https://mail.google.com/mail/?view=cm&fs=1&to=${myEmail}`,
    "_blank"
  );
};

  return (
    <div
      style={{
        position:       "fixed",
        inset:           0,
        zIndex:          90,
        background:     "rgba(255,255,255,0.85)",
        backdropFilter: "blur(18px)",
        display:        "flex",
        alignItems:     "center",
        justifyContent: "center",
        padding:        "24px",
      }}
    >
      <style>{`
        @keyframes contactFadeUp {
          from { opacity:0; transform:translateY(40px); }
          to   { opacity:1; transform:translateY(0); }
        }
        .soc-btn:hover  { color: ${accent} !important; transform: scale(1.1); }
        .mail-btn:hover { background: ${accent} !important; color: white !important; }
        .cal-btn:hover  { background: ${textMain} !important; color: white !important; }
        .close-btn:hover { opacity: 1 !important; transform: rotate(90deg); }
      `}</style>

      <div
        style={{
          width:      "min(460px,96vw)",
          background:  bgPanel,
          border:     `1px solid ${accent}25`,
          borderRadius: 40,
          padding:    "60px 45px 45px 45px",
          boxShadow:  "0 40px 80px rgba(201,139,139,0.12)",
          animation:  "contactFadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards",
          position:   "relative",
          textAlign:  "center",
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="close-btn"
          style={{
            position:   "absolute",
            top:         30,
            right:       30,
            background: "none",
            border:     "none",
            color:       accent,
            cursor:     "pointer",
            opacity:     0.3,
            transition: "all 0.5s ease",
          }}
        >
          <X size={22} />
        </button>

        {/* Heading */}
        <div style={{ marginBottom: 40 }}>
          <h2
            style={{
              fontFamily:  "'Cormorant Garamond', serif",
              fontSize:     36,
              fontWeight:   500,
              color:        textMain,
              fontStyle:   "italic",
              marginBottom: 10,
            }}
          >
            Let's Create Together
          </h2>
          <p
            style={{
              fontFamily:  "'Outfit', sans-serif",
              fontSize:     14,
              color:       "#8A847E",
              letterSpacing:"0.01em",
              lineHeight:   1.6,
            }}
          >
            Available for creative direction and bespoke design projects.
          </p>
        </div>

        {/* Email display + copy */}
        <div
          style={{
            background:     "white",
            border:        `1px solid ${accent}15`,
            borderRadius:   24,
            padding:       "28px",
            marginBottom:   20,
            display:       "flex",
            flexDirection: "column",
            alignItems:    "center",
            gap:            12,
          }}
        >
          <span
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize:    26,
              color:       textMain,
            }}
          >
            {myEmail}
          </span>
          <button
            onClick={copyEmail}
            style={{
              display:       "flex",
              alignItems:    "center",
              gap:            6,
              padding:       "6px 16px",
              background:    "none",
              border:        `1px solid ${accent}30`,
              color:          accent,
              fontSize:       10,
              borderRadius:   100,
              cursor:        "pointer",
              textTransform: "uppercase",
              letterSpacing: "0.15em",
              transition:    "0.3s",
            }}
          >
            {copied ? <Check size={12} /> : <Copy size={12} />}
            {copied ? "Copied to Clipboard" : "Copy Address"}
          </button>
        </div>

        {/* CTA buttons */}
        <div style={{ display:"flex", flexDirection:"column", gap:14, marginBottom:50 }}>
          <button
            className="mail-btn"
            onClick={openMail}
            style={{
              display:        "flex",
              alignItems:     "center",
              justifyContent: "center",
              gap:             12,
              padding:        "20px",
              background:     "transparent",
              border:        `1px solid ${accent}`,
              color:           accent,
              borderRadius:    100,
              fontSize:        11,
              fontWeight:      600,
              textTransform:  "uppercase",
              letterSpacing:  "0.2em",
              cursor:         "pointer",
              transition:     "0.4s",
            }}
          >
            <Mail size={18} strokeWidth={1.2} /> Write a Message
          </button>

          <button
            className="cal-btn"
            onClick={() => window.open(SITE.calendly || "https://calendly.com/her-username", "_blank")}
            style={{
              display:        "flex",
              alignItems:     "center",
              justifyContent: "center",
              gap:             12,
              padding:        "20px",
              background:      textMain,
              border:         "none",
              color:          "white",
              borderRadius:    100,
              fontSize:        11,
              fontWeight:      600,
              textTransform:  "uppercase",
              letterSpacing:  "0.2em",
              cursor:         "pointer",
              transition:     "0.4s",
            }}
          >
            <Calendar size={18} strokeWidth={1.2} /> Book a Discovery Call
          </button>
        </div>

        {/* Social links */}
        <div
          style={{
            display:        "flex",
            justifyContent: "center",
            gap:             30,
            borderTop:     `1px solid ${accent}10`,
            paddingTop:     35,
          }}
        >
          {SOCIALS.map((s) => {
            const Icon = s.icon;
            return (
              <a
                key={s.key}
                href={SITE.socials?.[s.key] || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="soc-btn"
                style={{
                  color:      "#C2BCB6",
                  transition: "all 0.4s ease",
                  display:    "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Icon size={24} strokeWidth={1} />
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
}