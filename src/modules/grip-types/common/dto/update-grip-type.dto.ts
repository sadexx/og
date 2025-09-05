import { IsString, IsNotEmpty, IsNumber, IsBoolean, IsOptional } from "class-validator";

export class UpdateGripTypeDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  title?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  description?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  version?: string;

  @IsOptional()
  @IsNumber()
  @IsNotEmpty()
  tareValue?: number;

  @IsOptional()
  @IsBoolean()
  @IsNotEmpty()
  isBluetooth?: boolean;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  imageUrl?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  versionBackgroundColor?: string;
}
