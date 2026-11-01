import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { isBirthdayToday, getISTParts } from '@/utils/birthday';
import { CinematicIntro } from '@/components/features/CinematicIntro';
import { MainBirthdayExperience } from '@/components/features/MainBirthdayExperience';
import { NormalModeLanding } from '@/components/features/NormalModeLanding';
import { MusicProvider } from '@/context/MusicContext';

export function App() {
  const [isBirthday, setIsBirthday] = useState<boolean>(() => isBirthdayToday());
  const [dayKey, setDayKey] = useState<string>(() => {
    const parts = getISTParts();
    return `${parts.year}-${parts.month}-${parts.day}`;
  });

  const [isOpen, setIsOpen] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('bday_opened') === 'true';
    } catch {
      return false;
    }
  });

  // Live timer checking for midnight IST transitions without requiring a page refresh
  useEffect(() => {
    const interval = setInterval(() => {
      const currentBday = isBirthdayToday();
      setIsBirthday((prev) => (prev !== currentBday ? currentBday : prev));

      const parts = getISTParts();
      const currentKey = `${parts.year}-${parts.month}-${parts.day}`;
      setDayKey((prev) => (prev !== currentKey ? currentKey : prev));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleOpen = () => {
    setIsOpen(true);
    try {
      sessionStorage.setItem('bday_opened', 'true');
    } catch {
      // Ignore quota errors
    }
  };

  const handleReplayIntro = () => {
    setIsOpen(false);
    try {
      sessionStorage.removeItem('bday_opened');
    } catch {
      // Ignore quota errors
    }
  };

  return (
    <div className="min-h-screen bg-[#070509] text-[#f5ede2] antialiased selection:bg-[#f472b6]/40 selection:text-[#fdfaf6]">
      <MusicProvider mode={isBirthday ? 'birthday' : 'normal'}>
        {!isBirthday ? (
          /* NORMAL MODE: Every day except November 2 in Asia/Kolkata */
          <NormalModeLanding key={`normal-mode-${dayKey}`} />
        ) : (
          /* BIRTHDAY SURPRISE MODE: November 2 in Asia/Kolkata */
          <AnimatePresence mode="wait">
            {!isOpen ? (
              <CinematicIntro key="cinematic-intro" onOpen={handleOpen} />
            ) : (
              <MainBirthdayExperience key="main-experience" onReplayIntro={handleReplayIntro} />
            )}
          </AnimatePresence>
        )}
      </MusicProvider>
    </div>
  );
}

export default App;
