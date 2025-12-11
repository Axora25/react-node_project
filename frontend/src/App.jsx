import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Services from './components/Services'
import PartnerBenefits from './components/PartnerBenefits'
import Login from './pages/Login'
import CropRecommendation from './pages/CropRecommendation'
import Weather from './pages/Weather'
import PestManagement from './pages/PestManagement'
import './App.css'
import Subsidies from './pages/Subsidies';

function Home() {
  return (
    <>
      <Hero />
      <section className="flex flex-col items-center px-4 md:px-0 bg-gray-950 text-white py-8">
        <div className="flex flex-col items-center mt-10 mb-8 text-center max-w-5xl font-monospace">
          <h1 className="text-4xl font-bold mb-4">Our Services</h1>
          <p className="text-sm md:text-base text-gray-400 leading-relaxed ">
            Discover our range of innovative services designed to empower farmers and promote sustainable agriculture.
            From personalized crop recommendations to advanced weather predictions and pest management solutions, we
            provide tools to help you grow smarter and more efficiently.
          </p>
        </div>
      </section>
      <Services />
      <PartnerBenefits />
      
      {/* Blogs Section */}
      <section id="blogs" className="bg-gray-950 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          {/* Heading */}
          <h2 className="text-4xl font-bold text-center mb-4 font-monospace">
            People's Latest <span className="text-green-600">Blogs</span>
          </h2>
          
          <p className="text-center mt-2 max-w-2xl mx-auto font-monospace">
            Discover insights on sustainable farming, investment opportunities, and industry trends.
            Explore some of the latest articles for expert advice and practical tips.
          </p>

          <div className="flex justify-center items-center gap-4 mt-6 mb-2">
            <button
              type="button"
              className="bg-lime-500 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors duration-300"
            >
              Write Your Own Blog
            </button>
            <button
              type="button"
              className="bg-lime-500 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors duration-300"
            >
              Read More Blogs
            </button>
          </div>
        </div>
      </section>
    </>
  )
}

function App() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/crop-recommendation" element={<CropRecommendation />} />
        <Route path="/weather" element={<Weather />} />
        <Route path="/pest-management" element={<PestManagement />} />
        <Route path="/subsidies" element={<Subsidies />} />
      </Routes>
    </div>
  )
}

export default App

