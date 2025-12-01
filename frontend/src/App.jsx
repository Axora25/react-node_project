import React from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Services from './components/Services'
import './App.css'

function App() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <section className="flex flex-col items-center px-4 md:px-0 bg-gray-950 text-white py-8">
        <div className="flex flex-col items-center mt-10 mb-8 text-center max-w-4xl font-monospace">
          <h1 className="text-4xl font-bold mb-4">Our Services</h1>
          <p className="text-sm md:text-base text-gray-400 leading-relaxed ">
            Discover our range of innovative services designed to empower farmers and promote sustainable agriculture.
            From personalized crop recommendations to advanced weather predictions and pest management solutions, we
            provide tools to help you grow smarter and more efficiently.
          </p>
        </div>
      </section>
      <Services />
      
    </div>
  )
}

export default App

