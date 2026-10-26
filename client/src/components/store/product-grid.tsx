import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import type { StoreListProduct } from '@/types';

import { ProductCard } from './product-card';

const gridClass = 'grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 ';

type ProductGridProps = {
  products: StoreListProduct[];
  className?: string;
  /** Tailwind grid column override, e.g. for 4-up rows without a sidebar. */
  columnsClassName?: string;
};

export function ProductGrid({
  products,
  className,
  columnsClassName
}: ProductGridProps) {
  return (
    <ul className={cn(columnsClassName ?? gridClass, className)}>
      {products.map((product, index) => (
        <li key={product._id}>
          <ProductCard product={product} priority={index < 4} />
        </li>
      ))}
    </ul>
  );
}

export function ProductGridSkeleton({
  count = 8,
  className,
  columnsClassName
}: {
  count?: number;
  className?: string;
  columnsClassName?: string;
}) {
  return (
    <div
      className={cn(columnsClassName ?? gridClass, className)}
      aria-hidden='true'
    >
      {Array.from({ length: count }, (_, index) => (
        <div key={index} className='overflow-hidden rounded-2xl border bg-card'>
          <Skeleton className='aspect-square w-full rounded-none' />
          <div className='space-y-2 p-4'>
            <Skeleton className='h-3 w-1/3' />
            <Skeleton className='h-4 w-4/5' />
            <Skeleton className='h-3 w-full' />
            <Skeleton className='mt-3 h-5 w-1/4' />
          </div>
        </div>
      ))}
    </div>
  );
}
