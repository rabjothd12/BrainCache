import { createContext, useContext, useEffect, useState } from "react";

const BlogContext = createContext();

export const BlogProvider = ({ children }) => {
  const [blogs, setBlogs] = useState([]);

  const token = localStorage.getItem("token");

  // 🔥 FETCH BLOGS (SOURCE OF TRUTH)
  const fetchBlogs = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/blogs");

      const data = await res.json();
      setBlogs(data);
    } catch (error) {
      console.error("Error fetching blogs:", error);
    }
  };

  // 🔥 ADD BLOG (THEN REFETCH)
  const addBlog = async (blog) => {
    try {
      const res = await fetch("http://localhost:5000/api/blogs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(blog),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      // 🔥 DON'T trust local state → refetch
      fetchBlogs();

    } catch (error) {
      console.error("Error adding blog:", error);
    }
  };

  // 🔥 DELETE BLOG (THEN REFETCH)
  const deleteBlog = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/blogs/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // 🔥 ALWAYS sync with backend
      fetchBlogs();

    } catch (error) {
      console.error("Error deleting blog:", error);
    }
  };

  // 🔥 FETCH ON LOAD
  useEffect(() => {
    fetchBlogs();
  }, []);

  return (
    <BlogContext.Provider value={{ blogs, addBlog, deleteBlog }}>
      {children}
    </BlogContext.Provider>
  );
};

export const useBlogs = () => useContext(BlogContext);