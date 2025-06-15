
import React, { ReactNode } from 'react';

interface TabOption<T extends string> {
  label: string;
  value: T;
  icon?: ReactNode;
}

interface TabsProps<T extends string> {
  options: TabOption<T>[];
  activeTab: T;
  onTabChange: (tab: T) => void;
  className?: string;
}

const Tabs = <T extends string,>({ options, activeTab, onTabChange, className = '' }: TabsProps<T>): ReactNode => {
  return (
    <div className={`mb-6 border-b border-gray-300 dark:border-gray-700 ${className}`}>
      <nav className="-mb-px flex space-x-4 overflow-x-auto pb-px" aria-label="Tabs">
        {options.map((option) => (
          <button
            key={option.value}
            onClick={() => onTabChange(option.value)}
            className={`
              group inline-flex items-center py-3 px-1 border-b-2 font-medium text-sm whitespace-nowrap
              transition-colors duration-200
              ${
                activeTab === option.value
                  ? 'border-primary dark:border-primary-light text-primary dark:text-primary-light'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-gray-600'
              }
            `}
            aria-current={activeTab === option.value ? 'page' : undefined}
          >
            {option.icon && <span className="mr-2 w-5 h-5">{option.icon}</span>}
            {option.label}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default Tabs;

