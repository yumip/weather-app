// Shared handler contract.
// Uses a Lambda-style event/response shape so the core handler logic stays
// transport-agnostic and can be adapted to Express or API Gateway easily.

import { Request } from "express";
import { HTTP_STATUS } from "../utils/error";

export interface HandlerEvent {
  queryStringParameters?: Record<string, string | undefined> | null;
}

export interface HandlerResponse<T = unknown> {
  statusCode: number;
  body: T;
}
export function toHandlerEvent(req: Request): HandlerEvent {
  const queryStringParameters: Record<string, string | undefined> = {};

  for (const [key, value] of Object.entries(req.query)) {
    queryStringParameters[key] = typeof value === "string" ? value : undefined;
  }

  return { queryStringParameters };
}

export function ok<T>(data: T): HandlerResponse<T> {
  return { statusCode: HTTP_STATUS.OK, body: data };
}

export function err(
  statusCode: number,
  message: string,
): HandlerResponse<{ error: string }> {
  return { statusCode, body: { error: message } };
}
