'use client';

import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';

/** Header action of the add / edit pages: back to where the user came from. */
export function CancelButton({ label = 'Cancel' }: { label?: string }) {
  const router = useRouter();

  return (
    <Button variant='outline' size='sm' onClick={() => router.back()}>
      {label}
    </Button>
  );
}
