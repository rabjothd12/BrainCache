import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useState } from "react";
import { useBlogs } from "../components/BlogContext";
import BlogCard from "../components/BlogCard";
import "./styles/dashboard.css";

function Dashboard() {
  const { blogs } = useBlogs();

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  if (!blogs || blogs.length === 0) {
    return (
      <div className="dashboard">
        <h1>Your Blogs</h1>
        <p className="empty-text">
          No blogs yet — start writing your first idea ✨
        </p>

        <Link to="/write" className="create-btn">
          + Create New Blog
        </Link>
      </div>
    );
  }

  // Categories
  const categories = [
    "All",
    ...new Set(
      blogs
        .map((blog) => blog.category)
        .filter((cat) => cat && cat.trim() !== "")
    ),
  ];

  // Filtering
  const filteredBlogs = blogs.filter((blog) => {
    const matchesCategory =
      selectedCategory === "All" ||
      (blog.category && blog.category === selectedCategory);

    const matchesSearch =
      (blog.title || "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      (blog.content || "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  // 🔥 Sort latest first
  const sortedBlogs = [...filteredBlogs].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  return (
    <motion.div
      className="dashboard"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="dashboard-header">
        <h1>Your Blogs</h1>

        <Link to="/write" className="create-btn">
          + Create New Blog
        </Link>
      </div>

      {categories.length > 1 && (
        <div className="filter-bar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={selectedCategory === cat ? "active" : ""}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search blogs..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {sortedBlogs.length > 0 ? (
        <div className="dashboard-grid">
          {sortedBlogs.map((blog) => (
            <BlogCard
              key={blog._id}
              id={blog._id}
              {...blog}
            />
          ))}
        </div>
      ) : (
        <p className="empty-text">
          No blogs match your search — try something else 🔍
        </p>
      )}
    </motion.div>
  );
}

export default Dashboard;