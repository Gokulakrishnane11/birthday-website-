import React from 'react';

interface TypographyProps {
  children: React.ReactNode;
  className?: string;
}

export const Heading: React.FC<TypographyProps & { level?: 1 | 2 | 3 | 4 }> = ({
  children,
  className = '',
  level = 2,
}) => {
  const baseStyles = 'font-serif text-[#fcf8f2] font-normal tracking-tight leading-tight break-words';

  switch (level) {
    case 1:
      return (
        <h1 className={`text-3xl sm:text-5xl md:text-6xl lg:text-7xl ${baseStyles} ${className}`}>
          {children}
        </h1>
      );
    case 2:
      return (
        <h2 className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl ${baseStyles} ${className}`}>
          {children}
        </h2>
      );
    case 3:
      return (
        <h3 className={`text-xl sm:text-2xl md:text-3xl ${baseStyles} ${className}`}>
          {children}
        </h3>
      );
    case 4:
      return (
        <h4 className={`text-lg sm:text-xl md:text-2xl ${baseStyles} ${className}`}>
          {children}
        </h4>
      );
    default:
      return <h2 className={`${baseStyles} ${className}`}>{children}</h2>;
  }

};

export const Subheading: React.FC<TypographyProps> = ({ children, className = '' }) => (
  <p className={`font-sans text-sm sm:text-base text-[#a39584] uppercase tracking-widest font-medium ${className}`}>
    {children}
  </p>
);

export const Paragraph: React.FC<TypographyProps & { size?: 'sm' | 'base' | 'lg' }> = ({
  children,
  className = '',
  size = 'base',
}) => {
  const sizeStyles = {
    sm: 'text-sm leading-relaxed text-[#c9bbaa]',
    base: 'text-base leading-relaxed text-[#f3ece1]',
    lg: 'text-lg sm:text-xl leading-relaxed text-[#f3ece1]',
  };

  return <p className={`font-sans ${sizeStyles[size]} ${className}`}>{children}</p>;
};

export const Caption: React.FC<TypographyProps> = ({ children, className = '' }) => (
  <span className={`font-sans text-xs text-[#a39584] tracking-wide ${className}`}>
    {children}
  </span>
);

export const GradientText: React.FC<TypographyProps & { variant?: 'rose' | 'gold' | 'muted' }> = ({
  children,
  className = '',
  variant = 'rose',
}) => {
  const variantStyles = {
    rose: 'text-gradient-rose',
    gold: 'text-gradient-gold',
    muted: 'text-gradient-muted',
  };

  return <span className={`${variantStyles[variant]} ${className}`}>{children}</span>;
};
