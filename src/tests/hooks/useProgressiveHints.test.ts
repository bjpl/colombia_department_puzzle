import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useProgressiveHints } from '../../hooks/useProgressiveHints';
import { GameProvider } from '../../context/GameContext';
import { ReactNode } from 'react';

// Mock game context with required methods
const mockGameContext = {
  currentDepartment: {
    id: 'antioquia',
    name: 'Antioquia',
    region: 'Andina',
    capital: 'Medellín',
  },
  score: 100,
  departments: [
    { id: 'antioquia', name: 'Antioquia', region: 'Andina', capital: 'Medellín' },
    { id: 'cundinamarca', name: 'Cundinamarca', region: 'Andina', capital: 'Bogotá' },
    { id: 'atlantico', name: 'Atlántico', region: 'Caribe', capital: 'Barranquilla' },
  ],
  deductPoints: vi.fn(),
};

vi.mock('../../context/GameContext', () => ({
  useGame: () => mockGameContext,
  GameProvider: ({ children }: { children: ReactNode }) => children,
}));

describe('useProgressiveHints', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();
    mockGameContext.currentDepartment = {
      id: 'antioquia',
      name: 'Antioquia',
      region: 'Andina',
      capital: 'Medellín',
    };
    mockGameContext.score = 100;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Initial State', () => {
    it('should initialize with no active hints', () => {
      const { result } = renderHook(() => useProgressiveHints());

      expect(result.current.activeHint).toBeNull();
      expect(result.current.highlightedRegion).toBeNull();
      expect(result.current.flashingDepartment).toBeNull();
      expect(result.current.showFirstLetter).toBe(false);
    });

    it('should expose hint costs', () => {
      const { result } = renderHook(() => useProgressiveHints());

      expect(result.current.HINT_COSTS).toEqual({
        region: 10,
        letter: 20,
        flash: 50,
      });
    });
  });

  describe('Region Hint', () => {
    it('should activate region hint successfully', () => {
      const { result } = renderHook(() => useProgressiveHints());

      let activated = false;
      act(() => {
        activated = result.current.activateRegionHint();
      });

      expect(activated).toBe(true);
      expect(result.current.activeHint).toBe('region');
      expect(result.current.highlightedRegion).toBe('Andina');
      expect(mockGameContext.deductPoints).toHaveBeenCalledWith(10);
    });

    it('should not activate if no current department', () => {
      mockGameContext.currentDepartment = null;
      const { result } = renderHook(() => useProgressiveHints());

      let activated = false;
      act(() => {
        activated = result.current.activateRegionHint();
      });

      expect(activated).toBe(false);
      expect(mockGameContext.deductPoints).not.toHaveBeenCalled();
    });

    it('should not activate if insufficient score', () => {
      mockGameContext.score = 5;
      const { result } = renderHook(() => useProgressiveHints());

      let activated = false;
      act(() => {
        activated = result.current.activateRegionHint();
      });

      expect(activated).toBe(false);
      expect(mockGameContext.deductPoints).not.toHaveBeenCalled();
    });

    it('should auto-clear region hint after 5 seconds', () => {
      const { result } = renderHook(() => useProgressiveHints());

      act(() => {
        result.current.activateRegionHint();
      });

      expect(result.current.highlightedRegion).toBe('Andina');

      act(() => {
        vi.advanceTimersByTime(5000);
      });

      expect(result.current.highlightedRegion).toBeNull();
    });
  });

  describe('Letter Hint', () => {
    it('should activate letter hint successfully', () => {
      const { result } = renderHook(() => useProgressiveHints());

      let activated = false;
      act(() => {
        activated = result.current.activateLetterHint();
      });

      expect(activated).toBe(true);
      expect(result.current.activeHint).toBe('letter');
      expect(result.current.showFirstLetter).toBe(true);
      expect(result.current.highlightedRegion).toBe('Andina');
      expect(mockGameContext.deductPoints).toHaveBeenCalledWith(20);
    });

    it('should not activate if no current department', () => {
      mockGameContext.currentDepartment = null;
      const { result } = renderHook(() => useProgressiveHints());

      let activated = false;
      act(() => {
        activated = result.current.activateLetterHint();
      });

      expect(activated).toBe(false);
      expect(mockGameContext.deductPoints).not.toHaveBeenCalled();
    });

    it('should not activate if insufficient score', () => {
      mockGameContext.score = 15;
      const { result } = renderHook(() => useProgressiveHints());

      let activated = false;
      act(() => {
        activated = result.current.activateLetterHint();
      });

      expect(activated).toBe(false);
      expect(mockGameContext.deductPoints).not.toHaveBeenCalled();
    });

    it('should auto-clear letter hint after 5 seconds', () => {
      const { result } = renderHook(() => useProgressiveHints());

      act(() => {
        result.current.activateLetterHint();
      });

      expect(result.current.showFirstLetter).toBe(true);
      expect(result.current.highlightedRegion).toBe('Andina');

      act(() => {
        vi.advanceTimersByTime(5000);
      });

      expect(result.current.showFirstLetter).toBe(false);
      expect(result.current.highlightedRegion).toBeNull();
    });
  });

  describe('Flash Hint', () => {
    it('should activate flash hint successfully', () => {
      const { result } = renderHook(() => useProgressiveHints());

      let activated = false;
      act(() => {
        activated = result.current.activateFlashHint();
      });

      expect(activated).toBe(true);
      expect(result.current.activeHint).toBe('flash');
      expect(result.current.flashingDepartment).toBe('antioquia');
      expect(mockGameContext.deductPoints).toHaveBeenCalledWith(50);
    });

    it('should not activate if no current department', () => {
      mockGameContext.currentDepartment = null;
      const { result } = renderHook(() => useProgressiveHints());

      let activated = false;
      act(() => {
        activated = result.current.activateFlashHint();
      });

      expect(activated).toBe(false);
      expect(mockGameContext.deductPoints).not.toHaveBeenCalled();
    });

    it('should not activate if insufficient score', () => {
      mockGameContext.score = 40;
      const { result } = renderHook(() => useProgressiveHints());

      let activated = false;
      act(() => {
        activated = result.current.activateFlashHint();
      });

      expect(activated).toBe(false);
      expect(mockGameContext.deductPoints).not.toHaveBeenCalled();
    });

    it('should auto-clear flash hint after 3 seconds', () => {
      const { result } = renderHook(() => useProgressiveHints());

      act(() => {
        result.current.activateFlashHint();
      });

      expect(result.current.flashingDepartment).toBe('antioquia');

      act(() => {
        vi.advanceTimersByTime(3000);
      });

      expect(result.current.flashingDepartment).toBeNull();
    });
  });

  describe('Hint Reset', () => {
    it('should reset all hints', () => {
      const { result } = renderHook(() => useProgressiveHints());

      act(() => {
        result.current.activateRegionHint();
        result.current.activateLetterHint();
      });

      expect(result.current.activeHint).not.toBeNull();

      act(() => {
        result.current.resetHints();
      });

      expect(result.current.activeHint).toBeNull();
      expect(result.current.highlightedRegion).toBeNull();
      expect(result.current.flashingDepartment).toBeNull();
      expect(result.current.showFirstLetter).toBe(false);
    });
  });

  describe('getHintForDepartment', () => {
    it('should return flash hint for flashing department', () => {
      const { result } = renderHook(() => useProgressiveHints());

      act(() => {
        result.current.activateFlashHint();
      });

      expect(result.current.getHintForDepartment('antioquia')).toBe('flash');
      expect(result.current.getHintForDepartment('cundinamarca')).toBeNull();
    });

    it('should return region hint for department in highlighted region', () => {
      const { result } = renderHook(() => useProgressiveHints());

      act(() => {
        result.current.activateRegionHint();
      });

      expect(result.current.getHintForDepartment('antioquia')).toBe('region');
      expect(result.current.getHintForDepartment('cundinamarca')).toBe('region');
      expect(result.current.getHintForDepartment('atlantico')).toBeNull();
    });

    it('should prioritize flash over region', () => {
      const { result } = renderHook(() => useProgressiveHints());

      act(() => {
        result.current.activateRegionHint();
      });

      act(() => {
        result.current.activateFlashHint();
      });

      expect(result.current.getHintForDepartment('antioquia')).toBe('flash');
    });

    it('should return null when no hints active', () => {
      const { result } = renderHook(() => useProgressiveHints());

      expect(result.current.getHintForDepartment('antioquia')).toBeNull();
    });
  });

  describe('Progressive Hint System', () => {
    it('should allow using hints in progression when score allows', () => {
      mockGameContext.score = 100;
      const { result } = renderHook(() => useProgressiveHints());

      // Use region hint (cost 10)
      act(() => {
        result.current.activateRegionHint();
      });

      expect(mockGameContext.deductPoints).toHaveBeenCalledWith(10);

      mockGameContext.score = 90;

      // Use letter hint (cost 20)
      act(() => {
        result.current.activateLetterHint();
      });

      expect(mockGameContext.deductPoints).toHaveBeenCalledWith(20);

      mockGameContext.score = 70;

      // Use flash hint (cost 50)
      act(() => {
        result.current.activateFlashHint();
      });

      expect(mockGameContext.deductPoints).toHaveBeenCalledWith(50);
    });
  });
});
