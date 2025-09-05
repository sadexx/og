import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateAppStoreProductDto {
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
}
