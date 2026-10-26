import { cn } from '@/lib/utils';

/** Text link used in the header: small capitals with an orange underline on hover / when active. */
export const navLinkClass = (active = false) =>
  cn(
    'inline-flex h-10 items-center gap-1 px-3 text-[0.8rem] font-semibold tracking-[0.08em] uppercase decoration-2 underline-offset-[10px] outline-none hover:underline hover:decoration-brand focus-visible:underline focus-visible:decoration-brand',
    active && 'underline decoration-brand'
  );
