import { IsEmail } from "class-validator";

export class EmailAccountRecoveryRequestDto {
  @IsEmail()
  email: string;
}
