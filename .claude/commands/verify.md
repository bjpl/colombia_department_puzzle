# Verify Project

Run full project verification using parallel execution skill.

## Usage
```
/project:verify
```

## Actions
1. Run TypeScript check: `npm run typecheck`
2. Run linting: `npm run lint`
3. Run tests: `npm test -- --run`
4. Store results in claude-flow memory

## Skill Reference
Uses: skills/parallel-verification from claude-flow memory
