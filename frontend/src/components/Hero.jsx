// import React from 'react';
import heroVideo from '../assets/images/8333971-uhd_4096_2160_25fps.mp4';

const Hero = () => {
  return (
    <section className="relative w-full min-h-[85vh] flex items-center justify-center px-3 py-2 bg-gray-950 font-monospace">
      {/* Video Container with Rounded Corners */}
      <div className="relative w-full h-[88vh] rounded-2xl overflow-hidden shadow-2xl">
        {/* Video Background */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src={heroVideo} type="video/mp4" />
          Your browser does not support the video tag.
        </video>

      
      

        {/* Content */}
        <div className="relative z-10 h-full flex items-center justify-center px-4">
          <div className="flex flex-col items-center justify-center w-full max-w-5xl text-white gap-6 text-center">
            <h1 className="text-5xl md:text-5xl font-bold leading-tight">
              Sustainable farming
              <br className="hidden md:block" />
              for a healthier planet
            </h1>

            <p className="text-base md:text-xl mb-8 leading-relaxed font-bold text-gray-100 max-w-3xl">
              Empowering farmers with smart, eco-friendly practices to boost crop yield while protecting the environment. Get personalized crop recommendations based on your soil and weather conditions. Together, lets grow more with less and build a greener tomorrow.
            </p>

            <button className="bg-lime-500 hover:bg-green-600 text-white font-semibold px-10 py-3 rounded-2xl text-lg transition-colors duration-300 shadow-lg shadow-lime-500/30">
              Get Started
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

