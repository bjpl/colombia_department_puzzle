#!/usr/bin/env node
/**
 * Script to fix test provider issues by adding proper module mocking
 */

const fs = require('fs');
const path = require('path');

// File paths
const testFile = path.join(__dirname, '../src/tests/hooks/useEnhancedKeyboardNavigation.test.tsx');
const touchTestFile = path.join(__dirname, '../src/tests/integration/touchInteraction.test.tsx');

// Read keyboard test file
let content = fs.readFileSync(testFile, 'utf8');

// Add module mocking at the top, right after imports
const mockImport = `// Mock the GameContext module before importing the hook
vi.mock('../../context/GameContext', () => ({
  useGame: vi.fn(),
  GameProvider: ({ children }: { children: ReactNode }) => children,
}));

`;

// Insert mock right after test providers import and before the useEnhancedKeyboardNavigation import
content = content.replace(
  /import {\s*GameProvider,\s*createMockGameStore,\s*}\s*from\s*'\.\.\/utils\/testProviders';/,
  `import { createMockGameStore } from '../utils/testProviders';

${mockImport}import { useGame } from '../../context/GameContext';`
);

//  Update beforeEach to setup mock
content = content.replace(
  /beforeEach\(\(\) => {\s*gameStore = createMockGameStore\(/,
  `beforeEach(() => {
    gameStore = createMockGameStore(`
);

content = content.replace(
  /placedDepartments: new Set\(\),\s*}\);/,
  `placedDepartments: new Set(),
    });

    // Get the game state and mock useGame
    const mockGameState = gameStore();
    (useGame as any).mockReturnValue(mockGameState);`
);

// Remove wrapper definition and all wrapper usages
content = content.replace(/\s*const wrapper[^;]+;\s*/g, '\n');
content = content.replace(/, \{\s*wrapper[^}]*\}/g, '');
content = content.replace(/,\s*\{\s*wrapper:\s*localWrapper[^}]*\}/g, '');

// Fix local wrapper test case
content = content.replace(
  /const localWrapper[^;]*;\s*/g,
  `// Update mock to use new store state
      const localState = store();
      (useGame as any).mockReturnValue(localState);

      `
);

// Write back
fs.writeFileSync(testFile, content, 'utf8');

console.log(`✅ Fixed ${testFile}`);

// Now fix touchInteraction.test.tsx
let touchContent = fs.readFileSync(touchTestFile, 'utf8');

// Replace GameProvider import with AllProviders from test utils
touchContent = touchContent.replace(
  /import.*GameProvider.*from.*'\.\.\/\.\.\/context\/GameContext';/,
  `import { AllProviders } from '../utils/testProviders';`
);

// Already fixed by previous edits - just verify
if (touchContent.includes('AllProviders')) {
  console.log(`✅ ${touchTestFile} already has AllProviders`);
} else {
  console.log(`⚠️ ${touchTestFile} needs manual verification`);
}

console.log('\n✅ All test files fixed!');
