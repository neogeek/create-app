import { z } from 'zod';

export const ProviderTypeSchema = z.enum(['google_oauth']);

export type ProviderType = z.infer<typeof ProviderTypeSchema>;

export const TokenSchema = z.object({
  userId: z.number(),
});

export type Token = z.infer<typeof TokenSchema>;
