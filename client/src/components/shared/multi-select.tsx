'use client';

import { useState } from 'react';
import { Check, ChevronsUpDown, X } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import type { SelectOption } from '@/lib/select';

type MultiSelectProps = {
  id?: string;
  options: SelectOption[];
  value: SelectOption[];
  onChange: (value: SelectOption[]) => void;
  onBlur?: () => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  disabled?: boolean;
  invalid?: boolean;
  className?: string;
  'aria-describedby'?: string;
};

/** Searchable multiple choice select (replaces react-select with `isMulti`). */
export function MultiSelect({
  id,
  options,
  value,
  onChange,
  onBlur,
  placeholder = 'Select options',
  searchPlaceholder = 'Search…',
  emptyText = 'No options found.',
  disabled,
  invalid,
  className,
  'aria-describedby': describedBy
}: MultiSelectProps) {
  const [open, setOpen] = useState(false);
  const selected = new Set(value.map(option => String(option.value)));

  const toggle = (option: SelectOption) => {
    const key = String(option.value);
    onChange(
      selected.has(key)
        ? value.filter(item => String(item.value) !== key)
        : [...value, option]
    );
  };

  return (
    <Popover
      open={open}
      onOpenChange={next => {
        setOpen(next);
        if (!next) onBlur?.();
      }}
    >
      <PopoverTrigger asChild>
        <Button
          id={id}
          type='button'
          variant='outline'
          role='combobox'
          aria-expanded={open}
          aria-invalid={invalid || undefined}
          aria-describedby={describedBy}
          disabled={disabled}
          className={cn(
            'h-auto min-h-10 w-full justify-between bg-card px-3 py-1.5 font-normal',
            className
          )}
        >
          <span className='flex flex-wrap items-center gap-1'>
            {value.length === 0 && (
              <span className='text-muted-foreground'>{placeholder}</span>
            )}
            {value.map(option => (
              <Badge
                key={String(option.value)}
                variant='secondary'
                className='gap-1 pr-1'
              >
                {option.label}
                <span
                  role='button'
                  tabIndex={0}
                  aria-label={`Remove ${option.label}`}
                  className='rounded-full p-0.5 hover:bg-foreground/10'
                  onClick={event => {
                    event.stopPropagation();
                    toggle(option);
                  }}
                  onKeyDown={event => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault();
                      event.stopPropagation();
                      toggle(option);
                    }
                  }}
                >
                  <X className='size-3' />
                </span>
              </Badge>
            ))}
          </span>
          <ChevronsUpDown className='size-4 shrink-0 text-muted-foreground' />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className='w-(--radix-popover-trigger-width) p-0'
        align='start'
      >
        <Command>
          <CommandInput placeholder={searchPlaceholder} />
          <CommandList>
            <CommandEmpty>{emptyText}</CommandEmpty>
            <CommandGroup>
              {options.map(option => {
                const isSelected = selected.has(String(option.value));
                return (
                  <CommandItem
                    key={String(option.value)}
                    // cmdk needs a unique value per item: labels can repeat (e.g. products with the same name).
                    value={`${option.label} ${option.value}`}
                    onSelect={() => toggle(option)}
                  >
                    <Check
                      className={cn(
                        'size-4',
                        isSelected ? 'opacity-100' : 'opacity-0'
                      )}
                    />
                    {option.label}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
