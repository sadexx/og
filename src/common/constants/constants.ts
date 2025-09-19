import { UUIDVersion } from "validator";

/**
 ** In days
 */
export const NUMBER_OF_DAYS_IN_WEEK: number = 7;
/**
 ** In hours
 */
export const NUMBER_OF_HOURS_IN_DAY: number = 24;
/**
 ** In minutes
 */
export const NUMBER_OF_MINUTES_IN_HOUR: number = 60;
export const NUMBER_OF_MINUTES_IN_FIFTEEN_DAYS: number = 21600;
/**
 ** In seconds
 */
export const NUMBER_OF_SECONDS_IN_MINUTE: number = 60;
/**
 ** In milliseconds
 */
export const NUMBER_OF_MILLISECONDS_IN_SECOND: number = 1000;
export const NUMBER_OF_MILLISECONDS_IN_MINUTE: number = NUMBER_OF_MILLISECONDS_IN_SECOND * NUMBER_OF_SECONDS_IN_MINUTE;
/**
 ** Config
 **/
export const DEFAULT_API_PORT: number = 3000;
export const DEFAULT_API_URL: string = "https://api.olympus-admin.click";
export const DEFAULT_FRONT_END_URL: string = "https://olympus-admin.click";
export const DEFAULT_API_PREFIX: string = "v1";
export const DEFAULT_API_MAX_FILE_SIZE_MB: string = "100";
export const DEFAULT_API_IMAGE_MIME_TYPES: string = "image/jpeg,image/png";
export const DEFAULT_API_VIDEO_MIME_TYPES: string = "video/mp4";
export const DEFAULT_API_FIRMWARE_MIME_TYPES: string = "application/zip,application/x-zip-compressed";
export const DEFAULT_API_JWT_ACCESS_TOKEN_SECRET: string = "TtyhAXTCEtve9XTGc5j2-!@*-xy8zKtytkQi*26eac3m9vkp";
export const DEFAULT_API_JWT_ACCESS_TOKEN_EXPIRATION_TIME: string = "120";
export const DEFAULT_API_JWT_REFRESH_TOKEN_SECRET: string = "PXeac3m9vkp*UBQC7XTKczTt-!@*-xukdtytkxyXTmBQCE9";
export const DEFAULT_API_JWT_REFRESH_TOKEN_EXPIRATION_TIME: string = "7";
export const DEFAULT_API_BCRYPT_SALT_ROUNDS: string = "14";
export const DEFAULT_API_EMAIL_HOST: string = "sandbox.smtp.mailtrap.io";
export const DEFAULT_API_EMAIL_PORT: string = "2525";
export const DEFAULT_API_EMAIL_DOMAIN_NAME: string = "your-email@example.com";
export const DEFAULT_API_EMAIL_USERNAME: string = "17b95ef4e663c8";
export const DEFAULT_API_EMAIL_PASSWORD: string = "37a89f55967342";
export const DEFAULT_API_EMAIL_CONFIRMATION_EXPIRATION_TIME: string = "10";
export const DEFAULT_API_AWS_SECRET: string = "XXXX";
export const DEFAULT_API_AWS_REGION: string = "us-east-1";
export const DEFAULT_API_S3_BUCKET_NAME: string = "olympus-grip";
export const DEFAULT_API_POSTGRES_PORT: number = 5432;
export const DEFAULT_API_POSTGRES_USER: string = "myuser";
export const DEFAULT_API_POSTGRES_HOST: string = "olympus-dev.chypzsuqhjjj.us-east-1.rds.amazonaws.com";
export const DEFAULT_API_POSTGRES_PASSWORD: string = "mysecretpassword";
export const DEFAULT_API_POSTGRES_DB: string = "olympusdev";
export const DEFAULT_API_REDIS_HOST: string = "redis";
export const DEFAULT_API_REDIS_PORT: number = 6379;
export const REDIS_MAX_RETRIES: number = 3;
export const REDIS_RETRY_DELAY_MS: number = 1000;
export const DEFAULT_TRANSACTION_SECRET: string = "Slcv2pi394mx-!@*-vrepihgbvres*298y4nld";
export const DEFAULT_AWS_SQS_INTERVAL_TIME_MIN: string = "30";
/**
 ** Other
 **/
export const UUID_VERSION: UUIDVersion = 4;
export const NUMBER_BYTES_IN_KILOBYTE: number = 1024;
export const MAX_CHARACTERS_LENGTH: number = 500;
export const PASSWORD_MIN_LENGTH: number = 8;
export const ONE_HUNDRED: number = 100;
