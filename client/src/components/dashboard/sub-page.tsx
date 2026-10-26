import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type SubPageProps = {
  title: React.ReactNode;
  description?: React.ReactNode;
  /** Shorthand for a single secondary header button (legacy `actionTitle` + `handleAction`). */
  actionTitle?: string;
  handleAction?: () => void;
  /** Custom header actions (rendered after the shorthand button). */
  actions?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
};

/** Title bar + body used by every dashboard page. */
export function SubPage({
  title,
  description,
  actionTitle,
  handleAction,
  actions,
  className,
  children
}: SubPageProps) {
  return (
    <section className={cn('space-y-8', className)}>
      <div className='section-rule flex flex-wrap items-end justify-between gap-3 pt-4'>
        <div>
          <h1 className='text-4xl sm:text-5xl'>{title}</h1>
          {description && (
            <p className='mt-2 text-muted-foreground'>{description}</p>
          )}
        </div>
        <div className='flex items-center gap-2'>
          {actionTitle && (
            <Button variant='outline' size='sm' onClick={handleAction}>
              {actionTitle}
            </Button>
          )}
          {actions}
        </div>
      </div>
      <div>{children}</div>
    </section>
  );
}
