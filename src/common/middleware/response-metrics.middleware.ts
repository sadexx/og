/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Request, Response, NextFunction } from "express";
import { MetricsService } from "../../modules/metrics/services/metrics.service";
import { NUMBER_OF_MILLISECONDS_IN_SECOND } from "../constants";

const metricsService = MetricsService.getInstance();
const NANOSECONDS_IN_MILLISECOND = 1e6;
const DECIMAL_PLACES = 3;

export async function responseMetricsMiddleware(req: Request, res: Response, next: NextFunction): Promise<void> {
  res.on("finish", async () => {
    const [startSeconds, startNanoseconds] = res.locals.requestStart;
    const [endSeconds, endNanoseconds] = process.hrtime();
    const durationInMilliseconds = (
      (endSeconds - startSeconds) * NUMBER_OF_MILLISECONDS_IN_SECOND +
      (endNanoseconds - startNanoseconds) / NANOSECONDS_IN_MILLISECOND
    ).toFixed(DECIMAL_PLACES);

    const durationInSeconds = parseFloat(durationInMilliseconds) / NUMBER_OF_MILLISECONDS_IN_SECOND;

    await metricsService
      .observeHttpRequestDuration(req.method, req.route ? req.route.path : "unknown", res.statusCode, durationInSeconds)
      .catch((error) => {
        console.error("Error observing HTTP request duration:", error);
      });
  });

  next();
}
