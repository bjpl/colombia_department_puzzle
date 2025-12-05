# GOAP Quick Reference Card

**For:** Rapid task lookup and execution
**Use:** Keep open while working on tasks

---

## Phase 1 Tasks (35h, 85 tasks)

### M1: TypeScript (6h, 12 tasks)
```
M1.1  Remove isCI variable              0.5h  Low    coder
M1.2  Fix RAF type cast                 1h    Low    coder
M1.3  Create TouchListMock              1.5h  Med    coder
M1.4  Apply TouchList helper            1h    Low    coder
M1.5  Verify type safety                1h    Low    tester
M1.6  Add type guards                   0.5h  Low    coder
M1.7  Document API                      0.5h  Low    api-docs
M1.8  Unit tests                        1h    Low    tester
M1.9  Full validation                   0.5h  Low    reviewer
M1.10 Update CI/CD                      0.5h  Low    cicd
M1.11 Performance benchmark             0.5h  Low    perf
M1.12 Integration test                  0.5h  Low    tester
```

**Critical Path:** M1.1 → M1.2 → M1.3 → M1.4 → M1.12 (4.5h)

### M2: Auth Tests (10h, 25 tasks)
```
M2.1  Auth utils structure              2h    Low    coder
M2.2  Supabase mock                     2h    Med    coder
M2.3  Session management                1h    Low    coder
M2.4  Auth context wrapper              1.5h  Med    coder
M2.5  Login tests                       1h    Low    tester
M2.6  Signup tests                      1h    Low    tester
M2.7  Logout tests                      0.5h  Low    tester
M2.8  Session persistence               1h    Med    tester
M2.9  Hook tests                        1.5h  Med    tester
M2.10 Auth guard tests                  1h    Med    tester
... [15 more tasks - see M2-auth-tasks.md]
```

**Critical Path:** M2.1 → M2.2 → M2.4 → M2.25 (8h)

### M3: Hook Tests (12h, 30 tasks)
```
M3.1  Hook test infrastructure          1.5h  Low    coder
M3.2  useGame hook tests                2h    Med    tester
M3.3  usePuzzle hook tests              2h    Med    tester
M3.4  useAudio hook tests               1.5h  Low    tester
M3.5  useLocalStorage tests             1.5h  Low    tester
... [25 more tasks - see M3-hooks-tasks.md]
```

**Critical Path:** M3.1 → M3.2 → M3.30 (7.5h)

### M4: React Warnings (7h, 18 tasks)
```
M4.1  Warning audit                     1h    Low    reviewer
M4.2  Fix key props                     1.5h  Low    coder
M4.3  Fix useEffect deps                1.5h  Med    coder
M4.4  Fix unmounted updates             1h    Med    coder
... [14 more tasks - see M4-warnings-tasks.md]
```

**Critical Path:** M4.1 → M4.2 → M4.3 → M4.18 (5.5h)

---

## Phase 2 Tasks (73h, 190 tasks)

### M5: Mobile Tests (14h, 35 tasks)
```
M5.1  Touch simulator                   2h    Med    mobile-dev
M5.2  Touch target sizes                1h    Low    tester
M5.3  Drag-and-drop touch               2h    High   mobile-dev
M5.4  Viewport responsiveness           1.5h  Low    tester
... [31 more tasks - see M5-mobile-tasks.md]
```

### M6-M8: See phase-2/ directory (condensed summaries)

---

## Phase 3 Tasks (42h, 215 tasks)

### M9-M12: See phase-3/ directory (condensed summaries)

---

## Common Commands

### Validation
```bash
# TypeScript
npm run typecheck

# Tests
npm test -- --run
npm test -- src/tests/specific.test.tsx --run

# Coverage
npm run test:coverage

# Lint
npm run lint

# Build
npm run build
```

### Git Workflow
```bash
# Start task
git checkout -b task-M1.1

# Commit task
git add [files]
git commit -m "type(M1.1): description"

# Merge task
git checkout main
git merge task-M1.1
git push
```

### Progress Tracking
```bash
# Count completed tasks
git log --oneline --grep "^feat\\|^fix\\|^test" | wc -l

# View recent tasks
git log --oneline --grep "M1\\." | head -10

# Check velocity
# tasks_today / hours_today = tasks/hour
```

---

## Quick Rollback

### Single Task
```bash
git diff > /tmp/task-backup.patch
git checkout .
npm test -- --run  # Verify clean
```

### Milestone
```bash
git log --oneline --grep "M1"  # Find commits
git revert --no-commit HEAD~12..HEAD
npm test -- --run
```

### Phase
```bash
git tag phase-checkpoint
git reset --hard phase-start
```

---

## Task Checklist Template

When executing any task:

**Pre-Execution:**
- [ ] Read task file completely
- [ ] Check dependencies completed
- [ ] Create feature branch
- [ ] Run baseline validation

**Execution:**
- [ ] Follow action steps exactly
- [ ] Adapt code to project specifics
- [ ] Test incrementally

**Validation:**
- [ ] Run validation command (passes)
- [ ] Check all success criteria
- [ ] No test regressions
- [ ] Build succeeds

**Commit:**
- [ ] Stage only relevant files
- [ ] Write clear commit message
- [ ] Update progress tracking
- [ ] Merge or continue to next task

---

## Daily Workflow

### Morning (Start of day)
```bash
# 1. Review yesterday's progress
git log --oneline --since="yesterday"

# 2. Check current state
npm run typecheck
npm test -- --run

# 3. Plan today's tasks
cat docs/task-breakdown/phase-X/MY-tasks.md
# Select 3-5 tasks for today

# 4. Update tracking
echo "$(date): Starting M1.3, M1.4, M3.1" >> progress.txt
```

### During Work (Per task)
```bash
# Start task
git checkout -b task-M1.3

# Execute
# ... follow task steps ...

# Validate
npm test -- src/tests/setup.test.ts --run

# Commit
git add src/tests/setup.ts
git commit -m "feat(M1.3): create TouchListMock class"
```

### Evening (End of day)
```bash
# 1. Merge completed tasks
git checkout main
git merge task-M1.3
git merge task-M1.4

# 2. Calculate velocity
# tasks_today / hours_today

# 3. Update daily report
cat >> daily-report.md <<EOF
## $(date +%Y-%m-%d)
Completed: M1.3, M1.4 (3h actual vs 2.5h est)
Velocity: 0.67 tasks/hour
Tomorrow: M1.5, M1.6, M3.2
EOF
```

---

## Troubleshooting

### Task Takes Longer Than Estimated
**Action:**
1. Document actual time
2. Continue working
3. Update velocity calculations
4. Adjust future estimates

### Dependencies Not Clear
**Action:**
1. Check dependency graph (mermaid file)
2. Run: `git log --oneline --grep "dependency-id"`
3. If still unclear, ask GOAP agent

### Validation Fails
**Action:**
1. Rollback: `git checkout .`
2. Review task requirements
3. Check for environment differences
4. Retry with more careful execution

### Blocked on External Factor
**Action:**
1. Mark task as blocked
2. Document blocker in daily report
3. Switch to independent task
4. Escalate if blocker persists >1 day

---

## Contact & Support

**GOAP Agent:** Request task expansion or clarification
**Project Docs:** See `docs/task-breakdown/`
**Execution Guide:** See `EXECUTION_GUIDE.md`
**Index:** See `TASK_INDEX.md`

---

**Quick Lookup:**
- Total tasks: 490
- Total effort: 150h
- First task: M1.1 (0.5h, Remove isCI variable)
- Next milestone after M1: M2 (Auth Tests)
- Next phase after Phase 1: Phase 2 (Mobile & Architecture)

**Status:** Ready to execute
**Last Updated:** 2025-12-04
