import { IsString, IsNotEmpty, IsOptional, Matches } from "class-validator";

export class CreateStrainClassDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  achievementAudioText: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsNotEmpty()
  @IsString()
  @Matches(/^\d+n?$/)
  lowerBound: bigint;
}
