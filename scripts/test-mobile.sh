#!/bin/bash

# Mobile Testing Automation Script
# Run this after upgrading Node.js to 20.19+ or 22+

set -e  # Exit on error

echo "========================================="
echo "  Mobile Implementation Test Suite"
echo "  Colombia Puzzle Game"
echo "========================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check Node version
echo "Checking Node.js version..."
NODE_VERSION=$(node --version)
REQUIRED_VERSION="20.19.0"

echo "Current Node.js: $NODE_VERSION"
echo "Required: v$REQUIRED_VERSION+"

# Simple version check
MAJOR=$(echo $NODE_VERSION | cut -d. -f1 | sed 's/v//')
MINOR=$(echo $NODE_VERSION | cut -d. -f2)

if [ "$MAJOR" -lt 20 ] || ([ "$MAJOR" -eq 20 ] && [ "$MINOR" -lt 19 ]); then
    echo -e "${RED}❌ Node.js version too old!${NC}"
    echo "Please upgrade to Node.js 20.19+ or 22+"
    echo "See: NODE_UPGRADE_INSTRUCTIONS.md"
    exit 1
fi

echo -e "${GREEN}✓ Node.js version OK${NC}"
echo ""

# Phase 1: Install Dependencies
echo "========================================="
echo "Phase 1: Installing Dependencies"
echo "========================================="
echo ""

if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
else
    echo "Dependencies already installed"
fi

echo -e "${GREEN}✓ Dependencies ready${NC}"
echo ""

# Phase 2: Run Test Suite
echo "========================================="
echo "Phase 2: Running Test Suite"
echo "========================================="
echo ""

echo "Running unit and integration tests..."
npm test -- --run --reporter=verbose

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ All tests passed${NC}"
else
    echo -e "${YELLOW}⚠ Some tests failed (check output above)${NC}"
fi
echo ""

# Phase 3: Build Production
echo "========================================="
echo "Phase 3: Building Production Bundle"
echo "========================================="
echo ""

npm run build

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Build successful${NC}"
    echo "Build output: dist/"
else
    echo -e "${RED}❌ Build failed${NC}"
    exit 1
fi
echo ""

# Phase 4: Bundle Analysis
echo "========================================="
echo "Phase 4: Bundle Size Analysis"
echo "========================================="
echo ""

if [ -d "dist/assets" ]; then
    echo "Production bundle sizes:"
    du -h dist/assets/* | sort -h
    echo ""
    echo "Total bundle size:"
    du -sh dist/
else
    echo "No dist folder found"
fi
echo ""

# Phase 5: Dev Server Setup
echo "========================================="
echo "Phase 5: Development Server"
echo "========================================="
echo ""

echo "Development server commands:"
echo ""
echo "  Local testing:"
echo "  $ npm run dev"
echo "  → http://localhost:3000/colombia_department_puzzle"
echo ""
echo "  Network testing (for mobile devices):"
echo "  $ npm run dev -- --host"
echo "  → http://[YOUR_IP]:3000/colombia_department_puzzle"
echo ""

# Get local IP for mobile testing
echo "Your local IP addresses:"
ipconfig 2>/dev/null | grep -A 3 "IPv4" | grep -v "IPv6" || echo "Run 'ipconfig' to find your IP"
echo ""

# Phase 6: Manual Testing Checklist
echo "========================================="
echo "Phase 6: Manual Testing Required"
echo "========================================="
echo ""
echo "The following tests require manual verification:"
echo ""
echo "A. Browser DevTools Mobile Emulation:"
echo "   1. Start: npm run dev"
echo "   2. Open Chrome DevTools (F12)"
echo "   3. Toggle Device Toolbar (Ctrl+Shift+M)"
echo "   4. Test devices:"
echo "      - iPhone SE (375×667)"
echo "      - iPhone 12 Pro (390×844)"
echo "      - Pixel 5 (393×851)"
echo "      - iPad Mini (768×1024)"
echo ""
echo "B. Real Mobile Device Testing:"
echo "   1. Start: npm run dev -- --host"
echo "   2. On phone, navigate to: http://[YOUR_IP]:3000/colombia_department_puzzle"
echo "   3. Verify:"
echo "      [ ] Map fits screen (no horizontal scroll)"
echo "      [ ] Bottom sheet swipes smoothly"
echo "      [ ] Touch targets work (44px minimum)"
echo "      [ ] Orientation changes work"
echo ""
echo "C. PWA Installation (Android):"
echo "   1. Build: npm run build"
echo "   2. Serve: npx http-server dist -p 8080"
echo "   3. On Android Chrome: http://[YOUR_IP]:8080"
echo "   4. Tap 'Install' banner"
echo "   5. Verify app on home screen"
echo ""
echo "D. Lighthouse Audit:"
echo "   Chrome DevTools → Lighthouse → Generate Report"
echo "   Targets: Performance >90, Accessibility >95, PWA >90"
echo ""

# Summary
echo "========================================="
echo "  Test Suite Complete"
echo "========================================="
echo ""
echo -e "${GREEN}Automated tests completed successfully!${NC}"
echo ""
echo "Next steps:"
echo "  1. Review test output above"
echo "  2. Complete manual testing (B, C, D)"
echo "  3. Document results"
echo "  4. Deploy if all tests pass"
echo ""
echo "Full instructions: NODE_UPGRADE_INSTRUCTIONS.md"
echo "Test checklist: MOBILE_TESTING_CHECKLIST.md"
echo ""
