import { z } from 'zod';

/**
 * Shared building blocks for the form schemas in this folder.
 *
 * Conventions (so `useForm<z.infer<typeof schema>>` works without friction):
 *  - Text-like AND number-like inputs are modelled as strings (what an <input> gives you).
 *    The thunks convert to numbers where the API needs them. Use the `...ToFormValues` helpers
 *    to turn API entities into form values (numbers become strings).
 *  - Selects use string values ('1' / '0' for yes / no).
 *  - Required text is trimmed, so whitespace-only input counts as empty.
 *  - Messages match the legacy validatorjs messages.
 */

// validatorjs `alpha_dash`
export const ALPHA_DASH_REGEX = /^[A-Za-z0-9_-]+$/;
export const ALPHA_DASH_MESSAGE =
  'may have alpha-numeric characters, as well as dashes and underscores only.';

export const DESCRIPTION_MAX_LENGTH = 200;
export const DESCRIPTION_MAX_MESSAGE =
  'Description may not be greater than 200 characters.';

// 10 digit US phone numbers, e.g. 951-999-9999, (951) 999 9999, 951.999.9999
export const PHONE_REGEX = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;

export const PASSWORD_MIN_LENGTH = 6;

export const requiredText = (message: string) =>
  z.string().trim().min(1, message);

export const emailField = (
  requiredMessage = 'Email is required.',
  invalidMessage = 'Email format is invalid.'
) =>
  z
    .string()
    .trim()
    .min(1, requiredMessage)
    .refine(
      value => value === '' || z.regexes.email.test(value),
      invalidMessage
    );

export const passwordField = (
  requiredMessage = 'Password is required.',
  minMessage = `Password must be at least ${PASSWORD_MIN_LENGTH} characters.`
) =>
  z
    .string()
    .min(1, requiredMessage)
    .refine(
      value => value === '' || value.length >= PASSWORD_MIN_LENGTH,
      minMessage
    );

export const slugField = (label: string) =>
  requiredText(`${label} is required.`).regex(
    ALPHA_DASH_REGEX,
    `${label} ${ALPHA_DASH_MESSAGE}`
  );

export const descriptionField = () =>
  requiredText('Description is required.').max(
    DESCRIPTION_MAX_LENGTH,
    DESCRIPTION_MAX_MESSAGE
  );

/** Select value for yes / no options. */
export const yesNoField = (message: string) =>
  z.enum(['1', '0'], { error: message });

export const yesNoOptions = [
  { value: '1', label: 'Yes' },
  { value: '0', label: 'No' }
] as const;

/** Shows only the first issue of a failed parse, handy in tests and thunks. */
export const firstIssueMessage = (error: z.ZodError) =>
  error.issues[0]?.message ?? 'Invalid value.';
