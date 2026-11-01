import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Heart, Gift, RefreshCw } from 'lucide-react';
import { finaleData } from '@/data/finaleData';
import { Section } from '../layout/Section';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { Heading, Paragraph, Caption } from '../common/Typography';
import { SubtleConfetti } from '../common/SubtleConfetti';
import { fadeUp, staggerContainer } from '@/utils/motion';
import { getBirthdayCountdown } from '@/utils/birthday';

export const FinaleSection: React.FC = () => {
  const [isRevealed, setIsRevealed] = useState(false);
  const { currentAge, turningAge, isBirthdayToday, targetYear } = getBirthdayCountdown();
  const celebratedAge = isBirthdayToday ? currentAge : turningAge;

  const mainTitleText = finaleData.mainTitle || `One Last Thing, Gundoos... 🐼`;

  return (
    <Section
      id="finale"
      containerWidth="medium"
      glow="gold"
      className="relative overflow-hidden"
    >
      {/* Subtle Celebration Confetti Effect when Revealed */}
      {isRevealed && <SubtleConfetti active={isRevealed} />}

      <div className="relative min-h-[460px] flex items-center justify-center">
        <AnimatePresence mode="wait">
          {!isRevealed ? (
            /* 1. INITIAL TEASER STATE */
            <motion.div
              key="teaser-state"
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{
                opacity: 0,
                scale: 0.95,
                y: -20,
                transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
              }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-lg text-center"
            >
              <div className="rounded-3xl p-8 sm:p-12 border border-[#dfb877]/35 bg-gradient-to-b from-[#1b1228] via-[#140d1f] to-[#070509] shadow-2xl shadow-black/80 flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-[#dfb877]/15 border border-[#dfb877]/35 flex items-center justify-center mb-6 text-[#dfb877]">
                  <Gift className="w-7 h-7" />
                </div>

                <Heading
                  level={2}
                  className="text-2xl sm:text-3xl font-serif text-[#fdfaf6] mb-3"
                >
                  {finaleData.teaserText}
                </Heading>

                <Paragraph size="base" className="text-[#cbbead] mb-8 font-sans">
                  A parting wish as you step into your {celebratedAge}th year.
                </Paragraph>

                <Button
                  variant="gold"
                  size="lg"
                  onClick={() => setIsRevealed(true)}
                  iconLeft={<Sparkles className="w-4 h-4 text-[#0a080c]" />}
                  className="shadow-xl shadow-[#dfb877]/20 text-base"
                >
                  {finaleData.ctaText}
                </Button>
              </div>
            </motion.div>
          ) : (
            /* 2. REVEALED CELEBRATION FINALE STATE */
            <motion.div
              key="finale-state"
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="w-full text-center flex flex-col items-center"
            >
              {/* Top Celebration Badge */}
              <motion.div variants={fadeUp} className="mb-6">
                <Badge variant="gold" icon={<Sparkles className="w-3.5 h-3.5 fill-current" />}>
                  A Keepsake Blessing
                </Badge>
              </motion.div>

              {/* Headline: One Last Thing, Gundoos... 🐼 */}
              <motion.div variants={fadeUp} className="relative mb-6">
                <div className="absolute inset-0 bg-[#f472b6]/15 blur-3xl rounded-full pointer-events-none" />
                <Heading
                  level={1}
                  className="text-3xl sm:text-5xl md:text-6xl font-serif text-gradient-rose leading-tight"
                >
                  {mainTitleText}
                </Heading>
              </motion.div>

              {/* Subtitle */}
              <motion.div variants={fadeUp} className="max-w-xl mb-8">
                <Paragraph
                  size="lg"
                  className="text-[#f5ede2] text-base sm:text-xl font-serif font-light leading-relaxed italic"
                >
                  Here's to stepping into {celebratedAge} with all the happiness you deserve.
                </Paragraph>
              </motion.div>

              {/* Final Message Card (Reveals smoothly) */}
              <motion.div
                variants={fadeUp}
                className="w-full max-w-2xl rounded-3xl p-8 sm:p-12 border border-[#f472b6]/35 bg-[#140d1f]/95 backdrop-blur-xl shadow-2xl shadow-[#3b0764]/40 text-left relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none">
                  <Heart className="w-32 h-32 text-[#f472b6]" />
                </div>

                <div className="flex items-center gap-2 mb-6">
                  <span className="text-xl">🐼</span>
                  <Caption className="text-[#dfb877] text-xs uppercase tracking-widest font-mono">
                    Deepa's {celebratedAge}th Birthday Message
                  </Caption>
                </div>

                <div className="space-y-4 mb-8 text-[#fdfaf6] font-serif text-base sm:text-lg leading-relaxed">
                  {finaleData.finalMessage.map((msg, index) => (
                    <p
                      key={index}
                      className={
                        index === finaleData.finalMessage.length - 1
                          ? 'text-xl sm:text-2xl text-gradient-rose font-bold pt-2'
                          : index === finaleData.finalMessage.length - 2
                          ? 'text-[#dfb877] font-semibold'
                          : 'text-[#f5ede2]'
                      }
                    >
                      {msg}
                    </p>
                  ))}
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-[#a59582]">
                  <span className="font-serif italic text-sm">{finaleData.closingSignature}</span>
                  <div className="flex items-center gap-1.5 text-[#f472b6]">
                    <Heart className="w-4 h-4 fill-current" />
                    <span className="font-serif text-[#fbcfe8]">Nov 2, {targetYear}</span>
                  </div>
                </div>
              </motion.div>

              {/* Replay Finale Action */}
              <motion.div variants={fadeUp} className="mt-10">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsRevealed(false)}
                  iconLeft={<RefreshCw className="w-3.5 h-3.5 text-[#a59582]" />}
                  className="text-xs text-[#a59582] hover:text-[#fdfaf6]"
                >
                  Replay Surprise
                </Button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Section>
  );
};
