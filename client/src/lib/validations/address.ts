import { z } from 'zod';

import type { Address } from '@/types';
import { requiredText } from './common';

const addressFields = {
  address: requiredText('Address is required.'),
  city: requiredText('City is required.'),
  state: requiredText('State is required.'),
  country: requiredText('Country is required.'),
  isDefault: z.boolean()
};

/** Add address: the zip code must be at least 5 characters (legacy rule). */
export const addAddressSchema = z.object({
  ...addressFields,
  zipCode: requiredText('Zipcode is required.').min(
    5,
    'Zipcode must be at least 5 characters.'
  )
});
export type AddAddressValues = z.infer<typeof addAddressSchema>;
export const addAddressDefaultValues: AddAddressValues = {
  address: '',
  city: '',
  state: '',
  country: '',
  zipCode: '',
  isDefault: false
};

/** Edit address: the legacy edit form only required the zip code to be present. */
export const editAddressSchema = z.object({
  ...addressFields,
  zipCode: requiredText('Zipcode is required.')
});
export type EditAddressValues = z.infer<typeof editAddressSchema>;
export const addressToFormValues = (address: Address): EditAddressValues => ({
  address: address.address ?? '',
  city: address.city ?? '',
  state: address.state ?? '',
  country: address.country ?? '',
  zipCode: address.zipCode ?? '',
  isDefault: Boolean(address.isDefault)
});
