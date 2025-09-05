import { IsString, IsNotEmpty, IsOptional } from "class-validator";

export class UpdateStretchingDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  title?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  startText?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  endText?: string;
}
