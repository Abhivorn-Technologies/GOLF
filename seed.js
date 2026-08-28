require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

const sampleProducts = [
  {
    title: 'TaylorMade Stealth 3 Driver',
    slug: 'taylormade-stealth-3-driver',
    description: 'The ultimate driver for distance and forgiveness with a completely redesigned carbon face.',
    price: 49999.00,
    compareAtPrice: 54999.00,
    images: [],
    category: 'clubs',
    brand: 'TaylorMade',
    inStock: true,
    stockCount: 15,
    gender: 'Men\'s',
    type: 'Driver',
    loft: '10.5°, 9.0°',
    features: ['60X Carbon Twist Face', 'Nanotexture Cover', 'Asymmetric Inertia Generator'],
    attributes: [
      { key: 'Flex', value: 'Stiff, Regular' },
      { key: 'Hand', value: 'Right' }
    ],
    isFeatured: true,
    isTopDeal: false,
    isNewArrival: true
  },
  {
    title: 'Callaway Chrome Soft Golf Balls (Dozen)',
    slug: 'callaway-chrome-soft-balls',
    description: 'Better for everyone, from amateurs to major winners. Now with Precision Technology.',
    price: 4499.00,
    compareAtPrice: 4999.00,
    images: [],
    category: 'balls',
    brand: 'Callaway',
    inStock: true,
    stockCount: 50,
    type: 'Balls',
    features: ['Precision Technology', 'Hyper Elastic SoftFast Core', 'Tour Aero'],
    attributes: [
      { key: 'Color', value: 'White, Yellow' },
      { key: 'Compression', value: 'Medium' }
    ],
    isFeatured: false,
    isTopDeal: true,
    isNewArrival: false
  },
  {
    title: 'Titleist Players 4 Plus Stand Bag',
    slug: 'titleist-players-4-plus',
    description: 'A lighter, more comfortable way to play. Features a premium double strap and waterproof valuables pocket.',
    price: 21999.00,
    compareAtPrice: null,
    images: [],
    category: 'bags',
    brand: 'Titleist',
    inStock: true,
    stockCount: 8,
    type: 'Stand Bags',
    features: ['Premium double strap', 'Quick-access magnetic accessories pocket', '4-way top cuff'],
    attributes: [
      { key: 'Color', value: 'Black/Red, Navy, Charcoal' },
      { key: 'Weight', value: '1.95 kg' }
    ],
    isFeatured: true,
    isTopDeal: false,
    isNewArrival: true
  },
  {
    title: 'Nike Air Zoom Victory Tour 3',
    slug: 'nike-air-zoom-victory-tour-3',
    description: 'Unmatched comfort and incredible energy return. Premium leather and Zoom Air cushioning.',
    price: 18499.00,
    compareAtPrice: 19999.00,
    images: [],
    category: 'shoes',
    brand: 'Nike',
    inStock: true,
    stockCount: 20,
    gender: 'Men\'s',
    style: 'Spiked',
    size: '8, 9, 10, 11',
    features: ['Full-grain leather', 'Zoom Air unit', 'Tour-level traction'],
    attributes: [
      { key: 'Color', value: 'White, Black' },
      { key: 'Width', value: 'Standard, Wide' }
    ],
    isFeatured: false,
    isTopDeal: false,
    isNewArrival: true
  },
  {
    title: 'FootJoy Performance Golf Polo',
    slug: 'footjoy-performance-polo',
    description: 'ProDry fabrication provides superior moisture control that quickly wicks away moisture, keeping you dry and comfortable.',
    price: 5999.00,
    compareAtPrice: null,
    images: [],
    category: 'apparel',
    brand: 'FootJoy',
    inStock: true,
    stockCount: 35,
    gender: 'Men\'s',
    size: 'S, M, L, XL',
    features: ['Anti-Microbial Technology', 'Double Stitched Seams', 'ProDry Fabrication'],
    attributes: [
      { key: 'Color', value: 'Navy, White, Light Blue' },
      { key: 'Material', value: 'Polyester Blend' },
      { key: 'Fit', value: 'Athletic Fit' }
    ],
    isFeatured: false,
    isTopDeal: true,
    isNewArrival: false
  },
  {
    title: 'Scotty Cameron Super Select Newport 2 Putter',
    slug: 'scotty-cameron-newport-2',
    description: 'Milled from a solid block of 303 stainless steel with customizable sole weights for personalized performance.',
    price: 39999.00,
    compareAtPrice: null,
    images: [],
    category: 'clubs',
    brand: 'Titleist',
    inStock: true,
    stockCount: 5,
    type: 'Putter',
    gender: 'Men\'s',
    features: ['Dual-Milled Face Technology', 'I-Beam Plumbing Neck', 'Performance Weighting'],
    attributes: [
      { key: 'Length', value: '34", 35"' },
      { key: 'Hand', value: 'Right' },
      { key: 'Grip', value: 'Pistolini Plus' }
    ],
    isFeatured: true,
    isTopDeal: false,
    isNewArrival: true
  }
];

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  const ProductSchema = new mongoose.Schema({
    title: { type: String, required: true },
    slug: { type: String, unique: true, sparse: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    compareAtPrice: { type: Number },
    images: [{ type: String }],
    category: { type: String, required: true },
    brand: { type: String, required: true },
    inStock: { type: Boolean, default: true },
    stockCount: { type: Number, default: 0 },
    gender: { type: String },
    style: { type: String },
    type: { type: String },
    loft: { type: String },
    size: { type: String },
    features: [{ type: String }],
    attributes: [{
      key: { type: String },
      value: { type: String }
    }],
    isFeatured: { type: Boolean, default: false },
    isTopDeal: { type: Boolean, default: false },
    isNewArrival: { type: Boolean, default: false }
  }, { timestamps: true });
  
  const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);
  
  try {
    for (const p of sampleProducts) {
      await Product.findOneAndUpdate({ slug: p.slug }, p, { upsert: true, new: true });
    }
    console.log('Sample products seeded successfully!');
  } catch(e) {
    console.error('Error:', e);
  }
  process.exit(0);
});
