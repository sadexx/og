import { registerDecorator, ValidationArguments, ValidationOptions } from "class-validator";
import { GetGroupMembershipStatisticDailyDto } from "../dto";
import {
  NUMBER_OF_HOURS_IN_DAY,
  NUMBER_OF_MILLISECONDS_IN_SECOND,
  NUMBER_OF_MINUTES_IN_HOUR
} from "../../../../common/constants";

export function IsValidDateRange(maxDaysAllowed: number, validationOptions?: ValidationOptions): PropertyDecorator {
  return function (object: object, propertyName: string | symbol) {
    registerDecorator({
      name: "isValidDateRange",
      target: object.constructor,
      propertyName: propertyName as string,
      options: validationOptions,
      validator: {
        validate(_value: unknown, args: ValidationArguments): boolean {
          const dto = args.object as GetGroupMembershipStatisticDailyDto;
          const { startDate, endDate } = dto;

          if (!startDate || !endDate) {
            return true;
          }

          const periodStart = new Date(startDate);
          const periodEnd = new Date(endDate);

          if (periodStart > periodEnd) {
            return false;
          }

          const diffInMs = periodEnd.getTime() - periodStart.getTime();
          const diffInDays = Math.ceil(
            diffInMs /
              (NUMBER_OF_MILLISECONDS_IN_SECOND *
                NUMBER_OF_MINUTES_IN_HOUR *
                NUMBER_OF_MINUTES_IN_HOUR *
                NUMBER_OF_HOURS_IN_DAY)
          );

          const isValid = diffInDays <= maxDaysAllowed && diffInDays >= 0;

          return isValid;
        },

        defaultMessage(): string {
          return `Maximum ${maxDaysAllowed} days gap between startDate and endDate is allowed.`;
        }
      }
    });
  };
}
