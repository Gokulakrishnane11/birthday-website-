import React from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';

export interface CardProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  children: React.ReactNode;
  variant?: 'glass' | 'solid' | 'subtle' | 'bordered';
  glowHover?: 'rose' | 'gold' | 'none';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  interactive?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'glass',
  glowHover = 'rose',
  padding = 'md',
  interactive = false,
  className = '',
  ...props
}) => {
  const baseStyles = 'rounded-3xl relative overflow-hidden transition-all duration-500';

  const variantStyles = {
    glass: 'bg-[#120e15]/70 backdrop-blur-xl border border-[#f3ece1]/10',
    solid: 'bg-[#120e15] border border-[#f3ece1]/10 shadow-xl shadow-black/40',
    subtle: 'bg-[#19141f]/40 border border-[#f3ece1]/5',
    bordered: 'bg-transparent border border-[#f3ece1]/15',
  };

  const paddingStyles = {
    none: '',
    sm: 'p-4 sm:p-5',
    md: 'p-6 sm:p-8',
    lg: 'p-8 sm:p-12',
  };

  const glowHoverStyles = {
    none: '',
    rose: 'hover:border-[#d88c9a]/40 hover:shadow-2xl hover:shadow-[#6e2633]/20',
    gold: 'hover:border-[#dfb877]/40 hover:shadow-2xl hover:shadow-[#dfb877]/10',
  };

  return (
    <motion.div
      whileHover={interactive ? { y: -4 } : undefined}
      whileTap={interactive ? { scale: 0.99 } : undefined}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={`${baseStyles} ${variantStyles[variant]} ${paddingStyles[padding]} ${
        glowHoverStyles[glowHover]
      } ${interactive ? 'cursor-pointer' : ''} ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
};
