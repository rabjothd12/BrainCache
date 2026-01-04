import { Link } from "react-router-dom";
import "../pages/styles/BlogCard.css";

function BlogCard({ id, title, content, date, image, category }) {
  return (
    <Link to={`/blog/${id}`} className="blog-card-link">
      <div className="blog-card">
        {image && (
          <img src={image} alt={title} className="blog-card-img" />
        )}

        {category && (
          <span className="blog-category">{category}</span>
        )}

        <h3>{title}</h3>
        <p>{content.slice(0, 120)}...</p>
        <span className="blog-date">{date}</span>
      </div>
    </Link>
  );
}

export default BlogCard;
