import { z } from 'zod';

import type { User } from '@/types';

/** Profile details (dashboard > Account Details). The legacy form had no required fields. */
export const profileSchema = z.object({
  firstName: z.string().trim(),
  lastName: z.string().trim(),
  phoneNumber: z.string().trim()
});
export type ProfileValues = z.infer<typeof profileSchema>;

export const profileToFormValues = (user: User): ProfileValues => ({
  firstName: user.firstName ?? '',
  lastName: user.lastName ?? '',
  phoneNumber: user.phoneNumber ?? ''
});
