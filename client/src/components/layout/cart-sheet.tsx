'use client';

import Link from 'next/link';

import { ProductImage } from '@/components/shared/product-image';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle
} from '@/components/ui/sheet';
import { formatPrice } from '@/lib/format';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  handleCheckout,
  handleRemoveFromCart,
  handleShopping
} from '@/store/cart/actions';
import { toggleCart } from '@/store/navigation/actions';
import { placeOrder } from '@/store/order/actions';

export function CartSheet() {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector(state => state.navigation.isCartOpen);
  const cartItems = useAppSelector(state => state.cart.cartItems);
  const cartTotal = useAppSelector(state => state.cart.cartTotal);
  const authenticated = useAppSelector(
    state => state.authentication.authenticated
  );

  const close = () => dispatch(toggleCart());

  return (
    <Sheet open={isOpen} onOpenChange={() => close()}>
      <SheetContent
        side='right'
        className='flex w-full flex-col gap-0 p-0 sm:max-w-md'
      >
        <SheetHeader className='border-b border-foreground p-5 pr-14'>
          <SheetTitle className='font-heading text-3xl leading-none font-semibold uppercase'>
            Your bag{' '}
            {cartItems.length > 0 && (
              <span className='text-muted-foreground'>
                ({cartItems.length})
              </span>
            )}
          </SheetTitle>
          <SheetDescription className='sr-only'>
            Review the items in your shopping bag and check out.
          </SheetDescription>
        </SheetHeader>

        {cartItems.length > 0 ? (
          <>
            <ScrollArea className='min-h-0 flex-1'>
              <ul className='divide-y'>
                {cartItems.map(item => (
                  <li key={item._id} className='flex gap-4 p-5'>
                    <Link
                      href={`/product/${item.slug}`}
                      onClick={close}
                      className='shrink-0'
                      aria-label={`View ${item.name}`}
                    >
                      <ProductImage
                        product={item}
                        sizes='88px'
                        className='size-22 border'
                      />
                    </Link>
                    <div className='flex min-w-0 flex-1 flex-col'>
                      <Link
                        href={`/product/${item.slug}`}
                        onClick={close}
                        className='line-clamp-2 leading-snug font-semibold hover:underline'
                      >
                        {item.name}
                      </Link>
                      <p className='mt-1 text-sm text-muted-foreground'>
                        Qty {item.quantity}
                      </p>
                      <div className='mt-auto flex items-end justify-between pt-2'>
                        <p className='tabular font-semibold'>
                          {formatPrice(item.totalPrice)}
                        </p>
                        <button
                          type='button'
                          className='text-sm text-muted-foreground underline underline-offset-4 hover:text-destructive'
                          aria-label={`Remove ${item.name} from cart`}
                          onClick={() => dispatch(handleRemoveFromCart(item))}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </ScrollArea>

            <SheetFooter className='gap-4 border-t border-foreground p-5'>
              <dl className='space-y-1.5 text-sm'>
                <div className='flex justify-between'>
                  <dt className='text-muted-foreground'>Shipping</dt>
                  <dd className='font-semibold'>Free</dd>
                </div>
                <div className='flex items-baseline justify-between border-t pt-3'>
                  <dt className='font-heading text-xl font-semibold uppercase'>
                    Total
                  </dt>
                  <dd className='tabular font-heading text-2xl font-semibold'>
                    {formatPrice(cartTotal)}
                  </dd>
                </div>
              </dl>
              {authenticated ? (
                <Button size='lg' onClick={() => dispatch(placeOrder())}>
                  Place Order
                </Button>
              ) : (
                <Button size='lg' onClick={() => dispatch(handleCheckout())}>
                  Proceed To Checkout
                </Button>
              )}
              <Button
                variant='outline'
                onClick={() => dispatch(handleShopping())}
              >
                Continue shopping
              </Button>
            </SheetFooter>
          </>
        ) : (
          <div className='flex flex-1 flex-col justify-center gap-5 p-8'>
            <p className='font-heading text-4xl leading-none font-semibold uppercase'>
              Your shopping cart is empty
            </p>
            <p className='max-w-xs text-muted-foreground'>
              Nothing here yet. Browse the shop and add what you like.
            </p>
            <Button
              size='lg'
              className='self-start'
              onClick={() => dispatch(handleShopping())}
            >
              Start shopping
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
