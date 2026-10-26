import type { Metadata } from 'next';

import { ShopCatalog } from '@/components/store/shop-catalog';
import { decodeSlug } from '@/components/store/slug';

type PageProps = { params: Promise<{ slug: string }> };

const prettify = (slug: string) =>
  slug
    .split('-')
    .filter(Boolean)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

export async function generateMetadata({
  params
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  return { title: `${prettify(decodeSlug(slug))} products` };
}

export default async function BrandShopPage({ params }: PageProps) {
  const { slug } = await params;
  return <ShopCatalog scope='brand' slug={decodeSlug(slug)} />;
}
