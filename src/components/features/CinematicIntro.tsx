import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Heart } from 'lucide-react';
import { AmbientParticles } from '../common/AmbientParticles';
import { Button } from '../common/Button';
import { Heading, Paragraph, Caption } from '../common/Typography';
import { FloatingMusicPlayer } from '../common/FloatingMusicPlayer';
import { siteConfig } from '@/config/siteConfig';
import { isBirthdayToday, getCurrentAge, getNextBirthdayYear } from '@/utils/birthday';
import { useMusic } from '@/context/useMusic';

export interface CinematicIntroProps {
  onOpen: () => void;
}

export const CinematicIntro: React.FC<CinematicIntroProps> = ({ onOpen }) => {
  const [isOpening, setIsOpening] = useState(false);
  const isBirthday = isBirthdayToday();
  const currentAge = getCurrentAge();
  const targetYear = getNextBirthdayYear();
  const celebratedAge = isBirthday ? currentAge : currentAge + 1;

  const { setActiveSection } = useMusic();

  useEffect(() => {
    setActiveSection('cinematic-intro');
  }, [setActiveSection]);

  const handleOpenClick = () => {
    setIsOpening(true);
    setTimeout(() => {
      onOpen();
    }, 850);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{
        opacity: 0,
        scale: 1.04,
        filter: 'blur(14px)',
        transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] },
      }}
      transition={{ duration: 1.2, ease: 'easeOut' }}
      className="fixed inset-0 z-50 bg-[#070509] flex flex-col items-center justify-between p-6 sm:p-12 overflow-hidden select-none"
    >
      {/* Background Ambient Glow & Particles */}
      <AmbientParticles count={32} />

      {/* Dreamy glow orbs: blush pink, soft lavender, and deep plum */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[520px] bg-gradient-to-r from-[#f472b6]/20 via-[#c084fc]/15 to-[#3b0764]/30 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-[400px] h-[220px] bg-[#dfb877]/10 blur-[130px] rounded-full pointer-events-none" />

      {/* Top Header Badge */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="z-10 pt-4"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-[#f472b6]/30 backdrop-blur-md shadow-lg shadow-[#3b0764]/20">
          <Sparkles className="w-3.5 h-3.5 text-[#f472b6]" />
          <Caption className="text-[#fbcfe8] tracking-widest uppercase text-[11px] font-medium">
            {isBirthday
              ? `A Special ${celebratedAge}th Birthday Surprise`
              : `A Special Keepsake for Deepa • Nov 2, ${targetYear}`}
          </Caption>
        </div>
      </motion.div>

      {/* Center Cinematic Typography Content */}
      <div className="z-10 max-w-2xl text-center my-auto flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="flex items-center justify-center gap-2 mb-3">
            <span className="text-2xl sm:text-3xl animate-bounce">🐼</span>
          </div>
          <Heading
            level={1}
            className="text-4xl sm:text-6xl md:text-7xl font-serif text-[#fdfaf6] mb-5 leading-[1.15] tracking-tight"
          >
            Hey Gundoos... <span className="text-[#f472b6]">🐼</span>
          </Heading>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, delay: 0.75, ease: [0.16, 1, 0.3, 1] }}
        >
          <Paragraph
            size="lg"
            className="text-[#e9d5ff]/90 font-serif text-lg sm:text-2xl font-normal max-w-lg mb-10 leading-relaxed italic"
          >
            Someone made a little something for you.
          </Paragraph>
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 14 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.05, ease: [0.16, 1, 0.3, 1] }}
        >
          <Button
            variant="blush"
            size="lg"
            onClick={handleOpenClick}
            isLoading={isOpening}
            iconRight={
              !isOpening ? (
                <ArrowRight className="w-4 h-4 text-[#0f0a15] transition-transform duration-300 group-hover:translate-x-1" />
              ) : undefined
            }
            className="group relative shadow-2xl shadow-[#f472b6]/30 border border-[#fbcfe8]/60 px-6 sm:px-10 py-3.5 sm:py-4 text-sm sm:text-base tracking-wide"
          >
            <span>Open Your Surprise ✨</span>
          </Button>
        </motion.div>
      </div>

      {/* Bottom Footer Note */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.8 }}
        transition={{ duration: 1, delay: 1.35 }}
        className="z-10 pb-4 text-center flex items-center gap-2"
      >
        <Caption className="text-[#a59582] text-[11px] flex items-center gap-1.5">
          <span>Crafted with care by {siteConfig.senderName}</span>
          <Heart className="w-3 h-3 text-[#f472b6] fill-[#f472b6]" />
          <span>for Deepa ({siteConfig.nickname})</span>
        </Caption>
      </motion.div>

      {/* Floating Music Player (Cinematic Intro: Cornfield Chase — Hans Zimmer) */}
      <FloatingMusicPlayer />
    </motion.div>
  );
};
