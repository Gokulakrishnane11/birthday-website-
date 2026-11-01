import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, ArrowRight, Shuffle } from 'lucide-react';
import { Badge } from '../common/Badge';
import { Heading, Paragraph } from '../common/Typography';
import { Button } from '../common/Button';
import { fadeUp } from '@/utils/motion';

export interface FeaturedMemory {
  id: string;
  tag: string;
  title: string;
  teaser: string;
  targetSectionId: string;
  emoji: string;
  badgeVariant: 'blush' | 'lavender' | 'gold' | 'rose';
}

const FEATURED_MEMORIES: FeaturedMemory[] = [
  {
    id: 'memory-phone-call',
    tag: 'Quiet Intuition',
    title: 'The Phone Call with Her Dad',
    teaser:
      'She knew what I was thinking before a single question could even leave my mouth.',
    targetSectionId: 'special-moments',
    emoji: '📞',
    badgeVariant: 'blush',
  },
  {
    id: 'memory-gym-aunty',
    tag: 'Lifetime Teasing',
    title: 'The Gym Aunty Investigation 😂',
    teaser:
      'An innocent workout report turned into her permanent comedy weapon to tease me.',
    targetSectionId: 'special-moments',
    emoji: '🏋️',
    badgeVariant: 'gold',
  },
  {
    id: 'memory-singing',
    tag: 'Accidental Concert',
    title: 'The Instagram Singing Incident 🎤',
    teaser:
      'I clearly said no, but Deepa insisted until the 1-time live tour debuted.',
    targetSectionId: 'special-moments',
    emoji: '🎙️',
    badgeVariant: 'lavender',
  },
  {
    id: 'memory-truth-or-dare',
    tag: 'Building Trust',
    title: 'Late-Night Truth or Dare Sessions 🎲',
    teaser:
      'One question led to another, slowly revealing our real thoughts and deepest trust.',
    targetSectionId: 'truth-or-dare',
    emoji: '🎲',
    badgeVariant: 'rose',
  },
  {
    id: 'memory-college-lead',
    tag: 'Where It Started',
    title: 'A Community Lead and a Team Member',
    teaser:
      'Official college projects that unexpectedly blossomed into our closest friendship.',
    targetSectionId: 'story',
    emoji: '💻',
    badgeVariant: 'blush',
  },
  {
    id: 'memory-curls',
    tag: 'Iconic Trait',
    title: 'Those Beautiful Curly Hair & Bubbly Laughs',
    teaser:
      'The vibrant, energetic, and talkative spirit that makes ordinary days extraordinary.',
    targetSectionId: 'things-i-love',
    emoji: '✨',
    badgeVariant: 'lavender',
  },
];

export const MemoryOfTheDay: React.FC = () => {
  // Deterministic daily index based on day of month, but user can shuffle
  const [index, setIndex] = useState<number>(() => {
    const day = new Date().getDate();
    return day % FEATURED_MEMORIES.length;
  });

  const nextMemory = () => {
    setIndex((prev) => (prev + 1) % FEATURED_MEMORIES.length);
  };

  const current = FEATURED_MEMORIES[index];

  const handleScrollTo = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <motion.div
      id="memory-of-the-day"
      aria-label="Memory of the day"
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-40px' }}
      className="w-full max-w-2xl mx-auto my-6 px-3 select-none"
    >
      <div className="relative rounded-3xl p-5 sm:p-7 border border-[#dfb877]/30 bg-gradient-to-r from-[#1b1228] via-[#140d1f] to-[#0d0914] shadow-xl shadow-black/70 overflow-hidden">
        <div className="flex items-center justify-between gap-3 mb-4 border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <Badge variant={current.badgeVariant} size="sm">
              <Calendar className="w-3.5 h-3.5 mr-1" />
              <span>Memory of the Day</span>
            </Badge>
            <span className="text-[11px] font-mono text-[#a59582] hidden sm:inline">
              Spotlight #{index + 1}
            </span>
          </div>

          <button
            onClick={nextMemory}
            className="flex items-center gap-1.5 text-xs text-[#a59582] hover:text-[#fdfaf6] cursor-pointer transition-colors"
            title="Show another memory"
          >
            <Shuffle className="w-3 h-3 text-[#dfb877]" />
            <span>Shuffle</span>
          </button>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          >
            <div className="space-y-1.5 max-w-md">
              <div className="flex items-center gap-2">
                <span className="text-xl">{current.emoji}</span>
                <Heading level={3} className="text-base sm:text-lg font-serif text-[#fdfaf6]">
                  {current.title}
                </Heading>
              </div>
              <Paragraph size="sm" className="text-[#cbbead] text-xs sm:text-sm">
                "{current.teaser}"
              </Paragraph>
            </div>

            <Button
              variant="gold"
              size="sm"
              onClick={() => handleScrollTo(current.targetSectionId)}
              iconRight={<ArrowRight className="w-3 h-3" />}
              className="text-xs whitespace-nowrap shrink-0 cursor-pointer"
            >
              Read Memory
            </Button>
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
