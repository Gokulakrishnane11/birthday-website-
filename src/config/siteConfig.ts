import type { SiteConfig } from '../types';

export const siteConfig: SiteConfig = {
  recipientName: "Deepa Dharshini",
  nickname: "Gundoos 🐼",
  senderName: "Gokul",
  birthDate: "2007-11-02",
  celebrationDate: "2026-11-02",
  milestoneAge: 19,

  hero: {
    label: "A SPECIAL KEEPSAKE FOR YOUR 19TH",
    title: "Happiest 19th Birthday, Deepa! ❤️",
    subtitle: "Today is all about celebrating the beautiful person you are.",
    description:
      "From community team coordination to late-night phone calls, endless banter, and non-stop teasing — here is a digital keepsake crafted with care, just for you.",
    primaryCtaText: "Explore Our Journey",
    secondaryCtaText: "Play Background Melodies",
  },

  specialMemories: [
    {
      id: "phone-call-memory",
      badge: "A Thoughtful Moment",
      title: "Sometimes, You Understand Without Me Saying Anything.",
      subtitle: "The call that said everything without words",
      type: "heartfelt",
      story:
        "One time, I called you, but your line was engaged because you were speaking with someone. When you called me back, I quietly thought about asking who you had been talking to. But before a single question could even leave my mouth, you sensed exactly what was passing through my mind and said, 'I was just speaking with my dad.'",
      takeaway:
        "It might have seemed like a simple, fleeting detail to you, but it left a lasting impression on me. You have an incredible gift for noticing quiet feelings and offering comfort before words are even spoken.",
      quote: "Before I asked, you already understood.",
      icon: "PhoneCall",
    },
    {
      id: "gym-aunty-memory",
      badge: "The Ultimate Teasing Material 😂",
      title: "The Gym Aunty Investigation 😂",
      subtitle: "When innocent gym reports become permanent roast material",
      type: "playful",
      story:
        "One day, I casually mentioned to you that an aunty at the gym kept staring at me. That was all you needed! You instantly launched into full investigation mode, teasing me endlessly, cooking up hilarious theories, and never letting me live it down.",
      takeaway:
        "Whenever I tell you a funny story from my day, I know I'm essentially handing you lifetime ammunition to tease me. And honestly? Seeing you burst out laughing makes it totally worth it.",
      quote: "Wait, so why was she staring at you again?! 😂",
      icon: "Sparkles",
    },
    {
      id: "singing-incident-memory",
      badge: "The Accidental Concert 🎤",
      title: "The Singer Who Never Applied for the Job 🎤",
      subtitle: "When peer pressure and a trending song created lifetime roast material",
      type: "playful",
      story:
        "Remember that time you asked me to sing that trending Instagram song? I clearly said NO. I tried to escape, but you weren't ready to accept that answer. 😂 Somehow, you convinced me to sing it for you. And now? That one song has become your permanent weapon to tease me!",
      takeaway:
        "I don't know whether I should blame my singing skills or your excellent memory. 😭😂 But honestly, I'm glad we have these silly little memories.",
      quote: "I clearly said no, but you had other plans! 😂",
      icon: "Mic",
    },
  ],

  audio: {
    enabled: true,
    songTitle: "Gentle Keepsake Melodies",
    artist: "A peaceful soundtrack for Deepa",
    audioUrl: "/audio/our-song.mp3",
  },
};
