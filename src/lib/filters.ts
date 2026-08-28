import dbConnect from "@/lib/mongodb";
import Product from "@/models/Product";
import { ALL_PRODUCTS } from "@/data/products";

export async function getMegaMenuData() {
  let dbProducts: any[] = [];
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
      const brandStr = product.brand.trim();
      const existingKey = Object.keys(data.brands).find(k => k.toLowerCase() === brandStr.toLowerCase());
      const keyToUse = existingKey || brandStr;
      data.brands[keyToUse] = (data.brands[keyToUse] || 0) + 1;
    }
    
    if (product.gender) {
      if (!data.attributes['Gender']) data.attributes['Gender'] = {};
      const genderStr = product.gender.trim();
      const existingKey = Object.keys(data.attributes['Gender']).find(k => k.toLowerCase() === genderStr.toLowerCase());
      const keyToUse = existingKey || genderStr;
      data.attributes['Gender'][keyToUse] = (data.attributes['Gender'][keyToUse] || 0) + 1;
    }
    
    const staticAttrs = ['style', 'type', 'loft', 'size'];
    staticAttrs.forEach(attr => {
      if (product[attr]) {
        const capitalized = attr.charAt(0).toUpperCase() + attr.slice(1);
        if (!data.attributes[capitalized]) data.attributes[capitalized] = {};
        const values = typeof product[attr] === 'string' ? product[attr].split(',').map((v: string) => v.trim()) : [product[attr]];
        values.forEach((v: string) => {
          if(v) {
            const existingKey = Object.keys(data.attributes[capitalized]).find(k => k.toLowerCase() === v.toLowerCase());
            const keyToUse = existingKey || v;
            data.attributes[capitalized][keyToUse] = (data.attributes[capitalized][keyToUse] || 0) + 1;
          }
        });
      }
    });
    
    if (product.attributes && Array.isArray(product.attributes)) {
      product.attributes.forEach((attr: any) => {
        const attrKeyStr = attr.key.trim();
        const existingAttrKey = Object.keys(data.attributes).find(k => k.toLowerCase() === attrKeyStr.toLowerCase());
        const attrKeyToUse = existingAttrKey || attrKeyStr;
        
        if (!data.attributes[attrKeyToUse]) data.attributes[attrKeyToUse] = {};
        
        const values = typeof attr.value === 'string' ? attr.value.split(',').map((v: string) => v.trim()) : [attr.value];
        values.forEach((v: string) => {
           if(v) {
             const existingKey = Object.keys(data.attributes[attrKeyToUse]).find(k => k.toLowerCase() === v.toLowerCase());
             const keyToUse = existingKey || v;
             data.attributes[attrKeyToUse][keyToUse] = (data.attributes[attrKeyToUse][keyToUse] || 0) + 1;
           }
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
