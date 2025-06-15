
import React, { useState, useEffect } from 'react';
import { MOTIVATIONAL_QUOTES } from '../constants';

const MotivationalQuote: React.FC = () => {
  const [quote, setQuote] = useState('');

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length);
    setQuote(MOTIVATIONAL_QUOTES[randomIndex]);

    const intervalId = setInterval(() => {
      const newRandomIndex = Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length);
      setQuote(MOTIVATIONAL_QUOTES[newRandomIndex]);
    }, 15000); // Change quote every 15 seconds

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="my-8 p-6 bg-white/20 dark:bg-black/20 backdrop-blur-sm rounded-xl shadow-lg text-center animate-fadeIn">
      <p className="text-xl md:text-2xl italic font-medium text-text-light dark:text-text-dark leading-relaxed">
        "{quote}"
      </p>
      <p className="mt-2 text-sm text-primary dark:text-primary-light font-zen-dots">- Anime Wisdom</p>
    </div>
  );
};

export default MotivationalQuote;
