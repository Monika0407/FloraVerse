import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { UserRole } from '../types';
import { Sprout, ArrowRight, UserCircle, Store, AlertCircle } from 'lucide-react';

const Auth: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login, register, user } = useStore();

  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState<UserRole>(UserRole.BUYER);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  // Handle URL role changes
  useEffect(() => {
    const roleParam = searchParams.get('role');
    if (roleParam === 'seller') {
      setRole(UserRole.SELLER);
    } else if (roleParam === 'buyer') {
      setRole(UserRole.BUYER);
    }
    // If no param, we default to whatever state is (initial buyer)
  }, [searchParams]);

  useEffect(() => {
    if (user) {
      if (user.role === UserRole.SELLER) navigate('/seller-dashboard');
      else navigate('/buyer-dashboard');
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isLogin) {
      // Login Logic
      const success = await login(formData.email, formData.password);
      if (!success) {
        setError('Invalid email or password. Please try again.');
      }
    } else {
      // Signup Logic & Validation
      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters long.');
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match.');
        return;
      }
      if (!formData.name) {
        setError('Name is required.');
        return;
      }

      const success = await register(formData.name, formData.email, formData.password, role);
      if (!success) {
        setError('Registration failed. Email might be already in use.');
      }
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-gradient-to-br from-flora-50 to-flora-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row">

        {/* Left Side - Visual */}
        <div className="md:w-1/2 bg-flora-900 relative p-8 md:p-12 flex flex-col justify-between text-white overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1470058869958-2a77ade41c02?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80')] bg-cover bg-center opacity-40"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-flora-900/90 to-transparent"></div>

          <div className="relative z-10">
            <div className="flex items-center space-x-2 mb-6">
              <Sprout className="h-8 w-8 text-flora-400" />
              <span className="text-2xl font-bold font-serif">Floraverse</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {role === UserRole.SELLER ? 'Grow Your Business' : 'Grow Your Garden'}
            </h2>
            <p className="text-flora-100 text-lg">
              {role === UserRole.SELLER
                ? 'Connect with thousands of garden enthusiasts and manage your inventory with ease.'
                : 'Discover rare seeds, quality tools, and expert advice for your green sanctuary.'}
            </p>
          </div>

          <div className="relative z-10 mt-8 md:mt-0">
            <div className="inline-flex items-center bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/20">
              {role === UserRole.SELLER ? <Store className="h-5 w-5 mr-2" /> : <UserCircle className="h-5 w-5 mr-2" />}
              <span className="font-medium">{role === UserRole.SELLER ? 'Seller Portal' : 'Buyer Portal'}</span>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="md:w-1/2 p-8 md:p-12 bg-white">
          <div className="text-center md:text-left mb-6">
            <h3 className="text-2xl font-bold text-gray-900">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              {isLogin ? 'Sign in to access your dashboard.' : `Register as a ${role} to get started.`}
            </p>
          </div>

          {error && (
            <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-4 flex items-center">
              <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-flora-500 focus:border-transparent transition"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input
                type="email"
                required
                className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-flora-500 focus:border-transparent transition"
                placeholder="you@example.com"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                required
                className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-flora-500 focus:border-transparent transition"
                placeholder="••••••••"
                value={formData.password}
                onChange={e => setFormData({ ...formData, password: e.target.value })}
              />
            </div>

            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                <input
                  type="password"
                  required
                  className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-flora-500 focus:border-transparent transition"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })}
                />
              </div>
            )}

            <button
              type="submit"
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-flora-600 hover:bg-flora-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-flora-500 transition-all duration-200 transform hover:translate-y-[-1px] mt-2"
            >
              {isLogin ? 'Sign In' : 'Create Account'}
              <ArrowRight className="ml-2 h-4 w-4" />
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
              <button
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError('');
                  setFormData({ name: '', email: '', password: '', confirmPassword: '' });
                }}
                className="font-medium text-flora-600 hover:text-flora-500 transition-colors"
              >
                {isLogin ? "Sign Up Now" : "Sign In"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
