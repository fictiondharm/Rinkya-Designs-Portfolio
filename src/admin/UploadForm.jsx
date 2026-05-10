import { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../lib/supabase";

const WORLDS = [
  { id: "illustrations", label: "Illustrations" },
  { id: "branding", label: "Branding & Logos" },
  { id: "3d-spatial", label: "3D & Spatial" },
  { id: "motion-design", label: "Motion Design" },
  { id: "poster-design", label: "Poster Design" },
  { id: "toolkit", label: "Toolkit" },
  { id: "contact", label: "Contact Me" },
];

const IMAGE_MAX_MB = 10;
const VIDEO_MAX_MB = 15;

const WORLD_TAGS = {
  illustrations: ["Illustration", "Sketch", "Character Design", "Digital Art"],
  branding: ["Branding", "Logo", "Sticker", "Identity"],
  "3d-spatial": ["3D", "Concept", "NFT", "Series", "Modeling"],
  "motion-design": ["Video", "Motion", "AI", "Editing"],
  "poster-design": ["Poster", "Print", "Series", "Design"],
  toolkit: ["Design", "Adobe", "3D", "Modeling", "Video", "Color", "UI", "AI", "Motion", "Mobile"],
  contact: [],
};

export default function UploadForm() {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [world, setWorld] = useState("illustrations");
  const [selectedTags, setSelectedTags] = useState([]);
  const [existingTags, setExistingTags] = useState([]);
  const [newTagInput, setNewTagInput] = useState("");
  const [featured, setFeatured] = useState(false);

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [existingImageUrl, setExistingImageUrl] = useState("");

  const [videoFile, setVideoFile] = useState(null);
  const [videoPreview, setVideoPreview] = useState("");
  const [existingVideoUrl, setExistingVideoUrl] = useState("");

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEditing);
  const [error, setError] = useState("");

  const fetchExistingTags = useCallback(async () => {
    const defaults = WORLD_TAGS[world] || [];
    const { data } = await supabase
      .from("projects")
      .select("tags")
      .eq("world", world);

    const dbTags = data ? [...new Set(data.flatMap(p => p.tags || []))] : [];
    const merged = [...new Set([...defaults, ...dbTags])].sort();
    setExistingTags(merged);
  }, [world]);

  useEffect(() => {
    if (isEditing) fetchProject();
  }, [id]);

  useEffect(() => {
    if (!isEditing) {
      setSelectedTags([]);
    }
    fetchExistingTags();
  }, [world, fetchExistingTags, isEditing]);

  const fetchProject = async () => {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) {
      setError("Failed to load project");
      setFetching(false);
      return;
    }

    setTitle(data.title || "");
    setDescription(data.description || "");
    setWorld(data.world || "illustrations");
    setSelectedTags(data.tags || []);
    setFeatured(data.featured || false);
    setExistingImageUrl(data.image_url || "");
    setImagePreview(data.image_url || "");
    setExistingVideoUrl(data.video_url || "");
    setVideoPreview(data.video_url || "");
    setFetching(false);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > IMAGE_MAX_MB * 1024 * 1024) {
      alert(
        `Image is too large (${(file.size / 1024 / 1024).toFixed(1)}MB). Maximum is ${IMAGE_MAX_MB}MB.\n\nUse https://www.freeconvert.com/ to compress it first, then upload.`
      );
      e.target.value = "";
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > VIDEO_MAX_MB * 1024 * 1024) {
      alert(
        `Video is too large (${(file.size / 1024 / 1024).toFixed(1)}MB). Maximum is ${VIDEO_MAX_MB}MB.\n\nUse https://www.freeconvert.com/ to compress it first, then upload.`
      );
      e.target.value = "";
      return;
    }

    setVideoFile(file);
    setVideoPreview(URL.createObjectURL(file));
  };

  const toggleTag = (tag) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleAddNewTag = () => {
    const tag = newTagInput.trim();
    if (!tag) return;

    if (!existingTags.includes(tag)) {
      setExistingTags(prev => [...prev, tag].sort());
    }
    if (!selectedTags.includes(tag)) {
      setSelectedTags(prev => [...prev, tag]);
    }
    setNewTagInput("");
  };

  const handleTagInputKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddNewTag();
    }
  };

  const uploadFile = async (file) => {
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("works")
      .upload(fileName, file);

    if (uploadError) {
      console.error("Storage upload error:", uploadError);
      setError("Image upload failed: " + uploadError.message);
      return null;
    }

    const { data: urlData } = supabase.storage
      .from("works")
      .getPublicUrl(fileName);

    return urlData.publicUrl;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      let imageUrl = existingImageUrl;
      let videoUrl = existingVideoUrl;

      if (imageFile) {
        const url = await uploadFile(imageFile);
        if (url) imageUrl = url;
      }

      if (videoFile) {
        const url = await uploadFile(videoFile);
        if (url) videoUrl = url;
      }

      const projectData = {
        title,
        description,
        world,
        tags: selectedTags,
        image_url: imageUrl || null,
        video_url: videoUrl || null,
        featured,
      };

      if (isEditing) {
        const { data: upData, error: updateError } = await supabase.rpc("update_project", {
          p_id: id,
          p_title: title,
          p_description: description,
          p_world: world,
          p_tags: selectedTags.length > 0 ? selectedTags : [],
          p_image_url: imageUrl || "",
          p_video_url: videoUrl || "",
          p_featured: featured,
        });

        if (updateError) {
          console.error("Supabase RPC update error:", updateError);
          throw new Error(updateError.message);
        }
      } else {
        const { data: inData, error: insertError } = await supabase.rpc("insert_project", {
          p_title: title,
          p_description: description,
          p_world: world,
          p_tags: selectedTags.length > 0 ? selectedTags : [],
          p_image_url: imageUrl || "",
          p_video_url: videoUrl || "",
          p_featured: featured,
        });

        if (insertError) {
          console.error("Supabase RPC insert error:", insertError);
          console.error("Full error JSON:", JSON.stringify(insertError, null, 2));
          // Also try raw fetch for debugging
          const url = import.meta.env.VITE_SUPABASE_URL;
          const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
          const rawResp = await fetch(`${url}/rest/v1/rpc/insert_project`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "apikey": key,
              "Authorization": `Bearer ${key}`,
            },
            body: JSON.stringify({
              p_title: title,
              p_description: description,
              p_world: world,
              p_tags: selectedTags,
              p_image_url: imageUrl || "",
              p_video_url: videoUrl || "",
              p_featured: featured,
            }),
          });
          const rawText = await rawResp.text();
          console.error("Raw fetch response status:", rawResp.status);
          console.error("Raw fetch response body:", rawText);
          throw new Error(insertError.message);
        }
      }

      navigate("/admin/dashboard");
    } catch (err) {
      console.error("Full error:", err);
      setError(err.message || "Unknown error occurred");
    }

    setLoading(false);
  };

  const handleDelete = async () => {
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return;

    const { error } = await supabase.from("projects").delete().eq("id", id);
    if (error) {
      setError("Failed to delete project");
    } else {
      navigate("/admin/dashboard");
    }
  };

  const fieldLabel = {
    fontFamily: "'Outfit', sans-serif",
    fontSize: 11, fontWeight: 600,
    color: "#2D2A26", marginBottom: 6,
    letterSpacing: "0.05em", display: "block",
  };

  const fieldInput = {
    width: "100%",
    padding: "12px 16px",
    border: "1px solid rgba(0,0,0,0.08)",
    borderRadius: 8,
    fontFamily: "'Outfit', sans-serif",
    fontSize: 14,
    color: "#2D2A26",
    background: "#FFFFFF",
    outline: "none",
    transition: "border-color 0.2s",
    boxSizing: "border-box",
  };

  if (fetching) {
    return (
      <div style={{ textAlign: "center", padding: "80px 0", fontFamily: "'Outfit', sans-serif", color: "#D4829A", fontSize: 14 }}>
        Loading project...
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 640, margin: "0 auto" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32 }}>
        <div>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 32, fontWeight: 600, color: "#2D2A26", margin: 0 }}>
            {isEditing ? "Edit Project" : "New Project"}
          </h1>
          <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 12, color: "rgba(45,42,38,0.5)", marginTop: 4 }}>
            {isEditing ? "Update the project details below" : "Fill in the details to add a new project"}
          </p>
        </div>
        {isEditing && (
          <button onClick={handleDelete} style={{
            padding: "10px 24px", borderRadius: 8,
            border: "1px solid rgba(200,50,50,0.2)",
            background: "transparent", color: "#CC4444",
            fontSize: 11, fontWeight: 600,
            fontFamily: "'Outfit', sans-serif",
            cursor: "pointer",
          }}>Delete Project</button>
        )}
      </div>

      <form onSubmit={handleSubmit} style={{
        background: "#FFFFFF",
        border: "1px solid rgba(0,0,0,0.08)",
        borderRadius: 12,
        padding: 32,
        display: "flex", flexDirection: "column", gap: 22,
      }}>
        {error && (
          <div style={{
            fontFamily: "'Outfit', sans-serif", fontSize: 12, color: "#CC4444",
            padding: "10px 14px", background: "rgba(200,50,50,0.05)",
            borderRadius: 8, border: "1px solid rgba(200,50,50,0.1)",
          }}>
            {error}
          </div>
        )}

        {/* Title */}
        <div>
          <label style={fieldLabel}>Title</label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Project title"
            required
            style={fieldInput}
          />
        </div>

        {/* Description */}
        <div>
          <label style={fieldLabel}>Description</label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Describe the project..."
            rows={4}
            style={{ ...fieldInput, resize: "vertical", minHeight: 100 }}
          />
        </div>

        {/* World */}
        <div>
          <label style={fieldLabel}>World / Zone</label>
          <select
            value={world}
            onChange={e => setWorld(e.target.value)}
            style={fieldInput}
          >
            {WORLDS.map(w => (
              <option key={w.id} value={w.id}>{w.label}</option>
            ))}
          </select>
        </div>

        {/* Tags */}
        <div>
          <label style={fieldLabel}>Tags</label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>
            {existingTags.map(tag => (
              <button
                key={tag}
                type="button"
                onClick={() => toggleTag(tag)}
                style={{
                  padding: "6px 14px",
                  borderRadius: 100,
                  border: "1px solid",
                  borderColor: selectedTags.includes(tag) ? "#D4829A" : "rgba(0,0,0,0.1)",
                  background: selectedTags.includes(tag) ? "rgba(212,130,154,0.12)" : "transparent",
                  color: selectedTags.includes(tag) ? "#D4829A" : "rgba(45,42,38,0.6)",
                  fontSize: 11,
                  fontFamily: "'Outfit', sans-serif",
                  fontWeight: 500,
                  cursor: "pointer",
                  transition: "all 0.15s",
                }}
              >
                {tag}
                {selectedTags.includes(tag) && (
                  <span style={{ marginLeft: 4 }}>✕</span>
                )}
              </button>
            ))}
          </div>

          {/* Add new tag */}
          <div style={{ display: "flex", gap: 8 }}>
            <input
              type="text"
              value={newTagInput}
              onChange={e => setNewTagInput(e.target.value)}
              onKeyDown={handleTagInputKeyDown}
              placeholder="Type a new tag and press Enter or Add"
              style={{
                ...fieldInput,
                flex: 1,
                padding: "10px 14px",
                fontSize: 13,
              }}
            />
            <button
              type="button"
              onClick={handleAddNewTag}
              disabled={!newTagInput.trim()}
              style={{
                padding: "10px 20px",
                borderRadius: 8,
                border: "none",
                background: newTagInput.trim() ? "#D4829A" : "rgba(0,0,0,0.05)",
                color: newTagInput.trim() ? "#FFFFFF" : "rgba(0,0,0,0.25)",
                fontSize: 12,
                fontFamily: "'Outfit', sans-serif",
                fontWeight: 500,
                cursor: newTagInput.trim() ? "pointer" : "default",
                transition: "all 0.2s",
                whiteSpace: "nowrap",
              }}
            >
              + Add
            </button>
          </div>
        </div>

        {/* Image Upload */}
        <div>
          <label style={fieldLabel}>Image (max {IMAGE_MAX_MB}MB)</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            style={{
              width: "100%",
              padding: "10px 0",
              fontFamily: "'Outfit', sans-serif",
              fontSize: 13,
              color: "#2D2A26",
            }}
          />
          {imagePreview && (
            <div style={{ marginTop: 10 }}>
              <img
                src={imagePreview}
                alt="Preview"
                style={{
                  width: "100%", maxWidth: 320,
                  borderRadius: 8,
                  border: "1px solid rgba(0,0,0,0.08)",
                  objectFit: "cover",
                  maxHeight: 200,
                }}
              />
            </div>
          )}
        </div>

        {/* Video Upload */}
        <div>
          <label style={fieldLabel}>Video (max {VIDEO_MAX_MB}MB)</label>
          <input
            type="file"
            accept="video/*"
            onChange={handleVideoChange}
            style={{
              width: "100%",
              padding: "10px 0",
              fontFamily: "'Outfit', sans-serif",
              fontSize: 13,
              color: "#2D2A26",
            }}
          />
          {videoPreview && (
            <div style={{ marginTop: 10 }}>
              {videoFile ? (
                <video
                  src={videoPreview}
                  controls
                  style={{
                    width: "100%", maxWidth: 320,
                    borderRadius: 8,
                    border: "1px solid rgba(0,0,0,0.08)",
                    maxHeight: 200,
                  }}
                />
              ) : (
                <div style={{
                  fontFamily: "'Outfit', sans-serif",
                  fontSize: 12, color: "rgba(45,42,38,0.5)",
                  padding: "12px 16px",
                  background: "#F5F0E8",
                  borderRadius: 8,
                  border: "1px solid rgba(0,0,0,0.06)",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}>
                  Current video: {existingVideoUrl.split("/").pop()}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Featured */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <input
            type="checkbox"
            id="featured"
            checked={featured}
            onChange={e => setFeatured(e.target.checked)}
            style={{ width: 18, height: 18, cursor: "pointer" }}
          />
          <label htmlFor="featured" style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: 13, fontWeight: 500,
            color: "#2D2A26", cursor: "pointer",
          }}>
            Featured project
          </label>
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
          <button
            type="submit"
            disabled={loading}
            style={{
              flex: 1,
              padding: "14px 0",
              background: loading ? "rgba(212,130,154,0.5)" : "#D4829A",
              color: "#FFFFFF",
              border: "none",
              borderRadius: 8,
              fontFamily: "'Outfit', sans-serif",
              fontSize: 13, fontWeight: 600,
              cursor: loading ? "not-allowed" : "pointer",
              transition: "all 0.2s",
              letterSpacing: "0.05em",
            }}
          >
            {loading ? "Saving..." : (isEditing ? "Save Changes" : "Create Project")}
          </button>
          <button
            type="button"
            onClick={() => navigate("/admin/dashboard")}
            style={{
              padding: "14px 28px",
              background: "transparent",
              color: "#2D2A26",
              border: "1px solid rgba(0,0,0,0.08)",
              borderRadius: 8,
              fontFamily: "'Outfit', sans-serif",
              fontSize: 13, fontWeight: 500,
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
