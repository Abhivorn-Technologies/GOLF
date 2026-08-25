require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

// Need to match src/models/Product schema
const productSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  compareAtPrice: Number,
  images: [String],
  category: String,
  brand: String,
  inStock: Boolean,
  stockCount: Number,
  gender: String,
  style: String,
  type: String,
  loft: String,
  size: String,
  features: [String],
  attributes: [{ key: String, value: String }],
  isFeatured: Boolean,
  isTopDeal: Boolean
}, { timestamps: true });

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

const ALL_PRODUCTS = [
  // SHOES
  { id: 'shoes-1', name: 'Pro/SLX Carbon', brand: 'FOOTJOY', price: '₹19,990.00', image: 'Golf Shoes.png', category: 'shoes', style: 'Spikeless', gender: "Men's" },
  { id: 'shoes-2', name: 'Air Zoom Victory Tour 3', brand: 'NIKE', price: '₹19,999.00', image: 'Golf Shoes-1.png', category: 'shoes', style: 'Spiked', gender: "Men's" },
  { id: 'shoes-3', name: 'FootJoy Mens Tour Rival Golf Shoes', brand: 'FOOTJOY', price: '₹11,990.00', image: 'Golf Shoes.png', category: 'shoes', style: 'Spiked', gender: "Men's" },
  { id: 'shoes-4', name: 'Deviate Pure NITRO', brand: 'PUMA', price: '₹15,499.00', image: 'Golf Shoes-1.png', category: 'shoes', style: 'Spikeless', gender: "Women's" },

  // BAGS
  { id: 'bags-1', name: 'Players 4 Plus Stand Bag', brand: 'TITLEIST', gender: 'Mens', type: 'Stand Bags', price: '₹14,999.00', image: 'Players4Plus.png', category: 'bags' },
  { id: 'bags-2', name: 'C-130 Cart Bag', brand: 'TITLEIST', gender: 'Mens', type: 'Cart Bags', price: '₹19,999.00', image: 'C130.png', category: 'bags' },
  { id: 'bags-3', name: 'Last Bag Collegiate Travel Cover', brand: 'CLUB GLOVE', gender: 'Unisex', type: 'Travel Covers', price: '₹11,990.00', image: 'TravelCover.png', category: 'bags' },
  { id: 'bags-4', name: 'Moonlite Sunday Bag', brand: 'PING', gender: 'Mens', type: 'Sunday Bags', price: '₹8,999.00', image: 'Moonlite.png', category: 'bags' },

  // CLUBS
  { id: 'clubs-1', name: 'TSR2 Driver', brand: 'Titleist', gender: "Men's", loft: '9.0°', price: '₹49,990.00', image: 'Driver.png', category: 'clubs' },
  { id: 'clubs-2', name: 'Stealth 2 Plus Driver', brand: 'TaylorMade', gender: "Men's", loft: '10.5°', price: '₹52,999.00', image: 'Driver-1.png', category: 'clubs' },
  { id: 'clubs-3', name: 'Paradym Driver', brand: 'Callaway', gender: "Women's", loft: '12.0°', price: '₹54,990.00', image: 'Driver.png', category: 'clubs' },
  { id: 'clubs-4', name: 'G430 MAX Driver', brand: 'Ping', gender: "Men's", loft: '10.5°', price: '₹51,499.00', image: 'Driver-1.png', category: 'clubs' },
  { id: 'clubs-5', name: 'Aerojet Driver', brand: 'Cobra', gender: 'Juniors', loft: '10.5°', price: '₹41,990.00', image: 'Driver.png', category: 'clubs' },
  { id: 'clubs-6', name: 'TSR3 Driver', brand: 'Titleist', gender: "Men's", loft: '9.0°', price: '₹49,999.00', image: 'Driver-1.png', category: 'clubs' },

  // ACCESSORIES
  { id: 'acc-1', name: 'Pro V1 Golf Balls', brand: 'Titleist', type: 'Balls', price: '₹4,999.00', image: 'Balls.png', category: 'accessories' },
  { id: 'acc-2', name: 'Tour Authentic Glove', brand: 'Callaway', type: 'Gloves', price: '₹1,990.00', image: 'Glove.png', category: 'accessories' },

  // BALLS
  { id: 'balls-1', name: 'Pro V1 Golf Balls (Dozen)', brand: 'Titleist', price: '₹4,999.00', image: 'Balls.png', category: 'balls' },
  { id: 'balls-2', name: 'Chrome Soft Golf Balls', brand: 'Callaway', price: '₹4,299.00', image: 'Balls.png', category: 'balls' },
  { id: 'balls-3', name: 'TP5x Golf Balls', brand: 'TaylorMade', price: '₹4,499.00', image: 'Balls.png', category: 'balls' },
  { id: 'balls-4', name: 'Z-Star Golf Balls', brand: 'Srixon', price: '₹3,999.00', image: 'Balls.png', category: 'balls' },

  // APPAREL
  { id: 'app-1', name: 'Performance Polo', brand: 'Nike', gender: "Men's", size: 'M', category: 'apparel', price: '₹3,499.00', image: 'Polo.png' },
];

const parsePrice = (priceStr) => {
  return parseFloat(priceStr.replace(/[^0-9.-]+/g,""));
};

async function seed() {
  if (!process.env.MONGODB_URI) {
    console.error("Missing MONGODB_URI");
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGODB_URI);
  console.log("Connected to MongoDB.");

  let added = 0;
  for (const item of ALL_PRODUCTS) {
    // Check if it already exists
    const exists = await Product.findOne({ title: item.name });
    if (!exists) {
      const product = new Product({
        title: item.name,
        description: item.description || "Premium golf equipment designed for peak performance.",
        price: parsePrice(item.price),
        compareAtPrice: parsePrice(item.price) * 1.2, // mock a compare price
        brand: item.brand,
        images: [item.image],
        category: item.category,
        inStock: true,
        stockCount: 10,
        gender: item.gender,
        style: item.style,
        type: item.type,
        loft: item.loft,
        size: item.size,
        features: ["Premium Materials", "Tour Proven"],
        isFeatured: true
      });
      await product.save();
      console.log(`Added: ${item.name}`);
      added++;
    } else {
      console.log(`Skipped (already exists): ${item.name}`);
    }
  }

  console.log(`Seed complete. Added ${added} products.`);
  process.exit(0);
}

seed().catch(console.error);
