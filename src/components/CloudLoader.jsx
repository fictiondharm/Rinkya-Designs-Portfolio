import { useEffect, useState } from "react";

function CloudShape({ color = "#FFFFFF" }) {
  return (
    <svg viewBox="0 0 200 80" style={{ width:"100%", height:"100%" }}>
      <ellipse cx="100" cy="55" rx="90"  ry="28" fill={color}/>
      <circle  cx="60"  cy="45" r="28"  fill={color}/>
      <circle  cx="100" cy="36" r="34"  fill={color}/>
      <circle  cx="145" cy="44" r="26"  fill={color}/>
      <circle  cx="78"  cy="40" r="22"  fill={color}/>
      <circle  cx="125" cy="38" r="24"  fill={color}/>
    </svg>
  );
}

export default function CloudLoader({ onComplete }) {
  const [opacity, setOpacity] = useState(1);
  const [gone,    setGone]    = useState(false);

  useEffect(() => {
    const fadeTimer   = setTimeout(() => setOpacity(0),        2800);
    const removeTimer = setTimeout(() => {
      setGone(true);
      if (onComplete) onComplete();
    }, 3800);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  if (gone) return null;

  return (
    <div style={{
      position:      "fixed",
      inset:          0,
      zIndex:         999,
      pointerEvents:  opacity > 0 ? "all" : "none",
      transition:    "opacity 1s ease",
      opacity,
      overflow:      "hidden",
      background:    "linear-gradient(180deg, #F2E8F0 0%, #EDD5D5 40%, #E8D0C8 100%)",
    }}>
      <style>{`
        @keyframes cloudDrift1 {
          0%   { transform: translateX(-120px); }
          100% { transform: translateX(120vw);  }
        }
        @keyframes cloudDrift2 {
          0%   { transform: translateX(120vw);  }
          100% { transform: translateX(-320px); }
        }
        @keyframes cloudFloat {
          0%,100% { transform: translateY(0px);   }
          50%      { transform: translateY(-12px); }
        }
        @keyframes fadeUp {
          from { opacity:0; transform:translateY(16px); }
          to   { opacity:1; transform:translateY(0);    }
        }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }
        @keyframes dotPulse {
          0%,100% { opacity:0.3; transform:scale(0.8); }
          50%      { opacity:1;   transform:scale(1.2); }
        }
      `}</style>

      {/* Back clouds */}
      {[
        { w:520, h:180, top:"8%",  left:"-10%", dur:"18s", delay:"0s",  op:0.45, dir:1 },
        { w:680, h:220, top:"12%", left:"60%",  dur:"22s", delay:"0s",  op:0.35, dir:2 },
        { w:440, h:160, top:"5%",  left:"25%",  dur:"26s", delay:"3s",  op:0.3,  dir:1 },
        { w:600, h:200, top:"18%", left:"-5%",  dur:"20s", delay:"8s",  op:0.4,  dir:2 },
      ].map((c,i) => (
        <div key={`b${i}`} style={{
          position: "absolute", top:c.top, left:c.left,
          width:c.w, height:c.h, opacity:c.op,
          animation:`${c.dir===1?"cloudDrift1":"cloudDrift2"} ${c.dur} ${c.delay} linear infinite`,
        }}>
          <CloudShape color="#FFFFFF"/>
        </div>
      ))}

      {/* Mid clouds */}
      {[
        { w:420, h:160, top:"30%", left:"-8%",  dur:"15s", delay:"2s", op:0.65, dir:1 },
        { w:560, h:190, top:"35%", left:"55%",  dur:"19s", delay:"0s", op:0.6,  dir:2 },
        { w:480, h:170, top:"42%", left:"-12%", dur:"21s", delay:"4s", op:0.55, dir:2 },
        { w:390, h:145, top:"38%", left:"72%",  dur:"16s", delay:"9s", op:0.5,  dir:1 },
        { w:500, h:180, top:"45%", left:"20%",  dur:"23s", delay:"1s", op:0.55, dir:2 },
      ].map((c,i) => (
        <div key={`m${i}`} style={{
          position: "absolute", top:c.top, left:c.left,
          width:c.w, height:c.h, opacity:c.op,
          animation:`${c.dir===1?"cloudDrift1":"cloudDrift2"} ${c.dur} ${c.delay} linear infinite`,
        }}>
          <CloudShape color="#FFF0F5"/>
        </div>
      ))}

      {/* Front clouds — dense */}
      {[
        { w:600, h:220, top:"55%", left:"-15%", dur:"12s", delay:"0s", op:0.9,  dir:1 },
        { w:720, h:260, top:"60%", left:"50%",  dur:"14s", delay:"2s", op:0.85, dir:2 },
        { w:540, h:200, top:"52%", left:"20%",  dur:"11s", delay:"5s", op:0.8,  dir:1 },
        { w:660, h:240, top:"68%", left:"-5%",  dur:"13s", delay:"1s", op:0.95, dir:2 },
        { w:580, h:210, top:"72%", left:"60%",  dur:"15s", delay:"3s", op:0.88, dir:1 },
        { w:700, h:250, top:"78%", left:"10%",  dur:"10s", delay:"0s", op:1.0,  dir:2 },
        { w:640, h:230, top:"82%", left:"45%",  dur:"12s", delay:"4s", op:0.92, dir:1 },
        { w:760, h:270, top:"88%", left:"-10%", dur:"11s", delay:"2s", op:1.0,  dir:2 },
      ].map((c,i) => (
        <div key={`f${i}`} style={{
          position: "absolute", top:c.top, left:c.left,
          width:c.w, height:c.h, opacity:c.op,
          animation:`${c.dir===1?"cloudDrift1":"cloudDrift2"} ${c.dur} ${c.delay} linear infinite`,
        }}>
          <CloudShape color="#FDFBF9"/>
        </div>
      ))}

      {/* Center content */}
      <div style={{
        position:       "absolute", inset:0,
        display:        "flex", flexDirection:"column",
        alignItems:     "center", justifyContent:"center",
        gap:             16, zIndex:2,
      }}>
        <div style={{
          fontSize:  72,
          animation: "cloudFloat 3s ease-in-out infinite",
          filter:    "drop-shadow(0 8px 24px rgba(212,130,154,0.35))",
        }}>🎨</div>

        <div style={{
          fontFamily:    "'Cormorant Garamond', serif",
          fontSize:      "clamp(32px, 6vw, 64px)",
          fontWeight:     700,
          letterSpacing: "0.1em",
          background:    "linear-gradient(135deg, #C94B7B 0%, #D4829A 50%, #E8B4A0 100%)",
          backgroundSize:"200% auto",
          WebkitBackgroundClip:"text",
          WebkitTextFillColor: "transparent",
          backgroundClip:"text",
          animation:     "fadeUp 0.8s ease 0.2s both, shimmer 4s linear 1s infinite",
          textAlign:     "center",
        }}>
          RINKYA DESIGNS
        </div>

        <div style={{
          fontFamily:    "'Outfit', sans-serif",
          fontSize:      "clamp(10px, 2vw, 14px)",
          color:         "rgba(100,60,80,0.55)",
          letterSpacing: "0.25em",
          textTransform: "uppercase",
          animation:     "fadeUp 0.8s ease 0.5s both",
        }}>
          Where Art Meets Imagination
        </div>

        <div style={{
          display:"flex", gap:10, marginTop:8,
          animation:"fadeUp 0.8s ease 0.8s both",
        }}>
          {[0,1,2].map(i=>(
            <div key={i} style={{
              width:8, height:8, borderRadius:"50%",
              background:"#D4829A",
              animation:`dotPulse 1.4s ${i*0.2}s ease-in-out infinite`,
            }}/>
          ))}
        </div>
      </div>
    </div>
  );
}