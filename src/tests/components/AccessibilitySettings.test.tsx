/**
 * AccessibilitySettings Component Tests
 * Tests for accessibility settings panel and keyboard shortcuts
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AccessibilitySettings from '../../components/AccessibilitySettings';
import {
  renderWithProviders,
  createMockAccessibilityStore,
} from '../utils/testProviders';

// Mock createPortal to render in the same tree for testing
vi.mock('react-dom', async () => {
  const actual = await vi.importActual('react-dom');
  return {
    ...actual,
    createPortal: (children: any) => children,
  };
});

describe('AccessibilitySettings', () => {
  let accessibilityStore: ReturnType<typeof createMockAccessibilityStore>;

  beforeEach(() => {
    accessibilityStore = createMockAccessibilityStore();
  });

  describe('Button Rendering', () => {
    it('should render accessibility button', () => {
      renderWithProviders(<AccessibilitySettings />, {
        accessibilityStore,
        providerType: 'accessibility',
      });

      const button = screen.getByRole('button', {
        name: /Configuración de accesibilidad/i,
      });
      expect(button).toBeInTheDocument();
    });

    it('should have proper ARIA attributes on button', () => {
      renderWithProviders(<AccessibilitySettings />, {
        accessibilityStore,
        providerType: 'accessibility',
      });

      const button = screen.getByRole('button', {
        name: /Configuración de accesibilidad/i,
      });
      expect(button).toHaveAttribute('aria-expanded', 'false');
    });

    it('should show icon SVG', () => {
      renderWithProviders(<AccessibilitySettings />, {
        accessibilityStore,
        providerType: 'accessibility',
      });

      const svg = document.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });
  });

  describe('Panel Opening/Closing', () => {
    it('should open panel when button clicked', async () => {
      const user = userEvent.setup();
      renderWithProviders(<AccessibilitySettings />, {
        accessibilityStore,
        providerType: 'accessibility',
      });

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
      renderWithProviders(<AccessibilitySettings />, {
        accessibilityStore,
        providerType: 'accessibility',
      });

      const button = screen.getByRole('button', {
        name: /Configuración de accesibilidad/i,
      });
      await user.click(button);

      expect(button).toHaveAttribute('aria-expanded', 'true');
    });

    it('should close panel when close button clicked', async () => {
      const user = userEvent.setup();
      renderWithProviders(<AccessibilitySettings />, {
        accessibilityStore,
        providerType: 'accessibility',
      });

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
      renderWithProviders(<AccessibilitySettings />, {
        accessibilityStore,
        providerType: 'accessibility',
      });

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
      renderWithProviders(<AccessibilitySettings />, {
        accessibilityStore,
        providerType: 'accessibility',
      });

      const event = new KeyboardEvent('keydown', { key: 'a' });
      window.dispatchEvent(event);

      await waitFor(() => {
        expect(
          screen.getByText(/Configuración de Accesibilidad/i)
        ).toBeInTheDocument();
      });
    });

    it('should not trigger in input fields', async () => {
      renderWithProviders(
        <div>
          <input type="text" />
          <AccessibilitySettings />
        </div>,
        {
          accessibilityStore,
          providerType: 'accessibility',
        }
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
      renderWithProviders(<AccessibilitySettings />, {
        accessibilityStore,
        providerType: 'accessibility',
      });

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
      renderWithProviders(<AccessibilitySettings />, {
        accessibilityStore,
        providerType: 'accessibility',
      });

      const button = screen.getByRole('button', {
        name: /Configuración de accesibilidad/i,
      });
      await user.click(button);

      expect(screen.getByLabelText(/Modo de visión de color/i)).toBeInTheDocument();
    });

    it('should have all color mode options', async () => {
      const user = userEvent.setup();
      renderWithProviders(<AccessibilitySettings />, {
        accessibilityStore,
        providerType: 'accessibility',
      });

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
      const store = createMockAccessibilityStore();
      const mockSetColorMode = vi.fn();
      store.setState({ setColorMode: mockSetColorMode });

      renderWithProviders(<AccessibilitySettings />, {
        accessibilityStore: store,
        providerType: 'accessibility',
      });

      const button = screen.getByRole('button', {
        name: /Configuración de accesibilidad/i,
      });
      await user.click(button);

      const select = screen.getByRole('combobox');
      await user.selectOptions(select, 'protanopia');

      expect(mockSetColorMode).toHaveBeenCalledWith('protanopia');
    });

    it('should call onColorModeChange callback', async () => {
      const user = userEvent.setup();
      const mockCallback = vi.fn();

      renderWithProviders(
        <AccessibilitySettings onColorModeChange={mockCallback} />,
        {
          accessibilityStore,
          providerType: 'accessibility',
        }
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
      renderWithProviders(<AccessibilitySettings />, {
        accessibilityStore,
        providerType: 'accessibility',
      });

      const button = screen.getByRole('button', {
        name: /Configuración de accesibilidad/i,
      });
      await user.click(button);

      expect(screen.getByText(/Atajos de teclado/i)).toBeInTheDocument();
    });

    it('should list Tab shortcut', async () => {
      const user = userEvent.setup();
      renderWithProviders(<AccessibilitySettings />, {
        accessibilityStore,
        providerType: 'accessibility',
      });

      const button = screen.getByRole('button', {
        name: /Configuración de accesibilidad/i,
      });
      await user.click(button);

      expect(screen.getByText(/Navegar entre elementos/i)).toBeInTheDocument();
    });

    it('should list Enter shortcut', async () => {
      const user = userEvent.setup();
      renderWithProviders(<AccessibilitySettings />, {
        accessibilityStore,
        providerType: 'accessibility',
      });

      const button = screen.getByRole('button', {
        name: /Configuración de accesibilidad/i,
      });
      await user.click(button);

      expect(screen.getByText(/Seleccionar elemento/i)).toBeInTheDocument();
    });

    it('should list Escape shortcut', async () => {
      const user = userEvent.setup();
      renderWithProviders(<AccessibilitySettings />, {
        accessibilityStore,
        providerType: 'accessibility',
      });

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

      renderWithProviders(<AccessibilitySettings />, {
        accessibilityStore,
        providerType: 'accessibility',
      });

      const button = screen.getByRole('button', {
        name: /Configuración de accesibilidad/i,
      });

      // Mock the getBoundingClientRect method
      button.getBoundingClientRect = mockGetBoundingClientRect as any;

      await user.click(button);

      // Panel should be positioned
      const panel = document.querySelector('.fixed.w-80');
      expect(panel).toBeInTheDocument();
      expect(panel).toHaveStyle({ position: 'fixed' });
    });
  });

  describe('Click Outside', () => {
    it('should close panel when clicking outside', async () => {
      const user = userEvent.setup();
      renderWithProviders(
        <div>
          <div data-testid="outside">Outside</div>
          <AccessibilitySettings />
        </div>,
        {
          accessibilityStore,
          providerType: 'accessibility',
        }
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
      renderWithProviders(<AccessibilitySettings />, {
        accessibilityStore,
        providerType: 'accessibility',
      });

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
      renderWithProviders(<AccessibilitySettings />, {
        accessibilityStore,
        providerType: 'accessibility',
      });

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
      renderWithProviders(<AccessibilitySettings />, {
        accessibilityStore,
        providerType: 'accessibility',
      });

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
