import { z } from "zod";
import { WeatherError } from "./error";

export function parseOrThrow<T>(
  schema: z.ZodSchema<T>,
  payload: unknown,
  fallbackMessage: string,
  statusCode = 502,
): T {
  const result = schema.safeParse(payload);
  if (!result.success) {
    const message = result.error.issues[0]?.message ?? fallbackMessage;
    throw new WeatherError(statusCode, message);
  }
  return result.data;
}
