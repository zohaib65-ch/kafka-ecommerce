import { cn } from '@/lib/utils';

type PageHeaderProps = {
  title: React.ReactNode;
  description?: React.ReactNode;
  /** @deprecated Eyebrow labels are no longer part of the design; the prop is ignored. */
  eyebrow?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
};

/** Page title opened by a thick rule, like the head of a catalog page. */
export function PageHeader({
  title,
  description,
  actions,
  className
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        'section-rule flex flex-col gap-4 pt-5 sm:flex-row sm:items-end sm:justify-between',
        className
      )}
    >
      <div>
        <h1 className='text-5xl sm:text-6xl'>{title}</h1>
        {description && (
          <p className='mt-4 max-w-2xl text-lg text-pretty text-muted-foreground'>
            {description}
          </p>
        )}
      </div>
      {actions && (
        <div className='flex shrink-0 items-center gap-2'>{actions}</div>
      )}
    </div>
  );
}
