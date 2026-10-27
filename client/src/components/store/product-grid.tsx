import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import type { StoreListProduct } from '@/types';

import { ProductCard } from './product-card';

// Flat cells: the list draws the top and left rules, every cell its own right and bottom rule.
const gridClass = 'grid grid-cols-2 md:grid-cols-3';
const ruled = 'border-t border-l border-foreground';
const cellRule = 'border-r border-b border-foreground';

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
    <ul className={cn(columnsClassName ?? gridClass, ruled, className)}>
      {products.map((product, index) => (
        <li key={product._id} className={cellRule}>
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
      className={cn(columnsClassName ?? gridClass, ruled, className)}
      aria-hidden='true'
    >
      {Array.from({ length: count }, (_, index) => (
        <div key={index} className={cn(cellRule, 'p-3 sm:p-4')}>
          <Skeleton className='aspect-square w-full' />
          <div className='mt-3 space-y-2'>
            <Skeleton className='h-3 w-1/3' />
            <Skeleton className='h-4 w-4/5' />
            <Skeleton className='mt-3 h-6 w-1/4' />
          </div>
        </div>
      ))}
    </div>
  );
}
