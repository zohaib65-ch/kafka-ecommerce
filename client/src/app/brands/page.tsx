import type { Metadata } from 'next';

import { BrandsGrid } from '@/components/store/brands-grid';

export const metadata: Metadata = {
  title: 'Brands',
  description: 'Every brand in the store, A to Z.'
};

export default function BrandsPage() {
  return <BrandsGrid />;
}
