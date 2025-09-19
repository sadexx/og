import { EntityManager, LessThan, MoreThan, Not, Repository } from "typeorm";
import { SubscriptionPlan, SubscriptionPlanAssignment } from "../schemas";
import { AppDataSource } from "../../../common/configs/db.config";
import { ESubscriptionPlanType } from "../common/enums";
import { ISubscriptionPlanAssignment } from "../common/interfaces";
import { User } from "../../users/schemas";
import { findOneOrFail } from "../../../common/utils";
import { CoinTransactionsService } from "../../coin-transactions/services";
import { redisClient } from "../../../common/configs/redis.config";
import {
  NUMBER_OF_HOURS_IN_DAY,
  NUMBER_OF_MINUTES_IN_HOUR,
  NUMBER_OF_SECONDS_IN_MINUTE
} from "../../../common/constants";
import { ERole } from "../../users/common/enums";

export class SubscriptionPlanAssignmentService {
  private readonly subscriptionPlanRepository: Repository<SubscriptionPlan>;
  private readonly subscriptionPlanAssignmentRepository: Repository<SubscriptionPlanAssignment>;

  constructor(private readonly coinTransactionsService = new CoinTransactionsService()) {
    this.subscriptionPlanRepository = AppDataSource.getRepository(SubscriptionPlan);
    this.subscriptionPlanAssignmentRepository = AppDataSource.getRepository(SubscriptionPlanAssignment);
  }

  public async getSubscriptionAssignmentPlanType(userId: string): Promise<ESubscriptionPlanType> {
    const cacheKey = `subscription-plan-type:${userId}`;
    const cachedData = await redisClient.get(cacheKey);

    if (cachedData) {
      return cachedData as ESubscriptionPlanType;
    }

    const subscriptionAssignment = await this.subscriptionPlanAssignmentRepository.findOne({
      where: { endDate: MoreThan(new Date()), user: { id: userId, role: Not(ERole.ADMIN) } },
      relations: { subscriptionPlan: true }
    });

    const subscriptionPlanType = subscriptionAssignment
      ? subscriptionAssignment.subscriptionPlan.type
      : ESubscriptionPlanType.FREE;

    const cacheTtl = NUMBER_OF_HOURS_IN_DAY * NUMBER_OF_MINUTES_IN_HOUR * NUMBER_OF_SECONDS_IN_MINUTE;
    await redisClient.set(cacheKey, subscriptionPlanType, "EX", cacheTtl);

    return subscriptionPlanType;
  }

  public async processSubscriptionPurchase(
    manager: EntityManager,
    userId: string,
    subscriptionPlanId: string
  ): Promise<void> {
    const existingSubscriptionPlanAssignment = await manager.findOne(SubscriptionPlanAssignment, {
      where: { user: { id: userId } }
    });

    if (existingSubscriptionPlanAssignment) {
      await this.updateSubscriptionPlanAssignment(manager, existingSubscriptionPlanAssignment, subscriptionPlanId);
    } else {
      await this.constructAndCreateSubscriptionPlanAssignment(manager, userId, subscriptionPlanId);
    }

    await this.addSubscriptionCoins(manager, userId, subscriptionPlanId);
    await this.invalidateSubscriptionPlanTypeCache(userId);
  }

  private async updateSubscriptionPlanAssignment(
    manager: EntityManager,
    existingSubscriptionPlanAssignment: SubscriptionPlanAssignment,
    subscriptionPlanId: string
  ): Promise<void> {
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 1);

    await manager.update(SubscriptionPlanAssignment, existingSubscriptionPlanAssignment.id, {
      endDate,
      subscriptionPlan: { id: subscriptionPlanId }
    });
  }

  private async constructAndCreateSubscriptionPlanAssignment(
    manager: EntityManager,
    userId: string,
    subscriptionPlanId: string
  ): Promise<void> {
    const subscriptionPlanAssignmentDto = this.constructSubscriptionPlanAssignmentDto(userId, subscriptionPlanId);
    await this.createSubscriptionPlanAssignment(manager, subscriptionPlanAssignmentDto);
  }

  private async createSubscriptionPlanAssignment(
    manager: EntityManager,
    dto: ISubscriptionPlanAssignment
  ): Promise<void> {
    const subscriptionPlanAssignmentDto = manager.create(SubscriptionPlanAssignment, dto);
    await manager.save(SubscriptionPlanAssignment, subscriptionPlanAssignmentDto);
  }

  private constructSubscriptionPlanAssignmentDto(
    userId: string,
    subscriptionPlanId: string
  ): ISubscriptionPlanAssignment {
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 1);

    return {
      endDate,
      subscriptionPlan: { id: subscriptionPlanId } as SubscriptionPlan,
      user: { id: userId } as User
    };
  }

  private async addSubscriptionCoins(
    manager: EntityManager,
    userId: string,
    subscriptionPlanId: string
  ): Promise<void> {
    const subscriptionPlan = await findOneOrFail(this.subscriptionPlanRepository, {
      select: { id: true, coins: true },
      where: { id: subscriptionPlanId }
    });

    if (subscriptionPlan.coins > 0) {
      await this.coinTransactionsService.addCoinsToWallet(manager, userId, subscriptionPlan.coins);
    }
  }

  public async checkExpiredSubscriptionPlanAssignments(): Promise<void> {
    const expiredSubscriptions = await this.subscriptionPlanAssignmentRepository.find({
      where: { endDate: LessThan(new Date()) }
    });

    if (expiredSubscriptions.length > 0) {
      await this.removeExpiredSubscriptionPlanAssignments(expiredSubscriptions);
    }
  }

  private async removeExpiredSubscriptionPlanAssignments(
    expiredSubscriptions: SubscriptionPlanAssignment[]
  ): Promise<void> {
    await this.subscriptionPlanAssignmentRepository.remove(expiredSubscriptions);
  }

  public async invalidateSubscriptionPlanTypeCache(userId: string): Promise<void> {
    const cacheKey = `subscription-plan-type:${userId}`;
    await redisClient.del(cacheKey);
  }
}
