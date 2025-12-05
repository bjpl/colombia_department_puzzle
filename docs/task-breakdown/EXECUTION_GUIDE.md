# GOAP Task Execution Guide

**Purpose:** Step-by-step guide for executing the 490-task GOAP plan

---

## Prerequisites

Before starting any phase:

1. **Environment Setup**
   ```bash
   npm install
   npm run typecheck  # Baseline: 5 errors
   npm test           # Baseline: ~842/914 passing
   ```

2. **Tools Required**
   - Node.js 18+
   - Git
   - VS Code (recommended) with extensions:
     - ESLint
     - TypeScript
     - Mermaid
     - GitLens

3. **Understanding Task Format**
   - Read `TASK_INDEX.md` first
   - Each task: 30min-4h maximum
   - Validation command per task
   - Rollback procedure documented

---

## Execution Patterns

### Pattern 1: Solo Developer (Sequential)

**Day-by-day plan for Phase 1:**

**Day 1 (8h):**
```bash
# Morning (4h): M1.1-M1.4 (TypeScript core fixes)
# Start
git checkout -b phase1-m1-typescript

# M1.1 (0.5h): Remove isCI variable
# ... execute task ...
npm run typecheck  # Validate: 4 errors
git add src/tests/setup.ts
git commit -m "fix(M1.1): remove unused isCI variable"

# M1.2 (1h): Fix RAF type
# ... execute task ...
npm run typecheck  # Validate: 3 errors
git add src/tests/setup.ts
git commit -m "fix(M1.2): fix requestAnimationFrame type cast"

# M1.3 (1.5h): Create TouchListMock
# ... execute task ...
npm run typecheck  # Validate: TouchList errors gone
git add src/tests/setup.ts
git commit -m "feat(M1.3): create TouchListMock class"

# M1.4 (1h): Apply helper
# ... execute task ...
npm run typecheck  # Validate: 0 errors ✓
npm test -- --run  # All tests pass
git add src/tests/setup.ts
git commit -m "fix(M1.4): apply TouchList helper to events"

# Afternoon (4h): M3.1-M3.4 (Hook infrastructure start)
git checkout -b phase1-m3-hooks

# M3.1 (1.5h): Hook testing infrastructure
# ... execute task ...
git add src/tests/utils/hooks/
git commit -m "feat(M3.1): create hook testing infrastructure"

# M3.2 (2h): useGame hook tests
# ... execute task ...
npm test -- src/tests/hooks/useGame.test.tsx --run
git add src/tests/hooks/useGame.test.tsx
git commit -m "test(M3.2): add useGame hook tests"

# M3.3 (0.5h of 2h - continue tomorrow)
```

**Day 2 (8h):**
```bash
# Continue M3.3, M3.4, start M4...
```

**Benefits:**
- Clear daily goals
- Measurable progress
- Easy to pause/resume

### Pattern 2: Team of 3 Developers (Parallel)

**Agent Assignment:**
```yaml
Developer A (Coder):
  - M1: TypeScript fixes (Days 1-2)
  - M7: Component refactoring (Days 8-12)

Developer B (Tester):
  - M2: Auth tests (Days 3-5)
  - M5: Mobile tests (Days 6-8)
  - M6: Component tests (Days 9-12)

Developer C (Full-stack):
  - M3: Hook tests (Days 1-3)
  - M4: React warnings (Days 4-5)
  - M8: Type safety (Days 13-16)
```

**Daily Coordination:**
```bash
# Morning standup (15 min)
# - Review yesterday's completed tasks
# - Identify blockers
# - Adjust assignments if needed

# Afternoon sync (15 min)
# - Quick progress check
# - Merge completed PRs
# - Resolve conflicts
```

### Pattern 3: Swarm of 5+ Agents (Highly Parallel)

**Week 1 Execution:**
```yaml
Monday:
  Agent-1 (coder): M1.1-M1.4 (TypeScript)
  Agent-2 (tester): M3.1-M3.4 (Hook infra)
  Agent-3 (reviewer): M4.1 (Warning audit)
  Agent-4 (mobile-dev): M5.1 (Touch simulator)
  Agent-5 (api-docs): Documentation setup

Tuesday:
  Agent-1: M1.5-M1.8 (TS validation)
  Agent-2: M3.5-M3.10 (More hooks)
  Agent-3: M4.2-M4.4 (Fix warnings)
  Agent-4: M5.2-M5.5 (Mobile tests)
  Agent-5: M2.1-M2.2 (Auth utils)

# ... and so on
```

**Coordination via AgentDB:**
```typescript
// Store agent status
await agentdb.put('goap/agents/agent-1/status', {
  currentTask: 'M1.4',
  progress: 0.75,
  blockers: [],
  eta: '15 minutes'
});

// Retrieve task dependencies
const deps = await agentdb.get('goap/dependencies/M1.4');
// Check if all deps completed
const ready = deps.every(d =>
  agentdb.get(`goap/tasks/${d}/status`) === 'completed'
);
```

---

## Task Execution Workflow

### For Each Task:

1. **Pre-Execution Checklist**
   ```bash
   # Read task file
   cat docs/task-breakdown/phase-X/MY-task.md

   # Check dependencies completed
   git log --oneline --grep "MY-1"  # Previous task

   # Create branch
   git checkout -b task-MY-X

   # Verify baseline
   npm run typecheck
   npm test -- --run
   ```

2. **Execute Task**
   - Follow "Action Steps" exactly
   - Copy code examples as starting point
   - Adapt to project specifics

3. **Validate Task**
   ```bash
   # Run validation command from task
   npm test -- src/tests/hooks/useGame.test.tsx --run

   # Check success criteria
   # [ ] Criterion 1 ✓
   # [ ] Criterion 2 ✓
   ```

4. **Commit Task**
   ```bash
   git add [files-changed]
   git commit -m "type(MY.X): brief description

   - Implemented: [what was done]
   - Validation: [validation results]
   - Task duration: [actual time]

   Closes: MY.X"
   ```

5. **Update Progress**
   ```bash
   # Update task tracking
   echo "MY.X: completed" >> docs/task-breakdown/progress.txt

   # Calculate velocity
   # Tasks today: 4
   # Hours today: 8
   # Velocity: 0.5 tasks/hour
   ```

6. **Merge or Continue**
   ```bash
   # Option A: Merge small task immediately
   git checkout main
   git merge task-MY-X
   git push

   # Option B: Stack multiple tasks
   git checkout -b task-MY-X+1
   # Continue with next task
   ```

---

## Progress Tracking

### Daily Report Template

```markdown
## GOAP Progress Report - 2025-12-04

**Phase:** 1
**Week:** 1, Day 2

### Completed Today
- [x] M1.3: Create TouchListMock (1.5h actual vs 1.5h est)
- [x] M1.4: Apply TouchList Helper (0.75h actual vs 1h est)
- [x] M3.1: Hook Testing Infrastructure (1.5h actual vs 1.5h est)

### In Progress
- [ ] M3.2: useGame Hook Tests (1.5h of 2h complete)

### Blocked
- None

### Metrics
- Tasks completed today: 3
- Cumulative tasks: 12/490 (2.4%)
- Velocity: 0.375 tasks/hour
- Phase 1 progress: 12/85 (14%)
- Estimated Phase 1 completion: 7 days remaining

### Tomorrow's Plan
- [ ] M3.2: Complete useGame tests (0.5h)
- [ ] M3.3: usePuzzle Hook Tests (2h)
- [ ] M3.4: useAudio Hook Tests (1.5h)
- [ ] M1.5: Verify Type Safety (1h)

### Notes
- TouchListMock took exact estimated time
- M1.4 completed faster due to better test coverage
- No blockers encountered
```

### Weekly Summary Template

```markdown
## GOAP Weekly Summary - Week 1

**Dates:** 2025-12-01 to 2025-12-07
**Phase:** 1

### Accomplishments
- ✓ M1: TypeScript Stability (100% - 12/12 tasks)
- ✓ M3: Hook Tests (50% - 15/30 tasks)
- ○ M2: Auth Tests (20% - 5/25 tasks)

### Metrics
- Tasks completed: 32/490 (6.5%)
- Hours logged: 38h
- Average velocity: 0.84 tasks/hour
- Phase 1: 37% complete (32/85 tasks)

### Highlights
- Zero TypeScript errors achieved
- TouchListMock enables mobile testing
- Hook test infrastructure reusable

### Challenges
- Auth service mocking more complex than estimated
- Required extra 2h for Supabase client mock

### Next Week
- Complete M2: Auth Tests (20/25 remaining)
- Complete M3: Hook Tests (15/30 remaining)
- Start M4: React Warnings (18 tasks)
- Target: Phase 1 completion
```

---

## AgentDB Integration

### Task State Storage

```typescript
// src/scripts/goap-tracker.ts
import agentdb from 'agentdb';

interface TaskState {
  id: string;
  status: 'pending' | 'in_progress' | 'completed' | 'blocked';
  assignee?: string;
  startTime?: number;
  endTime?: number;
  actualEffort?: number;
  estimatedEffort: number;
  blockers?: string[];
}

// Store task state
async function updateTaskState(taskId: string, state: Partial<TaskState>) {
  const current = await agentdb.get(`goap/tasks/${taskId}`) || {};
  await agentdb.put(`goap/tasks/${taskId}`, {
    ...current,
    ...state,
    lastUpdated: Date.now()
  });
}

// Start task
await updateTaskState('M1.4', {
  status: 'in_progress',
  assignee: 'developer-1',
  startTime: Date.now()
});

// Complete task
await updateTaskState('M1.4', {
  status: 'completed',
  endTime: Date.now(),
  actualEffort: 0.75 // hours
});

// Query progress
const phase1Tasks = await agentdb.query({
  prefix: 'goap/tasks/M',
  filter: (task: TaskState) => task.status === 'completed'
});
console.log(`Phase 1: ${phase1Tasks.length}/85 complete`);
```

### Dependency Checking

```typescript
async function canStartTask(taskId: string): Promise<boolean> {
  const deps = await agentdb.get(`goap/dependencies/${taskId}`) || [];

  for (const depId of deps) {
    const depState = await agentdb.get(`goap/tasks/${depId}`);
    if (depState?.status !== 'completed') {
      return false;
    }
  }

  return true;
}

// Check before starting
if (await canStartTask('M2.5')) {
  console.log('Ready to start M2.5: Login Tests');
} else {
  console.log('Blocked: dependencies not complete');
}
```

### Velocity Tracking

```typescript
async function calculateVelocity(days: number = 7): Promise<number> {
  const cutoff = Date.now() - (days * 24 * 60 * 60 * 1000);

  const recentTasks = await agentdb.query({
    prefix: 'goap/tasks/',
    filter: (task: TaskState) =>
      task.status === 'completed' &&
      (task.endTime || 0) > cutoff
  });

  const totalHours = recentTasks.reduce(
    (sum, task) => sum + (task.actualEffort || 0),
    0
  );

  return recentTasks.length / totalHours; // tasks per hour
}

// Estimate remaining time
const velocity = await calculateVelocity(7);
const remaining = 490 - completedCount;
const estimatedHours = remaining / velocity;
console.log(`Estimated completion: ${estimatedHours / 40} weeks`);
```

---

## Rollback Procedures

### Task-Level Rollback

```bash
# If task validation fails
git diff > /tmp/MY.X-attempt.patch
git checkout .
npm test -- --run  # Verify clean state

# Review what went wrong
cat /tmp/MY.X-attempt.patch

# Retry task
# ... reattempt with fixes ...
```

### Milestone-Level Rollback

```bash
# If milestone integration fails
git log --oneline --grep "M1"  # Find all M1 commits
git revert --no-commit HEAD~12..HEAD  # Revert last 12 commits
git commit -m "revert(M1): rollback TypeScript milestone"
npm test -- --run  # Validate clean state

# Re-plan milestone
# ... review what went wrong ...
# ... adjust task estimates ...
```

### Phase-Level Rollback

```bash
# If entire phase needs restart
git tag phase1-checkpoint  # Mark current state
git reset --hard phase0-complete  # Go back to phase start

# Or use feature flag approach
# Keep phase 1 code but disable
git checkout main
git merge --no-ff --no-commit phase1-branch
# Disable in feature flags
# Deploy with phase 1 inactive
```

---

## Quality Assurance

### Before Marking Task Complete

```bash
# 1. All validation commands pass
npm run typecheck ✓
npm test -- specific-test --run ✓
npm run lint ✓

# 2. Success criteria met
cat docs/task-breakdown/phase-X/MY-task.md
# Review checklist: all [x] checked

# 3. No regressions
npm test -- --run  # Full suite passes
npm run build  # Build succeeds

# 4. Documentation updated
git diff docs/  # Any docs changed?
# Code comments added?

# 5. Clean commit
git status  # No untracked files
git diff --staged  # Only relevant changes
```

### Milestone Quality Gates

Before marking milestone complete:

```bash
# M1 Example
npm run typecheck  # 0 errors ✓
npm test -- --run --coverage  # No regressions ✓
git log --oneline --grep "M1"  # All 12 tasks committed ✓

# Generate milestone report
npm run goap:milestone-report M1
```

---

## Next Steps

1. **Choose execution pattern** (solo/team/swarm)
2. **Set up tracking** (daily reports, AgentDB)
3. **Start Phase 1, M1.1** (2025-12-04 or later)
4. **Daily standup** to track progress
5. **Weekly retrospective** to adjust velocity

**First Task:** `docs/task-breakdown/phase-1/M1-typescript-tasks.md` → M1.1

Good luck with the GOAP plan execution!
