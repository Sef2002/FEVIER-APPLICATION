import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

const Card = ({ children, className = '' }: CardProps) => {
  return (
    <div className={`rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow duration-150 hover:shadow ${className}`}>
      {children}
    </div>
  );
};

export default Card;