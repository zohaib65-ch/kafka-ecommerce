'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { Eye, EyeOff, ImagePlus } from 'lucide-react';
import {
  Controller,
  type Control,
  type FieldPath,
  type FieldValues
} from 'react-hook-form';

import { Checkbox } from '@/components/ui/checkbox';
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { StarRatingInput } from '@/components/shared/star-rating';
import { cn } from '@/lib/utils';
import type { SelectOption } from '@/lib/select';

// RHF's Control carries three generics; the fields only need the form values type.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyControl<T extends FieldValues> = Control<T, any, any>;

export type BaseFieldProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = {
  control: AnyControl<TFieldValues>;
  name: TName;
  label?: React.ReactNode;
  description?: React.ReactNode;
  disabled?: boolean;
  /** Adds a visual "required" marker; validation itself lives in the Zod schema. */
  required?: boolean;
  className?: string;
};

type ShellProps = {
  id: string;
  label?: React.ReactNode;
  description?: React.ReactNode;
  error?: { message?: string };
  required?: boolean;
  className?: string;
  children: React.ReactNode;
};

function FieldShell({
  id,
  label,
  description,
  error,
  required,
  className,
  children
}: ShellProps) {
  return (
    <Field data-invalid={!!error} className={className}>
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
      {children}
      {description && (
        <FieldDescription id={`${id}-description`}>
          {description}
        </FieldDescription>
      )}
      {error && <FieldError id={`${id}-error`} errors={[error]} />}
    </Field>
  );
}

const describedBy = (id: string, hasDescription: boolean, hasError: boolean) =>
  [hasDescription && `${id}-description`, hasError && `${id}-error`]
    .filter(Boolean)
    .join(' ') || undefined;

/* ------------------------------------------------------------------ */
/* Text                                                                */
/* ------------------------------------------------------------------ */

type TextFieldProps<T extends FieldValues> = BaseFieldProps<T> & {
  type?: 'text' | 'email' | 'tel' | 'url' | 'search';
  placeholder?: string;
  autoComplete?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>['inputMode'];
  maxLength?: number;
  /** Rendered inside the field on the right, e.g. a submit button for inline forms. */
  inlineElement?: React.ReactNode;
};

export function TextField<T extends FieldValues>({
  control,
  name,
  label,
  description,
  disabled,
  required,
  className,
  type = 'text',
  placeholder,
  autoComplete,
  inputMode,
  maxLength,
  inlineElement
}: TextFieldProps<T>) {
  const id = useId();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FieldShell
          id={id}
          label={label}
          description={description}
          error={fieldState.error}
          required={required}
          className={className}
        >
          <div className='flex items-center gap-2'>
            <Input
              {...field}
              id={id}
              type={type}
              value={field.value ?? ''}
              placeholder={placeholder}
              autoComplete={autoComplete}
              inputMode={inputMode}
              maxLength={maxLength}
              disabled={disabled}
              aria-invalid={fieldState.invalid}
              aria-describedby={describedBy(
                id,
                !!description,
                !!fieldState.error
              )}
            />
            {inlineElement}
          </div>
        </FieldShell>
      )}
    />
  );
}

export function PasswordField<T extends FieldValues>({
  control,
  name,
  label,
  description,
  disabled,
  required,
  className,
  placeholder,
  autoComplete = 'current-password'
}: Omit<
  TextFieldProps<T>,
  'type' | 'inlineElement' | 'inputMode' | 'maxLength'
>) {
  const id = useId();
  const [visible, setVisible] = useState(false);

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FieldShell
          id={id}
          label={label}
          description={description}
          error={fieldState.error}
          required={required}
          className={className}
        >
          <div className='relative'>
            <Input
              {...field}
              id={id}
              type={visible ? 'text' : 'password'}
              value={field.value ?? ''}
              placeholder={placeholder}
              autoComplete={autoComplete}
              disabled={disabled}
              className='pr-11'
              aria-invalid={fieldState.invalid}
              aria-describedby={describedBy(
                id,
                !!description,
                !!fieldState.error
              )}
            />
            <button
              type='button'
              onClick={() => setVisible(value => !value)}
              aria-label={visible ? 'Hide password' : 'Show password'}
              aria-pressed={visible}
              className='absolute inset-y-0 right-0 flex w-11 items-center justify-center rounded-r-lg text-muted-foreground hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none'
            >
              {visible ? (
                <EyeOff className='size-4' />
              ) : (
                <Eye className='size-4' />
              )}
            </button>
          </div>
        </FieldShell>
      )}
    />
  );
}

type NumberFieldProps<T extends FieldValues> = BaseFieldProps<T> & {
  min?: number;
  max?: number;
  step?: number | 'any';
  placeholder?: string;
  /** Whether the form value is a number (default) or the raw string typed by the user. */
  valueAs?: 'number' | 'string';
  /** Digits only (no decimal point), e.g. quantities. */
  integer?: boolean;
  prefix?: string;
};

export function NumberField<T extends FieldValues>({
  control,
  name,
  label,
  description,
  disabled,
  required,
  className,
  min,
  max,
  step,
  placeholder,
  valueAs = 'number',
  integer,
  prefix
}: NumberFieldProps<T>) {
  const id = useId();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FieldShell
          id={id}
          label={label}
          description={description}
          error={fieldState.error}
          required={required}
          className={className}
        >
          <div className='relative'>
            {prefix && (
              <span className='pointer-events-none absolute inset-y-0 left-3 flex items-center text-sm text-muted-foreground'>
                {prefix}
              </span>
            )}
            <Input
              ref={field.ref}
              name={field.name}
              onBlur={field.onBlur}
              id={id}
              type='number'
              inputMode={integer ? 'numeric' : 'decimal'}
              min={min}
              max={max}
              step={step ?? (integer ? 1 : 'any')}
              value={field.value ?? ''}
              placeholder={placeholder}
              disabled={disabled}
              className={cn(prefix && 'pl-7')}
              aria-invalid={fieldState.invalid}
              aria-describedby={describedBy(
                id,
                !!description,
                !!fieldState.error
              )}
              onChange={event => {
                const raw = event.target.value;
                if (valueAs === 'string') field.onChange(raw);
                else field.onChange(raw === '' ? undefined : Number(raw));
              }}
            />
          </div>
        </FieldShell>
      )}
    />
  );
}

type TextareaFieldProps<T extends FieldValues> = BaseFieldProps<T> & {
  placeholder?: string;
  rows?: number;
  maxLength?: number;
};

export function TextareaField<T extends FieldValues>({
  control,
  name,
  label,
  description,
  disabled,
  required,
  className,
  placeholder,
  rows = 4,
  maxLength
}: TextareaFieldProps<T>) {
  const id = useId();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FieldShell
          id={id}
          label={label}
          description={description}
          error={fieldState.error}
          required={required}
          className={className}
        >
          <Textarea
            {...field}
            id={id}
            rows={rows}
            maxLength={maxLength}
            value={field.value ?? ''}
            placeholder={placeholder}
            disabled={disabled}
            aria-invalid={fieldState.invalid}
            aria-describedby={describedBy(
              id,
              !!description,
              !!fieldState.error
            )}
          />
        </FieldShell>
      )}
    />
  );
}

/* ------------------------------------------------------------------ */
/* Choice                                                              */
/* ------------------------------------------------------------------ */

type SelectFieldProps<T extends FieldValues> = BaseFieldProps<T> & {
  options: SelectOption[];
  placeholder?: string;
  /**
   * 'value' (default): the form value is the option's value (string | number).
   * 'option': the form value is the whole `{ value, label }` option object (legacy react-select shape).
   */
  valueMode?: 'value' | 'option';
};

export function SelectField<T extends FieldValues>({
  control,
  name,
  label,
  description,
  disabled,
  required,
  className,
  options,
  placeholder = 'Select an option',
  valueMode = 'value'
}: SelectFieldProps<T>) {
  const id = useId();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const raw =
          valueMode === 'option'
            ? (field.value as SelectOption | undefined)?.value
            : field.value;
        const current = raw === undefined || raw === null ? '' : String(raw);

        return (
          <FieldShell
            id={id}
            label={label}
            description={description}
            error={fieldState.error}
            required={required}
            className={className}
          >
            <Select
              name={field.name}
              value={current}
              disabled={disabled}
              onValueChange={next => {
                const option = options.find(
                  item => String(item.value) === next
                );
                if (!option) return;
                field.onChange(valueMode === 'option' ? option : option.value);
              }}
            >
              <SelectTrigger
                id={id}
                ref={field.ref}
                onBlur={field.onBlur}
                className='w-full'
                aria-invalid={fieldState.invalid}
                aria-describedby={describedBy(
                  id,
                  !!description,
                  !!fieldState.error
                )}
              >
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
              <SelectContent>
                {options.map(option => (
                  <SelectItem
                    key={String(option.value)}
                    value={String(option.value)}
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FieldShell>
        );
      }}
    />
  );
}

export function CheckboxField<T extends FieldValues>({
  control,
  name,
  label,
  description,
  disabled,
  className
}: BaseFieldProps<T>) {
  const id = useId();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <Field
          orientation='horizontal'
          data-invalid={fieldState.invalid}
          className={className}
        >
          <Checkbox
            id={id}
            name={field.name}
            ref={field.ref}
            checked={!!field.value}
            disabled={disabled}
            onCheckedChange={checked => field.onChange(checked === true)}
            onBlur={field.onBlur}
            aria-invalid={fieldState.invalid}
          />
          <FieldContent>
            <FieldLabel htmlFor={id} className='font-normal'>
              {label}
            </FieldLabel>
            {description && <FieldDescription>{description}</FieldDescription>}
            {fieldState.error && <FieldError errors={[fieldState.error]} />}
          </FieldContent>
        </Field>
      )}
    />
  );
}

export function SwitchField<T extends FieldValues>({
  control,
  name,
  label,
  description,
  disabled,
  className
}: BaseFieldProps<T>) {
  const id = useId();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <Field
          orientation='horizontal'
          data-invalid={fieldState.invalid}
          className={cn(
            'justify-between rounded-xl border bg-card p-4',
            className
          )}
        >
          <FieldContent>
            <FieldLabel htmlFor={id}>{label}</FieldLabel>
            {description && <FieldDescription>{description}</FieldDescription>}
            {fieldState.error && <FieldError errors={[fieldState.error]} />}
          </FieldContent>
          <Switch
            id={id}
            name={field.name}
            ref={field.ref}
            checked={!!field.value}
            disabled={disabled}
            onCheckedChange={field.onChange}
            onBlur={field.onBlur}
          />
        </Field>
      )}
    />
  );
}

/* ------------------------------------------------------------------ */
/* Rating & file                                                       */
/* ------------------------------------------------------------------ */

export function RatingField<T extends FieldValues>({
  control,
  name,
  label,
  description,
  disabled,
  required,
  className
}: BaseFieldProps<T>) {
  const id = useId();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FieldShell
          id={id}
          label={label}
          description={description}
          error={fieldState.error}
          required={required}
          className={className}
        >
          <StarRatingInput
            value={Number(field.value) || 0}
            onChange={field.onChange}
            onBlur={field.onBlur}
            disabled={disabled}
            invalid={fieldState.invalid}
            aria-describedby={describedBy(
              id,
              !!description,
              !!fieldState.error
            )}
          />
        </FieldShell>
      )}
    />
  );
}

type FileFieldProps<T extends FieldValues> = BaseFieldProps<T> & {
  accept?: string;
  /** URL of the image that is already saved (edit forms), shown until a new file is picked. */
  existingUrl?: string | null;
};

/** Image picker with preview. The form value is a `File` (or undefined). */
export function FileField<T extends FieldValues>({
  control,
  name,
  label,
  description,
  disabled,
  required,
  className,
  accept = 'image/png,image/jpeg,image/jpg',
  existingUrl
}: FileFieldProps<T>) {
  const id = useId();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FieldShell
          id={id}
          label={label}
          description={description}
          error={fieldState.error}
          required={required}
          className={className}
        >
          <FilePicker
            id={id}
            accept={accept}
            disabled={disabled}
            existingUrl={existingUrl}
            file={
              (field.value as unknown) instanceof File
                ? (field.value as File)
                : undefined
            }
            onChange={file => field.onChange(file)}
            onBlur={field.onBlur}
            invalid={fieldState.invalid}
            describedBy={describedBy(id, !!description, !!fieldState.error)}
          />
        </FieldShell>
      )}
    />
  );
}

function FilePicker({
  id,
  accept,
  disabled,
  existingUrl,
  file,
  onChange,
  onBlur,
  invalid,
  describedBy: ariaDescribedBy
}: {
  id: string;
  accept: string;
  disabled?: boolean;
  existingUrl?: string | null;
  file?: File;
  onChange: (file: File | undefined) => void;
  onBlur: () => void;
  invalid: boolean;
  describedBy?: string;
}) {
  // The preview URL is created in the change handler (not an effect) and released on replace/unmount.
  const [preview, setPreview] = useState<string | null>(null);
  const previewRef = useRef<string | null>(null);

  useEffect(
    () => () => {
      if (previewRef.current) URL.revokeObjectURL(previewRef.current);
    },
    []
  );

  const handleChange = (next: File | undefined) => {
    if (previewRef.current) URL.revokeObjectURL(previewRef.current);
    previewRef.current = next ? URL.createObjectURL(next) : null;
    setPreview(previewRef.current);
    onChange(next);
  };

  const shown = (file ? preview : null) ?? existingUrl ?? null;

  return (
    <label
      htmlFor={id}
      className={cn(
        'flex cursor-pointer items-center gap-4 rounded-xl border border-dashed bg-card p-4 transition-colors focus-within:ring-3 focus-within:ring-ring/50 hover:border-primary/60',
        invalid && 'border-destructive',
        disabled && 'pointer-events-none opacity-50'
      )}
    >
      <span className='flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-muted text-muted-foreground'>
        {shown ? (
          // eslint-disable-next-line @next/next/no-img-element -- local blob/remote preview, not optimizable
          <img
            src={shown}
            alt='Selected image preview'
            className='size-full object-cover'
          />
        ) : (
          <ImagePlus className='size-7' aria-hidden='true' />
        )}
      </span>
      <span className='min-w-0 text-sm'>
        <span className='block font-medium'>
          {file ? file.name : shown ? 'Replace image' : 'Upload an image'}
        </span>
        <span className='block text-muted-foreground'>JPG or PNG</span>
      </span>
      <input
        id={id}
        type='file'
        accept={accept}
        className='sr-only'
        disabled={disabled}
        aria-invalid={invalid}
        aria-describedby={ariaDescribedBy}
        onBlur={onBlur}
        onChange={event => handleChange(event.target.files?.[0] ?? undefined)}
      />
    </label>
  );
}
