import { RequestHandler } from "express";
import { ValidationError, validate } from "class-validator";
import { plainToInstance } from "class-transformer";
import { HttpException } from "../exceptions/http.exception";
import { EHttpResponseCode } from "../enums";
import { responseOneBySchemaHelper } from "../helpers";

export const validationMiddlewareParams = <T extends object>(
  type: new () => T,
  skipMissingProperties = false
): RequestHandler => {
  return (req, _res, next) => {
    req.params = responseOneBySchemaHelper(type, req.params as unknown as Partial<T>) as Record<string, string>;

    validate(plainToInstance(type, req.params), {
      skipMissingProperties
    }).then((errors: ValidationError[]) => {
      if (errors.length > 0) {
        const message = errors
          .flatMap((error: ValidationError) => {
            const fieldErrors = error.constraints ? Object.values(error.constraints) : [];
            const childErrors =
              error.children?.flatMap((childError) =>
                childError.constraints ? Object.values(childError.constraints) : []
              ) || [];

            return [...fieldErrors, ...childErrors];
          })
          .join(", ");
        next(new HttpException(EHttpResponseCode.BAD_REQUEST, message));
      } else {
        next();
      }
    });
  };
};
