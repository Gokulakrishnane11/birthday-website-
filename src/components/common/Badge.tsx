import React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'rose' | 'blush' | 'lavender' | 'gold' | 'burgundy' | 'neutral';
  size?: 'sm' | 'md';
  icon?: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'blush',
  size = 'md',
  icon,
  className = '',
}) => {
  const baseStyles =
    'inline-flex items-center font-sans font-medium rounded-full tracking-wider uppercase backdrop-blur-md border transition-all duration-300';

  const sizeStyles = {
    sm: 'text-[10px] px-2.5 py-0.5 gap-1',
    md: 'text-xs px-3.5 py-1 gap-1.5',
  };

  const variantStyles = {
    blush: 'bg-[#f472b6]/15 text-[#fbcfe8] border-[#f472b6]/35',
    lavender: 'bg-[#c084fc]/15 text-[#e9d5ff] border-[#c084fc]/35',
    rose: 'bg-[#6e2633]/25 text-[#e0a5ae] border-[#d88c9a]/30',
    gold: 'bg-[#dfb877]/15 text-[#ebd1a2] border-[#dfb877]/30',
    burgundy: 'bg-[#3a121a]/60 text-[#f3ece1] border-[#6e2633]/50',
    neutral: 'bg-white/5 text-[#c9bbaa] border-white/10',
  };

  return (
    <span className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}>
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </span>
  );
};
