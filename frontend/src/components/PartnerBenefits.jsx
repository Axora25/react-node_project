import React from 'react'
import farmTechImg from '../assets/images/farm_tech.svg'
import supportImg from '../assets/images/support.svg'
import feedbackImg from '../assets/images/feed.webp'

export default function PartnerBenefits() {
  return (
    <section className="bg-gray-950 text-white px-1 md:px-0 py-1">
      <div className="partner bg-gray-800 px-3 py-3 mt-2 max-w-4xl mx-auto rounded-2xl text-center font-monospace ">
        <h1 className="text-3xl p-2 font-bold">
          Benefits <span className="font-normal">to be partnered with us</span>
        </h1>

        <p className="text-lg mb-4 text-gray-200">
          Partner with us to access advanced agricultural technologies and expert support.
        </p>

        <div className="flex justify-center gap-8 md:gap-12 flex-wrap items-end">
          {/* Farm Tech */}
          <a
            href="#farm-tech"
            className="flex flex-col items-center transform transition-transform hover:scale-110 cursor-pointer"
          >
            <div className="h-32 w-32 mb-4 flex items-center justify-center">
              <img src={farmTechImg} alt="Farm Tech" className="h-32 w-32 object-contain" />
            </div>
            <p className="text-lg font-medium">Farm Tech</p>
          </a>

          {/* Support */}
          <a
            href="#support"
            className="flex flex-col items-center transform transition-transform hover:scale-110 cursor-pointer"
          >
            <div className="h-32 w-32 mb-4 flex items-center justify-center">
              <img src={supportImg} alt="Support" className="h-32 w-32 object-contain" />
            </div>
            <p className="text-lg font-medium">Support</p>
          </a>

          {/* Feedback */}
          <a
            href="#feedback"
            className="flex flex-col items-center transform transition-transform hover:scale-110 cursor-pointer"
          >
            <div className="h-32 w-32 mb-4 flex items-center justify-center">
              <img src={feedbackImg} alt="Feedback" className="h-32 w-32 rounded-full object-cover" />
            </div>
            <p className="text-lg font-medium">Feedback</p>
          </a>
        </div>
      </div>
    </section>
  )
}


