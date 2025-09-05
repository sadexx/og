import "dotenv/config";
import { App } from "./setup/app";
import { APP_PORT } from "./common/configs/config";
import { logger } from "./setup/logger";
import { redisClient } from "./common/configs/redis.config";
import { collectDefaultMetrics } from "prom-client";
import { initializeStrategies } from "./modules/auth/common/strategies";
import { CronService } from "./modules/cron/services";
import { initializeDatabase } from "./setup/initialize-database";

const main = (): void => {
  initializeDatabase();

  redisClient.on("connect", () => {
    logger.info("✅ Redis Connection was successful.");
  });

  redisClient.on("error", (err) => {
    logger.error("❌ Unable to connect to the Redis:", err);
  });

  const app = new App();
  initializeStrategies();
  collectDefaultMetrics();

  const cronService = CronService.getInstance();
  cronService.startAllJobs();

  app.express.listen(APP_PORT, function () {
    logger.info(`Server started on port ${APP_PORT}`);
  });
};

main();
