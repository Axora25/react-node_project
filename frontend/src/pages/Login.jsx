import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import seedsImage from '../assets/images/farm.jpg';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'farmer'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Prevent page scroll while on login screen (navbar already exists above this page)
  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevOverflow || '';
    };
  }, []);

  // Load fonts only for this page (headings: Playfair Display, body/buttons: Montserrat)
  useEffect(() => {
    const linkId = 'ag-login-fonts';
    if (!document.getElementById(linkId)) {
      const link = document.createElement('link');
      link.id = linkId;
      link.rel = 'stylesheet';
      link.href =
        'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&family=Playfair+Display:wght@600;700&display=swap';
      document.head.appendChild(link);
    }
    return () => {
      // We can remove it to keep the scope limited to this page
      const existing = document.getElementById(linkId);
      if (existing) existing.remove();
    };
  }, []);

  const bgStyle = useMemo(() => ({
    backgroundImage: `url(${seedsImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundAttachment: 'fixed'
  }), []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/signup';
      const body = isLogin
        ? { email: formData.email, password: formData.password }
        : { name: formData.name, email: formData.email, password: formData.password, role: formData.role };

      const response = await fetch(`http://localhost:5000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      navigate('/');
      window.location.reload();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="ag-login relative isolate w-full h-[calc(100vh-56px)] overflow-hidden flex items-center justify-center px-4"
      style={bgStyle}
    >
      {/* Background overlay (keeps background fixed and prevents content scroll) */}
      <div className="absolute inset-0 bg-black/35 backdrop-blur-sm" />

      <div
        id="container"
        className="container relative bg-white rounded-[30px] shadow-lg overflow-hidden w-full max-w-4xl z-10"
        style={{ height: 'min(480px, 100%)' }}
      >
        {/* Sign Up Form */}
        <div
          className="form-container sign-up absolute top-0 h-full w-1/2 left-0 transition-all duration-700 ease-in-out"
          style={{
            transform: isLogin ? 'translateX(0%)' : 'translateX(100%)',
            opacity: isLogin ? 0 : 1,
            zIndex: isLogin ? 0 : 10,
            pointerEvents: isLogin ? 'none' : 'auto'
          }}
        >
          <form className="bg-white flex items-center justify-center flex-col px-10 h-full gap-2" onSubmit={handleSubmit}>
            <h1 className="ag-login__heading text-xl font-bold mb-1">Create Profile</h1>
            <span className="text-[11px] mb-2 text-gray-500">Or use your email for registration</span>

            <input
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
              autoComplete="off"
              className="ag-login__input bg-gray-100 border border-transparent my-1 py-2 px-4 text-[13px] rounded-lg w-full outline-none shadow-none focus:outline-none focus-visible:outline-none focus:ring-0 focus-visible:ring-0 focus:shadow-none focus:border-transparent"
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              autoComplete="email"
              className="ag-login__input bg-gray-100 border border-transparent my-1 py-2 px-4 text-[13px] rounded-lg w-full outline-none shadow-none focus:outline-none focus-visible:outline-none focus:ring-0 focus-visible:ring-0 focus:shadow-none focus:border-transparent"
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              autoComplete={isLogin ? 'current-password' : 'new-password'}
              className="ag-login__input bg-gray-100 border border-transparent my-1 py-2 px-4 text-[13px] rounded-lg w-full outline-none shadow-none focus:outline-none focus-visible:outline-none focus:ring-0 focus-visible:ring-0 focus:shadow-none focus:border-transparent"
              required
              minLength={6}
            />
            

            <button
              type="submit"
              disabled={loading}
              className="bg-indigo-800 text-white text-xs py-2.5 px-11 border border-transparent rounded-lg font-semibold tracking-wider uppercase mt-2.5 cursor-pointer disabled:opacity-60"
            >
              {loading ? 'Loading...' : 'Register'}
            </button>
            {error && !isLogin && (
              <p className="text-red-600 mt-3 text-sm font-medium text-center">{error}</p>
            )}
          </form>
        </div>

        {/* Sign In Form */}
        <div
          className="form-container sign-in absolute top-0 h-full w-1/2 left-0 transition-all duration-700 ease-in-out"
          style={{
            transform: isLogin ? 'translateX(0%)' : 'translateX(100%)',
            zIndex: isLogin ? 20 : 5,
            pointerEvents: isLogin ? 'auto' : 'none'
          }}
        >
          <form className="bg-white flex items-center justify-center flex-col px-10 h-full gap-2" onSubmit={handleSubmit}>
            <h1 className="ag-login__heading text-xl font-bold mb-1">Login</h1>
            <span className="text-[11px] mb-4 text-gray-500">Or use your email and password</span>

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              autoComplete="email"
              className="ag-login__input bg-gray-100 border border-transparent my-1 py-2 px-4 text-[13px] rounded-lg w-full outline-none shadow-none focus:outline-none focus-visible:outline-none focus:ring-0 focus-visible:ring-0 focus:shadow-none focus:border-transparent"
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              autoComplete="current-password"
              className="ag-login__input bg-gray-100 border border-transparent my-1 py-2 px-4 text-[13px] rounded-lg w-full outline-none shadow-none focus:outline-none focus-visible:outline-none focus:ring-0 focus-visible:ring-0 focus:shadow-none focus:border-transparent"
              required
            />

            <button
              type="submit"
              disabled={loading}
              className="bg-indigo-800 text-white text-xs mt-3 py-2.5 px-11 border border-transparent rounded-lg font-semibold tracking-wider uppercase cursor-pointer disabled:opacity-60"
            >
              {loading ? 'Loading...' : 'Login'}
            </button>
            {error && isLogin && (
              <p className="text-red-600 mt-3 text-sm font-medium text-center">{error}</p>
            )}
          </form>
        </div>

        {/* Toggle Panel */}
        <div
          className="toggle-container absolute top-0 left-1/2 h-full w-1/2 overflow-hidden z-30 transition-all duration-700 ease-in-out"
          style={{
            transform: isLogin ? 'translateX(0%)' : 'translateX(-100%)',
            borderRadius: isLogin ? '150px 0 0 100px' : '0 150px 100px 0'
          }}
        >
          <div
            className="toggle bg-gradient-to-r from-indigo-600 to-indigo-800 h-full text-white relative w-[200%] transition-all duration-700 ease-in-out"
            style={{
              left: '-100%',
              transform: isLogin ? 'translateX(0%)' : 'translateX(50%)'
            }}
          >
            <div
              className="toggle-panel toggle-left absolute w-1/2 h-full flex items-center justify-center flex-col px-10 text-center top-0 transition-all duration-700 ease-in-out"
              style={{ transform: isLogin ? 'translateX(-200%)' : 'translateX(0%)' }}
            >
              <h1 className="ag-login__heading text-xl font-bold mb-2">Welcome back!</h1>
              <p className="text-[13px] leading-5 tracking-wider my-4 max-w-[260px]">
                Enter your personal details to stay connected.
              </p>
              <button
                type="button"
                onClick={() => {
                  setIsLogin(true);
                  setError('');
                }}
                className="bg-transparent border border-white text-white text-xs py-2.5 px-11 rounded-lg font-semibold tracking-wider uppercase cursor-pointer"
              >
                Login
              </button>
            </div>
            <div
              className="toggle-panel toggle-right absolute w-1/2 h-full flex items-center justify-center flex-col px-10 text-center top-0 right-0 transition-all duration-700 ease-in-out"
              style={{ transform: isLogin ? 'translateX(0%)' : 'translateX(200%)' }}
            >
              <h1 className="ag-login__heading text-xl font-bold mb-2">Welcome to AgriGrow!</h1>
              <p className="text-[13px] leading-5 tracking-wider my-4 max-w-[280px]">
                Create your free account to access all features.
              </p>
              <button
                type="button"
                onClick={() => {
                  setIsLogin(false);
                  setError('');
                }}
                className="bg-transparent border border-white text-white text-xs py-2.5 px-11 rounded-lg font-semibold tracking-wider uppercase cursor-pointer"
              >
                Register
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Page-scoped typography */}
      <style>{`
        .ag-login, .ag-login * { font-family: 'Montserrat', system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif; }
        .ag-login__heading { font-family: 'Playfair Display', Georgia, 'Times New Roman', serif; letter-spacing: 0.02em; }
        /* Force inputs to ALWAYS stay gray (no hover color change) and remove any browser/Bootstrap glow/border */
        .ag-login .ag-login__input {
          background-color: #f3f4f6 !important; /* gray-100 */
          outline: none !important;
          box-shadow: none !important;
          border-color: transparent !important;
        }
        .ag-login .ag-login__input:hover,
        .ag-login .ag-login__input:focus,
        .ag-login .ag-login__input:focus-visible {
          background-color: #f3f4f6 !important; /* keep same */
          outline: none !important;
          box-shadow: none !important;
          border-color: transparent !important;
        }
      `}</style>
    </div>
  );
}
