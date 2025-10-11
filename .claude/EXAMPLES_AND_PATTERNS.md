# Code Examples & Patterns

Real-world examples demonstrating correct and incorrect usage patterns.

**See also:**
- [MANDATORY_DIRECTIVES.md](./MANDATORY_DIRECTIVES.md) - Operating principles these examples follow
- [PROJECT_IMPLEMENTATION.md](./PROJECT_IMPLEMENTATION.md) - Project-specific patterns
- [AGENT_REFERENCE.md](./AGENT_REFERENCE.md) - Available agents and tools

---

## ✅ CORRECT: Parallel Agent Execution with Batched Operations

**Implements:** MANDATORY-6 (Swarm Orchestration), MANDATORY-18 (Resource Optimization)

### Example 1: Full-Stack Feature Development

```javascript
[Single Message - All Operations]:
  // Spawn all agents in parallel
  Task("Backend Developer", "Build REST API with Express. Use hooks for coordination.", "backend-dev")
  Task("Frontend Developer", "Create React UI. Coordinate with backend via memory.", "coder")
  Task("Database Architect", "Design PostgreSQL schema. Store schema in memory.", "code-analyzer")
  Task("Test Engineer", "Write Jest tests. Check memory for API contracts.", "tester")
  Task("DevOps Engineer", "Setup Docker and CI/CD. Document in memory.", "cicd-engineer")
  Task("Security Auditor", "Review authentication. Report findings via hooks.", "reviewer")

  // Batch ALL todos in ONE call (8-10 todos recommended)
  TodoWrite { todos: [
    {id: "1", content: "Research API patterns", status: "in_progress", priority: "high"},
    {id: "2", content: "Design database schema", status: "in_progress", priority: "high"},
    {id: "3", content: "Implement authentication", status: "pending", priority: "high"},
    {id: "4", content: "Build REST endpoints", status: "pending", priority: "high"},
    {id: "5", content: "Write unit tests", status: "pending", priority: "medium"},
    {id: "6", content: "Integration tests", status: "pending", priority: "medium"},
    {id: "7", content: "API documentation", status: "pending", priority: "low"},
    {id: "8", content: "Performance optimization", status: "pending", priority: "low"}
  ]}

  // Batch all file operations together
  Bash "mkdir -p app/{src,tests,docs,config}"
  Write "app/package.json"
  Write "app/src/server.js"
  Write "app/tests/server.test.js"
  Write "app/docs/API.md"
```

**Why this works:**
- All related operations in one message (2.8-4.4x faster)
- Agents coordinate via shared memory
- No sequential dependencies causing bottlenecks
- Todos track all work comprehensively

---

### Example 2: Mobile Support Implementation

```javascript
[Single Message - Coordinated Mobile Development]:
  // Step 1: Optional MCP coordination setup
  mcp__claude-flow__swarm_init { topology: "mesh", maxAgents: 5 }

  // Step 2: Parallel agent execution via Task tool
  Task("Touch Interaction Specialist", "Build tap-to-place system with gesture detection.", "coder")
  Task("Layout Architect", "Create responsive bottom sheet architecture.", "coder")
  Task("PWA Specialist", "Implement progressive web app with smart caching.", "coder")
  Task("Component Optimizer", "Build mobile-optimized UI with 44px touch targets.", "coder")
  Task("QA Engineer", "Create mobile test suite and onboarding tutorial.", "tester")

  // Batch comprehensive todos
  TodoWrite { todos: [
    {content: "Build touch gesture detection", status: "in_progress"},
    {content: "Create bottom sheet layout", status: "in_progress"},
    {content: "Setup PWA infrastructure", status: "in_progress"},
    {content: "Optimize mobile components", status: "in_progress"},
    {content: "Implement mobile testing", status: "in_progress"},
    {content: "Integrate all features", status: "pending"},
    {content: "Run performance audit", status: "pending"},
    {content: "Commit v1.0", status: "pending"}
  ]}
```

**Result:** 4-hour implementation (vs 15-20 hours sequential)

---

## ❌ WRONG: Sequential Operations and Small Batches

**Violates:** MANDATORY-6, MANDATORY-18

### Anti-Pattern 1: Sequential Agent Spawning

```javascript
// DON'T DO THIS - causes massive slowdown
Message 1: mcp__claude-flow__swarm_init
Message 2: Task("agent 1", "...", "coder")
Message 3: Task("agent 2", "...", "tester")  // Waiting for agent 1
Message 4: TodoWrite { todos: [single todo] }
Message 5: Write "file.js"
```

**Problems:**
- Each message waits for previous to complete
- No parallel execution benefit
- 2.8-4.4x slower than parallel approach
- Breaks coordination between agents

---

### Anti-Pattern 2: Tiny Todo Batches

```javascript
// DON'T DO THIS - inefficient tracking
Message 1: TodoWrite { todos: [{content: "Do thing 1"}] }
Message 2: TodoWrite { todos: [{content: "Do thing 2"}] }
Message 3: TodoWrite { todos: [{content: "Do thing 3"}] }
```

**Problems:**
- Violates "5-10+ todos minimum" guideline
- Poor task visibility
- Inefficient todo management
- Makes progress tracking harder

---

## ✅ CORRECT: SPARC Workflow with Proper Batching

**Implements:** MANDATORY-11 (Incremental Delivery)

```javascript
[Single Message - SPARC TDD Workflow]:
  // Spawn SPARC-specific agents
  Task("Specification Agent", "Analyze requirements for user authentication.", "specification")
  Task("Architecture Agent", "Design auth system architecture.", "architecture")
  Task("TDD Coder", "Implement auth with TDD approach.", "sparc-coder")
  Task("Refinement Agent", "Iterate on implementation quality.", "refinement")

  // Comprehensive todo tracking
  TodoWrite { todos: [
    {content: "Specification: Analyze auth requirements", status: "in_progress"},
    {content: "Specification: Define acceptance criteria", status: "pending"},
    {content: "Architecture: Design auth flow", status: "pending"},
    {content: "Architecture: Select security patterns", status: "pending"},
    {content: "TDD: Write auth tests", status: "pending"},
    {content: "TDD: Implement auth logic", status: "pending"},
    {content: "Refinement: Code review", status: "pending"},
    {content: "Refinement: Performance optimization", status: "pending"},
    {content: "Integration: Merge to main", status: "pending"}
  ]}

  // Parallel file reads for context
  Read "src/services/auth.ts"
  Read "tests/auth.test.ts"
  Read "docs/security-requirements.md"
```

---

## ✅ CORRECT: Git Operations with Batching

**Implements:** MANDATORY-3 (Version Control)

```javascript
[Single Message - Complete Git Workflow]:
  // Batch related git operations
  Bash "git add -A && git commit -m 'feat: Add mobile support v1.0

Complete mobile implementation:
- Touch gesture system
- Bottom sheet layout
- PWA infrastructure
- Mobile-optimized components
- Comprehensive testing

Implements MANDATORY-8, 11, 19

🤖 Generated with Claude Code' && git push origin main"

  // Update todos after successful commit
  TodoWrite { todos: [
    {content: "Implement mobile support", status: "completed"},
    {content: "Create daily report", status: "in_progress"},
    {content: "Deploy to production", status: "pending"}
  ]}
```

**Why this works:**
- Batches add + commit + push in single command
- Meaningful commit message (MANDATORY-3)
- Includes implementation details
- References MANDATORY directives
- Updates todos immediately after

---

## ✅ CORRECT: File Operations with Parallelism

**Implements:** MANDATORY-12 (Documentation Standards)

```javascript
[Single Message - Parallel File Operations]:
  // Read multiple files in parallel for analysis
  Read "src/components/GameContainer.tsx"
  Read "src/components/DepartmentTray.tsx"
  Read "src/components/MapCanvas.tsx"
  Read "tests/GameContainer.test.tsx"

  // Write multiple files in parallel
  Write "src/components/MobileGameLayout.tsx"
  Write "src/components/BottomSheet.tsx"
  Write "src/styles/mobile.css"
  Write "tests/MobileGameLayout.test.tsx"

  // Edit multiple files in parallel
  Edit "src/App.tsx" (add mobile imports)
  Edit "src/components/GameContainer.tsx" (integrate mobile layout)
  Edit "package.json" (add mobile dependencies)
```

**Why this works:**
- All reads happen simultaneously
- All writes happen simultaneously
- No artificial sequencing
- Maximum efficiency

---

## 📊 Performance Comparison

### Scenario: Implement 5-component feature with tests

**❌ Sequential Approach:**
```
Message 1: Task("component 1")  → 2 min
Message 2: Task("component 2")  → 2 min
Message 3: Task("component 3")  → 2 min
Message 4: Task("component 4")  → 2 min
Message 5: Task("component 5")  → 2 min
Message 6: Task("tests")        → 3 min
Total: 13 minutes
```

**✅ Parallel Approach:**
```
[Single Message]:
  Task("component 1", "...", "coder")
  Task("component 2", "...", "coder")
  Task("component 3", "...", "coder")
  Task("component 4", "...", "coder")
  Task("component 5", "...", "coder")
  Task("tests", "...", "tester")
Total: 3 minutes (all parallel)
```

**Speedup:** 4.3x faster

---

## 🎯 Real-World Success: Mobile Support v1.0

**Implementation:**
- 5 agents spawned in parallel
- 88 mobile-specific files created
- 86 files changed (+16,645 lines)
- 842/914 tests passing

**Time:** 4 hours (parallel) vs estimated 15-20 hours (sequential)
**Speedup:** 3.75-5x faster

**Pattern used:**
```javascript
[Single Message]:
  Task("Agent 1: Touch System", "...", "coder")
  Task("Agent 2: Responsive Layout", "...", "coder")
  Task("Agent 3: PWA", "...", "coder")
  Task("Agent 4: Components", "...", "coder")
  Task("Agent 5: Testing", "...", "tester")

  TodoWrite { todos: [8 comprehensive todos] }
```

---

## 💡 Key Takeaways

1. **Always batch related operations** in a single message
2. **Spawn all agents in parallel** using Task tool
3. **Create 5-10+ todos minimum** in one TodoWrite call
4. **Use MCP only for coordination**, not execution
5. **Batch all file operations** together when possible
6. **Follow MANDATORY directives** in all examples

**Remember:** The golden rule is "1 MESSAGE = ALL RELATED OPERATIONS"

For more details on specific patterns, see [PROJECT_IMPLEMENTATION.md](./PROJECT_IMPLEMENTATION.md)
