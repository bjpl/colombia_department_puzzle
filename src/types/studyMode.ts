/**
 * TypeScript interfaces for Spanish Study Mode Application
 * Comprehensive type definitions for vocabulary learning, spaced repetition,
 * cultural content, and user progress tracking across 5 Spanish regions
 */

// ================================
// REGION AND LOCATION TYPES
// ================================

/**
 * Five Spanish-speaking regions for study focus
 */
export type Region =
  | 'spain'           // Spain (European Spanish)
  | 'mexico'          // Mexico (Mexican Spanish)
  | 'argentina'       // Argentina (Rioplatense Spanish)
  | 'colombia'        // Colombia (Colombian Spanish)
  | 'caribbean';      // Caribbean (Cuban, Dominican, Puerto Rican)

/**
 * Regional configuration and metadata
 */
export interface RegionConfig {
  id: Region;
  name: string;
  flag: string;
  description: string;
  dialectInfo: {
    accent: string;
    uniqueFeatures: string[];
    commonExpressions: string[];
  };
  culturalHighlights: string[];
}

// ================================
// VOCABULARY AND CONTENT TYPES
// ================================

/**
 * Core vocabulary item with regional variations
 */
export interface VocabularyItem {
  id: string;
  word: string;
  translation: string;
  pronunciation: string;
  audioUrl?: string;

  // Regional context
  region: Region;
  regionalVariations?: {
    [key in Region]?: {
      word: string;
      usage: string;
      commonality: 'common' | 'regional' | 'rare';
    };
  };

  // Learning metadata
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  tags: string[];

  // Usage examples
  examples: {
    spanish: string;
    english: string;
    context: string;
  }[];

  // Learning aids
  mnemonics?: string;
  etymology?: string;
  relatedWords: string[];

  // Media
  imageUrl?: string;
  conjugations?: {
    tense: string;
    forms: { [pronoun: string]: string };
  }[];
}

/**
 * Cultural notes and context information
 */
export interface CulturalNote {
  id: string;
  title: string;
  content: string;
  region: Region;
  category: 'tradition' | 'food' | 'history' | 'language' | 'social' | 'geography';

  // Associated vocabulary
  relatedVocabulary: string[]; // VocabularyItem IDs

  // Media content
  imageUrl?: string;
  videoUrl?: string;

  // Difficulty and learning
  readingLevel: 'beginner' | 'intermediate' | 'advanced';
  estimatedReadTime: number; // minutes

  // Interactive elements
  quiz?: {
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
  }[];
}

/**
 * Flash card for spaced repetition system
 */
export interface FlashCard {
  id: string;
  vocabularyItemId: string;

  // Card content
  front: {
    type: 'word' | 'translation' | 'audio' | 'image';
    content: string;
    audioUrl?: string;
    imageUrl?: string;
  };

  back: {
    type: 'word' | 'translation' | 'definition' | 'example';
    content: string;
    additionalInfo?: string[];
  };

  // Card metadata
  cardType: 'recognition' | 'recall' | 'pronunciation' | 'cultural';
  difficulty: number; // 1-5 scale

  // Learning hints
  hints: string[];
  mnemonics?: string;
}

// ================================
// SPACED REPETITION SYSTEM
// ================================

/**
 * Individual review item for spaced repetition
 */
export interface ReviewItem {
  id: string;
  vocabularyItemId: string;
  flashCardId: string;

  // Spaced repetition algorithm data
  easeFactor: number;        // SM-2 algorithm ease factor
  interval: number;          // Days until next review
  repetitions: number;       // Number of successful repetitions
  nextReviewDate: Date;

  // Performance tracking
  totalReviews: number;
  correctReviews: number;
  streakCount: number;
  lastReviewDate?: Date;
  lastScore: number;         // 0-5 performance score

  // Learning state
  learningStage: 'new' | 'learning' | 'review' | 'relearning' | 'graduated';
  isLapsed: boolean;         // Needs relearning

  // Regional focus
  region: Region;
}

/**
 * Review session schedule and configuration
 */
export interface ReviewSchedule {
  id: string;
  userId: string;

  // Schedule settings
  dailyNewCards: number;
  dailyReviewLimit: number;
  maxLearningCards: number;

  // Algorithm settings
  graduatingInterval: number;    // Days to graduate from learning
  easyInterval: number;         // Days for easy cards
  startingEase: number;         // Initial ease factor

  // Session timing
  studyDurationMinutes: number;
  breakIntervalMinutes: number;

  // Content filters
  enabledRegions: Region[];
  enabledCategories: string[];
  difficultyRange: {
    min: 'beginner' | 'intermediate' | 'advanced';
    max: 'beginner' | 'intermediate' | 'advanced';
  };
}

// ================================
// USER PROGRESS AND ACHIEVEMENT
// ================================

/**
 * User progress tracking across all regions and categories
 */
export interface UserProgress {
  userId: string;
  lastUpdated: Date;

  // Overall statistics
  totalWordsLearned: number;
  totalReviewSessions: number;
  totalStudyTimeMinutes: number;
  currentStreak: number;
  longestStreak: number;

  // Regional progress
  regionProgress: {
    [key in Region]: {
      wordsLearned: number;
      averageAccuracy: number;
      totalReviews: number;
      culturalNotesRead: number;
      lastStudied: Date;
      level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
      experiencePoints: number;
    };
  };

  // Category breakdown
  categoryProgress: {
    [category: string]: {
      wordsLearned: number;
      accuracy: number;
      timeSpent: number;
    };
  };

  // Learning velocity
  weeklyGoals: {
    newWords: number;
    reviewAccuracy: number;
    studyMinutes: number;
  };

  // Performance metrics
  averageSessionLength: number;
  retentionRate: number;        // Percentage of words retained
  masteryLevel: number;         // Overall proficiency 0-100
}

/**
 * Achievement system for gamification
 */
export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;

  // Achievement criteria
  type: 'milestone' | 'streak' | 'accuracy' | 'region' | 'cultural' | 'speed';
  criteria: {
    target: number;
    metric: string;           // e.g., 'wordsLearned', 'streakDays', 'accuracy'
    region?: Region;
    timeframe?: 'daily' | 'weekly' | 'monthly' | 'allTime';
  };

  // Rewards
  experiencePoints: number;
  badgeColor: 'bronze' | 'silver' | 'gold' | 'platinum';
  unlocksFeature?: string;

  // Progress tracking
  isUnlocked: boolean;
  unlockedDate?: Date;
  progress: number;           // 0-100 percentage toward achievement
}

// ================================
// PRACTICE SESSIONS AND MODES
// ================================

/**
 * Practice session configuration and results
 */
export interface PracticeSession {
  id: string;
  userId: string;
  startTime: Date;
  endTime?: Date;
  duration?: number;          // milliseconds

  // Session configuration
  mode: PracticeMode;
  region: Region;
  targetWordCount: number;
  difficultyLevel: 'beginner' | 'intermediate' | 'advanced' | 'mixed';

  // Content included
  vocabularyItems: string[];  // VocabularyItem IDs
  flashCards: string[];       // FlashCard IDs
  culturalNotes: string[];    // CulturalNote IDs

  // Performance results
  results?: SessionResults;

  // Session state
  currentCardIndex: number;
  completedCards: string[];
  skippedCards: string[];

  // Settings
  audioEnabled: boolean;
  hintsEnabled: boolean;
  timerEnabled: boolean;
  showProgressBar: boolean;
}

/**
 * Different practice modes available
 */
export type PracticeMode =
  | 'flashcards'              // Traditional flashcard review
  | 'spacedRepetition'        // Algorithm-based review
  | 'quickReview'             // Fast-paced recognition
  | 'pronunciation'           // Audio-focused practice
  | 'cultural'                // Cultural context learning
  | 'mixed'                   // Combined mode
  | 'assessment'              // Progress testing
  | 'challenge';              // Timed challenges

/**
 * Session performance results
 */
export interface SessionResults {
  totalCards: number;
  correctAnswers: number;
  incorrectAnswers: number;
  skippedCards: number;

  // Timing
  averageResponseTime: number; // milliseconds
  totalTime: number;          // milliseconds

  // Accuracy breakdown
  accuracyByDifficulty: {
    beginner: number;
    intermediate: number;
    advanced: number;
  };

  accuracyByCategory: {
    [category: string]: number;
  };

  // Learning insights
  strugglingWords: string[];   // VocabularyItem IDs with low performance
  masteredWords: string[];     // VocabularyItem IDs with high performance
  recommendedReview: string[]; // VocabularyItem IDs to review soon

  // Experience gained
  experiencePoints: number;
  newAchievements: string[];   // Achievement IDs unlocked

  // Next session recommendations
  suggestedMode: PracticeMode;
  suggestedRegion: Region;
  suggestedDifficulty: 'beginner' | 'intermediate' | 'advanced';
}

// ================================
// STUDY STATISTICS AND ANALYTICS
// ================================

/**
 * Detailed learning analytics
 */
export interface StudyAnalytics {
  userId: string;
  generatedAt: Date;
  timeframe: 'daily' | 'weekly' | 'monthly' | 'yearly' | 'allTime';

  // Time-based metrics
  studyTimeByDay: { [date: string]: number };
  sessionCountByDay: { [date: string]: number };
  averageSessionLength: number;

  // Performance trends
  accuracyTrend: { date: string; accuracy: number }[];
  vocabularyGrowth: { date: string; totalWords: number }[];
  retentionRate: { date: string; rate: number }[];

  // Regional breakdown
  regionStatistics: {
    [key in Region]: {
      timeSpent: number;
      wordsLearned: number;
      averageAccuracy: number;
      preferenceScore: number; // User's affinity for this region
    };
  };

  // Learning patterns
  peakPerformanceHours: number[]; // Hours of day with best performance
  difficultyCurve: {
    beginner: { accuracy: number; timeSpent: number };
    intermediate: { accuracy: number; timeSpent: number };
    advanced: { accuracy: number; timeSpent: number };
  };

  // Predictions and recommendations
  projectedMastery: {
    region: Region;
    estimatedDays: number;
    confidence: number;
  }[];

  recommendedStudyPlan: {
    dailyMinutes: number;
    focusRegions: Region[];
    priorityCategories: string[];
    suggestedModes: PracticeMode[];
  };
}

// ================================
// USER PREFERENCES AND SETTINGS
// ================================

/**
 * User preferences and learning settings
 */
export interface UserSettings {
  userId: string;

  // Learning preferences
  preferredRegions: Region[];
  nativeLanguage: string;
  learningGoals: ('vocabulary' | 'pronunciation' | 'culture' | 'conversation')[];

  // Interface settings
  theme: 'light' | 'dark' | 'auto';
  language: string;           // UI language
  fontSize: 'small' | 'medium' | 'large';
  animations: boolean;
  soundEffects: boolean;

  // Study preferences
  autoPlay: boolean;          // Auto-play audio
  showHints: boolean;
  timerVisible: boolean;
  progressVisible: boolean;

  // Notification settings
  studyReminders: boolean;
  reminderTime: string;       // HH:MM format
  weeklyGoalReminders: boolean;
  achievementNotifications: boolean;

  // Privacy settings
  shareProgress: boolean;
  analyticsOptIn: boolean;

  // Accessibility
  highContrast: boolean;
  reducedMotion: boolean;
  screenReaderSupport: boolean;
  keyboardNavigation: boolean;
}

// ================================
// API RESPONSE TYPES
// ================================

/**
 * API response wrapper for consistent error handling
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  timestamp: Date;
}

/**
 * Paginated response for large data sets
 */
export interface PaginatedResponse<T> {
  items: T[];
  totalItems: number;
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

// ================================
// EXPORT ALL TYPES
// ================================

// Re-export all types for easy importing in React components
export type {
  Region,
  RegionConfig,
  VocabularyItem,
  CulturalNote,
  FlashCard,
  ReviewItem,
  ReviewSchedule,
  UserProgress,
  Achievement,
  PracticeSession,
  PracticeMode,
  SessionResults,
  StudyAnalytics,
  UserSettings,
  ApiResponse,
  PaginatedResponse
};

// Utility type helpers
export type RegionKey = keyof typeof Region;
export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';
export type LearningStage = 'new' | 'learning' | 'review' | 'relearning' | 'graduated';
export type AchievementType = 'milestone' | 'streak' | 'accuracy' | 'region' | 'cultural' | 'speed';
export type BadgeColor = 'bronze' | 'silver' | 'gold' | 'platinum';

// Default values and constants
export const DEFAULT_REGIONS: Region[] = ['spain', 'mexico', 'argentina', 'colombia', 'caribbean'];
export const DEFAULT_DIFFICULTY_LEVELS: DifficultyLevel[] = ['beginner', 'intermediate', 'advanced'];
export const DEFAULT_PRACTICE_MODES: PracticeMode[] = [
  'flashcards', 'spacedRepetition', 'quickReview', 'pronunciation', 'cultural', 'mixed'
];

// Type guards for runtime type checking
export const isRegion = (value: string): value is Region => {
  return DEFAULT_REGIONS.includes(value as Region);
};

export const isDifficultyLevel = (value: string): value is DifficultyLevel => {
  return DEFAULT_DIFFICULTY_LEVELS.includes(value as DifficultyLevel);
};

export const isPracticeMode = (value: string): value is PracticeMode => {
  return DEFAULT_PRACTICE_MODES.includes(value as PracticeMode);
};