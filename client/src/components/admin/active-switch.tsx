'use client';

import { useId } from 'react';

import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';

type ActiveSwitchProps = {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  label?: string;
  /** Explains what toggling does, e.g. "Disabling X will also disable all X products." */
  hint?: React.ReactNode;
  disabled?: boolean;
  className?: string;
};

/** The "Active?" switch: a plain labelled row under a hairline rule. Controlled: the page owns the value. */
export function ActiveSwitch({
  checked,
  onCheckedChange,
  label = 'Active?',
  hint,
  disabled,
  className
}: ActiveSwitchProps) {
  const id = useId();

  return (
    <div
      className={cn(
        'flex items-start justify-between gap-6 border-t py-4',
        className
      )}
    >
      <div className='space-y-1'>
        <label htmlFor={id} className='block font-semibold'>
          {label}
        </label>
        {hint && (
          <p id={`${id}-hint`} className='text-sm text-muted-foreground'>
            {hint}
          </p>
        )}
      </div>
      <Switch
        id={id}
        checked={checked}
        disabled={disabled}
        onCheckedChange={onCheckedChange}
        aria-describedby={hint ? `${id}-hint` : undefined}
      />
    </div>
  );
}
