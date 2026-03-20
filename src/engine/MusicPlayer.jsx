import { useState, useEffect, useRef } from "react";

export default function MusicPlayer({ worldAccent }) {
  const [playing, setPlaying] = useState(false);
  const [started, setStarted] = useState(false);
  const audioRef = useRef(null);

  /* 
    We use a free royalty-free ambient track from Pixabay.
    She can replace this URL with any mp3 link later.
  */
  const MUSIC_URL =
  "https://cdn.pixabay.com/audio/2024/02/28/audio_3d2fc06e35.mp3";

  useEffect(() => {
    const audio = new Audio(MUSIC_URL);
    audio.loop   = true;
    audio.volume = 0.28;
    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.src = "";
    };
  }, []);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (!started) {
      audio.play().catch(() => {});
      setStarted(true);
      setPlaying(true);
      return;
    }

    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      audio.play().catch(() => {});
      setPlaying(true);
    }
  };

  const accent = worldAccent || "#C94B7B";

  return (
    <button
      onClick={toggle}
      title={playing ? "Pause Music" : "Play Ambient Music"}
      style={{
        width:          40,
        height:         40,
        borderRadius:   "50%",
        border:         `1px solid ${playing ? accent + "80" : "rgba(255,255,255,0.15)"}`,
        background:     playing ? `${accent}18` : "rgba(255,255,255,0.05)",
        backdropFilter: "blur(10px)",
        color:          playing ? accent : "rgba(255,255,255,0.55)",
        fontSize:       15,
        cursor:         "pointer",
        display:        "flex",
        alignItems:     "center",
        justifyContent: "center",
        gap:            2,
        transition:     "all 0.3s",
        padding:        0,
        flexShrink:     0,
      }}
    >
      {/* Animated bars when playing */}
      {playing ? (
        <div style={{
          display: "flex",
          alignItems: "flex-end",
          gap: 2,
          height: 14,
        }}>
          {[1, 0.5, 0.8, 0.3, 0.7].map((h, i) => (
            <div
              key={i}
              style={{
                width:           3,
                height:          14 * h,
                background:      accent,
                borderRadius:    1,
                transformOrigin: "bottom",
                animation:       `musicBar ${0.6 + i * 0.15}s ${i * 0.1}s ease-in-out infinite`,
              }}
            />
          ))}
        </div>
      ) : (
        /* Static icon when paused */
        <span style={{ fontSize: 16 }}>♪</span>
      )}
    </button>
  );
}