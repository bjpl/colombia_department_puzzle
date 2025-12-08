/**
 * Touch Target Validator Tests
 *
 * Validates the TouchTargetValidator utility for WCAG AAA compliance checking.
 *
 * @vitest-environment jsdom
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { TouchTargetValidator } from './touch-target-validator';

describe('TouchTargetValidator', () => {
  let container: HTMLDivElement;
  let validator: TouchTargetValidator;

  /**
   * Mock getBoundingClientRect for JSDOM
   * JSDOM doesn't perform layout calculations, so we mock based on styles
   */
  const mockGetBoundingClientRect = (element: HTMLElement) => {
    const style = element.style;
    const width = parseFloat(style.width) || 0;
    const height = parseFloat(style.height) || 0;
    const padding = parseFloat(style.padding) || 0;
    const paddingLeft = parseFloat(style.paddingLeft) || padding;
    const paddingRight = parseFloat(style.paddingRight) || padding;
    const paddingTop = parseFloat(style.paddingTop) || padding;
    const paddingBottom = parseFloat(style.paddingBottom) || padding;
    const minWidth = parseFloat(style.minWidth) || 0;
    const minHeight = parseFloat(style.minHeight) || 0;

    const computedWidth = Math.max(width + paddingLeft + paddingRight, minWidth);
    const computedHeight = Math.max(height + paddingTop + paddingBottom, minHeight);

    // Calculate position
    const left = parseFloat(style.left) || 0;
    const top = parseFloat(style.top) || 0;
    const marginLeft = parseFloat(style.marginLeft) || 0;
    const marginTop = parseFloat(style.marginTop) || 0;

    return {
      width: computedWidth,
      height: computedHeight,
      left: left + marginLeft,
      right: left + marginLeft + computedWidth,
      top: top + marginTop,
      bottom: top + marginTop + computedHeight,
      x: left + marginLeft,
      y: top + marginTop,
      toJSON: () => ({}),
    } as DOMRect;
  };

  beforeEach(() => {
    container = document.createElement('div');
    container.id = 'test-container';
    document.body.appendChild(container);

    validator = new TouchTargetValidator();

    // Mock getBoundingClientRect for all elements
    const originalGetBoundingClientRect = Element.prototype.getBoundingClientRect;
    vi.spyOn(Element.prototype, 'getBoundingClientRect').mockImplementation(function (this: HTMLElement) {
      if (this.isConnected && (this === container || container.contains(this))) {
        return mockGetBoundingClientRect(this);
      }
      return originalGetBoundingClientRect.call(this);
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
    if (container.parentNode) {
      document.body.removeChild(container);
    }
  });

  describe('Constructor', () => {
    it('should use default values when no options provided', () => {
      const defaultValidator = new TouchTargetValidator();

      expect(defaultValidator.getMinSize()).toBe(44);
      expect(defaultValidator.getMinSpacing()).toBe(8);
    });

    it('should accept custom minimum size', () => {
      const customValidator = new TouchTargetValidator({ minSize: 48 });

      expect(customValidator.getMinSize()).toBe(48);
      expect(customValidator.getMinSpacing()).toBe(8);
    });

    it('should accept custom minimum spacing', () => {
      const customValidator = new TouchTargetValidator({ minSpacing: 16 });

      expect(customValidator.getMinSize()).toBe(44);
      expect(customValidator.getMinSpacing()).toBe(16);
    });

    it('should accept both custom values', () => {
      const customValidator = new TouchTargetValidator({
        minSize: 48,
        minSpacing: 12
      });

      expect(customValidator.getMinSize()).toBe(48);
      expect(customValidator.getMinSpacing()).toBe(12);
    });
  });

  describe('checkElementSize', () => {
    it('should pass for compliant 44x44px button', () => {
      const button = document.createElement('button');
      button.style.width = '44px';
      button.style.height = '44px';
      container.appendChild(button);

      const result = validator.checkElementSize(button);

      expect(result.compliant).toBe(true);
      expect(result.width).toBe(44);
      expect(result.height).toBe(44);
      expect(result.violation).toBeUndefined();
    });

    it('should pass for larger buttons', () => {
      const button = document.createElement('button');
      button.style.width = '100px';
      button.style.height = '48px';
      container.appendChild(button);

      const result = validator.checkElementSize(button);

      expect(result.compliant).toBe(true);
      expect(result.width).toBe(100);
      expect(result.height).toBe(48);
    });

    it('should fail for button too narrow', () => {
      const button = document.createElement('button');
      button.style.width = '40px';
      button.style.height = '44px';
      container.appendChild(button);

      const result = validator.checkElementSize(button);

      expect(result.compliant).toBe(false);
      expect(result.violation).toContain('width 40px < 44px');
    });

    it('should fail for button too short', () => {
      const button = document.createElement('button');
      button.style.width = '44px';
      button.style.height = '40px';
      container.appendChild(button);

      const result = validator.checkElementSize(button);

      expect(result.compliant).toBe(false);
      expect(result.violation).toContain('height 40px < 44px');
    });

    it('should fail for button too small in both dimensions', () => {
      const button = document.createElement('button');
      button.style.width = '30px';
      button.style.height = '30px';
      container.appendChild(button);

      const result = validator.checkElementSize(button);

      expect(result.compliant).toBe(false);
      expect(result.violation).toContain('width 30px < 44px');
      expect(result.violation).toContain('height 30px < 44px');
    });

    it('should account for padding in calculations', () => {
      const button = document.createElement('button');
      button.style.width = '20px';
      button.style.height = '20px';
      button.style.padding = '12px'; // Total: 44x44px
      container.appendChild(button);

      const result = validator.checkElementSize(button);

      expect(result.compliant).toBe(true);
      expect(result.width).toBe(44);
      expect(result.height).toBe(44);
    });

    it('should handle elements with minWidth/minHeight', () => {
      const button = document.createElement('button');
      button.style.minWidth = '44px';
      button.style.minHeight = '44px';
      container.appendChild(button);

      const result = validator.checkElementSize(button);

      expect(result.compliant).toBe(true);
    });
  });

  describe('checkTouchTargetSpacing', () => {
    it('should pass for well-spaced buttons', () => {
      const button1 = document.createElement('button');
      button1.style.width = '44px';
      button1.style.height = '44px';
      button1.style.left = '0px';
      button1.style.top = '0px';

      const button2 = document.createElement('button');
      button2.style.width = '44px';
      button2.style.height = '44px';
      button2.style.left = '60px'; // 60 - 44 = 16px spacing
      button2.style.top = '0px';

      container.appendChild(button1);
      container.appendChild(button2);

      const violations = validator.checkTouchTargetSpacing([button1, button2]);

      expect(violations).toHaveLength(0);
    });

    it('should detect horizontal spacing violation', () => {
      const button1 = document.createElement('button');
      button1.style.width = '44px';
      button1.style.height = '44px';
      button1.style.left = '0px';
      button1.style.top = '0px';

      const button2 = document.createElement('button');
      button2.style.width = '44px';
      button2.style.height = '44px';
      button2.style.left = '48px'; // Only 4px spacing
      button2.style.top = '0px';

      container.appendChild(button1);
      container.appendChild(button2);

      const violations = validator.checkTouchTargetSpacing([button1, button2]);

      expect(violations.length).toBeGreaterThan(0);
      expect(violations[0].violation).toContain('Insufficient spacing');
      expect(violations[0].violation).toContain('horizontal');
    });

    it('should detect vertical spacing violation', () => {
      const button1 = document.createElement('button');
      button1.style.width = '44px';
      button1.style.height = '44px';
      button1.style.left = '0px';
      button1.style.top = '0px';

      const button2 = document.createElement('button');
      button2.style.width = '44px';
      button2.style.height = '44px';
      button2.style.left = '0px';
      button2.style.top = '48px'; // Only 4px spacing

      container.appendChild(button1);
      container.appendChild(button2);

      const violations = validator.checkTouchTargetSpacing([button1, button2]);

      expect(violations.length).toBeGreaterThan(0);
      expect(violations[0].violation).toContain('Insufficient spacing');
      expect(violations[0].violation).toContain('vertical');
    });

    it('should not flag non-adjacent elements', () => {
      const button1 = document.createElement('button');
      button1.style.width = '44px';
      button1.style.height = '44px';
      button1.style.left = '0px';
      button1.style.top = '0px';

      const button2 = document.createElement('button');
      button2.style.width = '44px';
      button2.style.height = '44px';
      button2.style.left = '100px';
      button2.style.top = '100px';

      container.appendChild(button1);
      container.appendChild(button2);

      const violations = validator.checkTouchTargetSpacing([button1, button2]);

      expect(violations).toHaveLength(0);
    });

    it('should handle empty array', () => {
      const violations = validator.checkTouchTargetSpacing([]);

      expect(violations).toHaveLength(0);
    });

    it('should handle single element', () => {
      const button = document.createElement('button');
      button.style.width = '44px';
      button.style.height = '44px';
      container.appendChild(button);

      const violations = validator.checkTouchTargetSpacing([button]);

      expect(violations).toHaveLength(0);
    });
  });

  describe('validateButtonGroup', () => {
    it('should find all buttons in container', () => {
      const button1 = document.createElement('button');
      button1.style.width = '44px';
      button1.style.height = '44px';

      const button2 = document.createElement('button');
      button2.style.width = '44px';
      button2.style.height = '44px';

      container.appendChild(button1);
      container.appendChild(button2);

      const report = validator.validateButtonGroup(container);

      expect(report.totalElements).toBe(2);
    });

    it('should detect multiple interactive element types', () => {
      const button = document.createElement('button');
      button.style.width = '44px';
      button.style.height = '44px';

      const link = document.createElement('a');
      link.href = '#';
      link.style.width = '44px';
      link.style.height = '44px';

      const submit = document.createElement('input');
      submit.type = 'submit';
      submit.style.width = '44px';
      submit.style.height = '44px';

      container.appendChild(button);
      container.appendChild(link);
      container.appendChild(submit);

      const report = validator.validateButtonGroup(container);

      expect(report.totalElements).toBe(3);
    });

    it('should include elements with role="button"', () => {
      const div = document.createElement('div');
      div.setAttribute('role', 'button');
      div.style.width = '44px';
      div.style.height = '44px';

      container.appendChild(div);

      const report = validator.validateButtonGroup(container);

      expect(report.totalElements).toBe(1);
    });

    it('should calculate correct compliance rate', () => {
      const button1 = document.createElement('button');
      button1.style.width = '44px';
      button1.style.height = '44px';

      const button2 = document.createElement('button');
      button2.style.width = '30px';
      button2.style.height = '30px';

      container.appendChild(button1);
      container.appendChild(button2);

      const report = validator.validateButtonGroup(container);

      expect(report.totalElements).toBe(2);
      expect(report.compliant).toBe(1);
      expect(report.complianceRate).toBe(0.5);
      expect(report.violations).toHaveLength(1);
    });
  });

  describe('generateReport', () => {
    it('should generate report with 100% compliance', () => {
      const buttons = [];
      for (let i = 0; i < 5; i++) {
        const button = document.createElement('button');
        button.style.width = '44px';
        button.style.height = '44px';
        button.style.left = `${i * 60}px`;
        button.style.top = '0px';
        container.appendChild(button);
        buttons.push(button);
      }

      const report = validator.generateReport(buttons);

      expect(report.totalElements).toBe(5);
      expect(report.compliant).toBe(5);
      expect(report.violations).toHaveLength(0);
      expect(report.complianceRate).toBe(1);
    });

    it('should generate report with mixed compliance', () => {
      const button1 = document.createElement('button');
      button1.style.width = '44px';
      button1.style.height = '44px';

      const button2 = document.createElement('button');
      button2.style.width = '30px'; // Too small
      button2.style.height = '30px';

      const button3 = document.createElement('button');
      button3.style.width = '48px';
      button3.style.height = '48px';

      container.appendChild(button1);
      container.appendChild(button2);
      container.appendChild(button3);

      const report = validator.generateReport([button1, button2, button3]);

      expect(report.totalElements).toBe(3);
      expect(report.compliant).toBe(2);
      expect(report.violations).toHaveLength(1);
      expect(report.complianceRate).toBe(0.67); // Rounded to 2 decimals
    });

    it('should combine size and spacing violations', () => {
      const button1 = document.createElement('button');
      button1.style.width = '30px'; // Too small
      button1.style.height = '30px';
      button1.style.left = '0px';
      button1.style.top = '0px';

      const button2 = document.createElement('button');
      button2.style.width = '44px';
      button2.style.height = '44px';
      button2.style.left = '35px'; // Too close (5px spacing)
      button2.style.top = '0px';

      container.appendChild(button1);
      container.appendChild(button2);

      const report = validator.generateReport([button1, button2]);

      expect(report.violations.length).toBeGreaterThan(0);

      // Check that button1 has both size and spacing violations
      const button1Violation = report.violations.find(v => v.element === button1);
      if (button1Violation) {
        expect(button1Violation.violation).toContain('width');
        expect(button1Violation.violation).toContain('height');
      }
    });

    it('should handle empty array', () => {
      const report = validator.generateReport([]);

      expect(report.totalElements).toBe(0);
      expect(report.compliant).toBe(0);
      expect(report.violations).toHaveLength(0);
      expect(report.complianceRate).toBe(1); // 100% when no elements
    });

    it('should return correct compliance rate with 0 compliant', () => {
      const button1 = document.createElement('button');
      button1.style.width = '20px';
      button1.style.height = '20px';

      const button2 = document.createElement('button');
      button2.style.width = '30px';
      button2.style.height = '30px';

      container.appendChild(button1);
      container.appendChild(button2);

      const report = validator.generateReport([button1, button2]);

      expect(report.totalElements).toBe(2);
      expect(report.compliant).toBe(0);
      expect(report.complianceRate).toBe(0);
      expect(report.violations).toHaveLength(2);
    });
  });

  describe('Custom Configuration', () => {
    it('should respect custom minSize in validation', () => {
      const strictValidator = new TouchTargetValidator({ minSize: 48 });

      const button = document.createElement('button');
      button.style.width = '44px';
      button.style.height = '44px';
      container.appendChild(button);

      const result = strictValidator.checkElementSize(button);

      expect(result.compliant).toBe(false);
      expect(result.violation).toContain('width 44px < 48px');
      expect(result.violation).toContain('height 44px < 48px');
    });

    it('should respect custom minSpacing in validation', () => {
      const strictValidator = new TouchTargetValidator({ minSpacing: 16 });

      const button1 = document.createElement('button');
      button1.style.width = '44px';
      button1.style.height = '44px';
      button1.style.left = '0px';
      button1.style.top = '0px';

      const button2 = document.createElement('button');
      button2.style.width = '44px';
      button2.style.height = '44px';
      button2.style.left = '56px'; // 12px spacing (acceptable for default, not for 16px)
      button2.style.top = '0px';

      container.appendChild(button1);
      container.appendChild(button2);

      const violations = strictValidator.checkTouchTargetSpacing([button1, button2]);

      expect(violations.length).toBeGreaterThan(0);
    });
  });

  describe('Edge Cases', () => {
    it('should handle elements with decimal dimensions', () => {
      const button = document.createElement('button');
      button.style.width = '44.7px';
      button.style.height = '44.2px';
      container.appendChild(button);

      const result = validator.checkElementSize(button);

      expect(result.compliant).toBe(true);
      expect(result.width).toBe(45); // Rounded
      expect(result.height).toBe(44); // Rounded
    });

    it('should handle elements with zero dimensions', () => {
      const button = document.createElement('button');
      button.style.width = '0px';
      button.style.height = '0px';
      container.appendChild(button);

      const result = validator.checkElementSize(button);

      expect(result.compliant).toBe(false);
      expect(result.width).toBe(0);
      expect(result.height).toBe(0);
    });

    it('should handle very large elements', () => {
      const button = document.createElement('button');
      button.style.width = '500px';
      button.style.height = '100px';
      container.appendChild(button);

      const result = validator.checkElementSize(button);

      expect(result.compliant).toBe(true);
    });
  });
});
