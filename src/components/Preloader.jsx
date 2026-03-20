import { useState, useEffect, useRef } from "react";

export default function Preloader({ onEnter }) {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState("loading");
  const [activeLayers, setActiveLayers] = useState([]);

  // FAST & DETAILED LOADING LOGIC (1.5s Total)
  useEffect(() => {
    const steps = [
      { target: 15, delay: 100, layer: "Geometry" },
      { target: 40, delay: 350, layer: "Texturing" },
      { target: 65, delay: 700, layer: "Modeling" },
      { target: 85, delay: 1100, layer: "Visuals" },
      { target: 100, delay: 1400, layer: "Universe" },
    ];

    const timers = steps.map(({ target, delay, layer }) =>
      setTimeout(() => {
        setProgress(target);
        if (layer) setActiveLayers(prev => [...prev, layer]);
      }, delay)
    );

    const readyTimer = setTimeout(() => setPhase("ready"), 1700);

    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(readyTimer);
    };
  }, []);

  const handleEnter = () => {
    setPhase("gone");
    setTimeout(onEnter, 900);
  };

  const cursorRef = useRef(null);

  useEffect(() => {
    const move = (e) => {
      if (cursorRef.current) {
        cursorRef.current.style.left = e.clientX + "px";
        cursorRef.current.style.top = e.clientY + "px";
      }
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  if (phase === "gone") return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 1000,
      background: "#FCFAF7",
      opacity: 0,
      transition: "opacity 0.9s cubic-bezier(0.4, 0, 0.2, 1)",
      pointerEvents: "none",
    }}/>
  );

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 1000,
      background: "#FCFAF7", // Bright, warm paper white
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      overflow: "hidden",
      cursor: "none",
    }}>

      {/* ── THE ARTIST'S BRUSH CURSOR ── */}
      <div
        ref={cursorRef}
        className="pre-cursor"
        style={{ position: "fixed", left: "-100px", top: "-100px", fontSize: "40px", zIndex: 9999 }}
      >
        🖌️
      </div>

      <style>{`
        @keyframes brushStroke {
          0%, 100% { transform: translate(-10px, -30px) rotate(-15deg); }
          50% { transform: translate(-10px, -42px) rotate(20deg); }
        }
        @keyframes inkBleed {
          0% { transform: scale(0.7); opacity: 0; filter: blur(30px); }
          100% { transform: scale(1); opacity: 0.04; filter: blur(0px); }
        }
        @keyframes floatCoords {
          0% { transform: translateY(0) translateX(0); opacity: 0; }
          20% { opacity: 0.5; }
          80% { opacity: 0.5; }
          100% { transform: translateY(-120px) translateX(30px); opacity: 0; }
        }
        @keyframes textFocus {
          0% { filter: blur(15px); opacity: 0; letter-spacing: 0.8em; }
          100% { filter: blur(0); opacity: 1; letter-spacing: 0.12em; }
        }
        @keyframes lineGrow {
          from { width: 0; }
          to { width: 100%; }
        }
        @keyframes glitch {
          0% { transform: translate(0); }
          20% { transform: translate(-2px, 2px); }
          40% { transform: translate(-2px, -2px); }
          60% { transform: translate(2px, 2px); }
          80% { transform: translate(2px, -2px); }
          100% { transform: translate(0); }
        }
        .pre-cursor {
          pointer-events: none;
          animation: brushStroke 2.2s ease-in-out infinite;
          filter: drop-shadow(5px 10px 15px rgba(228, 77, 38, 0.25));
        }
        .enter-btn:hover {
          background: #E44D26 !important;
          color: white !important;
          border-color: #E44D26 !important;
          transform: translateY(-5px) scale(1.03);
          box-shadow: 0 25px 50px rgba(228, 77, 38, 0.2) !important;
        }
        .enter-btn:active { transform: scale(0.97); }
        .layer-tag {
          font-family: 'Outfit', sans-serif;
          font-size: 8px;
          padding: 5px 12px;
          border: 1px solid rgba(0,0,0,0.06);
          text-transform: uppercase;
          letter-spacing: 0.15em;
          transition: all 0.4s ease;
        }
      `}</style>

      {/* ── BACKGROUND ARCHITECTURE ── */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: `url('https://www.transparenttextures.com/patterns/natural-paper.png')`,
        opacity: 0.4, pointerEvents: "none"
      }} />

      {/* Dynamic Ink Blobs (Logo Color) */}
      <div style={{
        position: "absolute", top: "15%", left: "10%",
        width: "45vw", height: "45vw",
        background: "radial-gradient(circle, #E44D26 0%, transparent 75%)",
        animation: "inkBleed 6s ease-out forwards",
        display: activeLayers.includes("Geometry") ? "block" : "none"
      }} />

      {/* ── 3D ENGINE DATA (Floating Coordinates) ── */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        {[...Array(10)].map((_, i) => (
          <div key={i} style={{
            position: "absolute",
            top: `${15 + (i * 8)}%`,
            left: `${15 + (i * 7)}%`,
            fontFamily: "'Outfit', sans-serif",
            fontSize: "8px",
            color: "#E44D26",
            animation: `floatCoords ${4 + i}s linear infinite`,
            opacity: 0,
            letterSpacing: "0.1em"
          }}>
            VERTS: {(Math.random() * 1000).toFixed(0)} | XYZ: {(Math.random() * 1).toFixed(3)}
          </div>
        ))}
      </div>

      {/* ── MAIN LOGO / BRANDING ── */}
      <div style={{ position: "relative", zIndex: 10, textAlign: "center" }}>
        <h1 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: "clamp(55px, 12vw, 110px)",
          fontWeight: 300,
          color: "#2D2A26",
          margin: 0,
          lineHeight: 0.85,
          animation: "textFocus 2s cubic-bezier(0.16, 1, 0.3, 1) forwards"
        }}>
          Rinkya <span style={{ fontStyle: "italic", fontWeight: 200, color: "#E44D26" }}>Designs</span>
        </h1>

        <div style={{
          marginTop: 25,
          display: "flex", alignItems: "center", justifyContent: "center", gap: 20,
          fontFamily: "'Outfit', sans-serif", fontSize: "10px",
          color: "#8C8479", letterSpacing: "0.55em", textTransform: "uppercase"
        }}>
          <div style={{ height: "1px", width: activeLayers.includes("Visuals") ? "60px" : "0px", background: "#E44D26", transition: "width 1s" }} />
          <span>Artist & 3D Designer</span>
          <div style={{ height: "1px", width: activeLayers.includes("Visuals") ? "60px" : "0px", background: "#E44D26", transition: "width 1s" }} />
        </div>
      </div>

      {/* ── INTERACTIVE PROGRESS CONSOLE ── */}
      <div style={{ width: "min(420px, 85vw)", marginTop: 100, zIndex: 10 }}>
        
        {/* Status Header */}
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 15,
          fontFamily: "'Outfit', sans-serif", fontSize: "9px", letterSpacing: "0.25em"
        }}>
          <div style={{ color: "rgba(0,0,0,0.3)" }}>
            PROJECT_ID: <span style={{ color: "#2D2A26" }}>RD_2026_UNIV</span>
          </div>
          <div style={{ fontWeight: 700, color: "#E44D26", fontSize: "12px" }}>
            {progress}%
          </div>
        </div>

        {/* Thick Professional Progress Track */}
        <div style={{ width: "100%", height: "3px", background: "rgba(0,0,0,0.05)", position: "relative", overflow: "hidden" }}>
          <div style={{
            height: "100%", width: `${progress}%`,
            background: "#2D2A26",
            transition: "width 0.4s cubic-bezier(0.1, 0.7, 0.1, 1)"
          }} />
        </div>

        {/* Technical Component Labels */}
        <div style={{
          display: "flex", gap: 10, marginTop: 20, flexWrap: "wrap", justifyContent: "center"
        }}>
          {["Geometry", "Texturing", "Modeling", "Visuals", "Universe"].map((tag, i) => (
            <span key={tag} className="layer-tag" style={{
              background: activeLayers.includes(tag) ? "rgba(228, 77, 38, 0.05)" : "transparent",
              color: activeLayers.includes(tag) ? "#E44D26" : "rgba(0,0,0,0.15)",
              borderColor: activeLayers.includes(tag) ? "#E44D26" : "rgba(0,0,0,0.06)",
              transform: activeLayers.includes(tag) ? "scale(1.05)" : "scale(1)"
            }}>
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* ── THE CLIMAX: ENTER UNIVERSE ── */}
      {phase === "ready" && (
        <button
          className="enter-btn"
          onClick={handleEnter}
          style={{
            marginTop: 70,
            padding: "22px 90px",
            background: "transparent",
            color: "#2D2A26",
            border: "2px solid #2D2A26",
            borderRadius: "0px",
            fontSize: "13px",
            letterSpacing: "0.45em",
            textTransform: "uppercase",
            fontWeight: 800,
            cursor: "pointer",
            fontFamily: "'Outfit', sans-serif",
            transition: "all 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
            zIndex: 10,
            animation: "textFocus 1s ease forwards"
          }}
        >
          Enter Universe
        </button>
      )}

      {/* ── DATASHEET FOOTER ── */}
      <div style={{
        position: "absolute", bottom: 40, left: 50,
        fontFamily: "'Outfit', sans-serif", fontSize: "8px",
        color: "rgba(0,0,0,0.25)", letterSpacing: "0.3em", textTransform: "uppercase"
      }}>
        Loc: New Delhi // Studio_Access: Granted
      </div>

      <div style={{
        position: "absolute", bottom: 40, right: 50,
        fontFamily: "'Outfit', sans-serif", fontSize: "8px",
        color: "rgba(0,0,0,0.25)", letterSpacing: "0.3em", textTransform: "uppercase"
      }}>
        Render_Engine: 3D_Core // Rinkya Designs ©
      </div>

      {/* Subtle Scanline Overlay */}
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.02) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.01), rgba(0, 255, 0, 0.005), rgba(0, 0, 255, 0.01))",
        zIndex: 5, backgroundSize: "100% 2px, 3px 100%",
        pointerEvents: "none"
      }} />
    </div>
  );
}