import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Gamepad2, BookOpen, Home } from 'lucide-react';

const NavigationMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => setIsOpen(!isOpen);

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/puzzle', label: 'Puzzle Game', icon: Gamepad2 },
    { path: '/study', label: 'Study Mode', icon: BookOpen },
  ];

  return (
    <nav className="bg-gradient-to-r from-yellow-400 via-blue-600 to-red-600 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <Link
              to="/"
              className="flex items-center space-x-2 text-white font-bold text-xl hover:text-yellow-200 transition-colors"
            >
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-bold text-sm">CF</span>
              </div>
              <span className="hidden sm:block">Claude Flow</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  isActive(path)
                    ? 'bg-white text-blue-600 shadow-md'
                    : 'text-white hover:bg-white/20 hover:text-yellow-200'
                }`}
              >
                <Icon size={18} />
                <span>{label}</span>
              </Link>
            ))}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white transition-colors"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <div className={`md:hidden ${isOpen ? 'block' : 'hidden'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 bg-blue-700/90 backdrop-blur-sm">
          {navItems.map(({ path, label, icon: Icon }) => (
            <Link
              key={path}
              to={path}
              className={`flex items-center space-x-3 px-3 py-3 rounded-lg font-medium transition-all duration-200 ${
                isActive(path)
                  ? 'bg-white text-blue-600 shadow-md'
                  : 'text-white hover:bg-white/20 hover:text-yellow-200'
              }`}
              onClick={() => setIsOpen(false)}
            >
              <Icon size={20} />
              <span>{label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Colombian Flag Accent Bar */}
      <div className="h-1 bg-gradient-to-r from-yellow-400 via-blue-600 to-red-600"></div>
    </nav>
  );
};

export default NavigationMenu;