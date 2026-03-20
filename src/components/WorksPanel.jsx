import { useState } from "react";
import works from "../data/works.json";

export default function WorksPanel({ zone, onClose }) {
  const [activeTag,    setActiveTag]    = useState("All");
  const [activeProject,setActiveProject]= useState(null);

  const zoneWorks = works.projects.filter(p => p.world === zone?.id);
  const allTags   = ["All", ...new Set(zoneWorks.flatMap(p => p.tags))];
  const filtered  = activeTag === "All"
    ? zoneWorks
    : zoneWorks.filter(p => p.tags.includes(activeTag));

  return (
    <>
      <style>{`
        @keyframes slideUp {
          from { transform: translateX(-50%) translateY(100%); }
          to   { transform: translateX(-50%) translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        .work-card:hover {
          transform: translateY(-5px) !important;
          border-color: ${zone?.accent}60 !important;
          background: #FFFFFF !important;
          box-shadow: 0 15px 35px rgba(0,0,0,0.06) !important;
        }
        .tag-btn:hover {
          background: ${zone?.accent}15 !important;
          border-color: ${zone?.accent}40 !important;
          color: ${zone?.accent} !important;
        }
        .close-btn:hover {
          background: rgba(0,0,0,0.05) !important;
          transform: rotate(90deg);
        }
      `}</style>

      {/* ── Main panel (Light, Airy Gallery Vibe) ── */}
      <div style={{
        position:       "fixed",
        bottom:          0,
        left:           "50%",
        transform:      "translateX(-50%)",
        width:          "min(960px, 96vw)",
        background:     "rgba(253, 251, 247, 0.98)", /* Warm Linen */
        backdropFilter: "blur(32px)",
        border:         `1px solid rgba(0,0,0,0.05)`,
        borderBottom:   "none",
        boxShadow:      "0 -10px 40px rgba(0,0,0,0.05)", /* Soft shadow */
        zIndex:          80,
        borderRadius:   "28px 28px 0 0", /* Softer curves */
        animation:      "slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        maxHeight:      "85vh",
        display:        "flex",
        flexDirection:  "column",
      }}>

        {/* Drag handle */}
        <div style={{
          display:        "flex",
          justifyContent: "center",
          padding:        "16px 0 0",
          cursor:          "pointer",
          flexShrink:      0,
        }} onClick={onClose}>
          <div style={{
            width:        48, height: 4,
            borderRadius: 4,
            background:   `rgba(0,0,0,0.1)`, /* Softened handle */
          }}/>
        </div>

        <div style={{ padding:"16px 40px 40px", overflowY:"auto", flex:1 }}>

          {/* Header */}
          <div style={{
            display:        "flex",
            alignItems:     "center",
            justifyContent: "space-between",
            marginBottom:    28,
            flexShrink:      0,
          }}>
            <div style={{ display:"flex", alignItems:"center", gap:16 }}>
              <span style={{ fontSize:34 }}>{zone?.emoji}</span>
              <div>
                <h2 style={{
                  fontFamily:    "'Cormorant Garamond', serif",
                  fontSize:       32, fontWeight:500,
                  color:          "#2D2A26", /* Deep Charcoal */
                  lineHeight:1,
                }}>{zone?.label}</h2>
                <p style={{
                  fontFamily:    "'Outfit', sans-serif",
                  fontSize:       10, letterSpacing:"0.25em",
                  color:          zone?.accent,
                  textTransform: "uppercase", marginTop:8,
                  fontWeight: 500
                }}>{zone?.service}</p>
              </div>
            </div>
            <button className="close-btn" onClick={onClose} style={{
              width:36, height:36, borderRadius:"50%",
              border:"1px solid rgba(0,0,0,0.08)",
              background:"transparent",
              color:"#2D2A26",
              fontSize:16, cursor:"pointer",
              display:"flex", alignItems:"center", justifyContent:"center",
              transition: "all 0.3s ease"
            }}>✕</button>
          </div>

          {/* Tags */}
          <div style={{
            display:"flex", gap:8,
            marginBottom:30, flexWrap:"wrap",
          }}>
            {allTags.map(tag=>(
              <button key={tag} className="tag-btn" onClick={()=>setActiveTag(tag)} style={{
                padding:       "8px 20px",
                border:        `1px solid ${activeTag===tag ? zone?.accent : "rgba(0,0,0,0.08)"}`,
                background:     activeTag===tag ? `${zone?.accent}15` : "transparent",
                color:          activeTag===tag ? zone?.accent : "rgba(45,42,38,0.5)",
                fontSize:9, letterSpacing:"0.18em",
                textTransform: "uppercase", cursor:"pointer",
                fontWeight:     600,
                fontFamily:    "'Outfit', sans-serif",
                transition:    "all 0.3s ease", borderRadius:100 /* Pill shaped tags */
              }}>{tag}</button>
            ))}
          </div>

          {/* Grid */}
          {filtered.length === 0 ? (
            <div style={{
              textAlign:"center", padding:"60px 0",
              color:"rgba(45,42,38,0.3)",
              fontFamily:"'Outfit', sans-serif",
              fontSize:12, letterSpacing:"0.2em",
              textTransform: "uppercase"
            }}>
              Collection coming soon ✦
            </div>
          ) : (
            <div style={{
              display:             "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
              gap:                  20,
            }}>
              {filtered.map(project=>(
                <div
                  key={project.id}
                  className="work-card"
                  onClick={()=>setActiveProject(project)}
                  style={{
                    background:  "rgba(255,255,255,0.5)", /* Glassy white */
                    border:      "1px solid rgba(0,0,0,0.04)",
                    padding:     "14px",
                    cursor:      "pointer",
                    transition:  "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
                    borderRadius: 12, /* Elegant rounding */
                  }}
                >
                  {/* Thumbnail */}
                  <div style={{
                    width:"100%", aspectRatio:"16/10",
                    background: `linear-gradient(135deg, ${zone?.accent}15, ${zone?.accent}05)`,
                    marginBottom:16, position:"relative",
                    overflow:"hidden", borderRadius:8,
                    display:"flex", alignItems:"center", justifyContent:"center",
                  }}>
                    {project.video ? (
                      /* Video thumbnail */
                      <div style={{
                        position:"absolute", inset:0,
                        display:"flex", alignItems:"center",
                        justifyContent:"center",
                        background:`linear-gradient(135deg, ${zone?.accent}20, rgba(45,42,38,0.4))`,
                      }}>
                        <div style={{
                          width:40, height:40, borderRadius:"50%",
                          background:"rgba(255,255,255,0.8)",
                          boxShadow:"0 4px 12px rgba(0,0,0,0.1)",
                          color: zone?.accent,
                          display:"flex", alignItems:"center",
                          justifyContent:"center", fontSize:14,
                          paddingLeft: 3 /* Optically center the play icon */
                        }}>▶</div>
                        <div style={{
                          position:"absolute", top:10, right:10,
                          background:zone?.accent,
                          color:"white", fontSize:7,
                          letterSpacing:"0.15em", padding:"4px 8px",
                          fontFamily:"'Outfit', sans-serif", fontWeight:700,
                          borderRadius: 4
                        }}>VIDEO</div>
                      </div>
                    ) : (project.image && project.image !== '/works/placeholder.jpg') ? (
                      /* Valid image – render actual image */
                      <img
                        src={project.image}
                        alt={project.title}
                        style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      /* Fallback to emoji */
                      <span style={{ fontSize: 32, opacity: 0.8 }}>{zone?.emoji}</span>
                    )}
                  </div>

                  {/* Tags row */}
                  <div style={{
                    display:"flex", gap:6,
                    flexWrap:"wrap", marginBottom:8,
                  }}>
                    {project.tags.slice(0,2).map(t=>(
                      <span key={t} style={{
                        fontSize:7, letterSpacing:"0.15em",
                        textTransform:"uppercase",
                        color:zone?.accent,
                        fontFamily:"'Outfit', sans-serif",
                        fontWeight:700,
                      }}>{t} </span>
                    ))}
                  </div>

                  {/* Title */}
                  <div style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize:18, fontWeight:600,
                    color:"#2D2A26", lineHeight:1.2,
                  }}>
                    {project.title}
                  </div>

                  {/* Description */}
                  <div style={{
                    fontFamily:"'Outfit', sans-serif",
                    fontSize:11, color:"rgba(45,42,38,0.5)",
                    marginTop:6, lineHeight:1.6,
                  }}>
                    {project.description}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Project lightbox (Ethereal Gallery Spotlight) ── */}
      {activeProject && (
        <div
          onClick={()=>setActiveProject(null)}
          style={{
            position:"fixed", inset:0, zIndex:90,
            background:"rgba(253, 251, 247, 0.85)", /* Light blur backdrop */
            backdropFilter:"blur(12px)",
            display:"flex", alignItems:"center",
            justifyContent:"center",
            animation:"fadeIn 0.4s ease forwards",
            padding:"24px",
          }}
        >
          <div
            onClick={e=>e.stopPropagation()}
            style={{
              width:"min(900px,94vw)",
              background:"#FFFFFF", /* Crisp white card */
              border:`1px solid rgba(0,0,0,0.05)`,
              borderRadius:16, overflow:"hidden",
              boxShadow: "0 30px 60px rgba(0,0,0,0.08)"
            }}
          >
            {/* Media */}
            <div style={{
              width:"100%", aspectRatio:"16/9",
              background:"#F5F0E8",
              display:"flex", alignItems:"center",
              justifyContent:"center", position:"relative",
            }}>
              {activeProject.video ? (
                <video
                  src={activeProject.video}
                  controls autoPlay
                  style={{ width:"100%", height:"100%", objectFit:"contain" }}
                />
              ) : (activeProject.image && activeProject.image !== '/works/placeholder.jpg') ? (
                <img
                  src={activeProject.image}
                  alt={activeProject.title}
                  style={{ width:"100%", height:"100%", objectFit:"contain" }}
                />
              ) : (
                <div style={{
                  width:"100%", height:"100%",
                  background:`linear-gradient(135deg, ${zone?.accent}15, ${zone?.accent}05)`,
                  display:"flex", alignItems:"center",
                  justifyContent:"center", fontSize:80,
                }}>
                  {zone?.emoji}
                </div>
              )}
            </div>

            {/* Info */}
            <div style={{ padding:"32px 40px 40px" }}>
              <div style={{
                display:"flex", alignItems:"flex-start",
                justifyContent:"space-between", marginBottom:16,
              }}>
                <div>
                  <h3 style={{
                    fontFamily:"'Cormorant Garamond', serif",
                    fontSize:32, fontWeight:500,
                    color:"#2D2A26", lineHeight:1.1,
                    marginBottom:12,
                  }}>
                    {activeProject.title}
                  </h3>
                  <div style={{
                    display:"flex", gap:8, flexWrap:"wrap",
                  }}>
                    {activeProject.tags.map(t=>(
                      <span key={t} style={{
                        padding:"4px 12px",
                        border:`1px solid ${zone?.accent}30`,
                        background:`${zone?.accent}08`,
                        color:zone?.accent,
                        fontSize:9, letterSpacing:"0.18em",
                        textTransform:"uppercase", fontWeight: 600,
                        fontFamily:"'Outfit', sans-serif",
                        borderRadius:100,
                      }}>{t}</span>
                    ))}
                  </div>
                </div>
                <button className="close-btn"
                  onClick={()=>setActiveProject(null)}
                  style={{
                    width:36, height:36, borderRadius:"50%",
                    border:"1px solid rgba(0,0,0,0.08)",
                    background:"transparent",
                    color:"#2D2A26",
                    fontSize:16, cursor:"pointer",
                    display:"flex", alignItems:"center",
                    justifyContent:"center", flexShrink:0,
                    transition: "all 0.3s ease"
                  }}
                >✕</button>
              </div>
              <p style={{
                fontFamily:"'Outfit', sans-serif",
                fontSize:14, color:"rgba(45,42,38,0.6)",
                lineHeight:1.8, maxWidth: "700px"
              }}>
                {activeProject.description}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}