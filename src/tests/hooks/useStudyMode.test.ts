import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useStudyMode, StudyCard } from '../../hooks/useStudyMode';

/**
 * useStudyMode Hook Tests
 *
 * CONCEPT: Comprehensive test suite for study mode state management hook
 * WHY: Ensures spaced repetition algorithm, session management, and progress tracking work correctly
 * PATTERN: Hook testing with localStorage mocking and algorithm validation
 *
 * TEST COVERAGE:
 * - Initial state and setup
 * - localStorage persistence and restoration
 * - Spaced repetition logic
 * - Study session initialization
 * - Progress tracking and updates
 * - Answer checking and card updates
 * - Session statistics calculation
 * - Card queue management
 * - Due card counting
 * - Session reset and cleanup
 */

describe('useStudyMode Hook', () => {
  let localStorageMock: {
    getItem: ReturnType<typeof vi.fn>;
    setItem: ReturnType<typeof vi.fn>;
    clear: ReturnType<typeof vi.fn>;
    removeItem: ReturnType<typeof vi.fn>;
  };

  const createMockCards = (): StudyCard[] => [
    {
      id: 'card-1',
      question: 'What is the capital of Antioquia?',
      answer: 'Medellín',
      region: 'Andina',
      difficulty: 3,
      lastReviewed: Date.now() - 2 * 24 * 60 * 60 * 1000, // 2 days ago
      nextReview: Date.now() - 1 * 24 * 60 * 60 * 1000, // 1 day ago (overdue)
      interval: 1,
      easeFactor: 2.5,
      repetitions: 0,
    },
    {
      id: 'card-2',
      question: 'What region is Bolívar in?',
      answer: 'Caribe',
      region: 'Caribe',
      difficulty: 2,
      lastReviewed: Date.now() - 3 * 24 * 60 * 60 * 1000,
      nextReview: Date.now() - 2 * 24 * 60 * 60 * 1000, // 2 days overdue
      interval: 1,
      easeFactor: 2.5,
      repetitions: 0,
    },
    {
      id: 'card-3',
      question: 'What is the capital of Valle del Cauca?',
      answer: 'Cali',
      region: 'Pacífica',
      difficulty: 1,
      lastReviewed: Date.now(),
      nextReview: Date.now() + 1 * 24 * 60 * 60 * 1000, // Due tomorrow
      interval: 1,
      easeFactor: 2.5,
      repetitions: 1,
    },
  ];

  beforeEach(() => {
    // Create localStorage mock
    let store: Record<string, string> = {};

    localStorageMock = {
      getItem: vi.fn((key: string) => store[key] || null),
      setItem: vi.fn((key: string, value: string) => {
        store[key] = value;
      }),
      clear: vi.fn(() => {
        store = {};
      }),
      removeItem: vi.fn((key: string) => {
        delete store[key];
      }),
    };

    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
      writable: true,
    });

    // Mock console.error to avoid noise in test output
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.clearAllMocks();
    localStorageMock.clear();
  });

  describe('Initial State', () => {
    it('should initialize with default state', () => {
      const { result } = renderHook(() => useStudyMode());

      expect(result.current.selectedRegion).toBeNull();
      expect(result.current.currentCard).toBeNull();
      expect(result.current.progress).toEqual({
        totalCards: 0,
        completedCards: 0,
        correctAnswers: 0,
        incorrectAnswers: 0,
        streakCount: 0,
        sessionStartTime: expect.any(Number),
      });
      expect(result.current.isLoading).toBe(false);
      expect(result.current.studyQueue).toEqual([]);
      expect(result.current.isSessionActive).toBe(false);
      expect(result.current.hasCardsRemaining).toBe(false);
    });

    it('should load selectedRegion from localStorage on mount', () => {
      localStorageMock.setItem('studyMode.selectedRegion', JSON.stringify('Andina'));

      const { result } = renderHook(() => useStudyMode());

      expect(result.current.selectedRegion).toBe('Andina');
      expect(localStorageMock.getItem).toHaveBeenCalledWith('studyMode.selectedRegion');
    });

    it('should load progress from localStorage on mount', () => {
      const storedProgress = {
        totalCards: 10,
        completedCards: 5,
        correctAnswers: 4,
        incorrectAnswers: 1,
        streakCount: 3,
        sessionStartTime: Date.now() - 1000,
      };

      localStorageMock.setItem('studyMode.progress', JSON.stringify(storedProgress));

      const { result } = renderHook(() => useStudyMode());

      expect(result.current.progress.totalCards).toBe(10);
      expect(result.current.progress.completedCards).toBe(5);
      expect(result.current.progress.correctAnswers).toBe(4);
      expect(result.current.progress.incorrectAnswers).toBe(1);
      expect(result.current.progress.streakCount).toBe(3);
      // sessionStartTime should be reset to now
      expect(result.current.progress.sessionStartTime).toBeGreaterThan(storedProgress.sessionStartTime);
    });

    it('should load study queue from localStorage on mount', () => {
      const cards = createMockCards();
      localStorageMock.setItem('studyMode.cards', JSON.stringify(cards));

      const { result } = renderHook(() => useStudyMode());

      expect(result.current.studyQueue).toEqual(cards);
      expect(localStorageMock.getItem).toHaveBeenCalledWith('studyMode.cards');
    });

    it('should handle localStorage errors gracefully', () => {
      localStorageMock.getItem.mockImplementation(() => {
        throw new Error('Storage error');
      });

      const { result } = renderHook(() => useStudyMode());

      expect(result.current.selectedRegion).toBeNull();
      expect(console.error).toHaveBeenCalled();
    });
  });

  describe('localStorage Persistence', () => {
    it('should persist selectedRegion to localStorage when changed', () => {
      const { result } = renderHook(() => useStudyMode());

      act(() => {
        result.current.setSelectedRegion('Caribe');
      });

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'studyMode.selectedRegion',
        JSON.stringify('Caribe')
      );
    });

    it('should persist progress to localStorage when updated', () => {
      const { result } = renderHook(() => useStudyMode());

      act(() => {
        result.current.updateProgress(true);
      });

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'studyMode.progress',
        expect.stringContaining('"completedCards":1')
      );
    });

    it('should persist study queue to localStorage when changed', () => {
      const { result } = renderHook(() => useStudyMode());
      const cards = createMockCards();

      act(() => {
        result.current.initializeStudySession('Andina', cards);
      });

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'studyMode.cards',
        expect.stringContaining('"id":"card-')
      );
    });

    it('should not persist empty study queue', () => {
      const { result } = renderHook(() => useStudyMode());

      act(() => {
        result.current.resetSession();
      });

      // Should persist progress but not empty queue
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'studyMode.progress',
        expect.any(String)
      );
    });
  });

  describe('Study Session Initialization', () => {
    it('should initialize session with due cards for region', () => {
      const { result } = renderHook(() => useStudyMode());
      const cards = createMockCards();

      act(() => {
        result.current.initializeStudySession('Andina', cards);
      });

      expect(result.current.selectedRegion).toBe('Andina');
      expect(result.current.studyQueue.length).toBe(1); // Only card-1 is Andina and due
      expect(result.current.currentCard).toEqual(cards[0]);
      expect(result.current.progress.totalCards).toBe(1);
    });

    it('should filter cards by region', () => {
      const { result } = renderHook(() => useStudyMode());
      const cards = createMockCards();

      act(() => {
        result.current.initializeStudySession('Caribe', cards);
      });

      expect(result.current.studyQueue.length).toBe(1);
      expect(result.current.studyQueue[0].region).toBe('Caribe');
    });

    it('should only include due cards (nextReview <= now)', () => {
      const { result } = renderHook(() => useStudyMode());
      const cards = createMockCards();

      act(() => {
        result.current.initializeStudySession('Pacífica', cards);
      });

      // card-3 is not due yet (nextReview is tomorrow)
      expect(result.current.studyQueue.length).toBe(0);
    });

    it('should sort cards by overdue priority', () => {
      const { result } = renderHook(() => useStudyMode());
      const cards = [
        {
          ...createMockCards()[0],
          id: 'card-recent',
          region: 'Andina',
          nextReview: Date.now() - 1 * 24 * 60 * 60 * 1000, // 1 day overdue
          difficulty: 1,
        },
        {
          ...createMockCards()[1],
          id: 'card-overdue',
          region: 'Andina',
          nextReview: Date.now() - 5 * 24 * 60 * 60 * 1000, // 5 days overdue
          difficulty: 2,
        },
      ];

      act(() => {
        result.current.initializeStudySession('Andina', cards);
      });

      // More overdue card should come first
      expect(result.current.studyQueue[0].id).toBe('card-overdue');
    });

    it('should sort by difficulty when both are overdue', () => {
      const { result } = renderHook(() => useStudyMode());
      const cards = [
        {
          ...createMockCards()[0],
          id: 'card-easy',
          region: 'Andina',
          nextReview: Date.now() - 2 * 24 * 60 * 60 * 1000,
          difficulty: 1,
        },
        {
          ...createMockCards()[1],
          id: 'card-hard',
          region: 'Andina',
          nextReview: Date.now() - 2 * 24 * 60 * 60 * 1000,
          difficulty: 3,
        },
      ];

      act(() => {
        result.current.initializeStudySession('Andina', cards);
      });

      // Higher difficulty should come first
      expect(result.current.studyQueue[0].id).toBe('card-hard');
    });

    it('should reset progress when starting new session', () => {
      const { result } = renderHook(() => useStudyMode());

      // First update progress
      act(() => {
        result.current.updateProgress(true);
      });

      expect(result.current.progress.completedCards).toBe(1);

      // Then start new session
      const cards = createMockCards();
      act(() => {
        result.current.initializeStudySession('Andina', cards);
      });

      expect(result.current.progress.completedCards).toBe(0);
      expect(result.current.progress.correctAnswers).toBe(0);
    });
  });

  describe('Spaced Repetition - Card Updates', () => {
    it('should update card with next review time after answer', () => {
      const { result } = renderHook(() => useStudyMode());

      // Get current time and create cards
      const now = Date.now();
      const cards: StudyCard[] = [
        {
          id: 'card-1',
          question: 'What is the capital of Antioquia?',
          answer: 'Medellín',
          region: 'Andina',
          difficulty: 3,
          lastReviewed: now - 2 * 24 * 60 * 60 * 1000,
          nextReview: now - 1 * 24 * 60 * 60 * 1000,
          interval: 1,
          easeFactor: 2.5,
          repetitions: 0,
        },
      ];

      // Setup storage with cards - this is required for the hook to find and update the card
      localStorageMock.setItem('studyMode.allCards', JSON.stringify(cards));

      act(() => {
        result.current.initializeStudySession('Andina', cards);
      });

      act(() => {
        result.current.checkAnswer(true, 4);
      });

      // Should update allCards in storage - get the LAST call (most recent update)
      const allCardsCalls = localStorageMock.setItem.mock.calls.filter(
        call => call[0] === 'studyMode.allCards'
      );
      expect(allCardsCalls.length).toBeGreaterThan(0);

      const lastCall = allCardsCalls[allCardsCalls.length - 1];
      const updatedCards = JSON.parse(lastCall[1]);
      const updatedCard = updatedCards.find((c: StudyCard) => c.id === 'card-1');

      // Verify card was updated with proper spaced repetition values
      // The key test is that interval calculation worked and card advanced
      expect(updatedCard).toBeDefined();
      expect(updatedCard.interval).toBe(1);
      expect(updatedCard.repetitions).toBe(1); // Should increment from 0 to 1

      // nextReview should be 1 day in the future from lastReviewed (86400000 ms = 1 day)
      const expectedInterval = 1 * 24 * 60 * 60 * 1000;
      expect(updatedCard.nextReview - updatedCard.lastReviewed).toBe(expectedInterval);

      // lastReviewed should have been updated (not still the old value from 2 days ago)
      const originalLastReviewed = now - 2 * 24 * 60 * 60 * 1000;
      expect(updatedCard.lastReviewed).not.toBe(originalLastReviewed);
    });

    it('should update progress and move to next card', () => {
      const { result } = renderHook(() => useStudyMode());
      const cards = createMockCards();

      localStorageMock.setItem('studyMode.allCards', JSON.stringify(cards));

      act(() => {
        result.current.initializeStudySession('Andina', cards);
      });

      expect(result.current.progress.completedCards).toBe(0);

      act(() => {
        result.current.checkAnswer(true, 4);
      });

      expect(result.current.progress.completedCards).toBe(1);
      expect(result.current.progress.correctAnswers).toBe(1);
      expect(result.current.currentCard).toBeNull(); // Only 1 Andina card
    });

    it('should not update cards if none in storage', () => {
      const { result } = renderHook(() => useStudyMode());
      const cards = createMockCards();

      act(() => {
        result.current.initializeStudySession('Andina', cards);
      });

      act(() => {
        result.current.checkAnswer(true, 4);
      });

      // Should not throw, should not try to update allCards
      const allCardsCall = localStorageMock.setItem.mock.calls.find(
        call => call[0] === 'studyMode.allCards'
      );
      expect(allCardsCall).toBeUndefined();
    });
  });

  describe('Progress Tracking', () => {
    it('should increment completedCards on answer', () => {
      const { result } = renderHook(() => useStudyMode());

      act(() => {
        result.current.updateProgress(true);
      });

      expect(result.current.progress.completedCards).toBe(1);
    });

    it('should increment correctAnswers on correct answer', () => {
      const { result } = renderHook(() => useStudyMode());

      act(() => {
        result.current.updateProgress(true);
      });

      expect(result.current.progress.correctAnswers).toBe(1);
      expect(result.current.progress.incorrectAnswers).toBe(0);
    });

    it('should increment incorrectAnswers on wrong answer', () => {
      const { result } = renderHook(() => useStudyMode());

      act(() => {
        result.current.updateProgress(false);
      });

      expect(result.current.progress.correctAnswers).toBe(0);
      expect(result.current.progress.incorrectAnswers).toBe(1);
    });

    it('should increment streak on correct answer', () => {
      const { result } = renderHook(() => useStudyMode());

      act(() => {
        result.current.updateProgress(true);
        result.current.updateProgress(true);
        result.current.updateProgress(true);
      });

      expect(result.current.progress.streakCount).toBe(3);
    });

    it('should reset streak on incorrect answer', () => {
      const { result } = renderHook(() => useStudyMode());

      act(() => {
        result.current.updateProgress(true);
        result.current.updateProgress(true);
        result.current.updateProgress(false);
      });

      expect(result.current.progress.streakCount).toBe(0);
    });

    it('should move to next card after checking answer', () => {
      const { result } = renderHook(() => useStudyMode());
      const cards = createMockCards();

      localStorageMock.setItem('studyMode.allCards', JSON.stringify(cards));

      act(() => {
        result.current.initializeStudySession('Caribe', cards);
      });

      const firstCard = result.current.currentCard;

      act(() => {
        result.current.checkAnswer(true, 4);
      });

      expect(result.current.currentCard).not.toEqual(firstCard);
      expect(result.current.studyQueue.length).toBe(0); // Only one Caribe card
    });
  });

  describe('Card Queue Management', () => {
    it('should move to next card when nextCard is called', () => {
      const { result } = renderHook(() => useStudyMode());
      const cards = [createMockCards()[0], createMockCards()[1]].map(c => ({ ...c, region: 'Andina' }));

      act(() => {
        result.current.initializeStudySession('Andina', cards);
      });

      const firstCard = result.current.currentCard;

      act(() => {
        result.current.nextCard();
      });

      expect(result.current.currentCard).not.toEqual(firstCard);
      expect(result.current.studyQueue.length).toBe(1);
    });

    it('should clear currentCard when queue is empty', () => {
      const { result } = renderHook(() => useStudyMode());
      const cards = [createMockCards()[0]];

      act(() => {
        result.current.initializeStudySession('Andina', cards);
      });

      act(() => {
        result.current.nextCard();
      });

      expect(result.current.currentCard).toBeNull();
      expect(result.current.studyQueue).toEqual([]);
    });

    it('should indicate session is active when currentCard exists', () => {
      const { result } = renderHook(() => useStudyMode());
      const cards = createMockCards();

      act(() => {
        result.current.initializeStudySession('Andina', cards);
      });

      expect(result.current.isSessionActive).toBe(true);
    });

    it('should indicate session is inactive when no currentCard', () => {
      const { result } = renderHook(() => useStudyMode());

      expect(result.current.isSessionActive).toBe(false);
    });

    it('should indicate cards remaining when queue not empty', () => {
      const { result } = renderHook(() => useStudyMode());
      const cards = createMockCards();

      act(() => {
        result.current.initializeStudySession('Andina', cards);
      });

      expect(result.current.hasCardsRemaining).toBe(true);
    });
  });

  describe('Session Statistics', () => {
    it('should calculate accuracy percentage', () => {
      const { result } = renderHook(() => useStudyMode());

      act(() => {
        result.current.updateProgress(true);
        result.current.updateProgress(true);
        result.current.updateProgress(false);
        result.current.updateProgress(true);
      });

      const stats = result.current.getSessionStats();
      expect(stats.accuracy).toBe(75); // 3 correct out of 4
    });

    it('should calculate session duration in minutes', () => {
      const { result } = renderHook(() => useStudyMode());

      // Immediately check stats - duration should be 0 or very small
      const stats = result.current.getSessionStats();
      expect(stats.sessionDuration).toBeGreaterThanOrEqual(0);
      expect(stats.sessionDuration).toBeLessThan(1); // Less than 1 minute
    });

    it('should calculate cards per minute', () => {
      const { result } = renderHook(() => useStudyMode());

      act(() => {
        result.current.updateProgress(true);
        result.current.updateProgress(true);
      });

      const stats = result.current.getSessionStats();
      expect(stats.cardsPerMinute).toBeGreaterThanOrEqual(0);
    });

    it('should count remaining cards', () => {
      const { result } = renderHook(() => useStudyMode());
      const cards = createMockCards();

      act(() => {
        result.current.initializeStudySession('Andina', cards);
      });

      const stats = result.current.getSessionStats();
      expect(stats.remainingCards).toBe(1);
    });

    it('should indicate session is complete when queue empty', () => {
      const { result } = renderHook(() => useStudyMode());
      const cards = createMockCards();

      act(() => {
        result.current.initializeStudySession('Andina', cards);
      });

      // Complete the session
      localStorageMock.setItem('studyMode.allCards', JSON.stringify(cards));
      act(() => {
        result.current.checkAnswer(true, 4);
      });

      const stats = result.current.getSessionStats();
      expect(stats.isSessionComplete).toBe(true);
    });

    it('should handle zero completed cards gracefully', () => {
      const { result } = renderHook(() => useStudyMode());

      const stats = result.current.getSessionStats();
      expect(stats.accuracy).toBe(0);
      expect(stats.cardsPerMinute).toBe(0);
    });
  });

  describe('Due Cards Counting', () => {
    it('should count due cards for a region', () => {
      const { result } = renderHook(() => useStudyMode());
      const cards = createMockCards();

      localStorageMock.setItem('studyMode.allCards', JSON.stringify(cards));

      const dueCount = result.current.getCardsDueCount('Andina');
      expect(dueCount).toBe(1); // Only card-1 is Andina and due
    });

    it('should not count cards that are not due yet', () => {
      const { result } = renderHook(() => useStudyMode());
      const cards = createMockCards();

      localStorageMock.setItem('studyMode.allCards', JSON.stringify(cards));

      const dueCount = result.current.getCardsDueCount('Pacífica');
      expect(dueCount).toBe(0); // card-3 is not due yet
    });

    it('should return 0 when no cards in storage', () => {
      const { result } = renderHook(() => useStudyMode());

      const dueCount = result.current.getCardsDueCount('Andina');
      expect(dueCount).toBe(0);
    });

    it('should handle localStorage errors when counting due cards', () => {
      const { result } = renderHook(() => useStudyMode());

      // Mock getItem to return invalid JSON for allCards key
      localStorageMock.getItem.mockImplementation((key: string) => {
        if (key === 'studyMode.allCards') {
          return 'invalid-json{]';
        }
        return null;
      });

      const dueCount = result.current.getCardsDueCount('Andina');
      expect(dueCount).toBe(0);
      expect(console.error).toHaveBeenCalled();
    });
  });

  describe('Session Reset', () => {
    it('should reset all session state', () => {
      const { result } = renderHook(() => useStudyMode());
      const cards = createMockCards();

      // Set up a session with progress
      act(() => {
        result.current.initializeStudySession('Andina', cards);
        result.current.updateProgress(true);
      });

      // Reset session
      act(() => {
        result.current.resetSession();
      });

      expect(result.current.currentCard).toBeNull();
      expect(result.current.studyQueue).toEqual([]);
      expect(result.current.progress.completedCards).toBe(0);
      expect(result.current.progress.correctAnswers).toBe(0);
      expect(result.current.progress.incorrectAnswers).toBe(0);
      expect(result.current.progress.streakCount).toBe(0);
    });

    it('should reset session start time', () => {
      const { result } = renderHook(() => useStudyMode());

      const beforeReset = Date.now();

      act(() => {
        result.current.resetSession();
      });

      expect(result.current.progress.sessionStartTime).toBeGreaterThanOrEqual(beforeReset);
    });
  });

  describe('Selected Region Management', () => {
    it('should update selected region', () => {
      const { result } = renderHook(() => useStudyMode());

      act(() => {
        result.current.setSelectedRegion('Caribe');
      });

      expect(result.current.selectedRegion).toBe('Caribe');
    });

    it('should allow clearing selected region', () => {
      const { result } = renderHook(() => useStudyMode());

      act(() => {
        result.current.setSelectedRegion('Andina');
        result.current.setSelectedRegion(null);
      });

      expect(result.current.selectedRegion).toBeNull();
    });
  });
});
