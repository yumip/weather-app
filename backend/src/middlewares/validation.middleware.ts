import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { AppError, HTTP_STATUS } from "../weather/utils/error";

type ZodSchemaType = z.ZodType<any>;

/**
 * Validate request query parameters against a Zod schema.
 * Calls next() on success, passes AppError to next() on failure.
 */
export function validateQuery(schema: ZodSchemaType) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.query);
    if (!result.success) {
      const message = result.error.issues[0]?.message ?? "Invalid query";
      return next(new AppError(HTTP_STATUS.BAD_REQUEST, message));
    }
    next();
  };
}

/**
 * Validate request body against a Zod schema.
 * Calls next() on success, passes AppError to next() on failure.
 */
export function validateBody(schema: ZodSchemaType) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const message = result.error.issues[0]?.message ?? "Invalid body";
      return next(new AppError(HTTP_STATUS.BAD_REQUEST, message));
    }
    next();
  };
}

/**
 * Validate request parameters against a Zod schema.
 * Calls next() on success, passes AppError to next() on failure.
 */
export function validateParams(schema: ZodSchemaType) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.params);
    if (!result.success) {
      const message = result.error.issues[0]?.message ?? "Invalid params";
      return next(new AppError(HTTP_STATUS.BAD_REQUEST, message));
    }
    next();
  };
}
