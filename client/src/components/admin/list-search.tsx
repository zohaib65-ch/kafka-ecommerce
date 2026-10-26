'use client';

import { useEffect, useRef, useState } from 'react';
import { Search, X } from 'lucide-react';

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

/** Search field for the dashboard lists (users, merchants). */
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
      className={cn('flex items-center gap-2', className)}
      onSubmit={event => {
        event.preventDefault();
        run(value);
      }}
    >
      <div className='relative flex-1'>
        <Search
          className='pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground'
          aria-hidden='true'
        />
        <Input
          type='text'
          name='search'
          aria-label={label}
          placeholder={placeholder}
          autoComplete='off'
          value={value}
          onChange={event => handleChange(event.target.value)}
          className='pr-10 pl-9'
        />
        {value && (
          <button
            type='button'
            aria-label='Clear search'
            onClick={() => {
              setValue('');
              run('');
            }}
            className='absolute top-1/2 right-2 grid size-7 -translate-y-1/2 place-items-center rounded-full text-muted-foreground hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none'
          >
            <X className='size-4' />
          </button>
        )}
      </div>
      <Button
        type='submit'
        variant='secondary'
        className='hidden sm:inline-flex'
      >
        Search
      </Button>
    </form>
  );
}
