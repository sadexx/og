import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID } from "class-validator";
import { EAppStoreProductType } from "../enums";
import { IsAppStoreProductValid } from "../validators";

export class CreateAppStoreProductDto {
  @IsEnum(EAppStoreProductType)
  @IsAppStoreProductValid()
  productType: EAppStoreProductType;

  @IsNotEmpty()
  @IsString()
  productId: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  discount: number;

  @IsNotEmpty()
  @IsNumber()
  quantity: number;

  @IsOptional()
  @IsUUID()
  subscriptionPlanId?: string;
}
