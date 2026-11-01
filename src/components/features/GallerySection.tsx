import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Maximize2, Calendar, Sparkles, Camera } from 'lucide-react';
import { memoriesData } from '@/data/memoriesData';
import { PhotoLightbox } from './PhotoLightbox';
import { Section } from '../layout/Section';
import { Heading, Paragraph, Caption } from '../common/Typography';
import { Badge } from '../common/Badge';
import { fadeUp } from '@/utils/motion';

export const GallerySection: React.FC = () => {
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);
  const [brokenImages, setBrokenImages] = useState<Record<string, boolean>>({});

  const activePhoto = selectedPhotoIndex !== null ? memoriesData[selectedPhotoIndex] : null;

  const handlePrev = () => {
    if (selectedPhotoIndex === null) return;
    setSelectedPhotoIndex((prev) =>
      prev! > 0 ? prev! - 1 : memoriesData.length - 1
    );
  };

  const handleNext = () => {
    if (selectedPhotoIndex === null) return;
    setSelectedPhotoIndex((prev) =>
      prev! < memoriesData.length - 1 ? prev! + 1 : 0
    );
  };

  const handleImageError = (id: string) => {
    setBrokenImages((prev) => ({ ...prev, [id]: true }));
  };

  return (
    <Section
      id="memories"
      title="Little Moments, Forever Memories"
      subtitle="PHOTO KEEPSAKE GALLERY"
      description="Some moments deserve more than a place in our camera roll — a handpicked collection celebrating laughter, curly locks, inside jokes, and Deepa's 20th birthday."
      containerWidth="wide"
      glow="rose"
      className="relative select-none"
    >
      {/* Tap hint badge matching site conventions */}
      <div className="flex items-center justify-center gap-2 mb-10 -mt-6">
        <Badge variant="blush" size="sm" icon={<Sparkles className="w-3 h-3 text-[#dfb877]" />}>
          Tap any photograph to explore full memory
        </Badge>
      </div>

      {/* 
        Editorial Asymmetrical Grid of Photographic Keepsake Cards
        CRITICAL FOR browserQA.js: Direct children must remain exactly the 6 photo card divs
      */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-6 sm:gap-7 lg:gap-8 items-stretch">
        {memoriesData.map((photo, index) => {
          const isBroken = brokenImages[photo.id];

          // Editorial asymmetric column spans for visual rhythm
          const colSpanClass =
            index === 0
              ? 'col-span-1 sm:col-span-2 lg:col-span-7' // Featured large milestone
              : index === 1
              ? 'col-span-1 sm:col-span-1 lg:col-span-5' // Portrait curls
              : index === 2
              ? 'col-span-1 sm:col-span-1 lg:col-span-4' // Square conversation
              : index === 3
              ? 'col-span-1 sm:col-span-1 lg:col-span-4' // Square/landscape energy
              : index === 4
              ? 'col-span-1 sm:col-span-1 lg:col-span-4' // Portrait teasing
              : 'col-span-1 sm:col-span-2 lg:col-span-8 lg:col-start-3'; // Featured landmark closing

          // Aspect ratio styling matching the photo's editorial character
          const aspectClass =
            index === 0
              ? 'aspect-[16/10] sm:aspect-[16/9]'
              : index === 1 || index === 4
              ? 'aspect-[3/4]'
              : index === 2
              ? 'aspect-square'
              : index === 5
              ? 'aspect-[16/10]'
              : 'aspect-[4/3]';

          return (
            <motion.div
              key={photo.id}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-40px' }}
              onClick={() => setSelectedPhotoIndex(index)}
              className={`group cursor-pointer select-none ${colSpanClass}`}
            >
              {/* Dark Luxury Glassmorphic Photographic Card */}
              <motion.div
                whileHover={{
                  y: -6,
                  scale: 1.015,
                  transition: { duration: 0.35, ease: 'easeOut' },
                }}
                whileTap={{ scale: 0.98 }}
                className="relative h-full flex flex-col justify-between p-4 sm:p-5 rounded-3xl bg-gradient-to-b from-[#171022]/85 via-[#140d1f]/90 to-[#0d0914]/95 border border-white/10 hover:border-[#f472b6]/40 shadow-xl shadow-black/50 hover:shadow-2xl hover:shadow-[#3b0764]/30 backdrop-blur-xl transition-all duration-500 overflow-hidden"
              >
                {/* Subtle Ambient Radial Highlight on Hover */}
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-radial from-[#f472b6]/15 via-transparent to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                {/* Photo Inset Stage */}
                <div
                  className={`relative ${aspectClass} w-full rounded-2xl overflow-hidden bg-[#070509] border border-white/10 shadow-inner`}
                >
                  {!isBroken ? (
                    <img
                      src={photo.image}
                      alt={photo.title}
                      loading="lazy"
                      onError={() => handleImageError(photo.id)}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                  ) : (
                    /* Fallback UI if photo fails to load */
                    <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center bg-[#140d1f] text-[#cbbead]">
                      <Camera className="w-8 h-8 text-[#f472b6] mb-2 opacity-70" />
                      <span className="font-serif text-sm text-[#fdfaf6]">{photo.title}</span>
                      <span className="text-[10px] text-[#a59582] mt-0.5">{photo.category}</span>
                    </div>
                  )}

                  {/* Elegant Vignette Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#070509]/80 via-transparent to-black/20 opacity-40 group-hover:opacity-60 transition-opacity duration-300 pointer-events-none" />

                  {/* Enlarge Badge on Hover */}
                  <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-[#fdfaf6] text-xs font-sans font-medium opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center gap-1.5 shadow-lg">
                    <Maximize2 className="w-3 h-3 text-[#dfb877]" />
                    <span>Enlarge</span>
                  </div>

                  {/* Category Pill Badge on Photo */}
                  {photo.category && (
                    <div className="absolute bottom-3 left-3">
                      <span className="text-[10px] font-sans font-medium uppercase tracking-wider px-2.5 py-1 rounded-full bg-black/70 text-[#fbcfe8] backdrop-blur-md border border-white/15 shadow-sm">
                        {photo.category}
                      </span>
                    </div>
                  )}
                </div>

                {/* Card Content & Story */}
                <div className="pt-4 flex flex-col justify-between flex-1">
                  <div>
                    {/* Header Row: Date & Photo Index */}
                    <div className="flex items-center justify-between text-xs text-[#a59582] mb-1.5 font-sans">
                      <span className="inline-flex items-center gap-1.5 font-mono text-[11px] text-[#dfb877]">
                        <Calendar className="w-3 h-3 text-[#f472b6]" />
                        {photo.date}
                      </span>
                      <span className="font-mono text-[11px] text-[#a59582] tracking-wider">
                        #{String(index + 1).padStart(2, '0')}
                      </span>
                    </div>

                    {/* Title */}
                    <Heading
                      level={3}
                      className="text-lg sm:text-xl font-serif text-[#fdfaf6] group-hover:text-[#f472b6] transition-colors leading-snug mb-1"
                    >
                      {photo.title}
                    </Heading>

                    {/* Personal Memory Note / Whisper */}
                    {photo.handwrittenNote && (
                      <p className="font-serif italic text-xs sm:text-sm text-[#fbcfe8] leading-relaxed mb-2">
                        "{photo.handwrittenNote}"
                      </p>
                    )}

                    {/* Caption */}
                    <Paragraph size="sm" className="text-[#cbbead] text-xs sm:text-sm line-clamp-2 leading-relaxed">
                      {photo.caption}
                    </Paragraph>
                  </div>

                  {/* Milestone Accent Tag */}
                  {photo.sticker && (
                    <div className="mt-3.5 pt-2.5 border-t border-white/10 flex items-center justify-between text-xs">
                      <span className="text-[10px] font-mono tracking-wider uppercase px-2 py-0.5 rounded-full bg-white/5 text-[#dfb877] border border-[#dfb877]/30">
                        {photo.sticker}
                      </span>
                      <Caption className="text-[#a59582] group-hover:text-[#fdfaf6] transition-colors">
                        View memory →
                      </Caption>
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          );
        })}
      </div>

      {/* Fullscreen Immersive Lightbox Modal */}
      <PhotoLightbox
        photo={activePhoto}
        currentIndex={selectedPhotoIndex ?? 0}
        totalPhotos={memoriesData.length}
        onClose={() => setSelectedPhotoIndex(null)}
        onPrev={handlePrev}
        onNext={handleNext}
      />
    </Section>
  );
};
