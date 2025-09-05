import { EHttpResponseCode } from "../enums";
import { HttpException } from "./http.exception";

export class BadRequestException extends HttpException {
  constructor(message = "Bad request") {
    super(EHttpResponseCode.BAD_REQUEST, message);
  }
}
