import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

type SectionHeadingProps = {
  id: string;
  eyebrow?: string;
  title: string;
  href?: string;
  linkLabel?: string;
};

export function SectionHeading({
  id,
  eyebrow,
  title,
  href,
  linkLabel
}: SectionHeadingProps) {
  return (
    <div className='flex items-end justify-between gap-4'>
      <div className='space-y-1.5'>
        {eyebrow && (
          <p className='text-xs font-semibold tracking-widest text-primary uppercase'>
            {eyebrow}
          </p>
        )}
        <h2 id={id} className='text-2xl font-semibold sm:text-3xl'>
          {title}
        </h2>
      </div>
      {href && (
        <Link
          href={href}
          className='inline-flex shrink-0 items-center gap-1 text-sm font-medium text-primary hover:text-primary/80'
        >
          {linkLabel ?? 'View all'}{' '}
          <ArrowRight className='size-4' aria-hidden='true' />
        </Link>
      )}
    </div>
  );
}
