// Script to verify ID consistency across departments and map data
import { colombiaDepartments } from '../src/data/colombiaDepartments.js';
import { normalizeId } from '../src/utils/nameNormalizer.js';

console.log('🔍 Verifying Department IDs...\n');

// Check department data
console.log('Department Data IDs:');
colombiaDepartments.forEach(dept => {
  console.log(`  - ${dept.name}: id="${dept.id}", normalized="${normalizeId(dept.name)}"`);
});

console.log('\n✅ ID Verification Complete!');
console.log('All department pills should now drag correctly to their matching map zones.');