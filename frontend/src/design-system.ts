/**
 * Easy Option Learning Design System
 * Centralized design tokens for consistent styling across the trading platform
 * 
 * This file defines all design tokens used throughout the application.
 * Use these tokens instead of hardcoded values to ensure consistency.
 */

// ============================================================================
// COLOR PALETTE
// ============================================================================

/**
 * Semantic Colors
 * Use these for consistent meaning across the app
 */
export const semanticColors = {
  // Primary - Deep Navy accent for key actions
  primary: {
    DEFAULT: 'hsl(var(--primary))',
    foreground: 'hsl(var(--primary-foreground))',
  },
  
  // Status Colors
  success: {
    DEFAULT: 'hsl(var(--success))',
    foreground: 'hsl(var(--success-foreground))',
    light: 'hsl(var(--success) / 0.1)',
    border: 'hsl(var(--success) / 0.3)',
  },
  
  warning: {
    DEFAULT: 'hsl(var(--warning))',
    foreground: 'hsl(var(--warning-foreground))',
    light: 'hsl(var(--warning) / 0.1)',
    border: 'hsl(var(--warning) / 0.2)',
  },
  
  destructive: {
    DEFAULT: 'hsl(var(--destructive))',
    foreground: 'hsl(var(--destructive-foreground))',
    light: 'hsl(var(--destructive) / 0.1)',
    border: 'hsl(var(--destructive) / 0.3)',
  },
  
  info: {
    DEFAULT: 'hsl(var(--primary))',
    foreground: 'hsl(var(--primary-foreground))',
    light: 'hsl(var(--primary) / 0.1)',
    border: 'hsl(var(--primary) / 0.2)',
  },
} as const;

/**
 * Level-specific color schemes
 * Consistent colors for each learning level
 */
export const levelColors = {
  beginner: {
    name: 'Beginner',
    primary: 'hsl(var(--success))',
    light: 'hsl(var(--success) / 0.1)',
    lighter: 'hsl(var(--success) / 0.05)',
    border: 'hsl(var(--success) / 0.3)',
    borderHover: 'hsl(var(--success) / 0.5)',
    text: 'hsl(var(--success))',
    icon: 'hsl(var(--success))',
  },
  intermediate: {
    name: 'Intermediate',
    primary: 'hsl(var(--primary))',
    light: 'hsl(var(--primary) / 0.1)',
    lighter: 'hsl(var(--primary) / 0.05)',
    border: 'hsl(var(--primary) / 0.3)',
    borderHover: 'hsl(var(--primary) / 0.5)',
    text: 'hsl(var(--primary))',
    icon: 'hsl(var(--primary))',
  },
  advanced: {
    name: 'Advanced',
    primary: 'hsl(var(--success))',
    light: 'hsl(var(--success) / 0.1)',
    lighter: 'hsl(var(--success) / 0.05)',
    border: 'hsl(var(--success) / 0.3)',
    borderHover: 'hsl(var(--success) / 0.5)',
    text: 'hsl(var(--success))',
    icon: 'hsl(var(--success))',
  },
} as const;

/**
 * Stats & Dashboard Colors
 * Consistent colors for stats cards
 */
export const statsColors = {
  lessons: {
    primary: 'hsl(var(--success))',
    light: 'hsl(var(--success) / 0.1)',
    border: 'hsl(var(--success) / 0.3)',
  },
  streak: {
    primary: 'hsl(var(--warning))',
    light: 'hsl(var(--warning) / 0.1)',
    border: 'hsl(var(--warning) / 0.3)',
  },
  milestone: {
    primary: 'hsl(var(--primary))',
    light: 'hsl(var(--primary) / 0.1)',
    border: 'hsl(var(--primary) / 0.3)',
  },
} as const;

// ============================================================================
// TYPOGRAPHY
// ============================================================================

/**
 * Font Families
 * Consistent typography across the platform
 */
export const fontFamilies = {
  display: '"Manrope", system-ui, sans-serif',
  body: '"Inter", system-ui, sans-serif',
  ui: '"Inter", system-ui, sans-serif',
  mono: '"JetBrains Mono", monospace',
} as const;

export const typography = {
  display: {
    xl: 'text-[32px] md:text-[40px] leading-[1.1]',
    lg: 'text-[30px] md:text-[40px] leading-[1.1]',
    md: 'text-[24px] md:text-[32px] leading-[1.15]',
    sm: 'text-[20px] md:text-[26px] leading-[1.2]',
  },

  heading: {
    h1: 'text-[26px] md:text-[40px]',
    h2: 'text-[20px] md:text-[30px]',
    h3: 'text-[17px] md:text-[20px]',
    h4: 'text-[15px] md:text-[17px]',
    h5: 'text-[14px] md:text-[15px]',
    h6: 'text-[13px] md:text-[14px]',
  },

  body: {
    xl: 'text-[16px]',
    lg: 'text-[15px]',
    md: 'text-[14px]',
    sm: 'text-[13px]',
    xs: 'text-[11px]',
  },

  ui: {
    lg: 'text-[15px]',
    md: 'text-[14px]',
    sm: 'text-[13px]',
    xs: 'text-[11px]',
  },

  mono: {
    xl: 'text-[20px]',
    lg: 'text-[17px]',
    md: 'text-[15px]',
    sm: 'text-[13px]',
    xs: 'text-[11px]',
  },
} as const;

/**
 * Font Weights
 */
export const fontWeights = {
  light: 'font-light',       // 300
  normal: 'font-normal',     // 400
  medium: 'font-medium',     // 500
  semibold: 'font-semibold', // 600
  bold: 'font-bold',         // 700
} as const;

/**
 * Line Heights
 */
export const lineHeights = {
  none: 'leading-none',       // 1
  tight: 'leading-tight',     // 1.25
  snug: 'leading-snug',       // 1.375
  normal: 'leading-normal',   // 1.5
  relaxed: 'leading-relaxed', // 1.75
  loose: 'leading-loose',     // 2
} as const;

// ============================================================================
// SPACING
// ============================================================================

/**
 * Spacing Scale
 * Consistent spacing for padding, margins, and gaps
 */
export const spacing = {
  // Component Spacing
  component: {
    xs: 'p-2',           // 8px
    sm: 'p-3 sm:p-4',    // 12px -> 16px
    md: 'p-4 sm:p-5',    // 16px -> 20px
    lg: 'p-4 sm:p-6',    // 16px -> 24px
    xl: 'p-5 sm:p-8',    // 20px -> 32px
    '2xl': 'p-6 sm:p-10', // 24px -> 40px
  },
  
  // Gaps
  gap: {
    xs: 'gap-1 sm:gap-1.5',   // 4px -> 6px
    sm: 'gap-2 sm:gap-3',     // 8px -> 12px
    md: 'gap-3 sm:gap-4',     // 12px -> 16px
    lg: 'gap-4 sm:gap-6',     // 16px -> 24px
    xl: 'gap-6 sm:gap-8',     // 24px -> 32px
  },
  
  // Section Spacing
  section: {
    sm: 'py-8 md:py-12',      // 32px -> 48px
    md: 'py-12 md:py-16',     // 48px -> 64px
    lg: 'py-16 md:py-24',     // 64px -> 96px
    xl: 'py-20 md:py-28',     // 80px -> 112px
  },
  
  // Margin
  margin: {
    xs: 'mb-2 sm:mb-3',       // 8px -> 12px
    sm: 'mb-3 sm:mb-4',       // 12px -> 16px
    md: 'mb-4 sm:mb-6',       // 16px -> 24px
    lg: 'mb-6 sm:mb-8',       // 24px -> 32px
    xl: 'mb-8 sm:mb-10',      // 32px -> 40px
  },
} as const;

// ============================================================================
// BORDERS & RADIUS
// ============================================================================

/**
 * Border Radius
 * Consistent corner rounding
 */
export const borderRadius = {
  none: 'rounded-none',
  sm: 'rounded-lg',         // Small cards, buttons (0.5rem)
  md: 'rounded-xl',         // Cards, modals (0.75rem)
  lg: 'rounded-2xl',        // Large cards, sections (1rem)
  full: 'rounded-full',     // Circles, pills
} as const;

/**
 * Border Widths
 */
export const borderWidths = {
  default: 'border',        // 1px
  thick: 'border-2',        // 2px
  none: 'border-0',         // 0px
} as const;

// ============================================================================
// SHADOWS & EFFECTS
// ============================================================================

/**
 * Shadow Utilities
 */
export const shadows = {
  sm: 'shadow-sm',
  default: 'shadow',
  md: 'shadow-md',
  lg: 'shadow-lg',
  xl: 'shadow-xl',
  '2xl': 'shadow-2xl',
  none: 'shadow-none',
} as const;

/**
 * Blur Effects
 */
export const blur = {
  none: 'blur-none',
  sm: 'blur-sm',
  md: 'blur-md',
  lg: 'blur-lg',
} as const;

// ============================================================================
// ANIMATIONS & TRANSITIONS
// ============================================================================

/**
 * Animation Durations
 */
export const durations = {
  fast: 'duration-100',
  normal: 'duration-200',
  slow: 'duration-300',
  slower: 'duration-500',
} as const;

/**
 * Transition Utilities
 */
export const transitions = {
  all: 'transition-all',
  colors: 'transition-colors',
  transform: 'transition-transform',
  opacity: 'transition-opacity',
  shadow: 'transition-shadow',
} as const;

/**
 * Common Animation Classes
 */
export const animations = {
  fadeIn: 'animate-fade-in',
  slideUp: 'animate-slide-up',
  scaleIn: 'animate-scale-in',
  bounceIn: 'animate-bounce-in',
  pulseGlow: 'animate-pulse-glow',
} as const;

// ============================================================================
// COMPONENT PATTERNS
// ============================================================================

/**
 * Common Button Patterns
 */
export const buttonPatterns = {
  primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
  success: 'bg-success text-success-foreground hover:bg-success/90',
  warning: 'bg-warning text-warning-foreground hover:bg-warning/90',
  destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
} as const;

/**
 * Card Patterns
 */
export const cardPatterns = {
  default: 'bg-card border border-border rounded-xl shadow-sm',
  tactical: 'tactical-card',
  interactive: 'interactive-card',
  hover: 'hover-glow',
} as const;

/**
 * Icon Sizes
 */
export const iconSizes = {
  xs: 'h-3 w-3 sm:h-3.5 sm:w-3.5',
  sm: 'h-4 w-4 sm:h-4 sm:w-4',
  md: 'h-5 w-5 sm:h-6 sm:w-6',
  lg: 'h-6 w-6 sm:h-7 sm:w-7',
  xl: 'h-8 w-8 sm:h-10 sm:w-10',
} as const;

/**
 * Icon Container Patterns
 */
export const iconContainers = {
  sm: 'w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center',
  md: 'w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center',
  lg: 'w-12 h-12 sm:w-16 sm:h-16 rounded-xl flex items-center justify-center',
} as const;

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Get level color scheme
 */
export function getLevelColorScheme(levelId: 'beginner' | 'intermediate' | 'advanced') {
  return levelColors[levelId] || levelColors.beginner;
}

/**
 * Get semantic color
 */
export function getSemanticColor(type: 'success' | 'warning' | 'destructive' | 'info') {
  return semanticColors[type];
}

/**
 * Build typography classes
 */
export function buildTypographyClasses(options: {
  family?: keyof typeof fontFamilies;
  size?: string;
  weight?: keyof typeof fontWeights;
  lineHeight?: keyof typeof lineHeights;
}): string {
  const classes: string[] = [];
  
  if (options.family) {
    classes.push(`font-${options.family}`);
  }
  if (options.size) {
    classes.push(options.size);
  }
  if (options.weight) {
    classes.push(fontWeights[options.weight]);
  }
  if (options.lineHeight) {
    classes.push(lineHeights[options.lineHeight]);
  }
  
  return classes.join(' ');
}

// ============================================================================
// DESIGN TOKENS EXPORT
// ============================================================================

/**
 * Complete Design System
 * Export all tokens for use throughout the application
 */
export const designSystem = {
  colors: {
    semantic: semanticColors,
    levels: levelColors,
    stats: statsColors,
  },
  typography: {
    families: fontFamilies,
    scale: typography,
    weights: fontWeights,
    lineHeights,
  },
  spacing,
  borders: {
    radius: borderRadius,
    widths: borderWidths,
  },
  effects: {
    shadows,
    blur,
  },
  animations: {
    durations,
    transitions,
    classes: animations,
  },
  patterns: {
    buttons: buttonPatterns,
    cards: cardPatterns,
    icons: iconSizes,
    iconContainers,
  },
  utils: {
    getLevelColorScheme,
    getSemanticColor,
    buildTypographyClasses,
  },
} as const;

export default designSystem;
