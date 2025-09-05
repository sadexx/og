import { EHttpResponseCode } from "../enums";
import { HttpException } from "./http.exception";

export class UnauthorizedException extends HttpException {
  constructor(message = "Unauthorized") {
    super(EHttpResponseCode.UNAUTHORIZED, message);
  }
}
