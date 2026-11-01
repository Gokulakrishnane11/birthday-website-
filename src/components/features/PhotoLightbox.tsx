import React, { useEffect, useRef, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Calendar, Sparkles, ImageOff } from 'lucide-react';
import type { MemoryPhotoItem } from '@/data/memoriesData';
import { Heading, Paragraph } from '../common/Typography';
import { Badge } from '../common/Badge';

export interface PhotoLightboxProps {
  photo: MemoryPhotoItem | null;
  currentIndex: number;
  totalPhotos: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

export const PhotoLightbox: React.FC<PhotoLightboxProps> = ({
  photo,
  currentIndex,
  totalPhotos,
  onClose,
  onPrev,
  onNext,
}) => {
  const [erroredPhotoId, setErroredPhotoId] = useState<string | null>(null);
  const imageError = Boolean(photo && erroredPhotoId === photo.id);
  const [slideDirection, setSlideDirection] = useState<'left' | 'right' | null>(null);
  const touchStartXRef = useRef<number | null>(null);
  const touchStartYRef = useRef<number | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);

  // Keyboard navigation & body scroll lock
  useEffect(() => {
    if (!photo) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setSlideDirection('right');
        onPrev();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        setSlideDirection('left');
        onNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Focus close button on mount for accessibility
    setTimeout(() => {
      closeButtonRef.current?.focus();
    }, 50);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [photo, onClose, onPrev, onNext]);

  // Touch swipe handling for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
    touchStartYRef.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null || touchStartYRef.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartXRef.current;
    const deltaY = e.changedTouches[0].clientY - touchStartYRef.current;

    // Trigger swipe only when horizontal gesture dominates and exceeds threshold
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 40) {
      if (deltaX < 0) {
        setSlideDirection('left');
        onNext();
      } else {
        setSlideDirection('right');
        onPrev();
      }
    }
    touchStartXRef.current = null;
    touchStartYRef.current = null;
  };

  const handlePrevClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      setSlideDirection('right');
      onPrev();
    },
    [onPrev]
  );

  const handleNextClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      setSlideDirection('left');
      onNext();
    },
    [onNext]
  );

  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {photo && (
        <motion.div
          key="photo-lightbox-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.28, ease: 'easeOut' }}
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 md:p-8 bg-black/92 backdrop-blur-2xl select-none"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label={`Photo view: ${photo.title}`}
        >
          {/* Top Control Bar with Photo Counter and Close Button */}
          <div className="absolute top-4 sm:top-6 left-4 sm:left-8 right-4 sm:right-8 z-50 flex items-center justify-between pointer-events-none">
            {/* Position Indicator Badge */}
            <div className="pointer-events-auto inline-flex items-center gap-2">
              <Badge variant="gold" size="sm" className="normal-case font-mono">
                Photo {currentIndex + 1} of {totalPhotos}
              </Badge>
              {photo.category && (
                <Badge variant="blush" size="sm">
                  {photo.category}
                </Badge>
              )}
            </div>

            {/* Close Button using site's rounded-full glass design */}
            <button
              ref={closeButtonRef}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              className="pointer-events-auto p-2.5 sm:p-3 rounded-full bg-white/5 hover:bg-white/15 text-[#fdfaf6] hover:text-[#f472b6] border border-white/20 transition-all duration-300 group cursor-pointer backdrop-blur-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f472b6]"
              aria-label="Close photo view"
            >
              <X className="w-5 h-5 transition-transform duration-300 group-hover:rotate-90" />
            </button>
          </div>

          {/* Navigation Previous Button */}
          <button
            type="button"
            onClick={handlePrevClick}
            className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 z-50 p-2.5 sm:p-3.5 rounded-full bg-white/5 hover:bg-white/15 text-[#fdfaf6] hover:text-[#f472b6] border border-white/20 transition-all duration-200 cursor-pointer flex items-center justify-center backdrop-blur-md shadow-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f472b6]"
            aria-label="Previous photo"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          {/* Navigation Next Button */}
          <button
            type="button"
            onClick={handleNextClick}
            className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 z-50 p-2.5 sm:p-3.5 rounded-full bg-white/5 hover:bg-white/15 text-[#fdfaf6] hover:text-[#f472b6] border border-white/20 transition-all duration-200 cursor-pointer flex items-center justify-center backdrop-blur-md shadow-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f472b6]"
            aria-label="Next photo"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          {/* Modal Card Container */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 15 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            className="relative max-w-4xl w-full max-h-[88vh] flex flex-col bg-gradient-to-b from-[#1b1228] via-[#140d1f] to-[#0d0914] border border-[#f472b6]/30 rounded-3xl overflow-hidden shadow-2xl shadow-black/95 my-auto"
          >
            {/* Image Stage Container with Subtle Ambient Glow */}
            <div className="relative w-full flex-1 min-h-[260px] sm:min-h-[380px] max-h-[58vh] sm:max-h-[64vh] bg-[#070509] flex items-center justify-center overflow-hidden p-2 sm:p-4">
              <div className="absolute inset-0 bg-radial from-[#f472b6]/10 via-transparent to-transparent pointer-events-none opacity-50" />

              <AnimatePresence mode="wait">
                <motion.div
                  key={photo.id}
                  initial={{
                    opacity: 0,
                    x: slideDirection === 'left' ? 40 : slideDirection === 'right' ? -40 : 0,
                    scale: 0.98,
                  }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{
                    opacity: 0,
                    x: slideDirection === 'left' ? -40 : slideDirection === 'right' ? 40 : 0,
                    scale: 0.98,
                  }}
                  transition={{ duration: 0.28, ease: 'easeInOut' }}
                  className="w-full h-full flex items-center justify-center"
                >
                  {!imageError ? (
                    <img
                      src={photo.image}
                      alt={photo.title}
                      onError={() => setErroredPhotoId(photo.id)}
                      className="max-w-full max-h-[54vh] sm:max-h-[60vh] object-contain rounded-2xl shadow-2xl transition-transform"
                    />
                  ) : (
                    /* Fallback UI for missing/broken images */
                    <div className="flex flex-col items-center justify-center p-8 text-center text-[#cbbead] max-w-md">
                      <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-4 text-[#f472b6]">
                        <ImageOff className="w-8 h-8 opacity-80" />
                      </div>
                      <p className="font-serif text-lg text-[#fdfaf6] mb-1">{photo.title}</p>
                      <p className="text-xs text-[#a59582]">{photo.caption}</p>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Captions & Memory Story Footer */}
            <div className="w-full p-4 sm:p-6 md:p-7 bg-[#140d1f]/95 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex flex-col gap-1.5 max-w-2xl">
                {/* Title & Milestone Tag */}
                <div className="flex flex-wrap items-center gap-2.5">
                  <Heading level={3} className="text-xl sm:text-2xl font-serif text-[#fdfaf6] leading-tight">
                    {photo.title}
                  </Heading>
                  {photo.sticker && (
                    <Badge variant="gold" size="sm">
                      {photo.sticker}
                    </Badge>
                  )}
                </div>

                {/* Personal Memory Note / Whisper */}
                {photo.handwrittenNote && (
                  <p className="font-serif italic text-base sm:text-lg text-[#fbcfe8] leading-snug">
                    "{photo.handwrittenNote}"
                  </p>
                )}

                {/* Story Caption */}
                <Paragraph size="sm" className="text-[#cbbead] leading-relaxed font-sans text-xs sm:text-sm">
                  {photo.caption}
                </Paragraph>

                {photo.note && (
                  <p className="text-xs text-[#dfb877]/80 italic mt-0.5 flex items-center gap-1 font-sans">
                    <Sparkles className="w-3.5 h-3.5 text-[#dfb877] shrink-0" />
                    <span>{photo.note}</span>
                  </p>
                )}
              </div>

              {/* Date Stamp & Swipe Hint */}
              <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto shrink-0 border-t sm:border-t-0 pt-3 sm:pt-0 border-white/10 gap-1 text-xs text-[#a59582]">
                <div className="inline-flex items-center gap-1.5 font-mono text-xs text-[#dfb877]">
                  <Calendar className="w-3.5 h-3.5 text-[#f472b6]" />
                  <span>{photo.date}</span>
                </div>
                <span className="text-[10px] text-[#a59582] hidden sm:inline font-sans">
                  Swipe or use ← → keys
                </span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};
