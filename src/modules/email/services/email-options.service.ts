import path from "node:path";
import fs from "node:fs";
import { IEmailTemplateOptions, IEmailOptions } from "../common/interfaces";
import { EMAIL_DOMAIN_NAME } from "../../../common/configs/config";
import { User } from "../../users/schemas";

export class EmailOptionsService {
  private async generateOptions(templateOptions: IEmailTemplateOptions, user: User): Promise<IEmailOptions> {
    const { subject, text, userName, customMessage, actionMessage, detailedMessage, codeOrDate } = templateOptions;

    const htmlTemplatePath = path.join(__dirname, "../../../../public/email-template.html");

    let htmlContent = await fs.promises.readFile(htmlTemplatePath, "utf8");
    htmlContent = htmlContent.replace("{{name}}", userName);
    htmlContent = htmlContent.replace("{{customMessage}}", customMessage);
    htmlContent = htmlContent.replace("{{actionMessage}}", actionMessage);
    htmlContent = htmlContent.replace("{{detailedMessage}}", detailedMessage);

    if (codeOrDate) {
      htmlContent = htmlContent.replace("{{codeOrDate}}", codeOrDate.toString());
    }

    return {
      from: EMAIL_DOMAIN_NAME,
      to: user.email,
      subject: subject,
      text: text,
      html: htmlContent
    };
  }

  public async generateConfirmationEmailOptions(user: User, code: number): Promise<IEmailOptions> {
    const subject = "Email Verification";
    const text = `Please enter the following code in the app to confirm your email: ${code}`;
    const customMessage =
      "<p>Welcome to Olympus Grip Platform, we're glad to have you 🎉🙏</p><p>We need to verify your email address to complete the registration process.</p>";
    const actionMessage = "Please enter the following code in the app to confirm your email";
    const detailedMessage = "<p>If you did not request this, please ignore this email.</p>";

    const templateOptions: IEmailTemplateOptions = {
      subject,
      text,
      userName: user.name,
      customMessage,
      actionMessage,
      detailedMessage,
      codeOrDate: code
    };

    return await this.generateOptions(templateOptions, user);
  }

  public async generatePasswordRecoveryEmailOptions(user: User, code: number): Promise<IEmailOptions> {
    const subject = "Password Recovery";
    const text = `Your password recovery code: ${code}`;
    const customMessage = "<p>You requested a password recovery. 🔐</p>";
    const actionMessage = "Your password recovery code";
    const detailedMessage = "<p>If this was not you, please secure your account.</p>";

    const templateOptions: IEmailTemplateOptions = {
      subject,
      text,
      userName: user.name,
      customMessage,
      actionMessage,
      detailedMessage,
      codeOrDate: code
    };

    return await this.generateOptions(templateOptions, user);
  }

  public async generateAccountDeletionEmailOptions(user: User, expirationDate: string): Promise<IEmailOptions> {
    const subject = "Account Deletion Request";
    const text = `Your account deletion request will happen after this date ${expirationDate}, all user data will be permanently deleted. To restore your account, all you need to do is login to your account and confirm account recovery.`;
    const customMessage = "<p>You have requested to delete your account. 🥲</p>";
    const actionMessage = "Your account deletion request will happen after this date";
    const detailedMessage =
      "<p>All user data will be permanently deleted. To restore your account, all you need to do is login to your account and confirm account recovery.</p>";

    const templateOptions: IEmailTemplateOptions = {
      subject,
      text,
      userName: user.name,
      customMessage,
      actionMessage,
      detailedMessage,
      codeOrDate: expirationDate
    };

    return await this.generateOptions(templateOptions, user);
  }

  public async generateCoachWelcomeEmailOptions(user: User, password: string): Promise<IEmailOptions> {
    const subject = "Welcome to Olympus Grip — Coach Access";
    const text = "Your coach account has been successfully created!";
    const customMessage = "<p>Welcome to <strong>Olympus Grip</strong>, Coach! 💪</p>";
    const loginCredentials = `Email: ${user.email}, Password: ${password}`;
    const actionMessage = "Your login credentials";
    const detailedMessage = "<p>We recommend changing your password after your first login for security purposes.</p>";

    const templateOptions: IEmailTemplateOptions = {
      subject,
      text,
      userName: user.name,
      customMessage,
      actionMessage,
      detailedMessage,
      codeOrDate: loginCredentials
    };

    return await this.generateOptions(templateOptions, user);
  }

  public async generateFailedRenewalEmailOptions(user: User): Promise<IEmailOptions> {
    const subject = "Subscription Renewal Failed";
    const text =
      "We tried to renew your subscription, but your coin balance was too low. Please top up your wallet to continue enjoying premium features.";
    const customMessage =
      "<p>We attempted to renew your coach subscription, but unfortunately your wallet has insufficient coins.</p>";
    const actionMessage = "Please top up your wallet to keep your subscription active";
    const detailedMessage =
      "<p>To avoid losing access to premium workouts and coaching, make sure to top up your balance. You can do it anytime from the app.</p>";

    const templateOptions: IEmailTemplateOptions = {
      subject,
      text,
      userName: user.name,
      customMessage,
      actionMessage,
      detailedMessage
    };

    return await this.generateOptions(templateOptions, user);
  }
}
