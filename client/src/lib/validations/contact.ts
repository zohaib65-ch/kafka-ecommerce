import { z } from 'zod';

import { emailField, requiredText } from './common';

export const contactSchema = z.object({
  name: requiredText('Name is required.'),
  email: emailField(),
  message: requiredText('Message is required.').min(
    10,
    'Message must be at least 10 characters.'
  )
});
export type ContactValues = z.infer<typeof contactSchema>;
export const contactDefaultValues: ContactValues = {
  name: '',
  email: '',
  message: ''
};
