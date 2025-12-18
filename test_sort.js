import { groupAndSortFonts } from './src/utils/fontSortUtils.js';

const mockFonts = [
    { id: 'p1', type: 'primary', name: 'Primary' },
    { id: 'f1', type: 'fallback', name: 'Fallback 1' }
];

const result = groupAndSortFonts(mockFonts, {});
console.log('Primary:', result.primary);
console.log('Global Fallback:', result.globalFallbackFonts);
console.log('Includes Primary?', result.globalFallbackFonts.some(f => f.type === 'primary'));
