import type { Metadata } from 'next';

import { BrandStrip } from '@/components/store/home/brand-strip';
import { CategoryGrid } from '@/components/store/home/category-grid';
import { HeroCarousel } from '@/components/store/home/hero-carousel';
import { NewArrivals } from '@/components/store/home/new-arrivals';
import { PromoBanners } from '@/components/store/home/promo-banners';
import { SellCta } from '@/components/store/home/sell-cta';
import { ValueProps } from '@/components/store/home/value-props';

export const metadata: Metadata = {
  // Uses the default title from the root layout.
  title: { absolute: 'Marketlane — Quality products, free shipping' }
};

export default function HomePage() {
  return (
    <>
      <HeroCarousel />
      <ValueProps />
      <CategoryGrid />
      <NewArrivals />
      <PromoBanners />
      <BrandStrip />
      <SellCta />
    </>
  );
}
