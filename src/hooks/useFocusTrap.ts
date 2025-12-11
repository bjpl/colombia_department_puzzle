/**
 * useFocusTrap Hook
 *
 * Traps keyboard focus within a container element to ensure accessibility
 * for modal dialogs and other overlay components.
 *
 * Features:
 * - Captures Tab/Shift+Tab to cycle focus within container
 * - Stores and restores previously focused element
 * - Handles dynamic content (elements added/removed)
 * - Supports disabled state
 * - Excludes hidden and disabled elements
 *
 * @example
 * const modalRef = useRef<HTMLDivElement>(null);
 * const focusTrap = useFocusTrap(modalRef.current, isOpen);
 *
 * useEffect(() => {
 *   if (isOpen) {
 *     focusTrap.activate();
 *   } else {
 *     focusTrap.deactivate();
 *   }
 * }, [isOpen]);
 */

import { useEffect, useRef, useCallback } from 'react';

interface FocusTrapAPI {
  activate: () => void;
  deactivate: () => void;
  updateFocusableElements: () => void;
  getPreviousFocus: () => Element | null;
}

/**
 * Selector for focusable elements following WCAG guidelines
 */
const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'textarea:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ');

/**
 * Check if an element is visible and not aria-hidden
 */
function isElementVisible(element: HTMLElement): boolean {
  if (element.style.display === 'none') return false;
  if (element.style.visibility === 'hidden') return false;
  if (element.getAttribute('aria-hidden') === 'true') return false;
  if (element.hasAttribute('disabled')) return false;

  return true;
}

/**
 * Get all focusable elements within a container
 */
function getFocusableElements(container: HTMLElement | null): HTMLElement[] {
  if (!container) return [];

  const elements = Array.from(
    container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
  );

  return elements.filter(isElementVisible);
}

export function useFocusTrap(
  container: HTMLElement | null,
  enabled: boolean = true
): FocusTrapAPI {
  const previouslyFocusedElement = useRef<Element | null>(null);
  const focusableElements = useRef<HTMLElement[]>([]);
  const isActive = useRef(false);

  /**
   * Update the list of focusable elements
   */
  const updateFocusableElements = useCallback(() => {
    focusableElements.current = getFocusableElements(container);

    // If currently focused element was removed, focus first available
    if (
      isActive.current &&
      document.activeElement &&
      !focusableElements.current.includes(document.activeElement as HTMLElement)
    ) {
      const firstElement = focusableElements.current[0];
      if (firstElement) {
        firstElement.focus();
      }
    }
  }, [container]);

  /**
   * Handle Tab key to trap focus
   */
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return;
      if (!container) return;

      const elements = focusableElements.current;
      if (elements.length === 0) return;

      const activeElement = document.activeElement as HTMLElement;

      // Check if focus is within container
      if (!container.contains(activeElement)) return;

      const currentIndex = elements.indexOf(activeElement);
      if (currentIndex === -1) return;

      // Prevent default Tab behavior
      event.preventDefault();

      let nextIndex: number;

      if (event.shiftKey) {
        // Shift+Tab: Move backward
        nextIndex = currentIndex - 1;
        if (nextIndex < 0) {
          nextIndex = elements.length - 1; // Wrap to last
        }
      } else {
        // Tab: Move forward
        nextIndex = currentIndex + 1;
        if (nextIndex >= elements.length) {
          nextIndex = 0; // Wrap to first
        }
      }

      elements[nextIndex]?.focus();
    },
    [container]
  );

  /**
   * Activate focus trap
   */
  const activate = useCallback(() => {
    if (!enabled || !container) return;
    if (isActive.current) return;

    // Store currently focused element
    previouslyFocusedElement.current = document.activeElement;

    // Update focusable elements
    updateFocusableElements();

    // Focus first element
    const firstElement = focusableElements.current[0];
    if (firstElement) {
      firstElement.focus();
    }

    // Add event listener
    container.addEventListener('keydown', handleKeyDown);

    isActive.current = true;
  }, [enabled, container, handleKeyDown, updateFocusableElements]);

  /**
   * Deactivate focus trap
   */
  const deactivate = useCallback(() => {
    if (!container) return;
    if (!isActive.current) return;

    // Remove event listener
    container.removeEventListener('keydown', handleKeyDown);

    // Restore previously focused element
    if (
      previouslyFocusedElement.current &&
      previouslyFocusedElement.current instanceof HTMLElement
    ) {
      previouslyFocusedElement.current.focus();
    }

    isActive.current = false;
  }, [container, handleKeyDown]);

  /**
   * Get previously focused element
   */
  const getPreviousFocus = useCallback(() => {
    return previouslyFocusedElement.current;
  }, []);

  /**
   * Auto-activate/deactivate based on enabled prop
   */
  useEffect(() => {
    if (enabled) {
      activate();
    } else {
      deactivate();
    }

    return () => {
      deactivate();
    };
  }, [enabled, activate, deactivate]);

  return {
    activate,
    deactivate,
    updateFocusableElements,
    getPreviousFocus,
  };
}
