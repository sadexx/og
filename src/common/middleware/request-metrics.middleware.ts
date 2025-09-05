import { Request, Response, NextFunction } from "express";

export async function requestMetricsMiddleware(_req: Request, res: Response, next: NextFunction): Promise<void> {
  res.locals.requestStart = process.hrtime();
  next();
}
