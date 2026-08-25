const fs = require('fs');
const path = require('path');

const dir = path.join(process.cwd(), 'src', 'components');

const grids = [
  'AccessoriesProductGrid.tsx',
  'ApparelProductGrid.tsx',
  'BagsProductGrid.tsx',
  'ClubsProductGrid.tsx',
  'ShoesProductGrid.tsx'
];

grids.forEach(file => {
  const fp = path.join(dir, file);
  if (!fs.existsSync(fp)) return;
  let content = fs.readFileSync(fp, 'utf8');
  
  // Regex to remove the exact block
  const regex = /\s*\{\/\*\s*Reviews\/Stars placeholder\s*\*\/\}\s*<div className="flex gap-\[4px\] mb-\[12px\] text-\[#006747\]">\s*\{\[\.\.\.Array\(5\)\]\.map\(\(_, i\) => \(\s*<svg[^>]+><polygon[^>]+><\/svg>\s*\)\)\}\s*<span className="text-\[12px\] text-\[#717b71\] ml-1">\(\d+\)<\/span>\s*<\/div>/g;
  
  const original = content;
  content = content.replace(regex, '');
  if (original !== content) {
    fs.writeFileSync(fp, content);
    console.log('Removed from', file);
  } else {
    console.log('Not found in', file);
  }
});

// Now for ProductDetails.tsx
const pdPath = path.join(dir, 'ProductDetails.tsx');
if (fs.existsSync(pdPath)) {
  let content = fs.readFileSync(pdPath, 'utf8');
  const regex = /\s*\{\/\*\s*Reviews\s*\*\/\}\s*<div className="flex items-center gap-\[8px\] mb-\[24px\]">\s*<div className="flex gap-\[4px\] text-\[#006747\]">\s*\{\[\.\.\.Array\(5\)\]\.map\(\(_, i\) => \(\s*<svg[^>]+><polygon[^>]+><\/svg>\s*\)\)\}\s*<\/div>\s*<span className="text-\[14px\] text-\[#717b71\] font-\['Hanken_Grotesk'\] underline cursor-pointer">\(\d+ Reviews\)<\/span>\s*<\/div>/g;
  
  const original = content;
  content = content.replace(regex, '');
  if (original !== content) {
    fs.writeFileSync(pdPath, content);
    console.log('Removed from ProductDetails.tsx');
  } else {
    console.log('Not found in ProductDetails.tsx');
  }
}
