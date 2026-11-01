/**
 * Central Theme & Design Tokens Configuration
 * Dreamy, Editorial & Romantic Cinematic Palette for Deepa's 19th Birthday
 */

export const theme = {
  colors: {
    bg: {
      deep: '#070509',       // Deep midnight charcoal
      surface: '#0f0a15',    // Slightly elevated plum-charcoal
      elevated: '#171022',   // Cards & popovers
      lavenderMuted: '#1d142b',
      overlay: 'rgba(7, 5, 9, 0.88)',
    },
    text: {
      primary: '#fcf8f2',    // Warm cream primary
      secondary: '#f3ece1',  // Soft ivory secondary
      muted: '#a39584',      // Warm muted beige
      lavenderLight: '#e9d5ff',
      blushLight: '#fce7f3',
      dark: '#120e15',
    },
    accent: {
      blush: '#f472b6',      // Soft elegant blush pink
      blushLight: '#fbcfe8',
      blushDark: '#db2777',
      lavender: '#c084fc',   // Soft dreamy lavender
      lavenderLight: '#e9d5ff',
      lavenderDark: '#9333ea',
      plum: '#4c1d95',       // Deep purple / plum accent
      plumDark: '#2e1065',
      rose: '#d88c9a',       // Soft vintage rose
      roseLight: '#e0a5ae',
      roseDark: '#c87383',
      burgundy: '#6e2633',   // Muted deep wine
      gold: '#dfb877',       // Champagne gold highlight
      goldLight: '#ebd1a2',
      cream: '#fdfaf6',
    },
    border: {
      subtle: 'rgba(243, 236, 225, 0.08)',
      medium: 'rgba(243, 236, 225, 0.15)',
      blush: 'rgba(244, 114, 182, 0.25)',
      lavender: 'rgba(192, 132, 252, 0.25)',
      gold: 'rgba(223, 184, 119, 0.25)',
    },
  },
  typography: {
    fontSerif: "'Cormorant Garamond', 'Playfair Display', Georgia, serif",
    fontSans: "'Plus Jakarta Sans', system-ui, sans-serif",
  },
  containers: {
    narrow: 'max-w-xl',      // 576px
    medium: 'max-w-4xl',     // 896px
    wide: 'max-w-6xl',       // 1152px
    full: 'max-w-7xl',       // 1280px
  },
  sectionSpacing: 'py-20 md:py-28',
} as const;

export type Theme = typeof theme;
