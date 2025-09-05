import { Repository } from "typeorm";
import { AppDataSource } from "../../../common/configs/db.config";
import nodemailer from "nodemailer";
import {
  BCRYPT_SALT_ROUNDS,
  EMAIL_CONFIRMATION_EXPIRATION_TIME,
  EMAIL_HOST,
  EMAIL_PASSWORD,
  EMAIL_PORT,
  EMAIL_USERNAME
} from "../../../common/configs/config";
import bcrypt from "bcrypt";
import { BadRequestException, ForbiddenException, NotFoundException } from "../../../common/exceptions";
import { AccountDeleteRequest } from "../../account-deletion/schemas";
import {
  EmailVerifyCodeDto,
  EmailAccountRecoveryRequestDto,
  EmailVerifyCodeRecoveryDto,
  EmailAccountRecoveryDto
} from "../common/dto";
import {
  ACCOUNT_DELETION_PERIOD_DAYS,
  EMAIL_VERIFICATION_CODE_MAX,
  EMAIL_VERIFICATION_CODE_MIN
} from "../common/constants";
import { NUMBER_OF_MILLISECONDS_IN_SECOND } from "../../../common/constants";
import { SessionService } from "../../sessions/services";
import { EmailConfirmation, AccountRecovery } from "../../user-additional-entities/schemas";
import { User } from "../../users/schemas";
import { IEmailOptions } from "../common/interfaces";
import { EmailOptionsService } from "./email-options.service";

export class EmailService {
  private readonly usersRepository: Repository<User>;
  private readonly emailConfirmationRepository: Repository<EmailConfirmation>;
  private readonly accountRecoveryRepository: Repository<AccountRecovery>;
  private readonly accountDeleteRequestRepository: Repository<AccountDeleteRequest>;
  constructor(
    private readonly emailOptionsService = new EmailOptionsService(),
    private readonly sessionService = new SessionService()
  ) {
    this.usersRepository = AppDataSource.getRepository(User);
    this.emailConfirmationRepository = AppDataSource.getRepository(EmailConfirmation);
    this.accountRecoveryRepository = AppDataSource.getRepository(AccountRecovery);
    this.accountDeleteRequestRepository = AppDataSource.getRepository(AccountDeleteRequest);
  }

  private async sendMail(emailOptions: IEmailOptions): Promise<void> {
    const transporter = nodemailer.createTransport({
      host: EMAIL_HOST,
      port: EMAIL_PORT,
      auth: {
        user: EMAIL_USERNAME,
        pass: EMAIL_PASSWORD
      }
    });
    await transporter.sendMail(emailOptions);
  }

  private async generateCodeAndExpiration(expirationTimeInSeconds: number): Promise<{
    code: number;
    expiration: Date;
  }> {
    const code = Math.floor(EMAIL_VERIFICATION_CODE_MIN + Math.random() * EMAIL_VERIFICATION_CODE_MAX);
    const expiration = new Date(Date.now() + expirationTimeInSeconds * NUMBER_OF_MILLISECONDS_IN_SECOND);

    return { code, expiration };
  }

  public async sendCodeToVerifyEmail(id: string): Promise<void> {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: { emailConfirmation: true }
    });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    if (user.isEmailConfirmed) {
      throw new ForbiddenException("Email already confirmed");
    }

    const { code, expiration } = await this.generateCodeAndExpiration(EMAIL_CONFIRMATION_EXPIRATION_TIME);

    if (user.emailConfirmation) {
      await this.emailConfirmationRepository.update(user.emailConfirmation.id, {
        code: code,
        emailVerificationExpires: expiration
      });
    } else {
      const emailConfirmation = this.emailConfirmationRepository.create({
        user: user,
        code: code,
        emailVerificationExpires: expiration
      });
      await this.emailConfirmationRepository.save(emailConfirmation);
    }

    const emailOptions = await this.emailOptionsService.generateConfirmationEmailOptions(user, code);
    await this.sendMail(emailOptions);
  }

  public async verifyEmail(userId: string, dto: EmailVerifyCodeDto): Promise<void> {
    const emailConfirmation = await this.emailConfirmationRepository.findOne({
      where: { user: { id: userId }, code: dto.verificationCode },
      relations: { user: true }
    });

    if (!emailConfirmation || !emailConfirmation.user) {
      throw new BadRequestException("Invalid code");
    }

    if (!emailConfirmation.emailVerificationExpires || new Date() > emailConfirmation.emailVerificationExpires) {
      throw new BadRequestException("The time for verification has expired");
    }

    await this.usersRepository.update(userId, { isEmailConfirmed: true });

    await this.emailConfirmationRepository.remove(emailConfirmation);
  }

  public async sendCodeToAccountRecovery(dto: EmailAccountRecoveryRequestDto): Promise<void> {
    const user = await this.usersRepository.findOne({
      where: { email: dto.email },
      relations: { accountRecovery: true }
    });

    if (!user) {
      throw new NotFoundException("Email not found");
    }

    if (!user.isEmailConfirmed) {
      throw new ForbiddenException("Email not confirmed");
    }

    const { code, expiration } = await this.generateCodeAndExpiration(EMAIL_CONFIRMATION_EXPIRATION_TIME);

    if (user.accountRecovery) {
      await this.accountRecoveryRepository.update(user.accountRecovery.id, {
        code: code,
        emailCodeExpires: expiration
      });
    } else {
      const accountRecovery = this.accountRecoveryRepository.create({
        user: user,
        code: code,
        emailCodeExpires: expiration
      });
      await this.accountRecoveryRepository.save(accountRecovery);
    }

    const emailOptions = await this.emailOptionsService.generatePasswordRecoveryEmailOptions(user, code);
    await this.sendMail(emailOptions);
  }

  public async verifyCodeAccountRecovery(dto: EmailVerifyCodeRecoveryDto): Promise<boolean> {
    const accountRecovery = await this.accountRecoveryRepository.findOne({
      where: { user: { email: dto.email }, code: dto.verificationCode },
      relations: { user: { sessions: true } }
    });

    if (!accountRecovery || !accountRecovery.user) {
      throw new BadRequestException("Invalid code");
    }

    if (!accountRecovery.emailCodeExpires || new Date() > accountRecovery.emailCodeExpires) {
      throw new BadRequestException("The time for verification has expired");
    }

    return true;
  }

  public async verifyAccountRecovery(dto: EmailAccountRecoveryDto): Promise<void> {
    const accountRecovery = await this.accountRecoveryRepository.findOne({
      where: { user: { email: dto.email }, code: dto.verificationCode },
      relations: { user: { sessions: true } }
    });

    if (!accountRecovery || !accountRecovery.user) {
      throw new BadRequestException("Invalid code");
    }

    if (!accountRecovery.emailCodeExpires || new Date() > accountRecovery.emailCodeExpires) {
      throw new BadRequestException("The time for verification has expired");
    }

    const hashedPassword = await bcrypt.hash(dto.newPassword, BCRYPT_SALT_ROUNDS);

    await this.usersRepository.update(accountRecovery.user.id, {
      password: hashedPassword,
      lastPasswordChangeDate: new Date(),
      lastAccountRecoveryDate: new Date()
    });

    await this.sessionService.deleteAll(accountRecovery.user.sessions);
    await this.accountRecoveryRepository.remove(accountRecovery);
  }

  public async sendEmailDeleteAccountRequest(id: string): Promise<void> {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: { accountDeleteRequest: true }
    });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    if (!user.isEmailConfirmed) {
      throw new ForbiddenException("Email not confirmed");
    }

    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + ACCOUNT_DELETION_PERIOD_DAYS);
    const formattedExpirationDate = expirationDate.toISOString().split("T")[0];

    if (user.accountDeleteRequest) {
      await this.accountDeleteRequestRepository.update(user.accountDeleteRequest.id, {
        requestDeletionExpires: expirationDate
      });
    } else {
      const accountDeleteRequest = this.accountDeleteRequestRepository.create({
        user: user,
        requestDeletionExpires: expirationDate
      });
      await this.accountDeleteRequestRepository.save(accountDeleteRequest);
    }

    const emailOptions = await this.emailOptionsService.generateAccountDeletionEmailOptions(
      user,
      formattedExpirationDate
    );
    await this.sendMail(emailOptions);
  }

  public async sendCoachWelcomeEmail(user: User, password: string): Promise<void> {
    const emailOptions = await this.emailOptionsService.generateCoachWelcomeEmailOptions(user, password);

    await this.sendMail(emailOptions);
  }

  public async sendFailedRenewalEmail(user: User): Promise<void> {
    const emailOptions = await this.emailOptionsService.generateFailedRenewalEmailOptions(user);
    await this.sendMail(emailOptions);
  }
}
