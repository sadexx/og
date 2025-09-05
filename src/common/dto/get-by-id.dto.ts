import { IsNotEmpty, IsString, IsUUID } from "class-validator";
import { UUID_VERSION } from "../constants";

export class GetByIdDto {
  @IsNotEmpty()
  @IsString()
  @IsUUID(UUID_VERSION)
  id: string;
}
