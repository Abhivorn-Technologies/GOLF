import dbConnect from "@/lib/mongodb";
import Product from "@/models/Product";
import { ALL_PRODUCTS } from "@/data/products";

let cachedMegaMenuData: Record<string, any> | null = null;
let lastCacheTime = 0;
const CACHE_TTL_MS = 15000; // 15 seconds cache

function formatBrandName(name: string): string {
  if (!name) return '';
  const trimmed = name.trim();
  const lower = trimmed.toLowerCase();
  if (lower === 'nike') return 'Nike';
  if (lower === 'footjoy') return 'FootJoy';
  if (lower === 'callaway') return 'Callaway';
  if (lower === 'titleist') return 'Titleist';
  if (lower === 'taylormade') return 'TaylorMade';
  if (lower === 'j.lindeberg' || lower === 'jlindeberg') return 'J.Lindeberg';
  if (lower === 'puma') return 'Puma';
  if (lower === 'ping') return 'Ping';
  if (lower === 'cobra') return 'Cobra';
  if (lower === 'srixon') return 'Srixon';
  if (lower === 'mizuno') return 'Mizuno';
  if (lower === 'under armour' || lower === 'underarmour') return 'Under Armour';
  return trimmed.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

function normalizeGender(g: string): string {
  if (!g) return '';
  const lower = g.trim().toLowerCase();
  if (lower.includes('women') || lower.includes('lady') || lower.includes('female')) {
    return "Women's";
  }
  if (lower.includes('men') || lower.includes('male')) {
    return "Men's";
  }
  if (lower.includes('unisex')) {
    return "Unisex";
  }
  if (lower.includes('junior') || lower.includes('kid') || lower.includes('boy') || lower.includes('girl')) {
    return "Juniors";
  }
  return g.trim();
}

export async function getMegaMenuData() {
  const now = Date.now();
  if (cachedMegaMenuData && (now - lastCacheTime < CACHE_TTL_MS)) {
    return cachedMegaMenuData;
  }

  let dbProducts: any[] = [];
  try {
    const fetchPromise = (async () => {
      await dbConnect();
      return await Product.find({}, 'category brand gender style type loft size attributes variants inStock').lean();
    })();

    const timeoutPromise = new Promise<any[]>((resolve) =>
      setTimeout(() => resolve([]), 5000)
    );

    dbProducts = await Promise.race([fetchPromise, timeoutPromise]);
  } catch (error) {
    console.error("Error fetching mega menu data from DB:", error);
  }

  // Combine DB products with static ALL_PRODUCTS if DB is empty
  const products = (dbProducts && dbProducts.length > 0) ? dbProducts : (ALL_PRODUCTS as any[]);
  
  const categories = ['Clubs', 'Shoes', 'Apparel', 'Bags', 'Balls', 'Accessories'];
  
  const megaMenuData: Record<string, { brands: Record<string, number>, attributes: Record<string, Record<string, number>> }> = {};
  
  categories.forEach(cat => {
    megaMenuData[cat] = {
      brands: {},
      attributes: {}
    };
  });

  products.forEach((product: any) => {
    const rawCat = product.category ? String(product.category).trim().toLowerCase() : '';
    const catMatch = categories.find(c => c.toLowerCase() === rawCat);
    if (!catMatch) return;
    
    const data = megaMenuData[catMatch];
    
    // 1. Process Brand
    if (product.brand) {
      const brandStr = formatBrandName(String(product.brand));
      if (brandStr) {
        data.brands[brandStr] = (data.brands[brandStr] || 0) + 1;
      }
    }
    
    // 2. Process Gender (e.g. Men's, Women's, Unisex, Juniors)
    if (product.gender) {
      const gClean = normalizeGender(String(product.gender));
      if (gClean) {
        if (!data.attributes['Gender']) data.attributes['Gender'] = {};
        data.attributes['Gender'][gClean] = (data.attributes['Gender'][gClean] || 0) + 1;
      }
    }
    
    // 3. Process Size (from product.size string AND product.variants array)
    if (product.size) {
      if (!data.attributes['Size']) data.attributes['Size'] = {};
      const rawSizes = typeof product.size === 'string' ? product.size.split(',').map((s: string) => s.trim()) : [product.size];
      rawSizes.forEach((s: string) => {
        if (s) {
          // Remove stock count colon if present (e.g. "M:5" -> "M")
          const cleanSize = s.includes(':') ? s.split(':')[0].trim() : s.trim();
          const sUpper = cleanSize.toUpperCase();
          if (sUpper) {
            data.attributes['Size'][sUpper] = (data.attributes['Size'][sUpper] || 0) + 1;
          }
        }
      });
    }

    if (product.variants && Array.isArray(product.variants)) {
      product.variants.forEach((v: any) => {
        if (v.size && typeof v.size === 'string' && v.size.trim()) {
          if (!data.attributes['Size']) data.attributes['Size'] = {};
          const cleanSize = v.size.trim().toUpperCase();
          data.attributes['Size'][cleanSize] = (data.attributes['Size'][cleanSize] || 0) + 1;
        }
      });
    }

    // 4. Process Other Static Attributes (style, type, loft)
    const staticAttrs = ['style', 'type', 'loft'];
    staticAttrs.forEach(attr => {
      if (product[attr]) {
        const capitalized = attr.charAt(0).toUpperCase() + attr.slice(1);
        if (!data.attributes[capitalized]) data.attributes[capitalized] = {};
        const values = typeof product[attr] === 'string' ? product[attr].split(',').map((v: string) => v.trim()) : [product[attr]];
        values.forEach((v: string) => {
          if (v) {
            const cleanVal = v.includes(':') ? v.split(':')[0].trim() : v.trim();
            if (cleanVal) {
              const formattedVal = cleanVal.charAt(0).toUpperCase() + cleanVal.slice(1);
              data.attributes[capitalized][formattedVal] = (data.attributes[capitalized][formattedVal] || 0) + 1;
            }
          }
        });
      }
    });
    
    // 5. Process Dynamic Attributes
    if (product.attributes && Array.isArray(product.attributes)) {
      product.attributes.forEach((attr: any) => {
        if (!attr || !attr.key) return;
        const attrKeyStr = attr.key.trim();
        const formattedKey = attrKeyStr.charAt(0).toUpperCase() + attrKeyStr.slice(1);
        
        if (!data.attributes[formattedKey]) data.attributes[formattedKey] = {};
        
        const values = typeof attr.value === 'string' ? attr.value.split(',').map((v: string) => v.trim()) : [attr.value];
        values.forEach((v: string) => {
          if (v) {
            const cleanVal = v.includes(':') ? v.split(':')[0].trim() : v.trim();
            if (cleanVal) {
              data.attributes[formattedKey][cleanVal] = (data.attributes[formattedKey][cleanVal] || 0) + 1;
            }
          }
        });
      });
    }
  });

  const serializedData: Record<string, any> = {};
  
  // Preferred attribute ordering so Gender & Size always appear prominently
  const attributePriority: Record<string, number> = {
    'Gender': 1,
    'Size': 2,
    'Type': 3,
    'Style': 4,
    'Loft': 5,
    'Color': 6,
    'Material': 7,
  };

  Object.keys(megaMenuData).forEach(cat => {
    serializedData[cat] = {
      brands: Object.entries(megaMenuData[cat].brands)
                .map(([name, count]) => ({ name, count }))
                .sort((a, b) => a.name.localeCompare(b.name)),
      attributes: {}
    };

    // Sort attribute groups by priority
    const sortedAttrKeys = Object.keys(megaMenuData[cat].attributes).sort((a, b) => {
      const pA = attributePriority[a] ?? 99;
      const pB = attributePriority[b] ?? 99;
      if (pA !== pB) return pA - pB;
      return a.localeCompare(b);
    });

    sortedAttrKeys.forEach(attrKey => {
      serializedData[cat].attributes[attrKey] = Object.entries(megaMenuData[cat].attributes[attrKey])
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => {
          // If gender, order Men's first, Women's second, Unisex third
          if (attrKey === 'Gender') {
            const gOrder: Record<string, number> = { "Men's": 1, "Women's": 2, "Unisex": 3, "Juniors": 4 };
            const oA = gOrder[a.name] ?? 10;
            const oB = gOrder[b.name] ?? 10;
            return oA - oB;
          }
          // If size, sort standard sizes (XS, S, M, L, XL, XXL)
          if (attrKey === 'Size') {
            const sOrder: Record<string, number> = { 'XS': 1, 'S': 2, 'M': 3, 'L': 4, 'XL': 5, '2XL': 6, 'XXL': 7, '3XL': 8 };
            const oA = sOrder[a.name.toUpperCase()] ?? 100;
            const oB = sOrder[b.name.toUpperCase()] ?? 100;
            if (oA !== oB) return oA - oB;
          }
          return a.name.localeCompare(b.name);
        });
    });
  });

  cachedMegaMenuData = serializedData;
  lastCacheTime = now;
  return serializedData;
}
