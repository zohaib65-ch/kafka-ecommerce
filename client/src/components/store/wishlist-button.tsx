'use client';

import { useState } from 'react';
import { Heart } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAppDispatch } from '@/store/hooks';
import { updateWishlist } from '@/store/wishlist/actions';

type WishlistButtonProps = {
  productId: string;
  productName: string;
  liked?: boolean;
  className?: string;
  variant?: 'overlay' | 'outline';
};

/**
 * Heart toggle. Signed out visitors get the "Please login to wishlist a product" notice from
 * the thunk; signed in users like / unlike the product (the store keeps `isLiked` in sync).
 */
export function WishlistButton({
  productId,
  productName,
  liked = false,
  className,
  variant = 'overlay'
}: WishlistButtonProps) {
  const dispatch = useAppDispatch();
  const [pending, setPending] = useState(false);

  const handleClick = async (event: React.MouseEvent) => {
    // The button sits on top of a card link: never navigate.
    event.preventDefault();
    event.stopPropagation();
    setPending(true);
    try {
      await dispatch(updateWishlist(!liked, productId));
    } finally {
      setPending(false);
    }
  };

  return (
    <Button
      type='button'
      variant={variant === 'overlay' ? 'secondary' : 'outline'}
      size={variant === 'overlay' ? 'icon-sm' : 'icon-lg'}
      aria-pressed={liked}
      aria-label={
        liked
          ? `Remove ${productName} from your wishlist`
          : `Add ${productName} to your wishlist`
      }
      disabled={pending}
      onClick={handleClick}
      className={cn(
        'rounded-full',
        variant === 'overlay' &&
          'bg-background/90 shadow-soft backdrop-blur-sm hover:bg-background',
        className
      )}
    >
      <Heart
        className={cn(
          'transition-colors',
          liked && 'fill-destructive text-destructive'
        )}
      />
    </Button>
  );
}
