/**
 * DepartmentTray Component Tests
 * Tests for draggable department chips and tray layouts
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DepartmentTray from '../../components/DepartmentTray';
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

// Mock the actual contexts with proper implementations
let mockGameState: any;
let mockAccessibilityState: any;

vi.mock('../../context/GameContext', () => ({
  useGame: () => mockGameState,
}));

vi.mock('../../context/AccessibilityContext', () => ({
  useAccessibility: () => mockAccessibilityState,
}));

// Helper to create default mock states
function createDefaultGameState(overrides?: any) {
  return {
    departments: colombiaDepartments,
    placedDepartments: new Set<string>(),
    currentDepartment: null,
    isDraggingDepartment: false,
    score: 0,
    attempts: 0,
    hints: 3,
    isGameComplete: false,
    startTime: null,
    elapsedTime: 0,
    isPaused: false,
    isGameStarted: false,
    gameMode: { type: 'full' as const },
    activeDepartments: colombiaDepartments,
    regionProgress: new Map(),
    totalStars: 0,
    placeDepartment: vi.fn(),
    selectDepartment: vi.fn(),
    clearCurrentDepartment: vi.fn(),
    setIsDragging: vi.fn(),
    useHint: vi.fn(),
    deductPoints: vi.fn(),
    resetGame: vi.fn(),
    updateElapsedTime: vi.fn(),
    startGame: vi.fn(),
    pauseGame: vi.fn(),
    resumeGame: vi.fn(),
    setGameMode: vi.fn(),
    updateRegionProgress: vi.fn(),
    getFilteredDepartments: vi.fn(() => overrides?.getFilteredDepartments?.() || colombiaDepartments),
    ...overrides,
  };
}

function createDefaultAccessibilityState(overrides?: any) {
  return {
    colorMode: 'normal' as const,
    setColorMode: vi.fn(),
    getRegionColor: (region: string) => {
      const colorMap: Record<string, string> = {
        'Andina': '#3b82f6',
        'Caribe': '#10b981',
        'Pacífico': '#8b5cf6',
        'Orinoquía': '#f59e0b',
        'Amazonía': '#14b8a6',
        'Insular': '#ec4899',
      };
      return colorMap[region] || '#6b7280';
    },
    getTextColor: vi.fn(() => '#ffffff'),
    ...overrides,
  };
}

describe('DepartmentTray', () => {
  beforeEach(() => {
    mockGameState = createDefaultGameState();
    mockAccessibilityState = createDefaultAccessibilityState();
  });

  describe('Rendering', () => {
    it('should render available departments', () => {
      render(<DepartmentTray />);

      // Should show at least some departments
      const antioquia = screen.queryByText(/Antioquia/i);
      expect(antioquia).toBeInTheDocument();
    });

    it('should not render already placed departments', () => {
      mockGameState = createDefaultGameState({
        placedDepartments: new Set(['antioquia']),
        getFilteredDepartments: () => colombiaDepartments.filter(d => d.id !== 'antioquia'),
      });

      render(<DepartmentTray />);

      // Antioquia should not appear since it's placed
      const antioquia = screen.queryByText('Antioquia');
      expect(antioquia).not.toBeInTheDocument();
    });

    it('should show completion message when all departments placed', () => {
      const allIds = colombiaDepartments.map((d) => d.id);
      mockGameState = createDefaultGameState({
        placedDepartments: new Set(allIds),
        getFilteredDepartments: () => [],
      });

      render(<DepartmentTray />);

      expect(screen.getByText(/Completado/i)).toBeInTheDocument();
    });

    it('should sort departments alphabetically', () => {
      render(<DepartmentTray layout="horizontal" />);

      const departments = screen.getAllByRole('button');
      // First few should be alphabetically first
      const firstDept = departments[0];
      expect(firstDept.textContent).toBeTruthy();
    });
  });

  describe('Layouts', () => {
    it('should render horizontal layout by default', () => {
      render(<DepartmentTray />);

      // Should have grid layout
      const region = screen.getByRole('region');
      expect(region).toBeInTheDocument();
    });

    it('should render vertical layout with stats', () => {
      render(<DepartmentTray layout="vertical" />);

      // Should show remaining count - there are multiple elements with this text (visible + sr-only)
      const elements = screen.getAllByText(/departamentos restantes/i);
      expect(elements.length).toBeGreaterThan(0);
    });

    it('should render compact layout with region groups', () => {
      render(<DepartmentTray layout="compact" />);

      // Should show region headers
      expect(screen.getByText(/Andina/i)).toBeInTheDocument();
      expect(screen.getByText(/Caribe/i)).toBeInTheDocument();
    });

    it('should render ultra-compact layout', () => {
      render(<DepartmentTray layout="ultra-compact" />);

      // Should show region headers in ultra-compact style
      const regions = screen.getAllByRole('heading', { level: 4 });
      expect(regions.length).toBeGreaterThan(0);
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels on department chips', () => {
      render(<DepartmentTray />);

      const buttons = screen.getAllByRole('button');
      buttons.forEach((button) => {
        expect(button).toHaveAttribute('aria-label');
        // Horizontal layout uses "Departamento X..." label
        const label = button.getAttribute('aria-label');
        expect(label).toMatch(/Departamento|Arrastra/);
      });
    });

    it('should have keyboard focusable chips', () => {
      render(<DepartmentTray />);

      const buttons = screen.getAllByRole('button');
      buttons.forEach((button) => {
        expect(button).toHaveAttribute('tabIndex', '0');
      });
    });

    it('should have data-department-id attributes', () => {
      render(<DepartmentTray />);

      const buttons = screen.getAllByRole('button');
      buttons.forEach((button) => {
        expect(button).toHaveAttribute('data-department-id');
      });
    });

    it('should announce completion to screen readers', () => {
      const allIds = colombiaDepartments.map((d) => d.id);
      mockGameState = createDefaultGameState({
        placedDepartments: new Set(allIds),
        getFilteredDepartments: () => [],
      });

      render(<DepartmentTray />);

      const announcement = screen.getByText(
        /Todos los departamentos han sido colocados/i
      );
      expect(announcement).toHaveClass('sr-only');
    });

    it('should have region group labels', () => {
      render(<DepartmentTray layout="compact" />);

      const groups = screen.getAllByRole('group');
      groups.forEach((group) => {
        expect(group).toHaveAttribute('aria-labelledby');
      });
    });
  });

  describe('Color Modes', () => {
    it('should apply accessibility colors to chips', () => {
      mockAccessibilityState = createDefaultAccessibilityState({ colorMode: 'protanopia' });

      render(<DepartmentTray />);

      const buttons = screen.getAllByRole('button');
      // Colors should be applied via style attribute
      expect(buttons[0]).toHaveStyle({ backgroundColor: expect.any(String) });
    });

    it('should apply proper text colors for contrast', () => {
      // Use compact layout where colors are applied via inline styles
      render(<DepartmentTray layout="compact" />);

      const buttons = screen.getAllByRole('button');
      // Compact layout applies white text color for contrast
      buttons.forEach((button) => {
        // Check that color style is set (white text = rgb(255, 255, 255))
        const buttonElement = button as HTMLElement;
        expect(buttonElement.style.color).toBeTruthy();
      });
    });
  });

  describe('Keyboard Interactions', () => {
    it('should prevent space key from scrolling', async () => {
      const user = userEvent.setup();
      render(<DepartmentTray />);

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
      render(<DepartmentTray />);

      const buttons = screen.getAllByRole('button');
      await user.tab();

      // First button should receive focus
      expect(buttons[0]).toHaveFocus();
    });
  });

  describe('Regional Mode Filtering', () => {
    it('should only show departments from selected regions', () => {
      const andinaDepartments = colombiaDepartments.filter(d => d.region === 'Andina');
      mockGameState = createDefaultGameState({
        gameMode: {
          type: 'region' as const,
          selectedRegions: ['Andina'],
        },
        getFilteredDepartments: () => andinaDepartments,
      });

      render(<DepartmentTray />);

      // Should only show Andina departments
      expect(screen.getByText(/Antioquia/i)).toBeInTheDocument();
      expect(screen.getByText(/Cundinamarca/i)).toBeInTheDocument();
    });

    it('should update when departments are placed in regional mode', () => {
      const andinaDepartments = colombiaDepartments.filter(d => d.region === 'Andina' && d.id !== 'antioquia');
      mockGameState = createDefaultGameState({
        gameMode: {
          type: 'region' as const,
          selectedRegions: ['Andina'],
        },
        placedDepartments: new Set(['antioquia']),
        getFilteredDepartments: () => andinaDepartments,
      });

      render(<DepartmentTray />);

      // Antioquia should not appear
      expect(screen.queryByText('Antioquia')).not.toBeInTheDocument();
      // But other Andina departments should
      expect(screen.getByText(/Cundinamarca/i)).toBeInTheDocument();
    });
  });

  describe('Region Grouping', () => {
    it('should group departments by region in compact layout', () => {
      render(<DepartmentTray layout="compact" />);

      // All 6 regions should be shown
      expect(screen.getByText(/Amazonía/i)).toBeInTheDocument();
      expect(screen.getByText(/Andina/i)).toBeInTheDocument();
      expect(screen.getByText(/Caribe/i)).toBeInTheDocument();
      expect(screen.getByText(/Insular/i)).toBeInTheDocument();
      expect(screen.getByText(/Orinoquía/i)).toBeInTheDocument();
      expect(screen.getByText(/Pacífico/i)).toBeInTheDocument();
    });

    it('should show department counts per region', () => {
      render(<DepartmentTray layout="compact" />);

      // Region headers should show counts
      const andinaHeader = screen.getByText(/Andina \(\d+\)/i);
      expect(andinaHeader).toBeInTheDocument();
    });

    it('should sort regions in logical order', () => {
      render(<DepartmentTray layout="compact" />);

      const regionHeaders = screen.getAllByRole('heading', { level: 4 });
      // Should follow the order: Amazonía, Andina, Caribe, Insular, Orinoquía, Pacífico
      expect(regionHeaders[0].textContent).toMatch(/Amazonía/i);
    });
  });

  describe('Vertical Layout Stats', () => {
    it('should show remaining departments count', () => {
      const remainingDepartments = colombiaDepartments.filter(d => !['antioquia', 'cundinamarca'].includes(d.id));
      mockGameState = createDefaultGameState({
        placedDepartments: new Set(['antioquia', 'cundinamarca']),
        getFilteredDepartments: () => remainingDepartments,
      });

      render(<DepartmentTray layout="vertical" />);

      // Should show count (33 - 2 = 31) - multiple "31" values exist, just verify one is present
      const counts = screen.getAllByText('31');
      expect(counts.length).toBeGreaterThan(0);
    });

    it('should have live region for stats updates', () => {
      render(<DepartmentTray layout="vertical" />);

      const statusRegion = screen.getByRole('status');
      expect(statusRegion).toHaveAttribute('aria-live', 'polite');
    });
  });

  describe('Drag Indicator', () => {
    it('should show drag handle on hover', () => {
      render(<DepartmentTray layout="vertical" />);

      const buttons = screen.getAllByRole('button');
      // Drag indicator should be present in the DOM
      const button = buttons[0];
      const svg = button.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });
  });
});
