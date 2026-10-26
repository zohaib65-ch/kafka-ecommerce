import { z } from 'zod';

import { PHONE_REGEX, emailField, passwordField, requiredText } from './common';

/** "Sell with us" application (also used by the admin "Add merchant" form). */
export const merchantSchema = z.object({
  name: requiredText('Name is required.'),
  email: emailField(),
  phoneNumber: requiredText('Phone number is required.').regex(
    PHONE_REGEX,
    'Phone number format is invalid.'
  ),
  brandName: requiredText('Brand is required.'),
  business: requiredText('Business is required.').min(
    10,
    'Business must be at least 10 characters.'
  )
});
export type MerchantValues = z.infer<typeof merchantSchema>;
export const merchantDefaultValues: MerchantValues = {
  name: '',
  email: '',
  phoneNumber: '',
  brandName: '',
  business: ''
};

/** Merchant account creation from the emailed invite (`/merchant-signup/:token`). */
export const merchantSignupSchema = z.object({
  email: emailField(),
  firstName: requiredText('First Name is required.'),
  lastName: requiredText('Last Name is required.'),
  password: passwordField()
});
export type MerchantSignupValues = z.infer<typeof merchantSignupSchema>;
export const merchantSignupDefaultValues: MerchantSignupValues = {
  email: '',
  firstName: '',
  lastName: '',
  password: ''
};
