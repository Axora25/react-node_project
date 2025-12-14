import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const SingleBlog = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/blogs/${id}`);
        setBlog(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  if (loading) {
    return <p className="text-center text-gray-400 mt-20">Loading...</p>;
  }

  if (!blog) {
    return <p className="text-center text-red-500 mt-20">Blog not found</p>;
  }

  return (
    <div className="bg-gray-950 min-h-screen py-12 px-4 text-white">
      <div className="max-w-4xl mx-auto">
        <img
          src={blog.image}
          alt={blog.title}
          className="w-full h-80 object-cover rounded-xl mb-6"
        />

        <h1 className="text-3xl font-bold mb-4">{blog.title}</h1>

        <p className="text-gray-300 leading-relaxed">
          {blog.content}
        </p>
      </div>
    </div>
  );
};

export default SingleBlog;
