import photo1 from '@/assets/memories/photo1.jpg';
import photo2 from '@/assets/memories/photo2.jpg';
import photo3 from '@/assets/memories/photo3.jpg';
import photo4 from '@/assets/memories/photo4.jpg';
import photo5 from '@/assets/memories/photo5.jpg';
import photo6 from '@/assets/memories/photo6.jpg';

export interface MemoryPhotoItem {
  id: string;
  title: string;
  caption: string;
  date: string;
  image: string;
  category?: string;
  aspectRatio?: 'landscape' | 'portrait' | 'square';
  note?: string;
  handwrittenNote?: string;
  sticker?: string;
  tapeColor?: 'rose' | 'gold' | 'lavender' | 'mint';
  featured?: boolean;
}

export const memoriesData: MemoryPhotoItem[] = [
  {
    id: "mem-1",
    title: "20th Birthday Milestone",
    caption: "A digital frame saved for Deepa's 20th birthday smile.",
    date: "November 2, 2026",
    image: photo1,
    category: "Birthday Keepsake",
    aspectRatio: "landscape",
    note: "Add your favorite portrait of Deepa here",
    handwrittenNote: "The Birthday Girl • 20 Years Young 👑",
    sticker: "★ 20TH MILESTONE ★",
    tapeColor: "gold",
    featured: true,
  },
  {
    id: "mem-2",
    title: "The Iconic Curls",
    caption: "Those beautiful curls that are effortlessly vibrant, bouncy, and uniquely her.",
    date: "Signature Style",
    image: photo2,
    category: "Little Details",
    aspectRatio: "portrait",
    note: "Replace photo2.svg with a photo celebrating her curls",
    handwrittenNote: "Effortlessly bouncy & iconic 🌸",
    sticker: "Signature Curls",
    tapeColor: "rose",
  },
  {
    id: "mem-3",
    title: "Endless Conversations",
    caption: "From quick tech community updates to calls that flowed naturally for hours.",
    date: "Voice Notes & Chats",
    image: photo3,
    category: "Connection",
    aspectRatio: "square",
    note: "Replace photo3.svg with a memorable chat screenshot or memory",
    handwrittenNote: "When a 5-min update turns into hours ☕",
    sticker: "Late Night Talks",
    tapeColor: "lavender",
  },
  {
    id: "mem-4",
    title: "The Gundoos 🐼 Energy",
    caption: "Bubbly, energetic, spontaneous, and always brightening up the conversation.",
    date: "Bubbly Moments",
    image: photo4,
    category: "Personality",
    aspectRatio: "landscape",
    note: "Replace photo4.svg with a candid, happy picture",
    handwrittenNote: "Pure chaos & sunshine energy 🐼✨",
    sticker: "Gundoos 🐼",
    tapeColor: "mint",
  },
  {
    id: "mem-5",
    title: "Teasing In Action 😂",
    caption: "Never letting me forget the gym aunty incident or missing a chance to tease me.",
    date: "Inside Jokes",
    image: photo5,
    category: "Playful Banter",
    aspectRatio: "portrait",
    note: "Replace photo5.svg with a funny candid memory",
    handwrittenNote: "Lifetime Gym Aunty roast material 🕵️‍♀️",
    sticker: "Inside Joke 😂",
    tapeColor: "rose",
  },
  {
    id: "mem-6",
    title: "Stepping into 20",
    caption: "Wishing you a year full of happiness, peace, good health, and success in everything.",
    date: "New Chapter",
    image: photo6,
    category: "Wishes",
    aspectRatio: "landscape",
    note: "Replace photo6.svg with a special celebration photo",
    handwrittenNote: "Here's to the brightest 20th year ahead ❤️",
    sticker: "New Chapter ✨",
    tapeColor: "gold",
    featured: true,
  },
];
