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
  description: 'Apply to list your products on Marketlane under your own brand.'
};

export default function SellPage() {
  return (
    <>
      <SellHero />
      <SellBenefits />
      <SellSteps />
      <SellApply>
        <MerchantApplicationForm submitLabel='Send application' />
      </SellApply>
    </>
  );
}
