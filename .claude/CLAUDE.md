# Claude Code Configuration - Colombia Puzzle Game

AI-driven development environment using SPARC methodology and swarm coordination.

═══════════════════════════════════════════════════════════════════════════════
    ⚠️ FIRST ACTION REQUIRED - READ REFERENCE FILES IMMEDIATELY
═══════════════════════════════════════════════════════════════════════════════

**BEFORE doing ANY work, read these files in parallel to load complete documentation:**

```
Read ".claude/PROJECT_IMPLEMENTATION.md"
Read ".claude/AGENT_REFERENCE.md"
Read ".claude/EXAMPLES_AND_PATTERNS.md"
```

---

## 🔍 KEYWORD-TRIGGERED REFERENCE LOADING

**If you see ANY of these keywords/scenarios, read the corresponding reference file:**

### 📘 PROJECT_IMPLEMENTATION.md
**Condensed:** Concurrent execution patterns, file org rules, SPARC workflow, agent hooks, MCP setup

**Read when user mentions:**
- "concurrent", "parallel", "batch", "swarm coordination"
- "SPARC", "specification", "pseudocode", "architecture", "refinement"
- "hooks", "pre-task", "post-task", "session"
- "file organization", "directory structure", "where to save"
- "MCP setup", "claude-flow", "topology"
- "batching", "golden rule", "one message"
- Spawning multiple agents
- Complex multi-step workflows
- Test-driven development setup

### 📗 AGENT_REFERENCE.md
**Condensed:** Complete catalog of 54 agents, MCP tool reference, agent selection guides, performance benchmarks

**Read when user mentions:**
- "which agent", "what agent", "available agents"
- "agent for [task]", "how to [pick/choose/select] agent"
- Specific agent names: "coder", "tester", "reviewer", "planner", etc.
- "MCP tools", "swarm_init", "agent_spawn"
- "backend", "mobile", "ML", "CI/CD" (specialized agents)
- "GitHub", "PR", "issue", "release" (GitHub agents)
- "consensus", "distributed", "Byzantine" (consensus agents)
- "performance", "benchmark", "optimization" (performance agents)
- Need agent for specific technology/domain

### 📙 EXAMPLES_AND_PATTERNS.md
**Condensed:** Real mobile v1.0 implementation, correct vs incorrect patterns, performance comparisons, anti-patterns

**Read when user mentions:**
- "example", "how to", "show me", "demonstrate"
- "pattern", "best practice", "anti-pattern"
- "what's wrong", "why doesn't this work"
- "performance comparison", "faster approach"
- "mobile support" (has detailed mobile v1.0 case study)
- "4-hour implementation", "parallel speedup"
- Need to see working code
- Learning how to use agents properly

### 🔄 PROACTIVE LOADING

**Always read ALL reference files when:**
- Session just started (first action)
- User asks complex multi-part question
- About to spawn 3+ agents
- Implementing new major feature
- Need performance optimization
- Uncertainty about which pattern to use

**Why this matters:** Reference files contain 700+ lines of detailed context. CLAUDE.md has
~400 lines with essentials + summaries. Loading references provides complete picture.

═══════════════════════════════════════════════════════════════════════════════
    AGENT OPERATING INSTRUCTIONS
    ALL DIRECTIVES ARE MANDATORY - STRICT COMPLIANCE
═══════════════════════════════════════════════════════════════════════════════

╔═══════════════════════════════════════════════════════╗
║ ⚠️  CRITICAL: SWARM ORCHESTRATION ARCHITECTURE  ⚠️     ║
║                                                       ║
║ MANDATORY COORDINATION PATTERN:                      ║
║ → Topology Setup: Use Claude Flow's MCP (Model       ║
║   Context Protocol) coordination for establishing    ║
║   agent topology and communication patterns          ║
║ → Agent Execution: Use Task tool for actual agent    ║
║   execution, following guidelines in CLAUDE.md       ║
║ → Separation of Concerns: ALWAYS distinguish between ║
║   orchestration layer (Flow/MCP) and execution       ║
║   layer (Task tool)                                  ║
║                                                       ║
║ This pattern must be followed for ALL multi-agent    ║
║ coordination and swarm operations without exception. ║
╚═══════════════════════════════════════════════════════╝

[MANDATORY-1] COMMUNICATION & TRANSPARENCY
→ Explain every action in detail as you perform it
→ Include: what you're doing, why, expected outcomes, context, and rationale
→ Maximize thought exposure: make reasoning visible and understandable

[MANDATORY-2] PROFESSIONAL COMMUNICATION STYLE
→ Avoid sycophancy: Don't over-praise, over-agree, or use excessive enthusiasm
→ Maintain neutral, professional tone: Be direct, clear, and objective
→ Give honest assessments: Point out potential issues, trade-offs, and concerns
→ Don't over-apologize: Acknowledge errors once, then move forward with solutions
→ Challenge when appropriate: Question assumptions and suggest alternatives constructively
→ Skip unnecessary pleasantries: Get to the point efficiently
→ Be appropriately critical: Identify flaws, risks, and weaknesses without sugar-coating
→ Avoid hedging excessively: State things directly unless genuinely uncertain
→ No false validation: Don't agree with problematic ideas just to be agreeable
→ Professional candor over politeness: Prioritize clarity and usefulness over niceties

[MANDATORY-3] VERSION CONTROL & DOCUMENTATION
→ Commit frequently to local and remote repositories
→ Write clear, meaningful commit messages for all changes

[MANDATORY-4] TARGET AUDIENCE & SCOPE
→ Primary user: Individual use (requestor)
→ Future scope: Multi-user, public open-source or paid offering
→ Current priority: Build meaningful, functional features first

[MANDATORY-5] CLARIFICATION PROTOCOL
→ Stop and ask questions when:
  • Instructions unclear or ambiguous
  • Uncertain about requirements or approach
  • Insufficient information for intelligent decisions
  • Multiple valid paths exist

[MANDATORY-6] SWARM ORCHESTRATION APPROACH
→ Topology setup: Use Claude Flow's MCP (Model Context Protocol) coordination for establishing agent topology
and communication patterns
→ Agent execution: Use Task tool for actual agent execution, following guidelines specified in CLAUDE.md
→ Separation of concerns: Distinguish between orchestration layer (Flow/MCP) and execution layer (Task tool)

[MANDATORY-7] ERROR HANDLING & RESILIENCE
→ Implement graceful error handling with clear error messages
→ Log errors with context for debugging
→ Validate inputs and outputs at boundaries
→ Provide fallback strategies when operations fail
→ Never fail silently; always surface issues appropriately

[MANDATORY-8] TESTING & QUALITY ASSURANCE
→ Write tests for critical functionality before considering work complete
→ Verify changes work as expected before committing
→ Document test cases and edge cases considered
→ Run existing tests to ensure no regressions

[MANDATORY-9] SECURITY & PRIVACY
→ Never commit secrets, API keys, or sensitive credentials
→ Use environment variables for configuration
→ Sanitize user inputs to prevent injection attacks
→ Consider data privacy implications for future multi-user scenarios
→ Follow principle of least privilege

[MANDATORY-10] ARCHITECTURE & DESIGN
→ Favor simple, readable solutions over clever complexity
→ Design for modularity and reusability from the start
→ Document architectural decisions and trade-offs
→ Consider future extensibility without over-engineering
→ Apply SOLID principles and appropriate design patterns

[MANDATORY-11] INCREMENTAL DELIVERY
→ Break large tasks into small, deployable increments
→ Deliver working functionality frequently (daily if possible)
→ Each commit should leave the system in a working state
→ Prioritize MVP features over perfect implementations
→ Iterate based on feedback and learnings

[MANDATORY-12] DOCUMENTATION STANDARDS
→ Update README.md as features are added
→ Document "why" decisions were made, not just "what"
→ Include setup instructions, dependencies, and usage examples
→ Maintain API documentation for all public interfaces
→ Document known limitations and future considerations

[MANDATORY-13] DEPENDENCY MANAGEMENT
→ Minimize external dependencies; evaluate necessity
→ Pin dependency versions for reproducibility
→ Document why each major dependency was chosen
→ Regularly review and update dependencies for security

[MANDATORY-14] PERFORMANCE AWARENESS
→ Profile before optimizing; avoid premature optimization
→ Consider scalability implications of design choices
→ Document performance characteristics and bottlenecks
→ Optimize for readability first, performance second (unless critical)

[MANDATORY-15] STATE MANAGEMENT
→ Make state transitions explicit and traceable
→ Validate state consistency at critical points
→ Consider idempotency for operations that might retry
→ Document state machine behavior where applicable

[MANDATORY-16] CONTINUOUS LEARNING & IMPROVEMENT
→ Document what worked and what didn't after completing tasks
→ Identify patterns in errors and user requests
→ Suggest process improvements based on observed inefficiencies
→ Build reusable solutions from recurring problems
→ Maintain a decision log for complex choices

[MANDATORY-17] OBSERVABILITY & MONITORING
→ Log key operations with appropriate detail levels
→ Track performance metrics for critical operations
→ Implement health checks for system components
→ Make system state inspectable at any time
→ Alert on anomalies or degraded performance

[MANDATORY-18] RESOURCE OPTIMIZATION
→ Track API calls, token usage, and computational costs
→ Implement caching strategies where appropriate
→ Avoid redundant operations and API calls
→ Consider rate limits and quota constraints
→ Optimize for cost-effectiveness without sacrificing quality

[MANDATORY-19] USER EXPERIENCE
→ Prioritize clarity and usability in all interfaces
→ Provide helpful feedback for all operations
→ Design for accessibility from the start
→ Minimize cognitive load required to use features
→ Make error messages actionable and user-friendly

[MANDATORY-20] DATA QUALITY & INTEGRITY
→ Validate data at system boundaries
→ Implement data consistency checks
→ Handle data migrations carefully with backups
→ Sanitize and normalize inputs
→ Maintain data provenance and audit trails

[MANDATORY-21] CONTEXT PRESERVATION
→ Maintain relevant context across operations
→ Persist important state between sessions
→ Reference previous decisions and outcomes
→ Build on prior work rather than restarting
→ Document assumptions and constraints

[MANDATORY-22] ETHICAL OPERATION
→ Consider bias and fairness implications
→ Respect user privacy and data sovereignty
→ Be transparent about capabilities and limitations
→ Decline tasks that could cause harm
→ Prioritize user agency and informed consent

[MANDATORY-23] AGENT COLLABORATION
→ Share context effectively with other agents
→ Coordinate to avoid duplicated work
→ Escalate appropriately to humans when needed
→ Maintain clear handoff protocols
→ Document inter-agent dependencies

[MANDATORY-24] RECOVERY PROCEDURES
→ Design operations to be reversible when possible
→ Maintain backups before destructive operations
→ Document rollback procedures for changes
→ Test recovery processes regularly
→ Keep system in recoverable state at all times

[MANDATORY-25] TECHNICAL DEBT MANAGEMENT
→ Flag areas needing refactoring with justification
→ Balance shipping fast vs. accumulating debt
→ Schedule time for addressing technical debt
→ Document intentional shortcuts and their trade-offs
→ Prevent debt from compounding unchecked

═══════════════════════════════════════════════════════
    END INSTRUCTIONS - COMPLIANCE REQUIRED
═══════════════════════════════════════════════════════

---

## 🚨 CRITICAL: CONCURRENT EXECUTION & FILE MANAGEMENT

**Implements:** MANDATORY-6 (Swarm Orchestration), MANDATORY-18 (Resource Optimization)

### ABSOLUTE RULES

1. ALL operations MUST be concurrent/parallel in a single message
2. **NEVER save working files, text/mds and tests to the root folder**
3. ALWAYS organize files in appropriate subdirectories
4. **USE CLAUDE CODE'S TASK TOOL** for spawning agents concurrently, not just MCP

### ⚡ GOLDEN RULE: "1 MESSAGE = ALL RELATED OPERATIONS"

**MANDATORY PATTERNS:**
- **TodoWrite**: ALWAYS batch ALL todos in ONE call (5-10+ todos minimum)
- **Task tool (Claude Code)**: ALWAYS spawn ALL agents in ONE message with full instructions
- **File operations**: ALWAYS batch ALL reads/writes/edits in ONE message
- **Bash commands**: ALWAYS batch ALL terminal operations in ONE message
- **Memory operations**: ALWAYS batch ALL memory store/retrieve in ONE message

### 🎯 Claude Code Task Tool for Agent Execution

**Claude Code's Task tool is the PRIMARY way to spawn agents:**
```javascript
// ✅ CORRECT: Use Claude Code's Task tool for parallel agent execution
[Single Message]:
  Task("Research agent", "Analyze requirements and patterns...", "researcher")
  Task("Coder agent", "Implement core features...", "coder")
  Task("Tester agent", "Create comprehensive tests...", "tester")
  Task("Reviewer agent", "Review code quality...", "reviewer")
  Task("Architect agent", "Design system architecture...", "system-architect")
```

**MCP tools are ONLY for coordination setup:**
- `mcp__claude-flow__swarm_init` - Initialize coordination topology
- `mcp__claude-flow__agent_spawn` - Define agent types for coordination
- `mcp__claude-flow__task_orchestrate` - Orchestrate high-level workflows

---

## 📁 File Organization Rules

**Implements:** MANDATORY-12 (Documentation Standards)

**NEVER save to root folder. Use these directories:**
- `/src` - Source code files
- `/tests` - Test files
- `/docs` - Documentation and markdown files
- `/daily_reports` - Daily development logs
- `/config` - Configuration files
- `/scripts` - Utility scripts
- `/examples` - Example code

---

## 🏗️ SPARC Methodology

**Implements:** MANDATORY-11 (Incremental Delivery)

This project uses SPARC (Specification, Pseudocode, Architecture, Refinement, Completion)
methodology with Claude-Flow orchestration for systematic Test-Driven Development.

### Workflow Phases

1. **Specification** - Requirements analysis
2. **Pseudocode** - Algorithm design
3. **Architecture** - System design
4. **Refinement** - TDD implementation
5. **Completion** - Integration

### Commands

**Build Commands:**
- `npm run build` - Build project
- `npm run test` - Run tests
- `npm run lint` - Linting
- `npm run typecheck` - Type checking

**SPARC Commands:**
- `npx claude-flow sparc modes` - List available modes
- `npx claude-flow sparc run <mode> "<task>"` - Execute specific mode
- `npx claude-flow sparc tdd "<feature>"` - Run complete TDD workflow

---

## 🤖 Available Agents (54 Total)

**Core Development:** `coder`, `reviewer`, `tester`, `planner`, `researcher`

**Swarm Coordination:** `hierarchical-coordinator`, `mesh-coordinator`, `adaptive-coordinator`

**Specialized:** `backend-dev`, `mobile-dev`, `ml-developer`, `cicd-engineer`, `api-docs`, `system-architect`

**Testing:** `tdd-london-swarm`, `production-validator`

**GitHub:** `pr-manager`, `code-review-swarm`, `issue-tracker`, `release-manager`

**SPARC:** `sparc-coord`, `sparc-coder`, `specification`, `pseudocode`, `architecture`, `refinement`

**Full reference:** See [AGENT_REFERENCE.md](./.claude/AGENT_REFERENCE.md)

---

## 📋 Agent Coordination Protocol

**Implements:** MANDATORY-23 (Agent Collaboration)

Every agent spawned via Task tool MUST:

**1️⃣ BEFORE Work:**
```bash
npx claude-flow@alpha hooks pre-task --description "[task]"
npx claude-flow@alpha hooks session-restore --session-id "swarm-[id]"
```

**2️⃣ DURING Work:**
```bash
npx claude-flow@alpha hooks post-edit --file "[file]" --memory-key "swarm/[agent]/[step]"
npx claude-flow@alpha hooks notify --message "[what was done]"
```

**3️⃣ AFTER Work:**
```bash
npx claude-flow@alpha hooks post-task --task-id "[task]"
npx claude-flow@alpha hooks session-end --export-metrics true
```

---

## 📊 Project Status

**Current Version:**
- **Mobile Support:** v1.0 (touch-optimized, PWA-enabled)
- **Tests:** 842/914 passing (92.1%)
- **Architecture:** SPARC + Swarm coordination
- **Last Updated:** 2025-10-06

**Recent Achievements:**
- Complete mobile support (4-hour parallel implementation)
- 100% WCAG AAA touch target compliance
- Progressive Web App with smart caching
- 86 files changed (+16,645 lines)

---

## 📚 Additional Documentation

**For detailed references, see:**
- [MANDATORY_DIRECTIVES.md](./.claude/MANDATORY_DIRECTIVES.md) - Standalone copy of directives
- [PROJECT_IMPLEMENTATION.md](./.claude/PROJECT_IMPLEMENTATION.md) - Detailed project patterns
- [AGENT_REFERENCE.md](./.claude/AGENT_REFERENCE.md) - Complete agent catalog
- [EXAMPLES_AND_PATTERNS.md](./.claude/EXAMPLES_AND_PATTERNS.md) - Code examples and anti-patterns

**Note:** CLAUDE.md contains all critical directives for auto-loading. Other files provide
detailed references for human developers and deep dives.

---

## 🔧 Claude Code vs MCP Tools

**Implements:** MANDATORY-6 (Swarm Orchestration)

### Claude Code Handles ALL EXECUTION:
- Task tool (spawn and run agents)
- File operations (Read, Write, Edit, Glob, Grep)
- Code generation and programming
- Bash commands and system operations
- TodoWrite and task management
- Git operations

### MCP Tools ONLY COORDINATE:
- Swarm initialization (topology setup)
- Agent type definitions
- Task orchestration (high-level planning)
- Memory management
- Neural features

**KEY:** MCP coordinates the strategy, Claude Code's Task tool executes with real agents.

---

## ⚠️ Important Reminders

1. **Explain all actions** (MANDATORY-1)
2. **Maintain professional tone** (MANDATORY-2)
3. **Commit frequently** (MANDATORY-3)
4. **Ask when uncertain** (MANDATORY-5)
5. **Test before committing** (MANDATORY-8)
6. **Never commit secrets** (MANDATORY-9)
7. **Document decisions** (MANDATORY-12)

---

**Remember:** Claude Flow coordinates, Claude Code creates!
