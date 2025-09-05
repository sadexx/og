import { RequestHandler } from "express";
import { ValidationError, validate } from "class-validator";
import { plainToInstance } from "class-transformer";
import { HttpException } from "../exceptions/http.exception";
import { ParsedQs } from "qs";
import { EHttpResponseCode } from "../enums";

export function validationMiddlewareQuery<T extends object>(
  type: new () => T,
  transformations?: Record<string, (value: string) => unknown>
): RequestHandler {
  return (req, _res, next) => {
    const parsedQuery = transformations
      ? Object.keys(req.query).reduce(
          (acc, key) => {
            const transformFunction = transformations[key];
            acc[key] = transformFunction ? transformFunction(req.query[key] as string) : req.query[key];

            return acc;
          },
          {} as Record<string, unknown>
        )
      : req.query;

    const dtoInstance = plainToInstance(type, parsedQuery);

    validate(dtoInstance).then((errors: ValidationError[]) => {
      if (errors.length > 0) {
        const message = errors.map((error) => Object.values(error.constraints ?? {})).join(", ");
        next(new HttpException(EHttpResponseCode.BAD_REQUEST, message));
      } else {
        req.query = dtoInstance as unknown as ParsedQs;
        next();
      }
    });
  };
}
