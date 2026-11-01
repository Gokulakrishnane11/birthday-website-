import React from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, Sparkles, Calendar } from 'lucide-react';
import { siteConfig } from '@/config/siteConfig';
import {
  getCurrentAge,
  getNextBirthdayYear,
  isBirthdayToday,
  getFormattedCurrentISTDate,
} from '@/utils/birthday';
import { AmbientParticles } from '../common/AmbientParticles';
import { Container } from '../common/Container';
import { Heading, Subheading, Paragraph, GradientText } from '../common/Typography';
import { BirthdayCountdown } from './BirthdayCountdown';
import { fadeUp, staggerContainer, subtleFloat } from '@/utils/motion';

export interface HeroSectionProps {
  onScrollClick?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onScrollClick }) => {
  const nickname = siteConfig.nickname || 'Gundoos 🐼';
  const isBirthday = isBirthdayToday();
  const currentAge = getCurrentAge();
  const targetYear = getNextBirthdayYear();
  const celebratedAge = isBirthday ? currentAge : currentAge + 1;
  const currentISTDate = getFormattedCurrentISTDate();

  return (
    <section
      id="hero"
      className="relative min-h-[100dvh] flex flex-col items-center justify-between py-12 sm:py-20 px-4 overflow-hidden bg-[#070509] select-none"
    >
      {/* 1. Ambient Background & Subtle Particle Canvas */}
      <AmbientParticles count={28} />

      {/* 2. Soft Light / Glow Behind Typography: Blush pink, lavender & champagne gold */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] sm:w-[680px] h-[340px] sm:h-[500px] rounded-full bg-gradient-to-tr from-[#f472b6]/20 via-[#c084fc]/15 to-[#dfb877]/10 blur-[140px] pointer-events-none" />

      {/* 3. Subtle Animated Ambient Light Rings */}
      <motion.div
        animate={{
          scale: [1, 1.08, 1],
          opacity: [0.25, 0.45, 0.25],
        }}
        transition={{
          duration: 9,
          repeat: Infinity,
          repeatType: 'reverse',
          ease: 'easeInOut',
        }}
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[560px] h-[300px] sm:h-[460px] rounded-full border border-[#f472b6]/20 pointer-events-none"
      />
      <motion.div
        animate={{
          scale: [1.05, 0.98, 1.05],
          opacity: [0.15, 0.35, 0.15],
        }}
        transition={{
          duration: 11,
          repeat: Infinity,
          repeatType: 'reverse',
          ease: 'easeInOut',
        }}
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[360px] sm:w-[640px] h-[360px] sm:h-[520px] rounded-full border border-[#c084fc]/15 pointer-events-none"
      />

      {/* Top Spacer for vertical balance */}
      <div className="w-full h-4 sm:h-8" />

      {/* 4. Center Typography Container with Staggered Entrance */}
      <Container width="medium" className="z-10 text-center flex flex-col items-center my-auto w-full">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center max-w-3xl w-full"
        >
          {/* Top Milestone Badge */}
          <motion.div variants={fadeUp} className="mb-5 flex flex-wrap items-center justify-center gap-2">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-[#f472b6]/30 backdrop-blur-md shadow-lg shadow-[#3b0764]/20">
              <Sparkles className="w-3.5 h-3.5 text-[#dfb877]" />
              <Subheading className="text-[#fbcfe8] text-xs sm:text-sm tracking-[0.2em] font-medium">
                {isBirthday
                  ? `TODAY IS DEEPA'S ${celebratedAge}TH BIRTHDAY!`
                  : `A YEAR-ROUND KEEPSAKE FOR GUNDOOS`}
              </Subheading>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#f472b6]/10 border border-[#f472b6]/25 text-[#fbcfe8] text-xs font-serif">
              <Calendar className="w-3 h-3 text-[#dfb877]" />
              <span>{isBirthday ? `Nov 2, ${targetYear}` : currentISTDate}</span>
              <span className="opacity-40">•</span>
              <span>{isBirthday ? `${celebratedAge} Years Young` : `Age: ${currentAge}`}</span>
            </div>
          </motion.div>

          {/* Decorative Birthday Cake Motif with Soft Glow */}
          <motion.div
            variants={fadeUp}
            className="mb-5 relative flex items-center justify-center"
          >
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-[#261938] via-[#1b1228] to-[#3b0764] border border-[#f472b6]/30 flex items-center justify-center shadow-xl shadow-[#f472b6]/20 relative group">
              <span className="text-3xl sm:text-4xl filter drop-shadow-md">
                {isBirthday ? '🎂' : '🐼'}
              </span>
              <motion.div
                animate={{ y: [-2, 2, -2], opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -top-3 text-xs bg-[#f472b6]/20 border border-[#f472b6]/40 text-[#fbcfe8] px-2.5 py-0.5 rounded-full font-serif"
              >
                {celebratedAge} ✨
              </motion.div>
            </div>
          </motion.div>

          {/* Main Heading: Happiest Birthday or Year-Round Greeting */}
          <motion.div variants={fadeUp} className="relative mb-4">
            <div className="absolute inset-0 bg-gradient-to-r from-[#f472b6]/15 via-[#dfb877]/15 to-[#c084fc]/15 blur-2xl opacity-70 pointer-events-none" />

            <Heading
              level={1}
              className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-serif text-[#fdfaf6] leading-[1.12] tracking-tight"
            >
              {isBirthday ? (
                <>
                  Happiest {celebratedAge}th Birthday, <br className="hidden sm:inline" />
                  <GradientText variant="rose" className="font-serif">
                    Deepa! ❤️
                  </GradientText>
                </>
              ) : (
                <>
                  Hey Gundoos... <br className="hidden sm:inline" />
                  <GradientText variant="rose" className="font-serif">
                    Deepa! 🐼❤️
                  </GradientText>
                </>
              )}
            </Heading>
          </motion.div>

          {/* Supporting Text */}
          <motion.div variants={fadeUp} className="max-w-2xl mb-3">
            <Paragraph
              size="lg"
              className="text-[#f5ede2] font-serif text-lg sm:text-2xl font-light leading-relaxed tracking-wide italic"
            >
              {isBirthday
                ? 'Today is all about celebrating the beautiful person you are.'
                : 'Just a little corner of the internet made especially for you, counting down to November 2.'}
            </Paragraph>
          </motion.div>

          {/* Sweet Sub-note with Nickname */}
          <motion.div variants={fadeUp} className="max-w-xl mb-4">
            <p className="text-xs sm:text-sm text-[#cbbead] font-sans leading-relaxed">
              To <span className="text-[#fbcfe8] font-medium">{nickname}</span> — the girl with the gorgeous curly hair, the non-stop stories, and an endlessly caring heart.
            </p>
          </motion.div>

          {/* Live Birthday Countdown Component */}
          <motion.div variants={fadeUp} className="w-full">
            <BirthdayCountdown />
          </motion.div>
        </motion.div>
      </Container>

      {/* 5. Animated Scroll Indicator */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        transition={{ delay: 1.2 }}
        className="z-10 flex flex-col items-center gap-2 cursor-pointer pt-4"
        onClick={onScrollClick}
      >
        <span className="text-[11px] font-sans uppercase tracking-[0.25em] text-[#a59582] hover:text-[#fbcfe8] transition-colors">
          Scroll to explore our world
        </span>

        <motion.div
          variants={subtleFloat}
          animate="animate"
          className="w-8 h-12 rounded-full border border-[#f5ede2]/15 flex items-center justify-center p-1.5 backdrop-blur-sm bg-white/5 hover:border-[#f472b6]/50 transition-colors"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{
              duration: 1.8,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <ChevronDown className="w-4 h-4 text-[#f472b6]" />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
};
