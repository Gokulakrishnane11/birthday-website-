import React, { useEffect, useState } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { RefreshCw, Sparkles } from 'lucide-react';
import { Container } from '../common/Container';
import { Button } from '../common/Button';
import { getBirthdayCountdown } from '@/utils/birthday';

export interface NavItem {
  id: string;
  label: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'hero', label: 'Home' },
  { id: 'story', label: 'Our Story' },
  { id: 'truth-or-dare', label: 'Truth or Dare' },
  { id: 'special-moments', label: 'Memories' },
  { id: 'memories', label: 'Photos' },
  { id: 'things-i-love', label: 'Little Things' },
  { id: 'letter', label: 'Letter' },
  { id: 'finale', label: 'Surprise' },
];

export interface NavbarProps {
  onReplayIntro: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onReplayIntro }) => {
  const [activeSection, setActiveSection] = useState<string>('hero');
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const { currentAge, turningAge, isBirthdayToday } = getBirthdayCountdown();
  const celebratedAge = isBirthdayToday ? currentAge : turningAge;

  // Framer Motion Scroll Progress Bar
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    const observerCallback: IntersectionObserverCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observerOptions: IntersectionObserverInit = {
      root: null,
      rootMargin: '-30% 0px -40% 0px',
      threshold: 0,
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    NAV_ITEMS.forEach((item) => {
      const element = document.getElementById(item.id);
      if (element) observer.observe(element);
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const activeItemLabel = NAV_ITEMS.find((item) => item.id === activeSection)?.label || 'Home';

  return (
    <nav
      aria-label="Main Navigation"
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 py-3.5 px-4 ${
        isScrolled
          ? 'bg-[#070509]/90 backdrop-blur-xl border-b border-white/10 shadow-lg shadow-black/60'
          : 'bg-gradient-to-b from-[#070509]/95 to-transparent'
      }`}
    >
      {/* Scroll Progress Bar */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-[#f472b6] via-[#c084fc] to-[#dfb877] origin-left z-50 shadow-[0_0_10px_rgba(244,114,182,0.6)]"
        style={{ scaleX }}
      />

      <Container width="wide" className="flex items-center justify-between">
        {/* Brand / Name */}
        <button
          onClick={() => scrollToSection('hero')}
          className="flex items-center gap-2.5 cursor-pointer group text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f472b6] rounded-full px-1"
          aria-label={`Scroll to home - Deepa's ${celebratedAge}th Birthday`}
        >
          <div className="w-8 h-8 rounded-full bg-[#f472b6]/20 border border-[#f472b6]/40 flex items-center justify-center transition-transform group-hover:scale-105">
            <span className="text-sm">🐼</span>
          </div>
          <div className="flex flex-col">
            <span className="font-serif text-sm sm:text-base tracking-wide text-[#fdfaf6] truncate leading-tight">
              Deepa's {celebratedAge}th Keepsake
            </span>
            <span className="text-[10px] text-[#fbcfe8] font-sans font-normal hidden sm:inline">
              Nov 2, 2026 • Gundoos
            </span>
          </div>
        </button>

        {/* Desktop Section Nav Items */}
        <div className="hidden lg:flex items-center gap-1 p-1 rounded-full bg-[#140d1f]/80 border border-white/10 backdrop-blur-md">
          {NAV_ITEMS.map((item) => {
            const isActive = activeSection === item.id;

            return (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                aria-current={isActive ? 'page' : undefined}
                className={`relative px-3.5 py-1 rounded-full text-xs font-medium transition-all duration-300 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f472b6] ${
                  isActive
                    ? 'text-[#070509] font-semibold'
                    : 'text-[#cbbead] hover:text-[#fdfaf6]'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeNavIndicator"
                    className="absolute inset-0 bg-[#f472b6] rounded-full border border-[#fbcfe8]/50 shadow-md shadow-[#f472b6]/40"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right Actions & Mobile Section Indicator */}
        <div className="flex items-center gap-2">
          {/* Mobile Active Section Pill */}
          <div className="lg:hidden flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-[#f472b6]">
            <Sparkles className="w-3 h-3 text-[#dfb877]" />
            <span className="font-serif text-xs text-[#fdfaf6]">{activeItemLabel}</span>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={onReplayIntro}
            iconLeft={<RefreshCw className="w-3.5 h-3.5 text-[#cbbead]" />}
            className="text-xs text-[#cbbead] hover:text-[#fdfaf6] hidden sm:inline-flex"
            aria-label="Replay intro animation"
          >
            Replay Intro
          </Button>
        </div>
      </Container>
    </nav>
  );
};
