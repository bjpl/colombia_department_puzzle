import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useModalManager } from '../../hooks/useModalManager';

describe('useModalManager', () => {
  describe('Initial State', () => {
    it('should initialize with no active modal', () => {
      const { result } = renderHook(() => useModalManager());

      expect(result.current.activeModal).toBeNull();
      expect(result.current.hasQueuedModals).toBe(false);
    });
  });

  describe('Opening Modals', () => {
    it('should open a modal', () => {
      const { result } = renderHook(() => useModalManager());

      act(() => {
        result.current.openModal('tutorial');
      });

      expect(result.current.activeModal).toBe('tutorial');
    });

    it('should queue modal when one is already open', () => {
      const { result } = renderHook(() => useModalManager());

      act(() => {
        result.current.openModal('tutorial');
      });

      expect(result.current.activeModal).toBe('tutorial');

      act(() => {
        result.current.openModal('study');
      });

      // Should still show tutorial
      expect(result.current.activeModal).toBe('tutorial');
      expect(result.current.hasQueuedModals).toBe(true);
    });

    it('should queue multiple modals', () => {
      const { result } = renderHook(() => useModalManager());

      act(() => {
        result.current.openModal('tutorial');
      });

      act(() => {
        result.current.openModal('study');
      });

      act(() => {
        result.current.openModal('postGame');
      });

      expect(result.current.activeModal).toBe('tutorial');
      expect(result.current.hasQueuedModals).toBe(true);
    });
  });

  describe('Closing Modals', () => {
    it('should close modal when no queue exists', () => {
      const { result } = renderHook(() => useModalManager());

      act(() => {
        result.current.openModal('tutorial');
      });

      expect(result.current.activeModal).toBe('tutorial');

      act(() => {
        result.current.closeModal();
      });

      expect(result.current.activeModal).toBeNull();
      expect(result.current.hasQueuedModals).toBe(false);
    });

    it('should show next modal from queue when closing', () => {
      const { result } = renderHook(() => useModalManager());

      act(() => {
        result.current.openModal('tutorial');
      });

      act(() => {
        result.current.openModal('study');
      });

      expect(result.current.activeModal).toBe('tutorial');

      act(() => {
        result.current.closeModal();
      });

      expect(result.current.activeModal).toBe('study');
      expect(result.current.hasQueuedModals).toBe(false);
    });

    it('should process queue in FIFO order', () => {
      const { result } = renderHook(() => useModalManager());

      act(() => {
        result.current.openModal('tutorial');
      });

      act(() => {
        result.current.openModal('study');
      });

      act(() => {
        result.current.openModal('postGame');
      });

      expect(result.current.activeModal).toBe('tutorial');

      act(() => {
        result.current.closeModal();
      });

      expect(result.current.activeModal).toBe('study');

      act(() => {
        result.current.closeModal();
      });

      expect(result.current.activeModal).toBe('postGame');

      act(() => {
        result.current.closeModal();
      });

      expect(result.current.activeModal).toBeNull();
    });

    it('should close all modals including queue', () => {
      const { result } = renderHook(() => useModalManager());

      act(() => {
        result.current.openModal('tutorial');
      });

      act(() => {
        result.current.openModal('study');
      });

      act(() => {
        result.current.openModal('postGame');
      });

      expect(result.current.activeModal).toBe('tutorial');
      expect(result.current.hasQueuedModals).toBe(true);

      act(() => {
        result.current.closeAllModals();
      });

      expect(result.current.activeModal).toBeNull();
      expect(result.current.hasQueuedModals).toBe(false);
    });
  });

  describe('Modal State Checking', () => {
    it('should correctly identify active modal', () => {
      const { result } = renderHook(() => useModalManager());

      act(() => {
        result.current.openModal('tutorial');
      });

      expect(result.current.isModalOpen('tutorial')).toBe(true);
      expect(result.current.isModalOpen('study')).toBe(false);
      expect(result.current.isModalOpen(null)).toBe(false);
    });

    it('should return false for queued modals', () => {
      const { result } = renderHook(() => useModalManager());

      act(() => {
        result.current.openModal('tutorial');
      });

      act(() => {
        result.current.openModal('study');
      });

      expect(result.current.isModalOpen('tutorial')).toBe(true);
      expect(result.current.isModalOpen('study')).toBe(false);
    });
  });

  describe('Edge Cases', () => {
    it('should handle opening null modal', () => {
      const { result } = renderHook(() => useModalManager());

      act(() => {
        result.current.openModal(null);
      });

      expect(result.current.activeModal).toBeNull();
    });

    it('should handle closing when no modal is open', () => {
      const { result } = renderHook(() => useModalManager());

      act(() => {
        result.current.closeModal();
      });

      expect(result.current.activeModal).toBeNull();
    });

    it('should handle closeAllModals when no modals exist', () => {
      const { result } = renderHook(() => useModalManager());

      act(() => {
        result.current.closeAllModals();
      });

      expect(result.current.activeModal).toBeNull();
      expect(result.current.hasQueuedModals).toBe(false);
    });

    it('should handle rapid open/close cycles', () => {
      const { result } = renderHook(() => useModalManager());

      act(() => {
        result.current.openModal('tutorial');
        result.current.closeModal();
        result.current.openModal('study');
        result.current.closeModal();
        result.current.openModal('postGame');
      });

      expect(result.current.activeModal).toBe('postGame');
      expect(result.current.hasQueuedModals).toBe(false);
    });
  });

  describe('Complex Scenarios', () => {
    it('should handle opening same modal type multiple times', () => {
      const { result } = renderHook(() => useModalManager());

      act(() => {
        result.current.openModal('tutorial');
      });

      act(() => {
        result.current.openModal('tutorial');
      });

      act(() => {
        result.current.openModal('tutorial');
      });

      expect(result.current.activeModal).toBe('tutorial');
      expect(result.current.hasQueuedModals).toBe(true);

      act(() => {
        result.current.closeModal();
      });

      expect(result.current.activeModal).toBe('tutorial');
    });

    it('should handle mixed operations', () => {
      const { result } = renderHook(() => useModalManager());

      act(() => {
        result.current.openModal('tutorial');
      });

      act(() => {
        result.current.openModal('study');
      });

      expect(result.current.activeModal).toBe('tutorial');

      act(() => {
        result.current.openModal('postGame');
      });

      expect(result.current.hasQueuedModals).toBe(true);

      act(() => {
        result.current.closeModal();
      });

      expect(result.current.activeModal).toBe('study');

      act(() => {
        result.current.openModal('gameMode');
      });

      expect(result.current.hasQueuedModals).toBe(true);

      act(() => {
        result.current.closeAllModals();
      });

      expect(result.current.activeModal).toBeNull();
      expect(result.current.hasQueuedModals).toBe(false);
    });
  });
});
