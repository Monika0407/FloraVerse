import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { ProductCategory, Product } from '../types';
import { Search, ShoppingCart, Plus, Minus, Filter, CloudSun, Droplets, Thermometer, AlertCircle, Loader2 } from 'lucide-react';

const BuyerDashboard: React.FC = () => {
  const { products, addToCart, loading, user } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  // Weather State
  const [weather, setWeather] = useState({
    temp: 24,
    condition: 'Detecting...',
    humidity: 65,
    location: 'Your Garden'
  });
  const [weatherLoading, setWeatherLoading] = useState(true);
  const [weatherError, setWeatherError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeather = async (lat: number, lon: number) => {
      try {
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code&timezone=auto`
        );
        if (!response.ok) throw new Error('Weather data fetch failed');
        const data = await response.json();

        const weatherCodes: Record<number, string> = {
          0: 'Clear sky',
          1: 'Mainly clear', 2: 'Partly cloudy', 3: 'Overcast',
          45: 'Fog', 48: 'Fog',
          51: 'Light drizzle', 53: 'Drizzle', 55: 'Heavy drizzle',
          61: 'Slight rain', 63: 'Rain', 65: 'Heavy rain',
          71: 'Slight snow', 73: 'Snow', 75: 'Heavy snow',
          80: 'Slight showers', 81: 'Showers', 82: 'Violent showers',
          95: 'Thunderstorm',
        };

        setWeather({
          temp: Math.round(data.current.temperature_2m),
          condition: weatherCodes[data.current.weather_code] || 'Clear',
          humidity: data.current.relative_humidity_2m,
          location: 'Your Garden'
        });
        setWeatherLoading(false);
        setWeatherError(null);
      } catch (err) {
        console.error('Error fetching weather:', err);
        setWeatherError('Failed to sync weather');
        setWeatherLoading(false);
      }
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetchWeather(position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          console.warn('Geolocation denied or error:', error.message);
          // Fallback to a default location (e.g., Delhi, India) if geolocation is unavailable
          fetchWeather(28.6139, 77.2090);
          setWeather(prev => ({ ...prev, location: 'General Area' }));
        }
      );
    } else {
      setWeatherError('Geolocation not supported');
      setWeatherLoading(false);
    }
  }, []);

  // Filter Logic
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || p.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleQuantityChange = (id: string, delta: number, max: number) => {
    const current = quantities[id] || 1;
    const next = Math.max(1, Math.min(max, current + delta));
    setQuantities(prev => ({ ...prev, [id]: next }));
  };

  const handleAddToCart = (product: Product) => {
    const qty = quantities[product.id] || 1;
    addToCart(product, qty);
    setQuantities(prev => ({ ...prev, [product.id]: 1 }));
    alert(`Added ${qty} ${product.name}(s) to cart.`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Header */}
      <div className="bg-flora-900 text-white py-12 px-4 sm:px-6 lg:px-8 shadow-xl relative overflow-hidden">
        {/* ... (keep as is) ... */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-flora-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-flora-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

        <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
          <div className="w-full md:w-2/3">
            <h1 className="text-4xl md:text-5xl font-bold font-serif mb-4">Shop the Floraverse</h1>
            <p className="text-flora-100 text-lg mb-6 max-w-2xl">Discover high-quality plants, seeds, and tools curated for your gardening success.</p>

            {/* Search Bar Container */}
            <div className="bg-white p-2 rounded-2xl shadow-lg max-w-2xl flex flex-col md:flex-row gap-2 text-gray-800">
              <div className="relative flex-grow">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-11 pr-4 py-3 border-none rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-flora-100 bg-transparent"
                  placeholder="Search for monstera, seeds, shovels..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="md:w-56 border-l border-gray-100 md:pl-2">
                <div className="relative h-full">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Filter className="h-4 w-4 text-flora-500" />
                  </div>
                  <select
                    className="block w-full h-full pl-10 pr-8 py-3 border-none rounded-xl text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-flora-100 bg-transparent cursor-pointer hover:bg-gray-50 transition-colors appearance-none"
                    value={categoryFilter}
                    onChange={e => setCategoryFilter(e.target.value)}
                  >
                    <option value="All">All Categories</option>
                    {Object.values(ProductCategory).map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Weather Widget (New Feature) */}
          <div className="w-full md:w-1/3 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 text-white shadow-lg min-h-[140px] flex flex-col justify-center">
            {weatherLoading ? (
              <div className="flex flex-col items-center justify-center space-y-2">
                <Loader2 className="h-8 w-8 animate-spin text-flora-300" />
                <p className="text-sm font-medium">Syncing local weather...</p>
              </div>
            ) : weatherError ? (
              <div className="flex items-start space-x-3 bg-red-400/20 p-3 rounded-xl border border-red-400/30">
                <AlertCircle className="h-5 w-5 text-red-300 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-sm">Weather Unavailable</h3>
                  <p className="text-xs text-red-100">{weatherError}</p>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-lg">{weather.location}</h3>
                    <p className="text-flora-200 text-sm">{weather.condition} • Today</p>
                  </div>
                  <CloudSun className="h-10 w-10 text-yellow-300" />
                </div>
                <div className="flex items-center space-x-6">
                  <div className="flex items-center">
                    <Thermometer className="h-5 w-5 mr-1 text-flora-300" />
                    <span className="text-2xl font-bold">{weather.temp}°C</span>
                  </div>
                  <div className="flex items-center">
                    <Droplets className="h-5 w-5 mr-1 text-blue-300" />
                    <span className="text-xl font-medium">{weather.humidity}%</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Shop Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Featured Products</h2>
          <span className="text-sm text-gray-500">{loading ? 'Loading...' : `${filteredProducts.length} items found`}</span>
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-500">Loading the Floraverse...</div>
        ) : filteredProducts.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
            <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
              <Search className="h-full w-full" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">No products found</h3>
            <p className="mt-2 text-gray-500">Try adjusting your search or category filter.</p>
            <button
              onClick={() => { setSearchTerm(''); setCategoryFilter('All'); }}
              className="mt-4 text-flora-600 hover:text-flora-700 font-medium"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredProducts.map(product => (
              <div key={product.id} className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:border-flora-200 transition-all duration-300 flex flex-col">
                <div className="h-56 bg-gray-100 relative overflow-hidden">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3">
                    <span className="bg-white/90 backdrop-blur-sm text-flora-700 text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
                      {product.category}
                    </span>
                  </div>
                  {product.quantityAvailable < 5 && product.quantityAvailable > 0 && (
                    <div className="absolute bottom-3 left-3">
                      <span className="bg-red-500/90 text-white text-xs font-bold px-3 py-1 rounded-md shadow-sm">
                        Only {product.quantityAvailable} left
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-6 flex-grow flex flex-col">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-gray-900 leading-tight group-hover:text-flora-700 transition-colors">{product.name}</h3>
                  </div>
                  <p className="text-sm text-gray-500 line-clamp-2 mb-4 flex-grow">{product.description}</p>

                  <div className="flex items-baseline mb-6">
                    <span className="text-2xl font-bold text-flora-700">₹{product.price.toFixed(2)}</span>
                    <span className="ml-2 text-xs text-gray-400">per unit</span>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Quantity Control */}
                    <div className="flex items-center bg-gray-50 rounded-lg border border-gray-200 p-1">
                      <button
                        onClick={() => handleQuantityChange(product.id, -1, product.quantityAvailable)}
                        className="p-1.5 hover:bg-white hover:shadow-sm rounded-md text-gray-600 transition-all"
                        disabled={product.quantityAvailable === 0}
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="w-8 text-center text-sm font-semibold text-gray-900">{quantities[product.id] || 1}</span>
                      <button
                        onClick={() => handleQuantityChange(product.id, 1, product.quantityAvailable)}
                        className="p-1.5 hover:bg-white hover:shadow-sm rounded-md text-gray-600 transition-all"
                        disabled={product.quantityAvailable === 0}
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    <button
                      onClick={() => handleAddToCart(product)}
                      disabled={product.quantityAvailable === 0}
                      className="flex-grow flex items-center justify-center bg-flora-600 text-white px-4 py-2.5 rounded-lg hover:bg-flora-700 active:bg-flora-800 transition-colors shadow-sm disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      {product.quantityAvailable === 0 ? 'Out of Stock' : 'Add to Cart'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BuyerDashboard;
