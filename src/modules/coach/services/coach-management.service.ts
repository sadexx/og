import { Repository } from "typeorm";
import { BadRequestException, ForbiddenException, NotFoundException } from "../../../common/exceptions";
import { User } from "../../users/schemas";
import { CreateCoachDto, GetAllCoachesDto, UpdateCoachDto } from "../common/dto";
import { AppDataSource } from "../../../common/configs/db.config";
import bcrypt from "bcrypt";
import { BCRYPT_SALT_ROUNDS } from "../../../common/configs/config";
import { ERole } from "../../users/common/enums";
import { EmailService } from "../../email/services";
import { Coach, CoachSubscription } from "../schemas";
import { UserService } from "../../users/services";
import { PaginationQueryOutput } from "../../../common/outputs";
import { AllCoachSubscriptionsStatisticsOutput, CoachSubscriptionStatisticOutput } from "../common/outputs";
import { IRawCoachSubscriptionStatistic } from "../common/interfaces";
import { ESortOrder } from "../../../common/enums";
import { JwtPayload } from "../../auth/common/dto";
import { AwsS3Service } from "../../aws-s3/services";

export class CoachManagementService {
  private readonly usersRepository: Repository<User>;
  private readonly coachRepository: Repository<Coach>;
  private readonly coachSubscriptionRepository: Repository<CoachSubscription>;

  constructor(
    private readonly userService = new UserService(),
    private readonly emailService = new EmailService(),
    private readonly awsS3Service = new AwsS3Service()
  ) {
    this.usersRepository = AppDataSource.getRepository(User);
    this.coachRepository = AppDataSource.getRepository(Coach);
    this.coachSubscriptionRepository = AppDataSource.getRepository(CoachSubscription);
  }

  public async getAllCoaches(user: JwtPayload, dto: GetAllCoachesDto): Promise<PaginationQueryOutput<Coach>> {
    const queryBuilder = this.coachRepository
      .createQueryBuilder("coach")
      .leftJoin("coach.user", "user")
      .addSelect(["user.id", "user.name", "user.email"])
      .leftJoin("coach.coachSubscriptions", "coachSubscription")
      .addSelect(["coachSubscription.id", "coachSubscription.price"])
      .skip((dto.page - 1) * dto.limit)
      .take(dto.limit);

    if (user.role === ERole.USER) {
      queryBuilder
        .leftJoin(
          "coachSubscription.userSubscriptions",
          "userSubscription",
          "userSubscription.user_id = :userId AND userSubscription.end_date > :currentDate",
          { userId: user.id, currentDate: new Date() }
        )
        .addSelect(["userSubscription.id", "userSubscription.endDate", "userSubscription.isAutoRenewable"]);
    }

    const [coaches, total] = await queryBuilder.getManyAndCount();

    return {
      data: coaches,
      pageNumber: dto.page,
      pageCount: Math.ceil(total / dto.limit)
    };
  }

  public async getCoachSubscriptionsStatistics(): Promise<AllCoachSubscriptionsStatisticsOutput> {
    const currentDate = new Date();
    const rawResult = await this.coachRepository
      .createQueryBuilder("coach")
      .innerJoin("coach.user", "user")
      .leftJoin("coach.coachSubscriptions", "coachSubscription")
      .leftJoin("coachSubscription.userSubscriptions", "userSubscription", "userSubscription.endDate > :now", {
        now: currentDate
      })
      .select([
        "coach.id AS coach_id",
        "user.name AS user_name",
        "COUNT(userSubscription.id) AS count",
        "SUM(COUNT(userSubscription.id)) OVER() AS total_count"
      ])
      .groupBy("coach.id, user.name")
      .orderBy("count", ESortOrder.DESC)
      .getRawMany<IRawCoachSubscriptionStatistic>();

    const coaches: CoachSubscriptionStatisticOutput[] = rawResult.map((row) => ({
      id: row.coach_id,
      name: row.user_name,
      activeSubscriptionsCount: Number(row.count)
    }));

    const totalActiveSubscriptions = Number(rawResult[0]?.total_count ?? 0);

    return {
      totalActiveSubscriptions,
      coaches
    };
  }

  public async getCoachById(id: string): Promise<Coach> {
    const coach = await this.coachRepository.findOne({
      select: {
        id: true,
        description: true,
        coverImageUrl: true,
        user: {
          id: true,
          name: true,
          email: true,
          avatarUrl: true
        },
        coachSubscriptions: {
          id: true,
          price: true
        }
      },
      where: { id },
      relations: { user: true, coachSubscriptions: true }
    });

    if (!coach) {
      throw new NotFoundException("Coach not found.");
    }

    return coach;
  }

  public async createCoach(dto: CreateCoachDto): Promise<void> {
    const existingUser = await this.usersRepository.findOne({
      select: { email: true },
      where: { email: dto.email }
    });

    if (existingUser) {
      throw new ForbiddenException("Email already exists");
    }

    const user = await this.constructAndCreateCoach(dto);
    await this.emailService.sendCoachWelcomeEmail(user, dto.password);
  }

  private async constructAndCreateCoach(dto: CreateCoachDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(dto.password, BCRYPT_SALT_ROUNDS);

    const user = this.usersRepository.create({
      email: dto.email,
      password: hashedPassword,
      role: ERole.COACH,
      name: dto.name,
      areTermsAccepted: true
    });
    await this.usersRepository.save(user);

    const coach = this.coachRepository.create({
      user,
      description: dto.description,
      coverImageUrl: dto.coverImageUrl
    });
    await this.coachRepository.save(coach);

    await this.createCoachSubscription(dto, coach);
    await this.userService.createUserSettings(user.id);

    return user;
  }

  private async createCoachSubscription(dto: CreateCoachDto, coach: Coach): Promise<void> {
    const coachSubscription = this.coachSubscriptionRepository.create({
      coach,
      price: dto.subscriptionPrice
    });
    await this.coachSubscriptionRepository.save(coachSubscription);
  }

  public async updateCoach(id: string, dto: UpdateCoachDto): Promise<void> {
    const coach = await this.coachRepository.findOne({
      where: { id },
      relations: {
        user: true,
        coachSubscriptions: true
      }
    });

    if (!coach) {
      throw new NotFoundException("Coach not found.");
    }

    const coachPayload: Partial<Coach> = {
      description: dto.description,
      coverImageUrl: dto.coverImageUrl
    };
    const userPayload: Partial<User> = {
      email: dto.email,
      name: dto.name
    };

    if (dto.password) {
      const hashedPassword = await bcrypt.hash(dto.password, BCRYPT_SALT_ROUNDS);
      userPayload.password = hashedPassword;
    }

    if (dto.subscriptionPrice) {
      const subscription = coach.coachSubscriptions[0];
      await this.coachSubscriptionRepository.update(subscription.id, {
        price: dto.subscriptionPrice
      });
    }

    if (dto.coverImageUrl && coach.coverImageUrl) {
      await this.awsS3Service.delete(coach.coverImageUrl);
    }

    await this.usersRepository.update(coach.user.id, userPayload);
    await this.coachRepository.update(coach.id, coachPayload);
  }

  public async deleteCoach(id: string): Promise<void> {
    const coach = await this.coachRepository.findOne({
      where: { id },
      relations: {
        user: true,
        coachSubscriptions: { userSubscriptions: true }
      }
    });

    if (!coach) {
      throw new NotFoundException("Coach not found.");
    }

    this.hasActiveSubscriptions(coach.coachSubscriptions);

    if (coach.coverImageUrl) {
      await this.awsS3Service.delete(coach.coverImageUrl);
    }

    if (coach.user.avatarUrl) {
      await this.awsS3Service.delete(coach.user.avatarUrl);
    }

    await this.usersRepository.remove(coach.user);
  }

  private hasActiveSubscriptions(coachSubscriptions: CoachSubscription[]): void {
    const currentDate = new Date();

    for (const subscription of coachSubscriptions) {
      for (const userSubscription of subscription.userSubscriptions) {
        if (userSubscription.endDate > currentDate) {
          throw new BadRequestException("Cannot delete coach because there are active user subscriptions.");
        }
      }
    }
  }
}
