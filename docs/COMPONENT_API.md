# Component API Documentation

## Core Components

### GameContainer

**Location**: `src/components/GameContainer.tsx`

**Purpose**: Main game orchestrator that manages the entire game flow, layout, and interactions.

**Props**: None (uses context)

**Key Methods**:
- `handleDragStart(event)`: Initiates department dragging
- `handleDragMove(event)`: Tracks drag distance for gesture detection
- `handleDragEnd(event)`: Validates and processes department placement
- `handleDragCancel()`: Handles ESC key or cancelled drags

**State Dependencies**:
- Uses `useGame()` hook for game state
- Uses `useModalManager()` for modal control
- Uses `useGameTimer()` for time tracking

**Example Usage**:
```tsx
<GameContainer />
```

---

### OptimizedColombiaMap

**Location**: `src/components/OptimizedColombiaMap.tsx`

**Purpose**: Renders the interactive Colombia map with droppable zones for each department.

**Props**: None (uses game context)

**Features**:
- GeoJSON-based accurate boundaries
- D3-geo Mercator projection
- Responsive SVG scaling
- Pan and zoom controls
- Visual feedback for placed departments

**Special Cases**:
- San Andrés archipelago name normalization
- Automatic viewport adjustment

**Rendered Elements**:
- `DroppableDepartment`: Drop zones for each department
- `DepartmentPath`: Visual paths for boundaries
- Pan/Zoom control buttons

---

### DepartmentTray

**Location**: `src/components/DepartmentTray.tsx`

**Purpose**: Displays draggable department chips organized by region.

**Props**:
```typescript
interface DepartmentTrayProps {
  layout?: 'horizontal' | 'vertical' | 'compact' | 'ultra-compact'
}
```

**Layout Modes**:
- **horizontal**: Grid layout (default)
- **vertical**: Sidebar list
- **compact**: Small chips with region grouping
- **ultra-compact**: Minimal space usage

**Components**:
- `DraggableChip`: Compact draggable element
- `DraggableDepartment`: Full-size draggable (legacy)

---

### StudyMode

**Location**: `src/components/StudyMode.tsx`

**Purpose**: Interactive learning mode for exploring departments without time pressure.

**Props**:
```typescript
interface StudyModeProps {
  onClose: () => void
  onStartGame: () => void
  onSelectMode?: (mode: GameModeConfig) => void
}
```

**Features**:
- Department information display
- Regional filtering
- Visual exploration
- No scoring or penalties

---

### PostGameReport

**Location**: `src/components/PostGameReport.tsx`

**Purpose**: Displays comprehensive game statistics and achievements after completion.

**Props**:
```typescript
interface PostGameReportProps {
  onClose: () => void
  onPlayAgain: () => void
  onStudyMode: () => void
  onSelectMode?: (mode: GameModeConfig) => void
}
```

**Displays**:
- Final score and time
- Accuracy percentage
- Achievements earned
- Performance recommendations
- Next challenge suggestions

---

### GameModeSelector

**Location**: `src/components/GameModeSelector.tsx`

**Purpose**: Interface for selecting game modes and difficulty levels.

**Props**:
```typescript
interface GameModeSelectorProps {
  onSelectMode: (mode: GameModeConfig) => void
  onClose: () => void
  userStats: {
    unlockedRegions: Set<string>
    regionProgress: Map<string, RegionProgress>
    totalStars: number
  }
}
```

**Game Modes**:
- Complete Colombia (33 departments)
- Regional Practice (6 regions)
- Time Challenge
- Progression Mode
- Study Mode

---

## UI Components

### GameHeader

**Location**: `src/components/GameHeader.tsx`

**Purpose**: Top navigation bar with score, timer, and controls.

**Props**:
```typescript
interface GameHeaderProps {
  onGameMode: () => void
  onStudyMode: () => void
  onTutorial: () => void
}
```

**Displays**:
- Current score
- Elapsed time
- Hints remaining
- Game controls (pause, reset, modes)

---

### EducationalPanel

**Location**: `src/components/EducationalPanel.tsx`

**Purpose**: Shows department information and hints.

**Props**:
```typescript
interface EducationalPanelProps {
  compact?: boolean
}
```

**Features**:
- Department facts display
- Progressive hint system
- Game statistics
- Instructions

---

### PlacementFeedback

**Location**: `src/components/PlacementFeedback.tsx`

**Purpose**: Visual feedback for placement attempts.

**Props**:
```typescript
interface PlacementFeedbackProps {
  show: boolean
  isCorrect: boolean
  departmentName: string
  position: { x: number; y: number }
}
```

**Animations**:
- Green checkmark for correct
- Red X for incorrect
- Fade in/out transitions

---

## Error Boundaries

### MapErrorBoundary

**Location**: `src/components/MapErrorBoundary.tsx`

**Purpose**: Isolates map rendering failures.

**Features**:
- Catches GeoJSON parsing errors
- Provides fallback UI
- Retry mechanism

---

### GameLogicErrorBoundary

**Location**: `src/components/GameLogicErrorBoundary.tsx`

**Purpose**: Handles game state errors.

**Features**:
- State corruption recovery
- Game reset option
- Error logging

---

### ComponentErrorBoundary

**Location**: `src/components/ComponentErrorBoundary.tsx`

**Purpose**: Generic component error handling.

**Props**:
```typescript
interface ComponentErrorBoundaryProps {
  componentName: string
  children: React.ReactNode
  fallback?: React.ReactNode
  onError?: (error: Error, errorInfo: ErrorInfo) => void
}
```

---

## Hooks

### useGame

**Location**: `src/context/GameContext.tsx`

**Purpose**: Access game state and actions.

**Returns**:
```typescript
{
  // State
  departments: Department[]
  placedDepartments: Set<string>
  currentDepartment: Department | null
  score: number
  attempts: number
  hints: number

  // Actions
  selectDepartment: (dept: Department) => void
  placeDepartment: (id: string, correct: boolean) => void
  resetGame: () => void
  useHint: () => void
  // ... more
}
```

---

### useModalManager

**Location**: `src/hooks/useModalManager.ts`

**Purpose**: Manage modal state and visibility.

**Returns**:
```typescript
{
  openModal: (modalId: string) => void
  closeModal: () => void
  isModalOpen: (modalId: string) => boolean
}
```

---

### useGameTimer

**Location**: `src/hooks/useGameTimer.ts`

**Purpose**: Track game elapsed time.

**Returns**:
```typescript
{
  elapsedTime: number
  isRunning: boolean
  isPaused: boolean
  startTimer: () => void
  pauseTimer: () => void
  resumeTimer: () => void
  stopTimer: () => void
  resetTimer: () => void
}
```

---

### useSoundEffect

**Location**: `src/services/soundManager.ts`

**Purpose**: Play game sound effects.

**Returns**:
```typescript
{
  playSound: (type: SoundType, volume?: number) => void
  initSound: () => void
  toggleSound: () => void
  isSoundEnabled: boolean
}
```

**Sound Types**:
- `correct`: Successful placement
- `incorrect`: Failed placement
- `hint`: Hint usage
- `win`: Game completion
- `pickup`: Department selection

---

## Data Types

### Department

```typescript
interface Department {
  id: string
  name: string
  capital: string
  region: string
  area?: number
  population?: number
  geography?: {
    climate: string[]
    features: string[]
  }
  culture?: {
    festivals: string[]
    foods: string[]
  }
  economy?: {
    mainActivities: string[]
    products: string[]
  }
  funFacts?: string[]
}
```

### GameModeConfig

```typescript
interface GameModeConfig {
  type: 'complete' | 'region' | 'time' | 'progression' | 'study'
  regions?: string[]
  timeLimit?: number
  difficulty?: 'easy' | 'medium' | 'hard'
  hintsAllowed?: number
}
```

### RegionProgress

```typescript
interface RegionProgress {
  completed: boolean
  bestScore: number
  bestTime: number
  attempts: number
  stars: 0 | 1 | 2 | 3
}
```

---

## Utility Functions

### normalizeId

**Location**: `src/utils/nameNormalizer.ts`

**Purpose**: Normalize department names for consistent IDs.

```typescript
function normalizeId(name: string): string
```

**Example**:
```typescript
normalizeId("San Andrés y Providencia") // Returns: "san-andres"
```

### departmentNameMap

**Purpose**: Maps variations of department names to canonical IDs.

```typescript
const departmentNameMap: Record<string, string>
```

---

## Services

### StorageService

**Location**: `src/services/storage.ts`

**Methods**:
- `getProfiles(): Profile[]`
- `saveProfile(profile: Profile): void`
- `getActiveProfile(): Profile | null`
- `setActiveProfile(profileId: string): void`
- `saveSession(session: GameSession): void`
- `getSettings(): Settings`
- `saveSetting(key: string, value: any): void`

### SoundManager

**Location**: `src/services/soundManager.ts`

**Methods**:
- `initSound(): void`
- `playSound(type: SoundType, volume?: number): void`
- `toggleSound(): void`
- `setVolume(volume: number): void`

---

## Constants

### Game Constants

**Location**: `src/constants/gameConstants.ts`

**Exports**:
- `SCORING`: Score calculation values
- `TIMING`: Animation and transition durations
- `MAP`: Map configuration settings
- `REGIONS`: Region definitions
- `STORAGE_KEYS`: LocalStorage keys
- `Z_INDEX`: Layer ordering

### Region Colors

**Location**: `src/constants/regionColors.ts`

**Purpose**: Consistent color theming for regions.

```typescript
export const REGION_TAILWIND_CLASSES = {
  'Andina': 'bg-green-100 border-green-300 hover:bg-green-200',
  'Caribe': 'bg-blue-100 border-blue-300 hover:bg-blue-200',
  // ...
}
```