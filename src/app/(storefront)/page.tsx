
import BrandsWeLove from "@/app/(storefront)/_components/BrandsWeLove";
import FeaturedDeals from "@/app/(storefront)/_components/FeaturedDeals";
import CategoriesGrid from "@/app/(storefront)/_components/CategoriesGrid";
import NewArrivals from "@/app/(storefront)/_components/NewArrivals";

import dbConnect from "@/lib/mongodb";
import Banner from "@/models/Banner";
import HeroCarousel from "@/app/(storefront)/_components/HeroCarousel";

export const dynamic = 'force-dynamic';

export default async function Home() {
  let activeBanners: any[] = [];
  
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
