import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/createBlog.css";

function CreateBlog() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);

  const [draftId, setDraftId] = useState(null);
  const [ideas, setIdeas] = useState("");
  const [suggestion, setSuggestion] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    if (!title && !content && !category && !image) return;

    const timer = setTimeout(() => {
      autoSaveDraft();
    }, 2000);

    return () => clearTimeout(timer);
  }, [title, content, category, image]);

  const autoSaveDraft = async () => {
    try {
      let url = `${import.meta.env.VITE_API_URL}/api/blogs`;
      let method = "POST";

      if (draftId) {
        url = `${import.meta.env.VITE_API_URL}/api/blogs/${draftId}`;
        method = "PUT";
      }

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          category,
          content,
          image,
          isDraft: true,
        }),
      });

      const data = await res.json();

      if (!draftId) {
        setDraftId(data._id);
      }

      console.log("Auto-saved draft");
    } catch (error) {
      console.error("Auto-save failed", error);
    }
  };

  const generateIdea = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/ai/idea`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            topic: title || category || "technology",
          }),
        }
      );

      const data = await res.json();
      setIdeas(data.idea);
    } catch (error) {
      console.error("AI error:", error);
    }
  };

  const useIdea = () => {
    if (!ideas) return;

    const lines = ideas.split("\n").filter(Boolean);

    setTitle(lines[0] || "");
    setContent(""); 
  };

  const getSuggestion = async () => {
    if (!content && !title) return;
    if (loading) return;

    setLoading(true);

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/ai/autocomplete`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ content, title }),
        }
      );

      const data = await res.json();
      setSuggestion(data.text);
    } catch (error) {
      console.error("Autocomplete error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (title && !content) {
      getSuggestion();
    }
  }, [title]);

  const addSuggestion = () => {
    setContent((prev) => (prev ? prev + " " : "") + suggestion);
    setSuggestion("");
  };

  const handlePublish = async (e) => {
    e.preventDefault();

    try {
      await fetch(
        `${import.meta.env.VITE_API_URL}/api/blogs/${draftId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title,
            category,
            content,
            image,
            isDraft: false,
          }),
        }
      );

      navigate("/dashboard");
    } catch (error) {
      console.error("Publish failed", error);
    }
  };

  return (
    <div className="create-blog">
      <h1>Create Blog</h1>

      <form onSubmit={handlePublish} className="blog-form">
        <label>Title</label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} />

        <label>Category</label>
        <input value={category} onChange={(e) => setCategory(e.target.value)} />

        <label>Cover Image</label>
        <input type="file" onChange={handleImageUpload} />
        {image && <img src={image} alt="preview" />}

        <button type="button" onClick={generateIdea}>
          💡 Generate Ideas
        </button>

        {ideas && (
          <div className="ai-box">
            <h3>AI Ideas</h3>
            <pre>{ideas}</pre>
            <button type="button" onClick={useIdea}>
              ✨ Use Idea
            </button>
          </div>
        )}

        <label>Content</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <button type="button" onClick={getSuggestion}>
          {loading ? "Generating..." : "✨ Continue Writing"}
        </button>

        {suggestion && (
          <div className="ai-box">
            <h3>AI Continuation</h3>
            <p>{suggestion}</p>
            <button type="button" onClick={addSuggestion}>
              ➕ Add to Blog
            </button>
          </div>
        )}

        <button type="submit">Publish</button>
      </form>
    </div>
  );
}

export default CreateBlog;