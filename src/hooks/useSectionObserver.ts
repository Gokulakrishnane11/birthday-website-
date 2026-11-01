import { useEffect, useRef } from 'react';
import { useMusic } from '@/context/useMusic';

export interface UseSectionObserverOptions {
  sectionIds: string[];
  enabled?: boolean;
  debounceMs?: number;
}

export function useSectionObserver({
  sectionIds,
  enabled = true,
  debounceMs = 150,
}: UseSectionObserverOptions): void {
  const { setActiveSection, activeSection } = useMusic();
  const visibilityMapRef = useRef<Map<string, number>>(new Map());
  const debounceTimerRef = useRef<number | null>(null);
  const activeSectionRef = useRef<string>(activeSection);

  // Keep active section ref in sync
  useEffect(() => {
    activeSectionRef.current = activeSection;
  }, [activeSection]);

  useEffect(() => {
    if (!enabled || typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      return;
    }

    const visibilityMap = visibilityMapRef.current;
    visibilityMap.clear();

    const handleEntries = (entries: IntersectionObserverEntry[]) => {
      // Update visibility map with intersection heights
      entries.forEach((entry) => {
        const height = entry.isIntersecting ? entry.intersectionRect.height : 0;
        visibilityMap.set(entry.target.id, height);
      });

      if (debounceTimerRef.current !== null) {
        clearTimeout(debounceTimerRef.current);
      }

      debounceTimerRef.current = window.setTimeout(() => {
        let bestCandidateId: string | null = null;
        let maxVisibleHeight = 0;

        // Find candidate section with the greatest visible height in viewport
        for (const [id, height] of visibilityMap.entries()) {
          if (height > maxVisibleHeight) {
            maxVisibleHeight = height;
            bestCandidateId = id;
          }
        }

        const currentActive = activeSectionRef.current;
        const currentActiveHeight = visibilityMap.get(currentActive) || 0;
        const MIN_VISIBILITY_PX = 75;

        // If no section has meaningful visibility, do not switch
        if (!bestCandidateId || maxVisibleHeight < MIN_VISIBILITY_PX) {
          return;
        }

        // If candidate is already active, no change needed
        if (bestCandidateId === currentActive) {
          return;
        }

        // Hysteresis Rule:
        // A new section only replaces the currently active section if:
        // 1. The currently active section has scrolled away (visible height < MIN_VISIBILITY_PX), OR
        // 2. The candidate section is substantially more dominant in the viewport (at least 25% larger visible height)
        const shouldSwitch =
          currentActiveHeight < MIN_VISIBILITY_PX ||
          maxVisibleHeight >= currentActiveHeight * 1.25;

        if (shouldSwitch) {
          activeSectionRef.current = bestCandidateId;
          setActiveSection(bestCandidateId);
        }
      }, debounceMs);
    };

    const observer = new IntersectionObserver(handleEntries, {
      root: null,
      rootMargin: '-5% 0px -10% 0px', // Focus slightly inwards towards central reading zone
      threshold: [0, 0.1, 0.25, 0.5, 0.75, 1.0],
    });

    // Observe target sections
    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) {
        observer.observe(el);
      }
    });

    return () => {
      if (debounceTimerRef.current !== null) {
        clearTimeout(debounceTimerRef.current);
      }
      observer.disconnect();
    };
  }, [debounceMs, enabled, sectionIds, setActiveSection]);
}
