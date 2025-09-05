import { EHttpResponseCode } from "../enums";
import { HttpException } from "./http.exception";

export class NotFoundException extends HttpException {
  constructor(message = "Not found") {
    super(EHttpResponseCode.NOT_FOUND, message);
  }
}
