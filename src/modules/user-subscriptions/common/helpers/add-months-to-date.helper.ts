/* eslint-disable @typescript-eslint/no-magic-numbers */

export function addMonthsToDate(months: number): Date {
  const endDate = new Date();
  endDate.setMonth(endDate.getMonth() + months);
  endDate.setHours(23, 59, 59, 999);

  return endDate;
}
