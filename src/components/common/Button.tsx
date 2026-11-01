import React from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';

export interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  children: React.ReactNode;
  variant?: 'primary' | 'blush' | 'gold' | 'glass' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  iconLeft,
  iconRight,
  isLoading = false,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-sans font-medium rounded-full tracking-wide transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-pink-400/50 disabled:opacity-50 disabled:pointer-events-none select-none cursor-pointer';

  const sizeStyles = {
    sm: 'text-xs min-h-[40px] px-4 py-2 gap-1.5',
    md: 'text-sm min-h-[44px] px-5 sm:px-6 py-2.5 gap-2',
    lg: 'text-base min-h-[48px] px-7 sm:px-9 py-3.5 gap-2.5',
  };

  const variantStyles = {
    primary:
      'bg-gradient-to-r from-[#6e2633] via-[#8c3343] to-[#581c87] hover:brightness-110 text-[#fdfaf6] border border-[#f472b6]/40 shadow-lg shadow-[#6e2633]/30 hover:shadow-[#f472b6]/30',
    blush:
      'bg-gradient-to-r from-[#f472b6] to-[#c084fc] hover:brightness-110 text-[#0f0a15] font-semibold border border-[#fbcfe8]/50 shadow-lg shadow-[#f472b6]/25',
    gold:
      'bg-gradient-to-r from-[#dfb877] to-[#cda35b] text-[#0a080c] font-semibold border border-[#ebd1a2]/40 shadow-md shadow-[#dfb877]/20 hover:brightness-105',
    glass:
      'bg-white/5 hover:bg-white/10 text-[#fdfaf6] border border-white/10 hover:border-pink-300/30 backdrop-blur-md',
    outline:
      'bg-transparent text-[#fdfaf6] border border-[#f5ede2]/20 hover:border-pink-300/50 hover:bg-white/5',
    ghost:
      'bg-transparent text-[#f472b6] hover:text-[#fdfaf6] hover:bg-white/5 px-3 py-1.5',
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        <>
          {iconLeft && <span className="shrink-0">{iconLeft}</span>}
          <span>{children}</span>
          {iconRight && <span className="shrink-0">{iconRight}</span>}
        </>
      )}
    </motion.button>
  );
};
