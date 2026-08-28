import { MetadataRoute } from 'next';
import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'http://localhost:3000'; // Replace with production URL when deploying
  
  // Connect to DB to fetch all product slugs
  await dbConnect();
  const products = await Product.find({ slug: { $exists: true } }).select('slug updatedAt').lean() as any[];

  // Base routes
  const routes = [
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

  // Product routes
  const productRoutes = products.map((product) => ({
    url: `${baseUrl}/product/${product.slug}`,
    lastModified: product.updatedAt || new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  return [...routes, ...productRoutes];
}
