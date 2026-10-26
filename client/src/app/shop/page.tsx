import type { Metadata } from 'next';

import { ShopCatalog } from '@/components/store/shop-catalog';

export const metadata: Metadata = {
  title: 'Shop',
  description:
    'Browse all products. Filter by price and rating and sort to find your next favorite.'
};

export default function ShopPage() {
  return <ShopCatalog />;
}
