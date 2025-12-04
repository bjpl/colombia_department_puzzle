# Neural Training

Train neural patterns from session learnings using SAFLA architecture.

## Usage
```
/project:neural-train
```

## Actions
1. Collect session data (files modified, errors fixed, patterns learned)
2. Train coordination pattern: `mcp__claude-flow__neural_train`
3. Store trained model ID in memory
4. Update skills with new patterns

## Training Types
- `coordination`: Task coordination patterns
- `optimization`: Performance optimization patterns
- `prediction`: Future state prediction

## Skill Reference
Uses: safla-neural agent from .claude/agents/neural/
