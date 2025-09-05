import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { EVideoType } from "../enums";

export class UpdateVideoDto {
  @IsOptional()
  @IsEnum(EVideoType)
  type?: EVideoType;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  title?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  subtitle?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  url?: string;

  @IsOptional()
  @IsNumber()
  @IsNotEmpty()
  duration?: number;
}
