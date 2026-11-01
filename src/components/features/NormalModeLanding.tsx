import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Calendar, Heart } from 'lucide-react';
import { siteConfig } from '@/config/siteConfig';
import {
  getCurrentAge,
  getNextBirthdayYear,
  getFormattedCurrentISTDate,
  BIRTH_YEAR,
} from '@/utils/birthday';
import { Container } from '../common/Container';
import { Heading, Subheading, Paragraph, GradientText } from '../common/Typography';
import { AmbientParticles } from '../common/AmbientParticles';
import { NormalNavbar } from '../layout/NormalNavbar';
import { BirthdayCountdown } from './BirthdayCountdown';
import { DailyWaitingQuote } from './DailyWaitingQuote';
import { FloatingMusicPlayer } from '../common/FloatingMusicPlayer';
import { useMusic } from '@/context/useMusic';
import { fadeUp, staggerContainer } from '@/utils/motion';

export interface NormalModeLandingProps {
  injectedDate?: Date | string;
}

export const NormalModeLanding: React.FC<NormalModeLandingProps> = ({ injectedDate }) => {
  const currentAge = getCurrentAge(injectedDate);
  const targetYear = getNextBirthdayYear(injectedDate);
  const turningAge = targetYear - BIRTH_YEAR;
  const currentISTDate = getFormattedCurrentISTDate(injectedDate);
  const nickname = siteConfig.nickname || 'Gundoos 🐼';

  const { setActiveSection } = useMusic();

  useEffect(() => {
    setActiveSection('normal-landing');
  }, [setActiveSection]);

  return (
    <div className="min-h-screen bg-[#070509] text-[#f5ede2] relative selection:bg-[#f472b6]/40 selection:text-[#fdfaf6] flex flex-col justify-between">
      {/* 1. Normal Mode Navigation */}
      <NormalNavbar injectedDate={injectedDate} />

      {/* 2. Main Content Flow */}
      <main className="flex-1 pt-24 pb-16 px-4 relative overflow-hidden flex flex-col items-center justify-center">
        {/* Ambient Canvas Particles & Glows */}
        <AmbientParticles count={26} />

        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] sm:w-[680px] h-[340px] sm:h-[480px] rounded-full bg-gradient-to-tr from-[#f472b6]/15 via-[#c084fc]/15 to-[#dfb877]/10 blur-[140px] pointer-events-none" />

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
                  A YEAR-ROUND KEEPSAKE FOR GUNDOOS
                </Subheading>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#f472b6]/10 border border-[#f472b6]/25 text-[#fbcfe8] text-xs font-serif">
                <Calendar className="w-3 h-3 text-[#dfb877]" />
                <span>{currentISTDate}</span>
                <span className="opacity-40">•</span>
                <span>Current Age: {currentAge}</span>
              </div>
            </motion.div>

            {/* Cute Panda Icon Motif with Glow */}
            <motion.div variants={fadeUp} className="mb-5 relative flex items-center justify-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-[#261938] via-[#1b1228] to-[#3b0764] border border-[#f472b6]/30 flex items-center justify-center shadow-xl shadow-[#f472b6]/20 relative group">
                <span className="text-3xl sm:text-4xl filter drop-shadow-md">🐼</span>
                <motion.div
                  animate={{ y: [-2, 2, -2], opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute -top-3 text-[11px] bg-[#f472b6]/20 border border-[#f472b6]/40 text-[#fbcfe8] px-2.5 py-0.5 rounded-full font-serif"
                >
                  Turning {turningAge} ✨
                </motion.div>
              </div>
            </motion.div>

            {/* Main Welcome Heading */}
            <motion.div variants={fadeUp} className="relative mb-4">
              <div className="absolute inset-0 bg-gradient-to-r from-[#f472b6]/15 via-[#dfb877]/15 to-[#c084fc]/15 blur-2xl opacity-70 pointer-events-none" />
              <Heading
                level={1}
                className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-serif text-[#fdfaf6] leading-[1.12] tracking-tight"
              >
                Hey Gundoos... <br className="hidden sm:inline" />
                <GradientText variant="rose" className="font-serif">
                  Deepa! 🐼❤️
                </GradientText>
              </Heading>
            </motion.div>

            {/* Supporting Text */}
            <motion.div variants={fadeUp} className="max-w-2xl mb-3">
              <Paragraph
                size="lg"
                className="text-[#f5ede2] font-serif text-lg sm:text-2xl font-light leading-relaxed tracking-wide italic"
              >
                Just a little corner of the internet made especially for you, counting down to November 2.
              </Paragraph>
            </motion.div>

            {/* Sweet Sub-note with Nickname */}
            <motion.div variants={fadeUp} className="max-w-xl mb-6">
              <p className="text-xs sm:text-sm text-[#cbbead] font-sans leading-relaxed">
                To <span className="text-[#fbcfe8] font-medium">{nickname}</span> — the girl with the gorgeous curly hair, the non-stop stories, and an endlessly caring heart.
              </p>
            </motion.div>

            {/* Live Birthday Countdown Component */}
            <motion.div variants={fadeUp} className="w-full">
              <BirthdayCountdown injectedDate={injectedDate} />
            </motion.div>

            {/* Daily Funny Waiting Quote Component (Deterministic based on IST calendar date) */}
            <motion.div variants={fadeUp} className="w-full mt-2">
              <DailyWaitingQuote injectedDate={injectedDate} />
            </motion.div>
          </motion.div>
        </Container>
      </main>

      {/* 3. Normal Mode Footer */}
      <footer className="border-t border-white/10 py-8 text-center text-xs text-[#a59582] bg-[#070509]">
        <Container width="medium" className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-2 text-[#f472b6]">
            <Heart className="w-4 h-4 fill-current" />
            <span className="font-serif text-sm sm:text-base text-[#fdfaf6]">
              A Keepsake for {siteConfig.recipientName} ({siteConfig.nickname}) • Counting down to November 2, {targetYear}
            </span>
          </div>
          <p className="text-[11px] text-[#cbbead]">
            Crafted with lots of care and waiting patience by {siteConfig.senderName} • November 2, {targetYear}
          </p>
        </Container>
      </footer>

      {/* Floating Music Player (Normal Mode: Experience — Ludovico Einaudi) */}
      <FloatingMusicPlayer />
    </div>
  );
};
