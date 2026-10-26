import type { Metadata } from 'next';

import { ProductDetail } from '@/components/store/product-detail';
import { API_URL, SITE_NAME } from '@/lib/constants';
import { productFallbackImage } from '@/lib/product-images';
import { decodeSlug } from '@/components/store/slug';

type PageProps = { params: Promise<{ slug: string }> };

type MetaProduct = {
  _id?: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
};

// Best effort: the page itself loads the product in the browser, so a slow or unreachable API
// only costs us a generic title.
async function getProduct(slug: string): Promise<MetaProduct | null> {
  if (!API_URL) return null;

  try {
    const response = await fetch(
      `${API_URL}/product/item/${encodeURIComponent(slug)}`,
      {
        signal: AbortSignal.timeout(2500),
        next: { revalidate: 60 }
      }
    );
    if (!response.ok) return null;
    const data = (await response.json()) as { product?: MetaProduct };
    return data.product ?? null;
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params
}: PageProps): Promise<Metadata> {
  const { slug: rawSlug } = await params;
  const slug = decodeSlug(rawSlug);
  const product = await getProduct(slug);

  if (!product) {
    return {
      title: 'Product',
      description: `Shop this product at ${SITE_NAME}.`
    };
  }

  const image = product.imageUrl || productFallbackImage(product).src;

  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      type: 'website',
      images: [{ url: image, alt: product.name }]
    },
    twitter: {
      card: 'summary_large_image',
      title: product.name,
      images: [image]
    }
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  return <ProductDetail slug={decodeSlug(slug)} />;
}
