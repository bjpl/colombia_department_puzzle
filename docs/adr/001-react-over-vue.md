# ADR 001: Choose React over Vue/Svelte

**Date:** 2025-09-18
**Status:** Accepted
**Deciders:** Core development team

---

## Context

We needed to select a frontend framework for building the Colombia Departments Puzzle Game. The main candidates were React, Vue, and Svelte.

### Requirements
- Strong TypeScript support
- Large ecosystem of libraries
- Good performance for interactive map rendering
- Accessibility tooling
- Progressive Web App (PWA) support
- Mobile-first development
- Long-term maintainability

---

## Decision

We chose **React** with TypeScript as the frontend framework.

---

## Rationale

### React Advantages

**1. Ecosystem Maturity**
- Extensive library ecosystem (`@dnd-kit`, `d3-geo`, testing libraries)
- Well-established PWA tooling (VitePWA, Workbox)
- Mature accessibility tools (React Testing Library, axe-core)
- Strong TypeScript support with `@types/react`

**2. Developer Experience**
- Hooks API provides clean, reusable logic
- React DevTools for debugging
- Large community = more resources, tutorials, solutions
- Team familiarity with React patterns

**3. Performance**
- Virtual DOM efficient for our use case (frequent state updates)
- React.memo, useMemo, useCallback for optimization
- Code splitting with React.lazy
- Concurrent features (future-ready)

**4. Mobile & PWA**
- React Native (potential future mobile app)
- Proven PWA patterns
- Touch event handling well-documented

**5. Testing**
- React Testing Library (accessibility-focused)
- Vitest (fast, modern)
- Playwright for E2E

### Vue Considerations

**Pros:**
- Simpler learning curve
- Built-in reactivity system
- Single-file components

**Cons:**
- Smaller ecosystem than React
- Less TypeScript adoption in community
- Fewer accessible component libraries
- Less team experience

### Svelte Considerations

**Pros:**
- Smallest bundle sizes
- Compile-time optimization
- Simple syntax

**Cons:**
- Smaller ecosystem
- Fewer libraries for our specific needs (d3-geo integration, drag-and-drop)
- Less mature TypeScript support
- Unproven for complex interactive applications

---

## Consequences

### Positive
✅ Access to mature drag-and-drop library (`@dnd-kit`)
✅ Excellent D3.js integration for map rendering
✅ Strong testing ecosystem (Testing Library, Playwright)
✅ Future-proof with React 18+ concurrent features
✅ Easy onboarding for contributors (large React community)

### Negative
❌ Larger bundle size than Svelte (~140 KB vendor bundle)
❌ Requires optimization techniques (memoization, lazy loading)
❌ Learning curve for advanced patterns (Context, Zustand)

### Mitigations
- Code splitting to reduce initial bundle
- React.memo for performance-critical components
- Lazy loading non-critical features (Study Mode)
- Clear documentation of patterns used

---

## Alternatives Considered

1. **Vue 3 + TypeScript**
   - Rejected: Smaller ecosystem, less team expertise

2. **Svelte + SvelteKit**
   - Rejected: Immature library ecosystem for our needs

3. **Vanilla TypeScript**
   - Rejected: Too much boilerplate for reactive UI

---

## References

- [React Documentation](https://react.dev/)
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)
- [State of JS 2024](https://stateofjs.com/)

---

## Review Date

**Next Review:** 2026-01-01 (or when considering major refactoring)
