import { createContext } from 'react';
import type { MusicTrack } from '@/config/musicConfig';

export interface MusicContextType {
  activeSection: string;
  currentTrack: MusicTrack;
  isPlaying: boolean;
  isLoading: boolean;
  isMuted: boolean;
  volume: number;
  hasUserStarted: boolean;
  isUnavailable: boolean;
  unsupportedMessage: string | null;
  mode: 'normal' | 'birthday';
  play: () => Promise<void>;
  pause: () => void;
  togglePlay: () => Promise<void>;
  toggleMute: () => void;
  setVolume: (newVolume: number) => void;
  setActiveSection: (sectionId: string) => void;
}

export const MusicContext = createContext<MusicContextType | null>(null);
