import { registerDecorator, ValidationArguments, ValidationOptions } from "class-validator";
import { UpdateSubscriptionPlanDto } from "../dto";
import { ESubscriptionPlanType } from "../enums";

export function IsFreePlanActiveUnchangeable(validationOptions?: ValidationOptions): PropertyDecorator {
  return function (object: object, propertyName: string | symbol) {
    registerDecorator({
      name: "isFreePlanActiveUnchangeable",
      target: object.constructor,
      propertyName: propertyName as string,
      options: validationOptions,
      validator: {
        validate(value: UpdateSubscriptionPlanDto, args: ValidationArguments): boolean {
          if (args.property === ESubscriptionPlanType.FREE && value) {
            if (value.isActive !== undefined) {
              return false;
            }
          }

          return true;
        },

        defaultMessage() {
          return "Cannot modify isActive property for FREE subscription plan. The FREE plan must always remain active.";
        }
      }
    });
  };
}
