# Claude Code Configuration - Colombia Puzzle Game

AI-driven development environment using SPARC methodology and swarm coordination.

---

## 📋 Documentation Structure

This project's AI agent configuration is organized into focused, maintainable files:

### **[MANDATORY_DIRECTIVES.md](./MANDATORY_DIRECTIVES.md)** ⭐ READ FIRST
**25 universal operating principles** that apply to all AI agents across all projects.
Establishes foundation for professional, ethical, and effective operation.

**Key directives:**
- Communication & Transparency
- Professional Communication Style
- Version Control & Documentation
- Testing & Quality Assurance
- Security & Privacy
- Architecture & Design
- And 19 more...

### **[PROJECT_IMPLEMENTATION.md](./PROJECT_IMPLEMENTATION.md)**
**Project-specific patterns** showing how this codebase implements the MANDATORY directives.

**Contents:**
- Concurrent execution patterns (GOLDEN RULE)
- File organization rules
- SPARC methodology workflow
- Agent coordination protocol
- Build commands and setup

### **[AGENT_REFERENCE.md](./AGENT_REFERENCE.md)**
**Quick reference** for available agents, MCP tools, and commands.

**Includes:**
- 54 available agents organized by category
- MCP tool catalog
- Command reference
- Agent selection guide

### **[EXAMPLES_AND_PATTERNS.md](./EXAMPLES_AND_PATTERNS.md)**
**Code examples** demonstrating correct and incorrect usage patterns.

**Contains:**
- ✅ Correct parallel agent execution
- ❌ Common anti-patterns to avoid
- Real-world implementation examples
- Performance comparisons

---

## 🚀 Quick Start

**For new agents working on this project:**

1. **Read** [MANDATORY_DIRECTIVES.md](./MANDATORY_DIRECTIVES.md) - Universal operating rules
2. **Review** [PROJECT_IMPLEMENTATION.md](./PROJECT_IMPLEMENTATION.md) - How this project works
3. **Reference** [AGENT_REFERENCE.md](./AGENT_REFERENCE.md) - Available tools
4. **Study** [EXAMPLES_AND_PATTERNS.md](./EXAMPLES_AND_PATTERNS.md) - Usage patterns

**Critical patterns to internalize:**
- ⚡ **Golden Rule:** "1 MESSAGE = ALL RELATED OPERATIONS" (batch everything)
- 🤖 **Use Task tool** for spawning agents (not just MCP)
- 📁 **Never save to root** folder (use /src, /tests, /docs, etc.)
- ✅ **Write 5-10+ todos** minimum in one TodoWrite call

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

## 🎯 Key Project Patterns

### Concurrent Execution (MANDATORY-6, 18)
```javascript
[Single Message]:
  Task("Agent 1", "...", "type1")
  Task("Agent 2", "...", "type2")
  TodoWrite { todos: [...8-10 todos...] }
  Write "file1.ts"
  Write "file2.ts"
```

### SPARC Workflow (MANDATORY-11)
1. Specification → 2. Pseudocode → 3. Architecture → 4. Refinement → 5. Completion

### File Organization (MANDATORY-12)
- `/src` - Source code
- `/tests` - Test files
- `/docs` - Documentation
- `/daily_reports` - Daily logs
- Never save to root folder

---

## 🔧 Development Commands

```bash
# Build & Test
npm run build          # Build project
npm run test           # Run tests
npm run lint           # Linting
npm run typecheck      # Type checking

# SPARC Commands
npx claude-flow sparc modes                    # List modes
npx claude-flow sparc run <mode> "<task>"      # Execute mode
npx claude-flow sparc tdd "<feature>"          # TDD workflow
```

---

## 📚 Additional Resources

- **SPARC Documentation:** https://github.com/ruvnet/claude-flow
- **Flow-Nexus Platform:** https://flow-nexus.ruv.io
- **Project Daily Logs:** `/daily_reports/`

---

## ⚠️ Important Reminders

Following MANDATORY directives:

1. **Explain all actions** (MANDATORY-1)
2. **Maintain professional tone** (MANDATORY-2)
3. **Commit frequently** (MANDATORY-3)
4. **Ask when uncertain** (MANDATORY-5)
5. **Test before committing** (MANDATORY-8)
6. **Never commit secrets** (MANDATORY-9)
7. **Document decisions** (MANDATORY-12)

---

**Remember:** Claude Flow coordinates, Claude Code creates!

**For complete details, see the 4 documentation files linked above.**
