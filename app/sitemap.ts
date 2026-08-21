import type { MetadataRoute } from 'next';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: 'https://waynez01.github.io', lastModified: new Date(), changeFrequency: 'weekly', priority: 1 }];
}
