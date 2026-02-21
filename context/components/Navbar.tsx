import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useStore } from '../StoreContext';
import { UserRole } from '../../types';
import { Sprout, LogOut, ShoppingCart, MessageCircle, User as UserIcon, ChevronDown, Menu, X } from 'lucide-react';

const Navbar: React.FC = () => {
  const { user, logout, cart } = useStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMobileMenuOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-white/90 backdrop-blur-md sticky top-0 z-50 border-b border-flora-100 shadow-sm transition-all duration-300">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="bg-flora-100 p-2 rounded-xl group-hover:bg-flora-500 transition-colors duration-300">
              <Sprout className="h-6 w-6 text-flora-600 group-hover:text-white transition-colors duration-300" />
            </div>
            <span className="text-2xl font-bold font-serif tracking-wide text-flora-900">Floraverse</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`text-sm font-medium transition-colors duration-200 ${isActive('/') ? 'text-flora-600' : 'text-gray-600 hover:text-flora-500'}`}
            >
              Home
            </Link>

            <Link
              to="/ai-assistant"
              className={`flex items-center space-x-1.5 px-4 py-2 rounded-full transition-all duration-200 ${isActive('/ai-assistant')
                ? 'bg-flora-100 text-flora-700'
                : 'text-gray-600 hover:bg-flora-50 hover:text-flora-600'
                }`}
            >
              <MessageCircle className="h-4 w-4" />
              <span className="text-sm font-medium">AI Assistant</span>
            </Link>

            {!user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center space-x-1 text-gray-700 hover:text-flora-600 font-medium focus:outline-none transition-colors"
                >
                  <span>Login / Sign Up</span>
                  <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 animate-in fade-in slide-in-from-top-2 duration-200 overflow-hidden">
                    <Link
                      to="/auth?role=buyer"
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-flora-50 hover:text-flora-700 transition-colors"
                    >
                      <UserIcon className="h-4 w-4 mr-2" />
                      Login as Buyer
                    </Link>
                    <div className="h-px bg-gray-100 mx-4"></div>
                    <Link
                      to="/auth?role=seller"
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-flora-50 hover:text-flora-700 transition-colors"
                    >
                      <Sprout className="h-4 w-4 mr-2" />
                      Login as Seller
                    </Link>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-6">
                <div className="flex flex-col items-end">
                  <span className="text-sm font-semibold text-gray-800">{user.name}</span>
                  <span className="text-xs text-flora-600 font-medium capitalize">{user.role}</span>
                </div>

                {user.role === UserRole.BUYER && (
                  <Link to="/cart" className="relative group p-2 rounded-full hover:bg-flora-50 transition-colors">
                    <ShoppingCart className="h-6 w-6 text-gray-600 group-hover:text-flora-600" />
                    {cart.length > 0 && (
                      <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-sm border-2 border-white">
                        {cart.length}
                      </span>
                    )}
                  </Link>
                )}

                {(user.role === UserRole.SELLER || user.role === UserRole.ADMIN) && (
                  <Link to="/seller-dashboard" className={`text-sm font-medium ${isActive('/seller-dashboard') ? 'text-flora-600' : 'text-gray-600 hover:text-flora-600'}`}>
                    Dashboard
                  </Link>
                )}


                {user.role === UserRole.BUYER && (
                  <Link to="/buyer-dashboard" className={`text-sm font-medium ${isActive('/buyer-dashboard') ? 'text-flora-600' : 'text-gray-600 hover:text-flora-600'}`}>
                    Shop
                  </Link>
                )}

                <button
                  onClick={handleLogout}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all duration-200"
                  title="Logout"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-gray-600 hover:text-flora-600">
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {
        isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100">
            <div className="px-4 pt-2 pb-6 space-y-2">
              <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-flora-50 rounded-md">Home</Link>
              <Link to="/ai-assistant" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-flora-50 rounded-md">AI Assistant</Link>
              {!user && (
                <>
                  <Link to="/auth?role=buyer" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-flora-50 rounded-md">Login as Buyer</Link>
                  <Link to="/auth?role=seller" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-flora-50 rounded-md">Login as Seller</Link>
                </>
              )}
              {user && (
                <>
                  {(user.role === UserRole.SELLER || user.role === UserRole.ADMIN) && (
                    <Link
                      to="/seller-dashboard"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-flora-50 rounded-md"
                    >
                      Seller Dashboard
                    </Link>
                  )}
                  {user.role === UserRole.BUYER && (
                    <Link
                      to="/buyer-dashboard"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-flora-50 rounded-md"
                    >
                      Buyer Dashboard
                    </Link>
                  )}
                  <div className="h-px bg-gray-100 my-2"></div>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-3 py-2 text-base font-medium text-red-600 hover:bg-red-50 rounded-md"
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>
        )
      }
    </nav >
  );
};

export default Navbar;