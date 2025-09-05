import { RequestHandler } from "express";
import { ValidationError, validate } from "class-validator";
import { plainToInstance } from "class-transformer";
import { HttpException } from "../exceptions/http.exception";
import { EHttpResponseCode } from "../enums";
import { responseOneBySchemaHelper } from "../helpers";

export const validationMiddlewareBody = <T extends object>(
  type: new () => T,
  skipMissingProperties = false
): RequestHandler => {
  return (req, _res, next) => {
    const transformedBody = plainToInstance(type, req.body) as Partial<T>;

    validate(transformedBody, {
      skipMissingProperties,
      whitelist: true,
      forbidNonWhitelisted: true
    })
      .then((errors: ValidationError[]) => {
        if (errors.length > 0) {
          const extractErrors = (validationErrors: ValidationError[]): string[] => {
            let errors: string[] = [];

            for (const error of validationErrors) {
              if (error.constraints) {
                errors.push(...Object.values(error.constraints));
              }

              if (error.children && error.children.length > 0) {
                errors = errors.concat(extractErrors(error.children));
              }
            }

            return errors;
          };

          const allErrors = extractErrors(errors);
          const errorMessage = allErrors.join(", ");
          next(new HttpException(EHttpResponseCode.BAD_REQUEST, errorMessage));
        } else {
          req.body = responseOneBySchemaHelper(type, transformedBody);
          next();
        }
      })
      .catch(next);
  };
};
