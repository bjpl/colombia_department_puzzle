import { useState, useEffect, useCallback } from 'react';

// Types for study mode functionality
export interface StudyCard {
  id: string;
  question: string;
  answer: string;
  region: string;
  difficulty: number;
  lastReviewed: number;
  nextReview: number;
  interval: number;
  easeFactor: number;
  repetitions: number;
}

export interface StudyProgress {
  totalCards: number;
  completedCards: number;
  correctAnswers: number;
  incorrectAnswers: number;
  streakCount: number;
  sessionStartTime: number;
}

export interface StudyModeState {
  selectedRegion: string | null;
  currentCard: StudyCard | null;
  progress: StudyProgress;
  isLoading: boolean;
  studyQueue: StudyCard[];
}

// Spaced repetition algorithm constants
const EASE_FACTOR_MIN = 1.3;
const EASE_FACTOR_MAX = 2.5;
const INITIAL_EASE_FACTOR = 2.5;
const INITIAL_INTERVAL = 1; // days

export const useStudyMode = () => {
  const [state, setState] = useState<StudyModeState>({
    selectedRegion: null,
    currentCard: null,
    progress: {
      totalCards: 0,
      completedCards: 0,
      correctAnswers: 0,
      incorrectAnswers: 0,
      streakCount: 0,
      sessionStartTime: Date.now(),
    },
    isLoading: false,
    studyQueue: [],
  });

  // Load state from localStorage on mount
  useEffect(() => {
    const loadStoredData = () => {
      try {
        const storedRegion = localStorage.getItem('studyMode.selectedRegion');
        const storedProgress = localStorage.getItem('studyMode.progress');
        const storedCards = localStorage.getItem('studyMode.cards');

        setState(prevState => ({
          ...prevState,
          selectedRegion: storedRegion ? JSON.parse(storedRegion) : null,
          progress: storedProgress ? {
            ...JSON.parse(storedProgress),
            sessionStartTime: Date.now(), // Reset session time
          } : prevState.progress,
          studyQueue: storedCards ? JSON.parse(storedCards) : [],
        }));
      } catch (error) {
        console.error('Error loading study mode data from localStorage:', error);
      }
    };

    loadStoredData();
  }, []);

  // Persist state changes to localStorage
  useEffect(() => {
    if (state.selectedRegion !== null) {
      localStorage.setItem('studyMode.selectedRegion', JSON.stringify(state.selectedRegion));
    }
  }, [state.selectedRegion]);

  useEffect(() => {
    localStorage.setItem('studyMode.progress', JSON.stringify(state.progress));
  }, [state.progress]);

  useEffect(() => {
    if (state.studyQueue.length > 0) {
      localStorage.setItem('studyMode.cards', JSON.stringify(state.studyQueue));
    }
  }, [state.studyQueue]);

  // Spaced repetition algorithm implementation
  const calculateNextInterval = useCallback((
    quality: number, // 0-5 scale (0 = complete blackout, 5 = perfect response)
    interval: number,
    easeFactor: number,
    repetitions: number
  ): { newInterval: number; newEaseFactor: number; newRepetitions: number } => {
    let newEaseFactor = easeFactor;
    let newRepetitions = repetitions;
    let newInterval = interval;

    if (quality >= 3) {
      // Correct answer
      if (repetitions === 0) {
        newInterval = 1;
      } else if (repetitions === 1) {
        newInterval = 6;
      } else {
        newInterval = Math.round(interval * easeFactor);
      }
      newRepetitions = repetitions + 1;
    } else {
      // Incorrect answer - reset
      newRepetitions = 0;
      newInterval = 1;
    }

    // Update ease factor
    newEaseFactor = easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
    newEaseFactor = Math.max(EASE_FACTOR_MIN, Math.min(EASE_FACTOR_MAX, newEaseFactor));

    return { newInterval, newEaseFactor, newRepetitions };
  }, []);

  // Initialize study session for a region
  const initializeStudySession = useCallback((region: string, cards: StudyCard[]) => {
    const now = Date.now();
    const dueCards = cards.filter(card =>
      card.region === region && card.nextReview <= now
    );

    // Sort by priority (overdue cards first, then by difficulty)
    const sortedCards = dueCards.sort((a, b) => {
      const overdueDiffA = now - a.nextReview;
      const overdueDiffB = now - b.nextReview;

      if (overdueDiffA > 0 && overdueDiffB <= 0) return -1;
      if (overdueDiffB > 0 && overdueDiffA <= 0) return 1;

      return b.difficulty - a.difficulty; // Higher difficulty first
    });

    setState(prevState => ({
      ...prevState,
      selectedRegion: region,
      studyQueue: sortedCards,
      currentCard: sortedCards[0] || null,
      progress: {
        totalCards: sortedCards.length,
        completedCards: 0,
        correctAnswers: 0,
        incorrectAnswers: 0,
        streakCount: 0,
        sessionStartTime: now,
      },
    }));
  }, []);

  // Update progress and handle card completion
  const updateProgress = useCallback((isCorrect: boolean) => {
    setState(prevState => ({
      ...prevState,
      progress: {
        ...prevState.progress,
        completedCards: prevState.progress.completedCards + 1,
        correctAnswers: isCorrect
          ? prevState.progress.correctAnswers + 1
          : prevState.progress.correctAnswers,
        incorrectAnswers: !isCorrect
          ? prevState.progress.incorrectAnswers + 1
          : prevState.progress.incorrectAnswers,
        streakCount: isCorrect
          ? prevState.progress.streakCount + 1
          : 0,
      },
    }));
  }, []);

  // Process answer and update card using spaced repetition
  const checkAnswer = useCallback((isCorrect: boolean, quality: number = isCorrect ? 4 : 1) => {
    if (!state.currentCard) return;

    const now = Date.now();
    const { newInterval, newEaseFactor, newRepetitions } = calculateNextInterval(
      quality,
      state.currentCard.interval,
      state.currentCard.easeFactor,
      state.currentCard.repetitions
    );

    const updatedCard: StudyCard = {
      ...state.currentCard,
      lastReviewed: now,
      nextReview: now + (newInterval * 24 * 60 * 60 * 1000), // Convert days to milliseconds
      interval: newInterval,
      easeFactor: newEaseFactor,
      repetitions: newRepetitions,
    };

    // Update progress
    updateProgress(isCorrect);

    // Remove current card from queue and update it in storage
    const updatedQueue = state.studyQueue.slice(1);

    setState(prevState => ({
      ...prevState,
      studyQueue: updatedQueue,
      currentCard: updatedQueue[0] || null,
    }));

    // Store updated card (in a real app, this would sync with a database)
    const storedCards = localStorage.getItem('studyMode.allCards');
    if (storedCards) {
      try {
        const allCards: StudyCard[] = JSON.parse(storedCards);
        const cardIndex = allCards.findIndex(card => card.id === updatedCard.id);
        if (cardIndex !== -1) {
          allCards[cardIndex] = updatedCard;
          localStorage.setItem('studyMode.allCards', JSON.stringify(allCards));
        }
      } catch (error) {
        console.error('Error updating card in storage:', error);
      }
    }
  }, [state.currentCard, state.studyQueue, calculateNextInterval, updateProgress]);

  // Move to next card without answering (skip)
  const nextCard = useCallback(() => {
    if (state.studyQueue.length <= 1) {
      setState(prevState => ({
        ...prevState,
        currentCard: null,
        studyQueue: [],
      }));
      return;
    }

    const updatedQueue = state.studyQueue.slice(1);
    setState(prevState => ({
      ...prevState,
      studyQueue: updatedQueue,
      currentCard: updatedQueue[0],
    }));
  }, [state.studyQueue]);

  // Reset study session
  const resetSession = useCallback(() => {
    setState(prevState => ({
      ...prevState,
      currentCard: null,
      studyQueue: [],
      progress: {
        totalCards: 0,
        completedCards: 0,
        correctAnswers: 0,
        incorrectAnswers: 0,
        streakCount: 0,
        sessionStartTime: Date.now(),
      },
    }));
  }, []);

  // Set selected region
  const setSelectedRegion = useCallback((region: string | null) => {
    setState(prevState => ({
      ...prevState,
      selectedRegion: region,
    }));
  }, []);

  // Calculate session statistics
  const getSessionStats = useCallback(() => {
    const { progress } = state;
    const sessionDuration = Date.now() - progress.sessionStartTime;
    const accuracy = progress.completedCards > 0
      ? (progress.correctAnswers / progress.completedCards) * 100
      : 0;

    return {
      accuracy: Math.round(accuracy),
      sessionDuration: Math.round(sessionDuration / 1000 / 60), // minutes
      cardsPerMinute: sessionDuration > 0
        ? Math.round((progress.completedCards / (sessionDuration / 1000 / 60)) * 10) / 10
        : 0,
      remainingCards: state.studyQueue.length,
      isSessionComplete: state.studyQueue.length === 0 && progress.totalCards > 0,
    };
  }, [state]);

  // Check if there are cards due for review
  const getCardsDueCount = useCallback((region: string): number => {
    const storedCards = localStorage.getItem('studyMode.allCards');
    if (!storedCards) return 0;

    try {
      const allCards: StudyCard[] = JSON.parse(storedCards);
      const now = Date.now();
      return allCards.filter(card =>
        card.region === region && card.nextReview <= now
      ).length;
    } catch (error) {
      console.error('Error getting due cards count:', error);
      return 0;
    }
  }, []);

  return {
    // State
    selectedRegion: state.selectedRegion,
    currentCard: state.currentCard,
    progress: state.progress,
    isLoading: state.isLoading,
    studyQueue: state.studyQueue,

    // Actions
    initializeStudySession,
    updateProgress,
    checkAnswer,
    nextCard,
    resetSession,
    setSelectedRegion,

    // Computed values
    getSessionStats,
    getCardsDueCount,

    // Utilities
    isSessionActive: state.currentCard !== null,
    hasCardsRemaining: state.studyQueue.length > 0,
  };
};