import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";

const logLevels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  data: 4
};

const colors = {
  error: "red",
  warn: "yellow",
  info: "green",
  http: "white",
  data: "white"
};

winston.addColors(colors);
const { combine, timestamp, printf, colorize, json } = winston.format;

const createFileTransport = (level: string, filename: string): DailyRotateFile => {
  return new DailyRotateFile({
    filename: `${filename}-%DATE%.json`,
    datePattern: "YYYY-MM-DD",
    maxFiles: "7d",
    level: "data",
    format: combine(
      winston.format((info) => {
        if (info.level !== level) {
          return false;
        }

        return info;
      })(),
      json()
    )
  });
};

export const logger = winston.createLogger({
  levels: logLevels,
  level: "data",
  format: combine(
    timestamp({
      format: "YYYY-MM-DD HH:mm:ss:ms"
    }),
    printf((info) => `[${info.timestamp}] ${info.level}: ${info.message}`)
  ),
  transports: [
    new winston.transports.Console({
      format: combine(
        colorize({ all: true }),
        timestamp({
          format: "YYYY-MM-DD HH:mm:ss:ms"
        }),
        printf((info) => `[${info.timestamp}] ${info.level}: ${info.message}`)
      )
    }),
    createFileTransport("error", "logs/error"),
    createFileTransport("warn", "logs/warn"),
    createFileTransport("info", "logs/info"),
    createFileTransport("http", "logs/http"),
    createFileTransport("data", "logs/data")
  ],
  rejectionHandlers: [createFileTransport("error", "logs/rejections")]
});

process.on("unhandledRejection", (reason) => {
  throw reason;
});
