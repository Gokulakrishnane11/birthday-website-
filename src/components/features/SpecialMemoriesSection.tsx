import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  PhoneCall,
  Sparkles,
  Heart,
  Eye,
  Search,
  Quote,
  Smile,
  Mic,
  Music,
} from 'lucide-react';
import { siteConfig } from '@/config/siteConfig';
import { Section } from '../layout/Section';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Heading, Paragraph } from '../common/Typography';
import { Button } from '../common/Button';
import { fadeUp } from '@/utils/motion';

export const SpecialMemoriesSection: React.FC = () => {
  const [activeStory, setActiveStory] = useState<'phone' | 'gym' | 'singing'>('phone');
  const [phoneCallRevealed, setPhoneCallRevealed] = useState(false);
  const [gymReportRevealed, setGymReportRevealed] = useState(false);
  const [singingReviewRevealed, setSingingReviewRevealed] = useState(false);

  const phoneMemory = siteConfig.specialMemories.find((m) => m.id === 'phone-call-memory');
  const gymMemory = siteConfig.specialMemories.find((m) => m.id === 'gym-aunty-memory');
  const singingMemory = siteConfig.specialMemories.find((m) => m.id === 'singing-incident-memory');

  return (
    <Section
      id="special-moments"
      title="Inside Jokes & Sweet Moments"
      subtitle="REAL STORIES"
      description="Unforgettable memories that capture Deepa's intuition, teasing nature, and our funniest moments."
      containerWidth="wide"
      glow="gold"
    >
      {/* Tab Selector */}
      <div className="flex justify-center mb-10 px-2">
        <div className="inline-flex p-1 sm:p-1.5 rounded-full bg-[#140d1f] border border-white/10 backdrop-blur-md max-w-full overflow-x-auto">
          <button
            onClick={() => setActiveStory('phone')}
            className={`flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 cursor-pointer whitespace-nowrap ${
              activeStory === 'phone'
                ? 'bg-[#f472b6] text-[#070509] shadow-lg shadow-[#f472b6]/30 font-semibold'
                : 'text-[#cbbead] hover:text-[#fdfaf6]'
            }`}
          >
            <PhoneCall className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>The Phone Call</span>
          </button>
          <button
            onClick={() => setActiveStory('gym')}
            className={`flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 cursor-pointer whitespace-nowrap ${
              activeStory === 'gym'
                ? 'bg-[#dfb877] text-[#070509] shadow-lg shadow-[#dfb877]/30 font-semibold'
                : 'text-[#cbbead] hover:text-[#fdfaf6]'
            }`}
          >
            <Smile className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>The Gym Aunty 😂</span>
          </button>
          <button
            onClick={() => setActiveStory('singing')}
            className={`flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 cursor-pointer whitespace-nowrap ${
              activeStory === 'singing'
                ? 'bg-[#c084fc] text-[#070509] shadow-lg shadow-[#c084fc]/30 font-semibold'
                : 'text-[#cbbead] hover:text-[#fdfaf6]'
            }`}
          >
            <Mic className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>The Singing Incident 🎤</span>
          </button>
        </div>
      </div>

      {/* Memory Cards Display */}
      <div className="max-w-4xl mx-auto">
        <AnimatePresence mode="wait">
          {activeStory === 'phone' && (
            <motion.div
              key="phone-memory-view"
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, y: -20, transition: { duration: 0.3 } }}
            >
              <Card
                variant="glass"
                padding="none"
                className="overflow-hidden border border-[#f472b6]/30 bg-gradient-to-br from-[#1b1228] via-[#140d1f] to-[#070509] shadow-2xl shadow-[#3b0764]/30"
              >
                {/* Visual Header */}
                <div className="p-6 sm:p-10 border-b border-white/10 bg-gradient-to-r from-[#f472b6]/10 via-[#c084fc]/10 to-transparent flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-[#f472b6]/20 border border-[#f472b6]/40 flex items-center justify-center text-[#fbcfe8]">
                      <PhoneCall className="w-6 h-6" />
                    </div>
                    <div>
                      <Badge variant="blush" size="sm" className="mb-1">
                        {phoneMemory?.badge || 'A Thoughtful Moment'}
                      </Badge>
                      <Heading level={3} className="text-xl sm:text-2xl text-[#fdfaf6]">
                        {phoneMemory?.title || 'Sometimes, You Understand Without Me Saying Anything.'}
                      </Heading>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-[#cbbead]">
                    <Sparkles className="w-3.5 h-3.5 text-[#dfb877]" />
                    <span>Real Memory</span>
                  </div>
                </div>

                {/* Memory Content */}
                <div className="p-6 sm:p-10 space-y-6">
                  {/* Phone Call Interactive Mockup */}
                  <div className="rounded-2xl bg-[#0d0914] border border-white/10 p-5 sm:p-6 relative overflow-hidden">
                    <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10 text-xs text-[#a59582]">
                      <span className="flex items-center gap-1.5 text-[#fbcfe8]">
                        <span className="w-2 h-2 rounded-full bg-green-400 animate-ping" />
                        Incoming Call Returned • Deepa
                      </span>
                      <span>Evening Call</span>
                    </div>

                    <div className="space-y-4">
                      {/* Message 1 (Gokul's unspoken thought) */}
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#261938] text-xs flex items-center justify-center text-[#cbbead] shrink-0 font-serif">
                          G
                        </div>
                        <div className="rounded-2xl rounded-tl-sm bg-[#171022] border border-white/10 p-3.5 max-w-md text-xs sm:text-sm text-[#e8dccf]">
                          <p className="italic text-[#a59582] mb-1 text-[11px]">Gokul's unspoken thought:</p>
                          "Her line was busy when I called... I wonder who she was talking to?"
                        </div>
                      </div>

                      {/* Message 2 (Deepa's immediate intuition) */}
                      <div className="flex items-start gap-3 flex-row-reverse">
                        <div className="w-8 h-8 rounded-full bg-[#f472b6]/20 border border-[#f472b6]/40 text-xs flex items-center justify-center text-[#fbcfe8] shrink-0 font-serif font-bold">
                          D
                        </div>
                        <div className="rounded-2xl rounded-tr-sm bg-[#f472b6]/15 border border-[#f472b6]/30 p-3.5 max-w-md text-xs sm:text-sm text-[#fdfaf6]">
                          <p className="text-[11px] text-[#fbcfe8] font-medium mb-1 flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-[#dfb877]" /> Deepa (reading my mind before I spoke):
                          </p>
                          "Hey! I was just speaking with my dad."
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Narrative & Takeaway */}
                  <div className="space-y-4 text-sm sm:text-base text-[#e8dccf] leading-relaxed">
                    <Paragraph size="base">
                      {phoneMemory?.story}
                    </Paragraph>

                    <div className="p-4 sm:p-5 rounded-2xl bg-[#f472b6]/5 border border-[#f472b6]/20 flex items-start gap-3.5">
                      <Quote className="w-5 h-5 text-[#f472b6] shrink-0 mt-0.5" />
                      <p className="text-sm font-serif italic text-[#fbcfe8]">
                        "{phoneMemory?.takeaway}"
                      </p>
                    </div>
                  </div>

                  {/* Interactive Button */}
                  <div className="pt-2 flex justify-end">
                    <Button
                      variant={phoneCallRevealed ? 'glass' : 'blush'}
                      size="sm"
                      onClick={() => setPhoneCallRevealed(!phoneCallRevealed)}
                      iconLeft={<Heart className="w-3.5 h-3.5 text-[#f472b6]" />}
                    >
                      {phoneCallRevealed ? 'Hide Note' : 'Why This Moment Stuck With Me'}
                    </Button>
                  </div>

                  <AnimatePresence>
                    {phoneCallRevealed && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.4 }}
                        className="overflow-hidden"
                      >
                        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-xs sm:text-sm text-[#cbbead] leading-relaxed">
                          <p className="font-serif text-[#fdfaf6] text-base mb-1">
                            A Note From Gokul:
                          </p>
                          Most people wait for you to explain how you feel. Deepa, you have this rare emotional intelligence where you sense the quietest thoughts and ease them before anyone has to ask. That has happened on multiple occasions, and it's one of the qualities I admire most about you.
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Card>
            </motion.div>
          )}

          {activeStory === 'gym' && (
            <motion.div
              key="gym-memory-view"
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, y: -20, transition: { duration: 0.3 } }}
            >
              <Card
                variant="glass"
                padding="none"
                className="overflow-hidden border border-[#dfb877]/30 bg-gradient-to-br from-[#261938] via-[#140d1f] to-[#070509] shadow-2xl shadow-[#dfb877]/10"
              >
                {/* Visual Header */}
                <div className="p-6 sm:p-10 border-b border-white/10 bg-gradient-to-r from-[#dfb877]/10 via-[#f472b6]/10 to-transparent flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-[#dfb877]/20 border border-[#dfb877]/40 flex items-center justify-center text-[#dfb877]">
                      <Search className="w-6 h-6" />
                    </div>
                    <div>
                      <Badge variant="gold" size="sm" className="mb-1">
                        {gymMemory?.badge || 'Unforgivable Teasing Material 😂'}
                      </Badge>
                      <Heading level={3} className="text-xl sm:text-2xl text-[#fdfaf6]">
                        {gymMemory?.title || 'The Gym Aunty Investigation 😂'}
                      </Heading>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-[#ebd1a2]">
                    <span>Case #001</span>
                    <span className="opacity-40">•</span>
                    <span>Top Secret Roast</span>
                  </div>
                </div>

                {/* Case File Content */}
                <div className="p-6 sm:p-10 space-y-6">
                  {/* Case File Graphic Box */}
                  <div className="rounded-2xl bg-[#0d0914] border border-[#dfb877]/20 p-5 sm:p-6 space-y-4">
                    <div className="flex items-center justify-between border-b border-white/10 pb-3 text-xs">
                      <span className="font-mono text-[#dfb877] uppercase tracking-wider">
                        ★ Official Investigation Dossier
                      </span>
                      <span className="text-[#a59582]">Lead Investigator: Deepa (Gundoos)</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                        <span className="text-[#a59582] block mb-1">Target / Victim:</span>
                        <span className="text-[#fdfaf6] font-medium font-serif text-sm">Gokul (Trying to workout in peace)</span>
                      </div>
                      <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                        <span className="text-[#a59582] block mb-1">Reported Crime:</span>
                        <span className="text-[#fdfaf6] font-medium font-serif text-sm">An aunty at the gym stared at Gokul</span>
                      </div>
                      <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                        <span className="text-[#a59582] block mb-1">Deepa's Reaction:</span>
                        <span className="text-[#f472b6] font-medium font-serif text-sm">Immediate, uncontrollable laughing &amp; teasing</span>
                      </div>
                      <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                        <span className="text-[#a59582] block mb-1">Current Verdict:</span>
                        <span className="text-[#dfb877] font-medium font-serif text-sm">Guilty of providing lifetime roast material</span>
                      </div>
                    </div>
                  </div>

                  {/* Story Narrative */}
                  <div className="space-y-4 text-sm sm:text-base text-[#e8dccf] leading-relaxed">
                    <Paragraph size="base">
                      {gymMemory?.story}
                    </Paragraph>

                    <div className="p-4 sm:p-5 rounded-2xl bg-[#dfb877]/10 border border-[#dfb877]/25 flex items-start gap-3.5">
                      <Smile className="w-5 h-5 text-[#dfb877] shrink-0 mt-0.5" />
                      <p className="text-sm font-serif italic text-[#ebd1a2]">
                        "{gymMemory?.takeaway}"
                      </p>
                    </div>
                  </div>

                  {/* Interactive Button */}
                  <div className="pt-2 flex justify-end">
                    <Button
                      variant={gymReportRevealed ? 'glass' : 'gold'}
                      size="sm"
                      onClick={() => setGymReportRevealed(!gymReportRevealed)}
                      iconLeft={<Eye className="w-3.5 h-3.5 text-[#070509]" />}
                    >
                      {gymReportRevealed ? 'Close Dossier' : 'Inspect Deepa\'s Teasing Log'}
                    </Button>
                  </div>

                  <AnimatePresence>
                    {gymReportRevealed && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.4 }}
                        className="overflow-hidden"
                      >
                        <div className="p-4 rounded-2xl bg-[#171022] border border-[#dfb877]/30 text-xs sm:text-sm text-[#cbbead] leading-relaxed space-y-2">
                          <p className="font-serif text-[#ebd1a2] text-sm font-semibold">
                            Deepa's Teasing Strategy:
                          </p>
                          <ul className="list-disc list-inside space-y-1.5 text-[#e8dccf]">
                            <li>Wait for Gokul to mention something unusual that happened in his day.</li>
                            <li>Find the single funniest, most awkward detail.</li>
                            <li>Tease him without mercy, laugh for 10 minutes straight, and bring it up weeks later.</li>
                            <li>(And somehow make him smile every single time anyway).</li>
                          </ul>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Card>
            </motion.div>
          )}

          {activeStory === 'singing' && (
            <motion.div
              key="singing-memory-view"
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, y: -20, transition: { duration: 0.3 } }}
            >
              <Card
                variant="glass"
                padding="none"
                className="overflow-hidden border border-[#c084fc]/35 bg-gradient-to-br from-[#1b1228] via-[#140d1f] to-[#070509] shadow-2xl shadow-[#3b0764]/30"
              >
                {/* Visual Header */}
                <div className="p-6 sm:p-10 border-b border-white/10 bg-gradient-to-r from-[#c084fc]/15 via-[#f472b6]/10 to-transparent flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-[#c084fc]/20 border border-[#c084fc]/40 flex items-center justify-center text-[#e9d5ff]">
                      <Mic className="w-6 h-6" />
                    </div>
                    <div>
                      <Badge variant="lavender" size="sm" className="mb-1">
                        {singingMemory?.badge || 'The Accidental Concert 🎤'}
                      </Badge>
                      <Heading level={3} className="text-xl sm:text-2xl text-[#fdfaf6]">
                        {singingMemory?.title || 'The Singer Who Never Applied for the Job 🎤'}
                      </Heading>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-[#e9d5ff]">
                    <Music className="w-3.5 h-3.5 text-[#f472b6]" />
                    <span>Viral Trend Incident</span>
                  </div>
                </div>

                {/* Content Area */}
                <div className="p-6 sm:p-10 space-y-6">
                  {/* Cute Microphone Illustration & Interactive Stage */}
                  <div className="rounded-2xl bg-[#0d0914] border border-[#c084fc]/25 p-5 sm:p-6 relative overflow-hidden">
                    {/* Floating music notes */}
                    <div className="absolute top-3 right-4 flex gap-2 pointer-events-none text-base sm:text-lg">
                      <motion.span
                        animate={{ y: [0, -12, 0], opacity: [0.4, 0.9, 0.4] }}
                        transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                        className="text-[#c084fc]"
                      >
                        ♪
                      </motion.span>
                      <motion.span
                        animate={{ y: [-4, -18, -4], opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
                        className="text-[#f472b6]"
                      >
                        ♫
                      </motion.span>
                      <motion.span
                        animate={{ y: [0, -10, 0], opacity: [0.3, 0.8, 0.3] }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 0.7 }}
                        className="text-[#dfb877]"
                      >
                        🎵
                      </motion.span>
                    </div>

                    <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10 text-xs">
                      <span className="flex items-center gap-1.5 text-[#e9d5ff] font-mono uppercase tracking-wider">
                        🎤 Live Debut Recording • 1-Night Only Tour
                      </span>
                      <span className="text-[#a59582]">Reluctant Vocalist</span>
                    </div>

                    <div className="space-y-4">
                      {/* Step 1: Deepa's Request */}
                      <div className="flex items-start gap-3 flex-row-reverse">
                        <div className="w-8 h-8 rounded-full bg-[#f472b6]/20 border border-[#f472b6]/40 text-xs flex items-center justify-center text-[#fbcfe8] shrink-0 font-serif font-bold">
                          D
                        </div>
                        <div className="rounded-2xl rounded-tr-sm bg-[#f472b6]/15 border border-[#f472b6]/30 p-3.5 max-w-md text-xs sm:text-sm text-[#fdfaf6]">
                          <p className="text-[11px] text-[#fbcfe8] font-medium mb-1">
                            Deepa (persistent &amp; encouraging):
                          </p>
                          "Sing that trending Instagram song for me! Come on, pleaseee!"
                        </div>
                      </div>

                      {/* Step 2: Gokul's Defense */}
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#261938] text-xs flex items-center justify-center text-[#cbbead] shrink-0 font-serif">
                          G
                        </div>
                        <div className="rounded-2xl rounded-tl-sm bg-[#171022] border border-white/10 p-3.5 max-w-md text-xs sm:text-sm text-[#e8dccf]">
                          <p className="text-[11px] text-[#a59582] mb-1">Gokul (trying to escape):</p>
                          "I clearly said NO. I'm definitely not singing that! 😂"
                        </div>
                      </div>

                      {/* Step 3: Result */}
                      <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs text-[#cbbead] flex items-center justify-between">
                        <span className="italic">
                          Outcome: Deepa won the negotiation. Song was sung. Teasing weapon unlocked forever.
                        </span>
                        <span className="text-base">🎙️😂</span>
                      </div>
                    </div>
                  </div>

                  {/* Story Narrative */}
                  <div className="space-y-4 text-sm sm:text-base text-[#e8dccf] leading-relaxed">
                    <Paragraph size="base">
                      {singingMemory?.story}
                    </Paragraph>

                    <div className="p-4 sm:p-5 rounded-2xl bg-[#c084fc]/10 border border-[#c084fc]/25 flex items-start gap-3.5">
                      <Quote className="w-5 h-5 text-[#c084fc] shrink-0 mt-0.5" />
                      <p className="text-sm font-serif italic text-[#e9d5ff]">
                        "{singingMemory?.takeaway}"
                      </p>
                    </div>
                  </div>

                  {/* Interactive Button */}
                  <div className="pt-2 flex justify-end">
                    <Button
                      variant={singingReviewRevealed ? 'glass' : 'blush'}
                      size="sm"
                      onClick={() => setSingingReviewRevealed(!singingReviewRevealed)}
                      iconLeft={<Mic className="w-3.5 h-3.5 text-[#070509]" />}
                    >
                      {singingReviewRevealed ? 'Close Review' : 'Inspect Deepa\'s Concert Review ⭐'}
                    </Button>
                  </div>

                  <AnimatePresence>
                    {singingReviewRevealed && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.4 }}
                        className="overflow-hidden"
                      >
                        <div className="p-4 rounded-2xl bg-[#171022] border border-[#c084fc]/30 text-xs sm:text-sm text-[#cbbead] leading-relaxed space-y-2">
                          <p className="font-serif text-[#e9d5ff] text-sm font-semibold">
                            Official Concert Performance Review:
                          </p>
                          <ul className="list-disc list-inside space-y-1.5 text-[#e8dccf]">
                            <li><strong>Lead Vocalist:</strong> Gokul (Reluctant debut).</li>
                            <li><strong>Audience:</strong> Deepa (Only attendee, chief motivator, lifetime reviewer).</li>
                            <li><strong>Performance Rating:</strong> ⭐⭐⭐ (3/5 for singing, 10/5 for teasing material).</li>
                            <li><strong>Verdict:</strong> Permanently added to Deepa's teasing playlist. To be hummed without warning whenever she wants to make Gokul laugh.</li>
                          </ul>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Section>
  );
};
