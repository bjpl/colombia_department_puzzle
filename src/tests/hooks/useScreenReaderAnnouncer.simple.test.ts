import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useScreenReaderAnnouncer } from '../../hooks/useScreenReaderAnnouncer';

describe('useScreenReaderAnnouncer - Simple Test', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it('should initialize without errors', () => {
    const { result } = renderHook(() => useScreenReaderAnnouncer());

    expect(result.current).toBeDefined();
    expect(typeof result.current.announce).toBe('function');
    expect(typeof result.current.announceModalState).toBe('function');

    vi.useRealTimers();
  });
});
