'use client';

import { useId, useState } from 'react';
import { Star } from 'lucide-react';

import { cn } from '@/lib/utils';

type StarRatingProps = {
  /** 0-5, halves allowed. */
  value: number;
  size?: number;
  className?: string;
  /** Hide the accessible text, e.g. when a visible number is rendered next to the stars. */
  label?: string;
};

/** Read-only stars with half-star support. */
export function StarRating({
  value,
  size = 16,
  className,
  label
}: StarRatingProps) {
  const rating = Math.max(0, Math.min(5, value || 0));

  return (
    <span
      role='img'
      aria-label={label ?? `${rating} out of 5 stars`}
      className={cn('inline-flex items-center gap-0.5', className)}
    >
      {[0, 1, 2, 3, 4].map(index => {
        const fill = Math.max(0, Math.min(1, rating - index));
        return (
          <span
            key={index}
            className='relative inline-block'
            style={{ width: size, height: size }}
            aria-hidden='true'
          >
            <Star
              className='absolute inset-0 text-muted-foreground/35'
              style={{ width: size, height: size }}
            />
            <span
              className='absolute inset-0 overflow-hidden'
              style={{ width: `${fill * 100}%` }}
            >
              <Star
                className='fill-star text-star'
                style={{ width: size, height: size }}
              />
            </span>
          </span>
        );
      })}
    </span>
  );
}

type StarRatingInputProps = {
  value: number;
  onChange: (value: number) => void;
  onBlur?: () => void;
  size?: number;
  disabled?: boolean;
  className?: string;
  invalid?: boolean;
  'aria-describedby'?: string;
};

/** Accessible 1-5 star picker (radio group semantics, arrow-key navigation). */
export function StarRatingInput({
  value,
  onChange,
  onBlur,
  size = 28,
  disabled,
  className,
  invalid,
  'aria-describedby': describedBy
}: StarRatingInputProps) {
  const name = useId();
  const [hovered, setHovered] = useState(0);
  const shown = hovered || value;

  return (
    <div
      role='radiogroup'
      aria-label='Rating'
      aria-invalid={invalid || undefined}
      aria-describedby={describedBy}
      className={cn('inline-flex items-center gap-1', className)}
      onMouseLeave={() => setHovered(0)}
    >
      {[1, 2, 3, 4, 5].map(star => (
        <label
          key={star}
          className={cn(
            'cursor-pointer rounded-md p-0.5 transition-transform focus-within:ring-3 focus-within:ring-ring/50 hover:scale-110',
            disabled && 'pointer-events-none opacity-50'
          )}
          onMouseEnter={() => setHovered(star)}
        >
          <input
            type='radio'
            name={name}
            value={star}
            checked={value === star}
            disabled={disabled}
            onChange={() => onChange(star)}
            onBlur={onBlur}
            className='sr-only'
            aria-label={`${star} star${star === 1 ? '' : 's'}`}
          />
          <Star
            aria-hidden='true'
            className={cn(
              'transition-colors',
              star <= shown ? 'fill-star text-star' : 'text-muted-foreground/40'
            )}
            style={{ width: size, height: size }}
          />
        </label>
      ))}
    </div>
  );
}
