import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useState } from "react";
import { useBlogs } from "../components/BlogContext";
import BlogCard from "../components/BlogCard";
import "./styles/dashboard.css";

function Dashboard() {
  const { blogs } = useBlogs(); // ✅ fixed

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // 🛡️ prevent crash before data loads
  if (!blogs) return <p>Loading...</p>;

  console.log("DASHBOARD BLOGS:", blogs); // optional debug

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

      {filteredBlogs.length > 0 ? (
        <div className="dashboard-grid">
          {filteredBlogs.map((blog) => (
            <BlogCard
              key={blog._id}               // 🔥 FIXED
              id={blog._id}                // 🔥 FIXED
              {...blog}
            />
          ))}
        </div>
      ) : (
        <p className="empty-text">No blogs found.</p>
      )}
    </motion.div>
  );
}

export default Dashboard;