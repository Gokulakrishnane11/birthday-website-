export interface TimelineEvent {
  id: string;
  milestoneNumber?: number;
  date?: string;
  title: string;
  subtitle?: string;
  description: string;
  location?: string;
  tag?: string;
  iconName?: string;
}

export interface MemoryPhoto {
  id: string;
  title: string;
  caption: string;
  url: string;
  category?: string;
  date?: string;
}

export interface SpecialMemory {
  id: string;
  badge: string;
  title: string;
  subtitle: string;
  type: 'heartfelt' | 'playful';
  story: string;
  takeaway: string;
  icon: string;
  quote?: string;
}

export interface PersonalityTrait {
  id: string;
  number: number;
  title: string;
  tagline: string;
  description: string;
  iconName: string;
  isSpecial?: boolean;
}

export interface SiteConfig {
  recipientName: string;
  nickname: string;
  senderName: string;
  birthDate: string; // "2007-11-02"
  celebrationDate: string; // "2026-11-02"
  milestoneAge: number;
  hero: {
    label?: string;
    title: string;
    subtitle: string;
    description: string;
    primaryCtaText: string;
    secondaryCtaText: string;
  };
  specialMemories: SpecialMemory[];
  audio: {
    enabled: boolean;
    songTitle: string;
    artist: string;
    audioUrl: string;
  };
}
