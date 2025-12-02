import React, { useState, useEffect } from 'react';

export default function CropRecommendation() {
  const [searchCriteria, setSearchCriteria] = useState({
    soilType: '',
    climate: '',
    season: '',
    waterRequirement: '',
    temperature: '',
    ph: ''
  });
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [allCrops, setAllCrops] = useState([]);

  // Fetch all crops on component mount
  useEffect(() => {
    fetchCrops();
  }, []);

  const fetchCrops = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/crops');
      const data = await response.json();
      setAllCrops(data);
    } catch (error) {
      console.error('Error fetching crops:', error);
    }
  };

  const handleChange = (e) => {
    setSearchCriteria({
      ...searchCriteria,
      [e.target.name]: e.target.value
    });
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/crops/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(searchCriteria)
      });

      const data = await response.json();
      setResults(data.crops || []);
    } catch (error) {
      console.error('Error searching crops:', error);
      alert('Error searching crops. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSearchCriteria({
      soilType: '',
      climate: '',
      season: '',
      waterRequirement: '',
      temperature: '',
      ph: ''
    });
    setResults([]);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white py-12 px-4 font-monospace">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-4">
          Crop <span className="text-green-500">Recommendation</span>
        </h1>
        <p className="text-center text-gray-400 mb-8 max-w-2xl mx-auto">
          Get personalized crop recommendations based on your soil type, climate, and other conditions.
        </p>

        {/* Search Form */}
        <div className="bg-gray-800 rounded-2xl p-6 mb-8">
          <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-300 mb-2">Soil Type</label>
              <select
                name="soilType"
                value={searchCriteria.soilType}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-green-500"
              >
                <option value="">Select Soil Type</option>
                <option value="clay">Clay</option>
                <option value="sandy">Sandy</option>
                <option value="loamy">Loamy</option>
                <option value="silty">Silty</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-300 mb-2">Climate</label>
              <select
                name="climate"
                value={searchCriteria.climate}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-green-500"
              >
                <option value="">Select Climate</option>
                <option value="tropical">Tropical</option>
                <option value="subtropical">Subtropical</option>
                <option value="temperate">Temperate</option>
                <option value="arid">Arid</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-300 mb-2">Season</label>
              <select
                name="season"
                value={searchCriteria.season}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-green-500"
              >
                <option value="">Select Season</option>
                <option value="summer">Summer</option>
                <option value="winter">Winter</option>
                <option value="monsoon">Monsoon</option>
                <option value="spring">Spring</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-300 mb-2">Water Requirement</label>
              <select
                name="waterRequirement"
                value={searchCriteria.waterRequirement}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-green-500"
              >
                <option value="">Select Water Requirement</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-300 mb-2">Temperature (°C)</label>
              <input
                type="number"
                name="temperature"
                value={searchCriteria.temperature}
                onChange={handleChange}
                placeholder="e.g., 25"
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-green-500"
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-2">Soil pH</label>
              <input
                type="number"
                name="ph"
                value={searchCriteria.ph}
                onChange={handleChange}
                step="0.1"
                min="0"
                max="14"
                placeholder="e.g., 6.5"
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-green-500"
              />
            </div>

            <div className="md:col-span-2 flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-lime-500 hover:bg-lime-600 text-white font-semibold py-3 rounded-lg transition-colors duration-300 disabled:opacity-50"
              >
                {loading ? 'Searching...' : 'Search Crops'}
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 rounded-lg transition-colors duration-300"
              >
                Reset
              </button>
            </div>
          </form>
        </div>

        {/* Results */}
        {results.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-4">
              Found {results.length} Crop{results.length !== 1 ? 's' : ''}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.map((crop) => (
                <div key={crop._id} className="bg-gray-800 rounded-xl p-6 hover:shadow-lg transition-shadow">
                  <h3 className="text-xl font-bold mb-2 text-green-400">{crop.name}</h3>
                  <p className="text-gray-300 mb-4 text-sm">{crop.description}</p>
                  <div className="space-y-2 text-sm">
                    <p><span className="text-gray-400">Soil:</span> {crop.soilType.join(', ')}</p>
                    <p><span className="text-gray-400">Climate:</span> {crop.climate.join(', ')}</p>
                    <p><span className="text-gray-400">Season:</span> {crop.season.join(', ')}</p>
                    <p><span className="text-gray-400">Water:</span> {crop.waterRequirement}</p>
                    <p><span className="text-gray-400">Temperature:</span> {crop.temperatureRange.min}°C - {crop.temperatureRange.max}°C</p>
                    <p><span className="text-gray-400">pH:</span> {crop.phRange.min} - {crop.phRange.max}</p>
                    <p><span className="text-gray-400">Yield:</span> {crop.yield}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {results.length === 0 && !loading && (
          <div className="text-center text-gray-400 py-12">
            {Object.values(searchCriteria).some(val => val) 
              ? 'No crops found matching your criteria. Try different search parameters.'
              : 'Enter search criteria above to find recommended crops.'}
          </div>
        )}
      </div>
    </div>
  );
}


