import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import type { Address } from '@/types';

export function AddressList({ addresses }: { addresses: Address[] }) {
  return (
    <ul className='grid gap-4 md:grid-cols-2'>
      {addresses.map(address => (
        <li key={address._id}>
          <Link
            href={`/dashboard/address/edit/${address._id}`}
            aria-label={`Edit address: ${address.address}`}
            className='group flex h-full flex-col gap-4 border bg-card p-5 transition-colors hover:border-foreground'
          >
            <span className='flex min-h-5 items-center justify-between gap-3'>
              <span className='meta'>
                {address.isDefault
                  ? 'Default Delivery Address'
                  : 'Delivery Address'}
              </span>
              {address.isDefault && <Badge>Default</Badge>}
            </span>
            <span className='block text-lg leading-snug'>
              {address.address}
              <br />
              {`${address.city}, ${address.state}, ${address.country}, ${address.zipCode}`}
            </span>
            <span className='mt-auto text-sm font-semibold underline decoration-1 underline-offset-4 group-hover:decoration-brand group-hover:decoration-2'>
              Edit address
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
