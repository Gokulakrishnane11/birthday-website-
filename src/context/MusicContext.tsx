import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import { SECTION_MUSIC_MAP, type MusicTrack, getTrackForSection } from '@/config/musicConfig';
import { MusicContext } from './musicContextDef';

const STORAGE_KEY_VOLUME = 'bday_music_volume';
const STORAGE_KEY_MUTED = 'bday_music_muted';
const STORAGE_KEY_STARTED = 'bday_music_started';

const FADE_OUT_DURATION_MS = 950;
const FADE_IN_DURATION_MS = 950;

export interface MusicProviderProps {
  children: ReactNode;
  mode: 'normal' | 'birthday';
}

function logDebug(message: string, ...args: unknown[]) {
  const time = new Date().toISOString().slice(11, 23);
  console.log(`[Soundtrack ${time}] ${message}`, ...args);
}

export const MusicProvider: React.FC<MusicProviderProps> = ({ children, mode }) => {
  // Initial section based on active mode
  const initialSection = mode === 'normal' ? 'normal-landing' : 'cinematic-intro';
  const initialTrack = SECTION_MUSIC_MAP[initialSection] || SECTION_MUSIC_MAP['normal-landing'];

  const [activeSection, setActiveSectionState] = useState<string>(initialSection);
  const [currentTrack, setCurrentTrack] = useState<MusicTrack>(initialTrack);

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isUnavailable, setIsUnavailable] = useState<boolean>(false);
  const [unsupportedMessage, setUnsupportedMessage] = useState<string | null>(null);

  // User playback intent
  const [hasUserStarted, setHasUserStarted] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem(STORAGE_KEY_STARTED) === 'true';
    } catch {
      return false;
    }
  });

  // Persistent volume
  const [volume, setVolumeState] = useState<number>(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY_VOLUME);
      if (saved !== null) {
        const parsed = parseFloat(saved);
        if (!isNaN(parsed) && parsed >= 0 && parsed <= 1) return parsed;
      }
    } catch {
      // Ignore storage errors
    }
    return 0.7;
  });

  // Persistent mute state
  const [isMuted, setIsMutedState] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem(STORAGE_KEY_MUTED) === 'true';
    } catch {
      return false;
    }
  });

  // Master audio element reference
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Transition and synchronization tracking refs
  const activeSectionRef = useRef<string>(initialSection);
  const currentTrackRef = useRef<MusicTrack>(initialTrack);
  const activeTrackSrcRef = useRef<string>(initialTrack.src);

  const isPlayingRef = useRef<boolean>(false);
  const volumeRef = useRef<number>(volume);
  const isMutedRef = useRef<boolean>(isMuted);

  const transitionIdRef = useRef<number>(0);
  const isTransitioningRef = useRef<boolean>(false);
  const fadeCancelFnRef = useRef<(() => void) | null>(null);
  const activePlayPromiseRef = useRef<Promise<void> | null>(null);

  // Sync refs with React state updates
  useEffect(() => {
    volumeRef.current = volume;
    isMutedRef.current = isMuted;

    const audio = audioRef.current;
    if (audio && !isTransitioningRef.current) {
      audio.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  // Mode change synchronization pattern (official React docs for adjusting state from props)
  const [prevMode, setPrevMode] = useState<string>(mode);
  if (prevMode !== mode) {
    setPrevMode(mode);
    const targetSection = mode === 'normal' ? 'normal-landing' : 'cinematic-intro';
    const targetTrack = SECTION_MUSIC_MAP[targetSection] || SECTION_MUSIC_MAP['normal-landing'];
    setActiveSectionState(targetSection);
    setCurrentTrack(targetTrack);
  }

  // Audio source initialization & mode change handler for DOM audio
  useEffect(() => {
    const targetSection = mode === 'normal' ? 'normal-landing' : 'cinematic-intro';
    const targetTrack = SECTION_MUSIC_MAP[targetSection] || SECTION_MUSIC_MAP['normal-landing'];
    activeSectionRef.current = targetSection;
    currentTrackRef.current = targetTrack;

    const audio = audioRef.current;
    if (audio) {
      if (!audio.src || !audio.src.includes(encodeURI(targetTrack.src))) {
        logDebug(`Initializing audio source to: "${targetTrack.src}" for section "${targetSection}"`);
        audio.src = targetTrack.src;
        activeTrackSrcRef.current = targetTrack.src;
        audio.loop = true;
        audio.volume = isMutedRef.current ? 0 : volumeRef.current;
      }
    }
  }, [mode]);

  // Clean fade helper: cancels any currently running volume fade animation
  const cancelFade = useCallback(() => {
    if (fadeCancelFnRef.current) {
      fadeCancelFnRef.current();
      fadeCancelFnRef.current = null;
    }
  }, []);

  // Teardown on unmount: stops playback, clears source, removes listeners
  useEffect(() => {
    const audio = audioRef.current;
    return () => {
      cancelFade();
      if (audio) {
        logDebug('Unmounting MusicProvider: pausing and cleaning up audio element');
        audio.pause();
        audio.removeAttribute('src');
        audio.load();
      }
    };
  }, [cancelFade]);

  // Safely pause audio, waiting for any pending play() promise to avoid DOMException
  const safePause = useCallback(async (audio: HTMLAudioElement) => {
    if (activePlayPromiseRef.current) {
      try {
        await activePlayPromiseRef.current;
      } catch {
        // Interrupted play promises are expected during rapid transitions
      }
    }
    audio.pause();
  }, []);

  // Smooth sinusoidal volume fade with cancellation token
  const fadeVolume = useCallback(
    (
      audio: HTMLAudioElement,
      startVol: number,
      targetVol: number,
      durationMs: number,
      curve: 'out' | 'in',
      txId: number
    ): Promise<boolean> => {
      return new Promise((resolve) => {
        // Cancel any pending fade animation
        if (fadeCancelFnRef.current) {
          fadeCancelFnRef.current();
          fadeCancelFnRef.current = null;
        }

        if (durationMs <= 0 || txId !== transitionIdRef.current) {
          if (txId === transitionIdRef.current) {
            audio.volume = targetVol;
          }
          return resolve(txId === transitionIdRef.current);
        }

        let rafId: number | null = null;
        let isDone = false;

        const cleanup = () => {
          if (rafId !== null) {
            cancelAnimationFrame(rafId);
            rafId = null;
          }
        };

        fadeCancelFnRef.current = () => {
          if (!isDone) {
            isDone = true;
            cleanup();
            resolve(false);
          }
        };

        const startTime = performance.now();

        const step = (now: number) => {
          if (isDone) return;

          if (txId !== transitionIdRef.current) {
            isDone = true;
            cleanup();
            fadeCancelFnRef.current = null;
            return resolve(false);
          }

          const elapsed = now - startTime;
          const progress = Math.min(1, Math.max(0, elapsed / durationMs));

          let vol: number;
          if (curve === 'out') {
            vol = startVol * Math.cos(progress * (Math.PI / 2));
          } else {
            const currentTarget = isMutedRef.current ? 0 : volumeRef.current;
            vol = currentTarget * Math.sin(progress * (Math.PI / 2));
          }

          audio.volume = isMutedRef.current ? 0 : Math.max(0, Math.min(1, vol));

          if (progress < 1) {
            rafId = requestAnimationFrame(step);
          } else {
            audio.volume = isMutedRef.current ? 0 : (curve === 'out' ? 0 : volumeRef.current);
            isDone = true;
            cleanup();
            fadeCancelFnRef.current = null;
            resolve(true);
          }
        };

        rafId = requestAnimationFrame(step);
      });
    },
    []
  );

  // Safely start playback with error categorization (handles AbortError vs real failures)
  const safePlay = useCallback(
    async (audio: HTMLAudioElement, txId?: number): Promise<boolean> => {
      try {
        setIsLoading(true);
        audio.loop = true;
        const promise = audio.play();
        activePlayPromiseRef.current = promise;
        await promise;
        activePlayPromiseRef.current = null;

        // If a transition was superseded while play() was pending, immediately silence and exit
        if (txId !== undefined && txId !== transitionIdRef.current) {
          logDebug(`[Tx #${txId}] Superseded during play() resolution. Halting.`);
          audio.pause();
          return false;
        }

        setIsLoading(false);
        setIsPlaying(true);
        isPlayingRef.current = true;
        setIsUnavailable(false);
        setUnsupportedMessage(null);
        return true;
      } catch (err: unknown) {
        activePlayPromiseRef.current = null;
        setIsLoading(false);

        const isAbort = err instanceof Error && err.name === 'AbortError';
        const isNotAllowed = err instanceof Error && err.name === 'NotAllowedError';

        if (isAbort) {
          logDebug(`[Play] Play request was interrupted by navigation (AbortError). Normal during transitions.`);
          return false;
        }

        if (isNotAllowed) {
          logDebug(`[Play] Autoplay prevented by browser policy. Awaiting user interaction.`);
          setIsPlaying(false);
          isPlayingRef.current = false;
          return false;
        }

        const msg = err instanceof Error ? err.message : String(err);
        logDebug(`[Play Error] Failed to play "${audio.src}":`, msg);
        setIsPlaying(false);
        isPlayingRef.current = false;
        setIsUnavailable(true);
        setUnsupportedMessage(`Track file unavailable: ${currentTrackRef.current.src}`);
        return false;
      }
    },
    []
  );

  // Public play trigger
  const play = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return;

    setHasUserStarted(true);
    try {
      sessionStorage.setItem(STORAGE_KEY_STARTED, 'true');
    } catch {
      // Ignore quota errors
    }

    logDebug(`User initiated play: track "${currentTrackRef.current.trackTitle}"`);
    audio.volume = isMutedRef.current ? 0 : volumeRef.current;
    await safePlay(audio);
  }, [safePlay]);

  // Public pause trigger
  const pause = useCallback(() => {
    const audio = audioRef.current;
    if (audio) {
      logDebug(`User initiated pause`);
      audio.pause();
    }
    setIsPlaying(false);
    isPlayingRef.current = false;
  }, []);

  // Public toggle play/pause
  const togglePlay = useCallback(async () => {
    if (isPlayingRef.current) {
      pause();
    } else {
      await play();
    }
  }, [pause, play]);

  // Public toggle mute
  const toggleMute = useCallback(() => {
    const next = !isMutedRef.current;
    isMutedRef.current = next;
    setIsMutedState(next);

    try {
      sessionStorage.setItem(STORAGE_KEY_MUTED, String(next));
    } catch {
      // Ignore
    }

    const audio = audioRef.current;
    if (audio) {
      audio.volume = next ? 0 : volumeRef.current;
    }
    logDebug(`Mute toggled: ${next ? 'MUTED' : 'UNMUTED'}, audio.volume=${audio ? audio.volume.toFixed(2) : 'null'}`);
  }, []);

  // Public volume slider update
  const setVolume = useCallback((newVol: number) => {
    const clamped = Math.max(0, Math.min(1, newVol));
    setVolumeState(clamped);
    volumeRef.current = clamped;

    if (clamped > 0) {
      setIsMutedState(false);
      isMutedRef.current = false;
    }

    try {
      sessionStorage.setItem(STORAGE_KEY_VOLUME, String(clamped));
      if (clamped > 0) {
        sessionStorage.setItem(STORAGE_KEY_MUTED, 'false');
      }
    } catch {
      // Ignore
    }

    const audio = audioRef.current;
    if (audio) {
      audio.volume = isMutedRef.current ? 0 : clamped;
    }
  }, []);

  // Section transition dispatcher (handles race-conditions, cancellation & hysteresis)
  const setActiveSection = useCallback(
    async (sectionId: string) => {
      // 1. Same section: Ignore duplicate calls
      if (sectionId === activeSectionRef.current) {
        return;
      }

      const newTrack = getTrackForSection(sectionId);

      // In normal mode, do not allow switching to birthday tracks
      if (mode === 'normal' && newTrack && newTrack.mode === 'birthday') {
        return;
      }

      // 2. Unmapped section (e.g. special-moments, things-i-love):
      // Update active section name for UI without interrupting currently playing soundtrack
      if (!newTrack) {
        logDebug(`Section changed to unmapped section: "${sectionId}". Retaining track "${currentTrackRef.current.trackTitle}".`);
        activeSectionRef.current = sectionId;
        setActiveSectionState(sectionId);
        return;
      }

      activeSectionRef.current = sectionId;
      setActiveSectionState(sectionId);

      // 3. Same audio source:
      // If the target section shares the exact same audio file, never restart or reload!
      if (newTrack.src === activeTrackSrcRef.current) {
        logDebug(`Section "${sectionId}" shares track "${newTrack.trackTitle}" (${newTrack.src}). Retaining playback without restart.`);
        currentTrackRef.current = newTrack;
        setCurrentTrack(newTrack);
        return;
      }

      // 4. Different audio source: Initiate race-safe transition
      const txId = ++transitionIdRef.current;
      logDebug(`[Tx #${txId}] Starting transition to section "${sectionId}" -> track "${newTrack.trackTitle}" (${newTrack.src})`);

      // Cancel any running fade immediately
      cancelFade();

      // Update UI metadata and refs
      activeTrackSrcRef.current = newTrack.src;
      currentTrackRef.current = newTrack;
      setCurrentTrack(newTrack);
      setIsUnavailable(false);
      setUnsupportedMessage(null);

      const audio = audioRef.current;
      if (!audio) return;

      // When music is paused or hasn't started yet:
      // Update audio.src without autoplaying
      if (!isPlayingRef.current) {
        logDebug(`[Tx #${txId}] Music paused. Pre-loading "${newTrack.trackTitle}" without autoplay.`);
        await safePause(audio);
        audio.src = newTrack.src;
        audio.currentTime = 0;
        audio.volume = isMutedRef.current ? 0 : volumeRef.current;
        return;
      }

      // When music is actively playing: Perform smooth ~2-second sequential crossfade
      isTransitioningRef.current = true;
      try {
        // Step A: Smoothly fade out currently playing track to 0 over ~950ms
        const startVol = audio.volume;
        logDebug(`[Tx #${txId}] Fading out from volume ${startVol.toFixed(2)} to 0...`);
        const fadeOutOk = await fadeVolume(audio, startVol, 0, FADE_OUT_DURATION_MS, 'out', txId);

        if (!fadeOutOk || transitionIdRef.current !== txId) {
          logDebug(`[Tx #${txId}] Fade out aborted by newer transition #${transitionIdRef.current}.`);
          return;
        }

        // Step B: Ensure total silence and pause old track before source change
        await safePause(audio);
        audio.volume = 0;

        if (transitionIdRef.current !== txId) return;

        // Step C: Switch source to new track
        logDebug(`[Tx #${txId}] Setting audio.src to "${newTrack.src}"`);
        audio.src = newTrack.src;
        audio.currentTime = 0;
        audio.loop = true;

        // Step D: Start playback at 0 volume
        logDebug(`[Tx #${txId}] Calling play() at volume 0...`);
        const playOk = await safePlay(audio, txId);
        if (!playOk || transitionIdRef.current !== txId) {
          logDebug(`[Tx #${txId}] Play aborted or superseded.`);
          return;
        }

        // Step E: Smoothly fade in new track to user's volume over ~950ms
        const targetVol = isMutedRef.current ? 0 : volumeRef.current;
        logDebug(`[Tx #${txId}] Fading in to target volume ${targetVol.toFixed(2)}...`);
        await fadeVolume(audio, 0, targetVol, FADE_IN_DURATION_MS, 'in', txId);

        if (transitionIdRef.current === txId) {
          audio.volume = isMutedRef.current ? 0 : volumeRef.current;
          logDebug(`[Tx #${txId}] Transition completed successfully! Now playing "${newTrack.trackTitle}".`);
        }
      } catch (err: unknown) {
        if (transitionIdRef.current !== txId) return;
        const msg = err instanceof Error ? err.message : String(err);
        logDebug(`[Tx #${txId}] Unexpected transition error:`, msg);
      } finally {
        if (transitionIdRef.current === txId) {
          isTransitioningRef.current = false;
        }
      }
    },
    [cancelFade, fadeVolume, mode, safePause, safePlay]
  );

  // Audio element event listeners
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleEnded = () => {
      if (audio.loop) {
        audio.currentTime = 0;
        audio.play().catch(() => {});
      } else {
        setIsPlaying(false);
        isPlayingRef.current = false;
      }
    };

    const handleError = () => {
      // Ignore errors if src was cleared intentionally during unmount
      if (!audio.src) return;
      setIsLoading(false);
      setIsPlaying(false);
      isPlayingRef.current = false;
      setIsUnavailable(true);
      setUnsupportedMessage(`Track file unavailable: ${currentTrackRef.current.src}`);
      logDebug(`[Audio Event: error] Failed to load "${audio.src}"`);
    };

    const handleCanPlay = () => {
      setIsLoading(false);
      setIsUnavailable(false);
      setUnsupportedMessage(null);
    };

    const handleWaiting = () => {
      if (isPlayingRef.current) {
        setIsLoading(true);
      }
    };

    const handlePlaying = () => {
      setIsLoading(false);
      setIsPlaying(true);
      isPlayingRef.current = true;
    };

    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('waiting', handleWaiting);
    audio.addEventListener('playing', handlePlaying);

    return () => {
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('waiting', handleWaiting);
      audio.removeEventListener('playing', handlePlaying);
    };
  }, []);

  return (
    <MusicContext.Provider
      value={{
        activeSection,
        currentTrack,
        isPlaying,
        isLoading,
        isMuted,
        volume,
        hasUserStarted,
        isUnavailable,
        unsupportedMessage,
        mode,
        play,
        pause,
        togglePlay,
        toggleMute,
        setVolume,
        setActiveSection,
      }}
    >
      {/* 
        Single persistent HTML5 Audio Element for the entire application.
        src is managed exclusively by MusicContext imperative logic to prevent
        React reconciler resets and duplicate loads.
      */}
      <audio
        ref={audioRef}
        preload="auto"
        aria-hidden="true"
      />
      {children}
    </MusicContext.Provider>
  );
};
