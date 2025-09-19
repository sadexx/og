import { ValidationOptions, registerDecorator, ValidationArguments } from "class-validator";
import { CreateAppStoreProductDto } from "../dto";
import { EAppStoreProductType } from "../enums";

export function IsAppStoreProductValid(validationOptions?: ValidationOptions): PropertyDecorator {
  return function (object: object, propertyName: string | symbol) {
    registerDecorator({
      name: "isAppStoreProductValid",
      target: object.constructor,
      propertyName: propertyName as string,
      options: validationOptions,
      validator: {
        validate(value: EAppStoreProductType, args: ValidationArguments): boolean {
          const dto = args.object as CreateAppStoreProductDto;

          if (value === EAppStoreProductType.SUBSCRIPTION_PLAN) {
            return dto.subscriptionPlanId !== undefined && dto.quantity === 1;
          }

          if (value === EAppStoreProductType.COINS) {
            return dto.subscriptionPlanId === undefined;
          }

          return true;
        },

        defaultMessage(args: ValidationArguments) {
          const value = args.value as EAppStoreProductType;

          if (value === EAppStoreProductType.SUBSCRIPTION_PLAN) {
            return "subscriptionPlanId is required and quantity must equal 1.";
          }

          if (value === EAppStoreProductType.COINS) {
            return "subscriptionPlanId must not be provided.";
          }

          return "Invalid App Store product configuration.";
        }
      }
    });
  };
}
