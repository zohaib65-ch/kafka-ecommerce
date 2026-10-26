'use client';

import { useState } from 'react';
import Image from 'next/image';

import { productFallbackImage } from '@/lib/product-images';
import { cn } from '@/lib/utils';

type ProductImageSource = {
  _id?: string;
  name?: string;
  slug?: string;
  imageUrl?: string | null;
  category?: { name?: string } | null;
};

type ProductImageProps = {
  product: ProductImageSource;
  /** `sizes` attribute for responsive loading, e.g. '(min-width: 1024px) 25vw, 50vw'. */
  sizes: string;
  priority?: boolean;
  /** Applied to the wrapper; the wrapper is `relative` and square by default. */
  className?: string;
  imageClassName?: string;
};

// next/image can only optimize hosts allow-listed in next.config.ts (S3 + localhost); any other
// uploaded URL is served as-is instead of throwing.
const canOptimize = (src: string) => {
  if (src.startsWith('/')) return true;
  try {
    const { hostname } = new URL(src);
    return (
      hostname.endsWith('.amazonaws.com') ||
      hostname === 'localhost' ||
      hostname === '127.0.0.1'
    );
  } catch {
    return false;
  }
};

/**
 * Product photo with a graceful fallback: the uploaded image when there is one, otherwise a
 * photo picked from the product name (see lib/product-images.ts). Never renders a broken image.
 */
export function ProductImage({
  product,
  sizes,
  priority,
  className,
  imageClassName
}: ProductImageProps) {
  const [failedUrl, setFailedUrl] = useState<string | null>(null);
  const fallback = productFallbackImage(product);
  const uploaded = product.imageUrl || null;
  const useFallback = !uploaded || failedUrl === uploaded;
  const src = useFallback ? fallback.src : uploaded;
  const alt = product.name ? product.name : fallback.alt;

  return (
    <div
      className={cn(
        'relative aspect-square overflow-hidden bg-muted',
        className
      )}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        unoptimized={!canOptimize(src)}
        className={cn('object-cover', imageClassName)}
        onError={() => {
          if (uploaded) setFailedUrl(uploaded);
        }}
      />
    </div>
  );
}
