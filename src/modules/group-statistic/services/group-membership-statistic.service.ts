import { Repository } from "typeorm";
import { GroupMembership } from "../../group/schemas";
import { GroupMembershipStatistic } from "../schemas";
import { AppDataSource } from "../../../common/configs/db.config";
import { CreateGroupMembershipStatisticDto } from "../common/dto";
import { findOneOrFail } from "../../../common/utils";
import { EGroupMembershipStatisticPeriod } from "../common/enums";
import { ICreateGroupMembershipStatistic } from "../common/interfaces";

export class GroupMembershipStatisticService {
  private readonly groupMembershipRepository: Repository<GroupMembership>;
  private readonly groupMembershipStatisticRepository: Repository<GroupMembershipStatistic>;

  constructor() {
    this.groupMembershipRepository = AppDataSource.getRepository(GroupMembership);
    this.groupMembershipStatisticRepository = AppDataSource.getRepository(GroupMembershipStatistic);
  }

  public async createGroupMembershipStatistic(
    groupId: string,
    userId: string,
    dto: CreateGroupMembershipStatisticDto
  ): Promise<string> {
    const groupMembership = await findOneOrFail(this.groupMembershipRepository, {
      where: { group: { id: groupId }, user: { id: userId } }
    });

    const dailyStatistic = await this.createOrUpdateStatistic(
      groupMembership,
      dto,
      EGroupMembershipStatisticPeriod.DAILY
    );

    await this.createOrUpdateStatistic(groupMembership, dto, EGroupMembershipStatisticPeriod.MONTHLY);

    return dailyStatistic.id;
  }

  private async createOrUpdateStatistic(
    groupMembership: GroupMembership,
    dto: CreateGroupMembershipStatisticDto,
    statisticPeriod: EGroupMembershipStatisticPeriod
  ): Promise<GroupMembershipStatistic> {
    const periodDate = this.getPeriodDate(dto.createdDate, statisticPeriod);

    const existingStatistic = await this.groupMembershipStatisticRepository.findOne({
      where: {
        groupMembership: { id: groupMembership.id },
        periodDate,
        statisticPeriod
      }
    });

    const statisticDto = this.constructStatisticDto(dto, existingStatistic, statisticPeriod, periodDate);

    if (existingStatistic) {
      await this.groupMembershipStatisticRepository.update(existingStatistic.id, statisticDto);

      return existingStatistic;
    }

    const newStats = this.groupMembershipStatisticRepository.create({
      groupMembership,
      ...statisticDto
    });

    return await this.groupMembershipStatisticRepository.save(newStats);
  }

  private constructStatisticDto(
    dto: CreateGroupMembershipStatisticDto,
    existingStatistic: GroupMembershipStatistic | null,
    statisticPeriod: EGroupMembershipStatisticPeriod,
    periodDate: Date
  ): ICreateGroupMembershipStatistic {
    const totalCompletedQuantity =
      dto.totalCompletedQuantityWithBluetoothConnection + dto.totalCompletedQuantityWithoutBluetoothConnection;

    return {
      statisticPeriod,
      periodDate,
      totalStrain: BigInt(existingStatistic?.totalStrain || 0) + BigInt(dto.totalStrain),
      totalMaxStrain: (existingStatistic?.totalMaxStrain || 0) + dto.totalMaxStrain,
      totalAvgMaxStrain: (existingStatistic?.totalAvgMaxStrain || 0) + dto.totalAvgMaxStrain,
      totalCompletedQuantity: (existingStatistic?.totalCompletedQuantity || 0) + totalCompletedQuantity,
      totalCompletedQuantityWithBluetoothConnection:
        (existingStatistic?.totalCompletedQuantityWithBluetoothConnection || 0) +
        dto.totalCompletedQuantityWithBluetoothConnection,
      totalCompletedQuantityWithoutBluetoothConnection:
        (existingStatistic?.totalCompletedQuantityWithoutBluetoothConnection || 0) +
        dto.totalCompletedQuantityWithoutBluetoothConnection,
      totalCaloriesBurned: (existingStatistic?.totalCaloriesBurned || 0) + dto.totalCaloriesBurned,
      totalDuration: (existingStatistic?.totalDuration || 0) + dto.totalDuration,
      totalNumberOfIntervals: (existingStatistic?.totalNumberOfIntervals || 0) + dto.totalNumberOfIntervals,
      createdDate: new Date(dto.createdDate)
    };
  }

  private getPeriodDate(createdDate: Date, statisticPeriod: EGroupMembershipStatisticPeriod): Date {
    const date = new Date(createdDate);

    switch (statisticPeriod) {
      case EGroupMembershipStatisticPeriod.DAILY:
        return new Date(date.getFullYear(), date.getMonth(), date.getDate());
      case EGroupMembershipStatisticPeriod.MONTHLY:
        return new Date(date.getFullYear(), date.getMonth(), 1);
    }
  }
}
