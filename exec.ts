import { cacheContents } from './priority_cache';

// Sample 0 usage:
const callLogs0 = [
  [6, 0],
  [2, 0],
  [1, 1],
  [2, 1],
  [3, 1],
  [4, 2],
  [5, 2],
  [6, 2],
];
console.log('callLogs of sample0:', callLogs0);
const results0 = cacheContents(callLogs0);
console.log('Result of sample 0:', results0); // Should output [2]

console.log('\n\n');
// Sample 1 usage:
const callLogs1 = [
  [6, 0],
  [2, 0],
  [1, 1],
  [2, 1],
  [3, 2],
  [4, 2],
  [5, 1],
  [6, 1],
];

console.log('callLogs of sample1:', callLogs1);
const results1 = cacheContents(callLogs1);
console.log('Result of sample 1:', results1); // Should output [1]
