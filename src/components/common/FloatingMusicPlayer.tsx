import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  Pause,
  Music,
  AlertCircle,
  Loader2,
  Volume2,
  VolumeX,
  Compass,
} from 'lucide-react';
import { useMusic } from '@/context/useMusic';

export const FloatingMusicPlayer: React.FC = () => {
  const {
    currentTrack,
    isPlaying,
    isLoading,
    isMuted,
    volume,
    hasUserStarted,
    isUnavailable,
    unsupportedMessage,
    togglePlay,
    toggleMute,
    setVolume,
  } = useMusic();

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(parseFloat(e.target.value));
  };

  return (
    <aside
      aria-label="Background music controls"
      className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 select-none"
    >
      <div className="flex flex-col items-end gap-2">
        {/* First-time visitor prominent "Play Music" invitation pill if not started yet */}
        <AnimatePresence>
          {!hasUserStarted && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.4 }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-[#f472b6]/25 to-[#c084fc]/25 border border-[#f472b6]/40 backdrop-blur-md shadow-xl text-xs text-[#fdfaf6] cursor-pointer hover:border-[#f472b6] transition-all"
              onClick={togglePlay}
            >
              <Music className="w-3.5 h-3.5 text-[#dfb877] animate-bounce" />
              <span className="font-serif font-medium">Click to Play Soundtrack ✨</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Floating Glass Pill Container */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="relative flex items-center rounded-full border border-white/15 bg-[#140d1f]/95 backdrop-blur-xl shadow-2xl shadow-black/80 p-1.5 transition-all duration-500 hover:border-[#f472b6]/40"
        >
          {/* Play/Pause Button */}
          <button
            onClick={togglePlay}
            className={`w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer shrink-0 ${
              isPlaying
                ? 'bg-[#f472b6] text-[#070509] shadow-lg shadow-[#f472b6]/40 border border-[#fbcfe8]/50'
                : isUnavailable
                ? 'bg-amber-950/60 text-amber-300 border border-amber-500/30'
                : 'bg-white/10 text-[#fdfaf6] hover:bg-[#f472b6]/20 border border-white/10'
            }`}
            aria-label={
              isUnavailable
                ? `Missing track: ${currentTrack.src.replace('/audio/', '')}`
                : isPlaying
                ? 'Pause music'
                : 'Play music'
            }
            title={
              isUnavailable
                ? unsupportedMessage || `Missing audio file: public${currentTrack.src}`
                : isPlaying
                ? 'Pause music'
                : 'Play music'
            }
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin text-[#dfb877]" />
            ) : isUnavailable ? (
              <AlertCircle className="w-4 h-4 text-amber-400" />
            ) : isPlaying ? (
              <Pause className="w-4 h-4 fill-current" />
            ) : (
              <Play className="w-4 h-4 fill-current ml-0.5" />
            )}
          </button>

          {/* Animated Audio Equalizer Bars when playing */}
          {isPlaying && (
            <div className="flex items-end gap-1 px-2.5 h-4 shrink-0">
              <motion.span
                animate={{ height: ['40%', '100%', '30%', '80%', '40%'] }}
                transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
                className="w-0.5 bg-[#dfb877] rounded-full"
              />
              <motion.span
                animate={{ height: ['80%', '30%', '100%', '40%', '80%'] }}
                transition={{ duration: 0.9, repeat: Infinity, ease: 'easeInOut' }}
                className="w-0.5 bg-[#f472b6] rounded-full"
              />
              <motion.span
                animate={{ height: ['30%', '90%', '40%', '100%', '30%'] }}
                transition={{ duration: 1.1, repeat: Infinity, ease: 'easeInOut' }}
                className="w-0.5 bg-[#c084fc] rounded-full"
              />
            </div>
          )}

          {/* Track Information & Controls - Always visible for clear UX */}
          <div className="overflow-hidden whitespace-nowrap pl-2 pr-3 flex items-center gap-3">
            {/* Track and Section Text */}
            <div className="flex flex-col justify-center">
              {/* Current Section Badge */}
              <div className="flex items-center gap-1 text-[10px] uppercase font-mono tracking-wider text-[#dfb877]">
                <Compass className="w-2.5 h-2.5" />
                <span>Section: {currentTrack.sectionName}</span>
              </div>

              {/* Track Title */}
              <div className="text-xs font-serif font-medium text-[#fdfaf6] flex items-center gap-1.5 leading-tight">
                <Music className="w-3 h-3 text-[#f472b6] shrink-0" />
                <span className="truncate max-w-[120px] sm:max-w-[180px]">
                  {currentTrack.trackTitle}
                </span>
              </div>

              {/* Artist / File Status */}
              <div className="text-[10px] text-[#cbbead] truncate max-w-[120px] sm:max-w-[180px]">
                {isUnavailable ? (
                  <span className="text-amber-400 font-medium">
                    Missing: {currentTrack.src.replace('/audio/', '')}
                  </span>
                ) : (
                  currentTrack.artist
                )}
              </div>
            </div>

            {/* Volume & Mute Controls */}
            <div className="flex items-center gap-1.5 pl-2 border-l border-white/10 shrink-0">
              <button
                onClick={toggleMute}
                className="p-1 rounded-full text-[#cbbead] hover:text-[#fdfaf6] transition-colors cursor-pointer"
                aria-label={isMuted ? 'Unmute' : 'Mute'}
                title={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="w-3.5 h-3.5 text-amber-300" />
                ) : (
                  <Volume2 className="w-3.5 h-3.5 text-[#f472b6]" />
                )}
              </button>

              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-12 sm:w-16 h-1 accent-[#f472b6] bg-white/20 rounded-lg cursor-pointer"
                aria-label="Volume slider"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </aside>
  );
};
