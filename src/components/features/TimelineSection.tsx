import React, { useState, useRef } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { Sparkles, Users, MessageSquare, PhoneCall, Heart } from 'lucide-react';
import { timelineItems, type TimelineItem } from '@/data/timelineData';
import { Section } from '../layout/Section';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Heading, Paragraph, Caption } from '../common/Typography';
import { fadeUp } from '@/utils/motion';

const iconMap: Record<string, React.FC<{ className?: string }>> = {
  Users,
  MessageSquare,
  PhoneCall,
  Sparkles,
  Heart,
};

export const TimelineSection: React.FC = () => {
  const [activeItem, setActiveItem] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Animate the vertical spine line fill on scroll
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <Section
      id="story"
      title="Our Story"
      subtitle="THE CHAPTERS OF US"
      description="From an assigned team in our college tech community to late-night calls and genuine friendship."
      containerWidth="wide"
      glow="rose"
    >
      <div ref={containerRef} className="relative pt-4 pb-12">
        {/* Background Spine Line Track */}
        <div className="absolute top-0 bottom-0 left-4 sm:left-6 md:left-1/2 -translate-x-1/2 w-0.5 bg-white/10 rounded-full" />

        {/* Animated Progress Spine Line Fill: Blush to Lavender to Gold */}
        <motion.div
          style={{ scaleY }}
          className="absolute top-0 bottom-0 left-4 sm:left-6 md:left-1/2 -translate-x-1/2 w-0.5 bg-gradient-to-b from-[#f472b6] via-[#c084fc] to-[#dfb877] origin-top rounded-full shadow-[0_0_12px_rgba(244,114,182,0.5)]"
        />

        {/* Timeline Items */}
        <div className="space-y-10 sm:space-y-14 md:space-y-20">
          {timelineItems.map((item, index) => {
            const isEven = index % 2 === 0;
            const isActive = activeItem === item.id;

            return (
              <TimelineCardItem
                key={item.id}
                item={item}
                isEven={isEven}
                isActive={isActive}
                onMouseEnter={() => setActiveItem(item.id)}
                onMouseLeave={() => setActiveItem(null)}
              />
            );
          })}
        </div>
      </div>
    </Section>
  );
};

interface TimelineCardItemProps {
  item: TimelineItem;
  isEven: boolean;
  isActive: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

const TimelineCardItem: React.FC<TimelineCardItemProps> = ({
  item,
  isEven,
  isActive,
  onMouseEnter,
  onMouseLeave,
}) => {
  const IconComponent = iconMap[item.iconName] || Sparkles;

  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-70px' }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={`relative flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-10 ${
        isEven ? 'md:flex-row-reverse' : ''
      }`}
    >
      {/* 1. Timeline Node Indicator on Spine Line */}
      <div className="absolute left-4 sm:left-6 md:left-1/2 -translate-x-1/2 z-20 flex items-center justify-center">
        <motion.div
          animate={{
            scale: isActive ? 1.25 : 1,
            boxShadow: isActive
              ? '0 0 24px 6px rgba(244, 114, 182, 0.45)'
              : '0 0 10px 2px rgba(192, 132, 252, 0.25)',
          }}
          transition={{ duration: 0.3 }}
          className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 flex items-center justify-center transition-colors ${
            isActive
              ? 'bg-[#f472b6] border-[#fdfaf6] text-[#070509]'
              : 'bg-[#140d1f] border-[#f472b6]/60 text-[#fbcfe8]'
          }`}
        >
          <IconComponent className="w-3.5 h-3.5" />
        </motion.div>
      </div>

      {/* 2. Content Card */}
      <div className="w-full pl-12 sm:pl-16 md:pl-0 md:w-1/2">
        <div className={isEven ? 'md:pr-12' : 'md:pl-12'}>
          <Card
            variant="glass"
            glowHover="rose"
            interactive
            padding="md"
            className={`transition-all duration-500 border ${
              isActive
                ? 'border-[#f472b6]/50 bg-[#1b1228]/90 shadow-2xl shadow-[#3b0764]/40 scale-[1.01]'
                : 'border-white/10 bg-[#140d1f]/75'
            }`}
          >
            {/* Header Tags */}
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3.5">
              <div className="flex items-center gap-2">
                <Badge variant={isActive ? 'blush' : 'lavender'} size="sm">
                  {item.chapter}
                </Badge>
                <Badge variant="neutral" size="sm">
                  {item.badge}
                </Badge>
              </div>

              <Caption className="text-[#cbbead] text-xs font-mono">
                {item.tag}
              </Caption>
            </div>

            {/* Title */}
            <Heading level={3} className="text-xl sm:text-2xl mb-1 text-[#fdfaf6]">
              {item.title}
            </Heading>

            {/* Subtitle */}
            <p className="text-xs sm:text-sm text-[#fbcfe8] font-serif italic mb-4">
              {item.subtitle}
            </p>

            {/* Story Description */}
            <Paragraph size="base" className="text-[#e8dccf] leading-relaxed font-sans text-sm sm:text-base">
              {item.description}
            </Paragraph>

            {/* Subtle Milestone Footer */}
            <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-[#a59582]">
              <span className="font-serif italic">Milestone 0{item.milestoneNumber}</span>
              <Sparkles className="w-3 h-3 text-[#dfb877]" />
            </div>
          </Card>
        </div>
      </div>

      {/* Desktop Opposite Empty Spacer Column */}
      <div className="hidden md:block md:w-1/2" />
    </motion.div>
  );
};
