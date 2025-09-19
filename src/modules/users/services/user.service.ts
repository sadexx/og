import { Not, Repository } from "typeorm";
import { AppDataSource } from "../../../common/configs/db.config";
import bcrypt from "bcrypt";
import { BCRYPT_SALT_ROUNDS } from "../../../common/configs/config";
import { logger } from "../../../setup/logger";
import { NotFoundException, BadRequestException, ForbiddenException } from "../../../common/exceptions";
import { AwsS3Service } from "../../aws-s3/services";
import { AccountDeleteRequest } from "../../account-deletion/schemas";
import { EmailService } from "../../email/services";
import { GripType } from "../../grip-types/schemas";
import { RollingPlan } from "../../rolling-plan/schemas";
import { SettingsService } from "../../settings/services";
import {
  UserSettings,
  UserNotificationSettings,
  UserWorkoutSettings,
  UserGripSettings,
  UserWallet
} from "../../user-additional-entities/schemas";
import { UpdateUserDto, UpdateUserPasswordDto } from "../common/dto";
import { UserWithPasswordStatus } from "../common/interfaces";
import { User } from "../schemas";

export class UserService {
  private readonly userRepository: Repository<User>;
  private readonly userSettingsRepository: Repository<UserSettings>;
  private readonly userNotificationSettingsRepository: Repository<UserNotificationSettings>;
  private readonly userWorkoutSettingsRepository: Repository<UserWorkoutSettings>;
  private readonly gripTypeRepository: Repository<GripType>;
  private readonly accountDeleteRequestRepository: Repository<AccountDeleteRequest>;
  private readonly userWalletRepository: Repository<UserWallet>;

  constructor(
    private readonly settingsService = new SettingsService(),
    private readonly awsS3Service = new AwsS3Service(),
    private readonly emailService = new EmailService()
  ) {
    this.userRepository = AppDataSource.getRepository(User);
    this.userSettingsRepository = AppDataSource.getRepository(UserSettings);
    this.userNotificationSettingsRepository = AppDataSource.getRepository(UserNotificationSettings);
    this.userWorkoutSettingsRepository = AppDataSource.getRepository(UserWorkoutSettings);
    this.gripTypeRepository = AppDataSource.getRepository(GripType);
    this.accountDeleteRequestRepository = AppDataSource.getRepository(AccountDeleteRequest);
    this.userWalletRepository = AppDataSource.getRepository(UserWallet);
  }

  public async getById(id: string): Promise<UserWithPasswordStatus> {
    const user = await this.userRepository
      .createQueryBuilder("user")
      .select([
        "user.id",
        "user.email",
        "user.password",
        "user.name",
        "user.gender",
        "user.age",
        "user.weight",
        "user.avatarUrl",
        "user.locationCity",
        "user.locationState",
        "user.weightMeasurementSystem",
        "user.areTermsAccepted",
        "user.isShownInLeaderBoard",
        "user.isEmailConfirmed",
        "user.isSurveyPassed",
        "user.role",
        "user.createdDate",
        "user.updatedDate"
      ])
      .leftJoinAndSelect("user.userSettings", "userSettings")
      .leftJoinAndSelect("user.userNotificationSettings", "userNotificationSettings")
      .leftJoinAndSelect("user.userWorkoutSettings", "userWorkoutSettings")
      .leftJoinAndSelect("user.userGripSettings", "userGripSettings")
      .leftJoinAndSelect("userGripSettings.gripType", "gripType")
      .leftJoinAndSelect("user.coach", "coach")
      .leftJoin("user.userSubscriptions", "userSubscriptions", "userSubscriptions.premiumSubscription IS NOT NULL")
      .addSelect(["userSubscriptions.id", "userSubscriptions.endDate", "userSubscriptions.isAutoRenewable"])
      .leftJoin("userSubscriptions.premiumSubscription", "premiumSubscription")
      .addSelect(["premiumSubscription.id", "premiumSubscription.price", "premiumSubscription.duration"])
      .where("user.id = :id", { id })
      .getOne();

    if (!user) {
      throw new NotFoundException("User not found");
    }

    const { password, ...userWithoutPassword } = user;

    const userWithPasswordStatus: UserWithPasswordStatus = {
      ...userWithoutPassword,
      isPasswordSet: Boolean(password && password !== "")
    };

    return userWithPasswordStatus;
  }

  public async getUserWallet(userId: string): Promise<UserWallet> {
    const userWallet = await this.userWalletRepository.findOne({
      select: {
        id: true,
        coinBalance: true
      },
      where: { user: { id: userId } }
    });

    if (!userWallet) {
      throw new NotFoundException("User wallet not found.");
    }

    return userWallet;
  }

  public async createUserSettings(id: string): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { id }
    });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    const defaultWorkoutSettings = await this.settingsService.getSettings();
    const userWorkoutSettings = new UserWorkoutSettings();
    Object.assign(userWorkoutSettings, defaultWorkoutSettings);

    user.userSettings = new UserSettings();
    user.userNotificationSettings = new UserNotificationSettings();
    user.userGripSettings = new UserGripSettings();
    user.rollingPlan = new RollingPlan();
    user.userWallet = new UserWallet();
    user.userWorkoutSettings = userWorkoutSettings;

    await this.userRepository.save(user);
  }

  public async surveyConfirmation(id: string): Promise<{ message: string }> {
    const user = await this.userRepository.findOne({
      where: { id }
    });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    await this.userRepository.update(user.id, { isSurveyPassed: true });

    return { message: "Survey confirmed" };
  }

  public async update(id: string, dto: UpdateUserDto): Promise<UserWithPasswordStatus> {
    const user = await this.userRepository.findOne({
      select: {
        id: true,
        email: true,
        name: true,
        password: true,
        gender: true,
        age: true,
        weight: true,
        avatarUrl: true,
        locationCity: true,
        locationState: true,
        weightMeasurementSystem: true,
        areTermsAccepted: true,
        isShownInLeaderBoard: true,
        isEmailConfirmed: true,
        isSurveyPassed: true
      },
      where: { id },
      relations: {
        userSettings: true,
        userNotificationSettings: true,
        userWorkoutSettings: true,
        userGripSettings: { gripType: true }
      }
    });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    if (dto.email && dto.email !== user.email) {
      const emailInUse = await this.userRepository.findOne({
        where: {
          email: dto.email,
          id: Not(id)
        }
      });

      if (emailInUse) {
        throw new BadRequestException("Email is already in use");
      }

      if (user.isEmailConfirmed === true) {
        throw new ForbiddenException("Email already confirmed and cannot be changed");
      }
    }

    if (dto.userSettings) {
      user.userSettings = this.userSettingsRepository.merge(user.userSettings, dto.userSettings);
    }

    if (dto.userNotificationSettings) {
      user.userNotificationSettings = this.userNotificationSettingsRepository.merge(
        user.userNotificationSettings,
        dto.userNotificationSettings
      );
    }

    if (dto.userWorkoutSettings) {
      user.userWorkoutSettings = this.userWorkoutSettingsRepository.merge(
        user.userWorkoutSettings,
        dto.userWorkoutSettings
      );
    }

    if (dto.userGripSettings) {
      const gripTypeId = dto.userGripSettings.gripTypeId;

      if (gripTypeId) {
        const gripVersion = await this.gripTypeRepository.findOne({
          where: { id: gripTypeId }
        });

        if (!gripVersion) {
          throw new NotFoundException("Grip type not found");
        }

        user.userGripSettings.gripType = gripVersion;
      }

      if (!gripTypeId) {
        user.userGripSettings.gripType = null;
      }
    }

    if (dto.avatarUrl && user.avatarUrl) {
      await this.awsS3Service.delete(user.avatarUrl);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { userGripSettings, ...updateDtoWithoutGripSettings } = dto;
    const updateUser = this.userRepository.merge(user, updateDtoWithoutGripSettings);
    await this.userRepository.save(updateUser);

    const { password, ...userWithoutPassword } = user;

    const userWithPasswordStatus: UserWithPasswordStatus = {
      ...userWithoutPassword,
      isPasswordSet: Boolean(password && password !== "")
    };

    return userWithPasswordStatus;
  }

  public async updateUserPassword(id: string, dto: UpdateUserPasswordDto): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { id }
    });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    let passwordIsValid = false;

    if (user.password === "") {
      passwordIsValid = dto.oldPassword === "";
    } else {
      passwordIsValid = await bcrypt.compare(dto.oldPassword, user.password);
    }

    if (!passwordIsValid) {
      throw new BadRequestException("Incorrect password.");
    }

    const hashedPassword = await bcrypt.hash(dto.newPassword, BCRYPT_SALT_ROUNDS);
    await this.userRepository.update(user.id, {
      password: hashedPassword,
      lastPasswordChangeDate: new Date()
    });
  }

  // TODO: Remove before production
  public async delete(id: string): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { id }
    });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    await this.userRepository.update(user.id, {
      isDeactivated: true
    });

    await this.emailService.sendEmailDeleteAccountRequest(id);
  }

  public async deleteDev(id: string): Promise<void> {
    await this.userRepository.manager.transaction(async (entityManager) => {
      const user = await entityManager.findOne(User, {
        where: { id: id },
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

      if (user!.avatarUrl) {
        await this.awsS3Service.delete(user!.avatarUrl);
      }

      await entityManager.delete(User, { id: id });

      logger.info(`Deleted with transaction the user with id:${user!.id}`);
    });
  }

  public async recoverUserAccount(id: string): Promise<void> {
    const accountDeleteRequest = await this.accountDeleteRequestRepository.findOne({
      where: { user: { id } },
      relations: { user: true }
    });

    if (!accountDeleteRequest) {
      throw new NotFoundException("Account delete request not found");
    }

    await this.userRepository.update(accountDeleteRequest.user.id, {
      isDeactivated: false
    });

    await this.accountDeleteRequestRepository.remove(accountDeleteRequest);
  }
}
