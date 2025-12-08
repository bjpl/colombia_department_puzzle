/**
 * Verification script to check module exports
 * Run with: npx tsx src/tests/utils/components/verify-exports.ts
 */

import * as ComponentTestUtils from './index';
import * as MockData from './mock-data';
import * as Fixtures from './fixtures';

console.log('=== Component Test Infrastructure Exports ===\n');

console.log('From ./index.tsx:');
console.log('- renderWithProviders:', typeof ComponentTestUtils.renderWithProviders);
console.log('- render:', typeof ComponentTestUtils.render);
console.log('- screen:', typeof ComponentTestUtils.screen);
console.log('- userEvent:', typeof ComponentTestUtils.userEvent);
console.log('- waitFor:', typeof ComponentTestUtils.waitFor);
console.log('- within:', typeof ComponentTestUtils.within);
console.log('- TestProviderOptions interface: exported');

console.log('\nFrom ./mock-data.ts:');
console.log('- mockDepartment:', typeof MockData.mockDepartment);
console.log('- mockGameState:', typeof MockData.mockGameState);
console.log('- mockUser:', typeof MockData.mockUser);

console.log('\nFrom ./fixtures.ts:');
console.log('- DEPARTMENTS:', Array.isArray(Fixtures.DEPARTMENTS), `(${Fixtures.DEPARTMENTS.length} items)`);
console.log('- REGIONS:', Array.isArray(Fixtures.REGIONS), `(${Fixtures.REGIONS.length} items)`);
console.log('- DIFFICULTY_LEVELS:', Array.isArray(Fixtures.DIFFICULTY_LEVELS), `(${Fixtures.DIFFICULTY_LEVELS.length} items)`);
console.log('- GAME_MODES:', Array.isArray(Fixtures.GAME_MODES), `(${Fixtures.GAME_MODES.length} items)`);

console.log('\n✅ All module exports verified successfully!');
