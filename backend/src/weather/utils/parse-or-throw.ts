import { z } from "zod";
import { WeatherError } from "./error";

export function parseOrThrow<T>(
  schema: z.ZodSchema<T>,
  payload: unknown,
  fallbackMessage: string,
): T {
  const result = schema.safeParse(payload);
  if (!result.success) {
    const message = result.error.issues[0]?.message ?? fallbackMessage;
    if (message === "City not found") {
      throw new WeatherError(404, message);
    }
    throw new WeatherError(502, message);
  }
  return result.data;
}
