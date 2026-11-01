export interface TruthOrDareCard {
  id: string;
  category: 'Truth' | 'Dare' | 'Reflection';
  number: string;
  frontTag: string;
  frontTitle: string;
  frontSubtitle: string;
  backHeading: string;
  reflection: string;
  iconName: 'Dices' | 'Sparkles' | 'MessageCircle' | 'Heart';
  accentVariant: 'blush' | 'lavender' | 'gold' | 'rose';
}

export interface TruthOrDareSectionData {
  title: string;
  subtitle: string;
  introParagraphs: string[];
  cards: TruthOrDareCard[];
  closingReflection: string;
}

export const truthOrDareData: TruthOrDareSectionData = {
  title: "One Question at a Time... 🎲",
  subtitle: "A GAME THAT BECAME SOMETHING MORE",
  introParagraphs: [
    "Who knew a simple game of Truth or Dare would become one of the reasons we got so close?",
    "One question led to another, one answer revealed something new, and slowly we started understanding each other in ways ordinary conversations sometimes couldn't.",
    "From random questions to unexpected answers, those little games became some of the most memorable parts of our connection.",
  ],
  cards: [
    {
      id: "tod-1",
      category: "Truth",
      number: "01",
      frontTag: "The Icebreakers",
      frontTitle: "Random Questions",
      frontSubtitle: "Where curiosity first started",
      backHeading: "Unplanned Curiosity",
      reflection:
        "What started as casual, silly questions quickly opened the door to discovering the little quirks, opinions, and thoughts that made each of us unique.",
      iconName: "Dices",
      accentVariant: "blush",
    },
    {
      id: "tod-2",
      category: "Truth",
      number: "02",
      frontTag: "Peeling Back Layers",
      frontTitle: "Honest Answers",
      frontSubtitle: "Beyond ordinary small talk",
      backHeading: "Genuine Vulnerability",
      reflection:
        "Neither of us held back. Answering honestly gave us a glimpse into each other's real personalities, far beyond the formal member-lead conversations in college.",
      iconName: "Sparkles",
      accentVariant: "lavender",
    },
    {
      id: "tod-3",
      category: "Dare",
      number: "03",
      frontTag: "Playful Challenges",
      frontTitle: "Banter & Laughter",
      frontSubtitle: "Where the teasing was born",
      backHeading: "Endless Teasing",
      reflection:
        "Those playful moments were filled with non-stop laughter. You never missed a chance to roast me, turning simple dares into permanent inside jokes.",
      iconName: "MessageCircle",
      accentVariant: "gold",
    },
    {
      id: "tod-4",
      category: "Reflection",
      number: "04",
      frontTag: "Safe Harbor",
      frontTitle: "Building Trust",
      frontSubtitle: "Where two worlds clicked",
      backHeading: "A Comforting Bond",
      reflection:
        "Without even planning it, those late-night games created a space where we felt safe being entirely ourselves — genuine, comfortable, and close.",
      iconName: "Heart",
      accentVariant: "rose",
    },
  ],
  closingReflection:
    "Maybe it wasn't just the questions that brought us closer. It was the comfort of being ourselves while answering them.",
};
