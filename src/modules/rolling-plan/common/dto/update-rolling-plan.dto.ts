import { Type } from "class-transformer";
import { IsNotEmpty, ValidateNested } from "class-validator";
import { ReadRollingPlanCycleDto } from "./read-rolling-plan-cycle.dto";

export class UpdateRollingPlanDto {
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => ReadRollingPlanCycleDto)
  rollingPlanCycles: string[];
}
