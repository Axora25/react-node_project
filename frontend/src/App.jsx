import React from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Services from './components/Services'
import PartnerBenefits from './components/PartnerBenefits'
import Login from './pages/Login'
import CropRecommendation from './pages/CropRecommendation'
import Weather from './pages/Weather'
import PestManagement from './pages/PestManagement'
import FarmTech from './pages/FarmTech'
import './App.css'
import Subsidies from './pages/Subsidies'
import Support from "./pages/Support"
import BlogForm from './components/BlogForm'
import HomeBlogSection from './components/HomeBlogSection'
import SingleBlog from "./pages/SingleBlog"
import BlogList from './components/BlogList'
import Feedback from './components/Feedback'
import FeedbackTestimonials from "./components/FeedbackTestimonials"
import Footer from './components/Footer';
import ProtectedRoute from "./components/ProtectedRoute"

function Home() {
  const navigate = useNavigate();

  return (
    <>
      <Hero />

      <section className="flex flex-col items-center px-4 md:px-0 bg-gray-950 text-white py-8">
        <div className="flex flex-col items-center mt-10 mb-8 text-center max-w-5xl font-monospace">
          <h1 className="text-4xl font-bold mb-4">Our Services</h1>
          <p className="text-sm md:text-base text-gray-400 leading-relaxed">
            Discover our range of innovative services designed to empower farmers and promote sustainable agriculture.
          </p>
        </div>
      </section>

      <Services />
      <PartnerBenefits />

      {/* Blogs Section */}
      <section id="blogs" className="bg-gray-950 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-4 font-monospace">
            People's Latest <span className="text-green-600">Blogs</span>
          </h2>

          <p className="text-center mt-2 max-w-2xl mx-auto font-monospace">
            Discover insights on sustainable farming and industry trends.
          </p>

          <div className="flex justify-center gap-4 mt-6 mb-2">
            <button
              onClick={() => navigate("/write-blog")}
              className="bg-lime-500 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-lg"
            >
              Write Your Own Blog
            </button>

            <button
              onClick={() => navigate("/blogs")}
              className="bg-lime-500 hover:bg-green-700 text-white px-6 py-3 rounded-lg"
            >
              Read More Blogs
            </button>
          </div>
        </div>
      </section>

      <HomeBlogSection />
      {/* <FeedbackTestimonials /> */}
      <Footer />
    </>
  )
}


function App() {
  return (
    <div className="min-h-screen">
      <Navbar />

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/blogs" element={<BlogList />} />
        <Route path="/blog/:id" element={<SingleBlog />} />

        {/* Protected Routes */}
        <Route
          path="/crop-recommendation"
          element={
            <ProtectedRoute>
              <CropRecommendation />
            </ProtectedRoute>
          }
        />

        <Route
          path="/weather"
          element={
            <ProtectedRoute>
              <Weather />
            </ProtectedRoute>
          }
        />

        <Route
          path="/pest-management"
          element={
            <ProtectedRoute>
              <PestManagement />
            </ProtectedRoute>
          }
        />

        <Route
          path="/subsidies"
          element={
            <ProtectedRoute>
              <Subsidies />
            </ProtectedRoute>
          }
        />

        <Route
          path="/support"
          element={
            <ProtectedRoute>
              <Support />
            </ProtectedRoute>
          }
        />

        <Route
          path="/write-blog"
          element={
            <ProtectedRoute>
              <BlogForm />
            </ProtectedRoute>
          }
        />

        <Route
          path="/feedback"
          element={
            <ProtectedRoute>
              <Feedback />
            </ProtectedRoute>
          }
        />
      
        <Route
          path="/farm-tech"
          element={
            <ProtectedRoute>
              <FarmTech  />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  )
}

export default App
