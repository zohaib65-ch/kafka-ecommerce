import DOMPurify from 'dompurify';

/**
 * Strips markup from every field (user generated text is posted to the API as plain text).
 * Values are converted to strings, like the legacy `santizeFields`.
 * DOMPurify needs a DOM: on the server (where it is unsupported) values pass through as strings.
 */
export const sanitizeFields = <T extends Record<string, unknown>>(
  data: T
): { [K in keyof T]: string } => {
  const fields = {} as { [K in keyof T]: string };

  for (const key of Object.keys(data) as Array<keyof T>) {
    const value = String(data[key] ?? '');
    fields[key] =
      typeof window === 'undefined' || !DOMPurify.isSupported
        ? value
        : DOMPurify.sanitize(value, { USE_PROFILES: { html: false } });
  }

  return fields;
};
