
import BrandsWeLove from "@/components/BrandsWeLove";
import FeaturedDeals from "@/components/FeaturedDeals";
import CategoriesGrid from "@/components/CategoriesGrid";
import NewArrivals from "@/components/NewArrivals";

import dbConnect from "@/lib/mongodb";
import Banner from "@/models/Banner";
import HeroCarousel from "@/components/HeroCarousel";

export const dynamic = 'force-dynamic';

export default async function Home() {
  let activeBanners = [];
  
  try {
    await dbConnect();
    const banners = await Banner.find({ isActive: true }).sort({ displayOrder: 1, createdAt: -1 }).lean();
    
    // Serialize objects before passing to Client Component
    activeBanners = banners.map(b => ({
      _id: b._id.toString(),
      title: b.title,
      subtitle: b.subtitle,
      imageUrl: b.imageUrl,
      linkUrl: b.linkUrl
    }));
  } catch (err) {
    console.error("Local DB connection failed, using default hero banner", err);
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      
      
      <main className="flex-grow">
        <HeroCarousel banners={activeBanners} />

        <BrandsWeLove />
        <FeaturedDeals />
        <CategoriesGrid />
        <NewArrivals />
      </main>

      
    </div>
  );
}
