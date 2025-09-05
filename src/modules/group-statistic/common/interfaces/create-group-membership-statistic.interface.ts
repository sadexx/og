import { EGroupMembershipStatisticPeriod } from "../enums";

export interface ICreateGroupMembershipStatistic {
  periodDate: Date;
  totalStrain: bigint;
  totalMaxStrain: number;
  totalAvgMaxStrain: number;
  totalCompletedQuantity: number;
  totalCompletedQuantityWithBluetoothConnection: number;
  totalCompletedQuantityWithoutBluetoothConnection: number;
  totalCaloriesBurned: number;
  totalDuration: number;
  totalNumberOfIntervals: number;
  statisticPeriod: EGroupMembershipStatisticPeriod;
  createdDate: Date;
}
