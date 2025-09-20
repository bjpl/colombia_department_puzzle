# Colombia Puzzle Game - Flow Test Checklist

## 🎯 Test Date: ${new Date().toISOString().split('T')[0]}

## 1. First-Time User Flow
- [ ] **QuickStart Modal appears** for new user
- [ ] Name input validation works
- [ ] Skill level selection (Beginner/Intermediate/Expert)
- [ ] Learning style preference (Visual/Interactive/Progressive)
- [ ] Recommended mode based on selections
- [ ] Smooth transition animation (1s) to game
- [ ] Game mode correctly set after QuickStart
- [ ] Skip option opens Game Mode selector

## 2. Returning User Flow (No Tutorial)
- [ ] **Tutorial Modal appears** if not seen before
- [ ] Tutorial navigation works (Next/Previous)
- [ ] Tutorial completion marks as shown
- [ ] Skip option works correctly
- [ ] No QuickStart shown for returning users

## 3. Experienced User Flow
- [ ] **Direct to game** if tutorial already seen
- [ ] Game loads with last selected mode
- [ ] No modals appear automatically
- [ ] Previous settings preserved

## 4. Game Mode Selector
- [ ] Full country mode selectable
- [ ] Regional mode with multi-select
- [ ] Progressive mode with locked regions
- [ ] Difficulty indicators clear
- [ ] Selection persists correctly
- [ ] Cancel returns to previous state

## 5. Study Mode Transitions
### From Game Header
- [ ] Study button opens Study Mode
- [ ] Current game mode preserved
- [ ] Transition animation smooth (1s)
- [ ] "Start Game" returns to game with same mode
- [ ] Mode selector within Study Mode works

### From Post-Game
- [ ] "Study Mode" option available
- [ ] Preserves game results
- [ ] Can return to game after study
- [ ] Progress tracked correctly

## 6. Game Flow
### Drag and Drop
- [ ] Click selection persists (no drag)
- [ ] Drag >5px clears on drop
- [ ] Correct placement feedback
- [ ] Incorrect placement feedback
- [ ] Score updates properly
- [ ] Attempts counter works

### Pan and Zoom
- [ ] Pan works on background only
- [ ] Pan after region toggle ✓
- [ ] Pan after drag/drop action ✓
- [ ] Pan after viewing 3 hints ✓
- [ ] Zoom controls responsive
- [ ] Reset view button works

### Hints System
- [ ] Level 1 hint on first click
- [ ] Level 2 hint on second attempt
- [ ] Level 3 hint on third+ attempt
- [ ] All 33 departments have unique hints
- [ ] Hint modal displays correctly
- [ ] Department clears after Level 3 hint

## 7. Region Colors
- [ ] Toggle shows/hides colors
- [ ] Pacífico light enough to see borders
- [ ] Andina/Amazonía greens distinguishable
- [ ] Legend in bottom-right corner
- [ ] Pills match region colors
- [ ] Colors persist during gameplay

## 8. Post-Game Report
- [ ] Shows on game completion
- [ ] Statistics accurate
- [ ] Play Again resets properly
- [ ] Study Mode transition works
- [ ] Close returns to clean state

## 9. Mode Transitions
- [ ] Study → Game animation (1s)
- [ ] Game → Study animation (1s)
- [ ] QuickStart → Game animation (1.2s)
- [ ] Complete → Next animation (1.5s)
- [ ] Tips cycle during transition
- [ ] Progress bar smooth

## 10. Edge Cases & Fallbacks
### Invalid Game Mode
- [ ] Defaults to Insular region
- [ ] Shows at least 1 department
- [ ] No crashes or errors

### Empty Departments
- [ ] Fallback to Insular region
- [ ] Warning message if needed
- [ ] Game remains playable

### Window Focus Loss
- [ ] Current department clears
- [ ] Game state preserved
- [ ] Can resume normally

## 11. Performance
- [ ] No lag during drag operations
- [ ] Smooth animations throughout
- [ ] Memory usage stable
- [ ] No console errors
- [ ] HMR updates work correctly

## 12. State Management
- [ ] Zustand store updates properly
- [ ] No stale closures
- [ ] Timer syncs with game state
- [ ] Modal states independent
- [ ] Progress saves correctly

## Test Results Summary
- **Passed**: ___ / ___
- **Failed**: ___ / ___
- **Blocked**: ___ / ___

## Notes & Issues Found
_Document any issues or unexpected behaviors here_

---

## Quick Test Commands
```bash
# Clear localStorage to test first-time user
localStorage.clear()

# Set returning user without tutorial
localStorage.setItem('colombiaPuzzle_settings', '{"tutorialShown":false}')

# Set experienced user
localStorage.setItem('colombiaPuzzle_settings', '{"tutorialShown":true}')

# Check current game mode
JSON.parse(localStorage.getItem('colombiaPuzzle_gameState')).gameMode
```