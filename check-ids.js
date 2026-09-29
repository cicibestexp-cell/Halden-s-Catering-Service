const fs = require('fs');
const html = fs.readFileSync('admin.html', 'utf8');

function checkIds() {
  const stdCount = (html.match(/id="mt-mode-standard-right"/g) || []).length;
  const catCount = (html.match(/id="mt-mode-catalog-right"/g) || []).length;
  console.log('mt-mode-standard-right count:', stdCount);
  console.log('mt-mode-catalog-right count:', catCount);
  
  if (stdCount > 1 || catCount > 1) {
    console.log('DUPLICATE IDS FOUND!');
  }
}
checkIds();
