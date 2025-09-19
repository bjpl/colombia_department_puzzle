import { useState, useCallback } from 'react';

export type ModalType = 'tutorial' | 'study' | 'postGame' | null;

export function useModalManager() {
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [modalQueue, setModalQueue] = useState<ModalType[]>([]);

  const openModal = useCallback((type: ModalType) => {
    if (activeModal && type) {
      // If a modal is already open, queue the new one
      setModalQueue(prev => [...prev, type]);
    } else {
      setActiveModal(type);
    }
  }, [activeModal]);

  const closeModal = useCallback(() => {
    // Check if there are queued modals
    if (modalQueue.length > 0) {
      const [next, ...rest] = modalQueue;
      setActiveModal(next);
      setModalQueue(rest);
    } else {
      setActiveModal(null);
    }
  }, [modalQueue]);

  const closeAllModals = useCallback(() => {
    setActiveModal(null);
    setModalQueue([]);
  }, []);

  const isModalOpen = useCallback((type: ModalType) => {
    return activeModal === type;
  }, [activeModal]);

  return {
    activeModal,
    openModal,
    closeModal,
    closeAllModals,
    isModalOpen,
    hasQueuedModals: modalQueue.length > 0,
  };
}