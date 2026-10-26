import { CreditCard, Headset, Truck } from 'lucide-react';

import { SUPPORT_PHONE } from '@/lib/constants';

const props = [
  {
    icon: Truck,
    title: 'Free shipping',
    text: 'On every order, no minimum.'
  },
  {
    icon: CreditCard,
    title: 'Secure payment',
    text: 'Trusted payment methods at checkout.'
  },
  {
    icon: Headset,
    title: 'Friendly support',
    text: `Need advice? Call us ${SUPPORT_PHONE}.`
  }
];

export function ValueProps() {
  return (
    <section aria-label='Why shop with us' className='container-page mt-8'>
      <ul className='grid divide-y rounded-2xl border bg-card shadow-soft sm:grid-cols-3 sm:divide-x sm:divide-y-0'>
        {props.map(({ icon: Icon, title, text }) => (
          <li key={title} className='flex items-center gap-4 p-5'>
            <span className='grid size-12 shrink-0 place-items-center rounded-xl bg-accent text-accent-foreground'>
              <Icon className='size-6' aria-hidden='true' />
            </span>
            <div>
              <p className='font-heading font-semibold'>{title}</p>
              <p className='text-sm text-muted-foreground'>{text}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
