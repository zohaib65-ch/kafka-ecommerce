'use client';

import type {
  FieldValues,
  SubmitErrorHandler,
  SubmitHandler,
  UseFormReturn
} from 'react-hook-form';

import { cn } from '@/lib/utils';

type FormProps<
  TFieldValues extends FieldValues,
  TTransformed extends FieldValues
> = Omit<React.ComponentProps<'form'>, 'onSubmit'> & {
  form: UseFormReturn<TFieldValues, unknown, TTransformed>;
  onSubmit: SubmitHandler<TTransformed>;
  onInvalid?: SubmitErrorHandler<TFieldValues>;
};

/** <form> bound to a React Hook Form instance (native browser validation is off; Zod owns the rules). */
export function Form<
  TFieldValues extends FieldValues,
  TTransformed extends FieldValues
>({
  form,
  onSubmit,
  onInvalid,
  className,
  children,
  ...props
}: FormProps<TFieldValues, TTransformed>) {
  return (
    <form
      noValidate
      className={cn('space-y-5', className)}
      onSubmit={form.handleSubmit(onSubmit, onInvalid)}
      {...props}
    >
      {children}
    </form>
  );
}
