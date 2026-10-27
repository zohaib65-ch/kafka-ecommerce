'use client';

import { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

type ListSearchProps = {
  /** Accessible name of the search field. */
  label: string;
  placeholder: string;
  /** Called with the trimmed text, debounced while typing and immediately on submit / clear. */
  onSearch: (value: string) => void;
  debounceMs?: number;
  className?: string;
};

/** Search field for the dashboard lists (users, merchants): one square input with its button attached. */
export function ListSearch({
  label,
  placeholder,
  onSearch,
  debounceMs = 500,
  className
}: ListSearchProps) {
  const [value, setValue] = useState('');
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  const run = (next: string) => {
    clearTimeout(timer.current);
    onSearch(next.trim());
  };

  const handleChange = (next: string) => {
    setValue(next);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => onSearch(next.trim()), debounceMs);
  };

  return (
    <form
      role='search'
      className={cn('flex items-stretch', className)}
      onSubmit={event => {
        event.preventDefault();
        run(value);
      }}
    >
      <div className='relative flex-1'>
        <Input
          type='text'
          name='search'
          aria-label={label}
          placeholder={placeholder}
          autoComplete='off'
          value={value}
          onChange={event => handleChange(event.target.value)}
          className='h-11 rounded-r-none border-foreground pr-10'
        />
        {value && (
          <button
            type='button'
            aria-label='Clear search'
            onClick={() => {
              setValue('');
              run('');
            }}
            className='absolute top-1/2 right-1 grid size-9 -translate-y-1/2 place-items-center text-muted-foreground hover:text-foreground'
          >
            <X className='size-4' />
          </button>
        )}
      </div>
      <Button type='submit' className='h-11 rounded-l-none'>
        Search
      </Button>
    </form>
  );
}
