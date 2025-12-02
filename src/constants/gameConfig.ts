/**
 * Game Configuration Constants
 *
 * Centralizes all magic numbers and configuration values used throughout the game.
 * Extracted from GameContainer.tsx, GameContext.tsx, and other components.
 *
 * SPARC: Refinement phase - Extract magic numbers to named constants
 */

/**
 * Scoring configuration
 */
export const SCORING = {
  /** Base points awarded for correct placement */
  basePoints: 100,
  /** Points deducted per incorrect attempt */
  attemptPenalty: 10,
  /** Minimum points possible for a placement */
  minPoints: 10,
  /** Points deducted when using a hint */
  hintPenalty: 50,
  /** Bonus multiplier for streak placements */
  streakMultiplier: 1.5,
  /** Minimum streak for bonus activation */
  streakThreshold: 3,
} as const;

/**
 * Hint system configuration
 */
export const HINTS = {
  /** Default hints for standard mode */
  standard: 3,
  /** Hints for progression/learning mode */
  progression: 5,
  /** Hints for unlimited/practice mode */
  unlimited: Infinity,
  /** Cooldown between hints in milliseconds */
  cooldownMs: 2000,
} as const;

/**
 * Interaction thresholds
 */
export const INTERACTION = {
  /** Minimum drag distance to register as a drag (not click) */
  dragThresholdPx: 5,
  /** WCAG 2.5.5 AAA: Minimum touch target size */
  touchTargetMinPx: 44,
  /** Material Design recommended touch target */
  touchTargetRecommendedPx: 48,
  /** Minimum spacing between touch targets */
  touchSpacingPx: 16,
  /** Double-tap detection window */
  doubleTapWindowMs: 300,
  /** Long press detection threshold */
  longPressThresholdMs: 500,
} as const;

/**
 * Timing configuration (all in milliseconds)
 */
export const TIMING = {
  /** Brief delay for state reset before re-trigger (feedback, etc.) */
  feedbackResetDelayMs: 10,
  /** Standard transition duration */
  transitionMs: 300,
  /** Mode transition animation duration */
  modeTransitionMs: 500,
  /** Debounce time for window resize */
  debounceResizeMs: 150,
  /** Debounce time for scroll events */
  debounceScrollMs: 100,
  /** Auto-save interval */
  autoSaveIntervalMs: 30000,
  /** Toast/notification display duration */
  toastDurationMs: 3000,
  /** Animation frame budget at 60fps */
  frameBudgetMs: 16.67,
} as const;

/**
 * Layout dimensions
 */
export const LAYOUT = {
  /** Desktop sidebar width */
  sidebarWidthPx: 208,
  /** Minimum map canvas height */
  minMapHeightPx: 600,
  /** Maximum content width */
  maxContentWidthPx: 1400,
  /** Header height offset for viewport calculations */
  headerOffsetPx: 140,
  /** Mobile bottom sheet peek height */
  bottomSheetPeekPx: 120,
  /** Mobile bottom sheet expanded height percentage */
  bottomSheetExpandedPct: 0.7,
} as const;

/**
 * Game modes configuration
 */
export const GAME_MODES = {
  standard: {
    id: 'standard',
    hints: HINTS.standard,
    timerEnabled: true,
    showRegions: false,
  },
  learning: {
    id: 'learning',
    hints: HINTS.progression,
    timerEnabled: false,
    showRegions: true,
  },
  challenge: {
    id: 'challenge',
    hints: 0,
    timerEnabled: true,
    showRegions: false,
  },
  practice: {
    id: 'practice',
    hints: HINTS.unlimited,
    timerEnabled: false,
    showRegions: true,
  },
} as const;

/**
 * Animation configuration
 */
export const ANIMATIONS = {
  /** Standard easing for most animations */
  standardEasing: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
  /** Deceleration easing for entering elements */
  decelerateEasing: 'cubic-bezier(0.0, 0.0, 0.2, 1)',
  /** Acceleration easing for exiting elements */
  accelerateEasing: 'cubic-bezier(0.4, 0.0, 1, 1)',
  /** Spring tension for physics-based animations */
  springTension: 170,
  /** Spring friction for physics-based animations */
  springFriction: 26,
} as const;

/**
 * Accessibility configuration
 */
export const A11Y = {
  /** Minimum contrast ratio for WCAG AA */
  minContrastAA: 4.5,
  /** Minimum contrast ratio for WCAG AAA */
  minContrastAAA: 7,
  /** Focus ring width */
  focusRingWidthPx: 3,
  /** Focus ring offset */
  focusRingOffsetPx: 2,
  /** Reduced motion preference check */
  reducedMotionQuery: '(prefers-reduced-motion: reduce)',
} as const;

/**
 * Sound configuration
 */
export const SOUND = {
  /** Default volume for sound effects (0-1) */
  defaultVolume: 0.5,
  /** Pickup sound volume multiplier */
  pickupVolumeMultiplier: 0.5,
  /** Master volume key for localStorage */
  volumeStorageKey: 'colombia-puzzle-volume',
  /** Mute state key for localStorage */
  muteStorageKey: 'colombia-puzzle-muted',
} as const;

/**
 * Storage keys for localStorage/sessionStorage
 */
export const STORAGE_KEYS = {
  gameState: 'colombia-puzzle-state',
  userPreferences: 'colombia-puzzle-prefs',
  tutorialCompleted: 'colombia-puzzle-tutorial',
  highScores: 'colombia-puzzle-scores',
  achievements: 'colombia-puzzle-achievements',
} as const;

/**
 * Department/Region counts
 */
export const DEPARTMENT_COUNTS = {
  /** Total departments in Colombia */
  total: 33,
  /** Departments in Andina region */
  andina: 13,
  /** Departments in Caribe region */
  caribe: 8,
  /** Departments in Pacífica region */
  pacifica: 4,
  /** Departments in Orinoquía region */
  orinoquia: 4,
  /** Departments in Amazonía region */
  amazonia: 4,
  /** Departments in Insular region (San Andrés y Providencia counts as 1) */
  insular: 1,
} as const;

/**
 * Z-index layers (re-exported from mobileConstants for convenience)
 */
export const Z_LAYERS = {
  base: 0,
  dropdown: 1000,
  sticky: 1100,
  fixed: 1200,
  modalBackdrop: 1300,
  modal: 1400,
  popover: 1500,
  tooltip: 1600,
  toast: 1700,
  dragOverlay: 1800,
  max: 9999,
} as const;

/**
 * Export grouped config object for convenience
 */
export const GAME_CONFIG = {
  scoring: SCORING,
  hints: HINTS,
  interaction: INTERACTION,
  timing: TIMING,
  layout: LAYOUT,
  gameModes: GAME_MODES,
  animations: ANIMATIONS,
  a11y: A11Y,
  sound: SOUND,
  storage: STORAGE_KEYS,
  departments: DEPARTMENT_COUNTS,
  zIndex: Z_LAYERS,
} as const;

export default GAME_CONFIG;
