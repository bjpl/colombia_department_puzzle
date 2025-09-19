# UI/UX Issues Identified and Fixes

## 1. Scrolling Issues

### Study Mode
- **Problem**: Department panels don't scroll properly when content overflows
- **Cause**: Fixed height with `h-[calc(90vh-120px)]` prevents proper scrolling
- **Fix**: Make container flexible and allow natural scrolling

### Post-Game Report
- **Problem**: Similar scrolling constraints
- **Fix**: Adjust max-height calculations

### Interactive Tutorial
- **Problem**: Content might overflow on smaller screens
- **Fix**: Add responsive height management

## 2. Mobile Responsiveness Issues

### All Modals
- **Problem**: Fixed widths (max-w-6xl, max-w-4xl) break on mobile
- **Fix**: Add responsive breakpoints

### Game Board
- **Problem**: Fixed layout doesn't adapt to mobile
- **Fix**: Add responsive grid layouts

## 3. Overflow Issues

### Department Tray
- **Problem**: Long department names might overflow
- **Fix**: Add text truncation with ellipsis

### Educational Panel
- **Problem**: Content can overflow on smaller screens
- **Fix**: Add proper overflow handling

## 4. Z-Index Stacking

### Multiple Modals
- **Problem**: Inconsistent z-index values
- **Fix**: Use constants for z-index layers

## 5. Touch Interaction

### Drag and Drop
- **Problem**: Not optimized for touch devices
- **Fix**: Add touch-specific handlers

## 6. Accessibility

### Keyboard Navigation
- **Problem**: Modal close buttons not keyboard accessible
- **Fix**: Add proper tabIndex and key handlers

### Screen Readers
- **Problem**: Missing ARIA labels
- **Fix**: Add aria-labels and roles