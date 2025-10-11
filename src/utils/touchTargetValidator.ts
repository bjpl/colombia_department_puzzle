/**
 * Touch Target Validator - WCAG 2.5.5 (AAA) Compliance
 * Ensures all interactive elements meet minimum 44×44px touch target size
 *
 * Standards:
 * - iOS HIG: 44×44pt minimum
 * - Material Design: 48×48dp minimum (we use 44 for consistency with iOS)
 * - WCAG 2.5.5: 44×44 CSS pixels minimum
 */

export const MOBILE_STANDARDS = {
  minTouchTarget: 44,      // 44×44px (iOS HIG / WCAG 2.5.5)
  minSpacing: 16,          // 16px between tappable elements
  typography: {
    base: 16,              // Base font 16px (readable without zoom)
    heading: 20,           // Mobile headings
    small: 14,             // Secondary text
  },
  thumbZones: {
    easy: 'bottom 1/3',    // Natural thumb reach
    stretch: 'middle 1/3', // Requires hand adjustment
    hard: 'top 1/3',       // Two-handed or hand shift needed
  },
  animations: {
    duration: 300,         // Max 300ms (feels instant)
    fps: 60,              // Smooth on mobile devices
    easing: 'ease-out',   // Natural deceleration
  },
  safeArea: {
    top: 'env(safe-area-inset-top)',
    bottom: 'env(safe-area-inset-bottom)',
    left: 'env(safe-area-inset-left)',
    right: 'env(safe-area-inset-right)',
  }
} as const;

export interface TouchTargetDimensions {
  width: number;
  height: number;
  isValid: boolean;
  element: HTMLElement;
}

/**
 * Validates if an element meets minimum touch target size
 */
export function validateTouchTarget(element: HTMLElement): boolean {
  const rect = element.getBoundingClientRect();
  return rect.width >= MOBILE_STANDARDS.minTouchTarget &&
         rect.height >= MOBILE_STANDARDS.minTouchTarget;
}

/**
 * Gets detailed touch target dimensions and validation status
 */
export function getTouchTargetDimensions(element: HTMLElement): TouchTargetDimensions {
  const rect = element.getBoundingClientRect();
  return {
    width: rect.width,
    height: rect.height,
    isValid: validateTouchTarget(element),
    element,
  };
}

/**
 * Validates spacing between adjacent touch targets
 */
export function validateTouchTargetSpacing(
  element1: HTMLElement,
  element2: HTMLElement
): boolean {
  const rect1 = element1.getBoundingClientRect();
  const rect2 = element2.getBoundingClientRect();

  // Calculate minimum distance between edges
  const horizontalGap = Math.abs(rect2.left - rect1.right);
  const verticalGap = Math.abs(rect2.top - rect1.bottom);

  const minGap = Math.min(horizontalGap, verticalGap);
  return minGap >= MOBILE_STANDARDS.minSpacing;
}

/**
 * Scans all interactive elements on page and validates touch targets
 */
export function auditTouchTargets(
  container: HTMLElement = document.body
): Array<{ element: HTMLElement; isValid: boolean; dimensions: TouchTargetDimensions }> {
  const interactiveSelectors = [
    'button',
    'a',
    'input',
    'select',
    'textarea',
    '[role="button"]',
    '[role="link"]',
    '[role="tab"]',
    '[tabindex="0"]',
    '[onclick]',
  ];

  const elements = container.querySelectorAll<HTMLElement>(
    interactiveSelectors.join(', ')
  );

  return Array.from(elements).map(element => {
    const dimensions = getTouchTargetDimensions(element);
    return {
      element,
      isValid: dimensions.isValid,
      dimensions,
    };
  });
}

/**
 * Console report of touch target violations (for development/testing)
 * Note: This function is intentionally kept for development debugging and test reporting
 */
export function reportTouchTargetViolations(
  container: HTMLElement = document.body
): void {
  const audit = auditTouchTargets(container);
  const violations = audit.filter(item => !item.isValid);

  // Only log in development mode
  if (import.meta.env?.DEV) {
    if (violations.length === 0) {
      console.log('✅ All touch targets meet 44×44px minimum');
      return;
    }

    console.group(`❌ ${violations.length} touch target violations found`);
    violations.forEach(({ element, dimensions }) => {
      console.log(
        `Element: ${element.tagName} ${element.className}`,
        `Size: ${dimensions.width.toFixed(1)}×${dimensions.height.toFixed(1)}px`,
        element
      );
    });
    console.groupEnd();
  }
}

/**
 * Determines which thumb zone an element is in
 * (for one-handed mobile use analysis)
 */
export function getThumbZone(element: HTMLElement): 'easy' | 'stretch' | 'hard' {
  const rect = element.getBoundingClientRect();
  const centerY = rect.top + rect.height / 2;
  const viewportHeight = window.innerHeight;

  const relativePosition = centerY / viewportHeight;

  if (relativePosition > 0.67) return 'easy';    // Bottom third
  if (relativePosition > 0.33) return 'stretch'; // Middle third
  return 'hard';                                 // Top third
}

/**
 * Applies minimum touch target size to element via inline styles
 * Use for dynamic enforcement
 */
export function enforceTouchTarget(element: HTMLElement): void {
  const rect = element.getBoundingClientRect();

  if (rect.width < MOBILE_STANDARDS.minTouchTarget) {
    element.style.minWidth = `${MOBILE_STANDARDS.minTouchTarget}px`;
  }

  if (rect.height < MOBILE_STANDARDS.minTouchTarget) {
    element.style.minHeight = `${MOBILE_STANDARDS.minTouchTarget}px`;
  }
}

/**
 * Development mode: Auto-highlight touch target violations
 */
export function highlightTouchTargetViolations(
  container: HTMLElement = document.body,
  enabled: boolean = true
): () => void {
  if (!enabled) return () => {};

  const audit = auditTouchTargets(container);
  const violations = audit.filter(item => !item.isValid);

  // Add visual indicators
  violations.forEach(({ element }) => {
    element.style.outline = '2px solid red';
    element.style.outlineOffset = '2px';
    element.setAttribute('data-touch-target-violation', 'true');
  });

  // Return cleanup function
  return () => {
    violations.forEach(({ element }) => {
      element.style.outline = '';
      element.style.outlineOffset = '';
      element.removeAttribute('data-touch-target-violation');
    });
  };
}
