import type { MetadataRoute } from 'next';

import { SITE_DESCRIPTION, SITE_NAME } from '@/lib/constants';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_NAME,
    short_name: 'Marketlane',
    description: SITE_DESCRIPTION,
    start_url: '/',
    display: 'standalone',
    background_color: '#f8f9fc',
    theme_color: '#4f46e5',
    icons: [
      { src: '/images/pwa-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/images/pwa.png', sizes: '512x512', type: 'image/png' }
    ]
  };
}
