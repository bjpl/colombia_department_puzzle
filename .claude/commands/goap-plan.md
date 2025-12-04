# GOAP Planning

Apply Goal-Oriented Action Planning for complex development tasks.

## Usage
```
/project:goap-plan <goal>
```

## GOAP Process
1. **Define Goal State**: Parse the desired end state from input
2. **Analyze Current State**: Check typecheck, lint, tests, git status
3. **Generate Actions**: Create action sequence with preconditions/effects
4. **Optimize Path**: Find shortest path to goal
5. **Execute**: Run actions with monitoring

## Example
```
/project:goap-plan "all tests passing"
```

## Skill Reference
Uses: goap-planning-skill from claude-flow memory (namespace: skills)
