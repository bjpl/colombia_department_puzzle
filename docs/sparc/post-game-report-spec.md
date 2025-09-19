# Post-Game Report Specification (SPARC)

## 1. SPECIFICATION

### Purpose
Create a comprehensive post-game report that shows player statistics, achievements, and performance analysis after completing the puzzle.

### Requirements
- Display game completion statistics (time, score, hints used)
- Show department-specific performance (which were hardest)
- Calculate accuracy and efficiency metrics
- Provide achievement badges for special accomplishments
- Compare with personal best and averages
- Option to save/share results
- Integration with user profiles

### User Stories
1. As a player, I want to see my final score and time
2. As a player, I want to know which departments gave me trouble
3. As a player, I want to earn achievements for good performance
4. As a player, I want to compare this game with my best

## 2. PSEUDOCODE

```
COMPONENT PostGameReport:
  INPUT: gameSession, userProfile

  CALCULATE statistics:
    - Final score and time
    - Accuracy percentage
    - Hints used breakdown
    - Department difficulty analysis

  DETERMINE achievements:
    IF perfect_game: Award "Perfecto"
    IF no_hints: Award "Sin Ayuda"
    IF under_5_minutes: Award "Velocista"
    IF first_completion: Award "Primera Victoria"

  COMPARE with history:
    - Check if new high score
    - Check if best time
    - Calculate improvement trend

  DISPLAY report:
    - Summary section with key metrics
    - Detailed statistics breakdown
    - Achievement showcase
    - Department performance heatmap
    - Action buttons (Play Again, Share, Study Mode)
```

## 3. ARCHITECTURE

### Component Structure
```
PostGameReport/
├── PostGameReport.tsx (main component)
├── StatsCard.tsx (reusable stat display)
├── AchievementBadge.tsx (achievement icons)
├── DepartmentHeatmap.tsx (visual performance)
└── ShareButtons.tsx (social sharing)
```

### Data Flow
1. Game completion triggers report
2. Gather session data from GameContext
3. Load user profile from storage
4. Calculate all metrics
5. Check for new achievements
6. Update user statistics
7. Display report modal

## 4. REFINEMENT

### Performance Optimizations
- Memoize calculations for statistics
- Lazy load achievement animations
- Use React.memo for static components

### Enhanced Features
- Animated number counters
- Confetti animation for new records
- Department difficulty heatmap
- Trend charts for progress over time

## 5. COMPLETION

### Implementation Checklist
- [ ] Create PostGameReport component
- [ ] Implement statistics calculations
- [ ] Design achievement system
- [ ] Add comparison with history
- [ ] Create sharing functionality
- [ ] Integrate with storage service
- [ ] Add animations and visual polish