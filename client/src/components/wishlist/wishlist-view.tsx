'use client';

import { useEffect } from 'react';
import Link from 'next/link';

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
          className='grid grid-cols-2 gap-x-5 gap-y-10 lg:grid-cols-3'
        >
          {items.map(item => {
            const product = item.product!;
            return (
              <li key={item._id} className='group flex flex-col'>
                <Link
                  href={`/product/${product.slug}`}
                  className='flex flex-1 flex-col'
                >
                  <ProductImage
                    product={product}
                    sizes='(min-width: 1024px) 24vw, 45vw'
                    className='border'
                    imageClassName='transition-transform duration-500 group-hover:scale-105'
                  />
                  <span className='mt-3 line-clamp-2 leading-snug font-semibold group-hover:underline'>
                    {product.name}
                  </span>
                  <span className='tabular mt-1 font-heading text-2xl leading-none font-semibold'>
                    {formatPrice(product.price)}
                  </span>
                  <span className='meta mt-2'>
                    {item.created
                      ? `Added ${formatDate(item.created)}`
                      : 'Saved to your wishlist'}
                  </span>
                </Link>
                <Button
                  variant='link'
                  size='sm'
                  className='mt-2 h-auto self-start px-0 py-1 text-muted-foreground hover:text-destructive'
                  aria-label={`Remove ${product.name} from your wishlist`}
                  onClick={() =>
                    product._id &&
                    dispatch(updateWishlist(!item.isLiked, product._id))
                  }
                >
                  Remove
                </Button>
              </li>
            );
          })}
        </ul>
      ) : isLoading ? (
        <ListSkeleton rows={3} />
      ) : (
        <EmptyState
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
