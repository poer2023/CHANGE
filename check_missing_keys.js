const fs = require('fs');

// Read the component file to extract translation keys
const componentContent = fs.readFileSync('src/components/Result/StyleAnalysisPanel.tsx', 'utf8');
const keyMatches = componentContent.match(/t\('([^']+)'\)/g);
const componentKeys = keyMatches ? keyMatches.map(m => m.match(/t\('([^']+)'\)/)[1]).filter(k => k.startsWith('result.style.')) : [];

// Read locale file to get existing keys
const localeContent = fs.readFileSync('src/locales/index.ts', 'utf8');
const existingKeyMatches = localeContent.match(/'result\.style\.[^']+'/g);
const existingKeys = existingKeyMatches ? existingKeyMatches.map(k => k.slice(1, -1)) : [];

// Find missing keys
const uniqueComponentKeys = [...new Set(componentKeys)].sort();
const missingKeys = uniqueComponentKeys.filter(key => !existingKeys.includes(key));

console.log('Component keys:', uniqueComponentKeys.length);
console.log('Existing keys:', existingKeys.length);
console.log('Missing keys:', missingKeys.length);
console.log('\nMissing keys:');
missingKeys.forEach(key => console.log(`  ${key}`));
