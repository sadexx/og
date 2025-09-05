import { IsNotEmpty, IsOptional, IsString, IsUrl } from "class-validator";

export class UpdateFileDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @IsUrl({}, { message: "existingFileUrl must be a valid URL" })
  existingFileUrl?: string;
}
