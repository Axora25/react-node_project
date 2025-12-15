import React, { useEffect, useState } from "react";
import axios from "axios";
import BlogCard from "./BlogCard";

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/blogs");
        setBlogs(res.data);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  return (
    <div className="bg-gray-950 min-h-screen py-12 px-6">
      <h1 className="text-4xl font-bold text-white text-center mb-10">
        All Blogs
      </h1>

      {loading ? (
        <p className="text-center text-gray-400">Loading...</p>
      ) : blogs.length === 0 ? (
        <p className="text-center text-gray-400">No blogs found</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {blogs.map(blog => (
            <BlogCard key={blog._id} blog={blog} />
          ))}
        </div>
      )}
    </div>
  );
};

export default BlogList;
