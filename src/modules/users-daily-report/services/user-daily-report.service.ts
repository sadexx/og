import { Between, Repository } from "typeorm";
import { AppDataSource } from "../../../common/configs/db.config";
import { EMetricType, ESortOrder } from "../../../common/enums";
import { NotFoundException, BadRequestException } from "../../../common/exceptions";
import { toCamelCase } from "../../../common/helpers";
import { FilterUserDailyReportQueryDto } from "../common/dto";
import { UserDailyReport } from "../schemas";
import { getStartAndEndOfDay } from "../../statistics/common/helpers";
import { PaginationQueryOutput } from "../../../common/outputs";

export class UserDailyReportService {
  private readonly userDailyReportRepository: Repository<UserDailyReport>;

  constructor() {
    this.userDailyReportRepository = AppDataSource.getRepository(UserDailyReport);
  }

  public async getAll(
    userId: string,
    dto: FilterUserDailyReportQueryDto
  ): Promise<PaginationQueryOutput<UserDailyReport>> {
    const sortField = dto.metricType ? toCamelCase(dto.metricType) : toCamelCase(EMetricType.TOTAL_STRAIN);
    const sortOrder = dto.sortOrder || ESortOrder.DESC;

    const order: Record<string, ESortOrder> = {};

    if (sortField) {
      order[sortField] = sortOrder;
    }

    const [dailyReports, total] = await this.userDailyReportRepository.findAndCount({
      where: { user: { id: userId } },
      order: order,
      skip: (dto.page - 1) * dto.limit,
      take: dto.limit
    });

    const totalPages = Math.ceil(total / dto.limit);

    return {
      data: dailyReports,
      pageNumber: dto.page,
      pageCount: totalPages
    };
  }

  public async getTopDay(userId: string, dto: FilterUserDailyReportQueryDto): Promise<UserDailyReport> {
    const orderField = dto.metricType ? toCamelCase(dto.metricType) : toCamelCase(EMetricType.TOTAL_STRAIN);

    const topDailyReport = await this.userDailyReportRepository.findOne({
      where: { user: { id: userId } },
      order: {
        [orderField]: ESortOrder.DESC
      }
    });

    if (!topDailyReport) {
      throw new NotFoundException("Top-Daily-Report not found");
    }

    return topDailyReport;
  }

  public async getByDate(userId: string, dto: FilterUserDailyReportQueryDto): Promise<UserDailyReport | null> {
    if (!dto.startDate) {
      throw new BadRequestException("Start-date is required");
    }

    const date = new Date(dto.startDate);
    const { startOfDay, endOfDay } = getStartAndEndOfDay(date);

    const dailyReport = await this.userDailyReportRepository.findOne({
      where: {
        user: { id: userId },
        createdDate: Between(startOfDay, endOfDay)
      },
      relations: {
        workoutDetailLogs: true
      }
    });

    if (!dailyReport) {
      throw new NotFoundException("Daily-Report not found");
    }

    return dailyReport;
  }
}
