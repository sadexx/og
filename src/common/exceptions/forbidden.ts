import { EHttpResponseCode } from "../enums";
import { HttpException } from "./http.exception";

export class ForbiddenException extends HttpException {
  constructor(message = "Forbidden") {
    super(EHttpResponseCode.FORBIDDEN, message);
  }
}
