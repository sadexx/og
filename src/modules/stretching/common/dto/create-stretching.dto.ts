import { IsNotEmpty, IsString } from "class-validator";

export class CreateStretchingDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  startText: string;

  @IsString()
  @IsNotEmpty()
  endText: string;
}
