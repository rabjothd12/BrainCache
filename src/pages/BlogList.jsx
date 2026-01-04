import BlogCard from "../components/BlogCard";
import "./styles/BlogList.css";

function BlogList() {
  const blogs = [
    {
      id: 1,
      title: "My First Blog",
      content: "This is my first blog content...",
      date: "Sep 2026",
    },
    {
      id: 2,
      title: "Learning React",
      content: "React is a powerful library...",
      date: "Sep 2026",
    },
  ];

  return (
    <div className="blog-list">
      <h1>All Blogs</h1>

      <div className="blog-grid">
        {blogs.map((blog) => (
          <BlogCard
            key={blog.id}
            title={blog.title}
            content={blog.content}
            date={blog.date}
          />
        ))}
      </div>
    </div>
  );
}

export default BlogList;
