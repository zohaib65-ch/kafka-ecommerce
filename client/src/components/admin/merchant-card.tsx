'use client';

import { Check, Power, RefreshCw, Trash2, X } from 'lucide-react';

import { StatusBadge } from '@/components/shared/status-badge';
import { Button } from '@/components/ui/button';
import { MERCHANT_STATUS } from '@/lib/constants';
import { formatDate } from '@/lib/format';
import type { Merchant } from '@/types';

import { ConfirmAction } from './confirm-action';

type MerchantCardProps = {
  merchant: Merchant;
  onApprove: (merchant: Merchant) => void;
  onReject: (merchant: Merchant) => void;
  onDelete: (merchant: Merchant) => void;
  onToggleActive: (merchant: Merchant, value: boolean) => void;
};

function Detail({
  label,
  wide,
  children
}: {
  label: string;
  wide?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className={wide ? 'col-span-2 min-w-0' : 'min-w-0'}>
      <dt className='text-xs font-medium tracking-wide text-muted-foreground uppercase'>
        {label}
      </dt>
      <dd className='mt-0.5 text-sm [overflow-wrap:anywhere]'>{children}</dd>
    </div>
  );
}

export function MerchantCard({
  merchant,
  onApprove,
  onReject,
  onDelete,
  onToggleActive
}: MerchantCardProps) {
  const approved = merchant.status === MERCHANT_STATUS.Approved;
  const rejected = merchant.status === MERCHANT_STATUS.Rejected;

  const deleteButton = (
    <ConfirmAction
      title={`Delete ${merchant.brandName || merchant.name}?`}
      description='This removes the merchant application and cannot be undone.'
      confirmLabel='Delete merchant'
      onConfirm={() => onDelete(merchant)}
      trigger={
        <Button
          variant='outline'
          size='sm'
          className='text-destructive hover:text-destructive'
        >
          <Trash2 /> Delete
        </Button>
      }
    />
  );

  return (
    <article className='flex h-full flex-col rounded-2xl border bg-card p-5'>
      <header className='flex items-start justify-between gap-3'>
        <div className='min-w-0'>
          <p className='text-xs font-medium tracking-wide text-muted-foreground uppercase'>
            Business
          </p>
          <h2 className='mt-0.5 text-base leading-snug font-semibold break-words'>
            {merchant.business}
          </h2>
        </div>
        <div className='flex shrink-0 flex-col items-end gap-1.5'>
          <StatusBadge status={merchant.status} />
          {approved && !merchant.isActive && (
            <StatusBadge status='Disabled' tone='neutral' />
          )}
        </div>
      </header>

      <dl className='mt-4 grid grid-cols-2 gap-x-4 gap-y-3'>
        <Detail label='Brand'>{merchant.brandName}</Detail>
        <Detail label='Name'>{merchant.name}</Detail>
        <Detail label='Email' wide>
          {merchant.email ? merchant.email : 'N/A'}
        </Detail>
        <Detail label='Phone number'>{merchant.phoneNumber}</Detail>
        <Detail label='Request date'>
          {formatDate(merchant.created ?? '')}
        </Detail>
      </dl>

      <footer className='mt-5 flex flex-1 flex-col justify-end gap-3 border-t pt-4'>
        {approved ? (
          <>
            <div className='flex items-center justify-between gap-3'>
              <p className='flex items-center gap-2 text-sm font-medium text-success'>
                <Check className='size-4' aria-hidden='true' /> Approved
              </p>
              {deleteButton}
            </div>
            <ConfirmAction
              tone={merchant.isActive ? 'destructive' : 'default'}
              title={`Are you sure you want to ${merchant.isActive ? 'disable' : 'enable'} ${merchant.name}'s merchant account?`}
              description={
                merchant.isActive
                  ? "Disabling merchant account will disable merchant's brand and account access."
                  : 'Enabling merchant account will restore merchant account access.'
              }
              confirmLabel={
                merchant.isActive ? 'Disable Merchant' : 'Enable Merchant'
              }
              onConfirm={() => onToggleActive(merchant, !merchant.isActive)}
              trigger={
                <Button variant='secondary' className='w-full'>
                  <Power />{' '}
                  {merchant.isActive ? 'Disable Merchant' : 'Enable Merchant'}
                </Button>
              }
            />
          </>
        ) : rejected ? (
          <div className='flex flex-wrap items-center justify-between gap-3'>
            <Button
              variant='outline'
              size='sm'
              onClick={() => onApprove(merchant)}
            >
              <RefreshCw /> Re-Approve
            </Button>
            {deleteButton}
          </div>
        ) : merchant.email ? (
          <div className='flex flex-wrap items-center justify-between gap-3'>
            <div className='flex gap-2'>
              <Button size='sm' onClick={() => onApprove(merchant)}>
                <Check /> Approve
              </Button>
              <Button
                variant='outline'
                size='sm'
                onClick={() => onReject(merchant)}
              >
                <X /> Reject
              </Button>
            </div>
            {deleteButton}
          </div>
        ) : (
          <>
            <p className='text-sm text-muted-foreground'>
              Merchant doesn&apos;t have email. Call at{' '}
              <a
                href={`tel:${merchant.phoneNumber}`}
                className='font-medium text-primary hover:underline'
              >
                {merchant.phoneNumber}
              </a>
            </p>
            <div>{deleteButton}</div>
          </>
        )}
      </footer>
    </article>
  );
}
