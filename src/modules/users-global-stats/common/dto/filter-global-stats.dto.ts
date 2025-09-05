import { IsArray, IsEnum, IsInt, IsNumber, IsOptional, IsPositive } from "class-validator";
import { EMetricType } from "../../../../common/enums";
import { EGender, EState } from "../../../users/common/enums";

export class FilterGlobalStatsQueryDto {
  @IsOptional()
  @IsNumber()
  @IsPositive()
  page?: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  limit?: number;

  @IsOptional()
  @IsEnum(EMetricType)
  metricType?: EMetricType;

  @IsOptional()
  @IsEnum(EGender)
  gender?: EGender;

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  @IsPositive({ each: true })
  @IsInt({ each: true })
  ageGroup?: number[];

  @IsOptional()
  @IsEnum(EState)
  location?: EState;
}
