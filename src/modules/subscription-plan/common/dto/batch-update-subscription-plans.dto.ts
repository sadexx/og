import { IsOptional, ValidateNested } from "class-validator";
import { ESubscriptionPlanType } from "../enums";
import { UpdateSubscriptionPlanDto } from "./update-subscription-plan.dto";
import { Type } from "class-transformer";
import { IsFreePlanActiveUnchangeable } from "../validators";

export class BatchUpdateSubscriptionPlansDto {
  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateSubscriptionPlanDto)
  @IsFreePlanActiveUnchangeable()
  [ESubscriptionPlanType.FREE]: UpdateSubscriptionPlanDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateSubscriptionPlanDto)
  [ESubscriptionPlanType.STARTER]: UpdateSubscriptionPlanDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateSubscriptionPlanDto)
  [ESubscriptionPlanType.PLUS]: UpdateSubscriptionPlanDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateSubscriptionPlanDto)
  [ESubscriptionPlanType.PRO]: UpdateSubscriptionPlanDto;
}
