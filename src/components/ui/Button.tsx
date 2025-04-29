import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  className?: string;
}

const Button = ({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  ...props
}: ButtonProps) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-colors duration-150 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50';
  
  const variantStyles = {
    primary: 'bg-black text-white hover:bg-gray-800',
    outline: 'bg-white text-black border border-black hover:bg-gray-50',
    ghost: 'text-black hover:bg-gray-100',
  };
  
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };
  
  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;