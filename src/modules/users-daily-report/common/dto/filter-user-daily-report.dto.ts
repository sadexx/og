import { IsString, IsOptional, IsEnum, IsDateString, IsNotEmpty } from "class-validator";
import { EMetricType, ESortOrder } from "../../../../common/enums";
import { PaginationQueryDto } from "../../../../common/dto";

export class FilterUserDailyReportQueryDto extends PaginationQueryDto {
  @IsOptional()
  @IsEnum(EMetricType)
  metricType?: EMetricType;

  @IsString()
  @IsOptional()
  @IsEnum(ESortOrder)
  sortOrder?: ESortOrder;

  @IsOptional()
  @IsDateString()
  @IsNotEmpty()
  startDate?: Date;
}
