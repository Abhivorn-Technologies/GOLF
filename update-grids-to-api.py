import os
import re

components_dir = 'src/components'
grids = ['BallsProductGrid.tsx', 'ClubsProductGrid.tsx', 'ShoesProductGrid.tsx', 'BagsProductGrid.tsx', 'ApparelProductGrid.tsx', 'AccessoriesProductGrid.tsx']

for grid in grids:
    path = os.path.join(components_dir, grid)
    if not os.path.exists(path):
        continue
    
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Extract category name
    category_match = re.search(r"getProductsByCategory\('(.+?)'\)", content)
    if not category_match:
        print(f"Could not find category in {grid}")
        continue
    category = category_match.group(1)

    # We need to replace everything from the start of the component to the return statement
    component_name = grid.replace('.tsx', '')
    
    # Imports
    content = content.replace("import { getProductsByCategory } from '@/data/products';", "import type { ProductType } from '@/data/products';\nimport { useState, useEffect } from 'react';")
    
    # The body
    body_pattern = r"export default function " + component_name + r"\(\) \{.*?(?=return \()"
    
    new_body = f"""export default function {component_name}() {{
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {{
    const fetchProducts = async () => {{
      setLoading(true);
      const params = new URLSearchParams(searchParams.toString());
      params.set('category', '{category}');
      
      try {{
        const res = await fetch('/api/products/public?' + params.toString());
        const json = await res.json();
        if (json.success) {{
          setProducts(json.data);
        }}
      }} catch (err) {{
        console.error(err);
      }} finally {{
        setLoading(false);
      }}
    }};
    fetchProducts();
  }}, [searchParams]);

  """
    
    content = re.sub(body_pattern, new_body, content, flags=re.DOTALL)
    
    # We should add a loading state in the JSX if needed, or just let it render empty array
    # In the return, it usually has <div className="grid..."> {products.length > 0 ? (products.map) : (No products)}
    # Let's add a loading overlay or just let it be empty momentarily.
    
    # Update products.map to correctly use product.id
    
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"Updated {grid}")
