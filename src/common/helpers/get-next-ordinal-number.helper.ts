export function getNextOrdinalNumber<T extends { ordinalNumber: number }>(items: T[]): number {
  return Math.max(...items.map((item) => item.ordinalNumber), 0) + 1;
}
