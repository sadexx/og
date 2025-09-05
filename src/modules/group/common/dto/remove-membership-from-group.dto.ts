import { IsUUID } from "class-validator";

export class RemoveMembershipFromGroupDto {
  @IsUUID()
  targetUserId: string;
}
