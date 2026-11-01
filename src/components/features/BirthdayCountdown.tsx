import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Calendar, Heart, Clock } from 'lucide-react';
import {
  getBirthdayCountdown,
  type BirthdayCountdownResult,
} from '@/utils/birthday';
import { Badge } from '../common/Badge';
import { Heading, Paragraph, Caption } from '../common/Typography';
import { fadeUp } from '@/utils/motion';

export interface BirthdayCountdownProps {
  injectedDate?: Date | string;
  onBirthdayModeChange?: (isBirthday: boolean) => void;
}

export const BirthdayCountdown: React.FC<BirthdayCountdownProps> = ({
  injectedDate,
  onBirthdayModeChange,
}) => {
  const [countdown, setCountdown] = useState<BirthdayCountdownResult>(() =>
    getBirthdayCountdown(injectedDate)
  );

  useEffect(() => {
    onBirthdayModeChange?.(getBirthdayCountdown(injectedDate).isBirthdayToday);

    // Live tick every second
    const interval = setInterval(() => {
      const current = getBirthdayCountdown(injectedDate);
      setCountdown(current);
      onBirthdayModeChange?.(current.isBirthdayToday);
    }, 1000);

    return () => clearInterval(interval);
  }, [injectedDate, onBirthdayModeChange]);

  const { days, hours, minutes, seconds, isBirthdayToday, turningAge, currentAge, targetYear } =
    countdown;

  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      aria-label="Birthday countdown"
      id="birthday-countdown"
      className="w-full max-w-3xl mx-auto my-6 px-3 select-none"
    >
      <div className="relative rounded-3xl p-6 sm:p-8 border border-[#f472b6]/30 bg-gradient-to-b from-[#1b1228]/95 via-[#140d1f]/95 to-[#070509]/95 backdrop-blur-xl shadow-2xl shadow-[#3b0764]/30 overflow-hidden text-center">
        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-32 bg-gradient-to-r from-[#f472b6]/20 via-[#c084fc]/15 to-[#dfb877]/10 blur-3xl pointer-events-none rounded-full" />

        {/* Header Badge */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
          <Badge variant={isBirthdayToday ? 'gold' : 'blush'} size="sm">
            <Sparkles className="w-3.5 h-3.5 mr-1 text-[#dfb877]" />
            <span>
              {isBirthdayToday
                ? `🎂 HAPPY ${currentAge}TH BIRTHDAY TODAY!`
                : `COUNTING DOWN TO NOVEMBER 2, ${targetYear}`}
            </span>
          </Badge>
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white/5 border border-white/10 text-[11px] text-[#cbbead]">
            <Clock className="w-3 h-3 text-[#f472b6]" />
            <span>Asia/Kolkata (IST)</span>
          </div>
        </div>

        {/* Dynamic Heading based on Birthday Mode */}
        {isBirthdayToday ? (
          <div className="space-y-2 mb-6">
            <Heading level={2} className="text-3xl sm:text-4xl md:text-5xl font-serif text-gradient-rose">
              Today is Your Special Day, Gundoos! 🐼🎂
            </Heading>
            <Paragraph size="base" className="text-[#f5ede2] font-serif italic max-w-lg mx-auto">
              Officially {currentAge} years of spreading joy, endless chatter, and laughter everywhere you go.
            </Paragraph>
          </div>
        ) : (
          <div className="space-y-2 mb-6">
            <Heading level={2} className="text-2xl sm:text-3xl md:text-4xl font-serif text-[#fdfaf6]">
              Your next special day is getting closer... ✨
            </Heading>
            <Paragraph size="sm" className="text-[#cbbead] max-w-md mx-auto">
              Counting down every second until Deepa turns{' '}
              <span className="text-[#fbcfe8] font-semibold">{turningAge}</span> on November 2, {targetYear}.
            </Paragraph>
          </div>
        )}

        {/* Countdown Digits Grid */}
        {!isBirthdayToday ? (
          <div className="grid grid-cols-4 gap-2 sm:gap-4 max-w-lg mx-auto mb-6">
            <CountdownBox value={days} label="Days" />
            <CountdownBox value={hours} label="Hours" />
            <CountdownBox value={minutes} label="Minutes" />
            <CountdownBox value={seconds} label="Seconds" />
          </div>
        ) : (
          /* Birthday Celebration Active State */
          <div className="p-6 rounded-2xl bg-gradient-to-r from-[#f472b6]/15 via-[#c084fc]/15 to-[#dfb877]/15 border border-[#dfb877]/40 mb-6 flex items-center justify-center gap-4">
            <span className="text-4xl sm:text-5xl animate-bounce">🎂</span>
            <div className="text-left">
              <span className="text-xs uppercase tracking-widest text-[#dfb877] font-mono block">
                ★ Birthday Mode Active ★
              </span>
              <p className="font-serif text-[#fdfaf6] text-lg sm:text-xl font-medium">
                Celebrating Deepa's {currentAge}th Birthday!
              </p>
            </div>
            <span className="text-4xl sm:text-5xl animate-bounce" style={{ animationDelay: '0.2s' }}>
              🐼
            </span>
          </div>
        )}

        {/* Footer Subtitle */}
        <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-[#a59582] border-t border-white/10 pt-4">
          <Calendar className="w-3.5 h-3.5 text-[#f472b6]" />
          <span>
            {isBirthdayToday
              ? `Celebration date: November 2, ${targetYear}`
              : `Currently making the world more interesting for ${currentAge} years`}
          </span>
          <span className="opacity-40">•</span>
          <span className="flex items-center gap-1 text-[#fbcfe8]">
            <span>Crafted by Gokul</span>
            <Heart className="w-3 h-3 text-[#f472b6] fill-current" />
          </span>
        </div>
      </div>
    </motion.div>
  );
};

interface CountdownBoxProps {
  value: number;
  label: string;
}

const CountdownBox: React.FC<CountdownBoxProps> = ({ value, label }) => {
  const formatted = String(value).padStart(2, '0');

  return (
    <div className="flex flex-col items-center">
      <div className="w-full aspect-square sm:aspect-auto sm:h-20 rounded-2xl bg-[#0d0914] border border-[#f472b6]/25 flex items-center justify-center shadow-lg shadow-black/60 relative overflow-hidden group">
        {/* Subtle hover glow */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#f472b6]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

        <AnimatePresence mode="popLayout">
          <motion.span
            key={formatted}
            initial={{ y: 8, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -8, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-[#fdfaf6] tabular-nums"
          >
            {formatted}
          </motion.span>
        </AnimatePresence>
      </div>

      <Caption className="text-[10px] sm:text-xs font-mono uppercase tracking-widest text-[#a59582] mt-2">
        {label}
      </Caption>
    </div>
  );
};
