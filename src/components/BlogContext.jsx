import { createContext, useContext, useEffect, useState } from "react";

const BlogContext = createContext();

export const BlogProvider = ({ children }) => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  const API = import.meta.env.VITE_API_URL;


  const fetchBlogs = async () => {
    try {
      const res = await fetch(`${API}/api/blogs`);
      const data = await res.json();

      setBlogs(data);
    } catch (error) {
      console.error("Error fetching blogs:", error);
    } finally {
      setLoading(false);
    }
  };


  const addBlog = async (blog) => {
    try {
      const res = await fetch(`${API}/api/blogs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(blog),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      fetchBlogs(); 
    } catch (error) {
      console.error("Error adding blog:", error);
    }
  };

  const deleteBlog = async (id) => {
    try {
      await fetch(`${API}/api/blogs/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      fetchBlogs(); 
    } catch (error) {
      console.error("Error deleting blog:", error);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  return (
    <BlogContext.Provider value={{ blogs, addBlog, deleteBlog, loading }}>
      {children}
    </BlogContext.Provider>
  );
};

export const useBlogs = () => useContext(BlogContext);