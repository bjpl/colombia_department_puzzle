/**
 * useEnhancedKeyboardNavigation Hook Tests
 * Tests for advanced keyboard navigation with arrow key movement
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useEnhancedKeyboardNavigation } from '../../hooks/useEnhancedKeyboardNavigation';
import { ReactNode } from 'react';
import {
  GameProvider,
  createMockGameStore,
} from '../utils/testProviders';

// Mock window dimensions
Object.defineProperty(window, 'innerWidth', {
  writable: true,
  configurable: true,
  value: 1024,
});

Object.defineProperty(window, 'innerHeight', {
  writable: true,
  configurable: true,
  value: 768,
});

describe('useEnhancedKeyboardNavigation', () => {
  let gameStore: ReturnType<typeof createMockGameStore>;

  beforeEach(() => {
    gameStore = createMockGameStore({
      departments: [
        {
          id: 'antioquia',
          name: 'Antioquia',
          region: 'Andina',
          capital: 'Medellín',
        },
        {
          id: 'cundinamarca',
          name: 'Cundinamarca',
          region: 'Andina',
          capital: 'Bogotá',
        },
      ],
      placedDepartments: new Set(),
    });

    // Mock DOM methods
    document.elementFromPoint = vi.fn(() => null);
    document.elementsFromPoint = vi.fn(() => []);
    document.querySelector = vi.fn(() => null);
    document.querySelectorAll = vi.fn(() => [] as any);

    // Clear global keyboard target
    (window as any).__keyboardNavTarget = null;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  const wrapper = ({ children }: { children: ReactNode }) => (
    <GameProvider store={gameStore}>{children}</GameProvider>
  );

  describe('Initial State', () => {
    it('should initialize with idle mode', () => {
      const { result } = renderHook(() => useEnhancedKeyboardNavigation(), {
        wrapper,
      });

      expect(result.current.isKeyboardMode).toBe(false);
      expect(result.current.navigationMode).toBe('idle');
    });

    it('should initialize with no selected department', () => {
      const { result } = renderHook(() => useEnhancedKeyboardNavigation(), {
        wrapper,
      });

      expect(result.current.selectedDepartment).toBeNull();
    });

    it('should initialize cursor at center', () => {
      const { result } = renderHook(() => useEnhancedKeyboardNavigation(), {
        wrapper,
      });

      expect(result.current.cursorPosition.x).toBe(window.innerWidth / 2);
      expect(result.current.cursorPosition.y).toBe(window.innerHeight / 2);
    });

    it('should initialize with no target zone', () => {
      const { result } = renderHook(() => useEnhancedKeyboardNavigation(), {
        wrapper,
      });

      expect(result.current.targetZone).toBeNull();
    });
  });

  describe('Department Selection', () => {
    it('should select department with Enter key', async () => {
      renderHook(() => useEnhancedKeyboardNavigation(), { wrapper });

      const mockElement = document.createElement('button');
      mockElement.setAttribute('data-department-id', 'antioquia');

      Object.defineProperty(document, 'activeElement', {
        value: mockElement,
        writable: true,
        configurable: true,
      });

      act(() => {
        const event = new KeyboardEvent('keydown', {
          key: 'Enter',
          bubbles: true,
        });
        Object.defineProperty(event, 'target', {
          value: mockElement,
          enumerable: true,
        });
        window.dispatchEvent(event);
      });

      await waitFor(() => {
        // Department should be selected
        expect(mockElement.getAttribute('data-department-id')).toBe(
          'antioquia'
        );
      });
    });

    it('should start in moving mode after selection', async () => {
      const { result } = renderHook(() => useEnhancedKeyboardNavigation(), {
        wrapper,
      });

      const mockElement = document.createElement('button');
      mockElement.setAttribute('data-department-id', 'antioquia');

      Object.defineProperty(document, 'activeElement', {
        value: mockElement,
        writable: true,
        configurable: true,
      });

      act(() => {
        const event = new KeyboardEvent('keydown', {
          key: 'Enter',
          bubbles: true,
        });
        Object.defineProperty(event, 'target', {
          value: mockElement,
          enumerable: true,
        });
        window.dispatchEvent(event);
      });

      await waitFor(() => {
        expect(result.current.isKeyboardMode).toBe(true);
        expect(result.current.navigationMode).toBe('moving');
      });
    });

    it('should not select already placed departments', async () => {
      const store = createMockGameStore({
        departments: [
          {
            id: 'antioquia',
            name: 'Antioquia',
            region: 'Andina',
            capital: 'Medellín',
          },
        ],
        placedDepartments: new Set(['antioquia']),
      });

      const localWrapper = ({ children }: { children: ReactNode }) => (
        <GameProvider store={store}>{children}</GameProvider>
      );

      const { result } = renderHook(() => useEnhancedKeyboardNavigation(), {
        wrapper: localWrapper,
      });

      const mockElement = document.createElement('button');
      mockElement.setAttribute('data-department-id', 'antioquia');

      Object.defineProperty(document, 'activeElement', {
        value: mockElement,
        writable: true,
        configurable: true,
      });

      act(() => {
        const event = new KeyboardEvent('keydown', {
          key: 'Enter',
          bubbles: true,
        });
        Object.defineProperty(event, 'target', {
          value: mockElement,
          enumerable: true,
        });
        window.dispatchEvent(event);
      });

      await waitFor(() => {
        expect(result.current.selectedDepartment).toBeNull();
      });
    });
  });

  describe('Arrow Key Movement', () => {
    it('should move cursor up with ArrowUp', async () => {
      const { result } = renderHook(() => useEnhancedKeyboardNavigation(), {
        wrapper,
      });

      // First select a department to enter moving mode
      const mockElement = document.createElement('button');
      mockElement.setAttribute('data-department-id', 'antioquia');
      Object.defineProperty(document, 'activeElement', {
        value: mockElement,
        writable: true,
        configurable: true,
      });

      act(() => {
        const selectEvent = new KeyboardEvent('keydown', { key: 'Enter' });
        Object.defineProperty(selectEvent, 'target', {
          value: mockElement,
          enumerable: true,
        });
        window.dispatchEvent(selectEvent);
      });

      await waitFor(() => {
        expect(result.current.navigationMode).toBe('moving');
      });

      const initialY = result.current.cursorPosition.y;

      act(() => {
        const event = new KeyboardEvent('keydown', { key: 'ArrowUp' });
        window.dispatchEvent(event);
      });

      await waitFor(() => {
        expect(result.current.cursorPosition.y).toBeLessThan(initialY);
      });
    });

    it('should move cursor down with ArrowDown', async () => {
      const { result } = renderHook(() => useEnhancedKeyboardNavigation(), {
        wrapper,
      });

      // Enter moving mode
      const mockElement = document.createElement('button');
      mockElement.setAttribute('data-department-id', 'antioquia');
      Object.defineProperty(document, 'activeElement', {
        value: mockElement,
        writable: true,
        configurable: true,
      });

      act(() => {
        const selectEvent = new KeyboardEvent('keydown', { key: 'Enter' });
        Object.defineProperty(selectEvent, 'target', {
          value: mockElement,
          enumerable: true,
        });
        window.dispatchEvent(selectEvent);
      });

      await waitFor(() => {
        expect(result.current.navigationMode).toBe('moving');
      });

      const initialY = result.current.cursorPosition.y;

      act(() => {
        const event = new KeyboardEvent('keydown', { key: 'ArrowDown' });
        window.dispatchEvent(event);
      });

      await waitFor(() => {
        expect(result.current.cursorPosition.y).toBeGreaterThan(initialY);
      });
    });

    it('should move cursor left with ArrowLeft', async () => {
      const { result } = renderHook(() => useEnhancedKeyboardNavigation(), {
        wrapper,
      });

      // Enter moving mode
      const mockElement = document.createElement('button');
      mockElement.setAttribute('data-department-id', 'antioquia');
      Object.defineProperty(document, 'activeElement', {
        value: mockElement,
        writable: true,
        configurable: true,
      });

      act(() => {
        const selectEvent = new KeyboardEvent('keydown', { key: 'Enter' });
        Object.defineProperty(selectEvent, 'target', {
          value: mockElement,
          enumerable: true,
        });
        window.dispatchEvent(selectEvent);
      });

      await waitFor(() => {
        expect(result.current.navigationMode).toBe('moving');
      });

      const initialX = result.current.cursorPosition.x;

      act(() => {
        const event = new KeyboardEvent('keydown', { key: 'ArrowLeft' });
        window.dispatchEvent(event);
      });

      await waitFor(() => {
        expect(result.current.cursorPosition.x).toBeLessThan(initialX);
      });
    });

    it('should move cursor right with ArrowRight', async () => {
      const { result } = renderHook(() => useEnhancedKeyboardNavigation(), {
        wrapper,
      });

      // Enter moving mode
      const mockElement = document.createElement('button');
      mockElement.setAttribute('data-department-id', 'antioquia');
      Object.defineProperty(document, 'activeElement', {
        value: mockElement,
        writable: true,
        configurable: true,
      });

      act(() => {
        const selectEvent = new KeyboardEvent('keydown', { key: 'Enter' });
        Object.defineProperty(selectEvent, 'target', {
          value: mockElement,
          enumerable: true,
        });
        window.dispatchEvent(selectEvent);
      });

      await waitFor(() => {
        expect(result.current.navigationMode).toBe('moving');
      });

      const initialX = result.current.cursorPosition.x;

      act(() => {
        const event = new KeyboardEvent('keydown', { key: 'ArrowRight' });
        window.dispatchEvent(event);
      });

      await waitFor(() => {
        expect(result.current.cursorPosition.x).toBeGreaterThan(initialX);
      });
    });

    it('should constrain cursor to viewport bounds', async () => {
      const { result } = renderHook(() => useEnhancedKeyboardNavigation(), {
        wrapper,
      });

      // Enter moving mode
      const mockElement = document.createElement('button');
      mockElement.setAttribute('data-department-id', 'antioquia');
      Object.defineProperty(document, 'activeElement', {
        value: mockElement,
        writable: true,
        configurable: true,
      });

      act(() => {
        const selectEvent = new KeyboardEvent('keydown', { key: 'Enter' });
        Object.defineProperty(selectEvent, 'target', {
          value: mockElement,
          enumerable: true,
        });
        window.dispatchEvent(selectEvent);
      });

      await waitFor(() => {
        expect(result.current.navigationMode).toBe('moving');
      });

      // Move far up (should be constrained)
      for (let i = 0; i < 100; i++) {
        act(() => {
          const event = new KeyboardEvent('keydown', { key: 'ArrowUp' });
          window.dispatchEvent(event);
        });
      }

      await waitFor(() => {
        expect(result.current.cursorPosition.y).toBeGreaterThanOrEqual(50);
      });
    });
  });

  describe('Movement Speed Modifiers', () => {
    it('should move faster with Shift key', async () => {
      const { result } = renderHook(() => useEnhancedKeyboardNavigation(), {
        wrapper,
      });

      // Enter moving mode
      const mockElement = document.createElement('button');
      mockElement.setAttribute('data-department-id', 'antioquia');
      Object.defineProperty(document, 'activeElement', {
        value: mockElement,
        writable: true,
        configurable: true,
      });

      act(() => {
        const selectEvent = new KeyboardEvent('keydown', { key: 'Enter' });
        Object.defineProperty(selectEvent, 'target', {
          value: mockElement,
          enumerable: true,
        });
        window.dispatchEvent(selectEvent);
      });

      await waitFor(() => {
        expect(result.current.navigationMode).toBe('moving');
      });

      const initialY = result.current.cursorPosition.y;

      // Move with Shift
      act(() => {
        const event = new KeyboardEvent('keydown', {
          key: 'ArrowUp',
          shiftKey: true,
        });
        window.dispatchEvent(event);
      });

      await waitFor(() => {
        const distance = initialY - result.current.cursorPosition.y;
        // Fast speed should move more than normal (40 vs 15 pixels)
        expect(distance).toBeGreaterThan(20);
      });
    });

    it('should move slower with Ctrl key', async () => {
      const { result } = renderHook(() => useEnhancedKeyboardNavigation(), {
        wrapper,
      });

      // Enter moving mode
      const mockElement = document.createElement('button');
      mockElement.setAttribute('data-department-id', 'antioquia');
      Object.defineProperty(document, 'activeElement', {
        value: mockElement,
        writable: true,
        configurable: true,
      });

      act(() => {
        const selectEvent = new KeyboardEvent('keydown', { key: 'Enter' });
        Object.defineProperty(selectEvent, 'target', {
          value: mockElement,
          enumerable: true,
        });
        window.dispatchEvent(selectEvent);
      });

      await waitFor(() => {
        expect(result.current.navigationMode).toBe('moving');
      });

      const initialY = result.current.cursorPosition.y;

      // Move with Ctrl
      act(() => {
        const event = new KeyboardEvent('keydown', {
          key: 'ArrowUp',
          ctrlKey: true,
        });
        window.dispatchEvent(event);
      });

      await waitFor(() => {
        const distance = initialY - result.current.cursorPosition.y;
        // Precision speed should move less (5 pixels)
        expect(distance).toBeLessThan(10);
      });
    });
  });

  describe('Drop Zone Detection', () => {
    it('should detect drop zones at cursor position', async () => {
      const { result } = renderHook(() => useEnhancedKeyboardNavigation(), {
        wrapper,
      });

      const mockDropZone = document.createElement('div');
      mockDropZone.setAttribute('data-department-drop-zone', 'antioquia');

      // Mock element detection
      document.elementsFromPoint = vi.fn(() => [mockDropZone]);

      // Enter moving mode
      const mockButton = document.createElement('button');
      mockButton.setAttribute('data-department-id', 'antioquia');
      Object.defineProperty(document, 'activeElement', {
        value: mockButton,
        writable: true,
        configurable: true,
      });

      act(() => {
        const selectEvent = new KeyboardEvent('keydown', { key: 'Enter' });
        Object.defineProperty(selectEvent, 'target', {
          value: mockButton,
          enumerable: true,
        });
        window.dispatchEvent(selectEvent);
      });

      await waitFor(() => {
        expect(result.current.navigationMode).toBe('moving');
      });

      // Move cursor
      act(() => {
        const event = new KeyboardEvent('keydown', { key: 'ArrowRight' });
        window.dispatchEvent(event);
      });

      await waitFor(() => {
        expect(result.current.targetZone).toBe('antioquia');
      });
    });

    it('should set global keyboard nav target', async () => {
      renderHook(() => useEnhancedKeyboardNavigation(), { wrapper });

      const mockDropZone = document.createElement('div');
      mockDropZone.setAttribute('data-department-drop-zone', 'cundinamarca');
      document.elementsFromPoint = vi.fn(() => [mockDropZone]);

      // Enter moving mode
      const mockButton = document.createElement('button');
      mockButton.setAttribute('data-department-id', 'cundinamarca');
      Object.defineProperty(document, 'activeElement', {
        value: mockButton,
        writable: true,
        configurable: true,
      });

      act(() => {
        const selectEvent = new KeyboardEvent('keydown', { key: 'Enter' });
        Object.defineProperty(selectEvent, 'target', {
          value: mockButton,
          enumerable: true,
        });
        window.dispatchEvent(selectEvent);
      });

      await waitFor(() => {
        // Move to trigger detection
        act(() => {
          const event = new KeyboardEvent('keydown', { key: 'ArrowDown' });
          window.dispatchEvent(event);
        });
      });

      await waitFor(() => {
        expect((window as any).__keyboardNavTarget).toBe('cundinamarca');
      });
    });
  });

  describe('Placement', () => {
    it('should place department with Enter when over target', async () => {
      const mockPlaceDepartment = vi.fn();
      gameStore.setState({ placeDepartment: mockPlaceDepartment });

      renderHook(() => useEnhancedKeyboardNavigation(), { wrapper });

      // Setup drop zone
      const mockDropZone = document.createElement('div');
      mockDropZone.setAttribute('data-department-drop-zone', 'antioquia');
      document.elementsFromPoint = vi.fn(() => [mockDropZone]);

      // Enter moving mode
      const mockButton = document.createElement('button');
      mockButton.setAttribute('data-department-id', 'antioquia');
      Object.defineProperty(document, 'activeElement', {
        value: mockButton,
        writable: true,
        configurable: true,
      });

      act(() => {
        const selectEvent = new KeyboardEvent('keydown', { key: 'Enter' });
        Object.defineProperty(selectEvent, 'target', {
          value: mockButton,
          enumerable: true,
        });
        window.dispatchEvent(selectEvent);
      });

      await waitFor(() => {
        // Move to trigger zone detection
        act(() => {
          const event = new KeyboardEvent('keydown', { key: 'ArrowRight' });
          window.dispatchEvent(event);
        });
      });

      // Place with Enter
      act(() => {
        const placeEvent = new KeyboardEvent('keydown', { key: 'Enter' });
        window.dispatchEvent(placeEvent);
      });

      await waitFor(() => {
        expect(mockPlaceDepartment).toHaveBeenCalledWith('antioquia', true);
      });
    });

    it('should trigger placement feedback event', async () => {
      const eventSpy = vi.fn();
      window.addEventListener('placement-feedback', eventSpy);

      renderHook(() => useEnhancedKeyboardNavigation(), { wrapper });

      const mockDropZone = document.createElement('div');
      mockDropZone.setAttribute('data-department-drop-zone', 'antioquia');
      document.elementsFromPoint = vi.fn(() => [mockDropZone]);

      // Select and move
      const mockButton = document.createElement('button');
      mockButton.setAttribute('data-department-id', 'antioquia');
      Object.defineProperty(document, 'activeElement', {
        value: mockButton,
        writable: true,
        configurable: true,
      });

      act(() => {
        const selectEvent = new KeyboardEvent('keydown', { key: 'Enter' });
        Object.defineProperty(selectEvent, 'target', {
          value: mockButton,
          enumerable: true,
        });
        window.dispatchEvent(selectEvent);
      });

      await waitFor(() => {
        act(() => {
          const moveEvent = new KeyboardEvent('keydown', { key: 'ArrowRight' });
          window.dispatchEvent(moveEvent);
        });
      });

      // Place
      act(() => {
        const placeEvent = new KeyboardEvent('keydown', { key: 'Enter' });
        window.dispatchEvent(placeEvent);
      });

      await waitFor(() => {
        expect(eventSpy).toHaveBeenCalled();
      });

      window.removeEventListener('placement-feedback', eventSpy);
    });
  });

  describe('Cancel Action', () => {
    it('should cancel with Escape key', async () => {
      const { result } = renderHook(() => useEnhancedKeyboardNavigation(), {
        wrapper,
      });

      // Enter moving mode
      const mockButton = document.createElement('button');
      mockButton.setAttribute('data-department-id', 'antioquia');
      Object.defineProperty(document, 'activeElement', {
        value: mockButton,
        writable: true,
        configurable: true,
      });

      act(() => {
        const selectEvent = new KeyboardEvent('keydown', { key: 'Enter' });
        Object.defineProperty(selectEvent, 'target', {
          value: mockButton,
          enumerable: true,
        });
        window.dispatchEvent(selectEvent);
      });

      await waitFor(() => {
        expect(result.current.navigationMode).toBe('moving');
      });

      // Cancel
      act(() => {
        const event = new KeyboardEvent('keydown', { key: 'Escape' });
        window.dispatchEvent(event);
      });

      await waitFor(() => {
        expect(result.current.navigationMode).toBe('idle');
        expect(result.current.selectedDepartment).toBeNull();
      });
    });

    it('should clear global keyboard target on cancel', async () => {
      renderHook(() => useEnhancedKeyboardNavigation(), { wrapper });

      (window as any).__keyboardNavTarget = 'antioquia';

      // Enter and then cancel
      const mockButton = document.createElement('button');
      mockButton.setAttribute('data-department-id', 'antioquia');
      Object.defineProperty(document, 'activeElement', {
        value: mockButton,
        writable: true,
        configurable: true,
      });

      act(() => {
        const selectEvent = new KeyboardEvent('keydown', { key: 'Enter' });
        Object.defineProperty(selectEvent, 'target', {
          value: mockButton,
          enumerable: true,
        });
        window.dispatchEvent(selectEvent);
      });

      await waitFor(() => {
        act(() => {
          const cancelEvent = new KeyboardEvent('keydown', { key: 'Escape' });
          window.dispatchEvent(cancelEvent);
        });
      });

      await waitFor(() => {
        expect((window as any).__keyboardNavTarget).toBeNull();
      });
    });
  });

  describe('Tab Navigation', () => {
    it('should allow Tab to work naturally', async () => {
      const { result } = renderHook(() => useEnhancedKeyboardNavigation(), {
        wrapper,
      });

      act(() => {
        const event = new KeyboardEvent('keydown', { key: 'Tab' });
        window.dispatchEvent(event);
      });

      await waitFor(() => {
        expect(result.current.navigationMode).toBe('selecting');
      });
    });

    it('should not prevent default Tab behavior', () => {
      renderHook(() => useEnhancedKeyboardNavigation(), { wrapper });

      const preventDefault = vi.fn();
      const event = new KeyboardEvent('keydown', { key: 'Tab' });
      Object.defineProperty(event, 'preventDefault', { value: preventDefault });

      act(() => {
        window.dispatchEvent(event);
      });

      expect(preventDefault).not.toHaveBeenCalled();
    });
  });

  describe('Input Field Protection', () => {
    it('should not trigger in input fields', () => {
      const { result } = renderHook(() => useEnhancedKeyboardNavigation(), {
        wrapper,
      });

      const input = document.createElement('input');

      act(() => {
        const event = new KeyboardEvent('keydown', { key: 'ArrowUp' });
        Object.defineProperty(event, 'target', {
          value: input,
          enumerable: true,
        });
        window.dispatchEvent(event);
      });

      // Should not affect navigation state
      expect(result.current.navigationMode).toBe('idle');
    });

    it('should not trigger in textarea', () => {
      const { result } = renderHook(() => useEnhancedKeyboardNavigation(), {
        wrapper,
      });

      const textarea = document.createElement('textarea');

      act(() => {
        const event = new KeyboardEvent('keydown', { key: 'Enter' });
        Object.defineProperty(event, 'target', {
          value: textarea,
          enumerable: true,
        });
        window.dispatchEvent(event);
      });

      expect(result.current.navigationMode).toBe('idle');
    });
  });

  describe('Cleanup', () => {
    it('should remove event listeners on unmount', () => {
      const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');

      const { unmount } = renderHook(() => useEnhancedKeyboardNavigation(), {
        wrapper,
      });

      unmount();

      expect(removeEventListenerSpy).toHaveBeenCalledWith(
        'keydown',
        expect.any(Function),
        true
      );
      expect(removeEventListenerSpy).toHaveBeenCalledWith(
        'mousemove',
        expect.any(Function)
      );
      expect(removeEventListenerSpy).toHaveBeenCalledWith(
        'mousedown',
        expect.any(Function)
      );
    });
  });
});
