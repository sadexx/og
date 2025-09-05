import { Histogram, register, Summary } from "prom-client";
import { HISTOGRAM_BUCKETS, SUMMARY_PERCENTILES } from "../common/constants";

export class MetricsService {
  private static instance: MetricsService;
  private httpRequestDurationHistogram: Histogram;
  private httpRequestDurationSummary: Summary;

  private constructor() {
    this.httpRequestDurationHistogram = new Histogram({
      name: "http_request_duration_seconds",
      help: "request duration in seconds",
      labelNames: ["method", "route", "status_code"],
      buckets: HISTOGRAM_BUCKETS
    });

    this.httpRequestDurationSummary = new Summary({
      name: "http_request_summary_seconds",
      help: "request duration in seconds summary",
      labelNames: ["method", "route", "status_code"],
      percentiles: SUMMARY_PERCENTILES
    });
  }

  public static getInstance(): MetricsService {
    if (!MetricsService.instance) {
      MetricsService.instance = new MetricsService();
    }

    return MetricsService.instance;
  }

  public async observeHttpRequestDuration(
    method: string,
    route: string,
    statusCode: number,
    duration: number
  ): Promise<void> {
    this.httpRequestDurationHistogram.labels(method, route, statusCode.toString()).observe(duration);
    this.httpRequestDurationSummary.labels(method, route, statusCode.toString()).observe(duration);
  }

  public async getMetrics(): Promise<string> {
    return await register.metrics();
  }
}
