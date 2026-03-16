import { z } from "zod";

export const geocodingPayloadSchema = z.object({
  results: z.preprocess(
    (val) => (val === undefined ? [] : val),
    z
      .array(
        z.object({
          name: z.string(),
          latitude: z.number(),
          longitude: z.number(),
          country: z.string().optional(),
        }),
      )
      .min(1, "City not found"),
  ),
});

export const forecastPayloadSchema = z.object({
  current: z.object({
    temperature_2m: z.number(),
    wind_speed_10m: z.number(),
    relative_humidity_2m: z.number(),
    weather_code: z.number(),
  }),
});
