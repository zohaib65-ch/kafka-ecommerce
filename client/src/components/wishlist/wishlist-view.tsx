'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { HeartOff, X } from 'lucide-react';

import { SubPage } from '@/components/dashboard/sub-page';
import { EmptyState } from '@/components/shared/empty-state';
import { ListSkeleton } from '@/components/shared/loading';
import { ProductImage } from '@/components/shared/product-image';
import { Button } from '@/components/ui/button';
import { formatDate, formatPrice } from '@/lib/format';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchWishlist, updateWishlist } from '@/store/wishlist/actions';

export function WishlistView() {
  const dispatch = useAppDispatch();
  const wishlist = useAppSelector(state => state.wishlist.wishlist);
  const isLoading = useAppSelector(state => state.wishlist.isLoading);

  useEffect(() => {
    dispatch(fetchWishlist());
  }, [dispatch]);

  // Items whose product has been deleted cannot be shown (or removed from here).
  const items = wishlist.filter(item => item.product);

  return (
    <SubPage
      title='Your Wishlist'
      description='Products you have saved for later.'
    >
      {items.length > 0 ? (
        <ul
          aria-busy={isLoading}
          className='grid gap-4 sm:grid-cols-2 xl:grid-cols-3'
        >
          {items.map(item => {
            const product = item.product!;
            return (
              <li
                key={item._id}
                className='group relative flex flex-col overflow-hidden rounded-2xl border bg-card transition-shadow hover:shadow-soft'
              >
                <Link
                  href={`/product/${product.slug}`}
                  className='flex flex-1 flex-col focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none'
                >
                  <ProductImage
                    product={product}
                    sizes='(min-width: 1280px) 22vw, (min-width: 640px) 40vw, 90vw'
                    className='aspect-[4/3]'
                    imageClassName='transition-transform duration-500 group-hover:scale-105'
                  />
                  <span className='flex flex-1 flex-col gap-1 p-4'>
                    <span className='line-clamp-2 leading-snug font-medium'>
                      {product.name}
                    </span>
                    <span className='font-semibold text-primary'>
                      {formatPrice(product.price)}
                    </span>
                    <span className='mt-auto pt-2 text-xs text-muted-foreground'>
                      {item.created
                        ? `Wishlist added on ${formatDate(item.created)}`
                        : 'Saved to your wishlist'}
                    </span>
                  </span>
                </Link>
                <Button
                  variant='secondary'
                  size='icon-sm'
                  className='absolute top-3 right-3 rounded-full shadow-sm'
                  aria-label={`Remove ${product.name} from your wishlist`}
                  onClick={() =>
                    product._id &&
                    dispatch(updateWishlist(!item.isLiked, product._id))
                  }
                >
                  <X />
                </Button>
              </li>
            );
          })}
        </ul>
      ) : isLoading ? (
        <ListSkeleton rows={3} />
      ) : (
        <EmptyState
          icon={HeartOff}
          message='You have no items in your wishlist yet.'
          description='Tap the heart on any product to save it here.'
          action={
            <Button asChild>
              <Link href='/shop'>Browse the shop</Link>
            </Button>
          }
        />
      )}
    </SubPage>
  );
}
