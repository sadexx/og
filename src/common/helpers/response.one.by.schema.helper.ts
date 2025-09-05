import { plainToInstance } from "class-transformer";

/** Delete from data object all field what not is the schema */
export const responseOneBySchemaHelper = <T extends object>(schema: new () => T, data: Partial<T>): Partial<T> => {
  let temp: Partial<T> = {};

  const schemaObject = plainToInstance(schema, {}) as Partial<T>;
  const schemaObjectEntries = Object.entries(schemaObject);
  const dataObjectKeys = new Set(Object.keys(data));

  for (const [schemaKey, schemaValue] of schemaObjectEntries) {
    if (dataObjectKeys.has(schemaKey as string)) {
      temp = { ...temp, [schemaKey]: data[schemaKey as keyof T] };
    } else {
      if (schemaValue !== undefined) {
        temp = { ...temp, [schemaKey]: schemaValue };
      }
    }
  }

  return temp;
};
