import React from 'react';
import { motion } from 'framer-motion';
import { Container } from '../common/Container';
import { Heading, Subheading, Paragraph } from '../common/Typography';
import { fadeUp } from '@/utils/motion';

export interface SectionProps {
  id?: string;
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  description?: string;
  containerWidth?: 'narrow' | 'medium' | 'wide' | 'full';
  glow?: 'rose' | 'gold' | 'burgundy' | 'none';
  className?: string;
  headerAlign?: 'left' | 'center' | 'right';
}

export const Section: React.FC<SectionProps> = ({
  id,
  children,
  title,
  subtitle,
  description,
  containerWidth = 'wide',
  glow = 'none',
  className = '',
  headerAlign = 'center',
}) => {
  const glowStyles = {
    none: '',
    rose: 'before:absolute before:top-1/3 before:left-1/2 before:-translate-x-1/2 before:w-[600px] before:h-[350px] before:bg-gradient-to-r before:from-[#6e2633]/20 before:to-[#d88c9a]/10 before:blur-[120px] before:rounded-full before:pointer-events-none',
    gold: 'before:absolute before:top-1/3 before:left-1/2 before:-translate-x-1/2 before:w-[600px] before:h-[350px] before:bg-gradient-to-r before:from-[#dfb877]/10 before:to-[#cda35b]/5 before:blur-[140px] before:rounded-full before:pointer-events-none',
    burgundy: 'before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:w-[700px] before:h-[400px] before:bg-[#3a121a]/40 before:blur-[140px] before:rounded-full before:pointer-events-none',
  };

  const alignStyles = {
    left: 'text-left items-start',
    center: 'text-center items-center mx-auto',
    right: 'text-right items-end ml-auto',
  };

  return (
    <section
      id={id}
      className={`relative py-14 sm:py-20 md:py-28 scroll-mt-20 overflow-hidden ${glowStyles[glow]} ${className}`}
    >

      <Container width={containerWidth}>
        {(title || subtitle || description) && (
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            className={`flex flex-col mb-12 md:mb-16 max-w-2xl ${alignStyles[headerAlign]}`}
          >
            {subtitle && <Subheading className="mb-3">{subtitle}</Subheading>}
            {title && <Heading level={2} className="mb-4">{title}</Heading>}
            {description && <Paragraph size="base" className="text-[#a39584]">{description}</Paragraph>}
          </motion.div>
        )}

        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
        >
          {children}
        </motion.div>
      </Container>
    </section>
  );
};
