import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useScreenReaderAnnouncer } from '../../hooks/useScreenReaderAnnouncer';

describe('useScreenReaderAnnouncer - London School TDD', () => {
  // Mock DOM operations
  let mockAriaLiveElement: HTMLDivElement;
  let mockCreateElement: ReturnType<typeof vi.fn>;
  let mockAppendChild: ReturnType<typeof vi.fn>;
  let mockRemoveChild: ReturnType<typeof vi.fn>;
  let mockSetAttribute: ReturnType<typeof vi.fn>;
  let mockGetElementById: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    // Mock timers first
    vi.useFakeTimers({ shouldAdvanceTime: true });

    // Create mock element with all required methods
    mockAriaLiveElement = {
      setAttribute: vi.fn(),
      textContent: '',
      remove: vi.fn(),
      id: '',
      style: {} as CSSStyleDeclaration,
    } as unknown as HTMLDivElement;

    mockSetAttribute = mockAriaLiveElement.setAttribute as ReturnType<typeof vi.fn>;

    // Mock document methods
    mockCreateElement = vi.fn(() => mockAriaLiveElement);
    mockAppendChild = vi.fn();
    mockRemoveChild = vi.fn();
    mockGetElementById = vi.fn(() => null);

    // Replace global document methods
    vi.spyOn(document, 'createElement').mockImplementation(mockCreateElement);
    vi.spyOn(document.body, 'appendChild').mockImplementation(mockAppendChild);
    vi.spyOn(document.body, 'removeChild').mockImplementation(mockRemoveChild);
    vi.spyOn(document, 'getElementById').mockImplementation(mockGetElementById);
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  describe('Aria-live Region Creation', () => {
    it('should NOT create aria-live region on hook initialization', () => {
      // BEHAVIOR: Region created lazily on first announcement, not on mount
      renderHook(() => useScreenReaderAnnouncer());

      expect(mockCreateElement).not.toHaveBeenCalled();
      expect(mockAppendChild).not.toHaveBeenCalled();
    });

    it('should create aria-live region with correct attributes on first announcement', () => {
      // BEHAVIOR: Verify DOM manipulation sequence and attributes
      const { result } = renderHook(() => useScreenReaderAnnouncer());

      act(() => {
        result.current.announce('First announcement');
      });

      // Verify element creation and DOM insertion
      expect(mockCreateElement).toHaveBeenCalledWith('div');
      expect(mockAppendChild).toHaveBeenCalledWith(mockAriaLiveElement);

      // Verify aria attributes for screen reader compatibility
      expect(mockSetAttribute).toHaveBeenCalledWith('role', 'status');
      expect(mockSetAttribute).toHaveBeenCalledWith('aria-live', 'polite');
      expect(mockSetAttribute).toHaveBeenCalledWith('aria-atomic', 'true');
    });

    it('should position aria-live region off-screen for visual users', () => {
      // BEHAVIOR: Verify CSS positioning hides element visually but keeps it accessible
      const { result } = renderHook(() => useScreenReaderAnnouncer());

      act(() => {
        result.current.announce('Test');
      });

      expect(mockAriaLiveElement.style.position).toBe('absolute');
      expect(mockAriaLiveElement.style.left).toBe('-10000px');
      expect(mockAriaLiveElement.style.width).toBe('1px');
      expect(mockAriaLiveElement.style.height).toBe('1px');
      expect(mockAriaLiveElement.style.overflow).toBe('hidden');
    });

    it('should reuse existing aria-live region for subsequent announcements', () => {
      // BEHAVIOR: Verify singleton pattern - only one region created
      const { result } = renderHook(() => useScreenReaderAnnouncer());

      act(() => {
        result.current.announce('First');
        result.current.announce('Second');
        result.current.announce('Third');
      });

      expect(mockCreateElement).toHaveBeenCalledTimes(1);
      expect(mockAppendChild).toHaveBeenCalledTimes(1);
    });

    it('should assign unique ID to aria-live region', () => {
      // BEHAVIOR: Verify region can be referenced by assistive tech
      const { result } = renderHook(() => useScreenReaderAnnouncer());

      act(() => {
        result.current.announce('Test');
      });

      expect(mockSetAttribute).toHaveBeenCalledWith('id', 'sr-announcer');
    });
  });

  describe('Politeness Levels', () => {
    it('should use "polite" as default politeness level', () => {
      // BEHAVIOR: Verify default non-interrupting behavior
      const { result } = renderHook(() => useScreenReaderAnnouncer());

      act(() => {
        result.current.announce('Default announcement');
      });

      expect(mockSetAttribute).toHaveBeenCalledWith('aria-live', 'polite');
    });

    it('should set "assertive" politeness when specified', () => {
      // BEHAVIOR: Verify interrupting announcements for urgent messages
      const { result } = renderHook(() => useScreenReaderAnnouncer());

      act(() => {
        result.current.announce('Urgent message', { priority: 'assertive' });
      });

      expect(mockSetAttribute).toHaveBeenCalledWith('aria-live', 'assertive');
    });

    it('should change aria-live attribute when switching politeness levels', () => {
      // BEHAVIOR: Verify dynamic attribute updates for priority changes
      const { result } = renderHook(() => useScreenReaderAnnouncer());

      act(() => {
        result.current.announce('Polite message', { priority: 'polite' });
      });
      expect(mockSetAttribute).toHaveBeenLastCalledWith('aria-live', 'polite');

      act(() => {
        result.current.announce('Assertive message', { priority: 'assertive' });
      });
      expect(mockSetAttribute).toHaveBeenLastCalledWith('aria-live', 'assertive');
    });

    it('should maintain aria-atomic=true regardless of politeness level', () => {
      // BEHAVIOR: Verify entire message read regardless of priority
      const { result } = renderHook(() => useScreenReaderAnnouncer());

      act(() => {
        result.current.announce('Test 1', { priority: 'polite' });
      });
      expect(mockSetAttribute).toHaveBeenCalledWith('aria-atomic', 'true');

      mockSetAttribute.mockClear();

      act(() => {
        result.current.announce('Test 2', { priority: 'assertive' });
      });
      expect(mockSetAttribute).toHaveBeenCalledWith('aria-atomic', 'true');
    });
  });

  describe('Announcement Queue Management', () => {
    it('should queue announcements and process them sequentially', async () => {
      // BEHAVIOR: Verify FIFO queue prevents announcement overlap
      const { result } = renderHook(() => useScreenReaderAnnouncer());

      act(() => {
        result.current.announce('First announcement');
        result.current.announce('Second announcement');
        result.current.announce('Third announcement');
      });

      // First announcement should be active
      expect(mockAriaLiveElement.textContent).toBe('First announcement');

      // Advance past first announcement's timeout
      await act(async () => {
        vi.advanceTimersByTime(150);
      });

      expect(mockAriaLiveElement.textContent).toBe('Second announcement');

      await act(async () => {
        vi.advanceTimersByTime(150);
      });

      expect(mockAriaLiveElement.textContent).toBe('Third announcement');
    });

    it('should handle empty announcement queue gracefully', () => {
      // BEHAVIOR: Verify no errors when queue is empty
      const { result } = renderHook(() => useScreenReaderAnnouncer());

      // No announcements made
      expect(() => {
        act(() => {
          vi.advanceTimersByTime(1000);
        });
      }).not.toThrow();
    });

    it('should allow assertive announcements to interrupt polite queue', () => {
      // BEHAVIOR: Verify priority-based queue jumping
      const { result } = renderHook(() => useScreenReaderAnnouncer());

      act(() => {
        result.current.announce('Polite 1', { priority: 'polite' });
        result.current.announce('Polite 2', { priority: 'polite' });
        result.current.announce('URGENT', { priority: 'assertive' });
      });

      expect(mockAriaLiveElement.textContent).toBe('Polite 1');

      act(() => {
        vi.advanceTimersByTime(150);
      });

      // Assertive should jump queue
      expect(mockAriaLiveElement.textContent).toBe('URGENT');
    });

    it('should clear textContent between queued announcements', () => {
      // BEHAVIOR: Verify DOM reset prevents announcement concatenation
      const { result } = renderHook(() => useScreenReaderAnnouncer());

      act(() => {
        result.current.announce('First');
        result.current.announce('Second');
      });

      expect(mockAriaLiveElement.textContent).toBe('First');

      act(() => {
        vi.advanceTimersByTime(50); // Clear timeout
      });

      expect(mockAriaLiveElement.textContent).toBe('');

      act(() => {
        vi.advanceTimersByTime(100); // Next announcement timeout
      });

      expect(mockAriaLiveElement.textContent).toBe('Second');
    });
  });

  describe('Announcement Timeout and Clearing', () => {
    it('should clear announcement after default 3000ms timeout', () => {
      // BEHAVIOR: Verify auto-clearing prevents stale announcements
      const { result } = renderHook(() => useScreenReaderAnnouncer());

      act(() => {
        result.current.announce('Temporary message');
      });

      expect(mockAriaLiveElement.textContent).toBe('Temporary message');

      act(() => {
        vi.advanceTimersByTime(3000);
      });

      expect(mockAriaLiveElement.textContent).toBe('');
    });

    it('should use custom timeout when provided', () => {
      // BEHAVIOR: Verify configurable announcement duration
      const { result } = renderHook(() => useScreenReaderAnnouncer());

      act(() => {
        result.current.announce('Custom timeout', { timeout: 5000 });
      });

      expect(mockAriaLiveElement.textContent).toBe('Custom timeout');

      act(() => {
        vi.advanceTimersByTime(4999);
      });
      expect(mockAriaLiveElement.textContent).toBe('Custom timeout');

      act(() => {
        vi.advanceTimersByTime(1);
      });
      expect(mockAriaLiveElement.textContent).toBe('');
    });

    it('should respect minimum timeout of 100ms', () => {
      // BEHAVIOR: Verify screen reader has time to read announcement
      const { result } = renderHook(() => useScreenReaderAnnouncer());

      act(() => {
        result.current.announce('Fast message', { timeout: 50 });
      });

      act(() => {
        vi.advanceTimersByTime(99);
      });
      expect(mockAriaLiveElement.textContent).toBe('Fast message');

      act(() => {
        vi.advanceTimersByTime(1);
      });
      expect(mockAriaLiveElement.textContent).toBe('');
    });

    it('should cancel pending timeout when new announcement made', () => {
      // BEHAVIOR: Verify timeout cleanup prevents memory leaks
      const { result } = renderHook(() => useScreenReaderAnnouncer());

      act(() => {
        result.current.announce('First', { timeout: 5000 });
      });

      act(() => {
        vi.advanceTimersByTime(2000);
      });

      act(() => {
        result.current.announce('Second', { timeout: 1000 });
      });

      // First timeout should be cancelled
      act(() => {
        vi.advanceTimersByTime(3000);
      });

      // Second should clear at 1000ms, not first at 5000ms
      expect(mockAriaLiveElement.textContent).toBe('');
    });
  });

  describe('Modal State Announcements', () => {
    it('should announce modal opening with assertive priority', () => {
      // BEHAVIOR: Verify immediate user notification of modal state
      const { result } = renderHook(() => useScreenReaderAnnouncer());

      act(() => {
        result.current.announceModalState('open', 'Settings');
      });

      expect(mockAriaLiveElement.textContent).toContain('Settings');
      expect(mockAriaLiveElement.textContent).toContain('opened');
      expect(mockSetAttribute).toHaveBeenCalledWith('aria-live', 'assertive');
    });

    it('should announce modal closing with assertive priority', () => {
      // BEHAVIOR: Verify user informed when modal dismissed
      const { result } = renderHook(() => useScreenReaderAnnouncer());

      act(() => {
        result.current.announceModalState('close', 'Settings');
      });

      expect(mockAriaLiveElement.textContent).toContain('Settings');
      expect(mockAriaLiveElement.textContent).toContain('closed');
      expect(mockSetAttribute).toHaveBeenCalledWith('aria-live', 'assertive');
    });

    it('should include modal name in announcement', () => {
      // BEHAVIOR: Verify user knows which modal changed state
      const { result } = renderHook(() => useScreenReaderAnnouncer());

      act(() => {
        result.current.announceModalState('open', 'Difficulty Selection');
      });

      expect(mockAriaLiveElement.textContent).toMatch(/Difficulty Selection.*opened/);
    });

    it('should handle modal state announcement in queue', () => {
      // BEHAVIOR: Verify modal announcements respect queue but have priority
      const { result } = renderHook(() => useScreenReaderAnnouncer());

      act(() => {
        result.current.announce('Regular message', { priority: 'polite' });
        result.current.announceModalState('open', 'Help');
      });

      expect(mockAriaLiveElement.textContent).toBe('Regular message');

      act(() => {
        vi.advanceTimersByTime(150);
      });

      // Modal should jump queue due to assertive priority
      expect(mockAriaLiveElement.textContent).toContain('Help');
      expect(mockAriaLiveElement.textContent).toContain('opened');
    });
  });

  describe('Internationalization Support', () => {
    it('should accept and announce non-English text', () => {
      // BEHAVIOR: Verify i18n message passthrough without modification
      const { result } = renderHook(() => useScreenReaderAnnouncer());

      act(() => {
        result.current.announce('Configuración abierta');
      });

      expect(mockAriaLiveElement.textContent).toBe('Configuración abierta');
    });

    it('should handle internationalized modal state announcements', () => {
      // BEHAVIOR: Verify translated modal messages work correctly
      const { result } = renderHook(() => useScreenReaderAnnouncer());

      act(() => {
        result.current.announceModalState('open', 'Configuración');
      });

      expect(mockAriaLiveElement.textContent).toContain('Configuración');
    });

    it('should preserve special characters in announcements', () => {
      // BEHAVIOR: Verify unicode and special chars passed unchanged
      const { result } = renderHook(() => useScreenReaderAnnouncer());

      const specialChars = 'Bogotá: 100% completado! 🎉';

      act(() => {
        result.current.announce(specialChars);
      });

      expect(mockAriaLiveElement.textContent).toBe(specialChars);
    });

    it('should handle empty or whitespace-only announcements', () => {
      // BEHAVIOR: Verify graceful handling of invalid input
      const { result } = renderHook(() => useScreenReaderAnnouncer());

      act(() => {
        result.current.announce('');
        result.current.announce('   ');
      });

      // Should not create region for empty announcements
      expect(mockCreateElement).not.toHaveBeenCalled();
    });
  });

  describe('Cleanup and Memory Management', () => {
    it('should remove aria-live region on unmount', () => {
      // BEHAVIOR: Verify DOM cleanup prevents memory leaks
      const { result, unmount } = renderHook(() => useScreenReaderAnnouncer());

      act(() => {
        result.current.announce('Test');
      });

      expect(mockAppendChild).toHaveBeenCalled();

      unmount();

      expect(mockRemoveChild).toHaveBeenCalledWith(mockAriaLiveElement);
    });

    it('should clear all pending timeouts on unmount', () => {
      // BEHAVIOR: Verify timer cleanup prevents post-unmount updates
      const { result, unmount } = renderHook(() => useScreenReaderAnnouncer());

      act(() => {
        result.current.announce('Message 1', { timeout: 5000 });
        result.current.announce('Message 2', { timeout: 5000 });
        result.current.announce('Message 3', { timeout: 5000 });
      });

      unmount();

      // Advance timers - should not throw or attempt DOM updates
      expect(() => {
        act(() => {
          vi.advanceTimersByTime(10000);
        });
      }).not.toThrow();
    });

    it('should handle unmount when no announcements made', () => {
      // BEHAVIOR: Verify safe unmount with no aria-live region
      const { unmount } = renderHook(() => useScreenReaderAnnouncer());

      expect(() => {
        unmount();
      }).not.toThrow();

      expect(mockRemoveChild).not.toHaveBeenCalled();
    });

    it('should not attempt DOM operations after unmount', () => {
      // BEHAVIOR: Verify post-unmount guard prevents errors
      const { result, unmount } = renderHook(() => useScreenReaderAnnouncer());

      act(() => {
        result.current.announce('Before unmount');
      });

      unmount();

      // Attempt to announce after unmount should not cause errors
      expect(() => {
        result.current.announce('After unmount');
      }).not.toThrow();

      // Should not create new elements after unmount
      expect(mockCreateElement).toHaveBeenCalledTimes(1);
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('should handle rapid sequential announcements', () => {
      // BEHAVIOR: Verify queue stability under load
      const { result } = renderHook(() => useScreenReaderAnnouncer());

      act(() => {
        for (let i = 0; i < 100; i++) {
          result.current.announce(`Announcement ${i}`);
        }
      });

      expect(mockAriaLiveElement.textContent).toBe('Announcement 0');
      expect(mockCreateElement).toHaveBeenCalledTimes(1);
    });

    it('should handle very long announcement text', () => {
      // BEHAVIOR: Verify no truncation of long messages
      const { result } = renderHook(() => useScreenReaderAnnouncer());

      const longText = 'A'.repeat(1000);

      act(() => {
        result.current.announce(longText);
      });

      expect(mockAriaLiveElement.textContent).toBe(longText);
    });

    it('should handle announcement with HTML tags by escaping', () => {
      // BEHAVIOR: Verify XSS prevention via textContent
      const { result } = renderHook(() => useScreenReaderAnnouncer());

      const htmlInput = '<script>alert("xss")</script>Normal text';

      act(() => {
        result.current.announce(htmlInput);
      });

      // textContent should escape HTML
      expect(mockAriaLiveElement.textContent).toBe(htmlInput);
    });

    it('should handle interleaved polite and assertive announcements', () => {
      // BEHAVIOR: Verify complex queue priority management
      const { result } = renderHook(() => useScreenReaderAnnouncer());

      act(() => {
        result.current.announce('Polite 1', { priority: 'polite' });
        result.current.announce('Assertive 1', { priority: 'assertive' });
        result.current.announce('Polite 2', { priority: 'polite' });
        result.current.announce('Assertive 2', { priority: 'assertive' });
      });

      // First message starts
      expect(mockAriaLiveElement.textContent).toBe('Polite 1');

      act(() => {
        vi.advanceTimersByTime(150);
      });

      // Assertive messages should be processed before remaining polite
      expect(mockAriaLiveElement.textContent).toBe('Assertive 1');
    });

    it('should return announcer methods that remain stable across renders', () => {
      // BEHAVIOR: Verify ref stability for dependency arrays
      const { result, rerender } = renderHook(() => useScreenReaderAnnouncer());

      const firstAnnounce = result.current.announce;
      const firstModalAnnounce = result.current.announceModalState;

      rerender();

      expect(result.current.announce).toBe(firstAnnounce);
      expect(result.current.announceModalState).toBe(firstModalAnnounce);
    });
  });
});
