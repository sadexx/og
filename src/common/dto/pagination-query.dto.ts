import { IsNumber, IsOptional, IsPositive } from "class-validator";

export class PaginationQueryDto {
  @IsOptional()
  @IsNumber()
  @IsPositive()
  limit: number = 10;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  page: number = 1;
}
