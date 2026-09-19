
import BrandsWeLove from "@/app/(storefront)/_components/BrandsWeLove";
import FeaturedDeals from "@/app/(storefront)/_components/FeaturedDeals";
import CategoriesGrid from "@/app/(storefront)/_components/CategoriesGrid";
import NewArrivals from "@/app/(storefront)/_components/NewArrivals";
import BrandStorySection from "@/app/(storefront)/_components/BrandStorySection";

import dbConnect from "@/lib/mongodb";
import Banner from "@/models/Banner";
import Brand from "@/models/Brand";
import Product from "@/models/Product";
import HeroCarousel from "@/app/(storefront)/_components/HeroCarousel";

export const dynamic = 'force-dynamic';

async function fetchBanners() {
  const banners = await Banner.find({ isActive: true }).sort({ displayOrder: 1, createdAt: -1 }).lean();
  return banners.map((b: any) => ({
    _id: b._id.toString(),
    title: b.title,
    subtitle: b.subtitle,
    imageUrl: b.imageUrl,
    mobileImageUrl: b.mobileImageUrl,
    linkUrl: b.linkUrl,
    buttonText: b.buttonText,
    titleColor: b.titleColor,
    subtitleColor: b.subtitleColor,
    overlayOpacity: b.overlayOpacity,
    buttonColor: b.buttonColor,
    buttonTextColor: b.buttonTextColor,
    button2Text: b.button2Text,
    button2Url: b.button2Url,
    button2Color: b.button2Color,
    button2TextColor: b.button2TextColor,
    buttonSize: b.buttonSize,
    titlePosition: b.titlePosition,
    subtitlePosition: b.subtitlePosition,
    buttonPosition: b.buttonPosition,
    alignment: b.alignment
  }));
}

async function fetchBrands() {
  const brands = await Brand.find({ isActive: true }).sort({ displayOrder: 1, createdAt: -1 }).lean();
  return brands.map((b: any) => ({
    _id: b._id.toString(),
    name: b.name,
    imageUrl: b.imageUrl,
    linkUrl: b.linkUrl,
    categories: b.categories,
  }));
}

async function fetchTopDeals() {
  const products = await Product.find({ isTopDeal: true }).limit(6).lean();
  if (!products || products.length === 0) return [];
  return products.map((p: any) => {
    let discountBadge = 'SALE';
    if (p.compareAtPrice && p.compareAtPrice > p.price) {
      const discountPercent = Math.round(((p.compareAtPrice - p.price) / p.compareAtPrice) * 100);
      discountBadge = `${discountPercent}% OFF`;
    }
    return {
      id: p._id.toString(),
      slug: p.slug,
      name: p.title,
      brand: p.brand,
      image: p.images?.[0] || '',
      salePrice: `₹${p.price.toLocaleString('en-IN')}`,
      originalPrice: p.compareAtPrice ? `₹${p.compareAtPrice.toLocaleString('en-IN')}` : null,
      discount: discountBadge
    };
  });
}

async function fetchCategories() {
  const standardCategories = ['Clubs', 'Shoes', 'Apparel', 'Bags', 'Balls', 'Accessories'];
  
  const results = await Product.aggregate([
    { $match: { images: { $exists: true, $ne: [] } } },
    { $sort: { createdAt: -1 } },
    {
      $group: {
        _id: { $toLower: "$category" },
        image: { $first: { $arrayElemAt: ['$images', 0] } }
      }
    }
  ]);

  const imageMap = new Map<string, string>();
  results.forEach((r: any) => {
    if (r._id && r.image && r.image !== 'placeholder.png') {
      imageMap.set(r._id.toLowerCase(), r.image);
    }
  });

  return standardCategories.map((cat) => ({
    name: cat,
    image: imageMap.get(cat.toLowerCase()) || null
  }));
}

async function fetchNewArrivals() {
  let products = await Product.find({ isNewArrival: true, inStock: true }).sort({ createdAt: -1 }).limit(4).lean();
  
  // Fallback: if admin hasn't marked any products as new arrivals, just show the latest 4
  if (products.length === 0) {
    products = await Product.find({ inStock: true }).sort({ createdAt: -1 }).limit(4).lean();
  }
  return products.map((p: any) => ({
    id: p._id.toString(),
    slug: p.slug,
    brand: p.brand,
    name: p.title,
    price: `₹${p.price.toLocaleString('en-IN')}`,
    image: p.images?.[0] || 'placeholder.png'
  }));
}

let homeCache: any = null;
let homeCacheTime = 0;
const CACHE_TTL_MS = 30000; // 30 seconds

export default async function Home() {
  const now = Date.now();
  if (homeCache && (now - homeCacheTime < CACHE_TTL_MS)) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
        <main className="flex-grow">
          <HeroCarousel banners={homeCache.activeBanners} />
          <BrandsWeLove brands={homeCache.brands} />
          <FeaturedDeals deals={homeCache.topDeals} />
          <CategoriesGrid categories={homeCache.categories} />
          <NewArrivals products={homeCache.newArrivals} />
          <BrandStorySection />
        </main>
      </div>
    );
  }

  let activeBanners: any[] = [];
  let brands: any[] = [];
  let topDeals: any[] = [];
  let categories: any[] = [];
  let newArrivals: any[] = [];

  try {
    await dbConnect();
    
    // Fetch ALL data in parallel instead of sequentially
    [activeBanners, brands, topDeals, categories, newArrivals] = await Promise.all([
      fetchBanners(),
      fetchBrands(),
      fetchTopDeals(),
      fetchCategories(),
      fetchNewArrivals(),
    ]);

    homeCache = { activeBanners, brands, topDeals, categories, newArrivals };
    homeCacheTime = Date.now();
  } catch (err) {
    console.error("Homepage data fetch failed", err);
  }


  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      
      
      <main className="flex-grow">
        <HeroCarousel banners={activeBanners} />

        <BrandsWeLove brands={brands} />
        <FeaturedDeals deals={topDeals} />
        <CategoriesGrid categories={categories} />
        <NewArrivals products={newArrivals} />
        <BrandStorySection />
      </main>

      
    </div>
  );
}
