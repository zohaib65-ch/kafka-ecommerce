'use client';

import {
  Controller,
  type Control,
  type FieldPath,
  type FieldValues
} from 'react-hook-form';

import { ActiveSwitch } from './active-switch';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyControl<T extends FieldValues> = Control<T, any, any>;

type ActiveSwitchFieldProps<T extends FieldValues> = {
  control: AnyControl<T>;
  name: FieldPath<T>;
  label?: string;
  hint?: React.ReactNode;
};

/** The "Active?" row of the add forms, bound to a boolean form field. */
export function ActiveSwitchField<T extends FieldValues>({
  control,
  name,
  label,
  hint
}: ActiveSwitchFieldProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <ActiveSwitch
          checked={!!field.value}
          onCheckedChange={field.onChange}
          label={label}
          hint={hint}
        />
      )}
    />
  );
}
