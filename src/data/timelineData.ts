export interface TimelineItem {
  id: string;
  milestoneNumber: number;
  chapter: string;
  title: string;
  subtitle: string;
  description: string;
  tag: string;
  badge: string;
  iconName: 'Users' | 'MessageSquare' | 'PhoneCall' | 'Sparkles' | 'Heart';
}

export const timelineItems: TimelineItem[] = [
  {
    id: "timeline-1",
    milestoneNumber: 1,
    chapter: "Chapter I",
    title: "The First Connection",
    subtitle: "A community lead and a team member",
    description:
      "Our story started within our college tech community. There were around 6 to 7 leads, and each was assigned a team to guide. You were placed in my team. Back then, everything revolved around responsibilities, tasks, updates, and upcoming community projects — pure official business.",
    tag: "College Tech Community",
    badge: "The Beginning",
    iconName: "Users",
  },
  {
    id: "timeline-2",
    milestoneNumber: 2,
    chapter: "Chapter II",
    title: "Beyond Projects",
    subtitle: "Conversations slowly turned personal",
    description:
      "What started as routine coordination slowly took an unexpected turn. Little discussions about community tasks gently branched into random banter, day-to-day college chatter, and sharing opinions. Without even trying, we found ourselves talking about things completely unrelated to work.",
    tag: "Unplanned Conversations",
    badge: "The Shift",
    iconName: "MessageSquare",
  },
  {
    id: "timeline-3",
    milestoneNumber: 3,
    chapter: "Chapter III",
    title: "From Chats to Calls",
    subtitle: "We started talking more frequently",
    description:
      "Brief text updates turned into phone calls, and phone calls turned into hours slipping away without notice. You brought your vibrant energy and countless stories, while I listened and chimed in with my quiet thoughts. Picking up the phone and hearing your voice became the most natural part of my day.",
    tag: "Voice Notes & Phone Calls",
    badge: "Growing Closeness",
    iconName: "PhoneCall",
  },
  {
    id: "timeline-4",
    milestoneNumber: 4,
    chapter: "Chapter IV",
    title: "Unexpected Closeness",
    subtitle: "Two different personalities found rhythm",
    description:
      "Interestingly, even though we grew so close over calls and late talks, we barely crossed paths face-to-face on campus. Whenever we did see each other in college, we'd just exchange a polite 'hi' like ordinary community members. But beyond that formal campus setting, an entirely different, genuine bond was blossoming between an extrovert who loves to talk and an introvert who loves to listen.",
    tag: "Opposites in Harmony",
    badge: "A Quiet Contrast",
    iconName: "Sparkles",
  },
  {
    id: "timeline-5",
    milestoneNumber: 5,
    chapter: "Chapter V",
    title: "Little Moments That Matter",
    subtitle: "Small conversations and memories became meaningful",
    description:
      "Today, it's not the grand gestures that define us, but the small everyday moments — the teasing remarks, your uncanny emotional intuition, your cheerful laughter, and the comfort of knowing there's someone who genuinely listens. Stepping into your 20th year, I'm simply grateful our paths intertwined.",
    tag: "Looking Ahead",
    badge: "Present & Beyond",
    iconName: "Heart",
  },
];
