import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Maximize2, Calendar, Image as ImageIcon } from 'lucide-react';
import { memoriesData } from '@/data/memoriesData';
import { Section } from '../layout/Section';
import { PhotoLightbox } from './PhotoLightbox';
import { fadeUp } from '@/utils/motion';

export const GallerySection: React.FC = () => {
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);
  const [showHelper, setShowHelper] = useState<boolean>(false);

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

  // Subtle natural polaroid tilt rotations
  const rotations = ['-rotate-1', 'rotate-1.5', '-rotate-2', 'rotate-1', '-rotate-1.5', 'rotate-2'];

  return (
    <Section
      id="memories"
      title="Photo Keepsake Gallery"
      subtitle="VISUAL MEMORIES"
      description="Polaroid frames capturing laughter, little details, and her 19th birthday celebration."
      containerWidth="wide"
      glow="gold"
    >
      {/* Helpful Instructions Banner for Gokul to add photos */}
      <div className="mb-8 p-4 rounded-2xl bg-[#140d1f] border border-[#c084fc]/25 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-[#cbbead]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[#f472b6]/15 flex items-center justify-center text-[#fbcfe8] shrink-0">
            <ImageIcon className="w-4 h-4" />
          </div>
          <div>
            <span className="font-semibold text-[#fdfaf6] block sm:inline">Personal Photo Frames:</span>{' '}
            Designed for real memories. Tap any polaroid to zoom in!
          </div>
        </div>
        <button
          onClick={() => setShowHelper(!showHelper)}
          className="text-[#fbcfe8] hover:text-[#fdfaf6] underline font-medium cursor-pointer shrink-0"
        >
          {showHelper ? 'Hide Details' : 'How to add your own photos'}
        </button>
      </div>

      {showHelper && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mb-8 p-4 rounded-2xl bg-black/40 border border-white/10 text-xs text-[#cbbead] space-y-1.5"
        >
          <p className="font-semibold text-[#fdfaf6]">Quick Guide to Add Real Photos of Deepa:</p>
          <p>1. Place your photos into the project (e.g. in <code className="text-[#fbcfe8]">public/photos/</code> or <code className="text-[#fbcfe8]">src/assets/memories/</code>).</p>
          <p>2. In <code className="text-[#fbcfe8]">src/data/memoriesData.ts</code>, import or set the image URL for each item.</p>
          <p>3. All hover effects, polaroid borders, captions, and the fullscreen lightbox work seamlessly with any JPG, PNG, or WebP photo!</p>
        </motion.div>
      )}

      {/* Polaroid Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 pt-2">
        {memoriesData.map((photo, index) => {
          const tiltClass = rotations[index % rotations.length];

          return (
            <motion.div
              key={photo.id}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              onClick={() => setSelectedPhotoIndex(index)}
              className={`group cursor-pointer select-none transition-all duration-500 transform ${tiltClass} hover:rotate-0 hover:scale-[1.03] hover:z-20`}
            >
              {/* Polaroid Frame */}
              <div className="bg-[#fcfaf7] text-[#171022] p-4 sm:p-4.5 pb-6 rounded-2xl shadow-xl shadow-black/60 border border-white/20 group-hover:shadow-2xl group-hover:shadow-[#f472b6]/20 transition-all duration-500">
                {/* Top Tape Effect */}
                <div className="w-16 h-4 bg-white/70 backdrop-blur-sm mx-auto -mt-6 mb-3 rounded-sm shadow-sm border border-black/5 opacity-80" />

                {/* Photo Image Aspect Container */}
                <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-[#140d1f] border border-black/10">
                  <img
                    src={photo.image}
                    alt={photo.title}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Expand Icon */}
                  <div className="absolute top-3 right-3 p-2 rounded-full bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-md">
                    <Maximize2 className="w-3.5 h-3.5 text-[#dfb877]" />
                  </div>

                  {/* Category Pill */}
                  {photo.category && (
                    <div className="absolute bottom-2.5 left-2.5">
                      <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-black/70 text-[#fbcfe8] backdrop-blur-sm">
                        {photo.category}
                      </span>
                    </div>
                  )}
                </div>

                {/* Polaroid Caption Area */}
                <div className="pt-4 px-1">
                  <div className="flex items-center justify-between text-[11px] text-[#7a6a57] font-sans mb-1">
                    <span className="flex items-center gap-1 font-mono">
                      <Calendar className="w-3 h-3 text-[#f472b6]" />
                      {photo.date}
                    </span>
                    <span className="text-[10px] opacity-70">#0{index + 1}</span>
                  </div>

                  <h3 className="text-lg font-serif font-semibold text-[#171022] group-hover:text-[#db2777] transition-colors leading-snug">
                    {photo.title}
                  </h3>

                  <p className="text-xs text-[#524438] font-sans line-clamp-2 mt-1 leading-relaxed">
                    {photo.caption}
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Fullscreen Lightbox Modal */}
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
