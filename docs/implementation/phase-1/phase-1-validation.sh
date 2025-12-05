#!/bin/bash

# Phase 1 Automated Validation Script
# Colombia Puzzle Game - Foundation Stabilization
# Version: 1.0
# Date: December 4, 2025

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Counters
PASS=0
FAIL=0

# Test function
test_criterion() {
    local name="$1"
    local command="$2"
    local expected="$3"

    echo -e "\n${YELLOW}Testing: ${name}${NC}"

    if eval "$command"; then
        echo -e "${GREEN}✓ PASS${NC}: $name"
        ((PASS++))
        return 0
    else
        echo -e "${RED}✗ FAIL${NC}: $name"
        echo "  Expected: $expected"
        ((FAIL++))
        return 1
    fi
}

# Header
echo "========================================="
echo " Phase 1 Validation Suite"
echo " Foundation Stabilization"
echo "========================================="
echo ""

# M1: TypeScript Migration Validation
echo "=== M1: TypeScript Migration ==="

test_criterion \
    "M1.1: Zero 'any' types in event handlers" \
    "! grep -r 'event: any' src/components src/hooks" \
    "0 occurrences"

test_criterion \
    "M1.2: TypeScript compiles without errors" \
    "npx tsc --noEmit" \
    "No compilation errors"

test_criterion \
    "M1.3: Event types file exists" \
    "test -f src/types/events.ts" \
    "File exists"

test_criterion \
    "M1.4: Type guards implemented" \
    "grep -q 'isTouchEvent\|isPointerEvent\|isKeyboardEvent' src/types/events.ts" \
    "Type guards present"

# M2: Auth Tests Validation
echo ""
echo "=== M2: Auth Tests ==="

test_criterion \
    "M2.1: Supabase mock exists" \
    "test -f src/tests/mocks/services/supabase.ts" \
    "Mock file exists"

test_criterion \
    "M2.2: AuthService tests exist" \
    "test -f src/tests/services/auth/AuthService.test.ts" \
    "Test file exists"

test_criterion \
    "M2.3: Auth tests passing" \
    "npm run test -- --grep='auth' --run --reporter=silent && echo 'Auth tests passed' || exit 1" \
    "25/25 tests passing"

test_criterion \
    "M2.4: No auth test exclusions" \
    "! grep -q 'tests/services/auth\|tests/components/auth' vitest.config.ts || ! grep -q exclude vitest.config.ts" \
    "No exclusions in config"

# M3: Hook Tests Validation
echo ""
echo "=== M3: Hook Tests ==="

test_criterion \
    "M3.1: Browser mocks directory exists" \
    "test -d src/tests/mocks/browser" \
    "Directory exists"

test_criterion \
    "M3.2: Observer mocks exist" \
    "test -f src/tests/mocks/browser/observers.ts" \
    "Mock file exists"

test_criterion \
    "M3.3: Animation mocks exist" \
    "test -f src/tests/mocks/browser/animation.ts" \
    "Mock file exists"

test_criterion \
    "M3.4: Hook tests passing" \
    "npm run test -- tests/hooks/ --run --reporter=silent && echo 'Hook tests passed' || exit 1" \
    "180/180 tests passing"

test_criterion \
    "M3.5: No hook test exclusions" \
    "! grep -q 'tests/hooks/' vitest.config.ts || ! grep -q exclude vitest.config.ts" \
    "No exclusions in config"

# M4: React Warnings Validation
echo ""
echo "=== M4: React Warnings ==="

test_criterion \
    "M4.1: No missing key warnings in code" \
    "npx eslint src/components --rule 'react/jsx-key: error' --format unix 2>&1 | grep -q '0 problems' || exit 1" \
    "Zero ESLint key warnings"

test_criterion \
    "M4.2: No exhaustive-deps warnings" \
    "npx eslint src --rule 'react-hooks/exhaustive-deps: error' --format unix 2>&1 | grep -q '0 problems' || exit 1" \
    "Zero useEffect dependency warnings"

test_criterion \
    "M4.3: ESLint passes" \
    "npm run lint" \
    "No linting errors"

# Overall Phase 1 Validation
echo ""
echo "=== Overall Phase 1 Validation ==="

test_criterion \
    "Overall.1: All tests passing" \
    "npm run test -- --run --reporter=silent && echo 'All tests passed' || exit 1" \
    "914/914 tests passing"

test_criterion \
    "Overall.2: Build succeeds" \
    "npm run build 2>&1 | grep -q 'built in' || exit 1" \
    "Build completes successfully"

test_criterion \
    "Overall.3: Bundle size within limits" \
    "test $(du -sb dist | cut -f1) -le 450000 || exit 1" \
    "Bundle ≤450KB"

test_criterion \
    "Overall.4: No TypeScript errors" \
    "npx tsc --noEmit 2>&1 | grep -q 'Found 0 errors' || exit 1" \
    "Zero TypeScript errors"

test_criterion \
    "Overall.5: No test exclusions" \
    "! grep -E 'exclude:.*\*\*/tests/(services|components|hooks|integration)' vitest.config.ts" \
    "No test exclusions"

# Summary
echo ""
echo "========================================="
echo " Validation Summary"
echo "========================================="
echo -e "${GREEN}PASSED: $PASS${NC}"
echo -e "${RED}FAILED: $FAIL${NC}"
echo ""

if [ $FAIL -eq 0 ]; then
    echo -e "${GREEN}✓ Phase 1 VALIDATION PASSED${NC}"
    echo "All success criteria met. Ready for Phase 2."
    exit 0
else
    echo -e "${RED}✗ Phase 1 VALIDATION FAILED${NC}"
    echo "Please fix failing criteria before proceeding to Phase 2."
    exit 1
fi
