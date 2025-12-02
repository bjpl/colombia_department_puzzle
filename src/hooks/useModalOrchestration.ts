/**
 * useModalOrchestration Hook
 * Orchestrates modal transitions with proper cleanup and game state management
 *
 * SPARC: Refinement - Extract repeated patterns into reusable hook
 *
 * This hook wraps useModalManager and provides safe modal transition helpers
 * that ensure game state is properly cleared before modal changes.
 *
 * Pattern extracted: clearCurrentDepartment() + closeAllModals() + setTimeout(openModal)
 * Occurrences in GameContainer: 8+ times
 *
 * @example
 * ```tsx
 * const { safeOpenModal, MODAL_NAMES } = useModalOrchestration();
 *
 * // Instead of:
 * // game.clearCurrentDepartment();
 * // modal.closeAllModals();
 * // setTimeout(() => modal.openModal('study'), 0);
 *
 * // Use:
 * safeOpenModal(MODAL_NAMES.STUDY);
 * ```
 */

import { useCallback } from 'react';
import { useModalManager } from './useModalManager';
import { useGame } from '../context/GameContext';

/**
 * Typed modal names for type-safe modal operations
 */
export const MODAL_NAMES = {
  POST_GAME: 'postGame',
  GAME_MODE: 'gameMode',
  STUDY: 'study',
  TUTORIAL: 'tutorial',
} as const;

export type ModalName = typeof MODAL_NAMES[keyof typeof MODAL_NAMES];

/**
 * Hook return type - extends useModalManager with safe operations
 */
export interface UseModalOrchestrationReturn extends ReturnType<typeof useModalManager> {
  safeOpenModal: (modalName: ModalName) => void;
  safeCloseModal: () => void;
  safeCloseAllModals: () => void;
  MODAL_NAMES: typeof MODAL_NAMES;
}

/**
 * Custom hook for orchestrating modal transitions with game state cleanup
 *
 * Provides safe wrappers around modal operations that ensure:
 * 1. Current department selection is cleared
 * 2. All modals are closed before opening new ones
 * 3. Modal transitions use setTimeout(0) to avoid React state update conflicts
 *
 * @returns Modal orchestration interface with safe operation methods
 */
export function useModalOrchestration(): UseModalOrchestrationReturn {
  const modal = useModalManager();
  const game = useGame();

  /**
   * Safely open a modal with proper cleanup
   *
   * Sequence:
   * 1. Clear any selected department
   * 2. Close all open modals
   * 3. Open requested modal (deferred to next tick)
   *
   * @param modalName - The modal to open (use MODAL_NAMES constants)
   */
  const safeOpenModal = useCallback((modalName: ModalName) => {
    game.clearCurrentDepartment();
    modal.closeAllModals();
    setTimeout(() => modal.openModal(modalName), 0);
  }, [game, modal]);

  /**
   * Safely close the current modal with cleanup
   *
   * Clears department selection and closes the active modal
   */
  const safeCloseModal = useCallback(() => {
    game.clearCurrentDepartment();
    modal.closeModal();
  }, [game, modal]);

  /**
   * Safely close all modals with cleanup
   *
   * Clears department selection and closes all open modals
   */
  const safeCloseAllModals = useCallback(() => {
    game.clearCurrentDepartment();
    modal.closeAllModals();
  }, [game, modal]);

  return {
    ...modal,
    safeOpenModal,
    safeCloseModal,
    safeCloseAllModals,
    MODAL_NAMES,
  };
}
