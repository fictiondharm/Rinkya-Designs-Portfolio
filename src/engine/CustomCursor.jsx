import { useState, useEffect } from "react";

export default function CustomCursor({ worldAccent }) {
  const [pos, setPos]         = useState({ x: -100, y: -100 });
  const [ring, setRing]       = useState({ x: -100, y: -100 });
  const [clicking, setClicking] = useState(false);

  useEffect(() => {
    let ringX = -100, ringY = -100;
    let animId;

    const onMove = (e) => {
      setPos({ x: e.clientX, y: e.clientY });
    };

    const onDown = () => setClicking(true);
    const onUp   = () => setClicking(false);

    /* Ring follows with smooth lag */
    const animate = () => {
      setRing(prev => ({
        x: prev.x + (pos.x - prev.x) * 0.12,
        y: prev.y + (pos.y - prev.y) * 0.12,
      }));
      animId = requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup",   onUp);
    animId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup",   onUp);
      cancelAnimationFrame(animId);
    };
  }, [pos.x, pos.y]);

  const color = worldAccent || "#C94B7B";

  return (
    <>
      {/* Dot */}
      <div style={{
        position:      "fixed",
        left:          pos.x,
        top:           pos.y,
        width:         clicking ? 6 : 9,
        height:        clicking ? 6 : 9,
        borderRadius:  "50%",
        background:    color,
        transform:     "translate(-50%, -50%)",
        pointerEvents: "none",
        zIndex:        9999,
        transition:    "width 0.15s, height 0.15s, background 0.4s",
        mixBlendMode:  "difference",
      }} />

      {/* Ring */}
      <div style={{
        position:      "fixed",
        left:          ring.x,
        top:           ring.y,
        width:         clicking ? 22 : 36,
        height:        clicking ? 22 : 36,
        borderRadius:  "50%",
        border:        `1.5px solid ${color}70`,
        transform:     "translate(-50%, -50%)",
        pointerEvents: "none",
        zIndex:        9998,
        transition:    "width 0.2s, height 0.2s, border-color 0.4s",
      }} />
    </>
  );
}