import Link from 'next/link';

/** "Product link my-slug": where the item lives in the shop. */
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
    <p className='flex flex-wrap items-baseline gap-x-2 text-sm text-muted-foreground'>
      <span>{label}</span>
      <Link
        href={href}
        className='font-medium text-foreground underline decoration-brand decoration-2 underline-offset-4'
      >
        {slug}
      </Link>
    </p>
  );
}
