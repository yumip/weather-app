import { z } from "zod";

export function parseOrThrow<T>(
  schema: z.ZodSchema<T>,
  payload: unknown,
  fallbackMessage: string,
): T {
  const result = schema.safeParse(payload);
  if (!result.success) {
    throw new Error(result.error.issues[0]?.message ?? fallbackMessage);
  }
  return result.data;
}
