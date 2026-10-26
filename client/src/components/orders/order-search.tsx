'use client';

import { useEffect, useRef, useState } from 'react';
import { Search } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type OrderSearchProps = {
  /** Called while typing (after `debounceMs`) and on submit with the current text. */
  onSearch: (value: string) => void;
  /** Called only when the form is submitted (Enter or the Search button). */
  onSubmit?: (value: string) => void;
  debounceMs?: number;
  placeholder?: string;
};

export function OrderSearch({
  onSearch,
  onSubmit,
  debounceMs = 0,
  placeholder = 'Type the complete order ID'
}: OrderSearchProps) {
  const [value, setValue] = useState('');
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  const handleChange = (next: string) => {
    setValue(next);
    clearTimeout(timer.current);
    if (debounceMs > 0) {
      timer.current = setTimeout(() => onSearch(next), debounceMs);
    } else {
      onSearch(next);
    }
  };

  return (
    <form
      role='search'
      className='flex items-center gap-2'
      onSubmit={event => {
        event.preventDefault();
        clearTimeout(timer.current);
        onSearch(value);
        onSubmit?.(value);
      }}
    >
      <div className='relative flex-1'>
        <Search
          className='pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground'
          aria-hidden='true'
        />
        <Input
          type='search'
          name='order'
          value={value}
          onChange={event => handleChange(event.target.value)}
          placeholder={placeholder}
          aria-label='Search orders by order ID'
          autoComplete='off'
          className='pl-9'
        />
      </div>
      <Button type='submit' variant='outline'>
        Search
      </Button>
    </form>
  );
}
