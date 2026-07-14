export interface CourseLevel {
  id: 'beginner' | 'intermediate' | 'advanced';
  number: number;
  name: string;
  title: string;
  badge: string;
  emoji: string;
  modules: number;
  lessons: number;
  duration: string;
  description: string;
  bestFor: string;
  cta: string;
  samplePdfPath?: string;
  sampleDownloadCTA?: string;
  points: string[];
}

export const courseConfig: Record<'beginner' | 'intermediate' | 'advanced', CourseLevel> = {
  beginner: {
    id: 'beginner',
    number: 1,
    name: 'Beginner',
    title: 'Foundations of Options',
    badge: 'Foundation',
    emoji: '🌱',
    modules: 5,
    lessons: 40,
    duration: '6-7 weeks',
    description: 'Understand how options work, decode market terminology, and take your first steps toward becoming a smarter trader.',
    bestFor: 'New traders with little or no options trading experience.',
    cta: 'Start Level 1',
    samplePdfPath: '/Samples/EasyOptionLearning_Beginner_Module1_Sample.pdf',
    sampleDownloadCTA: 'Download Sample PDF',
    points: [
      'Get Started with Options Trading',
      'Learn How Options Really Work',
      'Decode Greeks, Volatility & Price Movements',
      'Trade Your First Strategies',
      'Protect Your Trading Capital',
      'Develop a Trader Mindset'
    ]
  },
  intermediate: {
    id: 'intermediate',
    number: 2,
    name: 'Intermediate',
    title: 'Learn Trading with Clarity',
    badge: 'Growth',
    emoji: '📈',
    modules: 6,
    lessons: 35,
    duration: '6-7 weeks',
    description: 'Trade options with better strategies, smarter decisions, and more confidence.',
    bestFor: 'Traders who understand the basics and want structured trade execution skills.',
    cta: 'Start Level 2',
    points: [
      'Build Better Trade Setups',
      'Understand the Market before Trading',
      'Use Smarter Trading Strategies',
      'Master the Art of Managing Live Trades',
      'Build Strong Trading Habits',
      'Handle Real Market Situations Calmly'
    ]
  },
  advanced: {
    id: 'advanced',
    number: 3,
    name: 'Advanced',
    title: 'Trade Like a Professional',
    badge: 'Mastery',
    emoji: '🏆',
    modules: 7,
    lessons: 50,
    duration: '6-7 weeks',
    description: 'This level turns you from someone who knows options into someone who trades them like a pro.',
    bestFor: 'Traders looking to achieve consistency and long-term growth.',
    cta: 'Start Level 3',
    points: [
      'Trade Volatility like a Pro',
      'Build Advanced Multi-Leg Strategies',
      'Adjust Trades with Logic, not Emotions',
      'Manage Portfolio-Wide Risk',
      'Think and Trade like Institutional Players',
      'Track Performance & Improve Consistently'
    ]
  }
};

export const courseConfigList = Object.values(courseConfig);

export const NISM_LEVEL_SLUG = 'nism' as const;

export const isNismCourseTitle = (title: string) =>
  title.trim().toLowerCase().includes('nism');

export interface NISMConfig {
  badge: string;
  title: string;
  description: string;
  benefits: string[];
  primaryCTA: string;
  enrolledCTA: string;
  secondaryCTA: string;
  samplePdfPath: string;
  purchaseUrl: string;
  announcementText: string;
  accentTitle: string;
  accentItems: string[];
  enabled: boolean;
}

export const nismConfig: NISMConfig = {
  badge: "NISM Series VIII · Equity Derivatives",
  title: "NISM VIII — Equity Derivatives in a Nutshell",
  description: "Struggling to get through the entire NISM book? Learn the key concepts faster with simplified chapter-wise notes.",
  benefits: [
    "Understand concepts faster",
    "Simple, jargon-free explanations",
    "Focus on what matters for the exam",
    "Instant access — start today"
  ],
  primaryCTA: "Enroll Now",
  enrolledCTA: "View Lessons",
  secondaryCTA: "Download Sample PDF",
  samplePdfPath: "/Samples/EasyOptionLearning_Chapter1_NISM.pdf",
  purchaseUrl: "/register",
  announcementText: "🏆 New: NISM VIII – Equity Derivatives Summary — Simplified Notes for Quick Revision",
  accentTitle: "Chapter-wise Simplified Notes",
  accentItems: ['Derivatives Basics', 'Futures & Options', 'Hedging Strategies', 'Settlement & Margins', 'Regulatory Framework'],
  enabled: true
};

/** Dashboard / pricing card config for the NISM level (matches other level cards). */
export const nismLevelDisplay = {
  id: NISM_LEVEL_SLUG,
  number: 4,
  name: 'NISM',
  title: 'NISM VIII — Equity Derivatives',
  badge: 'Certification',
  emoji: '📘',
  modules: nismConfig.accentItems.length,
  lessons: 0,
  duration: 'Self-paced',
  description: nismConfig.description,
  bestFor: 'Traders preparing for the NISM Series VIII certification exam.',
  cta: nismConfig.enrolledCTA,
  samplePdfPath: nismConfig.samplePdfPath,
  sampleDownloadCTA: nismConfig.secondaryCTA,
  points: nismConfig.accentItems,
} as const;

export interface SiteConfig {
  beginnerStartUrl: string;
  telegramSupportUrl: string;
}

export const siteConfig: SiteConfig = {
  beginnerStartUrl: 'https://anantasecurities.in/easyoptionlearning/level/beginner',
  telegramSupportUrl: 'https://t.me/+lNnTuYqeosNlZmNl',
};

export interface HeroConfig {
  badge: string;
  titlePart1: string;
  titlePart2: string;
  subtitle: string;
  primaryCTA: string;
  secondaryCTA: string;
  features: string[];
  mockVisual: {
    concept: string;
    moduleText: string;
    nextUp: string;
  };
}

export const heroConfig: HeroConfig = {
  badge: "Designed for Indian Markets",
  titlePart1: "New to Option Trading?",
  titlePart2: "Learn options the simple way.",
  subtitle: "A step-by-step learning path built for beginners — no jargon, no confusion. Just clear, practical lessons that get you trading with confidence.",
  primaryCTA: "Start With Level 1",
  secondaryCTA: "Explore Levels",
  features: ["Easy to Learn", "Trade with Clarity", "Career Ready"],
  mockVisual: {
    concept: "Greeks Basics",
    moduleText: "Module 3/12",
    nextUp: "Delta Hedging"
  }
};

export interface AboutConfig {
  badge: string;
  titlePart1: string;
  titlePart2: string;
  subtitle: string;
  features: {
    iconKey: 'lightbulb' | 'layers' | 'brain' | 'graduationCap';
    title: string;
    description: string;
  }[];
}

export const aboutConfig: AboutConfig = {
  badge: "THE REAL STRUGGLE",
  titlePart1: "Effort isn’t the problem. ",
  titlePart2: "Structure is.",
  subtitle: "If this sounds familiar, you're not alone.",
  features: [
    {
      iconKey: 'lightbulb',
      title: 'You watch videos, but still feel confused.',
      description: 'Because random content rarely builds real understanding. Structured learning brings clarity step-by-step.'
    },
    {
      iconKey: 'layers',
      title: 'You hesitate before every trade.',
      description: 'Without a clear process, confidence disappears quickly. A proper framework helps you trade with confidence.'
    },
    {
      iconKey: 'brain',
      title: "You feel like you're guessing, not trading.",
      description: 'When there’s no framework, every decision feels random. Understanding the “why” behind trades changes everything.'
    },
    {
      iconKey: 'graduationCap',
      title: "You understand theory, but struggle to apply it.",
      description: 'Knowing concepts is one thing. Executing them confidently is another. Practical learning helps bridge that gap.'
    }
  ]
};

export interface WhyChooseUsConfig {
  badge: string;
  titlePart1: string;
  titlePart2: string;
  subtitle: string;
  reasons: {
    title: string;
    description: string;
  }[];
  stats: {
    suffix: string;
    label: string;
  }[];
}

export const whyChooseUsConfig: WhyChooseUsConfig = {
  badge: "How we teach",
  titlePart1: "Because trading deserves",
  titlePart2: "clarity, not confusion.",
  subtitle: "Every lesson is made to break down complex ideas into simple, practical learning you can actually understand.",
  reasons: [
    { title: 'No unnecessary jargon', description: 'Focus only on what truly drives option prices.' },
    { title: 'Learn deeply, not quickly', description: 'Master concepts step by step.' },
    { title: 'Practice like a real trader', description: 'Turn knowledge into usable skill.' },
    { title: 'Built for the markets', description: 'Built for real trading readiness, not just certificates.' }
  ],
  stats: [
    { suffix: '%', label: 'Practical' }
  ]
};

export interface Testimonial {
  quote: string;
  author: string;
  role: string;
}

export const testimonialsConfig: Testimonial[] = [
  {
    quote: "Options finally made sense. The focus on 'why' changed how I look at trades.",
    author: 'Ratan Krishnan',
    role: 'Beginner Level Graduate'
  },
  {
    quote: "This feels structured, practical, and refreshingly honest. No hype, just real learning.",
    author: 'Shriti Agarwal N',
    role: 'Options Trader'
  }
];

export interface CTASectionConfig {
  titlePart1: string;
  titlePart2: string;
  subtitle: string;
  primaryCTA: string;
  secondaryCTA: string;
}

export const ctaSectionConfig: CTASectionConfig = {
  titlePart1: "Start learning options the",
  titlePart2: "right way",
  subtitle: "Build clarity, then confidence.",
  primaryCTA: "Start With Level 1",
  secondaryCTA: "View Levels"
};

export interface FAQ {
  question: string;
  answer: string;
}

export const landingFaqConfig: FAQ[] = [
  {
    question: "I'm completely new to options. Is this too advanced for me?",
    answer: "No. The Beginner Level starts from absolute basics—no prior experience required."
  },
  {
    question: "Will this feel like boring theory?",
    answer: "No. Concepts are taught through logic, examples, and real market context."
  },
  {
    question: "How much time will I need to commit?",
    answer: "Each level typically takes 6–7 weeks, and you can learn at your own pace."
  },
  {
    question: "Can I really learn without rushing?",
    answer: "Yes. You move forward only after understanding—not by speed."
  },
  {
    question: "Do I get any certification?",
    answer: "Yes. You receive a certification after completing each level."
  },
  {
    question: "Can this actually help me get a job?",
    answer: "Top performers from the Advanced Level may be considered for roles on our trading desk."
  }
];

export interface PricingFAQ {
  q: string;
  a: string;
}

export const pricingFaqConfig: PricingFAQ[] = [
  { q: 'Do I need prior trading experience?', a: 'No. The Beginner level starts from the basics and is designed for learners with little or no options trading experience.' },
  { q: 'How long will I have access to the course?', a: 'Lifetime access. Learn at your own pace and revisit the content whenever you need a refresher.' },
  { q: 'Will I receive a certificate after completing the course?', a: "Yes. You'll receive a certificate of completion after successfully finishing the course requirements." },
  { q: 'Can I access the course on mobile and desktop?', a: 'Absolutely. The course is fully accessible across mobile, tablet, and desktop devices.' },
  { q: 'Which level should I choose?', a: "Choose Beginner if you're new to options trading. Choose Intermediate if you already understand the basics. Choose Advanced if you're looking to refine your strategies, risk management, and trading process." },
  { q: 'Is this course suitable for working professionals?', a: 'Yes. The lessons are self-paced, so you can learn whenever it fits your schedule.' },
  { q: 'Will I get access immediately after payment?', a: 'Yes. Your course access is activated automatically as soon as your payment is successful.' },
];
