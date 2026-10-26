import type { Metadata } from 'next';

import { RequireAuth } from '@/components/shared/auth-guard';
import { PageHeader } from '@/components/shared/page-header';
import { SupportChat } from '@/components/support/support-chat';

export const metadata: Metadata = {
  title: 'Support',
  robots: { index: false }
};

export default function SupportPage() {
  return (
    <div className='container-page py-10 lg:py-14'>
      <PageHeader
        eyebrow='Help centre'
        title='Support'
        description='Chat with our team in real time.'
      />
      <div className='mt-8'>
        <RequireAuth>
          <SupportChat />
        </RequireAuth>
      </div>
    </div>
  );
}
