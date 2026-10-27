import type { Metadata } from 'next';

import { ContactDetails } from '@/components/marketing/contact-details';
import { ContactForm } from '@/components/marketing/contact-form';
import { PageHeader } from '@/components/shared/page-header';

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with the Marketlane team.'
};

export default function ContactPage() {
  return (
    <div className='container-page py-10 lg:py-14'>
      <PageHeader
        title='Contact us'
        description='A question about an order, a product or selling with us? Send a message and we will get back to you.'
      />
      <div className='mt-12 grid gap-12 lg:grid-cols-[5fr_7fr] lg:gap-0'>
        <ContactDetails />
        <div className='lg:border-l lg:pl-14'>
          <h2 className='mb-6 text-3xl'>Send a message</h2>
          <div className='max-w-xl'>
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  );
}
