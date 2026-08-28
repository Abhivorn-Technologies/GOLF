import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'http://localhost:3000'; // Replace with production URL when deploying

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/admin/'], // Protect admin routes from being crawled
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
