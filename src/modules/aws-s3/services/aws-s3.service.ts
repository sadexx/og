import { CopyObjectCommand, DeleteObjectCommand, S3Client, S3ClientConfig } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import { logger } from "../../../setup/logger";
import { Readable } from "node:stream";
import {
  AWS_ACCESS_KEY_ID,
  AWS_REGION,
  AWS_SECRET_ACCESS_KEY,
  ENVIRONMENT,
  S3_BUCKET_NAME
} from "../../../common/configs/config";
import { EEnvironment } from "../../../common/enums";
import { InternalServerError } from "../../../common/exceptions";

export class AwsS3Service {
  private s3Client: S3Client;
  private bucketName: string;
  constructor() {
    const s3ClientOptions: S3ClientConfig = { region: AWS_REGION };

    if (ENVIRONMENT === EEnvironment.LOCAL) {
      s3ClientOptions.credentials = {
        accessKeyId: AWS_ACCESS_KEY_ID,
        secretAccessKey: AWS_SECRET_ACCESS_KEY
      };
    }

    this.s3Client = new S3Client(s3ClientOptions);
    this.bucketName = S3_BUCKET_NAME;
  }

  public async copyImage(originalUrl: string, newFileName: string, directory: string): Promise<string> {
    try {
      const originalKey = originalUrl.split("amazonaws.com/")[1];
      let newKey = `${directory}/${newFileName}`;

      if (ENVIRONMENT !== EEnvironment.PRODUCTION) {
        newKey = `uploads/${newFileName}`;
      }

      await this.s3Client.send(
        new CopyObjectCommand({
          Bucket: this.bucketName,
          CopySource: `${this.bucketName}/${originalKey}`,
          Key: newKey
        })
      );

      const newUrl = `https://${this.bucketName}.s3.${AWS_REGION}.amazonaws.com/${newKey}`;

      return newUrl;
    } catch (err) {
      logger.error("Error copying image in S3:", err);
      throw new InternalServerError((err as Error).message);
    }
  }

  public async upload(
    fileStream: Readable,
    directory: string,
    contentType: string,
    extension: string,
    existingFileUrl?: string
  ): Promise<string> {
    try {
      let key: string;

      if (contentType === "image/svg+xml") {
        extension = "svg";
      }

      if (existingFileUrl) {
        key = existingFileUrl.split("amazonaws.com/")[1];

        if (ENVIRONMENT !== EEnvironment.PRODUCTION) {
          const filename = key.split("/").pop();
          key = `uploads/${filename}`;
        }
      } else {
        const filename = `${Date.now()}.${extension}`;
        key = ENVIRONMENT !== EEnvironment.PRODUCTION ? `uploads/${filename}` : `${directory}/${filename}`;
      }

      const upload = new Upload({
        client: this.s3Client,
        params: {
          Bucket: this.bucketName,
          Key: key,
          Body: fileStream,
          ContentType: contentType
        }
      });

      await upload.done();
      const url = `https://${this.bucketName}.s3.${AWS_REGION}.amazonaws.com/${key}`;

      return url;
    } catch (err) {
      logger.error("Error uploading to S3:", err);
      throw new InternalServerError((err as Error).message);
    }
  }

  public async delete(fileUrl: string): Promise<void> {
    if (ENVIRONMENT === EEnvironment.PRODUCTION) {
      if (fileUrl.startsWith("https://olympus-grip.s3.us-east-1.amazonaws.com")) {
        const key = fileUrl.split("amazonaws.com/")[1];
        await this.s3Client.send(new DeleteObjectCommand({ Bucket: this.bucketName, Key: key }));
      }
    }

    if (ENVIRONMENT !== EEnvironment.PRODUCTION) {
      if (fileUrl.startsWith("https://olympus-grip.s3.us-east-1.amazonaws.com/uploads")) {
        const key = fileUrl.split("amazonaws.com/")[1];
        await this.s3Client.send(new DeleteObjectCommand({ Bucket: this.bucketName, Key: key }));
      }
    }
  }
}
