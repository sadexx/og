import { RequestHandler } from "express";
import { HttpException } from "../exceptions/http.exception";
import { EHttpResponseCode } from "../enums";
import { verifySignature } from "../helpers";
import { JwtPayload } from "../../modules/auth/common/dto";

export function signatureVerificationMiddleware(): RequestHandler {
  return (req, _res, next) => {
    try {
      const user = req.user as JwtPayload;
      const signature = req.body.signature as string;

      const isSignatureValid = verifySignature(user.id, signature);

      if (!isSignatureValid) {
        next(new HttpException(EHttpResponseCode.FORBIDDEN, "Invalid transaction signature."));

        return;
      }

      next();
    } catch (error) {
      next(error);
    }
  };
}
