import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import logoImage from "../assets/images/image.png";

export default function Navbar() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      setLoggedIn(true);
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setLoggedIn(false);
    setUser(null);
    window.location.href = '/';
  };

  return (
    <header className="flex justify-between items-center bg-gray-950 h-14 sticky top-0 z-20 border-b-2 border-gray-900 px-4">
      
      {/* LEFT: Logo + Name */}
      <div className="flex gap-2 items-center">
        <Link to="/" className="flex gap-2 items-center">
          <img 
            src={logoImage} 
            alt="logo" 
            className="h-10 w-10 rounded-full object-cover bg-white p-1" 
          />
          <h3 className="text-white text-lg">AgriGrow</h3>
        </Link>
      </div>

      {/* RIGHT: NAV LINKS */}
      <div className="text-gray-400 flex gap-6 items-center ml-auto text-[16px]">
        <Link to="/" className="hover:text-white">Home</Link>
        <Link to="/subsidies" className="hover:text-white">Subsidies</Link>
        <Link to="/blogs" className="hover:text-white">Blog</Link>
        
        

        {/* LOGIN / PROFILE LOGIC */}
        {loggedIn ? (
          <>
            <span className="text-white">Hi, {user?.name}</span>
            <button onClick={handleLogout} className="hover:text-white">Logout</button>
          </>
        ) : (
          <Link to="/login" className="hover:text-white">Login</Link>
        )}
      </div>
    </header>
  );
}
