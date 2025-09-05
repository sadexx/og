import { EHttpResponseCode } from "../enums";
import { HttpException } from "./http.exception";

export class PayloadTooLargeException extends HttpException {
  constructor(message = "Payload too large") {
    super(EHttpResponseCode.PAYLOAD_TOO_LARGE, message);
  }
}
