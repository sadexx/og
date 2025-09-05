import { EHttpResponseCode } from "../enums";
import { HttpException } from "./http.exception";

export class UnsupportedMediaTypeException extends HttpException {
  constructor(message = "Unsupported Media Type") {
    super(EHttpResponseCode.UNSUPPORTED_MEDIA_TYPE, message);
  }
}
