import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Sparkles, FolderX, Heart, Quote } from 'lucide-react';
import { letterData } from '@/data/letterData';
import { getCurrentAge, getNextBirthdayYear, isBirthdayToday } from '@/utils/birthday';
import { Section } from '../layout/Section';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { Heading, Paragraph, Caption } from '../common/Typography';
import { fadeUp, staggerContainer } from '@/utils/motion';

export const LetterSection: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const isBirthday = isBirthdayToday();
  const currentAge = getCurrentAge();
  const targetYear = getNextBirthdayYear();
  const celebratedAge = isBirthday ? currentAge : currentAge + 1;
  const letterDisplayDate = `November 2, ${targetYear}`;

  return (
    <Section
      id="letter"
      title="A Handwritten Letter"
      subtitle="FROM GOKUL TO DEEPA"
      description={letterData.subtitleHeading}
      containerWidth="medium"
      glow="rose"
    >
      <div className="relative min-h-[440px] flex items-center justify-center">
        <AnimatePresence mode="wait">
          {!isOpen ? (
            /* 1. INITIAL SEALED ENVELOPE STATE */
            <motion.div
              key="sealed-envelope"
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{
                opacity: 0,
                scale: 0.95,
                y: -20,
                transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
              }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-lg"
            >
              <div className="relative rounded-3xl p-8 sm:p-12 border border-[#f472b6]/35 bg-gradient-to-b from-[#1b1228] via-[#140d1f] to-[#070509] shadow-2xl shadow-[#3b0764]/40 text-center flex flex-col items-center overflow-hidden">
                {/* Ambient Glow behind envelope */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-[#f472b6]/20 blur-[100px] rounded-full pointer-events-none" />

                {/* Wax Seal / Stamp Icon */}
                <div className="relative mb-6">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#6e2633] via-[#8c3343] to-[#f472b6] border-2 border-[#dfb877]/70 shadow-xl shadow-[#6e2633]/60 flex items-center justify-center text-[#dfb877]">
                    <span className="text-2xl filter drop-shadow">🐼</span>
                  </div>
                  <div className="absolute -top-1 -right-1">
                    <Sparkles className="w-4 h-4 text-[#dfb877]" />
                  </div>
                </div>

                {/* Subtitle Heading Prompt */}
                <p className="text-xs sm:text-sm uppercase font-mono tracking-widest text-[#dfb877] mb-3">
                  {letterData.subtitleHeading}
                </p>

                {/* Teaser Text */}
                <Heading
                  level={3}
                  className="text-xl sm:text-2xl font-serif text-[#fdfaf6] mb-3 leading-relaxed"
                >
                  {letterData.teaserText.replace(/19th/g, `${celebratedAge}th`)}
                </Heading>

                <Paragraph size="sm" className="text-[#cbbead] mb-8">
                  A sealed letter written for {letterDisplayDate}. Take your time and read it whenever you're ready.
                </Paragraph>

                {/* Open Letter Button */}
                <Button
                  variant="blush"
                  size="lg"
                  onClick={() => setIsOpen(true)}
                  iconLeft={<Mail className="w-4 h-4 text-[#070509]" />}
                  className="shadow-xl shadow-[#f472b6]/30 border border-[#fbcfe8]/60 text-base"
                >
                  {letterData.ctaText}
                </Button>
              </div>
            </motion.div>
          ) : (
            /* 2. REVEALED DEEPLY PERSONAL LETTER STATE */
            <motion.div
              key="opened-letter"
              initial={{ opacity: 0, scale: 0.96, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="w-full"
            >
              <div className="relative rounded-3xl p-6 sm:p-12 md:p-14 border border-[#dfb877]/35 bg-gradient-to-b from-[#1b1227]/98 via-[#140d20]/95 to-[#0b0712]/98 shadow-[0_20px_60px_-15px_rgba(223,184,119,0.15)] overflow-hidden">
                {/* Subtle Letter Stamp Badge & Date */}
                <div className="flex items-center justify-between border-b border-white/10 pb-5 mb-6 sm:mb-8">
                  <div className="flex items-center gap-2">
                    <Badge variant="gold" icon={<Sparkles className="w-3.5 h-3.5" />}>
                      A Handwritten Keepsake
                    </Badge>
                  </div>
                  <Caption className="text-[#a59582] text-xs font-mono">
                    {letterDisplayDate}
                  </Caption>
                </div>

                {/* The Emotional Heading Prompt */}
                <div className="mb-8 text-center sm:text-left">
                  <p className="inline-flex items-center gap-2 text-xs sm:text-sm font-mono tracking-wider uppercase text-[#dfb877]/90 px-3 py-1 rounded-full bg-[#dfb877]/10 border border-[#dfb877]/20">
                    <Sparkles className="w-3 h-3 text-[#dfb877]" />
                    <span>{letterData.subtitleHeading}</span>
                  </p>
                </div>

                {/* Letter Content with Staggered Entrance */}
                <motion.div
                  variants={staggerContainer}
                  initial="hidden"
                  animate="visible"
                  className="space-y-6 text-[#fdfaf6]"
                >
                  {/* Salutation */}
                  <motion.div variants={fadeUp}>
                    <Heading
                      level={2}
                      className="text-2xl sm:text-4xl font-serif text-gradient-rose mb-3 tracking-wide"
                    >
                      {letterData.salutation}
                    </Heading>
                  </motion.div>

                  {/* Intro Paragraphs */}
                  {letterData.introParagraphs.map((para, idx) => {
                    const dynamicText = para.replace(/19th/gi, `${celebratedAge}th`);
                    return (
                      <motion.div key={`intro-${idx}`} variants={fadeUp}>
                        <Paragraph
                          size="lg"
                          className="font-serif text-base sm:text-lg text-[#f6ede2] leading-relaxed sm:leading-loose font-normal"
                        >
                          {dynamicText}
                        </Paragraph>
                      </motion.div>
                    );
                  })}

                  {/* Gentle Acknowledgement of Recent Difficult Phase */}
                  {letterData.difficultPhaseLead.map((para, idx) => (
                    <motion.div key={`lead-${idx}`} variants={fadeUp}>
                      <Paragraph
                        size="lg"
                        className="font-serif text-base sm:text-lg text-[#f6ede2] leading-relaxed sm:leading-loose font-normal"
                      >
                        {para}
                      </Paragraph>
                    </motion.div>
                  ))}

                  {/* SPECIAL EMPHASIS 1: "Their leaving doesn't reduce your worth." */}
                  <motion.div
                    variants={fadeUp}
                    className="relative my-7 p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-[#f472b6]/15 via-[#c084fc]/10 to-[#dfb877]/15 border border-[#dfb877]/40 shadow-xl shadow-[#3b0764]/25 overflow-hidden"
                  >
                    <div className="flex items-start gap-3 sm:gap-4">
                      <Quote className="w-6 h-6 sm:w-8 sm:h-8 text-[#dfb877] shrink-0 mt-1 opacity-80" />
                      <div className="space-y-2.5">
                        <p className="font-serif text-xl sm:text-2xl md:text-3xl text-[#dfb877] font-semibold tracking-wide leading-snug drop-shadow-sm">
                          "{letterData.worthHighlight}"
                        </p>
                        <p className="font-serif text-sm sm:text-base text-[#f5ede2]/90 leading-relaxed font-light">
                          {letterData.worthExplanation}
                        </p>
                      </div>
                    </div>
                  </motion.div>

                  {/* SPECIAL EMPHASIS 2: "Your past doesn't decide your future." */}
                  <motion.div
                    variants={fadeUp}
                    className="relative my-7 p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-[#c084fc]/15 via-[#f472b6]/10 to-[#dfb877]/15 border border-[#c084fc]/40 shadow-xl shadow-[#3b0764]/25 overflow-hidden"
                  >
                    <div className="flex items-start gap-3 sm:gap-4">
                      <Quote className="w-6 h-6 sm:w-8 sm:h-8 text-[#c084fc] shrink-0 mt-1 opacity-80" />
                      <div className="space-y-2.5">
                        <p className="font-serif text-xl sm:text-2xl md:text-3xl text-[#fbcfe8] font-semibold tracking-wide leading-snug drop-shadow-sm">
                          "{letterData.futureHighlight}"
                        </p>
                        <p className="font-serif text-sm sm:text-base text-[#f5ede2]/90 leading-relaxed font-light">
                          {letterData.futureExplanation}
                        </p>
                      </div>
                    </div>
                  </motion.div>

                  {/* SPECIAL EMPHASIS 3: "You don't always have to be the strong one." */}
                  <motion.div
                    variants={fadeUp}
                    className="relative my-7 p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-[#dfb877]/15 via-[#f472b6]/10 to-[#c084fc]/15 border border-[#f472b6]/40 shadow-xl shadow-[#3b0764]/25 overflow-hidden"
                  >
                    <div className="flex items-start gap-3 sm:gap-4">
                      <Quote className="w-6 h-6 sm:w-8 sm:h-8 text-[#f472b6] shrink-0 mt-1 opacity-80" />
                      <div className="space-y-2.5">
                        <p className="font-serif text-xl sm:text-2xl md:text-3xl text-gradient-rose font-semibold tracking-wide leading-snug drop-shadow-sm">
                          "{letterData.strengthHighlight}"
                        </p>
                        <p className="font-serif text-sm sm:text-base text-[#f5ede2]/90 leading-relaxed font-light">
                          {letterData.strengthExplanation}
                        </p>
                      </div>
                    </div>
                  </motion.div>

                  {/* GOKUL'S PERSONAL FRIEND MESSAGE BLOCK */}
                  <motion.div
                    variants={fadeUp}
                    className="relative my-8 p-6 sm:p-9 rounded-2xl bg-gradient-to-br from-[#1d142b]/95 to-[#120a1d]/95 border-l-4 border-l-[#f472b6] border-y border-r border-white/10 shadow-2xl"
                  >
                    <div className="flex items-center gap-2 mb-4 text-xs uppercase tracking-wider text-[#dfb877] font-mono font-medium">
                      <Heart className="w-3.5 h-3.5 fill-[#f472b6] text-[#f472b6]" />
                      <span>{letterData.personalMessage.badge}</span>
                    </div>

                    <div className="space-y-4 font-serif text-base sm:text-lg text-[#fdfaf6] leading-relaxed italic">
                      <p>"{letterData.personalMessage.bodyPart1}"</p>
                      <p>"{letterData.personalMessage.bodyPart2}"</p>
                    </div>

                    {/* SPECIAL EMPHASIS 4: "I'm here, okay?" */}
                    <div className="mt-6 pt-5 border-t border-white/10 text-center sm:text-left">
                      <div className="inline-block px-5 py-2 rounded-full bg-[#f472b6]/15 border border-[#f472b6]/40 shadow-inner">
                        <span className="font-serif text-lg sm:text-2xl text-[#fbcfe8] font-semibold tracking-wide not-italic">
                          "{letterData.personalMessage.hereHighlight}"
                        </span>
                      </div>
                    </div>
                  </motion.div>

                  {/* Looking Forward & Dreams */}
                  {letterData.lookingForward.map((para, idx) => (
                    <motion.div key={`forward-${idx}`} variants={fadeUp}>
                      <Paragraph
                        size="lg"
                        className="font-serif text-base sm:text-lg text-[#f6ede2] leading-relaxed sm:leading-loose font-normal"
                      >
                        {para}
                      </Paragraph>
                    </motion.div>
                  ))}

                  {/* Gentle Pre-closing prompt */}
                  <motion.div variants={fadeUp} className="pt-2">
                    <Paragraph
                      size="lg"
                      className="font-serif text-base sm:text-lg text-[#cbbead] leading-relaxed italic"
                    >
                      {letterData.closingWishes.tagline2}
                    </Paragraph>
                  </motion.div>

                  {/* Final Birthday Celebration Tagline & Signoff */}
                  <motion.div
                    variants={fadeUp}
                    className="pt-8 border-t border-white/10 space-y-4"
                  >
                    {/* "Happy 19th Birthday, Gundoos! 🐼❤️" */}
                    <Heading
                      level={2}
                      className="text-2xl sm:text-4xl font-serif text-gradient-rose font-bold"
                    >
                      {letterData.closingWishes.birthdayCelebrate.replace(/19th/gi, `${celebratedAge}th`)}
                    </Heading>

                    {/* "Keep that smile. Keep that madness. Keep being YOU." */}
                    <p className="text-base sm:text-xl font-serif text-[#dfb877] font-medium tracking-wide">
                      {letterData.closingWishes.tagline1}
                    </p>

                    {/* Valediction & Signature */}
                    <div className="pt-4 flex flex-col items-start gap-1">
                      <Caption className="text-[#a59582] text-sm italic font-serif">
                        {letterData.valediction}
                      </Caption>
                      <Heading
                        level={3}
                        className="text-xl sm:text-2xl font-serif text-[#dfb877] flex items-center gap-2 font-medium"
                      >
                        {letterData.senderName}
                      </Heading>
                    </div>
                  </motion.div>
                </motion.div>

                {/* Reseal Letter Button */}
                <div className="mt-12 pt-6 border-t border-white/10 flex justify-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsOpen(false)}
                    iconLeft={<FolderX className="w-3.5 h-3.5 text-[#a59582]" />}
                    className="text-xs text-[#a59582] hover:text-[#fdfaf6] cursor-pointer"
                  >
                    Reseal Letter
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Section>
  );
};
