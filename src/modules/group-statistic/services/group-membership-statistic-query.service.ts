import { Repository, SelectQueryBuilder } from "typeorm";
import { AppDataSource } from "../../../common/configs/db.config";
import { GroupMembershipStatistic } from "../schemas";
import { EGroupMembershipStatisticPeriod } from "../common/enums";
import {
  GetGroupMembershipStatisticDailyDto,
  GetGroupMembershipStatisticMonthlyDto,
  GetGroupStatisticCalendarDto
} from "../common/dto";
import { IGetGroupMembershipStatisticCalendarOutput, IGetGroupMembershipStatisticOutput } from "../common/outputs";

export class GroupMembershipStatisticQueryService {
  private readonly groupMembershipStatisticRepository: Repository<GroupMembershipStatistic>;

  constructor() {
    this.groupMembershipStatisticRepository = AppDataSource.getRepository(GroupMembershipStatistic);
  }

  public async getDailyStatistic(
    groupId: string,
    dto: GetGroupMembershipStatisticDailyDto
  ): Promise<IGetGroupMembershipStatisticOutput[]> {
    const queryBuilder = this.buildBaseStatisticsQuery()
      .where(
        `group.id = :groupId AND statistics.statistic_period = :period 
				AND statistics.period_date BETWEEN :startDate AND :endDate`,
        {
          groupId,
          period: EGroupMembershipStatisticPeriod.DAILY,
          startDate: dto.startDate,
          endDate: dto.endDate
        }
      )
      .groupBy("groupMembership.id");

    if (dto.groupMembershipId) {
      queryBuilder.andWhere("groupMembership.id = :groupMembershipId", {
        groupMembershipId: dto.groupMembershipId
      });
    }

    return await queryBuilder.getRawMany();
  }

  public async getMonthlyStatistic(
    groupId: string,
    dto: GetGroupMembershipStatisticMonthlyDto
  ): Promise<IGetGroupMembershipStatisticOutput[]> {
    const queryBuilder = this.buildBaseStatisticsQuery()
      .where(
        `group.id = :groupId AND statistics.statistic_period = :period
				 AND statistics.period_date BETWEEN :startDate AND :endDate`,
        {
          groupId,
          period: EGroupMembershipStatisticPeriod.MONTHLY,
          startDate: dto.startDate,
          endDate: dto.endDate
        }
      )
      .groupBy("groupMembership.id");

    if (dto.groupMembershipId) {
      queryBuilder.andWhere("groupMembership.id = :groupMembershipId", {
        groupMembershipId: dto.groupMembershipId
      });
    }

    return await queryBuilder.getRawMany();
  }

  private buildBaseStatisticsQuery(): SelectQueryBuilder<GroupMembershipStatistic> {
    return this.groupMembershipStatisticRepository
      .createQueryBuilder("statistics")
      .select("groupMembership.id", "groupMembershipId")
      .addSelect(
        `JSON_AGG(JSON_BUILD_OBJECT(
				'id', statistics.id, 
				'totalStrain', statistics.total_strain, 
				'totalMaxStrain', statistics.total_max_strain,
				'totalAvgMaxStrain', statistics.total_avg_max_strain,
				'totalCompletedQuantity', statistics.total_completed_quantity,
				'totalCompletedQuantityWithBluetoothConnection', statistics.total_completed_quantity_with_bluetooth_connection,
				'totalCompletedQuantityWithoutBluetoothConnection', statistics.total_completed_quantity_without_bluetooth_connection,
				'totalCaloriesBurned', statistics.total_calories_burned, 
				'totalDuration', statistics.total_duration,
				'totalNumberOfIntervals', statistics.total_number_of_intervals,
				'statisticPeriod', statistics.statistic_period,
				'periodDate', statistics.period_date,
				'createdDate', statistics.created_date,
				'updateDate', statistics.update_date
			) ORDER BY statistics.period_date ASC)`,
        "data"
      )
      .innerJoin("statistics.groupMembership", "groupMembership")
      .innerJoin("groupMembership.group", "group");
  }

  public async getGroupStatisticCalendar(
    groupId: string,
    dto: GetGroupStatisticCalendarDto
  ): Promise<IGetGroupMembershipStatisticCalendarOutput[]> {
    const date = new Date(dto.date);
    const year = date.getFullYear();
    const month = date.getMonth();

    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);

    const queryResult = await this.groupMembershipStatisticRepository
      .createQueryBuilder("statistics")
      .select("DISTINCT DATE(statistics.period_date)", "date")
      .innerJoin("statistics.groupMembership", "groupMembership")
      .innerJoin("groupMembership.group", "group")
      .where(
        `group.id = :groupId AND statistics.period_date BETWEEN :firstDayOfMonth AND :lastDayOfMonth
				AND statistics.statistic_period = :statisticPeriod`,
        {
          groupId,
          firstDayOfMonth,
          lastDayOfMonth,
          statisticPeriod: EGroupMembershipStatisticPeriod.DAILY
        }
      )
      .getRawMany<{ date: string }>();

    const daysWithData = new Set<number>();
    for (const row of queryResult) {
      daysWithData.add(new Date(row.date).getDate());
    }

    const totalDaysInMonth = lastDayOfMonth.getDate();
    const statisticCalendar: IGetGroupMembershipStatisticCalendarOutput[] = [];

    for (let day = 1; day <= totalDaysInMonth; day++) {
      const currentDate = new Date(year, month, day);
      statisticCalendar.push({
        date: currentDate,
        hasData: daysWithData.has(day)
      });
    }

    return statisticCalendar;
  }
}
