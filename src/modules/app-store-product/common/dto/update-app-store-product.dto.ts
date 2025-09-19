import { IsNumber, IsOptional, IsString, IsUUID } from "class-validator";

export class UpdateAppStoreProductDto {
  @IsOptional()
  @IsString()
  productId?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsNumber()
  discount?: number;

  @IsOptional()
  @IsNumber()
  quantity?: number;

  @IsOptional()
  @IsUUID()
  subscriptionPlanId?: string;
}
