import { z } from 'zod';

/** Support chat composer: the legacy form refused empty (whitespace-only) messages. */
export const supportMessageSchema = z.object({
  message: z.string().trim().min(1, 'Please type message.')
});
export type SupportMessageValues = z.infer<typeof supportMessageSchema>;
export const supportMessageDefaultValues: SupportMessageValues = {
  message: ''
};
