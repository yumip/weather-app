import { z } from 'zod';

export const historyItemSchema = z.object({
  city: z.string(),
  temperature: z.number(),
  timestamp: z.string(),
});

export const historySchema = z.array(historyItemSchema);

export type HistoryItem = z.infer<typeof historyItemSchema>;
