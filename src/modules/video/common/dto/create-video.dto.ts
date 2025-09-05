import { IsEnum, IsString, IsNotEmpty, IsNumber } from "class-validator";
import { EVideoType } from "../enums";

export class CreateVideoDto {
  @IsEnum(EVideoType)
  type: EVideoType;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  subtitle: string;

  @IsString()
  @IsNotEmpty()
  url: string;

  @IsNumber()
  @IsNotEmpty()
  duration: number;
}
