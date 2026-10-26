import { SUPPORT_PHONE } from '@/lib/constants';

export function DisabledMerchantAccount({
  user
}: {
  user: { firstName?: string };
}) {
  return (
    <div className='container-page flex min-h-[50vh] flex-col justify-center py-16'>
      <p className='meta'>Hi, {user.firstName}</p>
      <h1 className='mt-2 max-w-2xl text-5xl sm:text-6xl'>
        Your account has been disabled.
      </h1>
      <p className='mt-5 max-w-md text-lg text-muted-foreground'>
        Please contact admin to request access again.
      </p>
      <p className='mt-6 font-heading text-3xl font-semibold'>
        Call us {SUPPORT_PHONE}
      </p>
    </div>
  );
}
