import { ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";

const PAIR_LENGTH = 2;

@ValidatorConstraint({ name: "isMultiDimensionalArray", async: true })
export class IsMultiDimensionalArray implements ValidatorConstraintInterface {
  validate(items: number[][]): boolean {
    return (
      Array.isArray(items) &&
      items.every(
        (item) => Array.isArray(item) && item.length === PAIR_LENGTH && item.every((num) => typeof num === "number")
      )
    );
  }

  defaultMessage(): string {
    return "Each duration range should be an array of two numbers";
  }
}
