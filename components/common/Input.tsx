
import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  wrapperClassName?: string;
}

const Input: React.FC<InputProps> = ({ label, id, error, className = '', wrapperClassName = '', ...props }) => {
  const baseInputClasses = "w-full px-4 py-2.5 rounded-lg bg-background-light dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary dark:focus:ring-primary-light focus:border-transparent outline-none transition-colors duration-200 text-text-light dark:text-text-dark placeholder-gray-400 dark:placeholder-gray-500";
  const errorInputClasses = "border-red-500 dark:border-red-500 focus:ring-red-400 dark:focus:ring-red-400";

  return (
    <div className={`mb-4 ${wrapperClassName}`}>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-text-light dark:text-text-dark mb-1">
          {label}
        </label>
      )}
      <input
        id={id}
        className={`${baseInputClasses} ${error ? errorInputClasses : ''} ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-red-500 dark:text-red-400">{error}</p>}
    </div>
  );
};

export default Input;
