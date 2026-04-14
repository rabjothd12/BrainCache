import { useEffect, useState } from "react";
import BlogCard from "../components/BlogCard";
import "./styles/BlogList.css";

function BlogList() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/api/blogs")
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

  if (loading) return <p>Loading blogs...</p>;

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
            date={new Date(blog.createdAt).toLocaleDateString()}
            image={blog.image}
          />
        ))}
      </div>
    </div>
  );
}

export default BlogList;