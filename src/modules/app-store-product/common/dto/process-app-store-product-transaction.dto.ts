import { IsNotEmpty, IsString } from "class-validator";

export class ProcessAppStoreProductTransactionDto {
  @IsString()
  @IsNotEmpty()
  jwsRepresentation: string;
}
