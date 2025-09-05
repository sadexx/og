import { IsNumber, IsOptional, IsString } from "class-validator";

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
}
