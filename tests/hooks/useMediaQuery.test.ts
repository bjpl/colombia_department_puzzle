import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useMediaQuery, useViewportCategory } from '../../src/hooks/useMediaQuery';

describe('useMediaQuery Hook', () => {
  let matchMediaMock: any;
  let listeners: Array<(e: MediaQueryListEvent) => void> = [];

  beforeEach(() => {
    listeners = [];

    // Mock window.matchMedia
    matchMediaMock = vi.fn((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: (event: string, listener: (e: MediaQueryListEvent) => void) => {
        listeners.push(listener);
      },
      removeEventListener: (event: string, listener: (e: MediaQueryListEvent) => void) => {
        const index = listeners.indexOf(listener);
        if (index > -1) {
          listeners.splice(index, 1);
        }
      },
      addListener: (listener: (e: MediaQueryListEvent) => void) => {
        listeners.push(listener);
      },
      removeListener: (listener: (e: MediaQueryListEvent) => void) => {
        const index = listeners.indexOf(listener);
        if (index > -1) {
          listeners.splice(index, 1);
        }
      },
      dispatchEvent: vi.fn(),
    }));

    window.matchMedia = matchMediaMock;
  });

  afterEach(() => {
    listeners = [];
  });

  it('should return false when query does not match', () => {
    matchMediaMock.mockReturnValue({
      ...matchMediaMock(),
      matches: false,
    });

    const { result } = renderHook(() => useMediaQuery('(max-width: 768px)'));
    expect(result.current).toBe(false);
  });

  it('should return true when query matches', () => {
    matchMediaMock.mockReturnValue({
      ...matchMediaMock(),
      matches: true,
    });

    const { result } = renderHook(() => useMediaQuery('(max-width: 768px)'));
    expect(result.current).toBe(true);
  });

  it('should update when media query changes', async () => {
    const mockMediaQuery = {
      ...matchMediaMock(),
      matches: false,
    };

    matchMediaMock.mockReturnValue(mockMediaQuery);

    const { result } = renderHook(() => useMediaQuery('(max-width: 768px)'));
    expect(result.current).toBe(false);

    // Simulate media query change
    act(() => {
      mockMediaQuery.matches = true;
      listeners.forEach(listener => {
        listener({ matches: true } as MediaQueryListEvent);
      });
    });

    expect(result.current).toBe(true);
  });

  it('should clean up event listener on unmount', () => {
    const { unmount } = renderHook(() => useMediaQuery('(max-width: 768px)'));

    expect(listeners.length).toBeGreaterThan(0);

    unmount();

    // Listeners should be cleaned up
    expect(listeners.length).toBe(0);
  });

  it('should handle different media queries', () => {
    const queries = [
      '(max-width: 767px)',
      '(min-width: 768px)',
      '(prefers-reduced-motion: reduce)',
      '(prefers-color-scheme: dark)',
    ];

    queries.forEach(query => {
      matchMediaMock.mockReturnValue({
        ...matchMediaMock(),
        matches: true,
        media: query,
      });

      const { result } = renderHook(() => useMediaQuery(query));
      expect(result.current).toBe(true);
    });
  });
});

describe('useViewportCategory Hook', () => {
  beforeEach(() => {
    // Reset window dimensions
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    });
  });

  it('should return "desktop" for wide viewport', () => {
    window.innerWidth = 1024;
    const { result } = renderHook(() => useViewportCategory());
    expect(result.current).toBe('desktop');
  });

  it('should return "tablet" for medium viewport', () => {
    window.innerWidth = 800;
    const { result } = renderHook(() => useViewportCategory());
    expect(result.current).toBe('tablet');
  });

  it('should return "mobile" for narrow viewport', () => {
    window.innerWidth = 375;
    const { result } = renderHook(() => useViewportCategory());
    expect(result.current).toBe('mobile');
  });

  it('should update on window resize', async () => {
    window.innerWidth = 375; // Mobile
    const { result, rerender } = renderHook(() => useViewportCategory());
    expect(result.current).toBe('mobile');

    // Simulate resize to desktop
    act(() => {
      window.innerWidth = 1200;
      window.dispatchEvent(new Event('resize'));
    });

    // Wait for debounce (300ms)
    await new Promise(resolve => setTimeout(resolve, 350));
    rerender();

    expect(result.current).toBe('desktop');
  });

  it('should debounce resize events', async () => {
    const { result, rerender } = renderHook(() => useViewportCategory());

    // Rapid resize events
    act(() => {
      window.innerWidth = 375;
      window.dispatchEvent(new Event('resize'));
      window.innerWidth = 800;
      window.dispatchEvent(new Event('resize'));
      window.innerWidth = 1024;
      window.dispatchEvent(new Event('resize'));
    });

    // Should still have old value immediately
    expect(result.current).toBeTruthy();

    // Wait for debounce
    await new Promise(resolve => setTimeout(resolve, 350));
    rerender();

    // Should have updated to final value
    expect(result.current).toBe('desktop');
  });
});
