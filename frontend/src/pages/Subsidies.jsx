import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Subsidies = () => {
  const [subsidies, setSubsidies] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  // Function to Reset Filters
  const resetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/subsidy/categories');
        if (res.data.data) {
          setCategories(res.data.data);
        }
      } catch (error) {
        console.error("Error fetching categories", error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchSubsidies = async () => {
      setLoading(true);
      try {
        const res = await axios.get('http://localhost:5000/api/subsidy/list', {
          params: {
            search: searchTerm,
            category: selectedCategory === 'All Categories' ? '' : selectedCategory
          }
        });
        
        if (res.data.data) {
          setSubsidies(res.data.data);
        }
      } catch (error) {
        console.error("Error fetching subsidies", error);
      }
      setLoading(false);
    };

    const delayDebounceFn = setTimeout(() => {
      fetchSubsidies();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, selectedCategory]);

  return (
    <div className="subsidies-page-container" style={{ padding: '40px 20px', backgroundColor: '#111827', minHeight: '100vh', color: 'white', fontFamily: 'monospace' }}>
      
      {/* Header */}
      <div className="header" style={{ textAlign: 'center', marginBottom: '50px' }}>
        <h1 style={{ color: '#4ade80', fontSize: '3rem', marginBottom: '15px', fontWeight: 'bold' }}>Government Subsidies</h1>
        <p style={{ color: '#9ca3af', maxWidth: '600px', margin: '0 auto', fontSize: '1.1rem' }}>
          Explore and track agriculture subsidy programs so you never miss financial support opportunities.
        </p>
      </div>

      {/* Filter Section */}
      <div className="filter-container" style={{ 
        backgroundColor: '#1f2937', 
        padding: '25px', 
        borderRadius: '16px', 
        maxWidth: '900px', 
        margin: '0 auto 50px auto',
        border: '1px solid #374151',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '15px' }}>
          <input 
            type="text" 
            placeholder="🔍 Search subsidies..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              padding: '12px 20px',
              backgroundColor: '#111827',
              border: '1px solid #4b5563',
              borderRadius: '8px',
              color: 'white',
              fontSize: '1rem',
              outline: 'none'
            }}
          />
          <select 
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={{
              padding: '12px 20px',
              backgroundColor: '#111827',
              border: '1px solid #4b5563',
              borderRadius: '8px',
              color: 'white',
              fontSize: '1rem',
              outline: 'none'
            }}
          >
            <option value="">All Categories</option>
            {categories.map((cat, index) => (
              <option key={index} value={cat.name || cat}>
                {cat.name || cat}
              </option>
            ))}
          </select>
        </div>
        
        <button 
          onClick={resetFilters}
          style={{
            width: '100%',
            padding: '10px',
            backgroundColor: 'transparent',
            color: '#9ca3af',
            border: '1px dashed #4b5563',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '0.9rem',
            transition: 'all 0.2s'
          }}
          onMouseOver={(e) => { e.target.style.borderColor = '#4ade80'; e.target.style.color = '#4ade80'; }}
          onMouseOut={(e) => { e.target.style.borderColor = '#4b5563'; e.target.style.color = '#9ca3af'; }}
        >
          ✖ Reset Filters
        </button>
      </div>

      {/* Results Grid - NEW CARD DESIGN */}
      <div className="results-grid" style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', 
        gap: '30px', 
        maxWidth: '1200px', 
        margin: '0 auto' 
      }}>
        {loading ? (
          <p style={{ textAlign: 'center', gridColumn: '1/-1', fontSize: '1.2rem' }}>Loading subsidies...</p>
        ) : subsidies.length > 0 ? (
          subsidies.map((item, index) => (
            <div key={index} style={{ 
              backgroundColor: '#1e293b', // Dark Blue Background like screenshot
              borderRadius: '16px', 
              border: '1px solid #334155',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              position: 'relative',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
            }}>
              
              <div style={{ padding: '24px', flexGrow: 1 }}>
                
                {/* Top Badge Row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                  <span style={{ 
                    backgroundColor: '#064e3b', 
                    color: '#4ade80', 
                    padding: '4px 12px', 
                    borderRadius: '20px', 
                    fontSize: '0.8rem', 
                    fontWeight: 'bold',
                    border: '1px solid #065f46'
                  }}>
                    {item.category || item.category_name}
                  </span>
                  {item.status && (
                    <span style={{ color: '#3b82f6', fontWeight: 'bold', fontSize: '0.85rem' }}>
                      ● {item.status}
                    </span>
                  )}
                </div>

                {/* Title & Description */}
                <h3 style={{ color: 'white', fontSize: '1.4rem', marginBottom: '10px', lineHeight: '1.3' }}>
                  {item.title || item.name}
                </h3>
                <p style={{ color: '#94a3b8', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '20px' }}>
                  {item.description ? item.description.substring(0, 120) + (item.description.length > 120 ? '...' : '') : 'No description available.'}
                </p>

                {/* Key Details Grid */}
                <div style={{ backgroundColor: '#0f172a', padding: '15px', borderRadius: '12px', marginBottom: '20px' }}>
                  
                  {/* Amount */}
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ marginRight: '10px', fontSize: '1.2rem' }}>💰</span>
                    <div>
                      <span style={{ display: 'block', fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase' }}>Benefit</span>
                      <span style={{ color: '#e2e8f0', fontWeight: 'bold' }}>{item.amount || 'Variable'}</span>
                    </div>
                  </div>

                  {/* State & Deadline Row */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <span style={{ marginRight: '8px' }}>📍</span>
                      <span style={{ color: '#cbd5e1', fontSize: '0.9rem' }}>{item.state || 'All India'}</span>
                    </div>
                    {item.application_deadline && (
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <span style={{ marginRight: '8px' }}>📅</span>
                        <span style={{ color: '#cbd5e1', fontSize: '0.9rem' }}>Due: {item.application_deadline}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Eligibility */}
                {item.eligibility_criteria && (
                  <div style={{ marginBottom: '10px' }}>
                    <p style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '4px' }}>Eligibility:</p>
                    <p style={{ color: '#e2e8f0', fontSize: '0.9rem' }}>✅ {item.eligibility_criteria}</p>
                  </div>
                )}
              </div>

              {/* Action Button Footer */}
              <div style={{ padding: '16px 24px', borderTop: '1px solid #334155' }}>
                <a 
                  href={item.website_url || '#'} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{ 
                    display: 'block',
                    width: '100%',
                    padding: '12px', 
                    backgroundColor: '#84cc16', // Lime Green like reference
                    color: '#0f172a', 
                    textAlign: 'center',
                    borderRadius: '8px', 
                    fontWeight: 'bold',
                    textDecoration: 'none',
                    transition: 'background-color 0.2s',
                    fontSize: '1rem'
                  }}
                  onMouseOver={(e) => e.target.style.backgroundColor = '#65a30d'}
                  onMouseOut={(e) => e.target.style.backgroundColor = '#84cc16'}
                >
                  Apply Now ↗
                </a>
              </div>

            </div>
          ))
        ) : (
          <p style={{ textAlign: 'center', gridColumn: '1/-1', color: '#9ca3af' }}>No subsidies found matching your criteria.</p>
        )}
      </div>
    </div>
  );
};

export default Subsidies;