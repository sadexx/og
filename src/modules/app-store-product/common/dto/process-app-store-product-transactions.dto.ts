import { Type } from "class-transformer";
import { ArrayMinSize, IsArray, IsNotEmpty, IsString, ValidateNested } from "class-validator";
import { AppStoreProductTransactionDto } from "./app-store-product-transaction.dto";

export class ProcessAppStoreProductTransactionsDto {
  @IsString()
  @IsNotEmpty()
  signature: string;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => AppStoreProductTransactionDto)
  transactions: AppStoreProductTransactionDto[];
}
