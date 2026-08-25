const fs = require('fs');
const path = require('path');

const dir = path.join(process.cwd(), 'src', 'components');
const files = [
  'AccessoriesProductGrid.tsx',
  'ApparelProductGrid.tsx',
  'BagsProductGrid.tsx',
  'BallsProductGrid.tsx',
  'ClubsProductGrid.tsx',
  'ShoesProductGrid.tsx',
  'SaleProductGrid.tsx'
];

files.forEach(file => {
  const fp = path.join(dir, file);
  if (!fs.existsSync(fp)) return;
  let content = fs.readFileSync(fp, 'utf8');

  // Replace button with Link for the arrow icon
  const buttonRegex = /<button className="w-\[48px\] h-\[48px\] rounded-full border border-\[#c1c9bf\] flex items-center justify-center hover:bg-\[#003319\] hover:border-\[#003319\] hover:text-white text-\[#1b1c1c\] transition-colors group-hover:bg-\[#003319\] group-hover:text-white">\s*<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1\.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"\/><path d="m12 5 7 7-7 7"\/><\/svg>\s*<\/button>/g;

  const replacement = `<Link href={\`/product/\${product.id}\`} className="w-[48px] h-[48px] rounded-full border border-[#c1c9bf] flex items-center justify-center hover:bg-[#003319] hover:border-[#003319] hover:text-white text-[#1b1c1c] transition-colors group-hover:bg-[#003319] group-hover:text-white">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                </Link>`;

  const original = content;
  content = content.replace(buttonRegex, replacement);

  // Let's also wrap the image area with a link so clicking the image works too!
  const imageRegex = /<div className="w-full aspect-\[4\/3\] bg-\[#fbf9f9\] rounded-\[8px\] mb-\[24px\] overflow-hidden relative flex items-center justify-center">/g;
  content = content.replace(imageRegex, `<Link href={\`/product/\${product.id}\`} className="w-full aspect-[4/3] bg-[#fbf9f9] rounded-[8px] mb-[24px] overflow-hidden relative flex items-center justify-center block">`);
  
  // We need to close the Link for the image
  // The image block ends with:
  //                 </div>
  //               </div>
  //               {/* Product Details */}
  
  const closeImageRegex = /<\/div>\s*<\/div>\s*\{\/\* Product Details \*\/\}/g;
  content = content.replace(closeImageRegex, `</div>\n              </Link>\n              \n              {/* Product Details */}`);

  if (original !== content) {
    fs.writeFileSync(fp, content);
    console.log('Fixed links in', file);
  }
});
