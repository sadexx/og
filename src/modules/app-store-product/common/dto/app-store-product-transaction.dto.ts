import { IsNotEmpty, IsString, IsNumber, IsDateString, IsEnum } from "class-validator";
import { ECurrencyEnum } from "../enums";

export class AppStoreProductTransactionDto {
  @IsNotEmpty()
  @IsString()
  productId: string;

  @IsNotEmpty()
  @IsString()
  transactionId: string;

  @IsNotEmpty()
  @IsString()
  transactionOriginalId: string;

  @IsNotEmpty()
  @IsNumber()
  price: number;

  @IsEnum(ECurrencyEnum)
  currency: ECurrencyEnum;

  @IsNotEmpty()
  @IsNumber()
  purchasedQuantity: number;

  @IsNotEmpty()
  @IsDateString()
  purchaseDate: Date;

  @IsNotEmpty()
  @IsDateString()
  originalPurchaseDate: Date;
}
