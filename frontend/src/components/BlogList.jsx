import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import API_URL from "../api";
import BlogCard from "./BlogCard";

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/blogs`);
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
    <div className="bg-gray-950 min-h-screen pt-4 pb-12 px-6">
      <div className="max-w-7xl mx-auto relative flex flex-col md:flex-row items-center justify-center mb-6 gap-6 border-b border-gray-900 pb-4">
        <h1 className="text-4xl font-bold text-white text-center">
          All Blogs
        </h1>

        <button
          onClick={() => navigate("/write-blog")}
          className="md:absolute md:right-0 bg-lime-600 hover:bg-green-700 text-white font-semibold px-8 py-3 rounded-lg flex items-center gap-2 transition-all shadow-lg hover:scale-105 active:scale-95 whitespace-nowrap"
        >
          <Plus size={20} />
          <span>Write Your Own Blog</span>
        </button>
      </div>

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
