import { SUPPORT_PHONE } from '@/lib/constants';

const cell =
  'px-1 py-3.5 text-sm font-semibold tracking-[0.08em] uppercase sm:px-6 sm:first:pl-0 sm:last:pr-0';

/** One ruled line of plain facts about the store. */
export function ValueProps() {
  return (
    <section aria-label='Shipping, payment and support' className='container-page mt-10'>
      <ul className='grid divide-y divide-border border-y border-foreground sm:grid-cols-3 sm:divide-x sm:divide-y-0'>
        <li className={cell}>Free shipping on every order</li>
        <li className={cell}>Pay at checkout</li>
        <li className={cell}>
          Call us{' '}
          <a
            href={`tel:${SUPPORT_PHONE.replace(/-/g, '')}`}
            className='underline decoration-brand decoration-2 underline-offset-4'
          >
            {SUPPORT_PHONE}
          </a>
        </li>
      </ul>
    </section>
  );
}
