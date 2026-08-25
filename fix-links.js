const fs = require('fs');
const path = require('path');

// 1. OrderSummary.tsx
let osPath = path.join(process.cwd(), 'src/components/OrderSummary.tsx');
let osContent = fs.readFileSync(osPath, 'utf8');
osContent = osContent.replace(
  /<div className="w-\[80px\] h-\[80px\] bg-white border border-\[#c4c6cc\] rounded-\[8px\] flex items-center justify-center p-\[8px\]">\s*<img\s*src=\{`\/images\/\$\{item.product.image\}`\}\s*alt=\{item.product.name\}\s*className="w-full h-full object-contain mix-blend-multiply"\s*\/>\s*<\/div>/g,
  `<Link href={\`/product/\${item.product.id}\`} className="w-[80px] h-[80px] bg-white border border-[#c4c6cc] rounded-[8px] flex items-center justify-center p-[8px] hover:border-black transition-colors">
                <img 
                  src={item.product.image.startsWith('http') ? item.product.image : \`/images/\${item.product.image}\`} 
                  alt={item.product.name} 
                  className="w-full h-full object-contain mix-blend-multiply"
                />
              </Link>`
);
osContent = osContent.replace(
  /<span className="font-\['Hanken_Grotesk'\] font-bold text-\[16px\] text-black">\s*\{item.product.name\}\s*<\/span>/g,
  `<Link href={\`/product/\${item.product.id}\`} className="font-['Hanken_Grotesk'] font-bold text-[16px] text-black hover:underline hover:text-green-800 transition-colors">
                  {item.product.name}
                </Link>`
);
fs.writeFileSync(osPath, osContent);

// 2. success/page.tsx
let spPath = path.join(process.cwd(), 'src/app/checkout/success/page.tsx');
let spContent = fs.readFileSync(spPath, 'utf8');
spContent = spContent.replace(
  /<div className="w-\[64px\] h-\[64px\] bg-\[#eae7e7\] border border-\[#c4c6cc\] rounded-\[4px\] flex items-center justify-center p-\[4px\] flex-shrink-0">\s*<img\s*src=\{`\/images\/\$\{item.product.image\}`\}\s*alt=\{item.product.name\}\s*className="w-full h-full object-contain mix-blend-multiply"\s*\/>\s*<\/div>/g,
  `<Link href={\`/product/\${item.product.id}\`} className="w-[64px] h-[64px] bg-[#eae7e7] border border-[#c4c6cc] rounded-[4px] flex items-center justify-center p-[4px] flex-shrink-0 hover:border-black transition-colors">
                      <img 
                        src={item.product.image.startsWith('http') ? item.product.image : \`/images/\${item.product.image}\`} 
                        alt={item.product.name}
                        className="w-full h-full object-contain mix-blend-multiply"
                      />
                    </Link>`
);
spContent = spContent.replace(
  /<h3 className="font-\['Hanken_Grotesk'\] font-semibold text-black text-\[13px\] uppercase">\s*\{item.product.brand\} \{item.product.name\}\s*<\/h3>/g,
  `<Link href={\`/product/\${item.product.id}\`} className="font-['Hanken_Grotesk'] font-semibold text-black text-[13px] uppercase hover:underline hover:text-green-800">
                        {item.product.brand} {item.product.name}
                      </Link>`
);
fs.writeFileSync(spPath, spContent);

// 3. AccountOrders.tsx
let aoPath = path.join(process.cwd(), 'src/components/AccountOrders.tsx');
let aoContent = fs.readFileSync(aoPath, 'utf8');
aoContent = aoContent.replace(
  /<div className="w-24 h-24 bg-gray-50 rounded-xl flex items-center justify-center p-3 shrink-0 border border-gray-100">\s*<img src=\{item.productImage \|\| "\/images\/golf.png"\} alt=\{item.productName\} className="w-full h-full object-contain mix-blend-multiply" \/>\s*<\/div>/g,
  `<Link href={\`/product/\${item.productId}\`} className="w-24 h-24 bg-gray-50 rounded-xl flex items-center justify-center p-3 shrink-0 border border-gray-100 hover:border-black transition-colors">
                          <img src={item.productImage || "/images/golf.png"} alt={item.productName} className="w-full h-full object-contain mix-blend-multiply" />
                        </Link>`
);
aoContent = aoContent.replace(
  /<span className="text-black text-lg font-black tracking-tight leading-tight">\s*\{item.productName\}\s*<\/span>/g,
  `<Link href={\`/product/\${item.productId}\`} className="text-black text-lg font-black tracking-tight leading-tight hover:underline hover:text-green-800">
                            {item.productName}
                          </Link>`
);
fs.writeFileSync(aoPath, aoContent);

console.log('Links added!');
