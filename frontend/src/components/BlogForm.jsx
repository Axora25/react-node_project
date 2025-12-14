import React, { useState } from 'react';
import axios from 'axios';
import { Send, ArrowLeft, Loader2, Image as ImageIcon } from 'lucide-react';
import './BlogForm.css';

const BlogForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    imageUrl: '',
    imageFile: null,
    content: '',
    tags: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, imageFile: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const data = new FormData();
    data.append('title', formData.title);
    data.append('content', formData.content);
    data.append('tags', formData.tags);
    data.append('imageUrl', formData.imageUrl);
    
    if (formData.imageFile) {
      data.append('imageFile', formData.imageFile);
    }

    try {
      const response = await axios.post('http://localhost:5000/api/blogs', data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.status === 201) {
        alert('Blog published successfully!');
        setFormData({ title: '', imageUrl: '', imageFile: null, content: '', tags: '' });
      }
    } catch (error) {
      console.error('Error publishing blog:', error);
      alert('Failed to publish blog. Check console for details.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="blog-container">
      {/* Overlay for better text contrast against the image */}
      <div className="bg-overlay"></div>

      <div className="form-wrapper">
        <header className="form-header">
          <div className="header-badge">Agri-Tech Blog</div>
          <h1>Share Your Harvest</h1>
          <p>Cultivate knowledge and share your farming insights with the community.</p>
        </header>

        <form onSubmit={handleSubmit}>
          {/* Title */}
          <div className="form-group">
            <label htmlFor="title">Article Title</label>
            <input
              type="text"
              name="title"
              placeholder="e.g., Sustainable Tractor Maintenance 2025"
              value={formData.title}
              onChange={handleChange}
              required
              disabled={isSubmitting}
            />
          </div>

          {/* Image Section */}
          <div className="form-group">
            <label>Featured Image</label>
            <div className="image-input-grid">
              
              {/* URL Input */}
              <div className="input-card">
                <span className="input-card-label">Image URL</span>
                <input
                  type="text"
                  name="imageUrl"
                  placeholder="https://..."
                  value={formData.imageUrl}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
              </div>

              {/* File Upload */}
              <div className="input-card">
                <span className="input-card-label">Or Upload File</span>
                <label className={`file-upload-box ${formData.imageFile ? 'active' : ''}`}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    disabled={isSubmitting}
                  />
                  <ImageIcon size={20} className="upload-icon" />
                  <span className="upload-text">
                    {formData.imageFile ? formData.imageFile.name : "Select Image"}
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="form-group">
            <label htmlFor="content">Content</label>
            <textarea
              name="content"
              placeholder="Write about crop cycles, machinery, or government schemes..."
              rows="8"
              value={formData.content}
              onChange={handleChange}
              required
              disabled={isSubmitting}
            ></textarea>
          </div>

          {/* Tags */}
          <div className="form-group">
            <label htmlFor="tags">Tags</label>
            <input
              type="text"
              name="tags"
              placeholder="e.g. Farming, Tractors, Monsoon"
              value={formData.tags}
              onChange={handleChange}
              disabled={isSubmitting}
            />
          </div>

          <div className="form-divider"></div>

          {/* Buttons */}
          <div className="button-group">
            <button 
              type="button" 
              className="btn-secondary" 
              onClick={() => window.history.back()}
              disabled={isSubmitting}
            >
              <ArrowLeft size={18} />
              <span>Cancel</span>
            </button>

            <button 
              type="submit" 
              className={`btn-primary ${isSubmitting ? 'loading' : ''}`}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={18} className="spinner" />
                  <span>Publishing...</span>
                </>
              ) : (
                <>
                  <Send size={18} />
                  <span>Publish Story</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BlogForm;