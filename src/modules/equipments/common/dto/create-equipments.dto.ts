import { IsString, IsNotEmpty, IsNumber, IsOptional } from "class-validator";

export class CreateEquipmentsDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  keyTitle: string;

  @IsNumber()
  @IsNotEmpty()
  setupDuration: number;

  @IsNumber()
  @IsNotEmpty()
  removalDuration: number;

  @IsNumber()
  @IsNotEmpty()
  adjustmentDuration: number;

  @IsNumber()
  @IsNotEmpty()
  priority: number;

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

  @IsString()
  @IsNotEmpty()
  setupAudioText: string;

  @IsString()
  @IsNotEmpty()
  adjustmentAudioText: string;

  @IsString()
  @IsNotEmpty()
  removalAudioText: string;
}
