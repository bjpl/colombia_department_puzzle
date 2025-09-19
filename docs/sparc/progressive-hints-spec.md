# Progressive Hints System - SPARC Specification

## Requirements
- Three hint levels with increasing cost and helpfulness
- Visual feedback for each hint type
- Deduct points from score when used
- Track hint usage for analytics

## Hint Levels
1. **Region Highlight (10 points)**
   - Highlights the region where department belongs
   - Subtle pulsing animation
   - Region name displayed

2. **First Letter (20 points)**
   - Shows first letter of department name
   - Appears as overlay on map
   - Combined with region highlight

3. **Flash Location (50 points)**
   - Department area flashes/pulses
   - Strong visual indicator
   - 3-second duration

## User Stories
- As a player, I want graduated hints so I can learn without giving up
- As a learner, I want hints that teach me patterns, not just give answers
- As a teacher, I want to see which students use hints most

## Technical Requirements
- Integrate with existing game state
- Animate smoothly without performance impact
- Store hint usage in game statistics