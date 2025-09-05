import { type NextFunction, type Request, type Response } from "express";
import { HttpException } from "../exceptions/http.exception";
import { QueryFailedError } from "typeorm";
import { logger } from "../../setup/logger";
import { EHttpResponseCode } from "../enums";

export const errorMiddleware = (
  error: HttpException | QueryFailedError,
  _request: Request,
  response: Response,
  _next: NextFunction
): void => {
  if (error instanceof QueryFailedError) {
    logger.error(`${error.message}, ${error.stack}`);
    response.status(EHttpResponseCode.INTERNAL_SERVER_ERROR).json({
      status: 500,
      message: "Database error"
    });
  }

  if (error instanceof HttpException) {
    const status = error.status || EHttpResponseCode.INTERNAL_SERVER_ERROR;
    const message = error.message || "Something went wrong";

    logger.error(`${message}, ${error.stack}`);
    response.status(status).json({
      status,
      message
    });
  }
};
