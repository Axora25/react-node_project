import React, { useState } from "react";
import logoImage from "../assets/images/image.png"; // adjust path if needed

export default function Navbar() {
  // Simulating login state (replace with real auth later)
  const [loggedIn, setLoggedIn] = useState(false);

  return (
    <header className="flex justify-between items-center bg-gray-950 h-14 sticky top-0 z-20 border-b-2 border-gray-900 px-4">
      
      {/* LEFT: Logo + Name */}
      <div className="flex gap-2 items-center">
        <a href="/" className="flex gap-2 items-center">
          <img 
            src={logoImage} 
            alt="logo" 
            className="h-10 w-10 rounded-full object-cover bg-white p-1" 
          />
          <h3 className="text-white text-lg">AgriGrow</h3>
        </a>
      </div>

      {/* RIGHT: NAV LINKS */}
      <div className="text-gray-400 flex gap-6 items-center ml-auto text-[16px]">
        <a href="/" className="hover:text-white">Home</a>
        <a href="/subsidies" className="hover:text-white">Subsidies</a>
        <a href="/blog" className="hover:text-white">Blog</a>

        {/* LOGIN / PROFILE LOGIC */}
        {loggedIn ? (
          <a href="/profile" className="hover:text-white">Profile</a>
        ) : (
          <a href="/login" className="hover:text-white">Login</a>
        )}
      </div>
    </header>
  );
}
