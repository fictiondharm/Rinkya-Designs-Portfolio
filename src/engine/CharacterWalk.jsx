export default function CharacterWalk({ walking = false, facing = "right" }) {
  return (
    <div style={{
      width:           96,
      height:          180,
      transform:       `scaleX(${facing === "left" ? -1 : 1})`,
      transformOrigin: "center bottom",
      filter:          "drop-shadow(0 12px 32px rgba(0,0,0,0.55))",
      transition:      "transform 0.2s",
      flexShrink:       0,
    }}>
      <svg
        viewBox="0 0 96 180"
        style={{ width: "100%", height: "100%", overflow: "visible" }}
      >
        <defs>
          <style>{`
            /* Walk cycle */
            .walk .leg-l { transform-box:fill-box; transform-origin:50% 3%; animation:walkLegL 0.42s ease-in-out infinite; }
            .walk .leg-r { transform-box:fill-box; transform-origin:50% 3%; animation:walkLegR 0.42s ease-in-out infinite; }
            .walk .arm-l { transform-box:fill-box; transform-origin:50% 6%; animation:walkArmL 0.42s ease-in-out infinite; }
            .walk .arm-r { transform-box:fill-box; transform-origin:50% 6%; animation:walkArmR 0.42s ease-in-out infinite; }
            .walk .body  { animation:walkBob 0.42s ease-in-out infinite; }

            @keyframes walkLegL { 0%,100%{transform:rotate(0)}  25%{transform:rotate(26deg)}  75%{transform:rotate(-26deg)} }
            @keyframes walkLegR { 0%,100%{transform:rotate(0)}  25%{transform:rotate(-26deg)} 75%{transform:rotate(26deg)}  }
            @keyframes walkArmL { 0%,100%{transform:rotate(0)}  25%{transform:rotate(-18deg)} 75%{transform:rotate(18deg)}  }
            @keyframes walkArmR { 0%,100%{transform:rotate(0)}  25%{transform:rotate(18deg)}  75%{transform:rotate(-18deg)} }
            @keyframes walkBob  { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-3px)} }

            /* Idle breathe */
            .idle .body { animation:idleBreathe 3.8s ease-in-out infinite; }
            @keyframes idleBreathe { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-5px)} }
          `}</style>
        </defs>

        <g className={walking ? "walk" : "idle"}>

          {/* ── Back leg ── */}
          <g className="leg-r">
            <rect x="57" y="118" width="14" height="40" rx="6" fill="#F0A898" />
            <rect x="54" y="152" width="21" height="9"  rx="3" fill="#241208" />
          </g>

          <g className="body">

            {/* ── Back arm ── */}
            <g className="arm-r">
              <path d="M72 80 Q87 98 84 120"
                stroke="#F0A898" strokeWidth="11"
                strokeLinecap="round" fill="none" />
              <circle cx="84" cy="121" r="5" fill="#F0A898" />
            </g>

            {/* ── Body ── */}
            <path
              d="M22 76 Q34 70 48 72 Q62 70 74 76 L72 126 Q60 134 48 134 Q36 134 24 126Z"
              fill="#C94B7B"
            />
            {/* Outfit dots */}
            {[[38,100],[48,94],[58,100],[43,114],[53,114]].map(([cx,cy],i)=>(
              <circle key={i} cx={cx} cy={cy} r="2" fill="rgba(255,255,255,0.18)" />
            ))}
            {/* Collar */}
            <path d="M41 72 L48 83 L55 72"
              stroke="rgba(255,255,255,0.38)" strokeWidth="1.4"
              strokeLinecap="round" fill="none" />

            {/* ── Front arm with palette ── */}
            <g className="arm-l">
              <path d="M24 80 Q9 98 12 120"
                stroke="#F0A898" strokeWidth="11"
                strokeLinecap="round" fill="none" />
              <circle cx="12" cy="121" r="5" fill="#F0A898" />
              {/* Palette */}
              <g transform="rotate(-18,10,123)">
                <ellipse cx="10" cy="123" rx="9" ry="7" fill="#C8900C" />
                <circle cx="6"  cy="120" r="2"   fill="#C94B7B" />
                <circle cx="11" cy="117" r="1.8" fill="#3D9B8A" />
                <circle cx="16" cy="120" r="1.8" fill="#4878C0" />
                <circle cx="14" cy="125" r="1.5" fill="#E8A838" />
              </g>
            </g>

            {/* ── Neck ── */}
            <rect x="42" y="62" width="12" height="14" rx="3.5" fill="#F0A898" />

            {/* ── Head ── */}
            <ellipse cx="48" cy="44" rx="23" ry="23" fill="#F5ADA0" />

            {/* ── Hair back strands ── */}
            <path d="M26 50 Q28 78 34 88 Q30 72 30 58 Q28 54 26 50Z" fill="#231008" />
            <path d="M70 50 Q68 78 62 88 Q66 72 66 58 Q68 54 70 50Z" fill="#231008" />

            {/* ── Hair top ── */}
            <ellipse cx="48" cy="28" rx="25" ry="11" fill="#231008" />
            <path d="M23 33 Q27 18 48 16 Q69 18 73 33 Q65 24 48 22 Q31 24 23 33Z"
              fill="#321808" />

            {/* ── Beret ── */}
            <ellipse cx="48" cy="22" rx="27" ry="10" fill="#C94B7B" />
            <ellipse cx="48" cy="18" rx="25" ry="8"  fill="#D95A88" />
            <circle  cx="48" cy="14" r="5"           fill="#A83565" />
            <circle  cx="48" cy="14" r="3"           fill="#C94B7B" />

            {/* ── Eyes ── */}
            <ellipse cx="38" cy="44" rx="5.5" ry="6" fill="white" />
            <ellipse cx="58" cy="44" rx="5.5" ry="6" fill="white" />
            <circle  cx="39.5" cy="45.5" r="3.8" fill="#180808" />
            <circle  cx="59.5" cy="45.5" r="3.8" fill="#180808" />
            <circle  cx="40.5" cy="44"   r="1.4" fill="white"   />
            <circle  cx="60.5" cy="44"   r="1.4" fill="white"   />
            {/* Lashes */}
            <path d="M33 38 Q38 34 44 38"
              stroke="#180808" strokeWidth="1.3"
              strokeLinecap="round" fill="none" />
            <path d="M52 38 Q58 34 63 38"
              stroke="#180808" strokeWidth="1.3"
              strokeLinecap="round" fill="none" />

            {/* ── Nose ── */}
            <path d="M46 52 Q48 56 50 52"
              stroke="#DD8878" strokeWidth="1.2"
              strokeLinecap="round" fill="none" />

            {/* ── Smile ── */}
            <path d="M40 61 Q48 69 56 61"
              stroke="#CC6060" strokeWidth="1.7"
              strokeLinecap="round" fill="none" />

            {/* ── Cheeks ── */}
            <ellipse cx="32" cy="51" rx="6" ry="4" fill="rgba(215,105,95,0.22)" />
            <ellipse cx="64" cy="51" rx="6" ry="4" fill="rgba(215,105,95,0.22)" />

            {/* ── Earrings ── */}
            <circle cx="25" cy="46" r="2.5" fill="#D4A843" />
            <circle cx="71" cy="46" r="2.5" fill="#D4A843" />

          </g>{/* end .body */}

          {/* ── Front leg ── */}
          <g className="leg-l">
            <rect x="25" y="118" width="14" height="40" rx="6" fill="#FABCB0" />
            <rect x="22" y="152" width="21" height="9"  rx="3" fill="#2A1408" />
          </g>

        </g>
      </svg>
    </div>
  );
}