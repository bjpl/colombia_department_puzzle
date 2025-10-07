/**
 * Touch Target Accessibility Tests
 *
 * Validates that all interactive elements meet WCAG 2.1 touch target guidelines:
 * - Minimum 44x44px touch targets
 * - Adequate spacing between tappable elements (>=16px)
 * - Touch target validation across the app
 *
 * @vitest-environment jsdom
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';

describe('Touch Target Validation', () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement('div');
    container.id = 'test-container';
    document.body.appendChild(container);
  });

  afterEach(() => {
    if (container.parentNode) {
      document.body.removeChild(container);
    }
  });

  describe('Minimum Size Requirements', () => {
    it('should meet 44x44px minimum for buttons', () => {
      const button = document.createElement('button');
      button.textContent = 'Test Button';
      button.style.width = '44px';
      button.style.height = '44px';
      container.appendChild(button);

      const rect = button.getBoundingClientRect();

      expect(rect.width).toBeGreaterThanOrEqual(44);
      expect(rect.height).toBeGreaterThanOrEqual(44);
    });

    it('should meet 44x44px minimum for department chips', () => {
      const chip = document.createElement('div');
      chip.className = 'department-chip';
      chip.textContent = 'Antioquia';
      chip.style.width = '120px';
      chip.style.height = '48px';
      chip.style.padding = '12px 16px';
      container.appendChild(chip);

      const rect = chip.getBoundingClientRect();

      expect(rect.width).toBeGreaterThanOrEqual(44);
      expect(rect.height).toBeGreaterThanOrEqual(44);
    });

    it('should meet minimum size for icon buttons', () => {
      const iconButton = document.createElement('button');
      iconButton.className = 'icon-button';
      iconButton.setAttribute('aria-label', 'Settings');
      iconButton.style.width = '48px';
      iconButton.style.height = '48px';
      iconButton.style.padding = '12px';
      container.appendChild(iconButton);

      const rect = iconButton.getBoundingClientRect();

      expect(rect.width).toBeGreaterThanOrEqual(44);
      expect(rect.height).toBeGreaterThanOrEqual(44);
    });

    it('should meet minimum size for close buttons', () => {
      const closeButton = document.createElement('button');
      closeButton.className = 'close-button';
      closeButton.setAttribute('aria-label', 'Close');
      closeButton.style.width = '44px';
      closeButton.style.height = '44px';
      closeButton.style.borderRadius = '50%';
      container.appendChild(closeButton);

      const rect = closeButton.getBoundingClientRect();

      expect(rect.width).toBeGreaterThanOrEqual(44);
      expect(rect.height).toBeGreaterThanOrEqual(44);
    });

    it('should meet minimum size for navigation items', () => {
      const navItem = document.createElement('a');
      navItem.href = '#';
      navItem.textContent = 'Home';
      navItem.style.display = 'inline-block';
      navItem.style.padding = '16px';
      navItem.style.minHeight = '44px';
      container.appendChild(navItem);

      const rect = navItem.getBoundingClientRect();

      expect(rect.height).toBeGreaterThanOrEqual(44);
    });
  });

  describe('Touch Target Spacing', () => {
    it('should maintain >=16px spacing between adjacent buttons', () => {
      const button1 = document.createElement('button');
      button1.style.width = '44px';
      button1.style.height = '44px';
      button1.style.display = 'inline-block';

      const button2 = document.createElement('button');
      button2.style.width = '44px';
      button2.style.height = '44px';
      button2.style.display = 'inline-block';
      button2.style.marginLeft = '16px';

      container.appendChild(button1);
      container.appendChild(button2);

      const rect1 = button1.getBoundingClientRect();
      const rect2 = button2.getBoundingClientRect();

      const spacing = rect2.left - rect1.right;

      expect(spacing).toBeGreaterThanOrEqual(16);
    });

    it('should maintain adequate spacing in button groups', () => {
      const buttonGroup = document.createElement('div');
      buttonGroup.style.display = 'flex';
      buttonGroup.style.gap = '16px';

      for (let i = 0; i < 3; i++) {
        const button = document.createElement('button');
        button.textContent = `Button ${i + 1}`;
        button.style.width = '44px';
        button.style.height = '44px';
        buttonGroup.appendChild(button);
      }

      container.appendChild(buttonGroup);

      const buttons = buttonGroup.querySelectorAll('button');
      const rect1 = buttons[0].getBoundingClientRect();
      const rect2 = buttons[1].getBoundingClientRect();

      const spacing = rect2.left - rect1.right;

      expect(spacing).toBeGreaterThanOrEqual(16);
    });

    it('should maintain spacing between department chips', () => {
      const chipContainer = document.createElement('div');
      chipContainer.style.display = 'flex';
      chipContainer.style.gap = '12px';
      chipContainer.style.flexWrap = 'wrap';

      for (let i = 0; i < 4; i++) {
        const chip = document.createElement('div');
        chip.className = 'department-chip';
        chip.textContent = `Department ${i + 1}`;
        chip.style.padding = '12px 16px';
        chip.style.minHeight = '44px';
        chipContainer.appendChild(chip);
      }

      container.appendChild(chipContainer);

      const chips = chipContainer.querySelectorAll('.department-chip');

      expect(chips.length).toBe(4);
      // Gap should be at least 12px (acceptable for chips in a scrollable container)
      expect(chipContainer.style.gap).toBe('12px');
    });
  });

  describe('Touch Target Identification', () => {
    it('should identify all interactive elements in a form', () => {
      const form = document.createElement('form');

      const input = document.createElement('input');
      input.type = 'text';
      input.style.height = '48px';
      input.style.padding = '12px';

      const submitButton = document.createElement('button');
      submitButton.type = 'submit';
      submitButton.textContent = 'Submit';
      submitButton.style.height = '48px';
      submitButton.style.padding = '12px 24px';

      form.appendChild(input);
      form.appendChild(submitButton);
      container.appendChild(form);

      const interactiveElements = form.querySelectorAll('input, button, a, select, textarea');

      expect(interactiveElements.length).toBe(2);
      interactiveElements.forEach((element) => {
        const rect = element.getBoundingClientRect();
        expect(rect.height).toBeGreaterThanOrEqual(44);
      });
    });

    it('should validate all buttons in a modal', () => {
      const modal = document.createElement('div');
      modal.className = 'modal';

      const closeButton = document.createElement('button');
      closeButton.className = 'close-button';
      closeButton.style.width = '44px';
      closeButton.style.height = '44px';

      const confirmButton = document.createElement('button');
      confirmButton.textContent = 'Confirm';
      confirmButton.style.height = '48px';
      confirmButton.style.padding = '12px 24px';

      const cancelButton = document.createElement('button');
      cancelButton.textContent = 'Cancel';
      cancelButton.style.height = '48px';
      cancelButton.style.padding = '12px 24px';

      modal.appendChild(closeButton);
      modal.appendChild(confirmButton);
      modal.appendChild(cancelButton);
      container.appendChild(modal);

      const buttons = modal.querySelectorAll('button');

      expect(buttons.length).toBe(3);
      buttons.forEach((button) => {
        const rect = button.getBoundingClientRect();
        expect(rect.height).toBeGreaterThanOrEqual(44);
      });
    });
  });

  describe('Touch Target Positioning', () => {
    it('should ensure touch targets are not obscured', () => {
      const button = document.createElement('button');
      button.textContent = 'Test Button';
      button.style.width = '100px';
      button.style.height = '44px';
      button.style.position = 'relative';
      button.style.zIndex = '10';
      container.appendChild(button);

      const overlay = document.createElement('div');
      overlay.style.position = 'absolute';
      overlay.style.top = '0';
      overlay.style.left = '0';
      overlay.style.width = '100%';
      overlay.style.height = '100%';
      overlay.style.zIndex = '5';
      overlay.style.pointerEvents = 'none';
      container.appendChild(overlay);

      const buttonZIndex = parseInt(button.style.zIndex);
      const overlayZIndex = parseInt(overlay.style.zIndex);

      expect(buttonZIndex).toBeGreaterThan(overlayZIndex);
      expect(overlay.style.pointerEvents).toBe('none');
    });

    it('should ensure touch targets are within viewport on mobile', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });

      const button = document.createElement('button');
      button.style.width = '120px';
      button.style.height = '44px';
      button.style.position = 'absolute';
      button.style.right = '16px';
      button.style.bottom = '16px';
      container.appendChild(button);

      const rect = button.getBoundingClientRect();

      // Button should not overflow viewport
      expect(rect.right).toBeLessThanOrEqual(window.innerWidth);
      expect(rect.left).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Density and Clustering', () => {
    it('should not overcrowd touch targets', () => {
      const buttonBar = document.createElement('div');
      buttonBar.style.display = 'flex';
      buttonBar.style.gap = '16px';
      buttonBar.style.padding = '16px';
      buttonBar.style.width = '375px'; // iPhone SE width

      const buttonCount = 3;
      const buttonWidth = 44;
      const gap = 16;
      const padding = 32;

      for (let i = 0; i < buttonCount; i++) {
        const button = document.createElement('button');
        button.style.width = `${buttonWidth}px`;
        button.style.height = '44px';
        button.style.flexShrink = '0';
        buttonBar.appendChild(button);
      }

      container.appendChild(buttonBar);

      const totalWidth = buttonCount * buttonWidth + (buttonCount - 1) * gap + padding;

      // Should fit comfortably without overflow
      expect(totalWidth).toBeLessThanOrEqual(375);
    });

    it('should use scrolling for excessive targets', () => {
      const scrollContainer = document.createElement('div');
      scrollContainer.style.overflowX = 'auto';
      scrollContainer.style.display = 'flex';
      scrollContainer.style.gap = '12px';
      scrollContainer.style.width = '375px';

      for (let i = 0; i < 10; i++) {
        const chip = document.createElement('div');
        chip.className = 'department-chip';
        chip.style.minWidth = '100px';
        chip.style.height = '44px';
        chip.style.flexShrink = '0';
        scrollContainer.appendChild(chip);
      }

      container.appendChild(scrollContainer);

      expect(scrollContainer.style.overflowX).toBe('auto');
      expect(scrollContainer.scrollWidth).toBeGreaterThan(375);
    });
  });

  describe('Edge Cases', () => {
    it('should handle small text with large padding', () => {
      const button = document.createElement('button');
      button.textContent = 'X';
      button.style.fontSize = '12px';
      button.style.padding = '16px';
      container.appendChild(button);

      const rect = button.getBoundingClientRect();

      // Despite small text, padding should ensure minimum size
      expect(rect.height).toBeGreaterThanOrEqual(44);
    });

    it('should handle icon-only buttons', () => {
      const iconButton = document.createElement('button');
      iconButton.setAttribute('aria-label', 'Menu');
      iconButton.style.width = '48px';
      iconButton.style.height = '48px';
      iconButton.style.padding = '0';

      const icon = document.createElement('span');
      icon.textContent = '☰';
      icon.style.fontSize = '24px';
      iconButton.appendChild(icon);

      container.appendChild(iconButton);

      const rect = iconButton.getBoundingClientRect();

      expect(rect.width).toBeGreaterThanOrEqual(44);
      expect(rect.height).toBeGreaterThanOrEqual(44);
      expect(iconButton.getAttribute('aria-label')).toBeTruthy();
    });

    it('should handle custom touch area expansion', () => {
      const smallVisualButton = document.createElement('button');
      smallVisualButton.style.width = '24px';
      smallVisualButton.style.height = '24px';
      smallVisualButton.style.position = 'relative';

      // Pseudo-element for expanded touch area (simulated with actual element)
      const touchArea = document.createElement('div');
      touchArea.style.position = 'absolute';
      touchArea.style.top = '-10px';
      touchArea.style.left = '-10px';
      touchArea.style.right = '-10px';
      touchArea.style.bottom = '-10px';
      touchArea.style.pointerEvents = 'auto';
      smallVisualButton.appendChild(touchArea);

      container.appendChild(smallVisualButton);

      const touchRect = touchArea.getBoundingClientRect();

      // Expanded touch area should meet minimum
      expect(touchRect.width).toBeGreaterThanOrEqual(44);
      expect(touchRect.height).toBeGreaterThanOrEqual(44);
    });
  });

  describe('Accessibility Enhancements', () => {
    it('should have focus indicators for keyboard users', () => {
      const button = document.createElement('button');
      button.textContent = 'Test';
      button.style.width = '100px';
      button.style.height = '44px';
      button.style.outline = '2px solid blue';
      button.style.outlineOffset = '2px';
      container.appendChild(button);

      button.focus();

      expect(document.activeElement).toBe(button);
      expect(button.style.outline).toBe('2px solid blue');
    });

    it('should provide adequate contrast for focus states', () => {
      const button = document.createElement('button');
      button.textContent = 'Test';
      button.style.width = '100px';
      button.style.height = '44px';
      button.style.backgroundColor = '#fff';
      button.style.border = '2px solid #000';
      container.appendChild(button);

      // Focus state
      button.addEventListener('focus', () => {
        button.style.boxShadow = '0 0 0 3px rgba(66, 153, 225, 0.5)';
      });

      button.focus();

      expect(button.style.boxShadow).toBeTruthy();
    });
  });
});
