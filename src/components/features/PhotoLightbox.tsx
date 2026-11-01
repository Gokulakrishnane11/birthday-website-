import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
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
  // Handle keyboard events (Escape to close, Left/Right arrows to navigate)
  useEffect(() => {
    if (!photo) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onPrev();
      if (e.key === 'ArrowRight') onNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [photo, onClose, onPrev, onNext]);

  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {photo && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 bg-[#070509]/95 backdrop-blur-2xl select-none"
          onClick={onClose}
        >
          {/* Close Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="absolute top-5 right-5 z-50 p-3 rounded-full bg-white/10 text-[#fdfaf6] hover:bg-white/20 border border-white/15 transition-all duration-300 group cursor-pointer"
            aria-label="Close photo view"
          >
            <X className="w-5 h-5 transition-transform group-hover:rotate-90" />
          </button>

          {/* Navigation Previous Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPrev();
            }}
            className="absolute left-2 sm:left-8 top-1/2 -translate-y-1/2 z-50 p-2 sm:p-3.5 rounded-full bg-black/60 text-[#fdfaf6] hover:bg-[#f472b6]/30 border border-white/20 transition-all duration-300 cursor-pointer flex items-center justify-center backdrop-blur-md"
            aria-label="Previous photo"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          {/* Navigation Next Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onNext();
            }}
            className="absolute right-2 sm:right-8 top-1/2 -translate-y-1/2 z-50 p-2 sm:p-3.5 rounded-full bg-black/60 text-[#fdfaf6] hover:bg-[#f472b6]/30 border border-white/20 transition-all duration-300 cursor-pointer flex items-center justify-center backdrop-blur-md"
            aria-label="Next photo"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          {/* Modal Content Container */}
          <motion.div
            initial={{ scale: 0.94, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.94, opacity: 0, y: 10 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-4xl w-full max-h-[90vh] flex flex-col items-center bg-[#140d1f] border border-[#f472b6]/25 rounded-3xl overflow-hidden shadow-2xl shadow-black/80"
          >
            {/* Image Wrapper */}
            <div className="relative w-full max-h-[58vh] sm:max-h-[66vh] bg-[#070509] flex items-center justify-center overflow-hidden">
              <img
                src={photo.image}
                alt={photo.title}
                className="w-full h-full object-contain max-h-[58vh] sm:max-h-[66vh]"
              />

              {/* Photo Counter Overlay */}
              <div className="absolute top-4 left-4 z-10">
                <Badge variant="blush" size="sm">
                  {currentIndex + 1} / {totalPhotos}
                </Badge>
              </div>
            </div>

            {/* Captions & Info Footer */}
            <div className="w-full p-4 sm:p-8 bg-[#140d1f] border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
              <div className="flex flex-col gap-1 max-w-xl">
                <div className="flex items-center gap-3">
                  <Heading level={3} className="text-xl sm:text-2xl text-[#fdfaf6]">
                    {photo.title}
                  </Heading>
                  {photo.category && (
                    <Badge variant="lavender" size="sm">
                      {photo.category}
                    </Badge>
                  )}
                </div>

                <Paragraph size="base" className="text-[#cbbead] leading-relaxed">
                  {photo.caption}
                </Paragraph>
                {photo.note && (
                  <p className="text-[11px] text-[#fbcfe8]/70 italic mt-0.5">
                    💡 {photo.note}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2 text-xs text-[#a59582] shrink-0 border-t sm:border-t-0 pt-3 sm:pt-0 w-full sm:w-auto">
                <Calendar className="w-3.5 h-3.5 text-[#f472b6]" />
                <span>{photo.date}</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};
