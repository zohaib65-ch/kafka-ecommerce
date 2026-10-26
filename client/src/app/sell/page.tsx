import type { Metadata } from 'next';

import { MerchantApplicationForm } from '@/components/marketing/merchant-application-form';
import {
  SellApply,
  SellBenefits,
  SellHero,
  SellSteps
} from '@/components/marketing/sell-sections';

export const metadata: Metadata = {
  title: 'Sell With Us',
  description:
    'Become a Marketlane seller. Apply today and grow your business with Marketlane.'
};

export default function SellPage() {
  return (
    <>
      <SellHero />
      <SellBenefits />
      <SellSteps />
      <SellApply>
        <MerchantApplicationForm submitLabel='Submit' />
      </SellApply>
    </>
  );
}
