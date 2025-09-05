import { IsOptional, IsUUID } from "class-validator";
import { PaginationQueryDto } from "../../../../common/dto";

export class GetVerifiedCoachWorkoutsDto extends PaginationQueryDto {
  @IsOptional()
  @IsUUID()
  coachId?: string;
}
