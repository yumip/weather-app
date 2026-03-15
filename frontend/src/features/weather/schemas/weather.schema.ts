import { z } from 'zod';

export const weatherSchema = z.object({
  city: z.string(),
  country: z.string().optional(),
  temperature: z.number(),
  condition: z.string(),
  windSpeed: z.number(),
  humidity: z.number(),
  unit: z.literal('celsius'),
  weatherCode: z.number().optional(),
  timestamp: z.string(),
});

export type WeatherData = z.infer<typeof weatherSchema>;
