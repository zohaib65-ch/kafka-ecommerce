'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Command as CommandPrimitive } from 'cmdk';
import { Search, X } from 'lucide-react';

import { HighlightMatch } from '@/components/shared/highlight';
import { ProductImage } from '@/components/shared/product-image';
import { formatPrice } from '@/lib/format';
import { cn } from '@/lib/utils';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  onSearch,
  onSuggestionsClearRequested,
  onSuggestionsFetchRequested
} from '@/store/navigation/actions';

const MIN_CHARS = 2;
const DEBOUNCE_MS = 250;

/** Header product search with live suggestions (keyboard accessible combobox). */
export function SearchBox({ className }: { className?: string }) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const value = useAppSelector(state => state.navigation.searchValue);
  const suggestions = useAppSelector(
    state => state.navigation.searchSuggestions
  );
  const [open, setOpen] = useState(false);
  const wrapper = useRef<HTMLDivElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  const handleChange = (text: string) => {
    dispatch(onSearch(text));
    clearTimeout(timer.current);

    if (text.trim().length >= MIN_CHARS) {
      setOpen(true);
      timer.current = setTimeout(() => {
        dispatch(onSuggestionsFetchRequested({ value: text }));
      }, DEBOUNCE_MS);
    } else {
      dispatch(onSuggestionsClearRequested());
    }
  };

  const reset = () => {
    clearTimeout(timer.current);
    dispatch(onSearch(''));
    dispatch(onSuggestionsClearRequested());
    setOpen(false);
  };

  const showList = open && suggestions.length > 0;

  return (
    <div
      ref={wrapper}
      className={cn('relative w-full', className)}
      onBlur={event => {
        if (!wrapper.current?.contains(event.relatedTarget)) setOpen(false);
      }}
    >
      <CommandPrimitive shouldFilter={false} loop label='Search products'>
        <div className='relative'>
          <Search
            className='pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground'
            aria-hidden='true'
          />
          <CommandPrimitive.Input
            value={value}
            onValueChange={handleChange}
            onFocus={() => setOpen(true)}
            placeholder='Search products'
            aria-label='Search products'
            className='h-10 w-full rounded-sm border border-input bg-transparent pr-9 pl-9 text-sm transition-colors outline-none placeholder:text-muted-foreground focus:border-foreground focus:ring-2 focus:ring-ring'
          />
          {value && (
            <button
              type='button'
              onClick={reset}
              aria-label='Clear search'
              className='absolute top-1/2 right-3 grid size-6 -translate-y-1/2 place-items-center rounded-full text-muted-foreground hover:text-foreground'
            >
              <X className='size-4' />
            </button>
          )}
        </div>

        {showList && (
          <CommandPrimitive.List className='absolute top-full right-0 left-0 z-50 mt-1 max-h-96 overflow-y-auto rounded-sm bg-popover p-1 text-popover-foreground ring-1 ring-foreground'>
            {suggestions.map(suggestion => (
              <CommandPrimitive.Item
                key={suggestion.slug}
                value={suggestion.slug}
                onSelect={() => {
                  router.push(`/product/${suggestion.slug}`);
                  reset();
                }}
                className='flex cursor-pointer items-center gap-3 rounded-sm p-2 data-[selected=true]:bg-accent'
              >
                <ProductImage
                  product={suggestion}
                  sizes='48px'
                  className='size-12 shrink-0'
                />
                <span className='min-w-0 flex-1'>
                  <span className='block truncate text-sm font-medium'>
                    <HighlightMatch text={suggestion.name} query={value} />
                  </span>
                  <span className='block text-xs text-muted-foreground'>
                    {formatPrice(suggestion.price)}
                  </span>
                </span>
              </CommandPrimitive.Item>
            ))}
          </CommandPrimitive.List>
        )}
      </CommandPrimitive>
    </div>
  );
}
