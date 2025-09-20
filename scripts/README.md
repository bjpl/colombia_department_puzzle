# Scripts Directory

This directory contains utility scripts and tools for development and testing.

## Test Scripts

### test-game-modes.js
Tests different game modes and configurations.

### test-simplified-flow.js
Tests the simplified game flow implementation.

### test-all-progressions.js
Tests all progression paths through the game modes.

## Analysis Scripts

### flow-progression-analysis.bat / .sh
Analyzes the game flow and progression system.
- Windows: `flow-progression-analysis.bat`
- Unix/Mac: `flow-progression-analysis.sh`

### fix-ruv-swarm.bat
Windows utility for fixing ruv-swarm configuration issues.

## Usage

Most scripts are meant for development and testing purposes:

```bash
# Run a test script
node scripts/test-game-modes.js

# Run analysis (Windows)
scripts\flow-progression-analysis.bat

# Run analysis (Unix/Mac)
./scripts/flow-progression-analysis.sh
```

## Note

These scripts are primarily for development and debugging. They are not required for normal gameplay or deployment.