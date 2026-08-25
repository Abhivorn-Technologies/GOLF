const fs = require('fs');
const path = require('path');
const dir = path.join(process.cwd(), 'src', 'components');
const files = fs.readdirSync(dir).filter(f => f.endsWith('ProductGrid.tsx') && f !== 'SaleProductGrid.tsx');

files.forEach(file => {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  const target = '<span className="text-[#717b71] font-serif italic text-center px-4">{product.name} Image</span>';
  const replacement = `{product.image && product.image !== 'placeholder.png' ? (
                  <img src={product.image.startsWith('http') ? product.image : \`/images/\${product.image}\`} alt={product.name} className="w-full h-full object-contain p-4 mix-blend-multiply" />
                ) : (
                  <span className="text-[#717b71] font-serif italic text-center px-4">{product.name} Image</span>
                )}`;
  if (content.includes(target)) {
    content = content.replace(target, replacement);
    fs.writeFileSync(filePath, content);
    console.log('Replaced in', file);
  }
});
