import { useState, useCallback } from 'react';
import { useGame } from '../context/GameContext';

export type HintLevel = 'region' | 'letter' | 'flash' | null;

interface HintCost {
  region: number;
  letter: number;
  flash: number;
}

const HINT_COSTS: HintCost = {
  region: 10,
  letter: 20,
  flash: 50,
};

export function useProgressiveHints() {
  const game = useGame();
  const [activeHint, setActiveHint] = useState<HintLevel>(null);
  const [highlightedRegion, setHighlightedRegion] = useState<string | null>(null);
  const [flashingDepartment, setFlashingDepartment] = useState<string | null>(null);
  const [showFirstLetter, setShowFirstLetter] = useState(false);

  const resetHints = useCallback(() => {
    setActiveHint(null);
    setHighlightedRegion(null);
    setFlashingDepartment(null);
    setShowFirstLetter(false);
  }, []);

  const activateRegionHint = useCallback(() => {
    if (!game.currentDepartment || game.score < HINT_COSTS.region) return false;

    const region = game.currentDepartment.region;
    setHighlightedRegion(region);
    setActiveHint('region');
    game.deductPoints(HINT_COSTS.region);

    // Auto-clear after 5 seconds
    setTimeout(() => setHighlightedRegion(null), 5000);
    return true;
  }, [game]);

  const activateLetterHint = useCallback(() => {
    if (!game.currentDepartment || game.score < HINT_COSTS.letter) return false;

    setShowFirstLetter(true);
    setActiveHint('letter');
    game.deductPoints(HINT_COSTS.letter);

    // Also activate region hint for context
    const region = game.currentDepartment.region;
    setHighlightedRegion(region);

    // Auto-clear after 5 seconds
    setTimeout(() => {
      setShowFirstLetter(false);
      setHighlightedRegion(null);
    }, 5000);
    return true;
  }, [game]);

  const activateFlashHint = useCallback(() => {
    if (!game.currentDepartment || game.score < HINT_COSTS.flash) return false;

    setFlashingDepartment(game.currentDepartment.id);
    setActiveHint('flash');
    game.deductPoints(HINT_COSTS.flash);

    // Flash for 3 seconds
    setTimeout(() => setFlashingDepartment(null), 3000);
    return true;
  }, [game]);

  const getHintForDepartment = useCallback((departmentId: string) => {
    if (flashingDepartment === departmentId) return 'flash';

    const dept = game.departments.find(d => d.id === departmentId);
    if (dept && highlightedRegion === dept.region) return 'region';

    return null;
  }, [flashingDepartment, highlightedRegion, game.departments]);

  return {
    activeHint,
    highlightedRegion,
    flashingDepartment,
    showFirstLetter,
    activateRegionHint,
    activateLetterHint,
    activateFlashHint,
    resetHints,
    getHintForDepartment,
    HINT_COSTS,
  };
}