'use client';

import { useId, useMemo } from 'react';
import { Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import { Controller } from 'react-hook-form';

import { Form, SubmitButton, useZodForm } from '@/components/forms';
import { Button } from '@/components/ui/button';
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  createQuantitySchema,
  getMaxPurchaseQuantity,
  quantityDefaultValues
} from '@/lib/validations';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { handleAddToCart, handleRemoveFromCart } from '@/store/cart/actions';
import type { StoreProduct } from '@/types';

import { WishlistButton } from './wishlist-button';

type PurchaseFormProps = {
  product: StoreProduct;
};

/** Quantity + "Add To Bag" / "Remove From Bag" (the quantity limits depend on the stock). */
export function PurchaseForm({ product }: PurchaseFormProps) {
  const dispatch = useAppDispatch();
  const quantityId = useId();
  const itemInCart = useAppSelector(state =>
    state.cart.cartItems.some(item => item._id === product._id)
  );

  const outOfStock = product.inventory <= 0;
  const max = getMaxPurchaseQuantity(product.inventory);
  const schema = useMemo(
    () => createQuantitySchema(product.inventory),
    [product.inventory]
  );
  const form = useZodForm(schema, { defaultValues: quantityDefaultValues });

  const onSubmit = () => {
    const added = dispatch(
      handleAddToCart(product, form.getValues('quantity'))
    );
    if (added) form.reset(quantityDefaultValues);
  };

  return (
    <Form form={form} onSubmit={onSubmit} className='space-y-6'>
      <Controller
        control={form.control}
        name='quantity'
        render={({ field, fieldState }) => {
          const current = Number(field.value) || 0;
          const set = (next: number) =>
            field.onChange(String(Math.min(max, Math.max(1, next))));

          return (
            <Field data-invalid={fieldState.invalid} className='max-w-xs'>
              <FieldLabel htmlFor={quantityId}>Quantity</FieldLabel>
              <div>
                <div className='inline-flex h-12 w-fit items-center rounded-xl border bg-card'>
                  <Button
                    type='button'
                    variant='ghost'
                    size='icon-lg'
                    className='rounded-r-none'
                    aria-label='Decrease quantity'
                    disabled={outOfStock || current <= 1}
                    onClick={() => set(current - 1)}
                  >
                    <Minus />
                  </Button>
                  <Input
                    {...field}
                    id={quantityId}
                    type='number'
                    inputMode='numeric'
                    min={1}
                    max={max}
                    step={1}
                    disabled={outOfStock}
                    placeholder='Product Quantity'
                    aria-invalid={fieldState.invalid}
                    aria-describedby={`${quantityId}-hint`}
                    className='h-11 w-16 [appearance:textfield] rounded-none border-0 bg-transparent px-0 text-center text-base font-medium shadow-none focus-visible:ring-0 dark:bg-transparent [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none'
                  />
                  <Button
                    type='button'
                    variant='ghost'
                    size='icon-lg'
                    className='rounded-l-none'
                    aria-label='Increase quantity'
                    disabled={outOfStock || current >= max}
                    onClick={() => set(current + 1)}
                  >
                    <Plus />
                  </Button>
                </div>
              </div>
              <FieldDescription id={`${quantityId}-hint`}>
                {outOfStock
                  ? 'This product is currently unavailable.'
                  : `Up to ${max} per order.`}
              </FieldDescription>
              {fieldState.error && <FieldError errors={[fieldState.error]} />}
            </Field>
          );
        }}
      />

      <div className='flex flex-wrap items-center gap-3'>
        {itemInCart ? (
          <Button
            type='button'
            size='lg'
            variant='outline'
            className='min-w-52 flex-1 sm:flex-none'
            disabled={outOfStock}
            onClick={() => dispatch(handleRemoveFromCart(product))}
          >
            <Trash2 /> Remove From Bag
          </Button>
        ) : (
          <SubmitButton
            size='lg'
            className='min-w-52 flex-1 sm:flex-none'
            disabled={product.quantity <= 0}
          >
            <ShoppingBag /> Add To Bag
          </SubmitButton>
        )}
        <WishlistButton
          variant='outline'
          productId={product._id}
          productName={product.name}
          liked={product.isLiked ?? false}
        />
      </div>
    </Form>
  );
}
