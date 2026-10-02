import { randomUUID } from 'node:crypto';
import type { NextFunction, Request, Response } from 'express';

export const REQUEST_ID_HEADER = 'X-Request-Id';

// Gera um ID por requisição para correlacionar os logs de entrada, saída e erro.
export function requestIdMiddleware(
  _req: Request,
  res: Response,
  next: NextFunction,
) {
  const requestId = randomUUID();
  res.locals.requestId = requestId;
  res.setHeader(REQUEST_ID_HEADER, requestId);
  next();
}

export function getRequestId(res: Response): string {
  return (res.locals.requestId as string | undefined) ?? '-';
}
