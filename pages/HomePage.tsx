
import React from 'react';
import MotivationalQuote from '../components/MotivationalQuote';
import UserComparisonChart from '../components/charts/UserComparisonChart';
import ProfileLink from '../components/ProfileLink';
import { USERS } from '../constants';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-8 text-center">
      <header className="mb-8 animate-fadeIn" style={{ animationDelay: '0.2s' }}>
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-zen-dots text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary dark:from-primary-light dark:to-secondary-light py-2">
          Anime Productivity Hub
        </h1>
        <p className="text-lg sm:text-xl text-text-muted-light dark:text-text-muted-dark mt-2">
          Unleash Your Inner Hero. Achieve Your Goals.
        </p>
      </header>

      <MotivationalQuote />

      <section className="w-full max-w-4xl my-8 animate-fadeIn" style={{ animationDelay: '0.4s' }}>
        <h2 className="text-3xl font-zen-dots text-text-light dark:text-text-dark mb-6">Champions' Arena</h2>
        <UserComparisonChart />
      </section>

      <section className="w-full max-w-4xl my-8 animate-fadeIn" style={{ animationDelay: '0.6s' }}>
        <h2 className="text-3xl font-zen-dots text-text-light dark:text-text-dark mb-10">Choose Your Path:</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <ProfileLink user={USERS.akhilesh} />
          <ProfileLink user={USERS.preetam} />
        </div>
      </section>

      <footer className="mt-12 text-xs text-text-muted-light dark:text-text-muted-dark animate-fadeIn" style={{ animationDelay: '0.8s' }}>
        <p>&copy; {new Date().getFullYear()} Anime Productivity Hub. Level up your life!</p>
        <p>Inspired by countless hours of anime and the pursuit of self-improvement.</p>
      </footer>
    </div>
  );
};

export default HomePage;
