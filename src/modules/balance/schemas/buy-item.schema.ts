import { z } from 'zod';

export const buyItemSchema = z.object({
  itemId: z.uuid(),
});

export type BuyItemDto = z.infer<typeof buyItemSchema>;
