import React, { useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { siteConfig } from '@/config/siteConfig';
import { Container } from '../common/Container';
import { Navbar } from '../layout/Navbar';
import { FloatingMusicPlayer } from '../common/FloatingMusicPlayer';
import { HeroSection } from './HeroSection';
import { TimelineSection } from './TimelineSection';
import { TruthOrDareSection } from './TruthOrDareSection';
import { SpecialMemoriesSection } from './SpecialMemoriesSection';
import { GallerySection } from './GallerySection';
import { ThingsILoveSection } from './ThingsILoveSection';
import { LetterSection } from './LetterSection';
import { FinaleSection } from './FinaleSection';
import { getBirthdayCountdown } from '@/utils/birthday';
import { useSectionObserver } from '@/hooks/useSectionObserver';
import { useMusic } from '@/context/useMusic';

export interface MainBirthdayExperienceProps {
  onReplayIntro: () => void;
}

export const MainBirthdayExperience: React.FC<MainBirthdayExperienceProps> = ({
  onReplayIntro,
}) => {
  const { currentAge, turningAge, isBirthdayToday, targetYear } = getBirthdayCountdown();
  const celebratedAge = isBirthdayToday ? currentAge : turningAge;
  const { setActiveSection } = useMusic();

  useEffect(() => {
    setActiveSection('hero');
  }, [setActiveSection]);

  // Observe all sections for intelligent automatic soundtrack transitions
  const observedSections = useMemo(
    () => ['hero', 'story', 'truth-or-dare', 'special-moments', 'memories', 'things-i-love', 'letter', 'finale'],
    []
  );
  useSectionObserver({ sectionIds: observedSections, debounceMs: 200 });

  const handleScrollClick = () => {
    const storyElem = document.getElementById('story');
    if (storyElem) {
      storyElem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      className="min-h-screen bg-[#070509] text-[#f5ede2] relative selection:bg-[#f472b6]/40 selection:text-[#fdfaf6] scroll-smooth"
    >
      {/* Navigation */}
      <Navbar onReplayIntro={onReplayIntro} />

      {/* Main Experience Flow */}
      <main className="space-y-0">
        {/* Section 1: Birthday Hero */}
        <HeroSection onScrollClick={handleScrollClick} />

        {/* Section 2: Our Story (College Tech Community Story) */}
        <TimelineSection />

        {/* Section 3: Truth or Dare Moments ("One Question at a Time... 🎲") */}
        <TruthOrDareSection />

        {/* Section 4: Special Memories & Inside Jokes (Phone Call, Gym Aunty, Singing Incident) */}
        <SpecialMemoriesSection />

        {/* Section 5: Polaroid Photo Keepsake Gallery */}
        <GallerySection />

        {/* Section 6: Things I Love About You ("Little Things That Make You, YOU") */}
        <ThingsILoveSection />

        {/* Section 7: Handwritten Birthday Letter from Gokul */}
        <LetterSection />

        {/* Section 8: Final Surprise Section ("One Last Thing, Gundoos... 🐼") */}
        <FinaleSection />
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12 text-center text-xs text-[#a59582] bg-[#070509]">
        <Container width="medium" className="flex flex-col items-center gap-2.5">
          <div className="flex items-center gap-2 text-[#f472b6]">
            <Heart className="w-4 h-4 fill-current" />
            <span className="font-serif text-base text-[#fdfaf6]">
              Happiest {celebratedAge}th Birthday, {siteConfig.recipientName} ({siteConfig.nickname})
            </span>
          </div>
          <p className="text-[11px] text-[#cbbead]">
            Crafted with lots of care and a little bit of teasing by {siteConfig.senderName} • November 2, {targetYear}
          </p>
        </Container>
      </footer>

      {/* Floating Music Player */}
      <FloatingMusicPlayer />
    </motion.div>
  );
};
