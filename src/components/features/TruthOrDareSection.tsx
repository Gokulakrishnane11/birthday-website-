import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Dices,
  Sparkles,
  MessageCircle,
  Heart,
  RotateCw,
  Quote,
  Layers,
} from 'lucide-react';
import { truthOrDareData, type TruthOrDareCard } from '@/data/truthOrDareData';
import { Section } from '../layout/Section';
import { Badge } from '../common/Badge';
import { Heading, Paragraph, Caption } from '../common/Typography';
import { Button } from '../common/Button';
import { fadeUp, staggerContainer } from '@/utils/motion';

const iconMap: Record<string, React.FC<{ className?: string }>> = {
  Dices,
  Sparkles,
  MessageCircle,
  Heart,
};

export const TruthOrDareSection: React.FC = () => {
  const [flippedCards, setFlippedCards] = useState<Record<string, boolean>>({});

  const toggleCard = (id: string) => {
    setFlippedCards((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const flipAllCards = () => {
    const allFlipped = truthOrDareData.cards.every((c) => flippedCards[c.id]);
    if (allFlipped) {
      setFlippedCards({});
    } else {
      const nextState: Record<string, boolean> = {};
      truthOrDareData.cards.forEach((c) => {
        nextState[c.id] = true;
      });
      setFlippedCards(nextState);
    }
  };

  const flippedCount = Object.values(flippedCards).filter(Boolean).length;
  const allCardsFlipped = truthOrDareData.cards.length > 0 && flippedCount === truthOrDareData.cards.length;

  return (
    <Section
      id="truth-or-dare"
      title={truthOrDareData.title}
      subtitle={truthOrDareData.subtitle}
      description="How late-night questions, unexpected answers, and playful banter turned an assigned lead & member into genuine close friends."
      containerWidth="wide"
      glow="rose"
      className="relative overflow-hidden"
    >
      {/* Decorative Subtle Floating Stars */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{
            y: [-10, 10, -10],
            opacity: [0.3, 0.7, 0.3],
            scale: [1, 1.15, 1],
          }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-12 left-10 text-[#f472b6]/40 text-xl"
        >
          ✨
        </motion.div>
        <motion.div
          animate={{
            y: [12, -8, 12],
            opacity: [0.25, 0.6, 0.25],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          className="absolute top-36 right-12 text-[#c084fc]/35 text-2xl"
        >
          🎲
        </motion.div>
        <motion.div
          animate={{
            y: [-8, 8, -8],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          className="absolute bottom-20 left-16 text-[#dfb877]/30 text-lg"
        >
          ⭐
        </motion.div>
      </div>

      {/* Story Narrative Box */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
        className="max-w-3xl mx-auto mb-12"
      >
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#1b1228] via-[#140d1f] to-[#0d0914] border border-[#f472b6]/25 shadow-2xl shadow-[#3b0764]/25 text-center relative overflow-hidden">
          {/* Subtle Glow Orb inside narrative box */}
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-48 h-48 bg-[#f472b6]/15 blur-3xl rounded-full pointer-events-none" />

          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/5 border border-[#f472b6]/30 text-xs text-[#fbcfe8] mb-5">
            <Dices className="w-3.5 h-3.5 text-[#dfb877]" />
            <span className="font-mono tracking-wider uppercase text-[11px]">Late-Night Phone Sessions</span>
          </div>

          <div className="space-y-4 text-sm sm:text-base text-[#f5ede2] font-serif leading-relaxed italic max-w-2xl mx-auto">
            {truthOrDareData.introParagraphs.map((paragraph, index) => (
              <p key={index} className="text-[#f5ede2]/90">
                "{paragraph}"
              </p>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Interactive Controls Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 px-2 max-w-5xl mx-auto">
        <div className="flex items-center gap-2">
          <Badge variant="blush" size="md">
            Revealed {flippedCount} of {truthOrDareData.cards.length} Cards
          </Badge>
          <Caption className="text-[#a59582] text-xs hidden sm:inline">
            Tap cards to read the memory
          </Caption>
        </div>

        <Button
          variant="glass"
          size="sm"
          onClick={flipAllCards}
          iconLeft={<Layers className="w-3.5 h-3.5 text-[#fbcfe8]" />}
          className="text-xs text-[#cbbead] hover:text-[#fdfaf6] cursor-pointer"
        >
          {allCardsFlipped ? 'Flip All Back' : 'Flip All Cards ✨'}
        </Button>
      </div>

      {/* Interactive Truth or Dare Cards Grid */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-40px' }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto"
      >
        {truthOrDareData.cards.map((card, index) => (
          <TruthOrDareCardItem
            key={card.id}
            card={card}
            index={index}
            isFlipped={!!flippedCards[card.id]}
            onToggle={() => toggleCard(card.id)}
          />
        ))}
      </motion.div>

      {/* Closing Reflection Callout */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
        className="max-w-3xl mx-auto mt-14"
      >
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#261938]/80 via-[#1b1228]/90 to-[#140d1f]/80 border border-[#dfb877]/35 shadow-xl shadow-black/60 relative overflow-hidden flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
          <div className="w-14 h-14 rounded-2xl bg-[#dfb877]/15 border border-[#dfb877]/30 flex items-center justify-center text-[#dfb877] shrink-0">
            <Quote className="w-6 h-6" />
          </div>

          <div className="space-y-1">
            <Heading level={3} className="text-lg sm:text-xl font-serif text-[#fdfaf6] leading-snug">
              {truthOrDareData.closingReflection}
            </Heading>
            <p className="text-xs text-[#ebd1a2] font-mono tracking-wider uppercase pt-1">
              • A Cherished Milestone in Our Friendship •
            </p>
          </div>
        </div>
      </motion.div>
    </Section>
  );
};

interface TruthOrDareCardItemProps {
  card: TruthOrDareCard;
  index: number;
  isFlipped: boolean;
  onToggle: () => void;
}

const TruthOrDareCardItem: React.FC<TruthOrDareCardItemProps> = ({
  card,
  index,
  isFlipped,
  onToggle,
}) => {
  const IconComponent = iconMap[card.iconName] || Dices;

  // Visual card styles depending on variant
  const borderStyles = {
    blush: 'border-[#f472b6]/40 hover:border-[#f472b6]/70 shadow-[#f472b6]/15',
    lavender: 'border-[#c084fc]/40 hover:border-[#c084fc]/70 shadow-[#c084fc]/15',
    gold: 'border-[#dfb877]/40 hover:border-[#dfb877]/70 shadow-[#dfb877]/15',
    rose: 'border-[#d88c9a]/40 hover:border-[#d88c9a]/70 shadow-[#d88c9a]/15',
  }[card.accentVariant];

  const badgeVariant = card.accentVariant;

  return (
    <motion.div
      variants={fadeUp}
      className="perspective-1000 h-[310px] w-full"
    >
      <motion.div
        initial={false}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
        style={{ transformStyle: 'preserve-3d' }}
        whileHover={{ y: -5, scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onToggle}
        className="relative w-full h-full cursor-pointer rounded-3xl select-none"
      >
        {/* 1. FRONT FACE (Keepsake Truth or Dare Deck Style) */}
        <div
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
          }}
          className={`absolute inset-0 w-full h-full flex flex-col justify-between p-6 rounded-3xl border bg-gradient-to-b from-[#1b1228] via-[#140d1f] to-[#0a0710] shadow-xl transition-all duration-300 ${borderStyles} ${
            isFlipped ? 'pointer-events-none opacity-0' : 'pointer-events-auto opacity-100'
          }`}
        >
          {/* Top Card Badge & Number */}
          <div className="flex items-center justify-between">
            <Badge variant={badgeVariant} size="sm">
              {card.category} #{card.number}
            </Badge>
            <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#fbcfe8]">
              <IconComponent className="w-4 h-4" />
            </div>
          </div>

          {/* Center Card Graphic & Title */}
          <div className="my-auto text-center py-2">
            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 mx-auto mb-3 flex items-center justify-center shadow-inner">
              <span className="text-xl">🎲</span>
            </div>

            <Heading level={3} className="text-lg sm:text-xl font-serif text-[#fdfaf6] mb-1">
              {card.frontTitle}
            </Heading>
            <Caption className="text-xs text-[#cbbead] font-sans">
              {card.frontSubtitle}
            </Caption>
          </div>

          {/* Bottom Card Footer */}
          <div className="flex items-center justify-between text-xs text-[#a59582] border-t border-white/10 pt-3">
            <span className="font-mono text-[10px] uppercase tracking-wider text-[#dfb877]">
              {card.frontTag}
            </span>
            <div className="flex items-center gap-1 text-[11px] text-[#fbcfe8]/80 hover:text-white">
              <span>Flip</span>
              <RotateCw className="w-3 h-3" />
            </div>
          </div>
        </div>

        {/* 2. BACK FACE (Revealed Story Reflection) */}
        <div
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
          className={`absolute inset-0 w-full h-full flex flex-col justify-between p-6 rounded-3xl border bg-gradient-to-b from-[#261938] via-[#1b1228] to-[#140d1f] shadow-2xl transition-all duration-300 ${borderStyles} ${
            isFlipped ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
          }`}
        >
          {/* Back Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#dfb877]" />
              <span className="text-xs font-serif text-[#fbcfe8] font-medium">
                {card.backHeading}
              </span>
            </div>
            <div className="p-1 rounded-full bg-white/5 text-[#a59582] hover:text-white">
              <RotateCw className="w-3 h-3" />
            </div>
          </div>

          {/* Reflection Content */}
          <div className="my-auto py-2">
            <Paragraph size="sm" className="text-[#f5ede2] text-xs sm:text-[13px] leading-relaxed font-sans font-normal">
              {card.reflection}
            </Paragraph>
          </div>

          {/* Back Footer */}
          <div className="text-[10px] text-[#a59582] font-mono tracking-wider uppercase text-right border-t border-white/10 pt-2.5">
            <span>Card #{index + 1} • Tap to flip back</span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
