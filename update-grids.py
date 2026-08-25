import os
import re

dir_path = 'src/components'
files = [f for f in os.listdir(dir_path) if f.endswith('ProductGrid.tsx') and f != 'ClubsProductGrid.tsx']

for file in files:
    filepath = os.path.join(dir_path, file)
    with open(filepath, 'r') as f:
        content = f.read()
        
    if 'minPriceParam' not in content:
        # 1. Insert params before allProducts
        content = re.sub(
            r"(const allProducts\s*=\s*getProductsByCategory\([^)]+\);)",
            r"const minPriceParam = searchParams.get('minPrice');\n  const maxPriceParam = searchParams.get('maxPrice');\n\n  \1",
            content
        )
        
        # 2. Insert logic before return in the filter function
        # The filter function usually looks like:
        # return somethingMatch && somethingElseMatch;
        # });
        
        # We find the `return ...;` right before `  });`
        match = re.search(r'(return\s+[^;]+;\s*)\}\);', content)
        if match:
            existing_return = match.group(1).strip()
            # replace "return x && y;" with "return x && y && priceMatch;"
            new_return = existing_return.replace(';', ' && priceMatch;')
            
            logic = """
    let priceMatch = true;
    if (minPriceParam || maxPriceParam) {
      const numericPrice = parseFloat(product.price.replace(/[^\\d.]/g, ''));
      if (!isNaN(numericPrice)) {
        if (minPriceParam && numericPrice < parseFloat(minPriceParam)) priceMatch = false;
        if (maxPriceParam && numericPrice > parseFloat(maxPriceParam)) priceMatch = false;
      }
    }

    """ + new_return + "\n  "
            
            content = content[:match.start()] + logic + "});" + content[match.end():]
            
            with open(filepath, 'w') as f:
                f.write(content)
            print(f"Updated {file}")
        else:
            print(f"Could not find return statement in {file}")
