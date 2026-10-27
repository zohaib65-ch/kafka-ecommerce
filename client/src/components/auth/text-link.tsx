import Link from 'next/link';

import { cn } from '@/lib/utils';

/** Inline link for form footers: ink text, orange underline, orange fill on hover. */
export function TextLink({
  className,
  ...props
}: React.ComponentProps<typeof Link>) {
  return (
    <Link
      className={cn(
        'font-semibold text-foreground underline decoration-brand decoration-2 underline-offset-4 transition-colors hover:bg-brand hover:text-brand-foreground',
        className
      )}
      {...props}
    />
  );
}
