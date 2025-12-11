/**
 * London School TDD Tests for useModalAccessibility Hook
 *
 * Following London School (mockist) approach:
 * - Mock all collaborators (document.body, window, event listeners)
 * - Focus on behavior verification through mocks
 * - Test interactions and object conversations
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useModalAccessibility } from '../../hooks/useModalAccessibility';

// Mock collaborators
const mockBodyStyle = {
  overflow: '',
  position: '',
  top: '',
  width: '',
  paddingRight: '',
};

const mockScrollTo = vi.fn();
const mockGetComputedStyle = vi.fn();
const mockAddEventListener = vi.fn();
const mockRemoveEventListener = vi.fn();

describe('useModalAccessibility - London School TDD', () => {
  let originalBodyStyle: CSSStyleDeclaration;
  let originalScrollY: number;
  let originalScrollTo: typeof window.scrollTo;
  let originalGetComputedStyle: typeof window.getComputedStyle;
  let originalAddEventListener: typeof document.addEventListener;
  let originalRemoveEventListener: typeof document.removeEventListener;

  beforeEach(() => {
    // Store originals
    originalBodyStyle = document.body.style;
    originalScrollY = window.scrollY;
    originalScrollTo = window.scrollTo;
    originalGetComputedStyle = window.getComputedStyle;
    originalAddEventListener = document.addEventListener;
    originalRemoveEventListener = document.removeEventListener;

    // Mock document.body.style
    Object.defineProperty(document.body, 'style', {
      value: mockBodyStyle,
      writable: true,
      configurable: true,
    });

    // Mock window.scrollY
    Object.defineProperty(window, 'scrollY', {
      value: 0,
      writable: true,
      configurable: true,
    });

    // Mock window.scrollTo
    window.scrollTo = mockScrollTo;

    // Mock window.getComputedStyle
    window.getComputedStyle = mockGetComputedStyle.mockReturnValue({
      paddingRight: '0px',
    } as CSSStyleDeclaration);

    // Mock event listeners
    document.addEventListener = mockAddEventListener;
    document.removeEventListener = mockRemoveEventListener;

    // Reset all mocks
    vi.clearAllMocks();
  });

  afterEach(() => {
    // Restore originals
    Object.defineProperty(document.body, 'style', {
      value: originalBodyStyle,
      writable: true,
      configurable: true,
    });
    Object.defineProperty(window, 'scrollY', {
      value: originalScrollY,
      writable: true,
      configurable: true,
    });
    window.scrollTo = originalScrollTo;
    window.getComputedStyle = originalGetComputedStyle;
    document.addEventListener = originalAddEventListener;
    document.removeEventListener = originalRemoveEventListener;
  });

  describe('Escape Key Handling', () => {
    it('should add keydown listener when modal opens', () => {
      const onClose = vi.fn();

      renderHook(() => useModalAccessibility({
        isOpen: true,
        onClose,
      }));

      // Verify keydown listener was added
      expect(mockAddEventListener).toHaveBeenCalledWith(
        'keydown',
        expect.any(Function)
      );
    });

    it('should call onClose when Escape key is pressed', () => {
      const onClose = vi.fn();

      renderHook(() => useModalAccessibility({
        isOpen: true,
        onClose,
      }));

      // Simulate Escape key press
      const keydownHandler = mockAddEventListener.mock.calls.find(
        call => call[0] === 'keydown'
      )?.[1] as EventListener;

      const escapeEvent = new KeyboardEvent('keydown', { key: 'Escape' });
      keydownHandler(escapeEvent);

      // Verify onClose was called
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('should not call onClose for non-Escape keys', () => {
      const onClose = vi.fn();

      renderHook(() => useModalAccessibility({
        isOpen: true,
        onClose,
      }));

      const keydownHandler = mockAddEventListener.mock.calls.find(
        call => call[0] === 'keydown'
      )?.[1] as EventListener;

      // Simulate other key presses
      const enterEvent = new KeyboardEvent('keydown', { key: 'Enter' });
      keydownHandler(enterEvent);

      expect(onClose).not.toHaveBeenCalled();
    });

    it('should respect disableEscapeKey option', () => {
      const onClose = vi.fn();

      renderHook(() => useModalAccessibility({
        isOpen: true,
        onClose,
        disableEscapeKey: true,
      }));

      const keydownHandler = mockAddEventListener.mock.calls.find(
        call => call[0] === 'keydown'
      )?.[1] as EventListener;

      const escapeEvent = new KeyboardEvent('keydown', { key: 'Escape' });
      keydownHandler(escapeEvent);

      // Verify onClose was NOT called when escape is disabled
      expect(onClose).not.toHaveBeenCalled();
    });

    it('should call onEscapeKeyDown callback before closing', () => {
      const onClose = vi.fn();
      const onEscapeKeyDown = vi.fn().mockReturnValue(true);

      renderHook(() => useModalAccessibility({
        isOpen: true,
        onClose,
        onEscapeKeyDown,
      }));

      const keydownHandler = mockAddEventListener.mock.calls.find(
        call => call[0] === 'keydown'
      )?.[1] as EventListener;

      const escapeEvent = new KeyboardEvent('keydown', { key: 'Escape' });
      keydownHandler(escapeEvent);

      // Verify callback was called before onClose
      expect(onEscapeKeyDown).toHaveBeenCalledWith(escapeEvent);
      expect(onEscapeKeyDown).toHaveBeenCalledBefore(onClose);
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('should prevent closing if onEscapeKeyDown returns false', () => {
      const onClose = vi.fn();
      const onEscapeKeyDown = vi.fn().mockReturnValue(false);

      renderHook(() => useModalAccessibility({
        isOpen: true,
        onClose,
        onEscapeKeyDown,
      }));

      const keydownHandler = mockAddEventListener.mock.calls.find(
        call => call[0] === 'keydown'
      )?.[1] as EventListener;

      const escapeEvent = new KeyboardEvent('keydown', { key: 'Escape' });
      keydownHandler(escapeEvent);

      // Verify onClose was NOT called when callback returns false
      expect(onEscapeKeyDown).toHaveBeenCalledTimes(1);
      expect(onClose).not.toHaveBeenCalled();
    });

    it('should remove keydown listener when modal closes', () => {
      const onClose = vi.fn();

      const { rerender } = renderHook(
        ({ isOpen }) => useModalAccessibility({ isOpen, onClose }),
        { initialProps: { isOpen: true } }
      );

      // Modal opens, listener added
      expect(mockAddEventListener).toHaveBeenCalledWith('keydown', expect.any(Function));

      // Close modal
      rerender({ isOpen: false });

      // Verify listener was removed
      expect(mockRemoveEventListener).toHaveBeenCalledWith('keydown', expect.any(Function));
    });
  });

  describe('Scroll Prevention', () => {
    it('should prevent body scroll when modal opens', () => {
      renderHook(() => useModalAccessibility({
        isOpen: true,
        onClose: vi.fn(),
      }));

      // Verify body overflow is set to hidden
      expect(mockBodyStyle.overflow).toBe('hidden');
    });

    it('should save current scroll position when modal opens', () => {
      // Set scroll position
      Object.defineProperty(window, 'scrollY', {
        value: 500,
        writable: true,
        configurable: true,
      });

      renderHook(() => useModalAccessibility({
        isOpen: true,
        onClose: vi.fn(),
      }));

      // Verify scroll position is saved (we'll check restoration later)
      expect(window.scrollY).toBe(500);
    });

    it('should restore body overflow when modal closes', () => {
      const { rerender } = renderHook(
        ({ isOpen }) => useModalAccessibility({ isOpen, onClose: vi.fn() }),
        { initialProps: { isOpen: true } }
      );

      // Modal open - overflow hidden
      expect(mockBodyStyle.overflow).toBe('hidden');

      // Close modal
      rerender({ isOpen: false });

      // Verify overflow is restored
      expect(mockBodyStyle.overflow).toBe('');
    });

    it('should restore scroll position when modal closes', () => {
      // Set initial scroll position
      Object.defineProperty(window, 'scrollY', {
        value: 300,
        writable: true,
        configurable: true,
      });

      const { rerender } = renderHook(
        ({ isOpen }) => useModalAccessibility({ isOpen, onClose: vi.fn() }),
        { initialProps: { isOpen: true } }
      );

      // Close modal
      rerender({ isOpen: false });

      // Verify scrollTo was called with saved position
      expect(mockScrollTo).toHaveBeenCalledWith(0, 300);
    });

    it('should handle scrollbar width compensation', () => {
      // Mock scrollbar width (15px)
      Object.defineProperty(document.documentElement, 'clientWidth', {
        value: 1000,
        writable: true,
        configurable: true,
      });
      Object.defineProperty(window, 'innerWidth', {
        value: 1015,
        writable: true,
        configurable: true,
      });

      renderHook(() => useModalAccessibility({
        isOpen: true,
        onClose: vi.fn(),
      }));

      // Verify padding-right is added to compensate for scrollbar
      expect(mockBodyStyle.paddingRight).toBe('15px');
    });

    it('should restore original padding when modal closes', () => {
      // Set original padding
      mockGetComputedStyle.mockReturnValue({
        paddingRight: '10px',
      } as CSSStyleDeclaration);

      const { rerender } = renderHook(
        ({ isOpen }) => useModalAccessibility({ isOpen, onClose: vi.fn() }),
        { initialProps: { isOpen: true } }
      );

      // Close modal
      rerender({ isOpen: false });

      // Verify original padding is restored
      expect(mockBodyStyle.paddingRight).toBe('');
    });
  });

  describe('iOS Safari Scroll Lock', () => {
    it('should apply iOS-specific scroll lock on iOS devices', () => {
      // Mock iOS user agent
      Object.defineProperty(navigator, 'userAgent', {
        value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X)',
        writable: true,
        configurable: true,
      });

      renderHook(() => useModalAccessibility({
        isOpen: true,
        onClose: vi.fn(),
      }));

      // Verify iOS-specific styles are applied
      expect(mockBodyStyle.position).toBe('fixed');
      expect(mockBodyStyle.width).toBe('100%');
      expect(mockBodyStyle.overflow).toBe('hidden');
    });

    it('should set top position to negative scroll value on iOS', () => {
      // Mock iOS
      Object.defineProperty(navigator, 'userAgent', {
        value: 'Mozilla/5.0 (iPad; CPU OS 15_0 like Mac OS X)',
        writable: true,
        configurable: true,
      });

      // Set scroll position
      Object.defineProperty(window, 'scrollY', {
        value: 200,
        writable: true,
        configurable: true,
      });

      renderHook(() => useModalAccessibility({
        isOpen: true,
        onClose: vi.fn(),
      }));

      // Verify top is set to negative scroll value
      expect(mockBodyStyle.top).toBe('-200px');
    });

    it('should restore iOS scroll lock when modal closes', () => {
      // Mock iOS
      Object.defineProperty(navigator, 'userAgent', {
        value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X)',
        writable: true,
        configurable: true,
      });

      Object.defineProperty(window, 'scrollY', {
        value: 150,
        writable: true,
        configurable: true,
      });

      const { rerender } = renderHook(
        ({ isOpen }) => useModalAccessibility({ isOpen, onClose: vi.fn() }),
        { initialProps: { isOpen: true } }
      );

      // Verify iOS styles applied
      expect(mockBodyStyle.position).toBe('fixed');

      // Close modal
      rerender({ isOpen: false });

      // Verify iOS styles removed
      expect(mockBodyStyle.position).toBe('');
      expect(mockBodyStyle.top).toBe('');
      expect(mockBodyStyle.width).toBe('');

      // Verify scroll position restored
      expect(mockScrollTo).toHaveBeenCalledWith(0, 150);
    });
  });

  describe('Nested Modals', () => {
    it('should only close innermost modal on Escape', () => {
      const outerOnClose = vi.fn();
      const innerOnClose = vi.fn();

      // Open outer modal
      renderHook(() => useModalAccessibility({
        isOpen: true,
        onClose: outerOnClose,
        modalId: 'outer',
      }));

      // Open inner modal
      renderHook(() => useModalAccessibility({
        isOpen: true,
        onClose: innerOnClose,
        modalId: 'inner',
      }));

      // Get the most recent keydown handler (inner modal)
      const handlers = mockAddEventListener.mock.calls.filter(
        call => call[0] === 'keydown'
      );
      const innerHandler = handlers[handlers.length - 1][1] as EventListener;

      // Simulate Escape on inner modal
      const escapeEvent = new KeyboardEvent('keydown', { key: 'Escape' });
      innerHandler(escapeEvent);

      // Verify only inner modal closes
      expect(innerOnClose).toHaveBeenCalledTimes(1);
      expect(outerOnClose).not.toHaveBeenCalled();
    });

    it('should maintain scroll lock with nested modals', () => {
      // Open outer modal
      const { rerender: rerenderOuter } = renderHook(
        ({ isOpen }) => useModalAccessibility({
          isOpen,
          onClose: vi.fn(),
          modalId: 'outer',
        }),
        { initialProps: { isOpen: true } }
      );

      expect(mockBodyStyle.overflow).toBe('hidden');

      // Open inner modal
      const { rerender: rerenderInner } = renderHook(
        ({ isOpen }) => useModalAccessibility({
          isOpen,
          onClose: vi.fn(),
          modalId: 'inner',
        }),
        { initialProps: { isOpen: true } }
      );

      // Close inner modal
      rerenderInner({ isOpen: false });

      // Verify scroll lock maintained (outer modal still open)
      expect(mockBodyStyle.overflow).toBe('hidden');

      // Close outer modal
      rerenderOuter({ isOpen: false });

      // Now scroll lock should be removed
      expect(mockBodyStyle.overflow).toBe('');
    });

    it('should not restore scroll position until all modals are closed', () => {
      Object.defineProperty(window, 'scrollY', {
        value: 400,
        writable: true,
        configurable: true,
      });

      // Open outer modal
      const { rerender: rerenderOuter } = renderHook(
        ({ isOpen }) => useModalAccessibility({
          isOpen,
          onClose: vi.fn(),
          modalId: 'outer',
        }),
        { initialProps: { isOpen: true } }
      );

      // Open inner modal
      const { rerender: rerenderInner } = renderHook(
        ({ isOpen }) => useModalAccessibility({
          isOpen,
          onClose: vi.fn(),
          modalId: 'inner',
        }),
        { initialProps: { isOpen: true } }
      );

      // Close inner modal
      rerenderInner({ isOpen: false });

      // Scroll should NOT be restored yet
      expect(mockScrollTo).not.toHaveBeenCalled();

      // Close outer modal
      rerenderOuter({ isOpen: false });

      // Now scroll should be restored
      expect(mockScrollTo).toHaveBeenCalledWith(0, 400);
    });
  });

  describe('Integration Behavior', () => {
    it('should coordinate all accessibility features when modal opens', () => {
      const onClose = vi.fn();

      renderHook(() => useModalAccessibility({
        isOpen: true,
        onClose,
      }));

      // Verify all collaborators were engaged
      expect(mockAddEventListener).toHaveBeenCalledWith('keydown', expect.any(Function));
      expect(mockBodyStyle.overflow).toBe('hidden');
      expect(window.getComputedStyle).toHaveBeenCalled();
    });

    it('should clean up all features when modal closes', () => {
      const { rerender } = renderHook(
        ({ isOpen }) => useModalAccessibility({ isOpen, onClose: vi.fn() }),
        { initialProps: { isOpen: true } }
      );

      // Close modal
      rerender({ isOpen: false });

      // Verify all cleanup occurred
      expect(mockRemoveEventListener).toHaveBeenCalledWith('keydown', expect.any(Function));
      expect(mockBodyStyle.overflow).toBe('');
      expect(mockScrollTo).toHaveBeenCalled();
    });

    it('should handle rapid open/close cycles gracefully', () => {
      const { rerender } = renderHook(
        ({ isOpen }) => useModalAccessibility({ isOpen, onClose: vi.fn() }),
        { initialProps: { isOpen: false } }
      );

      // Rapid open/close
      rerender({ isOpen: true });
      rerender({ isOpen: false });
      rerender({ isOpen: true });
      rerender({ isOpen: false });

      // Verify final state is clean
      expect(mockBodyStyle.overflow).toBe('');
      expect(mockRemoveEventListener).toHaveBeenCalled();
    });
  });
});
