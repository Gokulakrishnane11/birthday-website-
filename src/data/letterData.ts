export interface BirthdayLetterData {
  subtitleHeading: string;
  teaserText: string;
  ctaText: string;
  title: string;
  salutation: string;
  introParagraphs: string[];
  difficultPhaseLead: string[];
  worthHighlight: string;
  worthExplanation: string;
  futureHighlight: string;
  futureExplanation: string;
  strengthHighlight: string;
  strengthExplanation: string;
  personalMessage: {
    badge: string;
    bodyPart1: string;
    bodyPart2: string;
    hereHighlight: string;
  };
  lookingForward: string[];
  closingWishes: {
    birthdayCelebrate: string;
    tagline1: string;
    tagline2: string;
  };
  valediction: string;
  senderName: string;
  date?: string;
  // Backward compatibility
  paragraphs: string[];
}

export const letterData: BirthdayLetterData = {
  subtitleHeading: "For the days when smiling feels a little difficult...",
  teaserText: "A handwritten letter for your 20th birthday...",
  ctaText: "Open My Letter",
  title: "A Letter For You",
  salutation: "Hey Gundoos! 🐼❤️",

  introParagraphs: [
    "First of all, Happy 20th Birthday, Deepa! Another year older, and somehow you haven't run out of energy or things to talk about. 😂",
    "I was thinking about what to write to you today. Sure, I could just tease you about the gym aunty incident or bring up that trending song you insisted I sing until it became your weapon to tease me. But today, on your birthday, I wanted to say something a little more honest and from the heart.",
  ],

  difficultPhaseLead: [
    "I know this past phase hasn't been easy on you. You've had to navigate moments that hurt quietly, situations with people you considered family where silence replaced conversations, and memories from your past that still leave an ache. When people we care about drift away, it's so easy to start questioning everything—wondering why people enter our lives, make us feel special, and then just disappear.",
    "And when that happens, a small voice inside can make you wonder if you're difficult to love, or if there's something wrong with how deeply you care.",
  ],

  worthHighlight: "Their leaving doesn't reduce your worth.",
  worthExplanation:
    "Someone else's inability to understand or appreciate your heart does not mean you lack value. People carry their own confusion, their own limitations, and their own timing. It doesn't mean you weren't enough. It just means their story with you wasn't meant to define your whole journey.",

  futureHighlight: "Your past doesn't decide your future.",
  futureExplanation:
    "Whatever painful experiences you went through before do not have the power to write the rest of your life. Those chapters taught you resilience, but they don't dictate what kind of happiness, genuine friendships, and peace you will find ahead. You don't have to carry the shadows of yesterday into tomorrow.",

  strengthHighlight: "You don't always have to be the strong one.",
  strengthExplanation:
    "You're usually the talkative one, the energetic one, always laughing and trying to keep things light. But you don't have to pretend everything is okay all the time. It's completely okay to have bad days. It's okay to cry, to take breaks, and to heal at your own pace without feeling guilty. Healing isn't a race, and nobody expects you to be invincible.",

  personalMessage: {
    badge: "A Personal Note From Me",
    bodyPart1:
      "I may not have perfect words to make everything better, but I'm here for you. If you want to talk, I'll listen. If you need someone to distract you, I'll annoy you with my usual nonsense 😂. If you need silence, that's okay too.",
    bodyPart2:
      "You don't have to hide your pain or pretend everything is okay around me. I'm here as your friend, without expectations or pressure. You don't have to face every difficult day alone.",
    hereHighlight: "I'm here, okay?",
  },

  lookingForward: [
    "You deserve genuine friendships, genuine happiness, peace, and relationships where you can simply be yourself without the fear of being abandoned.",
    "Keep chasing your goals, keep working toward your dreams, and keep growing into the wonderful person you're becoming. So many beautiful experiences, new chapters, and incredible memories are still waiting for you. This difficult phase is just a chapter in your story, not the whole book.",
  ],

  closingWishes: {
    birthdayCelebrate: "Happy 20th Birthday, Gundoos! 🐼❤️",
    tagline1: "Keep that smile. Keep that madness. Keep being YOU.",
    tagline2: "Celebrate yourself today—because you've been so strong, even on the quiet days when no one noticed.",
  },

  valediction: "With lots of care,",
  senderName: "Gokul ❤️",
  date: "November 2, 2026",

  // Backward compatibility representation for text search / plain text checks
  paragraphs: [
    "First of all, Happy 20th Birthday, Deepa! Another year older, and somehow you haven't run out of energy or things to talk about. 😂",
    "I know this past phase hasn't been easy on you. You've had to navigate moments that hurt quietly, situations with people you considered family where silence replaced conversations, and memories from your past that still leave an ache.",
    "Their leaving doesn't reduce your worth. Someone else's inability to appreciate your heart does not mean you lack value.",
    "Your past doesn't decide your future. Those chapters taught you resilience, but they don't dictate what kind of happiness and genuine friendships you will find ahead.",
    "You don't always have to be the strong one. It's completely okay to have bad days, to take breaks, and to heal at your own pace without feeling guilty.",
    "I may not have perfect words to make everything better, but I'm here for you. If you want to talk, I'll listen. If you need someone to distract you, I'll annoy you with my usual nonsense 😂. If you need silence, that's okay too.",
    "You don't have to hide your pain or pretend everything is okay around me. I'm here as your friend, without expectations or pressure. You don't have to face every difficult day alone.",
    "I'm here, okay?",
    "You deserve genuine friendships, genuine happiness, peace, and relationships where you can simply be yourself.",
    "Happy 20th Birthday, Gundoos! 🐼❤️",
    "Keep that smile. Keep that madness. Keep being YOU.",
  ],
};
