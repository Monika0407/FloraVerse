import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Leaf, ShieldCheck, Sun, Star } from 'lucide-react';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-[750px] flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0 scale-105 animate-slow-pan">
          <img
            src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=90"
            alt="Garden background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-flora-950/70 via-flora-900/40 to-white backdrop-blur-[1px]"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center animate-fade-in-up">
          <span className="inline-block py-1.5 px-4 rounded-full bg-flora-500/20 border border-flora-400/30 text-flora-100 text-sm font-bold mb-8 backdrop-blur-xl animate-pulse-soft shadow-glass">
            ✨ The Future of Gardening
          </span>
          <h1 className="text-6xl md:text-8xl font-black text-white mb-8 font-serif tracking-tight leading-[1.1]">
            Your Space, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-flora-200 via-flora-400 to-flora-200">Reimagined</span>
          </h1>
          <p className="mt-4 max-w-3xl mx-auto text-xl md:text-2xl text-flora-50 font-medium leading-relaxed opacity-90">
            A premium sanctuary for plant lovers. Discover rare species, trade with certified nurseries, and grow with AI guidance.
          </p>

          <div className="mt-12 flex flex-col sm:flex-row gap-6 justify-center">
            <Link
              to="/auth?role=buyer"
              className="px-10 py-5 bg-flora-500 hover:bg-flora-600 text-white font-bold rounded-2xl shadow-xl shadow-flora-900/20 transition-all duration-500 hover:scale-105 hover:shadow-flora-500/40 flex items-center justify-center group"
            >
              Start Your Journey
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/ai-assistant"
              className="px-10 py-5 bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/20 text-white font-bold rounded-2xl transition-all duration-500 hover:scale-105 flex items-center justify-center"
            >
              Consult the AI
            </Link>
          </div>
        </div>

        {/* Decorative Floating Elements */}
        <div className="absolute top-1/4 left-10 w-24 h-24 bg-flora-400/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 right-10 w-32 h-32 bg-emerald-400/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Features Section */}
      <div className="py-32 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-24">
            <h2 className="text-flora-600 font-bold tracking-[0.2em] uppercase text-sm mb-4">Innovation in Horticulture</h2>
            <p className="text-5xl md:text-6xl font-black text-gray-900 font-serif leading-tight">
              Cultivating the <br /> <span className="text-flora-500">Exceptional</span>
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10">
            {/* Feature 1 */}
            <div className="group relative">
              <div className="absolute inset-0 bg-flora-500/5 rounded-[2rem] transform group-hover:scale-105 group-hover:rotate-2 transition-all duration-500"></div>
              <div className="relative p-10 bg-white rounded-[2rem] border border-gray-100 shadow-premium hover:shadow-2xl transition-all duration-500 flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-flora-50 rounded-3xl flex items-center justify-center mb-8 rotate-3 group-hover:rotate-12 transition-all duration-500">
                  <Leaf className="h-10 w-10 text-flora-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4 font-serif">Arisanal Quality</h3>
                <p className="text-gray-500 leading-relaxed text-lg">
                  Direct partnerships with world-class nurseries ensuring every specimen meets the gold standard of vitality.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="group relative">
              <div className="absolute inset-0 bg-flora-500/5 rounded-[2rem] transform group-hover:scale-105 group-hover:-rotate-2 transition-all duration-500"></div>
              <div className="relative p-10 bg-white rounded-[2rem] border border-gray-100 shadow-premium hover:shadow-2xl transition-all duration-500 flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-flora-50 rounded-3xl flex items-center justify-center mb-8 -rotate-3 group-hover:-rotate-12 transition-all duration-500">
                  <Sun className="h-10 w-10 text-flora-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4 font-serif">Algorithmic Insight</h3>
                <p className="text-gray-500 leading-relaxed text-lg">
                  Harness the power of AI to diagnose, predict, and curate your personal garden sanctuary with precision.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="group relative">
              <div className="absolute inset-0 bg-flora-500/5 rounded-[2rem] transform group-hover:scale-105 group-hover:rotate-2 transition-all duration-500"></div>
              <div className="relative p-10 bg-white rounded-[2rem] border border-gray-100 shadow-premium hover:shadow-2xl transition-all duration-500 flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-flora-50 rounded-3xl flex items-center justify-center mb-8 rotate-3 group-hover:rotate-12 transition-all duration-500">
                  <ShieldCheck className="h-10 w-10 text-flora-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4 font-serif">Elite Marketplace</h3>
                <p className="text-gray-500 leading-relaxed text-lg">
                  A secure, vetted ecosystem where premium enthusiasts and growers connect with absolute confidence.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-flora-900 py-16 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col md:flex-row items-center justify-between">
          <div className="text-left mb-8 md:mb-0">
            <h2 className="text-3xl font-bold text-white font-serif">Ready to start planting?</h2>
            <p className="mt-2 text-flora-200 text-lg">Join our community of over 50,000 gardeners today.</p>
          </div>
          <div className="flex gap-4">
            <Link to="/auth?role=seller" className="px-6 py-3 bg-white text-flora-900 font-semibold rounded-lg hover:bg-flora-50 transition-colors">
              Become a Seller
            </Link>
            <Link to="/auth?role=buyer" className="px-6 py-3 bg-flora-600 text-white font-semibold rounded-lg hover:bg-flora-500 transition-colors">
              Shop Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;