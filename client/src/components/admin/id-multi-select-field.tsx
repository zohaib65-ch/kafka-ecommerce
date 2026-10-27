'use client';

import { useId } from 'react';
import {
  Controller,
  type Control,
  type FieldPath,
  type FieldValues
} from 'react-hook-form';

import { MultiSelect } from '@/components/shared/multi-select';
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel
} from '@/components/ui/field';
import type { SelectOption } from '@/lib/select';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyControl<T extends FieldValues> = Control<T, any, any>;

type IdMultiSelectFieldProps<T extends FieldValues> = {
  control: AnyControl<T>;
  name: FieldPath<T>;
  options: SelectOption<string>[];
  label?: React.ReactNode;
  description?: React.ReactNode;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
};

/**
 * Multiple choice field whose form value is an array of ids (`string[]`), e.g. a category's
 * product ids. (`MultiSelectField` stores whole `{ value, label }` options instead.)
 */
export function IdMultiSelectField<T extends FieldValues>({
  control,
  name,
  options,
  label,
  description,
  placeholder,
  disabled,
  required
}: IdMultiSelectFieldProps<T>) {
  const id = useId();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const ids = (field.value as string[] | undefined) ?? [];
        // Selected ids whose option is not loaded (yet) still render, labelled with the id.
        const selected = ids.map(
          value =>
            options.find(option => option.value === value) ?? {
              value,
              label: value
            }
        );
        const describedBy =
          [
            description && `${id}-description`,
            fieldState.error && `${id}-error`
          ]
            .filter(Boolean)
            .join(' ') || undefined;

        return (
          <Field data-invalid={!!fieldState.error}>
            {label && (
              <FieldLabel htmlFor={id}>
                {label}
                {required && (
                  <span aria-hidden='true' className='text-destructive'>
                    *
                  </span>
                )}
              </FieldLabel>
            )}
            <MultiSelect
              id={id}
              options={options}
              value={selected}
              onChange={next =>
                field.onChange(next.map(option => String(option.value)))
              }
              onBlur={field.onBlur}
              placeholder={placeholder}
              className='text-sm font-normal tracking-normal normal-case'
              disabled={disabled}
              invalid={fieldState.invalid}
              aria-describedby={describedBy}
            />
            {description && (
              <FieldDescription id={`${id}-description`}>
                {description}
              </FieldDescription>
            )}
            {fieldState.error && (
              <FieldError id={`${id}-error`} errors={[fieldState.error]} />
            )}
          </Field>
        );
      }}
    />
  );
}
