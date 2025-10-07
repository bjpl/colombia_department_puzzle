# Agent & Tool Reference

Quick lookup for available agents, MCP tools, and commands.

**See also:**
- [MANDATORY_DIRECTIVES.md](./MANDATORY_DIRECTIVES.md) - Universal operating principles
- [PROJECT_IMPLEMENTATION.md](./PROJECT_IMPLEMENTATION.md) - How this project uses agents
- [EXAMPLES_AND_PATTERNS.md](./EXAMPLES_AND_PATTERNS.md) - Usage examples

---

## 🤖 Available Agents (54 Total)

### Core Development
`coder`, `reviewer`, `tester`, `planner`, `researcher`

**Use for:**
- `coder` - Writing implementation code
- `reviewer` - Code review and quality checks
- `tester` - Creating and running tests
- `planner` - Strategic planning and task breakdown
- `researcher` - Deep research and analysis

### Swarm Coordination
`hierarchical-coordinator`, `mesh-coordinator`, `adaptive-coordinator`, `collective-intelligence-coordinator`, `swarm-memory-manager`

**Use for:**
- Complex multi-agent coordination
- Distributed task management
- Dynamic topology optimization
- Shared memory coordination

### Consensus & Distributed
`byzantine-coordinator`, `raft-manager`, `gossip-coordinator`, `consensus-builder`, `crdt-synchronizer`, `quorum-manager`, `security-manager`

**Use for:**
- Distributed consensus protocols
- Fault-tolerant coordination
- State synchronization
- Security validation

### Performance & Optimization
`perf-analyzer`, `performance-benchmarker`, `task-orchestrator`, `memory-coordinator`, `smart-agent`

**Use for:**
- Performance profiling
- Bottleneck identification
- Task orchestration
- Memory management

### GitHub & Repository
`github-modes`, `pr-manager`, `code-review-swarm`, `issue-tracker`, `release-manager`, `workflow-automation`, `project-board-sync`, `repo-architect`, `multi-repo-swarm`

**Use for:**
- GitHub operations
- Pull request management
- Issue tracking
- Release coordination
- Multi-repository workflows

### SPARC Methodology
`sparc-coord`, `sparc-coder`, `specification`, `pseudocode`, `architecture`, `refinement`

**Use for:**
- SPARC workflow phases
- Systematic TDD
- Architecture design
- Specification creation

### Specialized Development
`backend-dev`, `mobile-dev`, `ml-developer`, `cicd-engineer`, `api-docs`, `system-architect`, `code-analyzer`, `base-template-generator`

**Use for:**
- Backend API development
- Mobile app development
- Machine learning
- CI/CD pipeline setup
- API documentation
- System architecture
- Code analysis
- Template generation

### Testing & Validation
`tdd-london-swarm`, `production-validator`

**Use for:**
- Test-driven development (London school)
- Production readiness validation

### Migration & Planning
`migration-planner`, `swarm-init`

**Use for:**
- Migration planning
- Swarm initialization

---

## 🛠️ MCP Tool Categories

### Coordination
- `swarm_init` - Initialize swarm with topology
- `agent_spawn` - Define agent types
- `task_orchestrate` - Orchestrate high-level workflows

### Monitoring
- `swarm_status` - Get swarm status
- `agent_list` - List active agents
- `agent_metrics` - Get agent performance metrics
- `task_status` - Check task status
- `task_results` - Retrieve task results

### Memory & Neural
- `memory_usage` - Track memory usage
- `neural_status` - Get neural model status
- `neural_train` - Train neural patterns
- `neural_patterns` - Retrieve learned patterns

### GitHub Integration
- `github_swarm` - GitHub swarm coordination
- `repo_analyze` - Analyze repository
- `pr_enhance` - Enhance pull requests
- `issue_triage` - Triage issues
- `code_review` - Automated code review

### System
- `benchmark_run` - Run performance benchmarks
- `features_detect` - Detect available features
- `swarm_monitor` - Monitor swarm health

---

## 🌐 Flow-Nexus MCP Tools (Optional Advanced Features)

Flow-Nexus extends MCP capabilities with 70+ cloud-based orchestration tools.

**Authentication Required:**
- Register: `mcp__flow-nexus__user_register` or `npx flow-nexus@latest register`
- Login: `mcp__flow-nexus__user_login` or `npx flow-nexus@latest login`

### Key Tool Categories

**Swarm & Agents:**
- `swarm_init`, `swarm_scale`, `agent_spawn`, `task_orchestrate`

**Sandboxes:**
- `sandbox_create` - Create isolated execution environment
- `sandbox_execute` - Execute code in sandbox
- `sandbox_upload` - Upload files to sandbox

**Templates:**
- `template_list` - List available templates
- `template_deploy` - Deploy pre-built project templates

**Neural AI:**
- `neural_train` - Train distributed neural networks
- `neural_patterns` - Retrieve learned patterns
- `seraphina_chat` - AI assistant integration

**GitHub:**
- `github_repo_analyze` - Analyze repository structure
- `github_pr_manage` - Manage pull requests

**Real-time:**
- `execution_stream_subscribe` - Subscribe to execution streams
- `realtime_subscribe` - Subscribe to real-time events

**Storage:**
- `storage_upload` - Upload files to cloud storage
- `storage_list` - List stored files

**Platform:** https://flow-nexus.ruv.io

---

## 📊 Performance Benchmarks

- **84.8% SWE-Bench solve rate**
- **32.3% token reduction**
- **2.8-4.4x speed improvement**
- **27+ neural models**

---

## 🎯 Agent Selection Guide

### For Feature Development
1. `planner` - Break down requirements
2. `architect` - Design architecture
3. `coder` - Implement features
4. `tester` - Write tests
5. `reviewer` - Review code

### For Bug Fixes
1. `code-analyzer` - Analyze issue
2. `coder` - Fix implementation
3. `tester` - Verify fix
4. `reviewer` - Review changes

### For Refactoring
1. `code-analyzer` - Identify technical debt
2. `architect` - Design refactoring
3. `coder` - Implement changes
4. `tester` - Ensure no regressions
5. `reviewer` - Review refactoring

### For Documentation
1. `researcher` - Gather information
2. `api-docs` - Generate API docs
3. `reviewer` - Review documentation

---

**Quick tip:** Always spawn related agents in parallel using Claude Code's Task tool,
not sequentially. See [EXAMPLES_AND_PATTERNS.md](./EXAMPLES_AND_PATTERNS.md) for examples.
