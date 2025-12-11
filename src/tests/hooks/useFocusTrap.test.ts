/**
 * London School TDD: Focus Trap Hook Tests
 *
 * Testing Strategy:
 * - Outside-in behavior verification
 * - Mock DOM elements and focus methods
 * - Test collaborator interactions
 * - Edge cases and dynamic content
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useFocusTrap } from '../../hooks/useFocusTrap';

describe('useFocusTrap - London School TDD', () => {
  // Mock DOM elements with focus capabilities
  let mockContainer: HTMLDivElement;
  let mockButton1: HTMLButtonElement;
  let mockButton2: HTMLButtonElement;
  let mockInput: HTMLInputElement;
  let mockPreviouslyFocused: HTMLButtonElement;

  beforeEach(() => {
    // Create mock DOM structure
    mockContainer = document.createElement('div');
    mockButton1 = document.createElement('button');
    mockButton2 = document.createElement('button');
    mockInput = document.createElement('input');
    mockPreviouslyFocused = document.createElement('button');

    // Setup focus mocks
    mockButton1.focus = vi.fn();
    mockButton2.focus = vi.fn();
    mockInput.focus = vi.fn();
    mockPreviouslyFocused.focus = vi.fn();

    // Add to container
    mockContainer.appendChild(mockButton1);
    mockContainer.appendChild(mockInput);
    mockContainer.appendChild(mockButton2);

    // Add to document
    document.body.appendChild(mockContainer);
    document.body.appendChild(mockPreviouslyFocused);

    // Mock tabindex for focusable detection
    mockButton1.tabIndex = 0;
    mockButton2.tabIndex = 0;
    mockInput.tabIndex = 0;
  });

  afterEach(() => {
    document.body.innerHTML = '';
    vi.clearAllMocks();
  });

  describe('Activation and Deactivation', () => {
    it('should focus first focusable element when activated', () => {
      // Arrange
      const { result } = renderHook(() => useFocusTrap(mockContainer, true));

      // Act
      act(() => {
        result.current.activate();
      });

      // Assert - verify collaboration with DOM
      expect(mockButton1.focus).toHaveBeenCalledTimes(1);
      expect(mockButton2.focus).not.toHaveBeenCalled();
      expect(mockInput.focus).not.toHaveBeenCalled();
    });

    it('should store previously focused element before activation', () => {
      // Arrange
      Object.defineProperty(document, 'activeElement', {
        value: mockPreviouslyFocused,
        configurable: true,
      });

      const { result } = renderHook(() => useFocusTrap(mockContainer, true));

      // Act
      act(() => {
        result.current.activate();
      });

      // Assert - verify state capture
      expect(result.current.getPreviousFocus()).toBe(mockPreviouslyFocused);
    });

    it('should return focus to previously focused element on deactivation', () => {
      // Arrange
      Object.defineProperty(document, 'activeElement', {
        value: mockPreviouslyFocused,
        configurable: true,
      });

      const { result } = renderHook(() => useFocusTrap(mockContainer, true));

      act(() => {
        result.current.activate();
      });

      // Act
      act(() => {
        result.current.deactivate();
      });

      // Assert - verify focus restoration
      expect(mockPreviouslyFocused.focus).toHaveBeenCalled();
    });

    it('should not focus if container has no focusable elements', () => {
      // Arrange - empty container
      const emptyContainer = document.createElement('div');
      document.body.appendChild(emptyContainer);

      const { result } = renderHook(() => useFocusTrap(emptyContainer, true));

      // Act
      act(() => {
        result.current.activate();
      });

      // Assert - no focus calls
      expect(mockButton1.focus).not.toHaveBeenCalled();
    });

    it('should handle null container gracefully', () => {
      // Arrange
      const { result } = renderHook(() => useFocusTrap(null, true));

      // Act & Assert - should not throw
      expect(() => {
        act(() => {
          result.current.activate();
        });
      }).not.toThrow();
    });
  });

  describe('Tab Key Cycling - Forward', () => {
    it('should cycle focus to next element on Tab press', () => {
      // Arrange
      const { result } = renderHook(() => useFocusTrap(mockContainer, true));

      act(() => {
        result.current.activate();
      });

      Object.defineProperty(document, 'activeElement', {
        value: mockButton1,
        configurable: true,
      });

      // Act - simulate Tab key
      const tabEvent = new KeyboardEvent('keydown', {
        key: 'Tab',
        shiftKey: false,
        bubbles: true,
      });
      const preventDefaultSpy = vi.spyOn(tabEvent, 'preventDefault');

      act(() => {
        mockContainer.dispatchEvent(tabEvent);
      });

      // Assert - verify focus moved to next element
      expect(preventDefaultSpy).toHaveBeenCalled();
      expect(mockInput.focus).toHaveBeenCalled();
    });

    it('should cycle from last to first element on Tab press', () => {
      // Arrange
      const { result } = renderHook(() => useFocusTrap(mockContainer, true));

      act(() => {
        result.current.activate();
      });

      Object.defineProperty(document, 'activeElement', {
        value: mockButton2,
        configurable: true,
      });

      // Act - Tab from last element
      const tabEvent = new KeyboardEvent('keydown', {
        key: 'Tab',
        shiftKey: false,
        bubbles: true,
      });

      act(() => {
        mockContainer.dispatchEvent(tabEvent);
      });

      // Assert - wrapped to first element
      expect(mockButton1.focus).toHaveBeenCalled();
    });

    it('should not interfere with Tab if focus is outside container', () => {
      // Arrange
      const outsideElement = document.createElement('button');
      document.body.appendChild(outsideElement);

      const { result } = renderHook(() => useFocusTrap(mockContainer, true));

      act(() => {
        result.current.activate();
      });

      Object.defineProperty(document, 'activeElement', {
        value: outsideElement,
        configurable: true,
      });

      // Act
      const tabEvent = new KeyboardEvent('keydown', {
        key: 'Tab',
        bubbles: true,
      });
      const preventDefaultSpy = vi.spyOn(tabEvent, 'preventDefault');

      act(() => {
        document.dispatchEvent(tabEvent);
      });

      // Assert - should allow default behavior
      expect(preventDefaultSpy).not.toHaveBeenCalled();
    });
  });

  describe('Shift+Tab Key Cycling - Backward', () => {
    it('should cycle focus to previous element on Shift+Tab press', () => {
      // Arrange
      const { result } = renderHook(() => useFocusTrap(mockContainer, true));

      act(() => {
        result.current.activate();
      });

      Object.defineProperty(document, 'activeElement', {
        value: mockInput,
        configurable: true,
      });

      // Act - Shift+Tab
      const shiftTabEvent = new KeyboardEvent('keydown', {
        key: 'Tab',
        shiftKey: true,
        bubbles: true,
      });
      const preventDefaultSpy = vi.spyOn(shiftTabEvent, 'preventDefault');

      act(() => {
        mockContainer.dispatchEvent(shiftTabEvent);
      });

      // Assert - moved to previous element
      expect(preventDefaultSpy).toHaveBeenCalled();
      expect(mockButton1.focus).toHaveBeenCalled();
    });

    it('should cycle from first to last element on Shift+Tab press', () => {
      // Arrange
      const { result } = renderHook(() => useFocusTrap(mockContainer, true));

      act(() => {
        result.current.activate();
      });

      Object.defineProperty(document, 'activeElement', {
        value: mockButton1,
        configurable: true,
      });

      // Act - Shift+Tab from first element
      const shiftTabEvent = new KeyboardEvent('keydown', {
        key: 'Tab',
        shiftKey: true,
        bubbles: true,
      });

      act(() => {
        mockContainer.dispatchEvent(shiftTabEvent);
      });

      // Assert - wrapped to last element
      expect(mockButton2.focus).toHaveBeenCalled();
    });
  });

  describe('Dynamic Content Handling', () => {
    it('should update focusable elements when new elements are added', () => {
      // Arrange
      const { result } = renderHook(() => useFocusTrap(mockContainer, true));

      act(() => {
        result.current.activate();
      });

      // Act - add new focusable element
      const newButton = document.createElement('button');
      newButton.focus = vi.fn();
      newButton.tabIndex = 0;

      act(() => {
        mockContainer.appendChild(newButton);
        result.current.updateFocusableElements();
      });

      Object.defineProperty(document, 'activeElement', {
        value: mockButton2,
        configurable: true,
      });

      const tabEvent = new KeyboardEvent('keydown', {
        key: 'Tab',
        bubbles: true,
      });

      act(() => {
        mockContainer.dispatchEvent(tabEvent);
      });

      // Assert - new button should be in the focus cycle
      expect(newButton.focus).toHaveBeenCalled();
    });

    it('should handle removal of currently focused element', () => {
      // Arrange
      const { result } = renderHook(() => useFocusTrap(mockContainer, true));

      act(() => {
        result.current.activate();
      });

      Object.defineProperty(document, 'activeElement', {
        value: mockInput,
        configurable: true,
      });

      // Act - remove currently focused element
      act(() => {
        mockContainer.removeChild(mockInput);
        result.current.updateFocusableElements();
      });

      // Assert - should focus first available element
      expect(mockButton1.focus).toHaveBeenCalled();
    });

    it('should update focus list when elements become disabled', () => {
      // Arrange
      const { result } = renderHook(() => useFocusTrap(mockContainer, true));

      act(() => {
        result.current.activate();
      });

      // Act - disable middle element
      mockInput.disabled = true;

      act(() => {
        result.current.updateFocusableElements();
      });

      Object.defineProperty(document, 'activeElement', {
        value: mockButton1,
        configurable: true,
      });

      const tabEvent = new KeyboardEvent('keydown', {
        key: 'Tab',
        bubbles: true,
      });

      act(() => {
        mockContainer.dispatchEvent(tabEvent);
      });

      // Assert - should skip disabled input
      expect(mockButton2.focus).toHaveBeenCalled();
      expect(mockInput.focus).not.toHaveBeenCalled();
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('should handle container with single focusable element', () => {
      // Arrange
      const singleContainer = document.createElement('div');
      const singleButton = document.createElement('button');
      singleButton.focus = vi.fn();
      singleButton.tabIndex = 0;
      singleContainer.appendChild(singleButton);
      document.body.appendChild(singleContainer);

      const { result } = renderHook(() => useFocusTrap(singleContainer, true));

      act(() => {
        result.current.activate();
      });

      Object.defineProperty(document, 'activeElement', {
        value: singleButton,
        configurable: true,
      });

      // Act - Tab on single element
      const tabEvent = new KeyboardEvent('keydown', {
        key: 'Tab',
        bubbles: true,
      });

      act(() => {
        singleContainer.dispatchEvent(tabEvent);
      });

      // Assert - should stay on same element
      expect(singleButton.focus).toHaveBeenCalledTimes(2); // once on activate, once on tab
    });

    it('should ignore non-Tab keys', () => {
      // Arrange
      const { result } = renderHook(() => useFocusTrap(mockContainer, true));

      act(() => {
        result.current.activate();
      });

      // Act - press Enter key
      const enterEvent = new KeyboardEvent('keydown', {
        key: 'Enter',
        bubbles: true,
      });
      const preventDefaultSpy = vi.spyOn(enterEvent, 'preventDefault');

      act(() => {
        mockContainer.dispatchEvent(enterEvent);
      });

      // Assert - should not prevent default
      expect(preventDefaultSpy).not.toHaveBeenCalled();
    });

    it('should not activate if disabled flag is passed', () => {
      // Arrange & Act
      const { result } = renderHook(() => useFocusTrap(mockContainer, false));

      act(() => {
        result.current.activate();
      });

      // Assert - no focus should occur
      expect(mockButton1.focus).not.toHaveBeenCalled();
    });

    it('should clean up event listeners on deactivation', () => {
      // Arrange
      const removeEventListenerSpy = vi.spyOn(mockContainer, 'removeEventListener');
      const { result } = renderHook(() => useFocusTrap(mockContainer, true));

      act(() => {
        result.current.activate();
      });

      // Act
      act(() => {
        result.current.deactivate();
      });

      // Assert - verify cleanup
      expect(removeEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function));
    });

    it('should handle rapid activate/deactivate cycles', () => {
      // Arrange
      const { result } = renderHook(() => useFocusTrap(mockContainer, true));

      // Act - rapid toggling
      act(() => {
        result.current.activate();
        result.current.deactivate();
        result.current.activate();
        result.current.deactivate();
        result.current.activate();
      });

      // Assert - should stabilize on final activate
      expect(mockButton1.focus).toHaveBeenCalled();
    });
  });

  describe('Focusable Element Detection', () => {
    it('should detect standard focusable elements', () => {
      // Arrange
      const container = document.createElement('div');
      const button = document.createElement('button');
      const input = document.createElement('input');
      const select = document.createElement('select');
      const textarea = document.createElement('textarea');
      const anchor = document.createElement('a');
      anchor.href = '#';

      [button, input, select, textarea, anchor].forEach(el => {
        (el as HTMLElement).focus = vi.fn();
        container.appendChild(el);
      });

      document.body.appendChild(container);

      const { result } = renderHook(() => useFocusTrap(container, true));

      // Act
      act(() => {
        result.current.activate();
      });

      // Assert - should focus first element
      expect((button as HTMLButtonElement).focus).toHaveBeenCalled();
    });

    it('should detect elements with tabindex >= 0', () => {
      // Arrange
      const container = document.createElement('div');
      const div = document.createElement('div');
      div.tabIndex = 0;
      div.focus = vi.fn();
      container.appendChild(div);
      document.body.appendChild(container);

      const { result } = renderHook(() => useFocusTrap(container, true));

      // Act
      act(() => {
        result.current.activate();
      });

      // Assert
      expect(div.focus).toHaveBeenCalled();
    });

    it('should exclude elements with tabindex < 0', () => {
      // Arrange
      const container = document.createElement('div');
      const div1 = document.createElement('div');
      const div2 = document.createElement('div');
      div1.tabIndex = -1;
      div2.tabIndex = 0;
      div1.focus = vi.fn();
      div2.focus = vi.fn();
      container.appendChild(div1);
      container.appendChild(div2);
      document.body.appendChild(container);

      const { result } = renderHook(() => useFocusTrap(container, true));

      // Act
      act(() => {
        result.current.activate();
      });

      // Assert - should skip tabindex -1
      expect(div1.focus).not.toHaveBeenCalled();
      expect(div2.focus).toHaveBeenCalled();
    });

    it('should exclude hidden elements', () => {
      // Arrange
      const container = document.createElement('div');
      const visibleButton = document.createElement('button');
      const hiddenButton = document.createElement('button');

      visibleButton.focus = vi.fn();
      hiddenButton.focus = vi.fn();
      hiddenButton.style.display = 'none';

      container.appendChild(hiddenButton);
      container.appendChild(visibleButton);
      document.body.appendChild(container);

      const { result } = renderHook(() => useFocusTrap(container, true));

      // Act
      act(() => {
        result.current.activate();
      });

      // Assert - should skip hidden element
      expect(hiddenButton.focus).not.toHaveBeenCalled();
      expect(visibleButton.focus).toHaveBeenCalled();
    });

    it('should exclude elements with aria-hidden="true"', () => {
      // Arrange
      const container = document.createElement('div');
      const visibleButton = document.createElement('button');
      const ariaHiddenButton = document.createElement('button');

      visibleButton.focus = vi.fn();
      ariaHiddenButton.focus = vi.fn();
      ariaHiddenButton.setAttribute('aria-hidden', 'true');

      container.appendChild(ariaHiddenButton);
      container.appendChild(visibleButton);
      document.body.appendChild(container);

      const { result } = renderHook(() => useFocusTrap(container, true));

      // Act
      act(() => {
        result.current.activate();
      });

      // Assert - should skip aria-hidden element
      expect(ariaHiddenButton.focus).not.toHaveBeenCalled();
      expect(visibleButton.focus).toHaveBeenCalled();
    });
  });

  describe('Integration with Modal Component', () => {
    it('should provide activate/deactivate API for modal integration', () => {
      // Arrange
      const { result } = renderHook(() => useFocusTrap(mockContainer, true));

      // Assert - verify API shape for modal
      expect(result.current).toHaveProperty('activate');
      expect(result.current).toHaveProperty('deactivate');
      expect(result.current).toHaveProperty('updateFocusableElements');
      expect(result.current).toHaveProperty('getPreviousFocus');
      expect(typeof result.current.activate).toBe('function');
      expect(typeof result.current.deactivate).toBe('function');
    });

    it('should auto-activate when enabled prop changes to true', () => {
      // Arrange
      const { rerender } = renderHook(
        ({ enabled }) => useFocusTrap(mockContainer, enabled),
        { initialProps: { enabled: false } }
      );

      // Act - enable focus trap
      rerender({ enabled: true });

      // Assert - should activate automatically
      expect(mockButton1.focus).toHaveBeenCalled();
    });

    it('should auto-deactivate when enabled prop changes to false', () => {
      // Arrange
      Object.defineProperty(document, 'activeElement', {
        value: mockPreviouslyFocused,
        configurable: true,
      });

      const { rerender } = renderHook(
        ({ enabled }) => useFocusTrap(mockContainer, enabled),
        { initialProps: { enabled: true } }
      );

      // Act - disable focus trap
      rerender({ enabled: false });

      // Assert - should restore focus
      expect(mockPreviouslyFocused.focus).toHaveBeenCalled();
    });
  });
});
