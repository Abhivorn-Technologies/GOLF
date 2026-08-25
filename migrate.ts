import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import { ALL_PRODUCTS } from './src/data/products';
import Product from './src/models/Product';

dotenv.config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

async function migrate() {
  try {
    await mongoose.connect(MONGODB_URI as string);
    console.log('Connected to MongoDB');

    let migratedCount = 0;

    for (const p of ALL_PRODUCTS) {
      // Check if product already exists to avoid duplicates during retries
      const existing = await Product.findOne({ title: p.name });
      if (existing) {
        console.log(`Skipping ${p.name} (already exists)`);
        continue;
      }

      const priceStr = p.price.replace(/[^\d.]/g, '');
      const priceNum = parseFloat(priceStr);

      const newProduct = new Product({
        title: p.name,
        description: p.description || `${p.name} - Premium ${p.category} from ${p.brand}`,
        price: isNaN(priceNum) ? 0 : priceNum,
        images: [p.image],
        category: p.category,
        brand: p.brand,
        gender: p.gender,
        style: p.style,
        type: p.type,
        loft: p.loft,
        size: p.size,
        features: p.features || [],
        inStock: true,
        stockCount: 10,
        isFeatured: false
      });

      await newProduct.save();
      console.log(`Migrated: ${p.name}`);
      migratedCount++;
    }

    console.log(`Successfully migrated ${migratedCount} products to MongoDB!`);
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

migrate();
