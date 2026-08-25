import dbConnect from "@/lib/mongodb";
import Product from "@/models/Product";
import { ALL_PRODUCTS } from "@/data/products";

export async function getMegaMenuData() {
  let dbProducts = [];
  try {
    await dbConnect();
    dbProducts = await Product.find({}).lean();
  } catch (error) {
    console.error("Error fetching mega menu data from DB:", error);
  }
    
  // Combine local mock data with any dynamic DB products to ensure base filters ALWAYS show up
  const products = [...ALL_PRODUCTS, ...dbProducts];
  
  const categories = ['Clubs', 'Shoes', 'Apparel', 'Bags', 'Balls', 'Accessories'];
  
  const megaMenuData: Record<string, { brands: Record<string, number>, attributes: Record<string, Record<string, number>> }> = {};
  
  categories.forEach(cat => {
    megaMenuData[cat] = {
      brands: {},
      attributes: {}
    };
  });

  products.forEach((product: any) => {
    const catMatch = categories.find(c => c.toLowerCase() === product.category?.toLowerCase());
    if (!catMatch) return;
    
    const data = megaMenuData[catMatch];
    
    if (product.brand) {
      data.brands[product.brand] = (data.brands[product.brand] || 0) + 1;
    }
    
    if (product.gender) {
      if (!data.attributes['Gender']) data.attributes['Gender'] = {};
      data.attributes['Gender'][product.gender] = (data.attributes['Gender'][product.gender] || 0) + 1;
    }
    
    const staticAttrs = ['style', 'type', 'loft', 'size'];
    staticAttrs.forEach(attr => {
      if (product[attr]) {
        const capitalized = attr.charAt(0).toUpperCase() + attr.slice(1);
        if (!data.attributes[capitalized]) data.attributes[capitalized] = {};
        const values = typeof product[attr] === 'string' ? product[attr].split(',').map((v: string) => v.trim()) : [product[attr]];
        values.forEach((v: string) => {
          if(v) data.attributes[capitalized][v] = (data.attributes[capitalized][v] || 0) + 1;
        });
      }
    });
    
    if (product.attributes && Array.isArray(product.attributes)) {
      product.attributes.forEach((attr: any) => {
        if (!data.attributes[attr.key]) data.attributes[attr.key] = {};
        const values = typeof attr.value === 'string' ? attr.value.split(',').map((v: string) => v.trim()) : [attr.value];
        values.forEach((v: string) => {
           if(v) data.attributes[attr.key][v] = (data.attributes[attr.key][v] || 0) + 1;
        });
      });
    }
  });

  const serializedData: Record<string, any> = {};
  Object.keys(megaMenuData).forEach(cat => {
    serializedData[cat] = {
      brands: Object.entries(megaMenuData[cat].brands)
                .map(([name, count]) => ({ name, count }))
                .sort((a, b) => a.name.localeCompare(b.name)),
      attributes: {}
    };
    Object.keys(megaMenuData[cat].attributes).forEach(attrKey => {
      serializedData[cat].attributes[attrKey] = Object.entries(megaMenuData[cat].attributes[attrKey])
                .map(([name, count]) => ({ name, count }))
                .sort((a, b) => a.name.localeCompare(b.name));
    });
  });

  require("fs").writeFileSync("debug.json", JSON.stringify(serializedData)); 
  return serializedData;
}
