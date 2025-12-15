import React from "react";
import { useNavigate } from "react-router-dom";
import "./BlogCard.css";

const BlogCard = ({ blog }) => {
  const navigate = useNavigate();

  return (
    <div className="blog-card">
      <div className="blog-card-image">
        <img
          src={blog.image || "https://via.placeholder.com/400x250"}
          alt={blog.title}
        />
      </div>

      <div className="blog-card-body">
        <h3 className="blog-card-title">{blog.title}</h3>

        <button
          className="blog-card-read"
          onClick={() => navigate(`/blog/${blog._id}`)}
        >
          Read More »
        </button>
      </div>
    </div>
  );
};

export default BlogCard;
