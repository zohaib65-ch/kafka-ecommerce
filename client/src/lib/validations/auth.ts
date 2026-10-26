import { z } from 'zod';

import { emailField, passwordField, requiredText } from './common';

export const loginSchema = z.object({
  email: emailField(),
  password: passwordField()
});
export type LoginValues = z.infer<typeof loginSchema>;
export const loginDefaultValues: LoginValues = { email: '', password: '' };

export const signupSchema = z.object({
  email: emailField(),
  firstName: requiredText('First Name is required.'),
  lastName: requiredText('Last Name is required.'),
  password: passwordField()
});
export type SignupValues = z.infer<typeof signupSchema>;
export const signupDefaultValues: SignupValues = {
  email: '',
  firstName: '',
  lastName: '',
  password: ''
};

export const forgotPasswordSchema = z.object({
  email: emailField()
});
export type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;
export const forgotPasswordDefaultValues: ForgotPasswordValues = { email: '' };

const confirmPasswordField = () =>
  z
    .string()
    .min(1, 'Confirm password is required.')
    .refine(
      value => value === '' || value.length >= 6,
      'Confirm password must be at least 6 characters.'
    );

/** Reset password with an emailed token (`/reset-password/:token`): both fields must match. */
export const resetPasswordSchema = z
  .object({
    password: passwordField(),
    confirmPassword: confirmPasswordField()
  })
  .refine(values => values.password === values.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Confirm password and password fields must match.'
  });
export type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;
export const resetPasswordDefaultValues: ResetPasswordValues = {
  password: '',
  confirmPassword: ''
};

/**
 * Change the password of the signed in user (dashboard > Account Security).
 * The API field names are historical: `password` is the CURRENT (old) password and
 * `confirmPassword` is the NEW password. The two are not compared.
 */
export const accountPasswordSchema = z.object({
  password: passwordField(),
  confirmPassword: confirmPasswordField()
});
export type AccountPasswordValues = z.infer<typeof accountPasswordSchema>;
export const accountPasswordDefaultValues: AccountPasswordValues = {
  password: '',
  confirmPassword: ''
};
