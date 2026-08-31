const fs = require('fs');
const file = 'c:/Users/USER/Desktop/SMARTSERVE/admin.js';
const content = fs.readFileSync(file, 'utf8');
const lines = content.split('\n');
let start = -1;
let end = -1;
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('window.populateEqcDropdown = function () {')) start = i;
  if (lines[i].includes('// Print / export manifest')) { end = i; break; }
}
if (start === -1 || end === -1) { console.log('not found'); process.exit(1); }

const fixContent = fs.readFileSync('c:/Users/USER/Desktop/SMARTSERVE/fix.py', 'utf8');
const newBlock = fixContent.split('\"\"\"')[1];

lines.splice(start, end - start, newBlock);
fs.writeFileSync(file, lines.join('\n'));
console.log('Fixed from ' + start + ' to ' + end);
