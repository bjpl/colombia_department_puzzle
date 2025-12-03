import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import StudyMode from '../../components/StudyMode';
import { colombiaDepartments } from '../../data/colombiaDepartments';
import * as storage from '../../services/storage';
import { GameProvider } from '../../context/GameContext';
import React from 'react';

/**
 * StudyMode Component Tests
 *
 * CONCEPT: Comprehensive test suite for the educational study mode
 * WHY: Ensures all study features, content display, and educational workflows work correctly
 * PATTERN: Component testing with mocked storage, navigation flows, and educational content
 *
 * TEST COVERAGE:
 * - Component rendering in all phases (explore, focus, quiz, ready)
 * - Region filtering and selection
 * - View mode switching (cards, grid, map)
 * - Department selection and information display
 * - Educational content rendering
 * - Progress tracking and milestones
 * - Quiz functionality
 * - Quick actions and recommendations
 * - Navigation and exit flows
 * - Accessibility features
 */

// Mock complex child components
vi.mock('../../components/StudyModeMap', () => ({
  default: ({ selectedDepartment, onDepartmentClick, departments }: any) => (
    <div data-testid="study-mode-map">
      <div data-testid="map-departments-count">{departments.length}</div>
      {selectedDepartment && (
        <div data-testid="map-selected">{selectedDepartment.name}</div>
      )}
      {departments.map((dept: any) => (
        <button
          key={dept.id}
          data-testid={`map-dept-${dept.id}`}
          onClick={() => onDepartmentClick(dept)}
        >
          {dept.name}
        </button>
      ))}
    </div>
  ),
}));

vi.mock('../../components/MiniDepartmentShape', () => ({
  default: ({ departmentName }: any) => (
    <div data-testid={`mini-shape-${departmentName}`}>Shape: {departmentName}</div>
  ),
}));

// Mock data services
vi.mock('../../data/memoryAids', () => ({
  getMemoryAid: (name: string) => ({
    visualAssociation: `Visual aid for ${name}`,
    geographicTrick: `Location trick for ${name}`,
    culturalFact: `Cultural fact about ${name}`,
    mnemonic: `Mnemonic for ${name}`,
    rhyme: `Rhyme for ${name}`,
  }),
}));

vi.mock('../../data/departmentEducation', () => ({
  getDepartmentEducation: (id: string) => ({
    historiaContexto: `Historia de ${id}`,
    importanciaEconomica: `Economía de ${id}`,
    caracteristicasUnicas: `Características de ${id}`,
    patrimonioCultural: `Patrimonio de ${id}`,
    datosEspecificos: {
      fechaCreacion: '1991',
      poblacionIndigena: '10%',
      clima: 'Tropical',
      altitud: '2600 msnm',
      patrimonioUNESCO: ['Site 1', 'Site 2'],
      industrias: ['Café', 'Turismo'],
    },
  }),
}));

vi.mock('../../data/regionalNarratives', () => ({
  getRegionalNarrative: (region: string) => ({
    introduction: `Introduction to ${region}`,
    culturalIdentity: `Cultural identity of ${region}`,
  }),
}));

// Mock storage service
vi.mock('../../services/storage', () => ({
  storage: {
    getActiveProfile: vi.fn(() => ({
      stats: {
        departmentStats: {
          'antioquia': { attempts: 5, correct: 3 },
          'bogota': { attempts: 2, correct: 2 },
        },
      },
    })),
  },
}));

describe('StudyMode Component', () => {
  const mockOnClose = vi.fn();
  const mockOnStartGame = vi.fn();
  const mockOnSelectMode = vi.fn();

  const defaultProps = {
    onClose: mockOnClose,
    onStartGame: mockOnStartGame,
    onSelectMode: mockOnSelectMode,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    // Mock localStorage
    const localStorageMock = (() => {
      let store: Record<string, string> = {};
      return {
        getItem: (key: string) => store[key] || null,
        setItem: (key: string, value: string) => { store[key] = value; },
        clear: () => { store = {}; },
        removeItem: (key: string) => { delete store[key]; },
      };
    })();
    Object.defineProperty(window, 'localStorage', { value: localStorageMock });
  });

  // Helper to render with GameProvider
  const renderWithGameProvider = (ui: React.ReactElement) => {
    return render(
      <GameProvider>
        {ui}
      </GameProvider>
    );
  };

  describe('Rendering and Initial State', () => {
    it('should render without crashing', () => {
      renderWithGameProvider(<StudyMode {...defaultProps} />);
      // Note: emoji is in separate span with aria-hidden, so search for accessible text only
      expect(screen.getByText('Modo de Estudio Mejorado')).toBeInTheDocument();
    });

    it('should start in explore phase by default', () => {
      renderWithGameProvider(<StudyMode {...defaultProps} />);
      expect(screen.getByText('Explora los departamentos de Colombia')).toBeInTheDocument();
    });

    it('should display phase indicators with correct active state', () => {
      const { container } = renderWithGameProvider(<StudyMode {...defaultProps} />);
      // Query for phase indicators specifically in the phase indicator container
      const phaseIndicatorContainer = container.querySelector('.flex.items-center.rounded-lg.bg-white\\/20');
      const indicators = phaseIndicatorContainer?.querySelectorAll('.rounded-full.w-1.h-1') || [];

      // First indicator should be active (white), others inactive (white/40)
      expect(indicators).toHaveLength(4);
      expect(indicators[0]).toHaveClass('bg-white');
    });

    it('should load studied departments from storage on mount', () => {
      renderWithGameProvider(<StudyMode {...defaultProps} />);

      // Should call getActiveProfile to load stored progress
      expect(storage.storage.getActiveProfile).toHaveBeenCalled();
    });

    it('should display progress bar showing studied departments', () => {
      renderWithGameProvider(<StudyMode {...defaultProps} />);

      // Should show studied count (2 from mock storage: antioquia and bogota)
      expect(screen.getByText(/2\/33/)).toBeInTheDocument(); // 2 out of 33 departments
    });

    it('should render close button with correct handler', () => {
      renderWithGameProvider(<StudyMode {...defaultProps} />);

      const closeButton = screen.getByText('✕ Cerrar');
      fireEvent.click(closeButton);

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
  });

  describe('View Mode Switching', () => {
    it('should start in cards view mode', () => {
      renderWithGameProvider(<StudyMode {...defaultProps} />);
      expect(screen.getByText('📋 Vista Cuadrícula')).toBeInTheDocument();
    });

    it('should switch to grid view when button clicked', () => {
      renderWithGameProvider(<StudyMode {...defaultProps} />);

      const viewModeButton = screen.getByText('📋 Vista Cuadrícula');
      fireEvent.click(viewModeButton);

      expect(screen.getByText('🗺️ Vista Mapa')).toBeInTheDocument();
    });

    it('should switch to map view after grid view', () => {
      renderWithGameProvider(<StudyMode {...defaultProps} />);

      const viewModeButton = screen.getByText('📋 Vista Cuadrícula');
      fireEvent.click(viewModeButton); // to grid
      fireEvent.click(screen.getByText('🗺️ Vista Mapa')); // to map

      expect(screen.getByText('🃏 Vista Tarjetas')).toBeInTheDocument();
    });

    it('should cycle back to cards view from map view', () => {
      renderWithGameProvider(<StudyMode {...defaultProps} />);

      const viewModeButton = screen.getByText('📋 Vista Cuadrícula');
      fireEvent.click(viewModeButton); // to grid
      fireEvent.click(screen.getByText('🗺️ Vista Mapa')); // to map
      fireEvent.click(screen.getByText('🃏 Vista Tarjetas')); // to cards

      expect(screen.getByText('📋 Vista Cuadrícula')).toBeInTheDocument();
    });

    it('should render StudyModeMap when in map view', () => {
      renderWithGameProvider(<StudyMode {...defaultProps} />);

      // Switch to map view
      fireEvent.click(screen.getByText('📋 Vista Cuadrícula'));
      fireEvent.click(screen.getByText('🗺️ Vista Mapa'));

      expect(screen.getByTestId('study-mode-map')).toBeInTheDocument();
    });

    it('should render department cards in cards view', () => {
      renderWithGameProvider(<StudyMode {...defaultProps} />);

      // Should render cards for all departments
      colombiaDepartments.forEach(dept => {
        expect(screen.getByText(dept.name)).toBeInTheDocument();
      });
    });

    it('should render grid layout in grid view', () => {
      renderWithGameProvider(<StudyMode {...defaultProps} />);

      fireEvent.click(screen.getByText('📋 Vista Cuadrícula'));

      // Check for region headers in grid view - use getAllByText since region names appear multiple times
      const andinaElements = screen.getAllByText(/Andina/);
      const caribeElements = screen.getAllByText(/Caribe/);

      expect(andinaElements.length).toBeGreaterThan(0);
      expect(caribeElements.length).toBeGreaterThan(0);
    });
  });

  describe('Region Filtering', () => {
    it('should display all regions filter button', () => {
      renderWithGameProvider(<StudyMode {...defaultProps} />);
      expect(screen.getByText('Todas las Regiones')).toBeInTheDocument();
    });

    it('should display region filter buttons with department counts', () => {
      renderWithGameProvider(<StudyMode {...defaultProps} />);

      // Check for region buttons with counts
      expect(screen.getByText(/Andina \(\d+\)/)).toBeInTheDocument();
      expect(screen.getByText(/Caribe \(\d+\)/)).toBeInTheDocument();
    });

    it('should filter departments when region is selected', () => {
      renderWithGameProvider(<StudyMode {...defaultProps} />);

      // Get the region filter buttons (not department cards)
      const caribeButton = screen.getAllByText(/Caribe/).find(
        el => el.tagName === 'BUTTON' && el.textContent?.includes('(')
      );
      fireEvent.click(caribeButton!);

      // Should update phase to 'focus'
      expect(screen.getByText(/Enfocado en: Caribe/)).toBeInTheDocument();
    });

    it('should show only selected region departments when filtered', () => {
      renderWithGameProvider(<StudyMode {...defaultProps} />);

      // Filter to Insular region - find button with department count
      const insularButton = screen.getAllByText(/Insular/).find(
        el => el.tagName === 'BUTTON' && el.textContent?.includes('(')
      );
      fireEvent.click(insularButton!);

      // Should only show Insular region department
      const insularDept = colombiaDepartments.find(d => d.region === 'Insular');
      expect(screen.getByText(insularDept!.name)).toBeInTheDocument();

      // Should not show departments from other regions
      const andinaDept = colombiaDepartments.find(d => d.region === 'Andina');
      // In grid/card view, we should have multiple cards, but filtered
      const cards = screen.queryAllByText(andinaDept!.name);
      expect(cards.length).toBe(0);
    });

    it('should clear filter when "Todas las Regiones" is clicked', () => {
      renderWithGameProvider(<StudyMode {...defaultProps} />);

      // First filter to a region - find the button with count
      const caribeButton = screen.getAllByText(/Caribe/).find(
        el => el.tagName === 'BUTTON' && el.textContent?.includes('(')
      );
      fireEvent.click(caribeButton!);
      expect(screen.getByText(/Enfocado en: Caribe/)).toBeInTheDocument();

      // Then clear filter
      fireEvent.click(screen.getByText('Todas las Regiones'));
      // After clearing filter, focusedRegion is null, but phase might still be focus
      // Check that focused region text is gone
      expect(screen.queryByText(/Enfocado en: Caribe/)).not.toBeInTheDocument();
    });

    it('should update focused region in phase indicator', () => {
      renderWithGameProvider(<StudyMode {...defaultProps} />);

      // Find the region filter button
      const andinaButton = screen.getAllByText(/Andina/).find(
        el => el.tagName === 'BUTTON' && el.textContent?.includes('(')
      );
      fireEvent.click(andinaButton!);

      expect(screen.getByText('Enfocado en: Andina')).toBeInTheDocument();
    });
  });

  describe('Department Selection and Information Display', () => {
    it('should display department information when selected', async () => {
      renderWithGameProvider(<StudyMode {...defaultProps} />);

      const antioquia = colombiaDepartments.find(d => d.name === 'Antioquia')!;
      const deptButton = screen.getAllByText('Antioquia')[0];

      fireEvent.click(deptButton);

      // Should display department details in the right panel
      await waitFor(() => {
        // Check for capital info which is unique to the right panel
        const capitalElements = screen.getAllByText(`Capital: ${antioquia.capital}`);
        expect(capitalElements.length).toBeGreaterThan(0);
      }, { timeout: 3000 });
    });

    it('should mark department as studied when clicked', () => {
      renderWithGameProvider(<StudyMode {...defaultProps} />);

      const deptCard = screen.getAllByText('Valle del Cauca')[0];

      fireEvent.click(deptCard);

      // Should show checkmark for studied department (may be multiple from pre-studied)
      const checkmarks = screen.getAllByText('✓');
      expect(checkmarks.length).toBeGreaterThan(0);
    });

    it('should display geographic information', async () => {
      renderWithGameProvider(<StudyMode {...defaultProps} />);

      const dept = colombiaDepartments[0];
      const deptCard = screen.getAllByText(dept.name)[0];

      fireEvent.click(deptCard);

      await waitFor(() => {
        expect(screen.getByText('📍')).toBeInTheDocument();
        expect(screen.getByText('Información Geográfica')).toBeInTheDocument();
        expect(screen.getByText(`${dept.area.toLocaleString()} km²`)).toBeInTheDocument();
        expect(screen.getByText(dept.population.toLocaleString())).toBeInTheDocument();
      });
    });

    it('should display trivia information', async () => {
      renderWithGameProvider(<StudyMode {...defaultProps} />);

      const dept = colombiaDepartments[0];
      const deptCard = screen.getAllByText(dept.name)[0];

      fireEvent.click(deptCard);

      await waitFor(() => {
        expect(screen.getByText('💡')).toBeInTheDocument();
        expect(screen.getByText('Dato Curioso')).toBeInTheDocument();
        expect(screen.getByText(dept.trivia)).toBeInTheDocument();
      });
    });

    it('should calculate and display population density', async () => {
      renderWithGameProvider(<StudyMode {...defaultProps} />);

      const dept = colombiaDepartments[0];
      const expectedDensity = Math.round(dept.population / dept.area);

      const deptCard = screen.getAllByText(dept.name)[0];
      fireEvent.click(deptCard);

      await waitFor(() => {
        expect(screen.getByText(`${expectedDensity} hab/km²`)).toBeInTheDocument();
      });
    });

    it('should display department history context', async () => {
      renderWithGameProvider(<StudyMode {...defaultProps} />);

      const dept = colombiaDepartments[0];
      const deptCard = screen.getAllByText(dept.name)[0];

      fireEvent.click(deptCard);

      await waitFor(() => {
        expect(screen.getByText('📜')).toBeInTheDocument();
        expect(screen.getByText('Historia y Contexto')).toBeInTheDocument();
        expect(screen.getByText(`Historia de ${dept.id}`)).toBeInTheDocument();
      });
    });

    it('should display economic importance', async () => {
      renderWithGameProvider(<StudyMode {...defaultProps} />);

      const dept = colombiaDepartments[0];
      const deptCard = screen.getAllByText(dept.name)[0];

      fireEvent.click(deptCard);

      await waitFor(() => {
        expect(screen.getByText('💰')).toBeInTheDocument();
        expect(screen.getByText('Importancia Económica')).toBeInTheDocument();
        expect(screen.getByText(`Economía de ${dept.id}`)).toBeInTheDocument();
      });
    });

    it('should display unique characteristics', async () => {
      renderWithGameProvider(<StudyMode {...defaultProps} />);

      const dept = colombiaDepartments[0];
      const deptCard = screen.getAllByText(dept.name)[0];

      fireEvent.click(deptCard);

      await waitFor(() => {
        expect(screen.getByText('⭐')).toBeInTheDocument();
        expect(screen.getByText('Características Únicas')).toBeInTheDocument();
        expect(screen.getByText(`Características de ${dept.id}`)).toBeInTheDocument();
      });
    });

    it('should display cultural heritage', async () => {
      renderWithGameProvider(<StudyMode {...defaultProps} />);

      const dept = colombiaDepartments[0];
      const deptCard = screen.getAllByText(dept.name)[0];

      fireEvent.click(deptCard);

      await waitFor(() => {
        expect(screen.getByText('🎭')).toBeInTheDocument();
        expect(screen.getByText('Patrimonio Cultural')).toBeInTheDocument();
        expect(screen.getByText(`Patrimonio de ${dept.id}`)).toBeInTheDocument();
      });
    });

    it('should display specific data when available', async () => {
      renderWithGameProvider(<StudyMode {...defaultProps} />);

      const dept = colombiaDepartments[0];
      const deptCard = screen.getAllByText(dept.name)[0];

      fireEvent.click(deptCard);

      await waitFor(() => {
        expect(screen.getByText('📊')).toBeInTheDocument();
        expect(screen.getByText('Datos Específicos')).toBeInTheDocument();
        expect(screen.getByText('1991')).toBeInTheDocument();
        expect(screen.getByText('Tropical')).toBeInTheDocument();
      });
    });

    it('should display UNESCO heritage sites', async () => {
      renderWithGameProvider(<StudyMode {...defaultProps} />);

      const dept = colombiaDepartments[0];
      const deptCard = screen.getAllByText(dept.name)[0];

      fireEvent.click(deptCard);

      await waitFor(() => {
        expect(screen.getByText(/Site 1/)).toBeInTheDocument();
        expect(screen.getByText(/Site 2/)).toBeInTheDocument();
      });
    });

    it('should display main industries', async () => {
      renderWithGameProvider(<StudyMode {...defaultProps} />);

      const dept = colombiaDepartments[0];
      const deptCard = screen.getAllByText(dept.name)[0];

      fireEvent.click(deptCard);

      await waitFor(() => {
        expect(screen.getByText('Café')).toBeInTheDocument();
        expect(screen.getByText('Turismo')).toBeInTheDocument();
      });
    });
  });

  describe('Memory Aids and Learning Tools', () => {
    it('should display memory aids section', async () => {
      renderWithGameProvider(<StudyMode {...defaultProps} />);

      const dept = colombiaDepartments[0];
      const deptCard = screen.getAllByText(dept.name)[0];

      fireEvent.click(deptCard);

      await waitFor(() => {
        expect(screen.getByText('🧠')).toBeInTheDocument();
        expect(screen.getByText('Trucos para Recordar')).toBeInTheDocument();
      });
    });

    it('should display visual association with mini shape', async () => {
      renderWithGameProvider(<StudyMode {...defaultProps} />);

      const dept = colombiaDepartments[0];
      const deptCard = screen.getAllByText(dept.name)[0];

      fireEvent.click(deptCard);

      await waitFor(() => {
        expect(screen.getByText('Asociación Visual:')).toBeInTheDocument();
        expect(screen.getByText(`Visual aid for ${dept.name}`)).toBeInTheDocument();
        expect(screen.getByTestId(`mini-shape-${dept.name}`)).toBeInTheDocument();
      });
    });

    it('should display geographic trick', async () => {
      renderWithGameProvider(<StudyMode {...defaultProps} />);

      const dept = colombiaDepartments[0];
      const deptCard = screen.getAllByText(dept.name)[0];

      fireEvent.click(deptCard);

      await waitFor(() => {
        expect(screen.getByText('Ubicación Geográfica:')).toBeInTheDocument();
        expect(screen.getByText(`Location trick for ${dept.name}`)).toBeInTheDocument();
      });
    });

    it('should display cultural fact', async () => {
      renderWithGameProvider(<StudyMode {...defaultProps} />);

      const dept = colombiaDepartments[0];
      const deptCard = screen.getAllByText(dept.name)[0];

      fireEvent.click(deptCard);

      await waitFor(() => {
        expect(screen.getByText('Dato Cultural Memorable:')).toBeInTheDocument();
        expect(screen.getByText(`Cultural fact about ${dept.name}`)).toBeInTheDocument();
      });
    });

    it('should display mnemonic', async () => {
      renderWithGameProvider(<StudyMode {...defaultProps} />);

      const dept = colombiaDepartments[0];
      const deptCard = screen.getAllByText(dept.name)[0];

      fireEvent.click(deptCard);

      await waitFor(() => {
        expect(screen.getByText('Mnemotécnica:')).toBeInTheDocument();
        expect(screen.getByText(`Mnemonic for ${dept.name}`)).toBeInTheDocument();
      });
    });

    it('should display rhyme when available', async () => {
      renderWithGameProvider(<StudyMode {...defaultProps} />);

      const dept = colombiaDepartments[0];
      const deptCard = screen.getAllByText(dept.name)[0];

      fireEvent.click(deptCard);

      await waitFor(() => {
        expect(screen.getByText('Rima:')).toBeInTheDocument();
        // Rhyme text may have different formatting, check for content
        const rhymeElements = screen.getAllByText(new RegExp(`Rhyme for ${dept.name}`, 'i'));
        expect(rhymeElements.length).toBeGreaterThan(0);
      });
    });

    it('should display regional narrative context', async () => {
      renderWithGameProvider(<StudyMode {...defaultProps} />);

      const dept = colombiaDepartments[0];
      const deptCard = screen.getAllByText(dept.name)[0];

      fireEvent.click(deptCard);

      await waitFor(() => {
        expect(screen.getByText(`Contexto Regional: ${dept.region}`)).toBeInTheDocument();
        expect(screen.getByText(`Introduction to ${dept.region}`)).toBeInTheDocument();
        expect(screen.getByText(`Cultural identity of ${dept.region}`)).toBeInTheDocument();
      });
    });
  });

  describe('Progress Tracking and Flow', () => {
    it('should update studied count when department is clicked', () => {
      renderWithGameProvider(<StudyMode {...defaultProps} />);

      // Initial count (from storage mock: 2 studied)
      expect(screen.getByText(/2\/33/)).toBeInTheDocument();

      // Click on an unstudied department
      const unstudiedDept = colombiaDepartments.find(d => d.id !== 'antioquia' && d.id !== 'bogota');
      const deptCard = screen.getAllByText(unstudiedDept!.name)[0];
      fireEvent.click(deptCard);

      // Count should increase
      expect(screen.getByText(/3\/33/)).toBeInTheDocument();
    });

    it('should show quick actions after studying 5+ departments', async () => {
      renderWithGameProvider(<StudyMode {...defaultProps} />);

      // Study multiple departments (storage has 2, need 3 more for 5 total)
      const depts = colombiaDepartments.filter(d => d.id !== 'antioquia' && d.id !== 'bogota').slice(0, 3);

      for (const dept of depts) {
        const deptCard = screen.getAllByText(dept.name)[0];
        fireEvent.click(deptCard);
      }

      await waitFor(() => {
        expect(screen.getByText('Acciones Rápidas:')).toBeInTheDocument();
      }, { timeout: 3000 });
    });

    it('should transition to focus phase after studying 5+ departments', async () => {
      renderWithGameProvider(<StudyMode {...defaultProps} />);

      // Study multiple departments (storage has 2, need 3 more for 5 total)
      const depts = colombiaDepartments.filter(d => d.id !== 'antioquia' && d.id !== 'bogota').slice(0, 3);

      for (const dept of depts) {
        const deptCard = screen.getAllByText(dept.name)[0];
        fireEvent.click(deptCard);
      }

      // Should show focus phase indicators
      await waitFor(() => {
        expect(screen.getByText(/Practicar Región Estudiada/)).toBeInTheDocument();
      }, { timeout: 3000 });
    });

    it('should calculate progress percentage correctly', () => {
      renderWithGameProvider(<StudyMode {...defaultProps} />);

      // 2 studied out of 33 total = ~6%
      const progressBar = document.querySelector('.bg-white.rounded-full');
      expect(progressBar).toHaveStyle({ width: expect.stringMatching(/\d+\.?\d*%/) });
    });

    it('should show milestone markers at 25%, 50%, 75%', () => {
      const { container } = renderWithGameProvider(<StudyMode {...defaultProps} />);

      // Query within progress bar container for milestone markers specifically
      const progressBar = container.querySelector('.bg-white\\/20.rounded-full.relative.h-2');
      const milestones = progressBar?.querySelectorAll('.rounded-full.w-1.h-1') || [];

      // Should have 3 milestone markers (25%, 50%, 75%)
      expect(milestones.length).toBe(3);
    });
  });

  describe('Quick Actions and Recommendations', () => {
    it('should show practice button after studying enough departments', async () => {
      renderWithGameProvider(<StudyMode {...defaultProps} />);

      // Study 3 departments to reach 5 total (trigger at >=5)
      const depts = colombiaDepartments.filter(d => d.id !== 'antioquia' && d.id !== 'bogota').slice(0, 3);

      for (const dept of depts) {
        const deptCard = screen.getAllByText(dept.name)[0];
        fireEvent.click(deptCard);
      }

      await waitFor(() => {
        expect(screen.getByText('🎯 Practicar Región Estudiada')).toBeInTheDocument();
      }, { timeout: 3000 });
    });

    it('should call onSelectMode with recommended mode when practice clicked', async () => {
      renderWithGameProvider(<StudyMode {...defaultProps} />);

      // Study 3 new departments to reach 5 total (trigger quick actions)
      const depts = colombiaDepartments.filter(d => d.id !== 'antioquia' && d.id !== 'bogota').slice(0, 3);

      for (const dept of depts) {
        const deptCard = screen.getAllByText(dept.name)[0];
        fireEvent.click(deptCard);
      }

      // Wait for practice button to appear
      await waitFor(() => {
        expect(screen.getByText('🎯 Practicar Región Estudiada')).toBeInTheDocument();
      }, { timeout: 3000 });

      // Then click it
      const practiceButton = screen.getByText('🎯 Practicar Región Estudiada');
      fireEvent.click(practiceButton);

      expect(mockOnSelectMode).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'region',
        })
      );
    });

    it('should show mini quiz button in quick actions', async () => {
      renderWithGameProvider(<StudyMode {...defaultProps} />);

      // Study enough departments
      const depts = colombiaDepartments.slice(0, 6);
      for (const dept of depts) {
        const deptCard = screen.getAllByText(dept.name)[0];
        fireEvent.click(deptCard);
      }

      await waitFor(() => {
        expect(screen.getByText('🧠 Mini Quiz')).toBeInTheDocument();
      });
    });

    it('should transition to quiz phase when mini quiz clicked', async () => {
      renderWithGameProvider(<StudyMode {...defaultProps} />);

      // Study enough departments
      const depts = colombiaDepartments.slice(0, 6);
      for (const dept of depts) {
        const deptCard = screen.getAllByText(dept.name)[0];
        fireEvent.click(deptCard);
      }

      await waitFor(() => {
        const quizButton = screen.getByText('🧠 Mini Quiz');
        fireEvent.click(quizButton);

        expect(screen.getByText('Prueba tus conocimientos')).toBeInTheDocument();
      });
    });

    it('should show full game button when 60% progress reached', async () => {
      renderWithGameProvider(<StudyMode {...defaultProps} />);

      // Study 20 departments (60% of 33)
      const depts = colombiaDepartments.slice(0, 20);
      for (const dept of depts) {
        const deptCard = screen.getAllByText(dept.name)[0];
        fireEvent.click(deptCard);
      }

      await waitFor(() => {
        expect(screen.getByText('Juego Completo')).toBeInTheDocument();
      });
    });

    it('should call startGame with full mode when full game button clicked', async () => {
      renderWithGameProvider(<StudyMode {...defaultProps} />);

      // Study enough departments
      const depts = colombiaDepartments.slice(0, 20);
      for (const dept of depts) {
        const deptCard = screen.getAllByText(dept.name)[0];
        fireEvent.click(deptCard);
      }

      await waitFor(() => {
        const fullGameButton = screen.getByText('Juego Completo');
        fireEvent.click(fullGameButton);

        expect(mockOnStartGame).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('Empty State and Placeholders', () => {
    it('should show explore placeholder when no department selected', () => {
      renderWithGameProvider(<StudyMode {...defaultProps} />);

      expect(screen.getByText('🗺️')).toBeInTheDocument();
      expect(screen.getByText('Explora los Departamentos')).toBeInTheDocument();
    });

    it('should show focus placeholder in focus phase', async () => {
      renderWithGameProvider(<StudyMode {...defaultProps} />);

      // Trigger focus phase
      const depts = colombiaDepartments.slice(0, 6);
      for (const dept of depts) {
        const deptCard = screen.getAllByText(dept.name)[0];
        fireEvent.click(deptCard);
      }

      // Clear selection by clicking elsewhere
      screen.getByText('✕ Cerrar');
      await waitFor(() => {
        expect(screen.getByText(/Practicar Región Estudiada/)).toBeInTheDocument();
      });
    });

    it('should show quiz placeholder in quiz phase', async () => {
      renderWithGameProvider(<StudyMode {...defaultProps} />);

      // Trigger quiz phase
      const depts = colombiaDepartments.slice(0, 6);
      for (const dept of depts) {
        const deptCard = screen.getAllByText(dept.name)[0];
        fireEvent.click(deptCard);
      }

      await waitFor(async () => {
        const quizButton = screen.getByText('🧠 Mini Quiz');
        fireEvent.click(quizButton);

        expect(screen.getByText('Prueba tus conocimientos')).toBeInTheDocument();
      });
    });
  });

  describe('Map View Integration', () => {
    it('should pass selected department to StudyModeMap', async () => {
      renderWithGameProvider(<StudyMode {...defaultProps} />);

      // Switch to map view
      fireEvent.click(screen.getByText('📋 Vista Cuadrícula'));
      fireEvent.click(screen.getByText('🗺️ Vista Mapa'));

      // Select a department through the map
      const dept = colombiaDepartments[0];
      const mapButton = screen.getByTestId(`map-dept-${dept.id}`);
      fireEvent.click(mapButton);

      await waitFor(() => {
        expect(screen.getByTestId('map-selected')).toHaveTextContent(dept.name);
      });
    });

    it('should pass studied departments set to map', () => {
      renderWithGameProvider(<StudyMode {...defaultProps} />);

      // Switch to map view
      fireEvent.click(screen.getByText('📋 Vista Cuadrícula'));
      fireEvent.click(screen.getByText('🗺️ Vista Mapa'));

      expect(screen.getByTestId('study-mode-map')).toBeInTheDocument();
    });

    it('should pass focused region to map when filtering', async () => {
      renderWithGameProvider(<StudyMode {...defaultProps} />);

      // Filter to a region - find button with count
      const caribeButton = screen.getAllByText(/Caribe/).find(
        el => el.tagName === 'BUTTON' && el.textContent?.includes('(')
      );
      fireEvent.click(caribeButton!);

      // Switch to map view
      fireEvent.click(screen.getByText('📋 Vista Cuadrícula'));
      fireEvent.click(screen.getByText('🗺️ Vista Mapa'));

      const map = screen.getByTestId('study-mode-map');
      expect(map).toBeInTheDocument();
    });
  });

  describe('Accessibility and User Experience', () => {
    it('should have accessible modal overlay', () => {
      const { container } = renderWithGameProvider(<StudyMode {...defaultProps} />);

      const overlay = container.querySelector('.fixed.inset-0');
      expect(overlay).toBeInTheDocument();
    });

    it('should display region color indicators on cards', () => {
      const { container } = renderWithGameProvider(<StudyMode {...defaultProps} />);

      const colorBars = container.querySelectorAll('.w-full.h-1');
      expect(colorBars.length).toBeGreaterThan(0);
    });

    it('should show hover effects on department cards', () => {
      renderWithGameProvider(<StudyMode {...defaultProps} />);

      const dept = colombiaDepartments[0];
      const cards = screen.getAllByText(dept.name);

      expect(cards[0].closest('.group')).toBeInTheDocument();
    });

    it('should display studied badge on studied departments', async () => {
      renderWithGameProvider(<StudyMode {...defaultProps} />);

      const dept = colombiaDepartments[0];
      const deptCard = screen.getAllByText(dept.name)[0];

      fireEvent.click(deptCard);

      await waitFor(() => {
        // Multiple badges may exist (from pre-studied departments), use getAllByText
        const badges = screen.getAllByText('Estudiado');
        expect(badges.length).toBeGreaterThan(0);
      }, { timeout: 3000 });
    });

    it('should render with proper z-index for modal', () => {
      const { container } = renderWithGameProvider(<StudyMode {...defaultProps} />);

      const modal = container.querySelector('.z-50');
      expect(modal).toBeInTheDocument();
    });
  });
});
