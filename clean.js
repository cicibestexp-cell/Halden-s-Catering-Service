const fs = require('fs');

let content = fs.readFileSync('style.css', 'utf-8');

// Find the index of the last duplicate block 
const duplicateStart = content.lastIndexOf('[data-theme="dark"] .btn-pkg {');
const firstStart = content.indexOf('[data-theme="dark"] .btn-pkg {');

if (duplicateStart !== -1 && duplicateStart !== firstStart) {
    // The map modal code is right after the duplicate
    const mapModalStart = content.indexOf('/* ===== MAP MODAL ===== */', duplicateStart);
    if (mapModalStart !== -1) {
        // Cut out the duplicate block
        content = content.substring(0, duplicateStart) + content.substring(mapModalStart);
        
        // Ensure there's no dangling brace issues
        const openBraces = (content.match(/\{/g) || []).length;
        const closeBraces = (content.match(/\}/g) || []).length;
        if (openBraces > closeBraces) {
           content += '\n}\n';
        }
        
        fs.writeFileSync('style.css', content);
        console.log('Fixed style.css');
    }
} else {
    console.log('No duplicates found or map modal not found.');
}
