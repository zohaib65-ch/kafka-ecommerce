'use client';

import { useForm, type FieldValues, type UseFormProps } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { z } from 'zod';

/**
 * React Hook Form wired to a Zod schema. Errors show once a field is touched and re-validate on change.
 * Form values use the schema's input type; `onSubmit` receives the parsed output.
 */
export function useZodForm<
  TInput extends FieldValues,
  TOutput extends FieldValues
>(
  schema: z.ZodType<TOutput, TInput>,
  options: Omit<UseFormProps<TInput, unknown, TOutput>, 'resolver'> = {}
) {
  return useForm<TInput, unknown, TOutput>({
    mode: 'onTouched',
    ...options,
    resolver: zodResolver(schema)
  });
}
