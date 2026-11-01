import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, Sparkles, Quote, Smile, Calendar } from 'lucide-react';
import { waitingQuotesData, type WaitingQuoteItem } from '@/data/waitingQuotesData';
import { getDailyQuoteIndex, getFormattedCurrentISTDate } from '@/utils/birthday';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { Heading, Caption } from '../common/Typography';
import { fadeUp } from '@/utils/motion';

export interface DailyWaitingQuoteProps {
  injectedDate?: Date | string;
}

export const DailyWaitingQuote: React.FC<DailyWaitingQuoteProps> = ({ injectedDate }) => {
  // Deterministic daily index based strictly on IST date
  const dailyIndex = getDailyQuoteIndex(injectedDate, waitingQuotesData.length);

  // Temporary override index for "Another One 😂" button
  const [temporaryIndex, setTemporaryIndex] = useState<number | null>(null);
  const [isRotating, setIsRotating] = useState(false);

  const activeIndex = temporaryIndex !== null ? temporaryIndex : dailyIndex;
  const currentQuote: WaitingQuoteItem = waitingQuotesData[activeIndex] || waitingQuotesData[0];
  const isShowingDaily = temporaryIndex === null || temporaryIndex === dailyIndex;
  const currentISTDate = getFormattedCurrentISTDate(injectedDate);

  const handleNextRandomQuote = () => {
    setIsRotating(true);
    // Pick another quote different from the current one
    setTemporaryIndex((prev) => {
      const current = prev !== null ? prev : dailyIndex;
      let next = Math.floor(Math.random() * waitingQuotesData.length);
      if (next === current) {
        next = (next + 1) % waitingQuotesData.length;
      }
      return next;
    });
    setTimeout(() => setIsRotating(false), 450);
  };

  const handleResetToDaily = () => {
    setIsRotating(true);
    setTemporaryIndex(null);
    setTimeout(() => setIsRotating(false), 450);
  };

  return (
    <motion.div
      id="daily-quote"
      aria-label="Daily Waiting Quote"
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      className="w-full max-w-2xl mx-auto my-6 px-3 select-none"
    >
      <div className="relative rounded-3xl p-6 sm:p-8 border border-[#c084fc]/30 bg-gradient-to-br from-[#1b1228] via-[#140d1f] to-[#070509] shadow-xl shadow-[#3b0764]/20 overflow-hidden">
        {/* Soft atmospheric backlight */}
        <div className="absolute top-0 right-0 w-44 h-44 bg-[#c084fc]/10 blur-3xl pointer-events-none rounded-full" />
        <div className="absolute bottom-0 left-0 w-36 h-36 bg-[#f472b6]/10 blur-2xl pointer-events-none rounded-full" />

        {/* Top Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-5 border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <Badge variant="lavender" size="sm">
              <Smile className="w-3.5 h-3.5 mr-1 text-[#fbcfe8]" />
              <span>Gundoos Daily Waiting Quote</span>
            </Badge>
            {isShowingDaily ? (
              <span className="text-[11px] font-mono text-[#dfb877] hidden sm:inline flex items-center gap-1">
                <Calendar className="w-3 h-3 inline" />
                <span>Today's Official Pick</span>
              </span>
            ) : (
              <button
                onClick={handleResetToDaily}
                className="text-[11px] font-mono text-[#fbcfe8] underline hover:text-[#fdfaf6] cursor-pointer"
              >
                Back to today's quote
              </button>
            )}
          </div>

          <Button
            variant="glass"
            size="sm"
            onClick={handleNextRandomQuote}
            iconLeft={
              <RefreshCw
                className={`w-3.5 h-3.5 text-[#fbcfe8] ${isRotating ? 'animate-spin' : ''}`}
              />
            }
            className="text-xs text-[#cbbead] hover:text-[#fdfaf6] cursor-pointer"
            aria-label="Show another quote"
          >
            <span>Another One 😂</span>
          </Button>
        </div>

        {/* Quote Content with Animated Slide */}
        <div className="relative min-h-[96px] flex flex-col justify-center my-2">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuote.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-3"
            >
              <div className="flex items-start gap-3">
                <Quote className="w-5 h-5 text-[#f472b6] shrink-0 mt-1 opacity-70" />
                <Heading
                  level={3}
                  className="text-lg sm:text-xl md:text-2xl font-serif text-[#fdfaf6] leading-relaxed"
                >
                  "{currentQuote.text}"
                </Heading>
              </div>

              <div className="flex items-center justify-between text-xs pt-1 pl-8">
                <span className="font-mono text-[11px] text-[#dfb877] uppercase tracking-wider">
                  • {currentQuote.tag} •
                </span>
                <span className="text-xl">{currentQuote.emoji}</span>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Bottom indicator */}
        <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-[#a59582] border-t border-white/10 pt-3 mt-4">
          <Caption className="text-[#a59582] flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-[#dfb877]" />
            <span>Updated daily at midnight IST • {currentISTDate}</span>
          </Caption>
          <span className="text-[10px] text-[#fbcfe8]/70">
            {isShowingDaily ? 'Date-locked quote' : 'Browsing random quote'}
          </span>
        </div>
      </div>
    </motion.div>
  );
};
