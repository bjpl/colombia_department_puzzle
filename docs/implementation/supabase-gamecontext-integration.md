# GameContext Supabase Integration Recommendations

**Status:** Design Complete - Ready for Implementation
**Author:** Storage Sync Specialist
**Date:** 2025-10-11

## Overview

This document outlines recommended integration points for connecting GameContext with the new Supabase sync capabilities in the storage service.

## Current Architecture

GameContext uses Zustand store for game state management with the following key features:
- Game session tracking (score, time, attempts)
- Regional progress tracking (stars, best times)
- Game mode management (full map, regional, progression)

## Recommended Integration Points

### 1. Game Session Completion Hook

**Location:** `src/context/GameContext.tsx` - `placeDepartment` action when `isComplete` is true

**Current Code:**
```typescript
const isComplete = newPlaced.size === state.activeDepartments.length;

return {
  placedDepartments: newPlaced,
  score: newScore,
  attempts: 0,
  currentDepartment: null,
  isGameComplete: isComplete
};
```

**Recommended Addition:**
```typescript
const isComplete = newPlaced.size === state.activeDepartments.length;

// Trigger Supabase sync on game completion
if (isComplete) {
  syncGameCompletionToSupabase({
    score: newScore,
    elapsedTime: state.elapsedTime,
    hintsUsed: 3 - state.hints,
    mistakes: state.attempts,
    gameMode: state.gameMode,
  }).catch(err => console.warn('Failed to sync game completion:', err));
}

return {
  placedDepartments: newPlaced,
  score: newScore,
  attempts: 0,
  currentDepartment: null,
  isGameComplete: isComplete
};
```

### 2. Regional Progress Tracking

**Location:** `updateRegionProgress` action

**Current Code:**
```typescript
updateRegionProgress: (region: string, progress: Partial<RegionProgress>) => {
  set((state) => {
    const newProgress = new Map(state.regionProgress);
    const currentProgress = newProgress.get(region) || {
      attemptCount: 0,
      bestTime: Infinity,
      bestAccuracy: 0,
      stars: 0 as 0 | 1 | 2 | 3
    };

    newProgress.set(region, { ...currentProgress, ...progress });

    // Calculate total stars
    let totalStars = 0;
    newProgress.forEach(p => totalStars += p.stars);

    return {
      regionProgress: newProgress,
      totalStars
    };
  });
}
```

**Recommended Addition:**
```typescript
updateRegionProgress: (region: string, progress: Partial<RegionProgress>) => {
  set((state) => {
    const newProgress = new Map(state.regionProgress);
    const currentProgress = newProgress.get(region) || {
      attemptCount: 0,
      bestTime: Infinity,
      bestAccuracy: 0,
      stars: 0 as 0 | 1 | 2 | 3
    };

    const updatedProgress = { ...currentProgress, ...progress };
    newProgress.set(region, updatedProgress);

    // Calculate total stars
    let totalStars = 0;
    newProgress.forEach(p => totalStars += p.stars);

    // Sync to Supabase if significant progress (new star or better time)
    if (progress.stars !== undefined ||
        (progress.bestTime !== undefined && progress.bestTime < currentProgress.bestTime)) {

      const profile = storage.getActiveProfile();
      if (profile?.supabaseUserId) {
        storage.syncGameProgressToSupabase({
          profileId: profile.id,
          regionProgress: Array.from(newProgress.entries()).map(([region, data]) => ({
            region,
            ...data
          }))
        }).catch(err => console.warn('Failed to sync regional progress:', err));
      }
    }

    return {
      regionProgress: newProgress,
      totalStars
    };
  });
}
```

### 3. Online/Offline Sync Queue Processing

**Location:** New effect in `GameProvider` component

**Recommended Addition:**
```typescript
export function GameProvider({ children }: { children: ReactNode }) {
  const gameState = useGameStore();

  // Process offline sync queue when app comes online
  useEffect(() => {
    const handleOnline = () => {
      console.log('App is online, processing sync queue...');
      storage.processOfflineSyncQueue().catch(err => {
        console.warn('Failed to process offline sync queue:', err);
      });
    };

    window.addEventListener('online', handleOnline);

    // Process queue on mount if already online
    if (navigator.onLine) {
      handleOnline();
    }

    return () => {
      window.removeEventListener('online', handleOnline);
    };
  }, []);

  return (
    <GameContext.Provider value={{ gameState }}>
      {children}
    </GameContext.Provider>
  );
}
```

### 4. User Profile Linking on Authentication

**Location:** New integration with AuthContext (when implemented)

**Recommended Pattern:**
```typescript
// In AuthContext or auth callback handler
const handleAuthSuccess = async (supabaseUser: User) => {
  // Link local profile to Supabase user
  const migrated = await storage.migrateLocalToSupabase(supabaseUser.id);

  if (migrated) {
    console.log('Successfully linked local profile to authenticated user');

    // Optionally refresh game state to show sync status
    // gameState.setProfileLinked(true);
  }
};
```

## Helper Function Implementations

Add these helper functions to a new file: `src/utils/supabaseSync.ts`

```typescript
import { storage } from '../services/storage';
import { gameStatsService } from '../services/game/GameStatsService';

/**
 * Sync game completion to Supabase
 */
export async function syncGameCompletionToSupabase(completion: {
  score: number;
  elapsedTime: number;
  hintsUsed: number;
  mistakes: number;
  gameMode: GameModeConfig;
}): Promise<void> {
  const profile = storage.getActiveProfile();

  if (!profile?.supabaseUserId) {
    return; // Not linked to Supabase, skip sync
  }

  const session: GameSessionSync = {
    userId: profile.supabaseUserId,
    difficulty: getDifficultyFromGameMode(completion.gameMode),
    completionTimeSeconds: Math.floor(completion.elapsedTime / 1000),
    completed: true,
    hintsUsed: completion.hintsUsed,
    mistakesMade: completion.mistakes,
    deviceType: storage['detectDeviceType'](),
    isPwa: storage['isPWA'](),
    startedAt: new Date(Date.now() - completion.elapsedTime).toISOString(),
    completedAt: new Date().toISOString(),
  };

  await gameStatsService.syncGameSession(session);
}

/**
 * Map game mode to difficulty level
 */
function getDifficultyFromGameMode(mode: GameModeConfig): 'easy' | 'medium' | 'hard' {
  if (mode.type === 'full') return 'hard';
  if (mode.type === 'region' && mode.selectedRegions) {
    // Insular = easy, 2-3 regions = medium, 4+ = hard
    const regionCount = mode.selectedRegions.length;
    if (regionCount === 1) return 'easy';
    if (regionCount <= 3) return 'medium';
    return 'hard';
  }
  return 'medium'; // Default for progression mode
}
```

## Implementation Checklist

- [ ] Add `syncGameCompletionToSupabase` call in `placeDepartment` when game completes
- [ ] Add Supabase sync in `updateRegionProgress` for significant progress
- [ ] Add online event listener in `GameProvider` for offline queue processing
- [ ] Create `src/utils/supabaseSync.ts` with helper functions
- [ ] Add integration with AuthContext for profile linking (after AuthContext is implemented)
- [ ] Test offline sync queue with network throttling
- [ ] Test profile migration from localStorage to Supabase
- [ ] Verify backward compatibility (game works without Supabase)

## Testing Strategy

### Unit Tests
- Test that game continues to work when `VITE_ENABLE_SUPABASE_AUTH=false`
- Test that sync operations are queued when offline
- Test that profile linking preserves existing localStorage data

### Integration Tests
- Test full game flow with authenticated user
- Test offline play → online sync flow
- Test profile migration on first login

### E2E Tests
- Complete game session as anonymous user
- Sign up → migrate local progress
- Verify progress appears in Supabase database
- Play offline → verify sync on reconnection

## Performance Considerations

- **Non-blocking:** All Supabase syncs use `.catch()` to prevent blocking game UI
- **Debouncing:** Regional progress sync should be debounced (not implemented yet, consider adding)
- **Queue limits:** Sync queue is stored in localStorage, monitor size to prevent quota issues
- **Retry strategy:** Max 3 retries per item, exponential backoff recommended (not implemented)

## Security Considerations

- **Feature flag:** All Supabase code is behind `VITE_ENABLE_SUPABASE_AUTH` flag
- **User consent:** Consider adding "Sync to cloud" toggle in settings (future enhancement)
- **Data minimization:** Only sync game stats, not personally identifiable information
- **RLS policies:** Ensure database RLS policies enforce user-only access (see security architecture docs)

## Next Steps

1. Wait for AuthContext implementation (parallel task)
2. Implement helper functions in `src/utils/supabaseSync.ts`
3. Add integration points in GameContext (can be done incrementally)
4. Add user settings toggle for cloud sync (optional, good UX enhancement)
5. Monitor Supabase usage and optimize sync frequency if needed

---

**Note:** This is a progressive enhancement. The game will continue to work perfectly without Supabase. All sync operations are optional and fail gracefully.
