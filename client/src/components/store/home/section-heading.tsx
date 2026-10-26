import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

type SectionHeadingProps = {
  id: string;
  title: string;
  href?: string;
  linkLabel?: string;
};

/** Section title under a thick rule, with an optional "see all" link on the right. */
export function SectionHeading({
  id,
  title,
  href,
  linkLabel
}: SectionHeadingProps) {
  return (
    <div className='section-rule flex items-end justify-between gap-4 pt-4'>
      <h2 id={id} className='text-4xl sm:text-5xl'>
        {title}
      </h2>
      {href && (
        <Link
          href={href}
          className='inline-flex shrink-0 items-center gap-1.5 pb-1 text-sm font-semibold underline decoration-brand decoration-2 underline-offset-4 hover:decoration-4'
        >
          {linkLabel ?? 'View all'}
          <ArrowRight className='size-4' aria-hidden='true' />
        </Link>
      )}
    </div>
  );
}
