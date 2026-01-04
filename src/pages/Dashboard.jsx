import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useState } from "react";
import { useBlogs } from "../context/BlogContext";
import BlogCard from "../components/BlogCard";
import "./styles/dashboard.css";

function Dashboard() {
  const { blogs } = useBlogs();

  // 🔹 category + search state
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // 🔹 dynamic categories
  const categories = [
    "All",
    ...new Set(blogs.map((blog) => blog.category)),
  ];

  // 🔹 combined filtering (CATEGORY + SEARCH)
  const filteredBlogs = blogs
    .filter((blog) =>
      selectedCategory === "All"
        ? true
        : blog.category === selectedCategory
    )
    .filter((blog) =>
      blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.content.toLowerCase().includes(searchQuery.toLowerCase())
    );

  return (
    <motion.div
      className="dashboard"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* HEADER */}
      <div className="dashboard-header">
        <h1>Your Blogs</h1>

        <Link to="/write" className="create-btn">
          + Create New Blog
        </Link>
      </div>

      {/* CATEGORY FILTERS */}
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

      {/* 🔍 SEARCH BAR */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search blogs by title or content..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* BLOG GRID */}
      {filteredBlogs.length > 0 ? (
        <div className="dashboard-grid">
          {filteredBlogs.map((blog) => (
            <BlogCard key={blog.id} {...blog} />
          ))}
        </div>
      ) : (
        <p className="empty-text">No blogs found.</p>
      )}
    </motion.div>
  );
}

export default Dashboard;
