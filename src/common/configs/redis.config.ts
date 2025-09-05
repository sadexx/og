import Redis from "ioredis";
import { REDIS_URL } from "./config";
import { REDIS_MAX_RETRIES, REDIS_RETRY_DELAY_MS } from "../constants";

export const redisClient = new Redis(REDIS_URL, {
  maxRetriesPerRequest: null,
  retryStrategy: (times): number | null => {
    if (times <= REDIS_MAX_RETRIES) {
      return REDIS_RETRY_DELAY_MS;
    }

    return null;
  }
});
