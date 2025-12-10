/**
 * AccessibilitySettings Component Tests
 * Tests for accessibility settings panel and keyboard shortcuts
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AccessibilitySettings from '../../components/layout/AccessibilitySettings';
import { AccessibilityProvider } from '../../context/AccessibilityContext';

// Mock createPortal to render in the same tree for testing
vi.mock('react-dom', async () => {
  const actual = await vi.importActual('react-dom');
  return {
    ...actual,
    createPortal: (children: any) => children,
  };
});

// Mock useTouchFeedback to avoid potential issues with navigator.vibrate
vi.mock('../../hooks/useTouchFeedback', () => ({
  useTouchFeedback: () => ({
    settings: {
      hapticsEnabled: false,
      audioEnabled: false,
    },
    toggleHaptics: vi.fn(),
    toggleAudio: vi.fn(),
    isHapticsSupported: false,
  }),
}));

describe('AccessibilitySettings', () => {
  // Helper to render with real AccessibilityProvider
  const renderWithAccessibility = (ui: React.ReactElement) => {
    return render(
      <AccessibilityProvider>
        {ui}
      </AccessibilityProvider>
    );
  };

  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  afterEach(() => {
    // Clean up DOM and remove all event listeners
    cleanup();
  });

  describe('Button Rendering', () => {
    it('should render accessibility button', () => {
      renderWithAccessibility(<AccessibilitySettings />);

      const button = screen.getByRole('button', {
        name: /Configuración de accesibilidad/i,
      });
      expect(button).toBeInTheDocument();
    });

    it('should have proper ARIA attributes on button', () => {
      renderWithAccessibility(<AccessibilitySettings />);

      const button = screen.getByRole('button', {
        name: /Configuración de accesibilidad/i,
      });
      expect(button).toHaveAttribute('aria-expanded', 'false');
    });

    it('should show icon SVG', () => {
      renderWithAccessibility(<AccessibilitySettings />);

      const svg = document.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });
  });

  describe('Panel Opening/Closing', () => {
    it('should open panel when button clicked', async () => {
      const user = userEvent.setup();
      renderWithAccessibility(<AccessibilitySettings />);

      const button = screen.getByRole('button', {
        name: /Configuración de accesibilidad/i,
      });
      await user.click(button);

      expect(
        screen.getByText(/Configuración de Accesibilidad/i)
      ).toBeInTheDocument();
    });

    it('should update aria-expanded when opened', async () => {
      const user = userEvent.setup();
      renderWithAccessibility(<AccessibilitySettings />);

      const button = screen.getByRole('button', {
        name: /Configuración de accesibilidad/i,
      });
      await user.click(button);

      expect(button).toHaveAttribute('aria-expanded', 'true');
    });

    it('should close panel when close button clicked', async () => {
      const user = userEvent.setup();
      renderWithAccessibility(<AccessibilitySettings />);

      const openButton = screen.getByRole('button', {
        name: /Configuración de accesibilidad/i,
      });
      await user.click(openButton);

      const closeButton = screen.getByRole('button', { name: /Cerrar/i });
      await user.click(closeButton);

      await waitFor(() => {
        expect(
          screen.queryByText(/Configuración de Accesibilidad/i)
        ).not.toBeInTheDocument();
      });
    });

    it('should toggle panel on repeated button clicks', async () => {
      const user = userEvent.setup();
      renderWithAccessibility(<AccessibilitySettings />);

      const button = screen.getByRole('button', {
        name: /Configuración de accesibilidad/i,
      });

      // Open
      await user.click(button);
      expect(
        screen.getByText(/Configuración de Accesibilidad/i)
      ).toBeInTheDocument();

      // Close
      await user.click(button);
      await waitFor(() => {
        expect(
          screen.queryByText(/Configuración de Accesibilidad/i)
        ).not.toBeInTheDocument();
      });
    });
  });

  describe('Keyboard Shortcuts', () => {
    it('should open panel when "a" key pressed', async () => {
      renderWithAccessibility(<AccessibilitySettings />);

      const event = new KeyboardEvent('keydown', { key: 'a' });
      window.dispatchEvent(event);

      await waitFor(() => {
        expect(
          screen.getByText(/Configuración de Accesibilidad/i)
        ).toBeInTheDocument();
      });
    });

    it('should not trigger in input fields', async () => {
      renderWithAccessibility(
        <div>
          <input type="text" />
          <AccessibilitySettings />
        </div>
      );

      const input = screen.getByRole('textbox');
      input.focus();

      const event = new KeyboardEvent('keydown', { key: 'a', bubbles: true });
      input.dispatchEvent(event);

      await waitFor(() => {
        expect(
          screen.queryByText(/Configuración de Accesibilidad/i)
        ).not.toBeInTheDocument();
      });
    });

    it('should close panel when Escape pressed', async () => {
      const user = userEvent.setup();
      renderWithAccessibility(<AccessibilitySettings />);

      // Open panel
      const button = screen.getByRole('button', {
        name: /Configuración de accesibilidad/i,
      });
      await user.click(button);

      // Press Escape
      await user.keyboard('{Escape}');

      await waitFor(() => {
        expect(
          screen.queryByText(/Configuración de Accesibilidad/i)
        ).not.toBeInTheDocument();
      });
    });
  });

  describe('Color Vision Settings', () => {
    it('should display color mode selector', async () => {
      const user = userEvent.setup();
      renderWithAccessibility(<AccessibilitySettings />);

      const button = screen.getByRole('button', {
        name: /Configuración de accesibilidad/i,
      });
      await user.click(button);

      // Check for the label text and the combobox
      expect(screen.getByText(/Modo de visión de color/i)).toBeInTheDocument();
      expect(screen.getByRole('combobox')).toBeInTheDocument();
    });

    it('should have all color mode options', async () => {
      const user = userEvent.setup();
      renderWithAccessibility(<AccessibilitySettings />);

      const button = screen.getByRole('button', {
        name: /Configuración de accesibilidad/i,
      });
      await user.click(button);

      const select = screen.getByRole('combobox');
      expect(select).toBeInTheDocument();

      // Check for options
      expect(screen.getByRole('option', { name: /Visión normal/i })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: /Protanopia/i })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: /Deuteranopia/i })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: /Tritanopia/i })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: /Monocromático/i })).toBeInTheDocument();
    });

    it('should change color mode when selected', async () => {
      const user = userEvent.setup();
      renderWithAccessibility(<AccessibilitySettings />);

      const button = screen.getByRole('button', {
        name: /Configuración de accesibilidad/i,
      });
      await user.click(button);

      const select = screen.getByRole('combobox');
      await user.selectOptions(select, 'protanopia');

      // Check that the select value changed
      expect(select).toHaveValue('protanopia');

      // Check that localStorage was updated
      const savedSettings = JSON.parse(localStorage.getItem('accessibilitySettings') || '{}');
      expect(savedSettings.colorMode).toBe('protanopia');
    });

    it('should call onColorModeChange callback', async () => {
      const user = userEvent.setup();
      const mockCallback = vi.fn();

      renderWithAccessibility(
        <AccessibilitySettings onColorModeChange={mockCallback} />
      );

      const button = screen.getByRole('button', {
        name: /Configuración de accesibilidad/i,
      });
      await user.click(button);

      const select = screen.getByRole('combobox');
      await user.selectOptions(select, 'deuteranopia');

      expect(mockCallback).toHaveBeenCalledWith('deuteranopia');
    });
  });

  describe('Keyboard Shortcuts Info', () => {
    it('should display keyboard shortcuts section', async () => {
      const user = userEvent.setup();
      renderWithAccessibility(<AccessibilitySettings />);

      const button = screen.getByRole('button', {
        name: /Configuración de accesibilidad/i,
      });
      await user.click(button);

      expect(screen.getByText(/Atajos de teclado/i)).toBeInTheDocument();
    });

    it('should list Tab shortcut', async () => {
      const user = userEvent.setup();
      renderWithAccessibility(<AccessibilitySettings />);

      const button = screen.getByRole('button', {
        name: /Configuración de accesibilidad/i,
      });
      await user.click(button);

      expect(screen.getByText(/Navegar entre elementos/i)).toBeInTheDocument();
    });

    it('should list Enter shortcut', async () => {
      const user = userEvent.setup();
      renderWithAccessibility(<AccessibilitySettings />);

      const button = screen.getByRole('button', {
        name: /Configuración de accesibilidad/i,
      });
      await user.click(button);

      expect(screen.getByText(/Seleccionar elemento/i)).toBeInTheDocument();
    });

    it('should list Escape shortcut', async () => {
      const user = userEvent.setup();
      renderWithAccessibility(<AccessibilitySettings />);

      const button = screen.getByRole('button', {
        name: /Configuración de accesibilidad/i,
      });
      await user.click(button);

      expect(screen.getByText(/Cerrar diálogos/i)).toBeInTheDocument();
    });
  });

  describe('Panel Positioning', () => {
    it('should position panel dynamically based on button location', async () => {
      const user = userEvent.setup();

      // Mock button position
      const mockGetBoundingClientRect = vi.fn(() => ({
        left: 100,
        right: 150,
        top: 50,
        bottom: 80,
        width: 50,
        height: 30,
      }));

      renderWithAccessibility(<AccessibilitySettings />);

      const button = screen.getByRole('button', {
        name: /Configuración de accesibilidad/i,
      });

      // Mock the getBoundingClientRect method
      button.getBoundingClientRect = mockGetBoundingClientRect as any;

      await user.click(button);

      // Panel should be positioned with inline styles
      const panel = document.querySelector('.fixed.w-80');
      expect(panel).toBeInTheDocument();
      expect(panel).toHaveClass('fixed');
      // Check that inline positioning styles are applied (top and left are calculated)
      expect(panel).toHaveAttribute('style');
      const style = panel?.getAttribute('style');
      expect(style).toContain('top:');
      expect(style).toContain('left:');
    });
  });

  describe('Click Outside', () => {
    it('should close panel when clicking outside', async () => {
      const user = userEvent.setup();
      renderWithAccessibility(
        <div>
          <div data-testid="outside">Outside</div>
          <AccessibilitySettings />
        </div>
      );

      const button = screen.getByRole('button', {
        name: /Configuración de accesibilidad/i,
      });
      await user.click(button);

      expect(
        screen.getByText(/Configuración de Accesibilidad/i)
      ).toBeInTheDocument();

      // Click outside
      const outside = screen.getByTestId('outside');
      await user.click(outside);

      await waitFor(() => {
        expect(
          screen.queryByText(/Configuración de Accesibilidad/i)
        ).not.toBeInTheDocument();
      });
    });

    it('should not close when clicking inside panel', async () => {
      const user = userEvent.setup();
      renderWithAccessibility(<AccessibilitySettings />);

      const button = screen.getByRole('button', {
        name: /Configuración de accesibilidad/i,
      });
      await user.click(button);

      const heading = screen.getByText(/Configuración de Accesibilidad/i);
      await user.click(heading);

      // Panel should still be open
      expect(heading).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper heading structure in panel', async () => {
      const user = userEvent.setup();
      renderWithAccessibility(<AccessibilitySettings />);

      const button = screen.getByRole('button', {
        name: /Configuración de accesibilidad/i,
      });
      await user.click(button);

      const heading = screen.getByRole('heading', {
        name: /Configuración de Accesibilidad/i,
      });
      expect(heading).toBeInTheDocument();
    });

    it('should have keyboard focusable elements', async () => {
      const user = userEvent.setup();
      renderWithAccessibility(<AccessibilitySettings />);

      const button = screen.getByRole('button', {
        name: /Configuración de accesibilidad/i,
      });
      await user.click(button);

      // Tab through elements
      await user.tab();
      const select = screen.getByRole('combobox');
      expect(select).toHaveFocus();
    });
  });
});
