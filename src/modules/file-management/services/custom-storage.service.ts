import { Request } from "express";
import { StorageEngine } from "multer";
import {
  ALLOWED_FIRMWARE_MIME_TYPES,
  ALLOWED_IMAGE_MIME_TYPES,
  ALLOWED_VIDEO_MIME_TYPES,
  MAX_FILE_SIZE_MB
} from "../../../common/configs/config";
import { logger } from "../../../setup/logger";
import { AwsS3Service } from "../../aws-s3/services/aws-s3.service";
import {
  InternalServerError,
  PayloadTooLargeException,
  UnsupportedMediaTypeException
} from "../../../common/exceptions";

export class CustomStorageService implements StorageEngine {
  private readonly DIRECTORY_START_INDEX = 2;
  constructor(private readonly awsS3Service = new AwsS3Service()) {}

  async _handleFile(
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, info?: { path: string }) => void
  ): Promise<void> {
    try {
      let allowedMimeTypes;

      if (req.path.includes("/images")) {
        allowedMimeTypes = ALLOWED_IMAGE_MIME_TYPES;
      }

      if (req.path.includes("/videos")) {
        allowedMimeTypes = ALLOWED_VIDEO_MIME_TYPES;
      }

      if (req.path.includes("/firmware")) {
        allowedMimeTypes = ALLOWED_FIRMWARE_MIME_TYPES;
      }

      if (Number(MAX_FILE_SIZE_MB) < Number(req.headers["content-length"])) {
        cb(new PayloadTooLargeException("File too large:" + file.originalname));

        return;
      }

      if (!allowedMimeTypes || !allowedMimeTypes.includes(file.mimetype)) {
        cb(new UnsupportedMediaTypeException("Unsupported Media Type:" + file.mimetype));

        return;
      }

      const parts = req.path.split("/");
      const directory = parts.slice(this.DIRECTORY_START_INDEX).join("/");
      const extension = file.mimetype.split("/")[1];
      const existingFileUrl: string | undefined = req.query.existingFileUrl as string;
      const url = await this.awsS3Service.upload(file.stream, directory, file.mimetype, extension, existingFileUrl);

      cb(null, { path: url });
    } catch (err) {
      logger.error("Error in Custom Storage Service:", err);
      cb(new InternalServerError((err as Error).message));
    }
  }

  _removeFile(_req: Request, _file: Express.Multer.File, cb: (error: Error | null) => void): void {
    cb(null);
  }
}
