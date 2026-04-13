import { Request, Response, NextFunction } from "express";
import { AppError, HTTP_STATUS } from "../weather/utils/error";

/**
 * Global error handler middleware.
 * Catches AppError instances and returns structured error responses.
 * Falls back to 500 for unexpected errors without leaking stack traces.
 */
export function errorMiddleware(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ error: err.message });
    return;
  }

  console.error(err);

  res
    .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
    .json({ error: "Internal server error" });
}
