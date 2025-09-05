import { IsDateString, IsNotEmpty } from "class-validator";

export class GetGroupStatisticCalendarDto {
  @IsNotEmpty()
  @IsDateString()
  date: Date;
}
