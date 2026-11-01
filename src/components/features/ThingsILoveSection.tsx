import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles,
  MessageCircle,
  Smile,
  Flame,
  HeartHandshake,
  Heart,
  HelpCircle,
  RotateCw,
} from 'lucide-react';
import { reasonsData } from '@/data/reasonsData';
import { Section } from '../layout/Section';
import { Badge } from '../common/Badge';
import { Heading, Paragraph, Caption } from '../common/Typography';
import { fadeUp } from '@/utils/motion';

const iconMap: Record<string, React.FC<{ className?: string }>> = {
  Sparkles,
  MessageCircle,
  Smile,
  Flame,
  HeartHandshake,
  Heart,
};

export const ThingsILoveSection: React.FC = () => {
  const [flippedCards, setFlippedCards] = useState<Record<string, boolean>>({});

  const toggleCard = (id: string) => {
    setFlippedCards((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const revealedCount = Object.values(flippedCards).filter(Boolean).length;

  return (
    <Section
      id="things-i-love"
      title="Little Things That Make You, YOU"
      subtitle="WHAT MAKES DEEPA SPECIAL"
      description="Tap each card below to reveal the little qualities, quirks, and traits that make our bond so meaningful."
      containerWidth="wide"
      glow="burgundy"
    >
      {/* Progress Counter Badge */}
      <div className="flex items-center justify-center gap-2 mb-10">
        <Badge variant="blush" size="md">
          Discovered {revealedCount} of {reasonsData.length} traits
        </Badge>
      </div>

      {/* Responsive Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
        {reasonsData.map((item) => {
          const isFlipped = !!flippedCards[item.id];
          const IconComponent = item.iconName ? iconMap[item.iconName] || HelpCircle : HelpCircle;

          return (
            <motion.div
              key={item.id}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-40px' }}
              className="perspective-1000 h-[260px] sm:h-[250px] w-full"
            >
              <motion.div
                initial={false}
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                style={{ transformStyle: 'preserve-3d' }}
                whileHover={{ y: -4, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => toggleCard(item.id)}
                className="relative w-full h-full cursor-pointer rounded-3xl"
              >
                {/* 1. FRONT FACE */}
                <div
                  style={{
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden',
                  }}
                  className={`absolute inset-0 w-full h-full flex flex-col justify-between p-6 sm:p-7 rounded-3xl border transition-all duration-300 ${
                    isFlipped ? 'pointer-events-none opacity-0' : 'pointer-events-auto opacity-100'
                  } ${
                    item.isSpecial
                      ? 'border-[#dfb877]/50 bg-gradient-to-br from-[#261938] via-[#140d1f] to-[#3b0764] shadow-xl shadow-[#dfb877]/15'
                      : 'border-white/10 bg-[#140d1f] hover:border-[#f472b6]/40 shadow-lg shadow-black/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <Badge variant={item.isSpecial ? 'gold' : 'blush'} size="sm">
                      {item.isSpecial ? '★ Rare Quality' : `Trait #0${item.number}`}
                    </Badge>
                    <div className="p-2.5 rounded-full bg-white/5 border border-white/10 text-[#f472b6]">
                      <IconComponent
                        className={`w-4 h-4 ${item.isSpecial ? 'text-[#dfb877]' : 'text-[#f472b6]'}`}
                      />
                    </div>
                  </div>

                  <div className="my-auto py-2">
                    <Heading
                      level={3}
                      className={`text-xl sm:text-2xl font-serif mb-1 ${
                        item.isSpecial ? 'text-gradient-gold' : 'text-[#fdfaf6]'
                      }`}
                    >
                      {item.title}
                    </Heading>
                    <p className="text-xs text-[#cbbead] font-sans">
                      {item.subtitle}
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-xs text-[#a59582] border-t border-white/10 pt-3">
                    <Caption className="text-[#a59582]">Tap to flip</Caption>
                    <Sparkles className="w-3.5 h-3.5 text-[#f472b6]/70" />
                  </div>
                </div>

                {/* 2. BACK FACE (REVEALED CONTENT) */}
                <div
                  style={{
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)',
                  }}
                  className={`absolute inset-0 w-full h-full flex flex-col justify-between p-6 sm:p-7 rounded-3xl border transition-all duration-300 ${
                    isFlipped ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
                  } ${
                    item.isSpecial
                      ? 'border-[#dfb877]/60 bg-[#1b1228] shadow-2xl shadow-[#dfb877]/25'
                      : 'border-[#f472b6]/50 bg-[#170f24] shadow-2xl shadow-[#3b0764]/40'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant={item.isSpecial ? 'gold' : 'lavender'} size="sm">
                      {item.title}
                    </Badge>
                    <div className="p-1.5 rounded-full bg-white/5 text-[#a59582] hover:text-white">
                      <RotateCw className="w-3.5 h-3.5" />
                    </div>
                  </div>

                  <div className="my-auto">
                    <Paragraph
                      size="base"
                      className="text-[#fdfaf6] text-sm sm:text-[15px] leading-relaxed font-sans font-normal"
                    >
                      {item.revealedContent}
                    </Paragraph>
                  </div>

                  <div className="text-[11px] text-[#a59582] text-right font-serif flex items-center justify-end gap-1">
                    <span>Tap to flip back</span>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          );
        })}
      </div>
    </Section>
  );
};
