import morgan from "morgan";
import winston from "winston";
import { logger } from "../../setup/logger";

const stream = {
  write: (message: string): winston.Logger => logger.http(message.trim())
};

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
export const morganMiddleware = morgan(":method :url :status :res[content-length] - :response-time ms", { stream });
