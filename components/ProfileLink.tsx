
import React from 'react';
import { Link } from 'react-router-dom';
import { User } from '../types';

interface ProfileLinkProps {
  user: User;
}

const ProfileLink: React.FC<ProfileLinkProps> = ({ user }) => {
  return (
    <Link
      to={`/${user.id}`}
      className="group block p-6 bg-white/30 dark:bg-black/30 backdrop-blur-md rounded-2xl shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 ease-out"
    >
      <div className="flex flex-col items-center text-center">
        <img
          src={user.profileImage}
          alt={`${user.name}'s profile`}
          className="w-32 h-32 rounded-full border-4 border-primary dark:border-primary-light shadow-lg mb-4 group-hover:scale-105 transition-transform duration-300"
        />
        <h3 className="text-2xl font-zen-dots text-text-light dark:text-text-dark mb-1 group-hover:text-primary dark:group-hover:text-primary-light transition-colors">
          {user.name}
        </h3>
        <p className="text-sm text-text-muted-light dark:text-text-muted-dark">Enter {user.name}'s Dashboard</p>
        <span className="mt-3 inline-block px-4 py-2 text-sm font-semibold text-white bg-primary dark:bg-primary-dark rounded-full group-hover:bg-primary-light dark:group-hover:bg-primary transition-colors">
          Go to Dashboard &rarr;
        </span>
      </div>
    </Link>
  );
};

export default ProfileLink;
