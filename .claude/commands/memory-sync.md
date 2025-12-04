# Memory Sync

Synchronize session state with claude-flow memory and hive-mind.

## Usage
```
/project:memory-sync
```

## Actions
1. Store current session state in swarm namespace
2. Update skills with new learnings
3. Train neural patterns from session
4. Backup to hive-mind collective memory

## Memory Namespaces
- `default`: Architecture and project knowledge
- `swarm`: Session state and task progress
- `skills`: Reusable skill patterns

## Commands
```bash
# List all memories
mcp__claude-flow__memory_usage {action: "list", namespace: "swarm"}

# Store new memory
mcp__claude-flow__memory_usage {action: "store", namespace: "skills", key: "...", value: {...}}

# Search memories
mcp__claude-flow__memory_search {pattern: "*", namespace: "skills"}
```
