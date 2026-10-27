'use client';

import { Trash2 } from 'lucide-react';

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
  children
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className='min-w-0'>
      <dt className='meta'>{label}</dt>
      <dd className='mt-0.5 [overflow-wrap:anywhere]'>{children}</dd>
    </div>
  );
}

/** One merchant application as a ruled row: who, what they sell, status, and what can be done. */
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
        <Button variant='destructive' size='sm'>
          <Trash2 /> Delete
        </Button>
      }
    />
  );

  return (
    <article className='grid gap-5 py-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-10'>
      <div className='min-w-0 space-y-4'>
        <div className='flex flex-wrap items-center gap-x-3 gap-y-2'>
          <h2 className='text-2xl leading-none font-semibold [overflow-wrap:anywhere]'>
            {merchant.brandName}
          </h2>
          <StatusBadge status={merchant.status} />
          {approved && !merchant.isActive && (
            <StatusBadge status='Disabled' tone='neutral' />
          )}
        </div>
        <p className='max-w-2xl [overflow-wrap:anywhere] text-muted-foreground'>
          {merchant.business}
        </p>
        <dl className='grid grid-cols-2 gap-x-6 gap-y-3 text-sm sm:grid-cols-[minmax(0,1fr)_minmax(0,2fr)_minmax(0,1fr)_minmax(0,1.2fr)]'>
          <Detail label='Name'>{merchant.name}</Detail>
          <Detail label='Email'>
            {merchant.email ? merchant.email : 'N/A'}
          </Detail>
          <Detail label='Phone number'>{merchant.phoneNumber}</Detail>
          <Detail label='Request date'>
            {formatDate(merchant.created ?? '')}
          </Detail>
        </dl>
      </div>

      <div className='flex flex-wrap content-start items-start gap-2 lg:w-60 lg:flex-col lg:flex-nowrap lg:items-stretch'>
        {approved ? (
          <>
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
                <Button variant='outline' size='sm'>
                  {merchant.isActive ? 'Disable Merchant' : 'Enable Merchant'}
                </Button>
              }
            />
            {deleteButton}
          </>
        ) : rejected ? (
          <>
            <Button size='sm' onClick={() => onApprove(merchant)}>
              Re-Approve
            </Button>
            {deleteButton}
          </>
        ) : merchant.email ? (
          <>
            <Button size='sm' onClick={() => onApprove(merchant)}>
              Approve
            </Button>
            <Button
              variant='outline'
              size='sm'
              onClick={() => onReject(merchant)}
            >
              Reject
            </Button>
            {deleteButton}
          </>
        ) : (
          <>
            <p className='basis-full text-sm text-muted-foreground'>
              Merchant doesn&apos;t have email. Call at{' '}
              <a
                href={`tel:${merchant.phoneNumber}`}
                className='font-medium text-foreground underline decoration-brand decoration-2 underline-offset-4'
              >
                {merchant.phoneNumber}
              </a>
            </p>
            {deleteButton}
          </>
        )}
      </div>
    </article>
  );
}
