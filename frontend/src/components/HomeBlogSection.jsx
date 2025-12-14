import React, { useEffect, useState } from "react";
import axios from "axios";
import BlogCard from "./BlogCard";

const HomeBlogSection = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentBlogs = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/blogs");
        // backend already sorts by latest
        setBlogs(res.data.slice(0, 3));
      } catch (error) {
        console.error("Error fetching recent blogs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentBlogs();
  }, []);

  if (loading) {
    return <p className="text-center text-gray-400 mt-6">Loading blogs...</p>;
  }

  return (
   <div className="mt-10 px-4 md:px-8 container mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {blogs.map(blog => (
          <BlogCard key={blog._id} blog={blog} />
        ))}
      </div>
    </div>
  );
};

export default HomeBlogSection;
