'use client';

import { useId, useState } from 'react';
import { RotateCcw } from 'lucide-react';

import { StarRating } from '@/components/shared/star-rating';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
import { formatPrice } from '@/lib/format';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { filterProducts, setAdvancedFilters } from '@/store/product/actions';

export const PRICE_MIN = 1;
export const PRICE_MAX = 5000;
const DEFAULT_PRICE: [number, number] = [1, 2500];

// "n stars and up" (the API matches `averageRating >= rating`); 0 means any rating.
const ratingOptions = [
  { value: 0, label: 'Any rating', suffix: '' },
  { value: 5, label: '5 stars', suffix: '' },
  { value: 4, label: '4 stars & up', suffix: '& up' },
  { value: 3, label: '3 stars & up', suffix: '& up' },
  { value: 2, label: '2 stars & up', suffix: '& up' },
  { value: 1, label: '1 star & up', suffix: '& up' }
];

type ShopFiltersProps = {
  /** Called after a filter change was dispatched (e.g. to close the mobile drawer). */
  onApplied?: () => void;
};

/** Price range + rating filters of the shop. The Redux `advancedFilters` are the source of truth. */
export function ShopFilters({ onApplied }: ShopFiltersProps) {
  const dispatch = useAppDispatch();
  const groupId = useId();
  const { min, max, rating } = useAppSelector(
    state => state.product.advancedFilters
  );
  // While dragging, the thumbs follow this draft; the products are fetched when the drag ends.
  const [draft, setDraft] = useState<[number, number] | null>(null);

  const price: [number, number] = draft ?? [min, max];
  const isDefault =
    min === DEFAULT_PRICE[0] && max === DEFAULT_PRICE[1] && rating === 0;

  const reset = () => {
    dispatch(
      setAdvancedFilters({
        min: DEFAULT_PRICE[0],
        max: DEFAULT_PRICE[1],
        rating: 0
      })
    );
    // Reload the current category / brand from the first page with the default filters.
    dispatch(filterProducts('pagination', 1));
    onApplied?.();
  };

  return (
    <div className='space-y-8'>
      <section aria-labelledby={`${groupId}-price`}>
        <h2 id={`${groupId}-price`} className='text-sm font-semibold'>
          Price
        </h2>
        <div className='mt-3 flex items-center justify-between text-sm text-muted-foreground'>
          <span className='rounded-md bg-muted px-2 py-1 font-medium text-foreground tabular-nums'>
            {formatPrice(price[0])}
          </span>
          <span aria-hidden='true'>to</span>
          <span className='rounded-md bg-muted px-2 py-1 font-medium text-foreground tabular-nums'>
            {formatPrice(price[1])}
          </span>
        </div>
        <Slider
          className='mt-5'
          min={PRICE_MIN}
          max={PRICE_MAX}
          step={1}
          minStepsBetweenThumbs={10}
          value={price}
          thumbLabels={['Minimum price', 'Maximum price']}
          onValueChange={value => setDraft([value[0], value[1]])}
          onValueCommit={value => {
            const next: [number, number] = [value[0], value[1]];
            setDraft(null);
            dispatch(filterProducts('price', next));
            onApplied?.();
          }}
        />
        <div className='mt-2 flex justify-between text-xs text-muted-foreground'>
          <span>{formatPrice(PRICE_MIN)}</span>
          <span>{formatPrice(PRICE_MAX)}</span>
        </div>
      </section>

      <section aria-labelledby={`${groupId}-rating`}>
        <h2 id={`${groupId}-rating`} className='text-sm font-semibold'>
          Rating
        </h2>
        <RadioGroup
          className='mt-3 gap-1'
          value={String(rating)}
          onValueChange={value => {
            dispatch(filterProducts('rating', Number(value)));
            onApplied?.();
          }}
          aria-labelledby={`${groupId}-rating`}
        >
          {ratingOptions.map(option => (
            <Label
              key={option.value}
              htmlFor={`${groupId}-rating-${option.value}`}
              className='flex min-h-10 cursor-pointer items-center gap-3 rounded-lg px-2 py-1.5 text-sm font-normal hover:bg-muted has-data-checked:bg-accent'
            >
              <RadioGroupItem
                id={`${groupId}-rating-${option.value}`}
                value={String(option.value)}
              />
              {option.value > 0 ? (
                <>
                  <span aria-hidden='true'>
                    <StarRating value={option.value} size={14} />
                  </span>
                  <span className='sr-only'>{option.label}</span>
                  <span aria-hidden='true' className='text-muted-foreground'>
                    {option.suffix}
                  </span>
                </>
              ) : (
                <span>{option.label}</span>
              )}
            </Label>
          ))}
        </RadioGroup>
      </section>

      <Button
        type='button'
        variant='outline'
        className='w-full'
        disabled={isDefault}
        onClick={reset}
      >
        <RotateCcw /> Reset filters
      </Button>
    </div>
  );
}
