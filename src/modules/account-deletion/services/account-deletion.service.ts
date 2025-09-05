import { LessThan, Repository } from "typeorm";
import { AppDataSource } from "../../../common/configs/db.config";
import { logger } from "../../../setup/logger";
import { AwsS3Service } from "../../aws-s3/services";
import { AccountDeleteRequest } from "../schemas";
import { User } from "../../users/schemas";

export class AccountDeletionService {
  private readonly userRepository: Repository<User>;
  private readonly accountDeleteRequestRepository: Repository<AccountDeleteRequest>;
  constructor(private readonly awsS3Service = new AwsS3Service()) {
    this.userRepository = AppDataSource.getRepository(User);
    this.accountDeleteRequestRepository = AppDataSource.getRepository(AccountDeleteRequest);
  }

  public async checkAndDeleteExpiredAccounts(): Promise<void> {
    const currentDate = new Date();

    const expiredDeletionRequests = await this.accountDeleteRequestRepository.find({
      where: { requestDeletionExpires: LessThan(currentDate) },
      relations: { user: true }
    });

    for (const request of expiredDeletionRequests) {
      await this.deleteUserAndRelatedData(request.user.id);
    }
  }

  private async deleteUserAndRelatedData(userId: string): Promise<void> {
    await this.userRepository.manager.transaction(async (entityManager) => {
      const user = await entityManager.findOne(User, {
        where: { id: userId },
        relations: {
          userSettings: true,
          userNotificationSettings: true,
          userWorkoutSettings: true,
          userGripSettings: true,
          favoriteWorkouts: true,
          customExercises: true,
          customStretching: true,
          accountDeleteRequest: true,
          accountRecovery: true
        }
      });

      if (!user) {
        logger.error(`User with id:${userId} not found. Skipping...`);

        return;
      }

      if (user.avatarUrl) {
        await this.awsS3Service.delete(user.avatarUrl);
      }

      await entityManager.delete(User, { id: userId });

      logger.info(`Deleted with transaction the user with id:${user.id}`);
    });
  }
}
