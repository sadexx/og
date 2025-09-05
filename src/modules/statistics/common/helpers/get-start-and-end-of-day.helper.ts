/* eslint-disable @typescript-eslint/no-magic-numbers */
import { GetStartAndEndOfDayOutput } from "../outputs";

export function getStartAndEndOfDay(workoutDate: Date): GetStartAndEndOfDayOutput {
  const startOfDay = new Date(
    Date.UTC(workoutDate.getUTCFullYear(), workoutDate.getUTCMonth(), workoutDate.getUTCDate(), 0, 0, 0, 0)
  );

  const endOfDay = new Date(
    Date.UTC(workoutDate.getUTCFullYear(), workoutDate.getUTCMonth(), workoutDate.getUTCDate(), 23, 59, 59, 999)
  );

  return { startOfDay, endOfDay };
}
