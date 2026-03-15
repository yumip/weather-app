import { z } from "zod";

export const geocodingPayloadSchema = z.object({
  results: z
    .array(
      z.object({
        name: z.string(),
        latitude: z.number(),
        longitude: z.number(),
        country: z.string().optional(),
      }),
    )
    .min(1, "City not found"),
});

export const forecastPayloadSchema = z.object({
  current_weather: z.object({
    temperature: z.number(),
    windspeed: z.number(),
    weathercode: z.number(),
  }),
  hourly: z.object({
    relativehumidity_2m: z.array(z.number()),
  }),
});
