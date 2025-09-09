import z from 'zod';

export const getBalanceSchema = z.object({
  id: z.number(),
});

export type GetBalanceDto = z.infer<typeof getBalanceSchema>;
