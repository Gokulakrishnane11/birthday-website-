import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Calendar } from 'lucide-react';
import { siteConfig } from '@/config/siteConfig';
import { Container } from '../common/Container';
import { getFormattedCurrentISTDate } from '@/utils/birthday';

export interface NormalNavbarProps {
  injectedDate?: Date | string;
}

export const NormalNavbar: React.FC<NormalNavbarProps> = ({ injectedDate }) => {
  const currentISTDate = getFormattedCurrentISTDate(injectedDate);

  return (
    <nav
      aria-label="Normal Mode Navigation"
      className="fixed top-0 left-0 right-0 z-40 bg-[#070509]/85 backdrop-blur-xl border-b border-white/10 shadow-lg shadow-black/50 py-3.5 px-4"
    >
      {/* Decorative top accent gradient line */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#f472b6] via-[#c084fc] to-[#dfb877]"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      />

      <Container width="wide" className="flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <span className="text-2xl filter drop-shadow">🐼</span>
          <div className="flex flex-col text-left">
            <span className="font-serif text-base sm:text-lg font-bold text-[#fdfaf6] tracking-tight leading-tight">
              {siteConfig.recipientName}
            </span>
            <span className="text-[10px] sm:text-xs text-[#dfb877] font-mono tracking-wider uppercase">
              Birthday Countdown
            </span>
          </div>
        </div>

        {/* Right Details: IST Date & Timezone */}
        <div className="flex items-center gap-2">
          <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-[#cbbead]">
            <Calendar className="w-3.5 h-3.5 text-[#f472b6]" />
            <span>{currentISTDate}</span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f472b6]/10 border border-[#f472b6]/25 text-xs text-[#fbcfe8]">
            <Clock className="w-3.5 h-3.5 text-[#dfb877]" />
            <span className="font-mono text-[11px]">IST (UTC+05:30)</span>
          </div>
        </div>
      </Container>
    </nav>
  );
};
