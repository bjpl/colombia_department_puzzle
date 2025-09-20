# Game Mechanics Documentation

## Overview

Colombia Departments Puzzle is an educational drag-and-drop game designed to teach players the geography of Colombia's 33 departments through interactive gameplay.

## Core Mechanics

### Drag and Drop System

#### Interaction Flow
1. **Selection**: Click/touch a department chip in the tray
2. **Dragging**: Move the department across the screen
3. **Visual Feedback**: Department follows cursor/finger
4. **Drop Zone Detection**: Highlights valid drop areas
5. **Placement**: Release to place the department
6. **Validation**: System checks if placement is correct
7. **Result**: Visual/audio feedback for success/failure

#### Technical Implementation
- Uses `@dnd-kit/core` for accessibility
- Touch and mouse support
- Keyboard navigation available
- 5-pixel drag threshold to prevent accidental drags

### Department Matching

#### Validation Rules
- Each department has a unique ID
- IDs are normalized for consistency (e.g., "San Andrés y Providencia" → "san-andres")
- Special handling for archipelago names
- Exact match required for successful placement

#### Visual States
- **Available**: Shown in tray with region color
- **Dragging**: Semi-transparent with elevated shadow
- **Placed Correctly**: Shown on map with green overlay
- **Attempted**: Red flash on incorrect placement

## Game Modes

### 1. Complete Colombia Mode

**Objective**: Place all 33 departments on the map

**Rules**:
- All departments available from start
- No time limit
- 3 hints available
- Score based on accuracy

**Difficulty**: Medium

### 2. Regional Practice Mode

**Objective**: Focus on specific regions

**Available Regions**:
- **Andina** (Central): 11 departments
- **Caribe** (North): 8 departments
- **Pacífica** (West): 4 departments
- **Orinoquía** (East): 4 departments
- **Amazonía** (South): 5 departments
- **Insular** (Islands): 1 department

**Rules**:
- Only selected region's departments shown
- Helps learn regional geography
- All regions unlocked (no progression required)

### 3. Time Challenge Mode

**Objective**: Complete the puzzle as fast as possible

**Rules**:
- Timer starts immediately
- Speed bonus for completion under 5 minutes
- Accuracy still matters for score
- Leaderboard eligible

### 4. Study Mode

**Objective**: Learn without pressure

**Features**:
- No scoring
- No timer
- Unlimited exploration
- Department information visible
- Can switch regions freely
- Perfect for learning

## Scoring System

### Point Calculation

```
Base Score = 100 points per department
Attempt Penalty = -10 points per wrong attempt
Minimum Score = 10 points per department

Final Score = Σ(Base Score - (Attempts × Penalty))
```

### Score Examples

| Scenario | Calculation | Points |
|----------|-------------|--------|
| Perfect placement | 100 - (0 × 10) | 100 |
| Second attempt | 100 - (1 × 10) | 90 |
| Fifth attempt | 100 - (4 × 10) | 60 |
| Many attempts | max(100 - (9 × 10), 10) | 10 |

### Bonus Points

- **Perfect Game**: +500 points (no mistakes)
- **Speed Bonus**: +300 points (<5 minutes)
- **No Hints**: +200 points

### Score Ranges

- **Master**: 3000+ points
- **Expert**: 2500-2999 points
- **Advanced**: 2000-2499 points
- **Intermediate**: 1500-1999 points
- **Beginner**: <1500 points

## Hint System

### Progressive Hints

#### Level 1: Region Hint
- **Cost**: 10 points
- **Effect**: Highlights the region where department belongs
- **Visual**: Region glows with colored border

#### Level 2: Letter Hint
- **Cost**: 20 points
- **Effect**: Shows first letter of department name
- **Visual**: Letter appears on target location

#### Level 3: Location Flash
- **Cost**: 50 points
- **Effect**: Briefly shows exact location
- **Visual**: Department outline flashes on map
- **Duration**: 3 seconds

### Hint Strategy
- Hints unlock progressively
- Must use Level 1 before Level 2
- Maximum 3 hints per department
- Total hints limited by game mode

## Achievement System

### Achievement Categories

#### Accuracy Achievements
- **Perfeccionista**: Complete with 100% accuracy
- **Preciso**: Complete with >90% accuracy
- **Cuidadoso**: Complete with >80% accuracy

#### Speed Achievements
- **Velocista**: Complete in <5 minutes
- **Rápido**: Complete in <10 minutes
- **Eficiente**: Complete in <15 minutes

#### Learning Achievements
- **Explorador**: First game completed
- **Estudioso**: Use study mode for 10+ minutes
- **Conocedor**: Complete all regions individually

#### Persistence Achievements
- **Persistente**: Complete after 10+ attempts
- **Determinado**: Complete without using hints
- **Maestro**: Achieve 3000+ points

### Achievement Rewards
- Visual badges in post-game report
- Profile statistics tracking
- Unlock new challenges (future feature)

## Difficulty Progression

### Learning Curve

1. **Discovery Phase** (Games 1-5)
   - Learn UI and controls
   - Discover department locations
   - Average accuracy: 40-60%

2. **Improvement Phase** (Games 6-15)
   - Memorize common departments
   - Develop strategies
   - Average accuracy: 60-80%

3. **Mastery Phase** (Games 16+)
   - Quick recognition
   - Minimal hints needed
   - Average accuracy: 80-95%

### Adaptive Difficulty (Future)
- Track player performance
- Suggest appropriate modes
- Adjust hint availability
- Recommend focus areas

## Feedback Systems

### Visual Feedback

#### Correct Placement
- Green checkmark animation
- Department locks in place
- Score increase animation
- Progress bar update

#### Incorrect Placement
- Red X animation
- Department returns to tray
- Shake animation on target
- Attempt counter increment

### Audio Feedback

#### Sound Effects
- **Pickup**: Soft click when selecting
- **Correct**: Pleasant chime
- **Incorrect**: Gentle buzz
- **Hint**: Subtle whoosh
- **Complete**: Victory fanfare

#### Volume Control
- Master volume slider
- Mute option
- Persistent settings

### Progress Indicators

#### Game Progress
- Placed counter: "X/33 Placed"
- Percentage bar
- Region completion badges
- Time elapsed display

#### Session Progress
- Current score
- Attempts made
- Hints remaining
- Accuracy percentage

## Special Cases

### San Andrés y Providencia
- Archipelago in Caribbean Sea
- Special name normalization
- Multiple name variations accepted
- Visual indicator for island location

### Bogotá D.C.
- Capital district (not a department)
- Special styling
- Central location
- Counted as 33rd division

## End Game

### Completion Conditions
- All departments correctly placed
- No remaining pieces in tray
- 100% progress achieved

### Post-Game Flow
1. Final animation plays
2. Score calculation displayed
3. Achievements checked
4. Statistics updated
5. Report modal shown
6. Options presented:
   - Play Again
   - Try Different Mode
   - Study Mode
   - Share Results

## Performance Metrics

### Tracking Statistics
- Games played
- Games completed
- Total score
- High score
- Best time
- Average accuracy
- Hints used
- Perfect games

### Analytics (Local)
- Department difficulty ranking
- Common mistake patterns
- Time per department
- Hint usage patterns
- Mode preferences

## Accessibility Features

### Visual Accessibility
- High contrast borders
- Color-blind friendly palette
- Large touch targets
- Clear typography
- Optional animations

### Motor Accessibility
- Keyboard navigation
- Large drag handles
- No time pressure (study mode)
- Adjustable drag sensitivity
- Click-to-select option (future)

### Cognitive Accessibility
- Progressive difficulty
- Clear instructions
- Visual hints
- Unlimited attempts
- Study mode for learning

## Educational Value

### Learning Outcomes
1. **Geographic Knowledge**
   - Department locations
   - Regional divisions
   - Relative positions
   - Border relationships

2. **Cultural Awareness**
   - Capital cities
   - Regional characteristics
   - Economic activities
   - Cultural diversity

3. **Cognitive Skills**
   - Spatial reasoning
   - Pattern recognition
   - Memory improvement
   - Problem-solving

### Pedagogical Approach
- **Active Learning**: Hands-on interaction
- **Immediate Feedback**: Instant validation
- **Spaced Repetition**: Multiple play sessions
- **Progressive Disclosure**: Information revealed gradually
- **Gamification**: Points and achievements motivate learning

## Balance Considerations

### Fairness
- All departments equally sized in tray
- No preference for placement order
- Consistent scoring rules
- Equal hint availability

### Challenge Balance
- Not too easy (maintains engagement)
- Not too hard (prevents frustration)
- Multiple difficulty options
- Progressive hint system

### Engagement Loops
1. **Core Loop**: Select → Drag → Place → Feedback
2. **Session Loop**: Play → Complete → Review → Replay
3. **Progression Loop**: Learn → Improve → Master → Challenge

---

*These mechanics are designed to create an engaging, educational experience that adapts to different learning styles and skill levels.*