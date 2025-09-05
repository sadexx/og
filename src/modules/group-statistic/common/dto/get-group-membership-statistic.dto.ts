import { IsDateString, IsNotEmpty, IsOptional, IsUUID } from "class-validator";

export class GetGroupMembershipStatisticDto {
  @IsNotEmpty()
  @IsDateString()
  startDate: Date;

  @IsOptional()
  @IsUUID()
  groupMembershipId?: string;
}
