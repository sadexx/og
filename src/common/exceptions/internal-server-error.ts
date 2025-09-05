import { EHttpResponseCode } from "../enums";
import { HttpException } from "./http.exception";

export class InternalServerError extends HttpException {
  constructor(message = "Internal Server Error") {
    super(EHttpResponseCode.INTERNAL_SERVER_ERROR, message);
  }
}
