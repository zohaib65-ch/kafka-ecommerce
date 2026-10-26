import { Badge } from '@/components/ui/badge';
import { CART_ITEM_STATUS, MERCHANT_STATUS } from '@/lib/constants';
import { cn } from '@/lib/utils';

type Tone = 'neutral' | 'info' | 'success' | 'warning' | 'danger';

const toneClasses: Record<Tone, string> = {
  neutral: 'bg-secondary text-secondary-foreground',
  info: 'bg-brand text-brand-foreground',
  success: 'bg-success text-success-foreground',
  warning: 'bg-warning text-warning-foreground',
  danger: 'bg-destructive text-white'
};

// Order item, merchant and review statuses share one visual language.
const statusTone: Record<string, Tone> = {
  [CART_ITEM_STATUS.Not_processed]: 'neutral',
  [CART_ITEM_STATUS.Processing]: 'warning',
  [CART_ITEM_STATUS.Shipped]: 'info',
  [CART_ITEM_STATUS.Delivered]: 'success',
  [CART_ITEM_STATUS.Cancelled]: 'danger',
  [MERCHANT_STATUS.Waiting_Approval]: 'warning',
  [MERCHANT_STATUS.Approved]: 'success',
  [MERCHANT_STATUS.Rejected]: 'danger'
  // REVIEW_STATUS uses the same three labels as MERCHANT_STATUS.
};

type StatusBadgeProps = {
  status: string;
  /** Override the tone derived from the status text. */
  tone?: Tone;
  className?: string;
};

/** Small solid tag for an order item / merchant / review status (also usable for Active / Disabled via `tone`). */
export function StatusBadge({ status, tone, className }: StatusBadgeProps) {
  return (
    <Badge
      variant='secondary'
      className={cn(
        toneClasses[tone ?? statusTone[status] ?? 'neutral'],
        className
      )}
    >
      {status}
    </Badge>
  );
}
