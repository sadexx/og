import { IsDateString, IsNotEmpty } from "class-validator";
import { IsValidDateRange } from "../validators";
import { GetGroupMembershipStatisticDto } from "./get-group-membership-statistic.dto";

const MAX_VALID_DATE_RANGE = 365;

export class GetGroupMembershipStatisticMonthlyDto extends GetGroupMembershipStatisticDto {
  @IsNotEmpty()
  @IsDateString()
  @IsValidDateRange(MAX_VALID_DATE_RANGE)
  endDate: Date;
}
