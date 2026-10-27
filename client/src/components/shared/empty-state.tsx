import { cn } from '@/lib/utils';

type EmptyStateProps = {
  /** Headline. `message` is accepted as a shorthand for plain "No x found." texts. */
  title?: React.ReactNode;
  message?: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
};

export function EmptyState({
  title,
  message,
  description,
  action,
  className
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'border border-dashed border-input px-6 py-14 text-center',
        className
      )}
    >
      <p className='font-heading text-3xl leading-none font-semibold text-balance uppercase'>
        {title ?? message}
      </p>
      {description && (
        <p className='mx-auto mt-3 max-w-md text-muted-foreground'>
          {description}
        </p>
      )}
      {action && <div className='mt-6 flex justify-center'>{action}</div>}
    </div>
  );
}
