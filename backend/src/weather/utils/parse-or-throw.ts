import { z } from "zod";
import { AppError, HTTP_STATUS } from "./error";

export function parseOrThrow<T>(
  schema: z.ZodSchema<T>,
  payload: unknown,
  fallbackMessage: string,
  statusCode?: number,
): T {
  const result = schema.safeParse(payload);
  if (!result.success) {
    const message = result.error.issues[0]?.message ?? fallbackMessage;
    throw new AppError(statusCode ?? HTTP_STATUS.BAD_GATEWAY, message);
  }
  return result.data;
}
