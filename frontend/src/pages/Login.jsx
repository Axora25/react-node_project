import { useState, useMemo } from 'react';
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

  const bgStyle = useMemo(() => ({
    backgroundImage: `url(${seedsImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat'
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
      className="min-h-screen w-full flex items-center justify-center font-[Montserrat] bg-gray-950/90 backdrop-blur-sm px-4"
      style={bgStyle}
    >
      <div
        id="container"
        className={`container relative bg-white rounded-[30px] shadow-lg overflow-hidden w-full max-w-4xl min-h-[480px] transition-all duration-500 ${!isLogin ? 'active' : ''}`}
      >
        {/* Sign Up Form */}
        <div className={`form-container sign-up absolute top-0 h-full w-1/2 left-0 ${isLogin ? 'opacity-0 z-0 translate-x-0' : 'opacity-100 z-10 translate-x-full'} transition-all duration-500`}>
          <form className="bg-white flex items-center justify-center flex-col px-10 h-full gap-2" onSubmit={handleSubmit}>
            <h1 className="text-2xl font-bold mb-1">Create Profile</h1>
            <span className="text-xs mb-4 text-gray-500">Or use your email for registration</span>

            <input
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
              className="bg-gray-100 border-none my-2 py-2.5 px-4 text-sm rounded-lg w-full outline-none"
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="bg-gray-100 border-none my-2 py-2.5 px-4 text-sm rounded-lg w-full outline-none"
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="bg-gray-100 border-none my-2 py-2.5 px-4 text-sm rounded-lg w-full outline-none"
              required
              minLength={6}
            />
            <div className="flex items-center justify-start w-full my-2 gap-4 text-sm text-gray-700">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="role"
                  value="farmer"
                  checked={formData.role === 'farmer'}
                  onChange={handleChange}
                />
                <span>User</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="role"
                  value="admin"
                  checked={formData.role === 'admin'}
                  onChange={handleChange}
                />
                <span>Admin</span>
              </label>
            </div>

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
        <div className={`form-container sign-in absolute top-0 h-full w-1/2 left-0 transition-all duration-500 ${isLogin ? 'z-20 translate-x-0' : 'translate-x-full'}`}>
          <form className="bg-white flex items-center justify-center flex-col px-10 h-full gap-2" onSubmit={handleSubmit}>
            <h1 className="text-2xl font-bold mb-1">Login</h1>
            <span className="text-xs mb-4 text-gray-500">Or use your email and password</span>

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="bg-gray-100 border-none my-2 py-2.5 px-4 text-sm rounded-lg w-full outline-none"
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="bg-gray-100 border-none my-2 py-2.5 px-4 text-sm rounded-lg w-full outline-none"
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
        <div className="toggle-container absolute top-0 left-1/2 w-1/2 h-full overflow-hidden rounded-[150px_0_0_100px] z-30 transition-all duration-500">
          <div className="toggle bg-gradient-to-r from-indigo-600 to-indigo-800 h-full text-white relative left-[-100%] w-[200%] transition-all duration-500">
            <div className="toggle-panel toggle-left absolute w-1/2 h-full flex items-center justify-center flex-col px-8 text-center top-0 transform -translate-x-[200%]">
              <h1 className="text-2xl font-bold mb-2">Welcome back!</h1>
              <p className="text-sm leading-5 tracking-wider my-5">Enter your personal details to stay connected.</p>
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
            <div className="toggle-panel toggle-right absolute w-1/2 h-full flex items-center justify-center flex-col px-8 text-center top-0 right-0 transform translate-x-0">
              <h1 className="text-2xl font-bold mb-2">Welcome to AgriGrow!</h1>
              <p className="text-sm leading-5 tracking-wider my-5">Create your free account to access all features.</p>
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
    </div>
  );
}
