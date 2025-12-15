import { useState, useEffect, useRef } from 'react';
import seedsImage from '../assets/images/seeds.jpg';

export default function CropRecommendation() {
  const [formData, setFormData] = useState({
    nitrogen: '',
    phosphorus: '',
    potassium: '',
    temperature: '',
    humidity: '',
    ph: '',
    rainfall: ''
  });
  const [recommendedCrop, setRecommendedCrop] = useState('');
  const [loading, setLoading] = useState(false);
  const resultRef = useRef(null);

  useEffect(() => {
    // Remove no-scroll class on mount
    document.body.classList.remove('no-scroll');
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setRecommendedCrop('');

    try {
      const response = await fetch('http://localhost:5000/api/crops/recommend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          nitrogen: parseFloat(formData.nitrogen) || 0,
          phosphorus: parseFloat(formData.phosphorus) || 0,
          potassium: parseFloat(formData.potassium) || 0,
          temperature: parseFloat(formData.temperature) || 0,
          humidity: parseFloat(formData.humidity) || 0,
          ph: parseFloat(formData.ph) || 0,
          rainfall: parseFloat(formData.rainfall) || 0
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.crop && data.crop !== 'No crop found') {
        setRecommendedCrop(data.crop);
        // Scroll to result after a small delay
        setTimeout(() => {
          if (resultRef.current) {
            resultRef.current.scrollIntoView({ behavior: 'smooth' });
          }
        }, 200);
      } else {
        setRecommendedCrop(data.error || 'No crop found. Please ensure crops are added to the database.');
      }
    } catch (error) {
      console.error('Error getting recommendation:', error);
      setRecommendedCrop(`Error: ${error.message}. Please check if the backend server is running and crops are in the database.`);
    } finally {
      setLoading(false);
    }
  };

  // Get the image URL - Vite processes imports and returns a URL
  const backgroundImageUrl = typeof seedsImage === 'string' ? seedsImage : seedsImage?.default || seedsImage;

  return (
    <div className="font-mono bg-gray-950 text-white relative h-screen overflow-hidden">
      <div 
        className="bg-crop-recommendation h-screen flex flex-col items-center justify-center relative"
        style={{
          backgroundImage: `url(${backgroundImageUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          backgroundRepeat: 'no-repeat',
          textAlign: 'center',
          position: 'relative'
        }}
      >
        <div 
          className="absolute top-0 left-0 w-full h-full z-0"
          style={{
           
          }}
        ></div>
        
        <div className="content-container container mx-auto px-3 flex flex-col items-center justify-center w-full text-center relative z-10 h-full overflow-y-auto py-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-2 text-white py-1 text-animate">
            Crop Recommendation
          </h1>

          <div className="w-full max-w-4xl mx-auto bg-opacity-70 p-4 md:p-6 rounded-xl">
            <h3 className="text-lg md:text-xl font-semibold text-white text-center text-animate mb-1">
              Tell us about your agricultural field
            </h3>
            <h3 className="text-lg md:text-xl font-semibold mb-4 py-1 text-white text-center text-animate">
              Please enter the following soil and environmental details
            </h3>

            <form onSubmit={handleSubmit}>
              <div className="space-y-4 md:space-y-6">
                <div className="flex flex-row justify-center gap-2 md:gap-3 flex-nowrap md:flex-wrap">
                  <div className="min-w-[140px] md:min-w-[180px] flex-shrink-0">
                    <label className="block text-white mb-1 md:mb-2 text-center text-sm md:text-base">
                      Nitrogen (Kg)
                    </label>
                    <input
                      type="number"
                      name="nitrogen"
                      value={formData.nitrogen}
                      onChange={handleChange}
                      placeholder="90"
                      className="w-full bg-gray-700 text-white px-3 md:px-4 py-2 md:py-3 rounded-lg transition-effect hover:scale-105 focus:outline-none focus:ring-2 focus:ring-lime-500 text-sm md:text-base"
                    />
                  </div>

                  <div className="min-w-[140px] md:min-w-[180px] flex-shrink-0">
                    <label className="block text-white mb-1 md:mb-2 text-center text-sm md:text-base">
                      Phosphorous (Kg)
                    </label>
                    <input
                      type="number"
                      name="phosphorus"
                      value={formData.phosphorus}
                      onChange={handleChange}
                      placeholder="42"
                      className="w-full bg-gray-700 text-white px-3 md:px-4 py-2 md:py-3 rounded-lg transition-effect hover:scale-105 focus:outline-none focus:ring-2 focus:ring-lime-500 text-sm md:text-base"
                    />
                  </div>

                  <div className="min-w-[140px] md:min-w-[180px] flex-shrink-0">
                    <label className="block text-white mb-1 md:mb-2 text-center text-sm md:text-base">
                      Potassium (Kg)
                    </label>
                    <input
                      type="number"
                      name="potassium"
                      value={formData.potassium}
                      onChange={handleChange}
                      placeholder="43"
                      className="w-full bg-gray-700 text-white px-3 md:px-4 py-2 md:py-3 rounded-lg transition-effect hover:scale-105 focus:outline-none focus:ring-2 focus:ring-lime-500 text-sm md:text-base"
                    />
                  </div>

                  <div className="min-w-[140px] md:min-w-[180px] flex-shrink-0">
                    <label className="block text-white mb-1 md:mb-2 text-center text-sm md:text-base">
                      Temperature (°C)
                    </label>
                    <input
                      type="number"
                      name="temperature"
                      value={formData.temperature}
                      onChange={handleChange}
                      placeholder="21"
                      className="w-full bg-gray-700 text-white px-3 md:px-4 py-2 md:py-3 rounded-lg transition-effect hover:scale-105 focus:outline-none focus:ring-2 focus:ring-lime-500 text-sm md:text-base"
                    />
                  </div>
                </div>

                <div className="flex flex-row justify-center gap-2 md:gap-3 flex-wrap">
                  <div className="min-w-[140px] md:min-w-[180px]">
                    <label className="block text-white mb-1 md:mb-2 text-center text-sm md:text-base">
                      Humidity (%)
                    </label>
                    <input
                      type="number"
                      name="humidity"
                      value={formData.humidity}
                      onChange={handleChange}
                      placeholder="82"
                      className="w-full bg-gray-700 text-white px-3 md:px-4 py-2 md:py-3 rounded-lg transition-effect hover:scale-105 focus:outline-none focus:ring-2 focus:ring-lime-500 text-sm md:text-base"
                    />
                  </div>

                  <div className="min-w-[140px] md:min-w-[180px]">
                    <label className="block text-white mb-1 md:mb-2 text-center text-sm md:text-base">
                      pH Level
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      name="ph"
                      value={formData.ph}
                      onChange={handleChange}
                      placeholder="6.5"
                      className="w-full bg-gray-700 text-white px-3 md:px-4 py-2 md:py-3 rounded-lg transition-effect hover:scale-105 focus:outline-none focus:ring-2 focus:ring-lime-500 text-sm md:text-base"
                    />
                  </div>

                  <div className="min-w-[140px] md:min-w-[180px]">
                    <label className="block text-white mb-1 md:mb-2 text-center text-sm md:text-base">
                      Rainfall (mm)
                    </label>
                    <input
                      type="number"
                      name="rainfall"
                      value={formData.rainfall}
                      onChange={handleChange}
                      placeholder="203"
                      className="w-full bg-gray-700 text-white px-3 md:px-4 py-2 md:py-3 rounded-lg transition-effect hover:scale-105 focus:outline-none focus:ring-2 focus:ring-lime-500 text-sm md:text-base"
                    />
                  </div>
                </div>
              </div>

              <div className="text-center mt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-lime-500 hover:bg-lime-600 text-white font-bold py-2 px-6 rounded-2xl mt-4 mb-2 shadow-lg transition-all duration-300 ease-in-out text-base md:text-lg hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Getting Recommendations...' : 'Get Crop Recommendations'}
                </button>
              </div>
            </form>

            {recommendedCrop && (
              <div
                ref={resultRef}
                id="cropResult"
                className="mt-4 md:mt-6 bg-green-800 text-white p-3 md:p-4 rounded-lg text-lg md:text-xl font-semibold"
              >
                Recommended Crop:{' '}
                <span className="text-lime-300">{recommendedCrop}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .bg-crop-recommendation::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(6, 5, 5, 0.584);
          position: fixed;
          z-index: 0;
        }
        .hover-effect:hover {
          transform: scale(1.05);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        }
        .transition-effect {
          transition: all 0.3s ease;
        }
        .text-animate {
          animation: fadeIn 1s ease-in-out;
        }
        @keyframes fadeIn {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}


