import { MetadataRoute } from 'next';
import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  
  const baseRoutes = [
    '',
    '/search',
    '/products',
    '/sale',
    '/category/clubs',
    '/category/shoes',
    '/category/apparel',
    '/category/bags',
    '/category/balls',
    '/category/accessories'
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  let productRoutes: MetadataRoute.Sitemap = [];

  try {
    await dbConnect();
    const products = await Product.find({ slug: { $exists: true } }).select('slug updatedAt').lean() as any[];
    
    productRoutes = products.map((product) => ({
      url: `${baseUrl}/product/${product.slug}`,
      lastModified: product.updatedAt || new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }));
  } catch (error) {
    console.error('Sitemap DB fetch fallback:', error);
  }

  return [...baseRoutes, ...productRoutes];
}
