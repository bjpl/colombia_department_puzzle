import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useGameTimer } from '../../hooks/useGameTimer';

describe('useGameTimer', () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
  });

  describe('Initial State', () => {
    it('should initialize with default values', () => {
      const { result } = renderHook(() => useGameTimer());

      expect(result.current.elapsedTime).toBe(0);
      expect(result.current.isRunning).toBe(false);
      expect(result.current.isPaused).toBe(false);
    });
  });

  describe('Timer Control', () => {
    it('should start timer and update elapsed time', async () => {
      const { result } = renderHook(() => useGameTimer());

      act(() => {
        result.current.startTimer();
      });

      expect(result.current.isRunning).toBe(true);
      expect(result.current.isPaused).toBe(false);

      // Advance time by 3 seconds and run pending timers
      await act(async () => {
        vi.advanceTimersByTime(3000);
      });

      expect(result.current.elapsedTime).toBe(3);
    });

    it('should pause timer correctly', async () => {
      const { result } = renderHook(() => useGameTimer());

      act(() => {
        result.current.startTimer();
      });

      // Advance time by 2 seconds
      await act(async () => {
        vi.advanceTimersByTime(2000);
      });

      expect(result.current.elapsedTime).toBe(2);

      act(() => {
        result.current.pauseTimer();
      });

      expect(result.current.isPaused).toBe(true);
      expect(result.current.isRunning).toBe(true);

      // Advance time by 5 more seconds while paused
      await act(async () => {
        vi.advanceTimersByTime(5000);
      });

      // Time should not advance while paused
      expect(result.current.elapsedTime).toBe(2);
    });

    it('should resume timer after pause', async () => {
      const { result } = renderHook(() => useGameTimer());

      // Start and run for 2 seconds
      act(() => {
        result.current.startTimer();
      });

      await act(async () => {
        vi.advanceTimersByTime(2000);
      });

      expect(result.current.elapsedTime).toBe(2);

      // Pause
      act(() => {
        result.current.pauseTimer();
      });

      // Resume
      act(() => {
        result.current.resumeTimer();
      });

      expect(result.current.isPaused).toBe(false);
      expect(result.current.isRunning).toBe(true);

      // Advance 3 more seconds
      await act(async () => {
        vi.advanceTimersByTime(3000);
      });

      expect(result.current.elapsedTime).toBe(5);
    });

    it('should stop timer and keep elapsed time', async () => {
      const { result } = renderHook(() => useGameTimer());

      act(() => {
        result.current.startTimer();
      });

      await act(async () => {
        vi.advanceTimersByTime(5000);
      });

      expect(result.current.elapsedTime).toBe(5);

      act(() => {
        result.current.stopTimer();
      });

      expect(result.current.isRunning).toBe(false);
      expect(result.current.isPaused).toBe(false);
      // Elapsed time should be preserved
      expect(result.current.elapsedTime).toBe(5);
    });

    it('should reset timer to initial state', async () => {
      const { result } = renderHook(() => useGameTimer());

      act(() => {
        result.current.startTimer();
      });

      await act(async () => {
        vi.advanceTimersByTime(10000);
      });

      expect(result.current.elapsedTime).toBe(10);

      act(() => {
        result.current.resetTimer();
      });

      expect(result.current.elapsedTime).toBe(0);
      expect(result.current.isRunning).toBe(false);
      expect(result.current.isPaused).toBe(false);
    });
  });

  describe('Time Formatting', () => {
    it('should format time correctly for seconds < 60', () => {
      const { result } = renderHook(() => useGameTimer());

      expect(result.current.formatTime(0)).toBe('0:00');
      expect(result.current.formatTime(5)).toBe('0:05');
      expect(result.current.formatTime(45)).toBe('0:45');
      expect(result.current.formatTime(59)).toBe('0:59');
    });

    it('should format time correctly for minutes', () => {
      const { result } = renderHook(() => useGameTimer());

      expect(result.current.formatTime(60)).toBe('1:00');
      expect(result.current.formatTime(65)).toBe('1:05');
      expect(result.current.formatTime(125)).toBe('2:05');
      expect(result.current.formatTime(599)).toBe('9:59');
    });

    it('should format time correctly for large values', () => {
      const { result } = renderHook(() => useGameTimer());

      expect(result.current.formatTime(3600)).toBe('60:00');
      expect(result.current.formatTime(3661)).toBe('61:01');
    });
  });

  describe('Edge Cases', () => {
    it('should not start timer if already running', async () => {
      const { result } = renderHook(() => useGameTimer());

      act(() => {
        result.current.startTimer();
      });

      await act(async () => {
        vi.advanceTimersByTime(2000);
      });

      expect(result.current.elapsedTime).toBe(2);

      // Try to start again
      act(() => {
        result.current.startTimer();
      });

      // Should not reset the timer
      expect(result.current.elapsedTime).toBe(2);
    });

    it('should not pause if not running', () => {
      const { result } = renderHook(() => useGameTimer());

      act(() => {
        result.current.pauseTimer();
      });

      expect(result.current.isPaused).toBe(false);
    });

    it('should not pause if already paused', async () => {
      const { result } = renderHook(() => useGameTimer());

      act(() => {
        result.current.startTimer();
      });

      await act(async () => {
        vi.advanceTimersByTime(2000);
      });

      expect(result.current.elapsedTime).toBe(2);

      act(() => {
        result.current.pauseTimer();
      });

      expect(result.current.isPaused).toBe(true);

      // Try to pause again
      act(() => {
        result.current.pauseTimer();
      });

      // Should still be paused but not change elapsed time
      expect(result.current.isPaused).toBe(true);
      expect(result.current.elapsedTime).toBe(2);
    });

    it('should clean up interval on unmount', async () => {
      const { result, unmount } = renderHook(() => useGameTimer());

      act(() => {
        result.current.startTimer();
      });

      await act(async () => {
        vi.advanceTimersByTime(2000);
      });

      expect(result.current.elapsedTime).toBe(2);
      expect(result.current.isRunning).toBe(true);

      // Unmount should clean up the interval (verified by no errors/warnings)
      unmount();

      // No assertions after unmount - the hook cleanup is verified by no errors
    });
  });

  describe('Pause/Resume Flow', () => {
    it('should handle multiple pause/resume cycles', async () => {
      const { result } = renderHook(() => useGameTimer());

      // Start
      await act(async () => {
        result.current.startTimer();
        vi.advanceTimersByTime(0); // Process the start
      });

      // Run for 2 seconds
      await act(async () => {
        vi.advanceTimersByTime(2000);
      });

      expect(result.current.elapsedTime).toBeGreaterThanOrEqual(2);

      // First pause
      act(() => {
        result.current.pauseTimer();
      });

      // Resume
      act(() => {
        result.current.resumeTimer();
      });

      // Run for 3 more seconds
      await act(async () => {
        vi.advanceTimersByTime(3000);
      });

      expect(result.current.elapsedTime).toBe(5);

      // Second pause
      act(() => {
        result.current.pauseTimer();
      });

      // Resume
      act(() => {
        result.current.resumeTimer();
      });

      // Run for 2 more seconds
      await act(async () => {
        vi.advanceTimersByTime(2000);
      });

      expect(result.current.elapsedTime).toBe(7);
    });
  });
});
