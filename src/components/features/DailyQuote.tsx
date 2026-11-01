import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, Sparkles, Quote, Smile } from 'lucide-react';
import { quotesData, type QuoteItem } from '@/data/quotesData';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { Heading, Caption } from '../common/Typography';
import { fadeUp } from '@/utils/motion';

export const DailyQuote: React.FC = () => {
  // Pick an initial quote based on day-of-year or random
  const [quoteIndex, setQuoteIndex] = useState<number>(() => {
    const today = new Date();
    const dayOfYear = Math.floor(
      (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24)
    );
    return dayOfYear % quotesData.length;
  });

  const [isRotating, setIsRotating] = useState(false);

  const nextQuote = () => {
    setIsRotating(true);
    setQuoteIndex((prev) => (prev + 1) % quotesData.length);
    setTimeout(() => setIsRotating(false), 500);
  };

  // Optional automatic rotation every 30 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % quotesData.length);
    }, 30000);

    return () => clearInterval(timer);
  }, []);

  const currentQuote: QuoteItem = quotesData[quoteIndex] || quotesData[0];

  return (
    <motion.div
      id="daily-quote"
      aria-label="Daily Quote"
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-40px' }}
      className="w-full max-w-2xl mx-auto my-8 px-3 select-none"
    >
      <div className="relative rounded-3xl p-6 sm:p-8 border border-[#c084fc]/30 bg-gradient-to-br from-[#1b1228] via-[#140d1f] to-[#070509] shadow-xl shadow-[#3b0764]/20 overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 w-44 h-44 bg-[#c084fc]/10 blur-3xl pointer-events-none rounded-full" />

        {/* Top Header */}
        <div className="flex items-center justify-between gap-3 mb-5 border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <Badge variant="lavender" size="sm">
              <Smile className="w-3.5 h-3.5 mr-1 text-[#fbcfe8]" />
              <span>Gundoos Quote of the Moment</span>
            </Badge>
            <span className="text-[11px] font-mono text-[#a59582] hidden sm:inline">
              #{currentQuote.id} of {quotesData.length}
            </span>
          </div>

          <Button
            variant="glass"
            size="sm"
            onClick={nextQuote}
            iconLeft={<RefreshCw className={`w-3.5 h-3.5 text-[#fbcfe8] ${isRotating ? 'animate-spin' : ''}`} />}
            className="text-xs text-[#cbbead] hover:text-[#fdfaf6] cursor-pointer"
            aria-label="Refresh quote"
          >
            <span>Another One 😂</span>
          </Button>
        </div>

        {/* Quote Content with Animated Slide */}
        <div className="relative min-h-[90px] flex flex-col justify-center my-2">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuote.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-3"
            >
              <div className="flex items-start gap-3">
                <Quote className="w-5 h-5 text-[#f472b6] shrink-0 mt-1 opacity-70" />
                <Heading level={3} className="text-lg sm:text-xl md:text-2xl font-serif text-[#fdfaf6] leading-relaxed">
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
        <div className="flex items-center justify-between text-[11px] text-[#a59582] border-t border-white/10 pt-3 mt-4">
          <Caption className="text-[#a59582] flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-[#dfb877]" />
            <span>35+ personalized Deepa &amp; Gokul quotes</span>
          </Caption>
          <span className="text-[10px] text-[#fbcfe8]/70">Auto-rotates every 30s</span>
        </div>
      </div>
    </motion.div>
  );
};
