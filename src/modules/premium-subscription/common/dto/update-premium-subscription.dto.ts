import { IsBoolean, IsNumber, IsOptional, Min } from "class-validator";

export class UpdatePremiumSubscriptionDto {
  @IsOptional()
  @IsNumber()
  @Min(1)
  price?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
