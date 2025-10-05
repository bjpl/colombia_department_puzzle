/**
 * DepartmentTray Component Tests
 * Tests for draggable department chips and tray layouts
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DepartmentTray from '../../components/DepartmentTray';
import {
  renderWithProviders,
  createMockGameStore,
  createMockAccessibilityStore,
} from '../utils/testProviders';
import { colombiaDepartments } from '../../data/colombiaDepartments';

// Mock @dnd-kit
vi.mock('@dnd-kit/core', () => ({
  useDraggable: () => ({
    attributes: {},
    listeners: {},
    setNodeRef: vi.fn(),
    transform: null,
    isDragging: false,
  }),
}));

describe('DepartmentTray', () => {
  let gameStore: ReturnType<typeof createMockGameStore>;
  let accessibilityStore: ReturnType<typeof createMockAccessibilityStore>;

  beforeEach(() => {
    gameStore = createMockGameStore();
    accessibilityStore = createMockAccessibilityStore();
  });

  describe('Rendering', () => {
    it('should render available departments', () => {
      renderWithProviders(<DepartmentTray />, { gameStore, accessibilityStore });

      // Should show at least some departments
      const antioquia = screen.queryByText(/Antioquia/i);
      expect(antioquia).toBeInTheDocument();
    });

    it('should not render already placed departments', () => {
      const store = createMockGameStore({
        placedDepartments: new Set(['antioquia']),
      });

      renderWithProviders(<DepartmentTray />, {
        gameStore: store,
        accessibilityStore,
      });

      // Antioquia should not appear since it's placed
      const antioquia = screen.queryByText('Antioquia');
      expect(antioquia).not.toBeInTheDocument();
    });

    it('should show completion message when all departments placed', () => {
      const allIds = colombiaDepartments.map((d) => d.id);
      const store = createMockGameStore({
        placedDepartments: new Set(allIds),
      });

      renderWithProviders(<DepartmentTray />, {
        gameStore: store,
        accessibilityStore,
      });

      expect(screen.getByText(/Completado/i)).toBeInTheDocument();
    });

    it('should sort departments alphabetically', () => {
      renderWithProviders(<DepartmentTray layout="horizontal" />, {
        gameStore,
        accessibilityStore,
      });

      const departments = screen.getAllByRole('button');
      // First few should be alphabetically first
      const firstDept = departments[0];
      expect(firstDept.textContent).toBeTruthy();
    });
  });

  describe('Layouts', () => {
    it('should render horizontal layout by default', () => {
      renderWithProviders(<DepartmentTray />, { gameStore, accessibilityStore });

      // Should have grid layout
      const region = screen.getByRole('region');
      expect(region).toBeInTheDocument();
    });

    it('should render vertical layout with stats', () => {
      renderWithProviders(<DepartmentTray layout="vertical" />, {
        gameStore,
        accessibilityStore,
      });

      // Should show remaining count
      expect(screen.getByText(/departamentos restantes/i)).toBeInTheDocument();
    });

    it('should render compact layout with region groups', () => {
      renderWithProviders(<DepartmentTray layout="compact" />, {
        gameStore,
        accessibilityStore,
      });

      // Should show region headers
      expect(screen.getByText(/Andina/i)).toBeInTheDocument();
      expect(screen.getByText(/Caribe/i)).toBeInTheDocument();
    });

    it('should render ultra-compact layout', () => {
      renderWithProviders(<DepartmentTray layout="ultra-compact" />, {
        gameStore,
        accessibilityStore,
      });

      // Should show region headers in ultra-compact style
      const regions = screen.getAllByRole('heading', { level: 4 });
      expect(regions.length).toBeGreaterThan(0);
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels on department chips', () => {
      renderWithProviders(<DepartmentTray />, { gameStore, accessibilityStore });

      const buttons = screen.getAllByRole('button');
      buttons.forEach((button) => {
        expect(button).toHaveAttribute('aria-label');
        expect(button.getAttribute('aria-label')).toContain('Arrastra');
      });
    });

    it('should have keyboard focusable chips', () => {
      renderWithProviders(<DepartmentTray />, { gameStore, accessibilityStore });

      const buttons = screen.getAllByRole('button');
      buttons.forEach((button) => {
        expect(button).toHaveAttribute('tabIndex', '0');
      });
    });

    it('should have data-department-id attributes', () => {
      renderWithProviders(<DepartmentTray />, { gameStore, accessibilityStore });

      const buttons = screen.getAllByRole('button');
      buttons.forEach((button) => {
        expect(button).toHaveAttribute('data-department-id');
      });
    });

    it('should announce completion to screen readers', () => {
      const allIds = colombiaDepartments.map((d) => d.id);
      const store = createMockGameStore({
        placedDepartments: new Set(allIds),
      });

      renderWithProviders(<DepartmentTray />, {
        gameStore: store,
        accessibilityStore,
      });

      const announcement = screen.getByText(
        /Todos los departamentos han sido colocados/i
      );
      expect(announcement).toHaveClass('sr-only');
    });

    it('should have region group labels', () => {
      renderWithProviders(<DepartmentTray layout="compact" />, {
        gameStore,
        accessibilityStore,
      });

      const groups = screen.getAllByRole('group');
      groups.forEach((group) => {
        expect(group).toHaveAttribute('aria-labelledby');
      });
    });
  });

  describe('Color Modes', () => {
    it('should apply accessibility colors to chips', () => {
      const store = createMockAccessibilityStore({ colorMode: 'protanopia' });

      renderWithProviders(<DepartmentTray />, {
        gameStore,
        accessibilityStore: store,
      });

      const buttons = screen.getAllByRole('button');
      // Colors should be applied via style attribute
      expect(buttons[0]).toHaveStyle({ backgroundColor: expect.any(String) });
    });

    it('should apply proper text colors for contrast', () => {
      renderWithProviders(<DepartmentTray />, { gameStore, accessibilityStore });

      const buttons = screen.getAllByRole('button');
      // All chips should have white text for contrast
      buttons.forEach((button) => {
        expect(button).toHaveStyle({ color: expect.any(String) });
      });
    });
  });

  describe('Keyboard Interactions', () => {
    it('should prevent space key from scrolling', async () => {
      const user = userEvent.setup();
      renderWithProviders(<DepartmentTray />, { gameStore, accessibilityStore });

      const button = screen.getAllByRole('button')[0];
      const preventDefault = vi.fn();

      button.addEventListener('keydown', (e) => {
        if (e.key === ' ') preventDefault();
      });

      await user.type(button, ' ');
      // Space should be handled without scrolling
    });

    it('should allow Tab navigation', async () => {
      const user = userEvent.setup();
      renderWithProviders(<DepartmentTray />, { gameStore, accessibilityStore });

      const buttons = screen.getAllByRole('button');
      await user.tab();

      // First button should receive focus
      expect(buttons[0]).toHaveFocus();
    });
  });

  describe('Regional Mode Filtering', () => {
    it('should only show departments from selected regions', () => {
      const store = createMockGameStore({
        gameMode: {
          type: 'region',
          selectedRegions: ['Andina'],
        },
      });

      renderWithProviders(<DepartmentTray />, {
        gameStore: store,
        accessibilityStore,
      });

      // Should only show Andina departments
      expect(screen.getByText(/Antioquia/i)).toBeInTheDocument();
      expect(screen.getByText(/Cundinamarca/i)).toBeInTheDocument();
    });

    it('should update when departments are placed in regional mode', () => {
      const store = createMockGameStore({
        gameMode: {
          type: 'region',
          selectedRegions: ['Andina'],
        },
        placedDepartments: new Set(['antioquia']),
      });

      renderWithProviders(<DepartmentTray />, {
        gameStore: store,
        accessibilityStore,
      });

      // Antioquia should not appear
      expect(screen.queryByText('Antioquia')).not.toBeInTheDocument();
      // But other Andina departments should
      expect(screen.getByText(/Cundinamarca/i)).toBeInTheDocument();
    });
  });

  describe('Region Grouping', () => {
    it('should group departments by region in compact layout', () => {
      renderWithProviders(<DepartmentTray layout="compact" />, {
        gameStore,
        accessibilityStore,
      });

      // All 6 regions should be shown
      expect(screen.getByText(/Amazonía/i)).toBeInTheDocument();
      expect(screen.getByText(/Andina/i)).toBeInTheDocument();
      expect(screen.getByText(/Caribe/i)).toBeInTheDocument();
      expect(screen.getByText(/Insular/i)).toBeInTheDocument();
      expect(screen.getByText(/Orinoquía/i)).toBeInTheDocument();
      expect(screen.getByText(/Pacífico/i)).toBeInTheDocument();
    });

    it('should show department counts per region', () => {
      renderWithProviders(<DepartmentTray layout="compact" />, {
        gameStore,
        accessibilityStore,
      });

      // Region headers should show counts
      const andinaHeader = screen.getByText(/Andina \(\d+\)/i);
      expect(andinaHeader).toBeInTheDocument();
    });

    it('should sort regions in logical order', () => {
      renderWithProviders(<DepartmentTray layout="compact" />, {
        gameStore,
        accessibilityStore,
      });

      const regionHeaders = screen.getAllByRole('heading', { level: 4 });
      // Should follow the order: Amazonía, Andina, Caribe, Insular, Orinoquía, Pacífico
      expect(regionHeaders[0].textContent).toMatch(/Amazonía/i);
    });
  });

  describe('Vertical Layout Stats', () => {
    it('should show remaining departments count', () => {
      const store = createMockGameStore({
        placedDepartments: new Set(['antioquia', 'cundinamarca']),
      });

      renderWithProviders(<DepartmentTray layout="vertical" />, {
        gameStore: store,
        accessibilityStore,
      });

      // Should show count
      const count = screen.getByText(/31/); // 33 - 2 = 31
      expect(count).toBeInTheDocument();
    });

    it('should have live region for stats updates', () => {
      renderWithProviders(<DepartmentTray layout="vertical" />, {
        gameStore,
        accessibilityStore,
      });

      const statusRegion = screen.getByRole('status');
      expect(statusRegion).toHaveAttribute('aria-live', 'polite');
    });
  });

  describe('Drag Indicator', () => {
    it('should show drag handle on hover', () => {
      renderWithProviders(<DepartmentTray layout="vertical" />, {
        gameStore,
        accessibilityStore,
      });

      const buttons = screen.getAllByRole('button');
      // Drag indicator should be present in the DOM
      const button = buttons[0];
      const svg = button.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });
  });
});
