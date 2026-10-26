import { cn, getAvatarColor } from '@/lib/utils';

type BrandMonogramProps = {
  name: string;
  className?: string;
};

/** Brands have no logo: a deterministic tonal monogram keeps every brand tile looking finished. */
export function BrandMonogram({ name, className }: BrandMonogramProps) {
  const color = getAvatarColor(name);
  const initial = name.trim().charAt(0).toUpperCase() || '?';

  return (
    <span
      aria-hidden='true'
      className={cn(
        'grid size-12 shrink-0 place-items-center rounded-2xl font-heading text-xl font-semibold',
        className
      )}
      style={{
        color,
        backgroundColor: `color-mix(in oklch, ${color} 16%, transparent)`
      }}
    >
      {initial}
    </span>
  );
}
