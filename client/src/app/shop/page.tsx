import type { Metadata } from 'next';

import { ShopCatalog } from '@/components/store/shop-catalog';

export const metadata: Metadata = {
  title: 'Shop',
  description: 'Everything in the store. Filter by price and rating, then sort.'
};

export default function ShopPage() {
  return <ShopCatalog />;
}
