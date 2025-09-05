import { Between, FindOptionsWhere, MoreThan, Repository } from "typeorm";
import { AppDataSource } from "../../../common/configs/db.config";
import { EMetricType, ESortOrder } from "../../../common/enums";
import { NotFoundException } from "../../../common/exceptions";
import { toCamelCase } from "../../../common/helpers";
import { User } from "../../users/schemas";
import { FilterGlobalStatsQueryDto } from "../common/dto";
import { UserGlobalStats } from "../schemas";

export class UserGlobalStatsService {
  private readonly userGlobalStatsRepository: Repository<UserGlobalStats>;

  constructor() {
    this.userGlobalStatsRepository = AppDataSource.getRepository(UserGlobalStats);
  }

  public async getAll(
    userId: string,
    dto: FilterGlobalStatsQueryDto
  ): Promise<{
    data: UserGlobalStats[];
    pageNumber: number;
    pageCount?: number;
    currentUser?: UserGlobalStats | null;
    currentUserRank?: number | null;
  }> {
    let skip: number | undefined;
    let take: number | undefined;
    let totalPages: number | undefined;
    let pageNumber = 1;

    if (dto.limit && dto.page) {
      skip = (dto.page - 1) * dto.limit;
      take = dto.limit;
      pageNumber = dto.page;
    }

    const metricTypeCamelCase = dto.metricType ? toCamelCase(dto.metricType) : toCamelCase(EMetricType.TOTAL_STRAIN);

    const userConditions: FindOptionsWhere<User> = {
      isShownInLeaderBoard: true
    };

    if (dto.gender) {
      userConditions.gender = dto.gender;
    }

    if (dto.ageGroup && dto.ageGroup.length > 0) {
      userConditions.age = Between(dto.ageGroup[0], dto.ageGroup[1]);
    }

    if (dto.location) {
      userConditions.locationState = dto.location;
    }

    const whereConditions: FindOptionsWhere<UserGlobalStats> = {
      user: userConditions
    };

    const [globalStats, total] = await this.userGlobalStatsRepository.findAndCount({
      select: {
        user: {
          gender: true,
          age: true,
          name: true,
          locationState: true,
          avatarUrl: true,
          isShownInLeaderBoard: true
        }
      },
      where: whereConditions,
      take: take,
      skip: skip,
      order: {
        [metricTypeCamelCase]: ESortOrder.DESC
      },
      relations: { user: true }
    });

    if (dto.limit) {
      totalPages = Math.ceil(total / dto.limit);
    }

    const currentUser = await this.userGlobalStatsRepository.findOne({
      select: {
        user: {
          gender: true,
          age: true,
          name: true,
          locationState: true,
          avatarUrl: true,
          isShownInLeaderBoard: true
        }
      },
      where: { user: { id: userId } },
      relations: { user: true }
    });

    let currentUserRank: number | null = null;

    if (currentUser) {
      const userMeetsCriteria =
        (!dto.gender || currentUser.user.gender === dto.gender) &&
        (!dto.ageGroup || (currentUser.user.age >= dto.ageGroup[0] && currentUser.user.age <= dto.ageGroup[1])) &&
        (!dto.location || currentUser.user.locationState === dto.location);

      if (userMeetsCriteria) {
        const count = await this.userGlobalStatsRepository.count({
          where: {
            ...whereConditions,
            [metricTypeCamelCase as keyof typeof currentUser]: MoreThan(
              currentUser[metricTypeCamelCase as keyof UserGlobalStats]
            )
          }
        });

        currentUserRank = count + 1;
      }
    }

    return {
      data: globalStats,
      currentUser,
      currentUserRank,
      pageNumber: pageNumber,
      pageCount: totalPages
    };
  }

  public async getUserGlobalStatsByUserId(userId: string): Promise<UserGlobalStats | null> {
    const globalStats = await this.userGlobalStatsRepository.findOne({
      where: { user: { id: userId } }
    });

    if (!globalStats) {
      throw new NotFoundException("User-Global-Stats not found");
    }

    return globalStats;
  }
}
