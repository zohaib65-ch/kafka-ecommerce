import type { Metadata } from 'next';

import { BrandsGrid } from '@/components/store/brands-grid';

export const metadata: Metadata = {
  title: 'Brands',
  description: 'Shop by brand: explore products from every brand in the store.'
};

export default function BrandsPage() {
  return <BrandsGrid />;
}
