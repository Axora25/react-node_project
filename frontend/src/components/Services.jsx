// import React from 'react'
import { Link } from 'react-router-dom'
import cropImg from '../assets/images/crop_rec.png'
import weatherImg from '../assets/images/3ZRAI3Y3EBFF7NGTSBCIS7EGRI.avif'
import pestImg from '../assets/images/pest.webp'
import subsidiesImg from '../assets/images/subsidies.png'

const services = [
  {
    id: 'crop',
    title: 'Crop Recommendation',
    description:
      'Discover the best crops for your soil and climate using data-driven recommendations tailored to your farm.',
    image: cropImg,
    link: '/crop-recommendation',
  },
  {
    id: 'weather',
    title: 'Weather Forecast',
    description:
      'Stay ahead of changing conditions with hyperlocal forecasts that help you plan irrigation and harvest.',
    image: weatherImg,
    link: '/weather',
  },
  {
    id: 'pest',
    title: 'Pest Management Chatbot',
    description:
      'Connect with an AI assistant that helps you detect and treat pests or diseases early.',
    image: pestImg,
    link: '/pest-management',
  },
  {
    id: 'subsidies',
    title: 'Government Subsidies',
    description:
      'Explore and track agriculture subsidy programs so you never miss financial support opportunities.',
    image: subsidiesImg,
    link: '#government-subsidies',
  },
]

export default function Services() {
  return (
    <section className="flex flex-col items-center px-4 md:px-0 bg-gray-950 text-white pb-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto w-full font-monospace">
        {services.map((service) => (
          <Link key={service.id} to={service.link} className="block">
            <div className="rounded-xl border-2 bg-gray-800 border-gray-900/60 min-h-[280px] flex flex-col hover:scale-105 transition-transform duration-300 ease-in-out">
              <img
                src={service.image}
                alt={service.title}
                className="h-[280px] w-full object-cover rounded-t-xl"
              />
              <div className="p-4 flex flex-col flex-grow text-left">
                <h3 className="text-lg font-bold mb-2">{service.title}</h3>
                <p className="text-sm text-gray-400">{service.description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}

