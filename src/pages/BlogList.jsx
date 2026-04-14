import { useEffect, useState } from "react";
import BlogCard from "../components/BlogCard";
import "./styles/BlogList.css";

function BlogList() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/blogs`)
      .then((res) => res.json())
      .then((data) => {
        setBlogs(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching blogs:", err);
        setLoading(false);
      });
  }, []);

  // 🔥 loading state
  if (loading) return <p>Loading blogs...</p>;

  // 💀 empty state
  if (!blogs || blogs.length === 0) {
    return (
      <div className="blog-list">
        <h1>All Blogs</h1>
        <p className="empty-text">
          No blogs available yet — be the first to write ✨
        </p>
      </div>
    );
  }

  return (
    <div className="blog-list">
      <h1>All Blogs</h1>

      <div className="blog-grid">
        {blogs.map((blog) => (
          <BlogCard
            key={blog._id}
            id={blog._id}
            title={blog.title}
            content={blog.content}
            date={
              blog.createdAt
                ? new Date(blog.createdAt).toLocaleDateString()
                : ""
            }
            image={blog.image}
          />
        ))}
      </div>
    </div>
  );
}

export default BlogList;