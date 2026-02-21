import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Leaf, ShieldCheck, Sun, Star } from 'lucide-react';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-[600px] flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?ixlib=rb-1.2.1&auto=format&fit=crop&w=2089&q=80"
            alt="Garden background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-flora-950/80 to-flora-900/40 backdrop-blur-[2px]"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block py-1 px-3 rounded-full bg-flora-500/20 border border-flora-400/30 text-flora-200 text-sm font-semibold mb-6 backdrop-blur-md">
            #1 Gardening Marketplace
          </span>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 font-serif tracking-tight leading-tight">
            Grow Your Own <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-flora-300 to-flora-500">Paradise</span>
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-flora-100 font-light leading-relaxed">
            Connect with nature through our curated marketplace. From rare seeds to AI-powered expert advice, we nurture your gardening journey.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/auth?role=buyer"
              className="px-8 py-4 bg-flora-500 hover:bg-flora-600 text-white font-semibold rounded-full shadow-lg shadow-flora-500/30 transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center"
            >
              Start Shopping
            </Link>
            <Link
              to="/ai-assistant"
              className="px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/30 text-white font-semibold rounded-full transition-all duration-300 flex items-center justify-center"
            >
              Ask AI Assistant <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-base text-flora-600 font-semibold tracking-wide uppercase">Why Choose Floraverse?</h2>
            <p className="mt-2 text-4xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-5xl font-serif">
              Cultivating Excellence
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Feature 1 */}
            <div className="group p-8 bg-flora-50 rounded-3xl border border-flora-100 hover:shadow-xl transition-all duration-300 hover:bg-white relative overflow-hidden">
              <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-flora-200 rounded-full opacity-50 blur-2xl group-hover:bg-flora-300 transition-all"></div>
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-6 group-hover:scale-110 transition-transform">
                <Leaf className="h-7 w-7 text-flora-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Premium Quality</h3>
              <p className="text-gray-600 leading-relaxed">
                We partner directly with certified organic nurseries to ensure every plant and seed meets our high standards of vitality.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group p-8 bg-flora-50 rounded-3xl border border-flora-100 hover:shadow-xl transition-all duration-300 hover:bg-white relative overflow-hidden">
              <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-flora-200 rounded-full opacity-50 blur-2xl group-hover:bg-flora-300 transition-all"></div>
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-6 group-hover:scale-110 transition-transform">
                <Sun className="h-7 w-7 text-flora-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">AI Expert Advice</h3>
              <p className="text-gray-600 leading-relaxed">
                Struggling with a wilting plant? Our Gemini-powered AI assistant diagnoses diseases and offers care tips instantly.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group p-8 bg-flora-50 rounded-3xl border border-flora-100 hover:shadow-xl transition-all duration-300 hover:bg-white relative overflow-hidden">
              <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-flora-200 rounded-full opacity-50 blur-2xl group-hover:bg-flora-300 transition-all"></div>
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-6 group-hover:scale-110 transition-transform">
                <ShieldCheck className="h-7 w-7 text-flora-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Secure Marketplace</h3>
              <p className="text-gray-600 leading-relaxed">
                Buy with confidence. Our vetted sellers and secure transaction process protect your purchases from seed to bloom.
              </p>
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