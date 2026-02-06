import React from 'react';
import { FiMoon, FiSun } from 'react-icons/fi';
import { useTheme } from './ThemeProvider';

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <button
      onClick={toggleTheme}
      className={`p-3 rounded-full border transition-all duration-300 backdrop-blur-md group ${
        theme === 'dark' 
          ? 'bg-white/5 hover:bg-white/10 border-white/10' 
          : 'bg-gray-100 hover:bg-gray-200 border-gray-200'
      }`}
      aria-label="Toggle Theme"
    >
      {theme === 'dark' ? (
        <FiSun className="w-5 h-5 text-yellow-100 group-hover:text-yellow-400 transition-colors" />
      ) : (
        <FiMoon className="w-5 h-5 text-gray-600 group-hover:text-gray-900 transition-colors" />
      )}
    </button>
  );
}
