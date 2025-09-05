import { IsNotEmpty, IsString, IsOptional, Matches } from "class-validator";

export class UpdateStrainClassDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  title?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  achievementAudioText?: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @Matches(/^\d+n?$/)
  lowerBound?: bigint;
}
