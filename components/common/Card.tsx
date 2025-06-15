
import React, { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  title?: string;
  titleClassName?: string;
  noPadding?: boolean;
}

const Card: React.FC<CardProps> = ({ children, className = '', title, titleClassName = '', noPadding = false }) => {
  return (
    <div
      className={`bg-white/80 dark:bg-gray-800/80 backdrop-blur-md shadow-xl rounded-xl ${noPadding ? '' : 'p-6'} ${className}`}
    >
      {title && (
        <h2 className={`text-xl font-zen-dots mb-4 text-primary dark:text-primary-light ${titleClassName}`}>
          {title}
        </h2>
      )}
      {children}
    </div>
  );
};

export default Card;
