const BUCKET_5MS: number = 0.005;
const BUCKET_10MS: number = 0.01;
const BUCKET_25MS: number = 0.025;
const BUCKET_50MS: number = 0.05;
const BUCKET_100MS: number = 0.1;
const BUCKET_250MS: number = 0.25;
const BUCKET_500MS: number = 0.5;
const BUCKET_1S: number = 1;
const BUCKET_2_5S: number = 2.5;
const BUCKET_5S: number = 5;
const BUCKET_10S: number = 10;
export const HISTOGRAM_BUCKETS: number[] = [
  BUCKET_5MS,
  BUCKET_10MS,
  BUCKET_25MS,
  BUCKET_50MS,
  BUCKET_100MS,
  BUCKET_250MS,
  BUCKET_500MS,
  BUCKET_1S,
  BUCKET_2_5S,
  BUCKET_5S,
  BUCKET_10S
];

const PERCENTILE_1: number = 0.01;
const PERCENTILE_5: number = 0.05;
const PERCENTILE_50: number = 0.5;
const PERCENTILE_90: number = 0.9;
const PERCENTILE_95: number = 0.95;
const PERCENTILE_99: number = 0.99;
export const SUMMARY_PERCENTILES: number[] = [
  PERCENTILE_1,
  PERCENTILE_5,
  PERCENTILE_50,
  PERCENTILE_90,
  PERCENTILE_95,
  PERCENTILE_99
];
