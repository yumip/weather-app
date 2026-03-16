// ── Shared handler contract ────────────────────────────────────────────────
// Mirrors the shape of an AWS Lambda HTTP event / response so the handler
// can be swapped behind API Gateway without rewriting business logic.

export interface HandlerEvent {
  queryStringParameters?: Record<string, string | undefined> | null;
}

export interface HandlerResponse<T = unknown> {
  statusCode: number;
  body: T;
}

export function ok(data: unknown): HandlerResponse {
  return { statusCode: 200, body: data };
}

export function err(statusCode: number, message: string): HandlerResponse {
  return { statusCode, body: { message: message } };
}
