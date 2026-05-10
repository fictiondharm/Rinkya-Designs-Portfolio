import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

const WORLDS_LABEL = {
  illustrations: "Illustrations",
  branding: "Branding & Logos",
  "3d-spatial": "3D & Spatial",
  "motion-design": "Motion Design",
  "poster-design": "Poster Design",
  toolkit: "Toolkit",
  contact: "Contact Me",
};

export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => { fetchProjects(); }, []);

  const fetchProjects = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching projects:", error);
    } else {
      setProjects(data || []);
    }
    setLoading(false);
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return;

    const { error } = await supabase.from("projects").delete().eq("id", id);
    if (error) {
      alert("Failed to delete project");
    } else {
      setProjects(prev => prev.filter(p => p.id !== id));
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "80px 0", fontFamily: "'Outfit', sans-serif", color: "#D4829A", fontSize: 14 }}>
        Loading projects...
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32 }}>
        <div>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 32, fontWeight: 600, color: "#2D2A26", margin: 0 }}>
            All Projects
          </h1>
          <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 12, color: "rgba(45,42,38,0.5)", marginTop: 4 }}>
            {projects.length} project{projects.length !== 1 ? "s" : ""} total
          </p>
        </div>
        <Link to="/admin/upload" style={{
          textDecoration: "none", padding: "12px 28px",
          background: "#D4829A", color: "#FFFFFF",
          borderRadius: 100, fontFamily: "'Outfit', sans-serif",
          fontSize: 12, fontWeight: 600, letterSpacing: "0.05em",
          border: "none", cursor: "pointer", transition: "all 0.2s",
        }}>
          + Add New Project
        </Link>
      </div>

      {projects.length === 0 ? (
        <div style={{
          textAlign: "center", padding: "80px 0",
          fontFamily: "'Outfit', sans-serif",
          fontSize: 12, color: "rgba(45,42,38,0.3)",
          letterSpacing: "0.1em",
        }}>
          No projects yet. Click "Add New Project" to create one.
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 20 }}>
          {projects.map(project => (
            <div key={project.id} style={{
              background: "#FFFFFF", border: "1px solid rgba(0,0,0,0.08)",
              borderRadius: 12, overflow: "hidden", transition: "all 0.2s",
            }}>
              <div style={{
                width: "100%", aspectRatio: "16/10",
                background: "#F5F0E8", display: "flex",
                alignItems: "center", justifyContent: "center",
                position: "relative", overflow: "hidden",
              }}>
                {project.video_url ? (
                  <div style={{
                    position: "absolute", inset: 0,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    background: "linear-gradient(135deg, rgba(212,130,154,0.1), rgba(45,42,38,0.3))",
                  }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: "50%",
                      background: "rgba(255,255,255,0.8)",
                      display: "flex", alignItems: "center",
                      justifyContent: "center", fontSize: 12,
                    }}>▶</div>
                    <span style={{
                      position: "absolute", top: 8, right: 8,
                      background: "#D4829A", color: "white",
                      fontSize: 8, padding: "3px 8px",
                      borderRadius: 4, fontWeight: 700,
                      letterSpacing: "0.1em", fontFamily: "'Outfit', sans-serif",
                    }}>VIDEO</span>
                  </div>
                ) : project.image_url ? (
                  <img
                    src={project.image_url}
                    alt={project.title}
                    loading="lazy"
                    decoding="async"
                    style={{ width: "100%", height: "100%", objectFit: "cover", position: "absolute", inset: 0 }}
                  />
                ) : (
                  <span style={{ fontSize: 28, opacity: 0.4 }}>✦</span>
                )}
                {project.featured && (
                  <span style={{
                    position: "absolute", bottom: 8, left: 8,
                    background: "#D4829A", color: "white",
                    fontSize: 8, padding: "3px 10px",
                    borderRadius: 100, fontWeight: 700,
                    letterSpacing: "0.1em", fontFamily: "'Outfit', sans-serif",
                  }}>Featured</span>
                )}
              </div>

              <div style={{ padding: 16 }}>
                <div style={{
                  fontSize: 9, color: "#D4829A",
                  fontFamily: "'Outfit', sans-serif",
                  fontWeight: 600, letterSpacing: "0.15em",
                  textTransform: "uppercase", marginBottom: 4,
                }}>
                  {WORLDS_LABEL[project.world] || project.world}
                </div>

                <h3 style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: 18, fontWeight: 600,
                  color: "#2D2A26", margin: 0, lineHeight: 1.2,
                }}>
                  {project.title}
                </h3>

                {project.tags && project.tags.length > 0 && (
                  <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginTop: 8 }}>
                    {project.tags.slice(0, 3).map(tag => (
                      <span key={tag} style={{
                        fontSize: 8, color: "rgba(45,42,38,0.4)",
                        padding: "2px 8px", border: "1px solid rgba(0,0,0,0.06)",
                        borderRadius: 100, fontFamily: "'Outfit', sans-serif",
                      }}>{tag}</span>
                    ))}
                  </div>
                )}

                <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
                  <button
                    onClick={() => navigate(`/admin/edit/${project.id}`)}
                    style={{
                      flex: 1, padding: "8px 0", borderRadius: 8,
                      border: "1px solid rgba(0,0,0,0.08)",
                      background: "transparent", color: "#2D2A26",
                      fontSize: 11, fontWeight: 500,
                      fontFamily: "'Outfit', sans-serif",
                      cursor: "pointer", transition: "all 0.2s",
                    }}
                  >Edit</button>
                  <button
                    onClick={() => handleDelete(project.id, project.title)}
                    style={{
                      padding: "8px 16px", borderRadius: 8,
                      border: "1px solid rgba(200,50,50,0.2)",
                      background: "transparent", color: "#CC4444",
                      fontSize: 11, fontWeight: 500,
                      fontFamily: "'Outfit', sans-serif",
                      cursor: "pointer", transition: "all 0.2s",
                    }}
                  >Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
