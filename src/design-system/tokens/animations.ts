/**
 * Modern Design System - Animation Tokens
 * Smooth, performant animations with reduced motion support
 */

// Duration tokens
export const duration = {
  instant: '0ms',
  fastest: '75ms',
  faster: '100ms',
  fast: '150ms',
  normal: '200ms',
  slow: '300ms',
  slower: '400ms',
  slowest: '500ms',
} as const;

// Easing functions
export const easing = {
  // Standard easing
  linear: 'linear',
  easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
  easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
  easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',

  // Custom easing for specific effects
  bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  elastic: 'cubic-bezier(0.68, -0.6, 0.32, 1.6)',

  // Spring-like easing
  spring: {
    gentle: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    moderate: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
    bouncy: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  },

  // Game-specific easing
  departmentDrop: 'cubic-bezier(0.34, 1.56, 0.64, 1)',  // Bouncy drop
  sheetSnap: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',    // Smooth snap
} as const;

// Transition configurations
export const transitions = {
  // Basic transitions
  all: `all ${duration.normal} ${easing.easeInOut}`,
  colors: `color ${duration.fast} ${easing.easeInOut}, background-color ${duration.fast} ${easing.easeInOut}, border-color ${duration.fast} ${easing.easeInOut}`,
  opacity: `opacity ${duration.normal} ${easing.easeInOut}`,
  shadow: `box-shadow ${duration.normal} ${easing.easeOut}`,
  transform: `transform ${duration.normal} ${easing.easeOut}`,

  // Component-specific transitions
  button: {
    default: `background-color ${duration.fast} ${easing.easeInOut}, transform ${duration.faster} ${easing.easeOut}`,
    hover: `all ${duration.fast} ${easing.easeOut}`,
  },

  card: {
    default: `box-shadow ${duration.normal} ${easing.easeOut}, transform ${duration.normal} ${easing.easeOut}`,
    hover: `all ${duration.normal} ${easing.easeOut}`,
  },

  modal: {
    backdrop: `opacity ${duration.slow} ${easing.easeInOut}`,
    content: `opacity ${duration.normal} ${easing.easeOut}, transform ${duration.normal} ${easing.spring.gentle}`,
  },

  // Game-specific transitions
  game: {
    departmentDrag: `transform ${duration.instant} ${easing.linear}`,  // Instant during drag
    departmentDrop: `transform ${duration.slow} ${easing.departmentDrop}`,  // Bouncy drop
    bottomSheet: `transform ${duration.slow} ${easing.sheetSnap}`,  // Smooth sheet snap
    feedback: `opacity ${duration.faster} ${easing.easeOut}`,
  },
} as const;

// Animation keyframes
export const animations = {
  // Fade animations
  fadeIn: {
    from: { opacity: 0 },
    to: { opacity: 1 },
  },

  fadeOut: {
    from: { opacity: 1 },
    to: { opacity: 0 },
  },

  // Scale animations
  scaleIn: {
    from: { opacity: 0, transform: 'scale(0.95)' },
    to: { opacity: 1, transform: 'scale(1)' },
  },

  scaleOut: {
    from: { opacity: 1, transform: 'scale(1)' },
    to: { opacity: 0, transform: 'scale(0.95)' },
  },

  // Slide animations
  slideInUp: {
    from: { opacity: 0, transform: 'translateY(10px)' },
    to: { opacity: 1, transform: 'translateY(0)' },
  },

  slideInDown: {
    from: { opacity: 0, transform: 'translateY(-10px)' },
    to: { opacity: 1, transform: 'translateY(0)' },
  },

  // Bounce animation
  bounce: {
    '0%, 100%': { transform: 'translateY(0)' },
    '50%': { transform: 'translateY(-10px)' },
  },

  // Pulse animation
  pulse: {
    '0%, 100%': { opacity: 1 },
    '50%': { opacity: 0.5 },
  },

  // Spin animation
  spin: {
    from: { transform: 'rotate(0deg)' },
    to: { transform: 'rotate(360deg)' },
  },

  // Game-specific animations
  correctPlacement: {
    '0%': { transform: 'scale(1)', opacity: 1 },
    '50%': { transform: 'scale(1.05)', opacity: 1 },
    '100%': { transform: 'scale(1)', opacity: 1 },
  },

  incorrectShake: {
    '0%, 100%': { transform: 'translateX(0)' },
    '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-4px)' },
    '20%, 40%, 60%, 80%': { transform: 'translateX(4px)' },
  },

  hintPulse: {
    '0%, 100%': { opacity: 1, transform: 'scale(1)' },
    '50%': { opacity: 0.7, transform: 'scale(1.02)' },
  },
} as const;

// Semantic animation configurations
export const semanticAnimations = {
  // Entrance animations
  enter: {
    modal: {
      duration: duration.normal,
      easing: easing.spring.gentle,
      keyframes: animations.scaleIn,
    },
    card: {
      duration: duration.normal,
      easing: easing.easeOut,
      keyframes: animations.fadeIn,
    },
    tooltip: {
      duration: duration.fast,
      easing: easing.easeOut,
      keyframes: animations.slideInUp,
    },
  },

  // Exit animations
  exit: {
    modal: {
      duration: duration.fast,
      easing: easing.easeIn,
      keyframes: animations.scaleOut,
    },
    card: {
      duration: duration.fast,
      easing: easing.easeIn,
      keyframes: animations.fadeOut,
    },
  },

  // Loading animations
  loading: {
    spinner: {
      duration: '1s',
      easing: easing.linear,
      keyframes: animations.spin,
      infinite: true,
    },
    pulse: {
      duration: '2s',
      easing: easing.easeInOut,
      keyframes: animations.pulse,
      infinite: true,
    },
  },

  // Game feedback animations
  feedback: {
    correct: {
      duration: duration.slower,
      easing: easing.bounce,
      keyframes: animations.correctPlacement,
    },
    incorrect: {
      duration: duration.slower,
      easing: easing.linear,
      keyframes: animations.incorrectShake,
    },
    hint: {
      duration: '1.5s',
      easing: easing.easeInOut,
      keyframes: animations.hintPulse,
      infinite: true,
    },
  },

  // Interactive animations
  interactive: {
    tap: {
      duration: duration.faster,
      easing: easing.easeOut,
      scale: 0.97,  // Slight scale down on tap
    },
    hover: {
      duration: duration.fast,
      easing: easing.easeOut,
      scale: 1.02,  // Slight scale up on hover
    },
  },
} as const;

// Reduced motion support
export const reducedMotion = {
  // Replace animations with instant transitions when prefers-reduced-motion is active
  duration: duration.instant,
  easing: easing.linear,
  disable: {
    animations: true,
    transitions: false,  // Keep transitions, just make them instant
  },
} as const;

// Spring physics configurations (for JS-based animations)
export const springConfigs = {
  gentle: {
    stiffness: 200,
    damping: 20,
    mass: 1,
  },

  moderate: {
    stiffness: 300,
    damping: 30,
    mass: 1,
  },

  bouncy: {
    stiffness: 400,
    damping: 25,
    mass: 1,
  },

  stiff: {
    stiffness: 500,
    damping: 35,
    mass: 1,
  },

  // Game-specific springs
  bottomSheet: {
    stiffness: 300,
    damping: 30,
    mass: 1,
  },

  departmentSnap: {
    stiffness: 400,
    damping: 28,
    mass: 1,
  },
} as const;

export type Duration = typeof duration;
export type Easing = typeof easing;
export type Transitions = typeof transitions;
export type Animations = typeof animations;
export type SemanticAnimations = typeof semanticAnimations;
export type SpringConfigs = typeof springConfigs;
