import { IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";
import { PaginationQueryDto } from "../../../../common/dto";

export class GetAllAppStoreProductTransactionsDto extends PaginationQueryDto {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  productId?: string;

  @IsOptional()
  @IsUUID()
  userId?: string;
}
