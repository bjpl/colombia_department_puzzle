/**
 * Touch Target Validator
 *
 * Validates interactive elements against WCAG AAA touch target guidelines.
 *
 * WCAG AAA Requirements:
 * - Minimum 44x44px touch targets (WCAG 2.5.5 Level AAA)
 * - Adequate spacing between targets (minimum 8px recommended)
 *
 * @module tests/utils/mobile/touch-target-validator
 */

export interface TouchTargetResult {
  element: Element;
  width: number;
  height: number;
  compliant: boolean;
  violation?: string;
}

export interface TouchTargetReport {
  totalElements: number;
  compliant: number;
  violations: TouchTargetResult[];
  complianceRate: number;
}

export interface TouchTargetValidatorOptions {
  minSize?: number;
  minSpacing?: number;
}

/**
 * Validates touch targets for WCAG AAA compliance
 *
 * @example
 * ```typescript
 * const validator = new TouchTargetValidator();
 * const button = document.querySelector('button');
 * const result = validator.checkElementSize(button);
 *
 * if (!result.compliant) {
 *   console.error(`Touch target too small: ${result.violation}`);
 * }
 * ```
 */
export class TouchTargetValidator {
  private readonly minSize: number;
  private readonly minSpacing: number;

  /**
   * Creates a new TouchTargetValidator
   *
   * @param options - Configuration options
   * @param options.minSize - Minimum touch target size in pixels (default: 44)
   * @param options.minSpacing - Minimum spacing between targets in pixels (default: 8)
   */
  constructor(options?: TouchTargetValidatorOptions) {
    this.minSize = options?.minSize ?? 44;
    this.minSpacing = options?.minSpacing ?? 8;
  }

  /**
   * Checks if a single element meets minimum size requirements
   *
   * @param element - The element to validate
   * @returns Touch target result with compliance status
   */
  checkElementSize(element: Element): TouchTargetResult {
    const rect = element.getBoundingClientRect();
    const width = Math.round(rect.width);
    const height = Math.round(rect.height);

    const compliant = width >= this.minSize && height >= this.minSize;

    const result: TouchTargetResult = {
      element,
      width,
      height,
      compliant,
    };

    if (!compliant) {
      const issues: string[] = [];
      if (width < this.minSize) {
        issues.push(`width ${width}px < ${this.minSize}px`);
      }
      if (height < this.minSize) {
        issues.push(`height ${height}px < ${this.minSize}px`);
      }
      result.violation = `Touch target too small: ${issues.join(', ')}`;
    }

    return result;
  }

  /**
   * Checks spacing between multiple touch targets
   *
   * Validates that elements maintain adequate spacing to prevent
   * accidental touches. Checks both horizontal and vertical spacing.
   *
   * @param elements - Array of elements to check spacing between
   * @returns Array of touch target results for elements with spacing violations
   */
  checkTouchTargetSpacing(elements: Element[]): TouchTargetResult[] {
    const violations: TouchTargetResult[] = [];
    const elementRects = elements.map(el => ({
      element: el,
      rect: el.getBoundingClientRect(),
    }));

    for (let i = 0; i < elementRects.length; i++) {
      const current = elementRects[i];
      let hasSpacingViolation = false;
      const nearbyElements: string[] = [];

      for (let j = 0; j < elementRects.length; j++) {
        if (i === j) continue;

        const other = elementRects[j];

        // Calculate spacing in both dimensions
        const horizontalSpacing = Math.min(
          Math.abs(other.rect.left - current.rect.right),
          Math.abs(current.rect.left - other.rect.right)
        );

        const verticalSpacing = Math.min(
          Math.abs(other.rect.top - current.rect.bottom),
          Math.abs(current.rect.top - other.rect.bottom)
        );

        // Check if elements are adjacent (overlapping in one dimension)
        const horizontallyAdjacent =
          (current.rect.top < other.rect.bottom) &&
          (current.rect.bottom > other.rect.top);

        const verticallyAdjacent =
          (current.rect.left < other.rect.right) &&
          (current.rect.right > other.rect.left);

        // Check spacing
        if (horizontallyAdjacent && horizontalSpacing < this.minSpacing) {
          hasSpacingViolation = true;
          nearbyElements.push(`element ${j} (${Math.round(horizontalSpacing)}px horizontal)`);
        }

        if (verticallyAdjacent && verticalSpacing < this.minSpacing) {
          hasSpacingViolation = true;
          nearbyElements.push(`element ${j} (${Math.round(verticalSpacing)}px vertical)`);
        }
      }

      if (hasSpacingViolation) {
        violations.push({
          element: current.element,
          width: Math.round(current.rect.width),
          height: Math.round(current.rect.height),
          compliant: false,
          violation: `Insufficient spacing to ${nearbyElements.join(', ')}. Minimum ${this.minSpacing}px required.`,
        });
      }
    }

    return violations;
  }

  /**
   * Validates a group of buttons for both size and spacing compliance
   *
   * Combines size and spacing checks for a comprehensive validation
   * of interactive elements within a container.
   *
   * @param container - Container element with interactive children
   * @returns Complete touch target report
   */
  validateButtonGroup(container: Element): TouchTargetReport {
    // Find all interactive elements
    const buttons = Array.from(
      container.querySelectorAll('button, a, input[type="button"], input[type="submit"], [role="button"]')
    );

    return this.generateReport(buttons);
  }

  /**
   * Generates a comprehensive compliance report for multiple elements
   *
   * Checks all elements for size requirements and spacing between adjacent
   * targets, then produces a detailed report with compliance metrics.
   *
   * @param elements - Array of elements to validate
   * @returns Detailed touch target compliance report
   */
  generateReport(elements: Element[]): TouchTargetReport {
    const sizeResults = elements.map(el => this.checkElementSize(el));
    const spacingViolations = this.checkTouchTargetSpacing(elements);

    // Combine size and spacing violations
    const violationMap = new Map<Element, TouchTargetResult>();

    // Add size violations
    sizeResults.forEach(result => {
      if (!result.compliant) {
        violationMap.set(result.element, result);
      }
    });

    // Add/merge spacing violations
    spacingViolations.forEach(result => {
      const existing = violationMap.get(result.element);
      if (existing) {
        // Combine violations
        existing.violation = `${existing.violation}; ${result.violation}`;
      } else {
        violationMap.set(result.element, result);
      }
    });

    const violations = Array.from(violationMap.values());
    const compliant = elements.length - violations.length;
    const complianceRate = elements.length > 0
      ? Math.round((compliant / elements.length) * 100) / 100
      : 1;

    return {
      totalElements: elements.length,
      compliant,
      violations,
      complianceRate,
    };
  }

  /**
   * Gets the minimum size requirement
   * @returns Minimum touch target size in pixels
   */
  getMinSize(): number {
    return this.minSize;
  }

  /**
   * Gets the minimum spacing requirement
   * @returns Minimum spacing between targets in pixels
   */
  getMinSpacing(): number {
    return this.minSpacing;
  }
}
