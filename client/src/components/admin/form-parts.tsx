import { cn } from '@/lib/utils';

/**
 * Titled group of fields. From `md` the title sits in a left column and the fields in the right
 * one, opened by a hairline rule, like a printed order form.
 */
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
    <fieldset
      className={cn(
        'grid gap-5 border-t pt-6 md:grid-cols-[13rem_minmax(0,1fr)] md:gap-10',
        className
      )}
    >
      <legend className='sr-only'>{title}</legend>
      <div aria-hidden='true'>
        <h2 className='font-heading text-xl leading-tight font-semibold tracking-normal normal-case'>
          {title}
        </h2>
        {description && (
          <p className='mt-1 text-sm text-muted-foreground'>{description}</p>
        )}
      </div>
      <div className='max-w-2xl space-y-5'>{children}</div>
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
        'flex flex-col gap-3 border-t border-foreground pt-6 sm:flex-row sm:items-center',
        className
      )}
    >
      {children}
    </div>
  );
}
