# CI Fix

Apply CI stabilization skills to fix pipeline failures.

## Usage
```
/project:ci-fix
```

## Skills Applied
1. **ci-node-version-fix**: Upgrade Node.js to 20 in workflows
2. **ci-test-exclusion**: Exclude flaky tests in CI environment
3. **ci-emoji-text-fix**: Fix RTL text matchers with emoji
4. **lighthouse-preview-server**: Configure preview server for audits

## Process
1. Analyze CI logs from GitHub Actions
2. Identify failure patterns
3. Apply matching skills
4. Verify workflow passes

## Skill Reference
Uses: skills/ci-debugger, skills/ci-stabilization-skill from memory
