// Section-to-Soundtrack Configuration for Cinematic Storytelling
// Maps each section of Deepa's website to its designated track.

export interface MusicTrack {
  sectionId: string;
  sectionName: string;
  trackTitle: string;
  artist: string;
  src: string;
  mode: 'normal' | 'birthday';
}

export const SECTION_MUSIC_MAP: Record<string, MusicTrack> = {
  // 1. Normal Mode Landing (Active every day except Nov 2)
  'normal-landing': {
    sectionId: 'normal-landing',
    sectionName: 'Normal Landing',
    trackTitle: 'Experience',
    artist: 'Ludovico Einaudi',
    src: '/audio/Normal mode.mp3',
    mode: 'normal',
  },

  // 2. Birthday Mode: Cinematic Intro Screen
  'cinematic-intro': {
    sectionId: 'cinematic-intro',
    sectionName: 'Cinematic Intro',
    trackTitle: 'Cornfield Chase',
    artist: 'Hans Zimmer',
    src: '/audio/Cinematic intro_.mp3',
    mode: 'birthday',
  },

  // 3. Birthday Mode: Birthday Hero Celebration
  'hero': {
    sectionId: 'hero',
    sectionName: 'Birthday Hero',
    trackTitle: 'A Sky Full of Stars',
    artist: 'Coldplay',
    src: '/audio/birthday hero_.mp3',
    mode: 'birthday',
  },

  // 4. Birthday Mode: Story Timeline (College Tech Community)
  'story': {
    sectionId: 'story',
    sectionName: 'Story Timeline',
    trackTitle: 'New York Nagaram (Instrumental)',
    artist: 'A.R. Rahman',
    src: '/audio/Our story timeline_.mp3',
    mode: 'birthday',
  },

  // 5. Birthday Mode: Truth or Dare Moments
  'truth-or-dare': {
    sectionId: 'truth-or-dare',
    sectionName: 'Truth or Dare',
    trackTitle: "Comptine d'un autre été",
    artist: 'Yann Tiersen',
    src: '/audio/Truth or dare_.mp3',
    mode: 'birthday',
  },

  // 6. Birthday Mode: Photo Keepsake Gallery
  'memories': {
    sectionId: 'memories',
    sectionName: 'Photo Gallery',
    trackTitle: 'Vaan Varuvaan (Instrumental)',
    artist: 'A.R. Rahman',
    src: '/audio/photo gallery_.mp3',
    mode: 'birthday',
  },

  // 7. Birthday Mode: Handwritten Birthday Letter
  'letter': {
    sectionId: 'letter',
    sectionName: 'Birthday Letter',
    trackTitle: 'Nuvole Bianche',
    artist: 'Ludovico Einaudi',
    src: '/audio/bday letter_.mp3',
    mode: 'birthday',
  },

  // 8. Birthday Mode: Grand Finale Surprise & Confetti
  'finale': {
    sectionId: 'finale',
    sectionName: 'Grand Finale',
    trackTitle: 'Arrival of the Birds',
    artist: 'The Cinematic Orchestra',
    src: '/audio/grand finale_.mp3',
    mode: 'birthday',
  },
};

/**
 * Returns the track mapped to a section ID, or null if not mapped.
 */
export function getTrackForSection(sectionId: string): MusicTrack | null {
  return SECTION_MUSIC_MAP[sectionId] || null;
}
