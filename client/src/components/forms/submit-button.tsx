'use client';

import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';

type SubmitButtonProps = Omit<React.ComponentProps<typeof Button>, 'type'> & {
  loading?: boolean;
  loadingText?: string;
};

export function SubmitButton({
  loading,
  loadingText,
  disabled,
  children,
  ...props
}: SubmitButtonProps) {
  return (
    <Button type='submit' disabled={disabled || loading} {...props}>
      {loading && <Spinner />}
      {loading && loadingText ? loadingText : children}
    </Button>
  );
}
