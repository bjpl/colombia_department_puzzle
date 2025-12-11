/**
 * useModalAccessibility Hook
 *
 * Provides comprehensive modal accessibility features:
 * - Escape key handling with optional confirmation
 * - Background scroll prevention
 * - Scroll position restoration
 * - iOS Safari scroll lock
 * - Scrollbar width compensation
 * - Nested modal support
 */

import { useEffect, useRef } from 'react';

export interface UseModalAccessibilityOptions {
  isOpen: boolean;
  onClose: () => void;
  disableEscapeKey?: boolean;
  onEscapeKeyDown?: (event: KeyboardEvent) => boolean;
  modalId?: string;
}

// Track active modals for nested modal support
const activeModals = new Set<string>();
let modalCounter = 0;

// Detect iOS devices
const isIOS = (): boolean => {
  return typeof navigator !== 'undefined' && /iPad|iPhone|iPod/.test(navigator.userAgent);
};

export function useModalAccessibility(options: UseModalAccessibilityOptions): void {
  const {
    isOpen,
    onClose,
    disableEscapeKey = false,
    onEscapeKeyDown,
    modalId = `modal-${++modalCounter}`,
  } = options;

  // Store original state
  const savedScrollPosition = useRef<number>(0);
  const savedBodyPadding = useRef<string>('');
  const savedBodyOverflow = useRef<string>('');
  const savedBodyPosition = useRef<string>('');
  const savedBodyTop = useRef<string>('');
  const savedBodyWidth = useRef<string>('');
  const wasFirstModal = useRef<boolean>(false);

  useEffect(() => {
    if (!isOpen) return;

    // Add this modal to active set
    activeModals.add(modalId);

    // Only apply scroll lock for the first modal
    const isFirstModal = activeModals.size === 1;
    wasFirstModal.current = isFirstModal;

    if (isFirstModal) {
      // Save current scroll position
      savedScrollPosition.current = window.scrollY;

      // Get computed styles before modification
      const computedStyle = window.getComputedStyle(document.body);
      savedBodyPadding.current = computedStyle.paddingRight;
      savedBodyOverflow.current = document.body.style.overflow;
      savedBodyPosition.current = document.body.style.position;
      savedBodyTop.current = document.body.style.top;
      savedBodyWidth.current = document.body.style.width;

      // Calculate scrollbar width and add padding compensation
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      if (scrollbarWidth > 0) {
        const currentPadding = parseInt(savedBodyPadding.current || '0', 10);
        document.body.style.paddingRight = `${currentPadding + scrollbarWidth}px`;
      }

      // Apply scroll lock
      if (isIOS()) {
        // iOS-specific scroll lock (uses position fixed)
        document.body.style.position = 'fixed';
        document.body.style.top = `-${savedScrollPosition.current}px`;
        document.body.style.width = '100%';
        document.body.style.overflow = 'hidden';
      } else {
        // Standard scroll lock
        document.body.style.overflow = 'hidden';
      }
    }

    // Escape key handler
    const handleEscapeKey = (event: KeyboardEvent): void => {
      if (event.key === 'Escape' && !disableEscapeKey) {
        // Call optional callback and check if it allows closing
        if (onEscapeKeyDown) {
          const shouldClose = onEscapeKeyDown(event);
          if (!shouldClose) return;
        }

        onClose();
      }
    };

    // Add event listener
    document.addEventListener('keydown', handleEscapeKey);

    // Cleanup
    return () => {
      // Remove event listener
      document.removeEventListener('keydown', handleEscapeKey);

      // Remove this modal from active set
      activeModals.delete(modalId);

      // Only restore scroll for the last modal
      if (activeModals.size === 0) {
        // Restore body styles
        if (isIOS()) {
          document.body.style.position = savedBodyPosition.current;
          document.body.style.top = savedBodyTop.current;
          document.body.style.width = savedBodyWidth.current;
        }

        document.body.style.overflow = savedBodyOverflow.current;
        document.body.style.paddingRight = '';

        // Restore scroll position
        window.scrollTo(0, savedScrollPosition.current);
      }
    };
  }, [isOpen, onClose, disableEscapeKey, onEscapeKeyDown, modalId]);
}

// Reset function for testing
export function resetModalState(): void {
  activeModals.clear();
  modalCounter = 0;
}
