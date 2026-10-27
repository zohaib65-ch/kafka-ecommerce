'use client';

import * as React from 'react';
import { cn } from 'cn';
import { Switch as SwitchPrimitive } from 'radix-ui';

function Switch({
  className,
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root
      data-slot='switch'
      className={cn(
        'peer relative inline-flex h-6 w-11 shrink-0 items-center rounded-sm border border-foreground p-[3px] transition-colors outline-none after:absolute after:-inset-x-2 after:-inset-y-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring aria-invalid:border-destructive data-checked:bg-brand data-unchecked:bg-transparent data-disabled:cursor-not-allowed data-disabled:opacity-50',
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot='switch-thumb'
        className='pointer-events-none block size-[1.1rem] bg-foreground transition-transform data-checked:translate-x-5 data-unchecked:translate-x-0'
      />
    </SwitchPrimitive.Root>
  );
}

export { Switch };
