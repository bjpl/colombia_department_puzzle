# Interactive Tutorial Specification (SPARC)

## 1. SPECIFICATION

### Purpose
Create an interactive step-by-step tutorial that teaches new players how to play the Colombia Puzzle game.

### Requirements
- Welcome screen with game overview
- Step-by-step guidance through core mechanics
- Interactive practice with one department
- Explanation of scoring and hints system
- Tips for success
- Skip option for experienced players
- Visual indicators and animations

### User Stories
1. As a new player, I want to understand how drag-and-drop works
2. As a new player, I want to practice with one department before starting
3. As a new player, I want to understand the scoring system
4. As a new player, I want to know about available hints

## 2. PSEUDOCODE

```
COMPONENT InteractiveTutorial:
  STATE:
    - currentStep: number
    - isCompleted: boolean
    - practiceMode: boolean

  STEPS = [
    1. Welcome and introduction
    2. Show map and explain regions
    3. Demonstrate drag-and-drop
    4. Practice placement (Cundinamarca)
    5. Explain scoring system
    6. Show hint system
    7. Tips and strategies
    8. Ready to play
  ]

  FUNCTION nextStep():
    IF currentStep < STEPS.length:
      currentStep++
      animateTransition()
    ELSE:
      completeTutorial()

  FUNCTION skipTutorial():
    saveTutorialCompleted()
    startGame()

  RENDER:
    DISPLAY current step content
    HIGHLIGHT relevant UI elements
    SHOW progress indicator
    PROVIDE next/skip buttons
```

## 3. ARCHITECTURE

### Component Structure
```
InteractiveTutorial/
├── InteractiveTutorial.tsx (main controller)
├── TutorialStep.tsx (individual step renderer)
├── TutorialOverlay.tsx (highlight areas)
├── PracticeMode.tsx (mini-game for practice)
└── TutorialProgress.tsx (progress indicator)
```

### Tutorial Flow
1. Check if first-time player
2. Display tutorial overlay
3. Guide through each step
4. Allow interaction at specific points
5. Save completion status
6. Transition to main game

## 4. REFINEMENT

### Enhanced Features
- Animated mascot/guide character
- Smooth transitions between steps
- Interactive practice with feedback
- Achievement for completing tutorial
- Contextual tips during gameplay

### Accessibility
- Clear, simple language
- Visual and text instructions
- Keyboard navigation support
- Mobile-friendly interactions

## 5. COMPLETION

### Implementation Checklist
- [ ] Create tutorial component structure
- [ ] Implement step navigation
- [ ] Add overlay highlighting
- [ ] Create practice mini-game
- [ ] Add animations and transitions
- [ ] Save tutorial completion status
- [ ] Integrate with main game flow