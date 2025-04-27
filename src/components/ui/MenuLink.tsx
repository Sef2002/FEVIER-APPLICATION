import React from 'react';
import * as LucideIcons from 'lucide-react';

interface MenuLinkProps {
  href: string;
  icon: keyof typeof LucideIcons;
  label: string;
  isActive?: boolean;
}

export const MenuLink = ({ href, icon, label, isActive = false }: MenuLinkProps) => {
  // Dynamically import the icon from lucide-react
  const Icon = LucideIcons[icon];

  return (
    <a
      href={href}
      className={`group flex items-center px-4 py-3 text-white transition-opacity hover:opacity-80 ${
        isActive ? 'bg-white/10' : ''
      }`}
    >
      {Icon && <Icon size={20} className="mr-4" />}
      <span className="text-sm font-medium">{label}</span>
    </a>
  );
};