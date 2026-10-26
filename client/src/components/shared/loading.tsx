import { Spinner } from '@/components/ui/spinner';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

type LoaderProps = {
  label?: string;
  className?: string;
};

/** Centered spinner for a page or a large region that is loading. */
export function PageLoader({ label = 'Loading', className }: LoaderProps) {
  return (
    <div
      role='status'
      aria-live='polite'
      className={cn(
        'flex min-h-[40vh] flex-col items-center justify-center gap-3 text-muted-foreground',
        className
      )}
    >
      <Spinner className='size-7 text-primary' />
      <span className='text-sm'>{label}…</span>
    </div>
  );
}

/** Small spinner used inside buttons, cards and toolbars. */
export function InlineLoader({ label = 'Loading', className }: LoaderProps) {
  return (
    <div
      role='status'
      aria-live='polite'
      className={cn(
        'flex items-center justify-center gap-2 py-8 text-sm text-muted-foreground',
        className
      )}
    >
      <Spinner className='text-primary' />
      <span>{label}…</span>
    </div>
  );
}

/** Skeleton rows for lists/tables that are loading. */
export function ListSkeleton({
  rows = 4,
  className
}: {
  rows?: number;
  className?: string;
}) {
  return (
    <div className={cn('space-y-3', className)} aria-hidden='true'>
      {Array.from({ length: rows }, (_, index) => (
        <Skeleton key={index} className='h-16 w-full rounded-xl' />
      ))}
    </div>
  );
}
