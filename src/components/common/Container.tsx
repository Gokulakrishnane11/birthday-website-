import React from 'react';

export interface ContainerProps {
  children: React.ReactNode;
  width?: 'narrow' | 'medium' | 'wide' | 'full';
  className?: string;
}

export const Container: React.FC<ContainerProps> = ({
  children,
  width = 'wide',
  className = '',
}) => {
  const widthStyles = {
    narrow: 'max-w-xl',     // 576px
    medium: 'max-w-4xl',    // 896px
    wide: 'max-w-6xl',      // 1152px
    full: 'max-w-7xl',      // 1280px
  };

  return (
    <div className={`w-full mx-auto px-4 sm:px-6 md:px-8 ${widthStyles[width]} ${className}`}>
      {children}
    </div>
  );
};
