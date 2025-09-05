import { IsNotEmpty, IsString, IsInt, Min, IsUUID, IsEnum } from "class-validator";
import { ExtendedJwtPayload } from "../interfaces/jwt-payload.interface";
import { UUID_VERSION } from "../../../../common/constants";
import { ERole } from "../../../users/common/enums";

export class JwtPayload implements ExtendedJwtPayload {
  @IsNotEmpty()
  @IsString()
  @IsUUID(UUID_VERSION)
  id: string;

  @IsNotEmpty()
  @IsString()
  device: string;

  @IsEnum(ERole)
  role: ERole;

  @IsNotEmpty()
  @IsInt()
  @Min(0)
  iat: number;

  @IsNotEmpty()
  @IsInt()
  @Min(0)
  exp: number;
}
