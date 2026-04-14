import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useBlogs } from "../components/BlogContext";
import "./styles/readBlog.css";

function ReadBlog() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { blogs, deleteBlog } = useBlogs();

  const blog = blogs.find((b) => b._id === id);

  if (!blog) {
    return (
      <div className="read-blog">
        <h2>Blog not found</h2>
        <Link to="/dashboard">← Back to Dashboard</Link>
      </div>
    );
  }

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this blog?"
    );

    if (confirmDelete) {
      await deleteBlog(blog._id); // 🔥 FIXED (_id instead of id)
      navigate("/dashboard");     // 🔥 redirect after delete
    }
  };

  return (
    <motion.div
      className="read-blog"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="read-actions">
        <Link to="/dashboard" className="back-link">
          ← Back
        </Link>

        <button className="delete-btn" onClick={handleDelete}>
          Delete
        </button>
      </div>

      {blog.image && (
        <img
          src={blog.image}
          alt={blog.title}
          className="read-blog-img"
        />
      )}

      <h1 className="read-title">{blog.title}</h1>

      {/* optional: backend doesn't send "date", so fallback */}
      <p className="read-date">
        {blog.createdAt
          ? new Date(blog.createdAt).toLocaleDateString()
          : ""}
      </p>

      <div className="read-content">{blog.content}</div>
    </motion.div>
  );
}

export default ReadBlog;