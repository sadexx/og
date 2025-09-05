import { logger } from "../../setup/logger";

export const globalQueryTransformer: Record<string, (value: string) => unknown> = {
  page: (value: string): number => parseInt(value, 10),
  limit: (value: string): number => parseInt(value, 10),
  excludeIds: safeJsonParse<string[]>(),
  durationRanges: safeJsonParse<number[][]>(),
  difficulties: safeJsonParse<string[]>(),
  focalBodyPartIds: safeJsonParse<string[]>(),
  ageGroup: safeJsonParse<number[]>(),
  mainBodyPart: safeJsonParse<string[]>(),
  muscleGroups: safeJsonParse<string[]>(),
  canBeSecondary: safeJsonParse<boolean>()
};

function safeJsonParse<T>(): (value: string) => T {
  return (value: string): T => {
    try {
      return JSON.parse(value) as T;
    } catch (error) {
      logger.error(`Error parsing value: ${value}`, error);

      return [] as unknown as T;
    }
  };
}
