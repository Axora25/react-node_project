import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-950 text-white font-monospace">
      
      {/* Top Footer */}
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10 items-start">

          {/* Quick Links */}
          <div className="md:ml-16 lg:ml-20">
            <h3 className="text-lg font-bold mb-3 font-monospace">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="hover:underline">Home</Link></li>
              <li><Link to="/blogs" className="hover:underline">Blog</Link></li>
              <li><Link to="/subsidies" className="hover:underline">Subsidies</Link></li>
            </ul>
          </div>

          {/* Our Services */}
          <div className="md:ml-10 lg:ml-15">
            <h3 className="text-lg font-bold mb-3 font-monospace">Our Services</h3>
            <ul className="space-y-2">
              <li><Link to="/crop-recommendation" className="hover:underline">Crop Recommendation</Link></li>
              <li><Link to="/weather" className="hover:underline">Weather Alerts</Link></li>
              <li><Link to="/pest-management" className="hover:underline">Pest Management</Link></li>
            </ul>
          </div>

          {/* Social Links */}
          <div className="md:ml-8 lg:ml-12">
            <h3 className="text-lg font-bold mb-3 font-monospace">Social Links</h3>
            <ul className="space-y-2">
              <li><a href="https://www.linkedin.com" target="_blank" className="hover:underline">LinkedIn</a></li>
              <li><a href="https://www.github.com" target="_blank" className="hover:underline">GitHub</a></li>
              <li><a href="https://www.twitter.com" target="_blank" className="hover:underline">Twitter</a></li>
            </ul>
          </div>

        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-700 text-center py-4 text-sm">
        © {new Date().getFullYear()} AgriGrow. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
