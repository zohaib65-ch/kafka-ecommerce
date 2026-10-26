import { cn } from '@/lib/utils';

/** Card that holds an admin form (add / edit pages). */
export function FormCard({
  className,
  children
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn('rounded-2xl border bg-card p-5 sm:p-7', className)}>
      {children}
    </div>
  );
}

/** Titled group of fields inside a form. */
export function FormSection({
  title,
  description,
  className,
  children
}: {
  title: string;
  description?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <fieldset className={cn('space-y-5', className)}>
      <legend className='mb-1 w-full'>
        <span className='block text-base font-semibold'>{title}</span>
        {description && (
          <span className='mt-0.5 block text-sm font-normal text-muted-foreground'>
            {description}
          </span>
        )}
      </legend>
      {children}
    </fieldset>
  );
}

/** Primary / destructive buttons at the bottom of a form. */
export function FormActions({
  className,
  children
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        'flex flex-col gap-3 border-t pt-6 sm:flex-row sm:items-center',
        className
      )}
    >
      {children}
    </div>
  );
}
