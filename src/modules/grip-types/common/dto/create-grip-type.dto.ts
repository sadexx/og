import { IsString, IsNumber, IsBoolean, IsNotEmpty } from "class-validator";

export class CreateGripTypeDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  version: string;

  @IsNumber()
  @IsNotEmpty()
  tareValue: number;

  @IsBoolean()
  @IsNotEmpty()
  isBluetooth: boolean;

  @IsString()
  @IsNotEmpty()
  imageUrl: string;

  @IsString()
  @IsNotEmpty()
  versionBackgroundColor: string;
}
