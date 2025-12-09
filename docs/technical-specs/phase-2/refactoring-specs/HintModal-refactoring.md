# Component Refactoring: HintModal (908 lines → 3 files <300 lines each)

**Current File:** `src/components/HintModal.tsx` (908 lines, 37.9 KB)
**Target:** Modular component structure with clear separation of concerns

---

## Current State Analysis

**File Size:** 908 lines
**Complexity Issues:**
- Single file contains all hint logic (display, progression, state management)
- Mixed concerns (UI, business logic, data fetching)
- Difficult to test individual features
- Hard to maintain and extend

**Functional Areas Identified:**
1. Modal Container & Layout (200 lines) - Main modal structure
2. Hint Content Display (250 lines) - Rendering individual hint levels
3. Hint Progression System (200 lines) - Progressive reveal logic
4. State Management (150 lines) - Hint state, user progress
5. Helper Functions (108 lines) - Utilities, formatters

---

## Target Architecture

### File Structure
```
src/components/hint/
├── HintModal.tsx (230 lines) ← Main modal container
├── HintContent.tsx (190 lines) ← Content rendering
├── HintProgression.tsx (210 lines) ← Progression logic
├── HintState.tsx (140 lines) ← State management hook
├── types.ts (80 lines) ← TypeScript interfaces
└── utils.ts (58 lines) ← Helper functions

Total: 908 lines → 908 lines (reorganized, no bloat)
```

### Component Hierarchy
```
<HintModal>                    ← Container, modal behavior
  <HintProgression>            ← Progress bar, level indicator
    <HintLevel>                ← Individual hint level
      <HintContent>            ← Content display (locked/revealed)
        <HintText>             ← Text rendering
        <HintVisual>           ← Visual aids (maps, shapes)
      </HintContent>
    </HintLevel>
  </HintProgression>
</HintModal>
```

---

## Complete Type Definitions

**File:** `src/components/hint/types.ts`

```typescript
import type { Department } from '../../types/department';

/**
 * Hint difficulty levels
 */
export enum HintLevel {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard',
  EXPERT = 'expert',
}

/**
 * Individual hint data structure
 */
export interface Hint {
  id: string;
  departmentId: string;
  level: HintLevel;
  title: string;
  description: string;
  content: string;
  visualAid?: HintVisualAid;
  cost: number; // Hint points cost
  revealed: boolean;
  revealedAt?: Date;
}

/**
 * Visual aid for hint (map highlight, shape, etc.)
 */
export interface HintVisualAid {
  type: 'map' | 'shape' | 'comparison' | 'mnemonic';
  data: unknown; // Type varies by visual aid type
}

/**
 * Hint progression state
 */
export interface HintProgression {
  currentLevel: HintLevel;
  revealedHints: string[]; // Hint IDs
  availablePoints: number;
  totalPointsUsed: number;
  completionPercentage: number;
}

/**
 * Hint modal props
 */
export interface HintModalProps {
  isOpen: boolean;
  onClose: () => void;
  department: Department;
  onHintReveal: (hintId: string) => void;
  onPointsChange?: (points: number) => void;
  initialProgression?: HintProgression;
}

/**
 * Hint content component props
 */
export interface HintContentProps {
  hint: Hint;
  isRevealed: boolean;
  isLocked: boolean;
  onReveal: () => void;
  availablePoints: number;
}

/**
 * Hint progression component props
 */
export interface HintProgressionProps {
  hints: Hint[];
  progression: HintProgression;
  onLevelChange: (level: HintLevel) => void;
  onHintReveal: (hintId: string) => void;
  availablePoints: number;
}

/**
 * Hint state hook return type
 */
export interface UseHintStateReturn {
  hints: Hint[];
  progression: HintProgression;
  revealHint: (hintId: string) => Promise<void>;
  resetProgression: () => void;
  canAfford: (cost: number) => boolean;
  isLoading: boolean;
  error: string | null;
}
```

---

## Component Implementation

### 1. HintModal.tsx (Main Container)

```typescript
import React, { useEffect, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { X } from 'lucide-react';
import { HintProgression } from './HintProgression';
import { useHintState } from './HintState';
import type { HintModalProps } from './types';

/**
 * Main hint modal container
 * Responsibilities:
 * - Modal open/close behavior
 * - Keyboard navigation (Escape to close)
 * - Accessibility (focus trap, ARIA labels)
 * - Integration with hint state management
 */
export const HintModal: React.FC<HintModalProps> = ({
  isOpen,
  onClose,
  department,
  onHintReveal,
  onPointsChange,
  initialProgression,
}) => {
  const {
    hints,
    progression,
    revealHint,
    resetProgression,
    canAfford,
    isLoading,
    error,
  } = useHintState(department.id, initialProgression);

  // Handle hint reveal with callback
  const handleHintReveal = useCallback(
    async (hintId: string) => {
      await revealHint(hintId);
      onHintReveal(hintId);
      onPointsChange?.(progression.availablePoints);
    },
    [revealHint, onHintReveal, onPointsChange, progression.availablePoints]
  );

  // Keyboard shortcuts
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Auto-close on complete
  useEffect(() => {
    if (progression.completionPercentage === 100) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000); // Close after 3 seconds

      return () => clearTimeout(timer);
    }
  }, [progression.completionPercentage, onClose]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="max-w-4xl max-h-[90vh] overflow-y-auto"
        aria-labelledby="hint-modal-title"
        aria-describedby="hint-modal-description"
      >
        {/* Header */}
        <DialogHeader className="flex flex-row items-center justify-between border-b pb-4">
          <div>
            <DialogTitle id="hint-modal-title" className="text-2xl font-bold">
              Ayudas para {department.name}
            </DialogTitle>
            <p
              id="hint-modal-description"
              className="text-sm text-gray-600 mt-1"
            >
              Usa ayudas progresivas para aprender sobre este departamento
            </p>
          </div>

          {/* Points Display */}
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-sm text-gray-600">Puntos Disponibles</div>
              <div className="text-2xl font-bold text-sky-600">
                {progression.availablePoints}
              </div>
            </div>

            {/* Close Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              aria-label="Cerrar ayudas"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </DialogHeader>

        {/* Error Display */}
        {error && (
          <div
            className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded"
            role="alert"
          >
            <span className="font-medium">Error: </span>
            {error}
          </div>
        )}

        {/* Main Content */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600" />
            <span className="ml-3 text-gray-600">Cargando ayudas...</span>
          </div>
        ) : (
          <HintProgression
            hints={hints}
            progression={progression}
            onLevelChange={(level) => {
              // Filter hints by level
              console.log('Level changed:', level);
            }}
            onHintReveal={handleHintReveal}
            availablePoints={progression.availablePoints}
          />
        )}

        {/* Footer */}
        <div className="border-t pt-4 mt-6 flex justify-between items-center">
          <div className="text-sm text-gray-600">
            {progression.revealedHints.length} de {hints.length} ayudas reveladas
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={resetProgression}
              disabled={progression.revealedHints.length === 0}
            >
              Reiniciar
            </Button>
            <Button onClick={onClose}>Cerrar</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
```

---

### 2. HintProgression.tsx (Progression System)

```typescript
import React, { useState } from 'react';
import { HintContent } from './HintContent';
import { HintLevel, Hint } from './types';
import type { HintProgressionProps } from './types';

/**
 * Hint progression component
 * Responsibilities:
 * - Display hint levels in progressive order
 * - Show progress bar
 * - Handle level filtering
 * - Coordinate hint reveals
 */
export const HintProgression: React.FC<HintProgressionProps> = ({
  hints,
  progression,
  onLevelChange,
  onHintReveal,
  availablePoints,
}) => {
  const [selectedLevel, setSelectedLevel] = useState<HintLevel | 'all'>('all');

  // Filter hints by level
  const filteredHints = React.useMemo(() => {
    if (selectedLevel === 'all') return hints;
    return hints.filter((hint) => hint.level === selectedLevel);
  }, [hints, selectedLevel]);

  // Group hints by level
  const hintsByLevel = React.useMemo(() => {
    return hints.reduce(
      (acc, hint) => {
        if (!acc[hint.level]) {
          acc[hint.level] = [];
        }
        acc[hint.level].push(hint);
        return acc;
      },
      {} as Record<HintLevel, Hint[]>
    );
  }, [hints]);

  // Calculate level completion
  const levelCompletion = React.useMemo(() => {
    return Object.entries(hintsByLevel).reduce(
      (acc, [level, levelHints]) => {
        const revealed = levelHints.filter((h) => h.revealed).length;
        acc[level as HintLevel] = (revealed / levelHints.length) * 100;
        return acc;
      },
      {} as Record<HintLevel, number>
    );
  }, [hintsByLevel]);

  // Handle level change
  const handleLevelChange = (level: HintLevel | 'all') => {
    setSelectedLevel(level);
    if (level !== 'all') {
      onLevelChange(level);
    }
  };

  return (
    <div className="space-y-6">
      {/* Progress Bar */}
      <div className="bg-gray-100 rounded-lg p-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">
            Progreso General
          </span>
          <span className="text-sm font-bold text-sky-600">
            {Math.round(progression.completionPercentage)}%
          </span>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div
            className="bg-gradient-to-r from-sky-400 to-violet-500 h-full rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progression.completionPercentage}%` }}
            role="progressbar"
            aria-valuenow={progression.completionPercentage}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Progreso de ayudas"
          />
        </div>

        {/* Milestone Markers */}
        <div className="flex justify-between mt-2 text-xs text-gray-500">
          <span className={progression.completionPercentage >= 25 ? 'text-sky-600 font-semibold' : ''}>
            25%
          </span>
          <span className={progression.completionPercentage >= 50 ? 'text-sky-600 font-semibold' : ''}>
            50%
          </span>
          <span className={progression.completionPercentage >= 75 ? 'text-sky-600 font-semibold' : ''}>
            75%
          </span>
          <span className={progression.completionPercentage === 100 ? 'text-violet-600 font-semibold' : ''}>
            100%
          </span>
        </div>
      </div>

      {/* Level Filters */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => handleLevelChange('all')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            selectedLevel === 'all'
              ? 'bg-sky-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Todas ({hints.length})
        </button>

        {Object.entries(hintsByLevel).map(([level, levelHints]) => (
          <button
            key={level}
            onClick={() => handleLevelChange(level as HintLevel)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors relative ${
              selectedLevel === level
                ? 'bg-sky-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <span className="capitalize">{level}</span>
            <span className="ml-2 text-xs opacity-75">
              ({levelHints.length})
            </span>

            {/* Completion Badge */}
            {levelCompletion[level as HintLevel] === 100 && (
              <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                ✓
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Hint List */}
      <div className="space-y-4">
        {filteredHints.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No hay ayudas en este nivel
          </div>
        ) : (
          filteredHints.map((hint, index) => {
            const isLocked =
              index > 0 && !filteredHints[index - 1].revealed;

            return (
              <HintContent
                key={hint.id}
                hint={hint}
                isRevealed={hint.revealed}
                isLocked={isLocked}
                onReveal={() => onHintReveal(hint.id)}
                availablePoints={availablePoints}
              />
            );
          })
        )}
      </div>

      {/* Completion Message */}
      {progression.completionPercentage === 100 && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-6 text-center">
          <div className="text-4xl mb-3">🎉</div>
          <h3 className="text-xl font-bold text-green-800 mb-2">
            ¡Todas las ayudas reveladas!
          </h3>
          <p className="text-green-700">
            Has explorado completamente las ayudas para este departamento.
          </p>
        </div>
      )}
    </div>
  );
};
```

---

### 3. HintContent.tsx (Content Display)

```typescript
import React, { useState } from 'react';
import { Lock, Unlock, Eye, MapPin, Lightbulb } from 'lucide-react';
import { Button } from '../ui/button';
import type { HintContentProps, HintVisualAid } from './types';
import { formatHintCost } from './utils';

/**
 * Hint content display component
 * Responsibilities:
 * - Display hint in locked/revealed state
 * - Show visual aids (maps, shapes, mnemonics)
 * - Handle reveal action
 * - Accessibility (screen reader support)
 */
export const HintContent: React.FC<HintContentProps> = ({
  hint,
  isRevealed,
  isLocked,
  onReveal,
  availablePoints,
}) => {
  const [isRevealing, setIsRevealing] = useState(false);

  const canAfford = availablePoints >= hint.cost;
  const canReveal = !isRevealed && !isLocked && canAfford;

  // Handle reveal with animation
  const handleReveal = async () => {
    if (!canReveal) return;

    setIsRevealing(true);
    await onReveal();
    setIsRevealing(false);
  };

  // Render visual aid based on type
  const renderVisualAid = (visualAid?: HintVisualAid) => {
    if (!visualAid || !isRevealed) return null;

    switch (visualAid.type) {
      case 'map':
        return <MapVisualAid data={visualAid.data} />;
      case 'shape':
        return <ShapeVisualAid data={visualAid.data} />;
      case 'comparison':
        return <ComparisonVisualAid data={visualAid.data} />;
      case 'mnemonic':
        return <MnemonicVisualAid data={visualAid.data} />;
      default:
        return null;
    }
  };

  return (
    <div
      className={`rounded-lg border-2 p-6 transition-all duration-300 ${
        isRevealed
          ? 'bg-white border-green-300 shadow-sm'
          : isLocked
            ? 'bg-gray-50 border-gray-200 opacity-60'
            : 'bg-white border-gray-300 hover:border-sky-400 hover:shadow-md'
      }`}
      aria-live="polite"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          {/* Status Icon */}
          <div
            className={`p-2 rounded-lg ${
              isRevealed
                ? 'bg-green-100'
                : isLocked
                  ? 'bg-gray-100'
                  : 'bg-sky-100'
            }`}
          >
            {isRevealed ? (
              <Unlock className="h-5 w-5 text-green-600" />
            ) : isLocked ? (
              <Lock className="h-5 w-5 text-gray-400" />
            ) : (
              <Eye className="h-5 w-5 text-sky-600" />
            )}
          </div>

          {/* Title */}
          <div>
            <h4 className="font-semibold text-lg text-gray-900">
              {hint.title}
            </h4>
            <p className="text-sm text-gray-600">{hint.description}</p>
          </div>
        </div>

        {/* Cost Badge */}
        {!isRevealed && (
          <div
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              canAfford
                ? 'bg-sky-100 text-sky-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            {formatHintCost(hint.cost)}
          </div>
        )}
      </div>

      {/* Content */}
      {isRevealed ? (
        <div className="space-y-4">
          {/* Text Content */}
          <div className="prose prose-sm max-w-none">
            <p className="text-gray-700 leading-relaxed">{hint.content}</p>
          </div>

          {/* Visual Aid */}
          {renderVisualAid(hint.visualAid)}

          {/* Revealed Timestamp */}
          {hint.revealedAt && (
            <div className="text-xs text-gray-500 flex items-center gap-1">
              <Eye className="h-3 w-3" />
              <span>
                Revelado: {new Date(hint.revealedAt).toLocaleString('es-CO')}
              </span>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {/* Locked Message */}
          {isLocked ? (
            <div className="bg-gray-100 rounded-lg p-4 text-center">
              <Lock className="h-6 w-6 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600">
                Revela la ayuda anterior para desbloquear esta
              </p>
            </div>
          ) : (
            <>
              {/* Preview/Teaser */}
              <div className="bg-sky-50 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <Lightbulb className="h-5 w-5 text-sky-600 mt-0.5" />
                  <p className="text-sm text-gray-700">
                    Esta ayuda te proporcionará información sobre{' '}
                    {hint.description.toLowerCase()}
                  </p>
                </div>
              </div>

              {/* Reveal Button */}
              <Button
                onClick={handleReveal}
                disabled={!canReveal || isRevealing}
                className={`w-full ${
                  canReveal
                    ? 'bg-sky-600 hover:bg-sky-700'
                    : 'bg-gray-300 cursor-not-allowed'
                }`}
                aria-label={`Revelar ${hint.title} por ${hint.cost} puntos`}
              >
                {isRevealing ? (
                  <>
                    <span className="animate-spin mr-2">⌛</span>
                    Revelando...
                  </>
                ) : !canAfford ? (
                  <>
                    <Lock className="mr-2 h-4 w-4" />
                    Puntos Insuficientes ({availablePoints}/{hint.cost})
                  </>
                ) : (
                  <>
                    <Unlock className="mr-2 h-4 w-4" />
                    Revelar por {hint.cost} puntos
                  </>
                )}
              </Button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

// Visual Aid Components (simplified - full implementation would be more detailed)

const MapVisualAid: React.FC<{ data: unknown }> = ({ data }) => (
  <div className="bg-gray-100 rounded-lg p-4">
    <div className="flex items-center gap-2 mb-2">
      <MapPin className="h-4 w-4 text-sky-600" />
      <span className="text-sm font-medium">Ubicación en el mapa</span>
    </div>
    {/* Render map highlight */}
    <div className="h-48 bg-white rounded border">
      {/* Map visualization */}
    </div>
  </div>
);

const ShapeVisualAid: React.FC<{ data: unknown }> = ({ data }) => (
  <div className="bg-gray-100 rounded-lg p-4">
    <span className="text-sm font-medium">Forma del departamento</span>
    {/* Render shape */}
  </div>
);

const ComparisonVisualAid: React.FC<{ data: unknown }> = ({ data }) => (
  <div className="bg-gray-100 rounded-lg p-4">
    <span className="text-sm font-medium">Comparación</span>
    {/* Render comparison */}
  </div>
);

const MnemonicVisualAid: React.FC<{ data: unknown }> = ({ data }) => (
  <div className="bg-violet-50 rounded-lg p-4 border border-violet-200">
    <div className="flex items-center gap-2 mb-2">
      <Lightbulb className="h-4 w-4 text-violet-600" />
      <span className="text-sm font-medium text-violet-900">
        Ayuda Mnemotécnica
      </span>
    </div>
    {/* Render mnemonic */}
  </div>
);
```

---

### 4. HintState.tsx (State Management Hook)

```typescript
import { useState, useEffect, useCallback } from 'react';
import type { Hint, HintProgression, HintLevel, UseHintStateReturn } from './types';
import { calculateProgression, loadHintsForDepartment } from './utils';

/**
 * Hint state management hook
 * Responsibilities:
 * - Load hints from storage/API
 * - Track revealed hints
 * - Manage points
 * - Persist state to localStorage
 * - Handle errors
 */
export const useHintState = (
  departmentId: string,
  initialProgression?: HintProgression
): UseHintStateReturn => {
  const [hints, setHints] = useState<Hint[]>([]);
  const [progression, setProgression] = useState<HintProgression>(
    initialProgression || {
      currentLevel: HintLevel.EASY,
      revealedHints: [],
      availablePoints: 100,
      totalPointsUsed: 0,
      completionPercentage: 0,
    }
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load hints for department
  useEffect(() => {
    const loadHints = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const loadedHints = await loadHintsForDepartment(departmentId);
        setHints(loadedHints);

        // Load saved progression from localStorage
        const savedKey = `hint_progression_${departmentId}`;
        const savedData = localStorage.getItem(savedKey);

        if (savedData) {
          const saved = JSON.parse(savedData) as HintProgression;
          setProgression(saved);

          // Mark hints as revealed based on saved state
          setHints((prev) =>
            prev.map((hint) => ({
              ...hint,
              revealed: saved.revealedHints.includes(hint.id),
            }))
          );
        }
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'Error al cargar las ayudas'
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadHints();
  }, [departmentId]);

  // Save progression to localStorage whenever it changes
  useEffect(() => {
    if (!isLoading && hints.length > 0) {
      const savedKey = `hint_progression_${departmentId}`;
      localStorage.setItem(savedKey, JSON.stringify(progression));
    }
  }, [progression, departmentId, isLoading, hints.length]);

  // Reveal a hint
  const revealHint = useCallback(
    async (hintId: string) => {
      const hint = hints.find((h) => h.id === hintId);
      if (!hint || hint.revealed) return;

      // Check if user can afford
      if (progression.availablePoints < hint.cost) {
        setError('Puntos insuficientes para revelar esta ayuda');
        return;
      }

      // Update hint state
      setHints((prev) =>
        prev.map((h) =>
          h.id === hintId
            ? { ...h, revealed: true, revealedAt: new Date() }
            : h
        )
      );

      // Update progression
      setProgression((prev) => {
        const newRevealedHints = [...prev.revealedHints, hintId];
        const newPointsUsed = prev.totalPointsUsed + hint.cost;
        const newAvailablePoints = prev.availablePoints - hint.cost;
        const newCompletion = (newRevealedHints.length / hints.length) * 100;

        return {
          ...prev,
          revealedHints: newRevealedHints,
          totalPointsUsed: newPointsUsed,
          availablePoints: newAvailablePoints,
          completionPercentage: newCompletion,
        };
      });

      // Analytics tracking (optional)
      try {
        await fetch('/api/analytics/hint-revealed', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            departmentId,
            hintId,
            cost: hint.cost,
            timestamp: new Date().toISOString(),
          }),
        });
      } catch (err) {
        // Don't block on analytics failure
        console.warn('Analytics tracking failed:', err);
      }
    },
    [hints, progression, departmentId]
  );

  // Reset progression
  const resetProgression = useCallback(() => {
    setProgression({
      currentLevel: HintLevel.EASY,
      revealedHints: [],
      availablePoints: 100,
      totalPointsUsed: 0,
      completionPercentage: 0,
    });

    setHints((prev) =>
      prev.map((hint) => ({
        ...hint,
        revealed: false,
        revealedAt: undefined,
      }))
    );

    // Clear from localStorage
    const savedKey = `hint_progression_${departmentId}`;
    localStorage.removeItem(savedKey);
  }, [departmentId]);

  // Check if user can afford a cost
  const canAfford = useCallback(
    (cost: number) => {
      return progression.availablePoints >= cost;
    },
    [progression.availablePoints]
  );

  return {
    hints,
    progression,
    revealHint,
    resetProgression,
    canAfford,
    isLoading,
    error,
  };
};
```

---

### 5. utils.ts (Helper Functions)

```typescript
import type { Hint, HintLevel, HintProgression } from './types';

/**
 * Format hint cost for display
 */
export const formatHintCost = (cost: number): string => {
  return `${cost} ${cost === 1 ? 'punto' : 'puntos'}`;
};

/**
 * Calculate progression statistics
 */
export const calculateProgression = (
  hints: Hint[],
  revealedIds: string[]
): HintProgression => {
  const revealed = hints.filter((h) => revealedIds.includes(h.id));
  const totalCost = revealed.reduce((sum, h) => sum + h.cost, 0);

  return {
    currentLevel: getHighestLevel(revealed),
    revealedHints: revealedIds,
    availablePoints: 100 - totalCost,
    totalPointsUsed: totalCost,
    completionPercentage: (revealedIds.length / hints.length) * 100,
  };
};

/**
 * Get highest revealed level
 */
const getHighestLevel = (hints: Hint[]): HintLevel => {
  const levels = hints.map((h) => h.level);

  if (levels.includes(HintLevel.EXPERT)) return HintLevel.EXPERT;
  if (levels.includes(HintLevel.HARD)) return HintLevel.HARD;
  if (levels.includes(HintLevel.MEDIUM)) return HintLevel.MEDIUM;
  return HintLevel.EASY;
};

/**
 * Load hints for a department from storage/API
 */
export const loadHintsForDepartment = async (
  departmentId: string
): Promise<Hint[]> => {
  // In production, this would fetch from an API
  // For now, return mock data
  const mockHints: Hint[] = [
    {
      id: `${departmentId}-hint-1`,
      departmentId,
      level: HintLevel.EASY,
      title: 'Ubicación General',
      description: 'Región geográfica',
      content: 'Este departamento está ubicado en la región...',
      cost: 5,
      revealed: false,
    },
    {
      id: `${departmentId}-hint-2`,
      departmentId,
      level: HintLevel.EASY,
      title: 'Tamaño Relativo',
      description: 'Comparación de tamaño',
      content: 'Es uno de los departamentos más grandes/pequeños...',
      cost: 5,
      revealed: false,
    },
    // ... more hints
  ];

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  return mockHints;
};

/**
 * Validate hint data structure
 */
export const validateHint = (hint: unknown): hint is Hint => {
  if (typeof hint !== 'object' || hint === null) return false;

  const h = hint as Record<string, unknown>;

  return (
    typeof h.id === 'string' &&
    typeof h.departmentId === 'string' &&
    typeof h.title === 'string' &&
    typeof h.content === 'string' &&
    typeof h.cost === 'number' &&
    typeof h.revealed === 'boolean'
  );
};
```

---

## Migration Steps

### Step 1: Create New Directory Structure
```bash
mkdir -p src/components/hint
touch src/components/hint/{types.ts,utils.ts,HintModal.tsx,HintContent.tsx,HintProgression.tsx,HintState.tsx}
```

### Step 2: Extract Types
1. Copy all interfaces from current HintModal.tsx
2. Paste into `types.ts`
3. Add exports for all types
4. Run TypeScript check: `npm run typecheck`

### Step 3: Extract Utils
1. Identify all helper functions in HintModal.tsx
2. Move to `utils.ts`
3. Add necessary imports
4. Export all functions
5. Test: `npm run test -- hint/utils`

### Step 4: Create HintState Hook
1. Extract all state management logic
2. Implement `useHintState` hook
3. Add localStorage integration
4. Write tests for hook
5. Validate: `npm run test -- hint/HintState`

### Step 5: Create HintContent Component
1. Extract content rendering logic
2. Implement locked/revealed states
3. Add visual aid rendering
4. Write component tests
5. Validate: `npm run test -- hint/HintContent`

### Step 6: Create HintProgression Component
1. Extract progression logic
2. Implement level filtering
3. Add progress indicators
4. Write component tests
5. Validate: `npm run test -- hint/HintProgression`

### Step 7: Refactor Main HintModal
1. Use new hook and components
2. Remove extracted logic
3. Keep only container logic
4. Write integration tests
5. Validate: `npm run test -- hint/HintModal`

### Step 8: Update Imports
1. Find all files importing HintModal
2. Update import paths if needed
3. Run full test suite
4. Fix any breaking changes

### Step 9: Remove Old File
```bash
# After verifying everything works
git rm src/components/HintModal.tsx
git add src/components/hint/
git commit -m "refactor: modularize HintModal into separate components

- Split 908-line file into 6 focused modules
- Extracted types, utils, and state management
- Created reusable HintContent and HintProgression components
- Improved testability and maintainability
- No functional changes, all tests passing"
```

---

## Validation Checklist

- [ ] All TypeScript errors resolved (`npm run typecheck`)
- [ ] All tests passing (`npm test -- hint/`)
- [ ] No regression in existing tests (`npm test`)
- [ ] Code coverage maintained or improved
- [ ] Accessibility preserved (screen reader test)
- [ ] Performance not degraded (React DevTools profiler)
- [ ] Bundle size not significantly increased
- [ ] Visual regression test passed (Percy/Chromatic)
- [ ] Documentation updated (Storybook stories)
- [ ] Code review completed
- [ ] Changelog entry added

---

## Testing Strategy

### Unit Tests
```typescript
// HintModal.test.tsx
describe('HintModal', () => {
  it('should open and close correctly');
  it('should load hints on mount');
  it('should handle keyboard shortcuts');
  it('should update points on hint reveal');
});

// HintContent.test.tsx
describe('HintContent', () => {
  it('should render locked state');
  it('should render revealed state');
  it('should disable reveal when insufficient points');
  it('should call onReveal when clicked');
});

// HintProgression.test.tsx
describe('HintProgression', () => {
  it('should filter hints by level');
  it('should show correct completion percentage');
  it('should unlock hints progressively');
});

// HintState.test.ts
describe('useHintState', () => {
  it('should load hints from localStorage');
  it('should save progression to localStorage');
  it('should reveal hints and update points');
  it('should reset progression');
});
```

### Integration Tests
```typescript
describe('Hint System Integration', () => {
  it('should complete full hint progression flow');
  it('should persist state across page reloads');
  it('should handle concurrent reveals');
  it('should track analytics correctly');
});
```

---

## Performance Considerations

**Before Refactoring:**
- Single 908-line file
- All logic re-renders on any state change
- Difficult to memoize

**After Refactoring:**
- Components can be individually memoized
- State updates isolated to relevant components
- Easier to implement React.memo optimizations

**Optimization Opportunities:**
```typescript
export const HintContent = React.memo<HintContentProps>(({ ... }) => {
  // Component only re-renders when props change
});

export const HintProgression = React.memo<HintProgressionProps>(({ ... }) => {
  // Isolated re-renders for progression updates
});
```

---

## Estimated Effort

- **Setup (Step 1-2):** 30 minutes
- **Extract Utils (Step 3):** 1 hour
- **Create Hook (Step 4):** 2 hours
- **Create Components (Step 5-6):** 4 hours
- **Refactor Main (Step 7):** 2 hours
- **Testing (Step 8):** 3 hours
- **Cleanup (Step 9):** 1 hour

**Total:** ~14 hours (2 days)

---

**Status:** Specification Complete
**Complexity:** High
**Risk:** Medium (large refactoring, but well-tested)
**Priority:** High (largest component, biggest maintenance burden)
