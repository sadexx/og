import { EPlatformType } from "../enums";

export interface OptionalDeviceFields {
  deviceName?: string;
  platform?: EPlatformType;
  platformVersion?: string;
}
