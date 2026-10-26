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
        eyebrow='Customer service'
        title='Contact Information'
        description='Questions about an order, a product or selling with us? Send us a message and we will get back to you.'
      />
      <div className='mt-10 grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:gap-12'>
        <div className='h-fit rounded-3xl border bg-card p-6 shadow-soft sm:p-10'>
          <ContactForm />
        </div>
        <ContactDetails />
      </div>
    </div>
  );
}
