
import React from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import HomePage from './pages/HomePage';
import UserDashboardPage from './pages/UserDashboardPage';
import { USERS } from './constants';
import { useTheme } from './contexts/ThemeContext';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline'; // Assuming heroicons are available or similar SVGs

// Placeholder for HeroIcons, replace with actual SVGs if not using a library
const IconPlaceholder: React.FC<{ className?: string }> = ({ className }) => <div className={`w-6 h-6 ${className}`}>Icon</div>;
const SunIconFallback = SunIcon || IconPlaceholder;
const MoonIconFallback = MoonIcon || IconPlaceholder;


const App: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  const getBackgroundImage = () => {
    const isDark = theme === 'dark';
    // For demonstration, using simple gradients. Replace with image URLs.
    // Example: 'url(https://picsum.photos/seed/darktheme/1920/1080)'
    if (location.pathname.includes('/akhilesh') || location.pathname.includes('/preetam')) {
        return isDark 
            ? 'bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900' 
            : 'bg-gradient-to-br from-sky-200 via-indigo-200 to-purple-200';
    }
    return isDark 
        ? 'bg-gradient-to-br from-gray-800 via-slate-900 to-black' 
        : 'bg-gradient-to-br from-white via-sky-100 to-indigo-100';
  };
  
  return (
    <div className={`min-h-screen w-full ${getBackgroundImage()} bg-cover bg-fixed transition-all duration-500`}>
      <div className="absolute top-4 right-4 z-50">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full bg-primary-light/30 dark:bg-primary-dark/30 text-text-dark dark:text-text-light hover:bg-primary-light/50 dark:hover:bg-primary-dark/50 transition-colors"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <SunIconFallback className="w-6 h-6 text-yellow-400" /> : <MoonIconFallback className="w-6 h-6 text-indigo-700" />}
        </button>
      </div>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/akhilesh" element={<UserDashboardPage user={USERS.akhilesh} />} />
        <Route path="/preetam" element={<UserDashboardPage user={USERS.preetam} />} />
      </Routes>
    </div>
  );
};

export default App;
