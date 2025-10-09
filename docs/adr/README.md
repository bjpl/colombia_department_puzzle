# Architecture Decision Records (ADRs)

This directory contains Architecture Decision Records (ADRs) for the Colombia Departments Puzzle Game project.

---

## What is an ADR?

An Architecture Decision Record captures important architectural decisions made in the project, including:
- **Context:** Why was the decision needed?
- **Decision:** What was decided?
- **Rationale:** Why was this the best choice?
- **Consequences:** What are the impacts (positive and negative)?
- **Alternatives:** What other options were considered?

---

## ADR Index

| # | Title | Status | Date |
|---|-------|--------|------|
| [001](./001-react-over-vue.md) | Choose React over Vue/Svelte | Accepted | 2025-09-18 |
| [002](./002-tap-first-mobile-interaction.md) | Tap-First Mobile Interaction Pattern | Accepted | 2025-10-06 |
| [003](./003-vite-over-webpack.md) | Vite over Webpack for Build Tooling | Accepted | 2025-09-18 |

---

## Status Definitions

- **Proposed:** Under consideration
- **Accepted:** Decision made and implemented
- **Deprecated:** No longer recommended
- **Superseded:** Replaced by another ADR

---

## Creating New ADRs

### When to Create an ADR

Create an ADR when making decisions about:
- Technology selection (frameworks, libraries, tools)
- Architectural patterns (state management, data flow)
- User interaction models
- Performance trade-offs
- Security approaches
- Third-party integrations

### Template

```markdown
# ADR XXX: [Title]

**Date:** YYYY-MM-DD
**Status:** Proposed|Accepted|Deprecated|Superseded
**Deciders:** [Who made this decision]

---

## Context

[What is the issue we're addressing?]

### Requirements
- Requirement 1
- Requirement 2

---

## Decision

[What did we decide?]

---

## Rationale

[Why did we make this decision?]

### [Option Name] Advantages

**1. [Advantage Category]**
- Detail 1
- Detail 2

---

## Consequences

### Positive
✅ Good thing 1
✅ Good thing 2

### Negative
❌ Trade-off 1
❌ Trade-off 2

### Mitigations
- How we address negative consequences

---

## Alternatives Considered

### 1. [Alternative Name]
**Pros:** ...
**Cons:** ...
**Decision:** Rejected because...

---

## References

- [Link 1](https://example.com)
- [Link 2](https://example.com)

---

## Review Date

**Next Review:** [When should this be reconsidered?]
```

### Naming Convention

```
XXX-short-descriptive-title.md

Examples:
001-react-over-vue.md
002-tap-first-mobile-interaction.md
003-vite-over-webpack.md
```

---

## Maintenance

- **Review ADRs** when making related changes
- **Update status** if decision is superseded
- **Reference ADRs** in code comments for context
- **Link ADRs** in pull requests when relevant

---

## Resources

- [ADR Template by Michael Nygard](https://github.com/joelparkerhenderson/architecture-decision-record)
- [Documenting Architecture Decisions](https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions)
- [When to Write an ADR](https://adr.github.io/)

---

**Last Updated:** 2025-10-08
