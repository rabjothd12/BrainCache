import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useBlogs } from "../context/BlogContext";
import "./styles/createBlog.css";

function CreateBlog() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);

  const { addBlog } = useBlogs();
  const navigate = useNavigate();

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handlePublish = (e) => {
    e.preventDefault();

    addBlog({
      id: Date.now(),
      title,
      category,
      content,
      image,
      date: new Date().toLocaleDateString(),
    });

    navigate("/dashboard");
  };

  return (
    <div className="create-blog">
      <h1>Create New Blog</h1>

      <form onSubmit={handlePublish} className="blog-form">
        <label>Title</label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} required />

        <label>Category</label>
        <input
          type="text"
          placeholder="e.g. AI, Travel, Fitness"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        />

        <label>Cover Image</label>
        <input type="file" accept="image/*" onChange={handleImageUpload} />

        {image && <img src={image} alt="Preview" className="image-preview" />}

        <label>Content</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows="10"
          required
        />

        <button type="submit">Publish</button>
      </form>
    </div>
  );
}

export default CreateBlog;
