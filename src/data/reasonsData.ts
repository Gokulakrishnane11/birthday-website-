export interface ReasonItem {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  revealedContent: string;
  iconName: 'Sparkles' | 'MessageCircle' | 'Smile' | 'Flame' | 'HeartHandshake' | 'Heart' | 'Compass';
  accentColor?: string;
  isSpecial?: boolean;
}

export const reasonsData: ReasonItem[] = [
  {
    id: "trait-1",
    number: 1,
    title: "Your Curly Hair",
    subtitle: "Naturally beautiful & effortlessly iconic",
    revealedContent:
      "Those gorgeous curls suit your personality in the best way possible. Bouncy, vibrant, and completely unique to you. It's one of those signature features that just naturally makes you, you.",
    iconName: "Sparkles",
  },
  {
    id: "trait-2",
    number: 2,
    title: "Your Endless Conversations",
    subtitle: "You can talk about anything and make it fun",
    revealedContent:
      "You have an endless reserve of topics, stories, and thoughts. As someone quiet and introverted who rarely starts long talks, listening to you share your day, random ideas, and opinions never gets boring.",
    iconName: "MessageCircle",
  },
  {
    id: "trait-3",
    number: 3,
    title: "Your Cute & Bubbly Energy",
    subtitle: "An infectious, vibrant spirit",
    revealedContent:
      "There's a natural brightness in the way you express yourself. You're spontaneous, cheerful, and full of life. Just hearing your cheerful tone on a random call can turn an exhausting day completely around.",
    iconName: "Smile",
  },
  {
    id: "trait-4",
    number: 4,
    title: "Your Teasing Nature",
    subtitle: "Zero hesitation to roast me at any given second",
    revealedContent:
      "You never miss an opportunity to tease me — whether it's about the gym aunty incident or my quiet reactions. You find humor in the smallest things, and your playful banter keeps things fun and lighthearted.",
    iconName: "Flame",
  },
  {
    id: "trait-5",
    number: 5,
    title: "Understanding Unspoken Feelings",
    subtitle: "You notice things before I even speak",
    revealedContent:
      "I tend to keep things to myself and stay quiet when something's on my mind. But you have this rare intuition to pick up on shifts in my mood, ask the right questions, and reassure me without making it a big deal.",
    iconName: "HeartHandshake",
  },
  {
    id: "trait-6",
    number: 6,
    title: "The Way You Genuinely Care",
    subtitle: "A heart full of warmth and empathy",
    revealedContent:
      "Behind all the playful jokes and teasing, your empathy shines through. You care deeply about how the people in your circle feel, you check in genuinely, and your warmth makes everyone around you feel valued.",
    iconName: "Heart",
    isSpecial: true,
  },
];
