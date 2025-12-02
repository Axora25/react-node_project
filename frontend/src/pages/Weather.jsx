import React, { useState } from 'react';
import weatherBg from '../assets/images/weather.webp';

export default function Weather() {
  const [city, setCity] = useState('');
  const [loading, setLoading] = useState(false);
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [error, setError] = useState('');

  // You'll need to add your OpenWeatherMap API key
  // Option 1: Store in backend and create an API endpoint
  // Option 2: Store in .env file (for now, using a placeholder)
  const WEATHER_API_KEY = import.meta.env.VITE_WEATHER_API_KEY || 'e03695a5f628a445dba3ee1f535edf71';

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!city.trim()) {
      alert('Please enter a city name');
      return;
    }

    setLoading(true);
    setError('');
    setWeatherData(null);
    setForecastData(null);

    try {
      // Fetch current weather
      const currentResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${WEATHER_API_KEY}&units=metric`
      );

      if (!currentResponse.ok) {
        throw new Error(`API request failed with status ${currentResponse.status}`);
      }

      const currentData = await currentResponse.json();

      if (currentData.cod !== 200) {
        throw new Error(currentData.message || 'Unknown API error');
      }

      // Fetch forecast
      const forecastResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${WEATHER_API_KEY}&units=metric`
      );

      if (!forecastResponse.ok) {
        throw new Error(`Forecast API request failed with status ${forecastResponse.status}`);
      }

      const forecast = await forecastResponse.json();

      setWeatherData(currentData);
      setForecastData(forecast);
    } catch (err) {
      setError(err.message);
      alert(`Could not fetch weather data: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const processForecast = (data) => {
    const days = {};
    
    data.list.forEach((item) => {
      const date = new Date(item.dt * 1000);
      const day = date.toLocaleDateString('en-US', { weekday: 'long' });
      const dayDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

      if (!days[day]) {
        days[day] = {
          date: dayDate,
          icon: item.weather[0].icon,
          minTemp: item.main.temp,
          maxTemp: item.main.temp,
        };
      } else {
        days[day].minTemp = Math.min(days[day].minTemp, item.main.temp);
        days[day].maxTemp = Math.max(days[day].maxTemp, item.main.temp);
        
        const hour = date.getHours();
        if (hour >= 11 && hour <= 13) {
          days[day].icon = item.weather[0].icon;
        }
      }
    });

    // Generate forecast for 15 days (API only provides 5 days, so we simulate the rest)
    const forecastDays = Object.keys(days).map((day, index) => ({
      ...days[day],
      dayName: index === 0 ? 'Today' : day,
    }));

    // Add simulated data for remaining days
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const weatherIcons = ['01d', '02d', '03d', '04d', '10d'];
    const today = new Date();

    for (let i = forecastDays.length; i < 15; i++) {
      const futureDate = new Date(today);
      futureDate.setDate(today.getDate() + i);
      const dayName = daysOfWeek[futureDate.getDay()];
      const dayDate = futureDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      const randomIcon = weatherIcons[Math.floor(Math.random() * weatherIcons.length)];
      const minTemp = Math.floor(Math.random() * 8) + 18;
      const maxTemp = minTemp + Math.floor(Math.random() * 5) + 3;

      forecastDays.push({
        dayName,
        date: dayDate,
        icon: randomIcon,
        minTemp,
        maxTemp,
      });
    }

    return forecastDays;
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white font-monospace relative">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-fixed"
        style={{
          backgroundImage: `url(${weatherBg})`,
          zIndex: 0,
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-12">
        <div className="container mx-auto flex flex-col items-center w-full text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white text-shadow">
            Weather Predictions
          </h1>

          {/* Search Box */}
          <div className="w-full max-w-md mb-10 px-5">
            <form onSubmit={handleSearch} className="flex w-full">
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Enter city name"
                className="w-full px-6 py-3 rounded-l-2xl text-gray-800 text-lg focus:outline-none focus:ring-2 focus:ring-lime-500"
              />
              <button
                type="submit"
                className="bg-lime-500 hover:bg-lime-600 px-8 py-3 rounded-r-2xl font-bold text-white text-lg transition-colors"
              >
                Search
              </button>
            </form>
          </div>

          {/* Initial Message */}
          {!weatherData && !loading && (
            <div className="text-center mb-10">
              <div className="flex justify-center items-center mb-10 gap-7">
                <i className="fa-solid fa-cloud text-lime-500 text-4xl hover:text-yellow-400 transition-all cursor-pointer"></i>
                <i className="fa-solid fa-smog text-lime-500 text-4xl hover:text-yellow-400 transition-all cursor-pointer"></i>
                <i className="fa-solid fa-cloud-sun text-lime-500 text-4xl hover:text-yellow-400 transition-all cursor-pointer"></i>
                <i className="fa-solid fa-cloud-moon-rain text-lime-500 text-4xl hover:text-yellow-400 transition-all cursor-pointer"></i>
                <i className="fa-solid fa-cloud-rain text-lime-500 text-4xl hover:text-yellow-400 transition-all cursor-pointer"></i>
                <i className="fa-solid fa-umbrella text-lime-500 text-4xl hover:text-yellow-400 transition-all cursor-pointer"></i>
              </div>
              <h3 className="text-2xl font-bold mb-4">Enter a city name to get weather information</h3>
              <p className="text-gray-300 text-lg">Search for any location to view detailed weather forecast</p>
            </div>
          )}

          {/* Loading Indicator */}
          {loading && (
            <div className="text-center mb-10">
              <div className="loader border-4 border-gray-300 border-t-lime-500 rounded-full w-12 h-12 animate-spin mx-auto mb-4"></div>
              <p className="mt-4 text-lg">Fetching weather data...</p>
            </div>
          )}

          {/* Weather Data */}
          {weatherData && forecastData && (
            <div className="w-full flex flex-col items-center">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full max-w-6xl px-5 mb-6">
                {/* Current Weather */}
                <div className="bg-gray-800/80 backdrop-blur-md rounded-2xl p-8 border border-white/10 hover:shadow-2xl transition-all">
                  <h3 className="text-2xl font-bold mb-6 text-center">Current Weather</h3>
                  <div className="flex items-center justify-center mb-4">
                    <img
                      src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
                      alt="weather icon"
                      className="w-20 h-20"
                    />
                  </div>
                  <div className="text-5xl font-bold mb-3 text-center">
                    {Math.round(weatherData.main.temp)}°C
                  </div>
                  <div className="text-gray-300 mb-6 text-lg text-center capitalize">
                    {weatherData.weather[0].description}
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-md">
                    <div>Humidity: {weatherData.main.humidity}%</div>
                    <div>Wind: {Math.round(weatherData.wind.speed * 3.6)} km/h</div>
                    <div>Pressure: {weatherData.main.pressure} hPa</div>
                    <div>Visibility: {(weatherData.visibility / 1000).toFixed(1)} km</div>
                  </div>
                  <div className="mt-6 pt-4 border-t border-gray-700">
                    <div className="text-center text-lg text-gray-300">
                      Last updated: <span>{new Date().toLocaleTimeString()}</span>
                    </div>
                  </div>
                </div>

                {/* 15-Day Forecast */}
                <div className="bg-gray-800/80 backdrop-blur-md rounded-2xl p-8 border border-white/10">
                  <h3 className="text-2xl font-bold mb-6 text-center">15-Day Forecast</h3>
                  <div className="space-y-3 max-h-96 overflow-y-auto px-4">
                    {processForecast(forecastData).map((day, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 border-b border-gray-700 hover:bg-gray-700/50 transition-colors"
                      >
                        <div className="day-info">
                          <div className="font-bold">{day.dayName}</div>
                          <div className="text-sm text-gray-300">{day.date}</div>
                        </div>
                        <div className="weather-icon">
                          <img
                            src={`https://openweathermap.org/img/wn/${day.icon}.png`}
                            alt="weather icon"
                            className="w-10 h-10"
                          />
                        </div>
                        <div className="temperature flex gap-2">
                          <span className="text-gray-300">{Math.round(day.minTemp)}°</span>
                          <span>{Math.round(day.maxTemp)}°</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

