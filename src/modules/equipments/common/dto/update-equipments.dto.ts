import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class UpdateEquipmentsDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  title?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  keyTitle?: string;

  @IsOptional()
  @IsNumber()
  @IsNotEmpty()
  setupDuration?: number;

  @IsOptional()
  @IsNumber()
  @IsNotEmpty()
  removalDuration?: number;

  @IsOptional()
  @IsNumber()
  @IsNotEmpty()
  adjustmentDuration?: number;

  @IsOptional()
  @IsNumber()
  @IsNotEmpty()
  priority?: number;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  setupVideoUrl?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  adjustmentVideoUrl?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  removalVideoUrl?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  setupAudioText?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  adjustmentAudioText?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  removalAudioText?: string;
}
