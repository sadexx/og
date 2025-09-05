import { initializeJwtStrategy } from "./jwt.strategy";

export const initializeStrategies = (): void => {
  initializeJwtStrategy();
};
