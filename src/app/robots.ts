import type { MetadataRoute } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://inkstudio.vercel.app';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/my-appointments/', '/profile', '/book'],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
