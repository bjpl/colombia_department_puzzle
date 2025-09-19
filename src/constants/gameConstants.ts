// Game Configuration Constants

// Scoring
export const SCORING = {
  BASE_POINTS: 100,
  PENALTY_PER_ATTEMPT: 10,
  MIN_POINTS: 10,
  HINT_COSTS: {
    REGION: 10,
    LETTER: 20,
    FLASH: 50,
  },
  ACHIEVEMENTS: {
    HIGH_SCORE: 3000,
    SPEED_RUN_SECONDS: 300, // 5 minutes
  },
} as const;

// Timing
export const TIMING = {
  HINT_DURATION_MS: 5000,
  FLASH_DURATION_MS: 3000,
  FEEDBACK_DURATION_MS: 2000,
  TUTORIAL_TRANSITION_MS: 300,
  ANIMATION_DURATION_MS: 500,
} as const;

// Map Configuration
export const MAP = {
  DEFAULT_ZOOM: 1,
  MAX_ZOOM: 4,
  MIN_ZOOM: 0.5,
  ZOOM_STEP: 0.25,
  PAN_STEP: 50,
  SVG_WIDTH: 800,
  SVG_HEIGHT: 600,
} as const;

// Department Regions
export const REGIONS = {
  ANDINA: 'Andina',
  CARIBE: 'Caribe',
  PACIFICA: 'Pacífica',
  ORINOQUIA: 'Orinoquía',
  AMAZONIA: 'Amazonía',
  INSULAR: 'Insular',
} as const;

// Region Colors
export const REGION_COLORS = {
  [REGIONS.ANDINA]: { bg: 'bg-green-100', border: 'border-green-400' },
  [REGIONS.CARIBE]: { bg: 'bg-blue-100', border: 'border-blue-400' },
  [REGIONS.PACIFICA]: { bg: 'bg-purple-100', border: 'border-purple-400' },
  [REGIONS.ORINOQUIA]: { bg: 'bg-yellow-100', border: 'border-yellow-400' },
  [REGIONS.AMAZONIA]: { bg: 'bg-emerald-100', border: 'border-emerald-400' },
  [REGIONS.INSULAR]: { bg: 'bg-cyan-100', border: 'border-cyan-400' },
} as const;

// Storage Keys
export const STORAGE_KEYS = {
  PROFILES: 'colombia_puzzle_profiles',
  ACTIVE_PROFILE: 'colombia_puzzle_active_profile',
  SESSIONS: 'colombia_puzzle_sessions',
  SETTINGS: 'colombia_puzzle_settings',
} as const;

// Game Settings
export const DEFAULT_SETTINGS = {
  soundEnabled: true,
  musicEnabled: true,
  animations: true,
  difficulty: 'normal',
  language: 'es',
  tutorialShown: false,
} as const;

// Layout
export const LAYOUT = {
  MAX_WIDTH: '1400px',
  SIDEBAR_WIDTH: '13rem', // w-52
  HEADER_HEIGHT: '140px',
  MODAL_MAX_HEIGHT: '90vh',
} as const;

// Tutorial Steps
export const TUTORIAL_STEPS_COUNT = 8;

// Department Count
export const TOTAL_DEPARTMENTS = 33;

// Z-Index Layers
export const Z_INDEX = {
  MAP: 0,
  DRAGGING: 10,
  HINTS: 20,
  MODALS: 50,
  ERROR_BOUNDARY: 100,
} as const;