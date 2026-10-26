import Link from 'next/link';
import { ExternalLink } from 'lucide-react';

/** "Product link /my-slug": where the item lives in the shop. */
export function PublicLink({
  label,
  href,
  slug
}: {
  label: string;
  href: string;
  slug: string;
}) {
  return (
    <p className='flex flex-wrap items-center gap-x-2 text-sm text-muted-foreground'>
      <span>{label}</span>
      <Link
        href={href}
        className='inline-flex items-center gap-1 font-medium text-primary hover:underline'
      >
        {slug}
        <ExternalLink className='size-3.5' aria-hidden='true' />
      </Link>
    </p>
  );
}
