import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import irrigationImg from '../assets/images/irirgation.png';
import tractorsImg from '../assets/images/autonomus_tractors.jpg';
import renewableImg from '../assets/images/renewable_resoure.png';
import droneImg from '../assets/images/Drone.jpg';
import verticalFarmingImg from '../assets/images/Vertical Farming Systems.png';
import soilHealthImg from '../assets/images/soil health.jpg';

const GEMINI_API_URL = 'http://localhost:5000/api/gemini';

// Technologies data
const technologies = [
  {
    name: "Precision Irrigation Systems",
    description: "Optimize water usage with sensors and automated controls, delivering water exactly when it's needed.",
    category: "Water Management",
    image: irrigationImg,
    icon: "💧",
    link: "https://eos.com/blog/precision-irrigation/",
  },
  {
    name: "Autonomous Tractors",
    description: "Increase efficiency and reduce labor costs with self-driving tractors for tasks like planting, tilling, and harvesting.",
    category: "Automation",
    image: tractorsImg,
    icon: "🚜",
    link: "https://www.deere.com/en/autonomous/",
  },
  {
    name: "Renewable Energy Solutions",
    description: "Use solar and wind power to reduce your farm's carbon footprint, energy costs and environmental impact.",
    category: "Sustainability",
    image: renewableImg,
    icon: "🌱",
    link: "https://www.hitachienergy.com/in/en/markets/renewable-energy",
  },
  {
    name: "Agricultural Drone",
    description: "Utilize drones for real-time crop health monitoring and pest detection.",
    category: "Data & Monitoring",
    image: droneImg,
    icon: "🚁",
    link: "https://ag.dji.com/",
  },
  {
    name: "Vertical Farming Systems",
    description: "Grow crops in stacked layers, often indoors, to maximize space and control growing conditions year-round.",
    category: "Indoor Farming",
    image: verticalFarmingImg,
    icon: "🏙️",
    link: "https://www.cropin.com/vertical-farming/#:~:text=Vertical%20farming%20refers%20to%20the,warehouses%2C%20and%20abandoned%20mine%20shafts.",
  },
  {
    name: "Soil Health Sensor",
    description: "Real-time monitoring of soil moisture, nutrient levels, and pH to make informed decisions about fertilization",
    category: "Water Management",
    image: soilHealthImg,
    icon: "🐞",
    link: "https://www.renkeer.com/5-types-soil-sensors/",
  }
];

const categories = [
  "All",
  "Water Management",
  "Automation",
  "Data & Monitoring",
  "Indoor Farming",
  "Sustainability"
];

const testimonials = [
  {
    name: "John D.",
    avatar: "JD",
    image: "https://placehold.co/100x100",
    hint: "farmer portrait",
    title: "A Game Changer for Water Savings",
    quote: "The precision irrigation system recommended by AgriAssist cut our water usage by 30%. My crops have never been healthier, and my utility bills have never been lower. It's truly a game-changer.",
  },
  {
    name: "Maria S.",
    avatar: "MS",
    image: "https://placehold.co/100x100",
    hint: "farmer smiling",
    title: "Efficiency Like Never Before",
    quote: "I was skeptical about autonomous tractors, but the efficiency gains are undeniable. I can now manage my 1000-acre farm with a smaller team, saving time and money.",
  },
  {
    name: "Chen W.",
    avatar: "CW",
    image: "https://placehold.co/100x100",
    hint: "woman farmer",
    title: "Data-driven Decisions",
    quote: "Using drones for crop monitoring has revolutionized how I approach pest management. I can spot issues weeks earlier than before and apply treatments with surgical precision.",
  },
];

// Helper: local fallback recommendation
function generateLocalRecommendation(farmSize, crops, challenges) {
  const advice = [];
  const lowerChallenges = challenges.toLowerCase();

  if (/water|irrig|drought|moisture/.test(lowerChallenges)) {
    advice.push('Consider precision irrigation and soil-moisture sensors to optimize water use and reduce stress during dry periods.');
  }
  if (/pest|disease|infest|aphid|worm|mite/.test(lowerChallenges)) {
    advice.push('Adopt integrated pest management (IPM): monitoring, biological controls, and targeted spraying (drones can help).');
  }
  if (/labor|efficien|cost|harvest|planting/.test(lowerChallenges)) {
    advice.push('Explore automation like autonomous tractors for planting/harvesting to cut labor costs and improve efficiency.');
  }
  if (/monitor|yield|health|mapping|data|variab/.test(lowerChallenges)) {
    advice.push('Use drones and farm sensors for crop-health mapping and data-driven decisions to boost yield and input efficiency.');
  }
  if (advice.length === 0) {
    advice.push('Start with a soil health test, then plan irrigation, pest prevention, and crop rotation based on results.');
  }

  // Pick up to 3 relevant technologies
  const picks = [];
  for (const tech of technologies) {
    if (picks.length >= 3) break;
    const hay = (tech.name + ' ' + tech.description + ' ' + tech.category).toLowerCase();
    if (
      (hay.includes('irrig') && /water|irrig|drought|moisture/.test(lowerChallenges)) ||
      (hay.includes('drone') && /pest|disease|monitor|mapping/.test(lowerChallenges)) ||
      (hay.includes('tractor') && /labor|efficien|cost/.test(lowerChallenges)) ||
      (hay.includes('sensor') && /monitor|soil|moisture|data/.test(lowerChallenges))
    ) {
      picks.push(tech);
    }
  }

  if (picks.length === 0) {
    picks.push(...technologies.slice(0, 2));
  }

  return {
    farmSize,
    crops,
    challenges,
    advice,
    technologies: picks
  };
}

export default function FarmTech() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showModal, setShowModal] = useState(false);
  const [recommendationHtml, setRecommendationHtml] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [usedFallback, setUsedFallback] = useState(false);
  
  const selectedCategory = searchParams.get('category') || 'All';
  const searchQuery = searchParams.get('search') || '';

  // Handle body overflow when modal is open
  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showModal]);

  // Filter technologies
  const filteredTechnologies = technologies.filter(tech => {
    const matchesCategory = selectedCategory === 'All' || tech.category === selectedCategory;
    const matchesSearch = !searchQuery || 
      tech.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tech.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const farmSize = formData.get('farmSize');
    const crops = formData.get('crops');
    const challenges = formData.get('challenges');

    setIsLoading(true);
    setShowModal(true);
    setUsedFallback(false);

    try {
      const response = await fetch(`${GEMINI_API_URL}/farm-tech`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ farmSize, crops, challenges }),
      });

      if (!response.ok) {
        throw new Error('API request failed');
      }

      const data = await response.json();
      
      if (data.response) {
        // Format the AI response
        const formattedResponse = data.response
          .split('\n')
          .filter(line => line.trim())
          .map(line => {
            if (line.trim().startsWith('•') || line.trim().startsWith('-')) {
              return `<li>${line.trim().substring(1).trim()}</li>`;
            }
            return `<p>${line.trim()}</p>`;
          })
          .join('');

        const localRec = generateLocalRecommendation(farmSize, crops, challenges);
        
        let html = '<div class="space-y-3">';
        html += `<p><strong>Farm size:</strong> ${farmSize}</p>`;
        html += `<p><strong>Crops:</strong> ${crops}</p>`;
        html += `<p><strong>Challenges:</strong> ${challenges}</p>`;
        html += '<h4><strong>AI Recommendations:</strong></h4>';
        html += `<div>${formattedResponse}</div>`;
        html += '<h4 class="mt-3"><strong>Suggested technologies:</strong></h4><ul>';
        localRec.technologies.forEach(tech => {
          html += `<li>• <a class="text-lime-400" target="_blank" rel="noopener" href="${tech.link}">${tech.name}</a> — ${tech.description}</li>`;
        });
        html += '</ul></div>';
        
        setRecommendationHtml(html);
      } else {
        throw new Error('No response from API');
      }
    } catch (error) {
      console.error('Error:', error);
      // Use fallback
      setUsedFallback(true);
      const localRec = generateLocalRecommendation(farmSize, crops, challenges);
      
      let html = '<div class="space-y-3">';
      html += `<p><strong>Farm size:</strong> ${farmSize}</p>`;
      html += `<p><strong>Crops:</strong> ${crops}</p>`;
      html += `<p><strong>Challenges:</strong> ${challenges}</p>`;
      html += '<h4><strong>Actionable tips:</strong></h4><ul>';
      localRec.advice.forEach(tip => {
        html += `<li>• ${tip}</li>`;
      });
      html += '</ul>';
      html += '<h4 class="mt-3"><strong>Suggested technologies:</strong></h4><ul>';
      localRec.technologies.forEach(tech => {
        html += `<li>• <a class="text-lime-400" target="_blank" rel="noopener" href="${tech.link}">${tech.name}</a> — ${tech.description}</li>`;
      });
      html += '</ul>';
      html += '<p class="text-xs text-gray-400 mt-2">(Offline recommendation generated locally.)</p>';
      html += '</div>';
      
      setRecommendationHtml(html);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const search = formData.get('search') || '';
    const params = new URLSearchParams();
    if (selectedCategory !== 'All') params.set('category', selectedCategory);
    if (search.trim()) params.set('search', search.trim());
    setSearchParams(params);
  };

  const handleSearchInputChange = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const search = e.target.value.trim();
      const params = new URLSearchParams();
      if (selectedCategory !== 'All') params.set('category', selectedCategory);
      if (search) params.set('search', search);
      setSearchParams(params);
    }
  };

  const handleCategoryChange = (category) => {
    const params = new URLSearchParams();
    if (category !== 'All') params.set('category', category);
    if (searchQuery) params.set('search', searchQuery);
    setSearchParams(params);
  };

  return (
    <div className="font-mono bg-gray-900 min-h-screen flex flex-col text-white">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="p-8">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Left: Heading and Description */}
            <div>
              <span className="text-white font-bold text-lg">AI-Powered Assistance</span>
              <h1 className="text-5xl font-extrabold mt-4 mb-4 leading-tight text-white">
                Smarter Farming Starts Here
              </h1>
              <p className="text-gray-300 text-lg mb-2">
                Get personalized technology recommendations for your farm. Simply describe your operation and challenges, and our AI will suggest solutions to boost your productivity and sustainability.
              </p>
            </div>

            {/* Right: Form Card */}
            <div>
              <div className="bg-gray-800 p-8 rounded-xl shadow-lg">
                <h2 className="font-bold text-2xl mb-2 text-white">Find Your Farming Solution</h2>
                <p className="text-sm text-gray-400 mb-6">Fill out the form below to get started.</p>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-200 font-semibold mb-1" htmlFor="farmSize">
                        Farm Size (in acres)
                      </label>
                      <input
                        type="text"
                        name="farmSize"
                        id="farmSize"
                        placeholder="e.g., 500"
                        className="border border-gray-600 bg-gray-900 text-gray-100 p-3 rounded w-full focus:outline-none focus:border-lime-400 hover:bg-gray-900"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-gray-200 font-semibold mb-1" htmlFor="crops">
                        Crops Grown
                      </label>
                      <input
                        type="text"
                        name="crops"
                        id="crops"
                        placeholder="e.g., Corn, Soybeans, Wheat"
                        className="border border-gray-600 bg-gray-900 text-gray-100 p-3 rounded w-full focus:outline-none focus:border-lime-400 hover:bg-gray-900"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-gray-200 font-semibold mb-1" htmlFor="challenges">
                      Your Challenges
                    </label>
                    <textarea
                      name="challenges"
                      id="challenges"
                      rows="3"
                      placeholder="Describe your main challenges, e.g., 'pest control for corn' or 'managing irrigation during dry seasons'."
                      className="border border-gray-600 bg-gray-900 text-gray-100 p-3 rounded w-full focus:outline-none focus:border-lime-400 hover:bg-gray-900"
                      required
                    />
                  </div>
                  <p className="text-xs text-gray-400 mb-2">
                    The more detail you provide, the better the recommendations.
                  </p>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-lime-500 hover:bg-lime-600 text-white rounded font-semibold w-full flex items-center justify-center gap-2"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13 16h-1v-4h-1m4 0h-1v-4h-1m4 0h-1v-4h-1m4 0h-1v-4h-1"
                      />
                    </svg>
                    Get AI Recommendations
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* Modal Popup */}
        {showModal && (
          <div
            id="recommendation-modal"
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60"
            onClick={() => setShowModal(false)}
          >
            <div
              className="bg-gray-900 rounded-2xl shadow-xl max-w-2xl w-full mx-4 p-8 relative"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lime-400 text-2xl">🤖</span>
                <h3 className="font-bold text-xl text-white">Your Personalized Tech Recommendations</h3>
              </div>
              <p className="text-gray-400 mb-4">
                Based on your farms details, here are some technologies that could help.
              </p>
              <div className="max-h-96 overflow-y-auto text-gray-200">
                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-lime-400"></div>
                    <span className="ml-3">Generating recommendations...</span>
                  </div>
                ) : (
                  <div dangerouslySetInnerHTML={{ __html: recommendationHtml }} />
                )}
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="mt-6 px-6 py-2 bg-lime-500 hover:bg-lime-600 text-white rounded font-semibold float-right"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Tech Showcase */}
        <section className="p-6 bg-gray-900">
          <div className="max-w-4xl mx-auto text-center mb-8">
            <h2 className="text-3xl font-extrabold text-white mb-2">Explore Farm Technologies</h2>
            <p className="text-gray-300 text-lg">
              Discover innovative tools and solutions to boost your farm's productivity and sustainability.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 justify-center mb-8">
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex items-center gap-3">
              <input
                type="text"
                name="search"
                defaultValue={searchQuery}
                onKeyDown={handleSearchInputChange}
                placeholder="Search technologies..."
                className="px-4 py-2 rounded-lg border border-gray-600 bg-gray-800 text-gray-100 w-64 focus:outline-none focus:border-lime-400"
              />
              <button type="submit" className="hidden"></button>
            </form>

            {/* Category Links */}
            <button
              onClick={() => handleCategoryChange('All')}
              className={`rounded-full px-4 py-2 font-semibold flex items-center gap-2 ${
                selectedCategory === 'All'
                  ? 'bg-lime-500 text-white'
                  : 'bg-gray-800 text-gray-100 hover:bg-lime-600'
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 inline"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707l-6.414 6.414A1 0 0013 14.414V19a1 1 0 01-1.447.894l-4-2A1 0 007 17V14.414a1 0 00-.293-.707L3.293 6.707A1 0 013 6V4z"
                />
              </svg>
              All
            </button>

            {categories
              .filter((cat) => cat !== 'All')
              .map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategoryChange(cat)}
                  className={`px-4 py-2 rounded-full border font-semibold ${
                    selectedCategory === cat
                      ? 'border-lime-400 text-lime-400'
                      : 'border-gray-600 bg-gray-800 text-gray-100 hover:border-lime-400 hover:text-lime-400'
                  }`}
                >
                  {cat}
                </button>
              ))}
          </div>

          <div className="grid md:grid-cols-3 gap-4 max-w-7xl mx-auto">
            {filteredTechnologies.length === 0 ? (
              <div className="col-span-3 text-center text-gray-400 py-8">
                No technologies found for your search or filter.
              </div>
            ) : (
              filteredTechnologies.map((tech, index) => (
                <div key={index} className="p-4 rounded-md bg-gray-800">
                  <div className="flex gap-2 items-center mb-2">
                    <span className="text-2xl">{tech.icon}</span>
                    <div>
                      <h3 className="font-bold text-lg text-white">{tech.name}</h3>
                      <span className="px-2 py-1 bg-gray-900 text-lime-400 text-xs rounded">
                        {tech.category}
                      </span>
                    </div>
                  </div>
                  <img
                    src={tech.image}
                    alt={tech.name}
                    className="w-full h-40 object-cover mb-2 rounded"
                  />
                  <p className="text-sm text-gray-300">{tech.description}</p>
                  <div className="mt-4">
                    <a
                      href={tech.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-lime-500 hover:bg-lime-600 text-white rounded-b-lg w-full text-center block"
                    >
                      Learn More
                    </a>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Testimonials */}
        <section className="p-6">
          <h2 className="text-4xl font-extrabold text-center text-white mb-2">
            Success Stories from the Field
          </h2>
          <p className="text-center text-gray-400 mb-10 text-lg">
            See how farmers are using technology to transform their operations and increase their yields.
          </p>
          <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {testimonials.map((t, index) => (
              <div key={index} className="bg-gray-800 rounded-xl shadow-lg p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <img
                    src={t.image}
                    alt={t.name}
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <p className="font-bold text-white">{t.name}</p>
                    <p className="text-gray-400 text-sm">{t.title}</p>
                  </div>
                </div>
                <blockquote className="text-gray-300 italic leading-relaxed">
                  "{t.quote}"
                </blockquote>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 mt-8 text-center p-4 text-xs text-gray-400">
        &copy; {new Date().getFullYear()} AgriGrow. All rights reserved.
      </footer>
    </div>
  );
}

