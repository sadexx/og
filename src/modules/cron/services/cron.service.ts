import { CronJob } from "cron";
import { logger } from "../../../setup/logger";
import { AccountDeletionService } from "../../account-deletion/services";
import { UserSubscriptionsRenewalService } from "../../user-subscriptions/services";
import { SubscriptionPlanAssignmentService } from "../../subscription-plan/services";

export class CronService {
  private static instance: CronService;
  private readonly jobs: CronJob[] = [];

  constructor(
    private readonly accountDeletionService = new AccountDeletionService(),
    private readonly userSubscriptionsRenewalService = new UserSubscriptionsRenewalService(),
    private readonly subscriptionPlanAssignmentService = new SubscriptionPlanAssignmentService()
  ) {}

  public static getInstance(): CronService {
    if (!CronService.instance) {
      CronService.instance = new CronService();
    }

    return CronService.instance;
  }

  public startAllJobs(): void {
    logger.info("Starting all cron jobs...");

    this.autoDeleteExpiredAccounts();
    this.autoRenewUserSubscriptions();
    this.autoCheckExpiredSubscriptionPlanAssignments();

    for (const job of this.jobs) {
      job.start();
    }
  }

  private async autoDeleteExpiredAccounts(): Promise<void> {
    const job = new CronJob("0 8 * * *", async () => {
      logger.info("Checking and deleting expired accounts...");
      await this.accountDeletionService.checkAndDeleteExpiredAccounts();
    });
    this.jobs.push(job);
  }

  private async autoRenewUserSubscriptions(): Promise<void> {
    const job = new CronJob("0 0 * * *", async () => {
      logger.info("Running monthly subscription renewal check...");
      await this.userSubscriptionsRenewalService.renewUserSubscriptions();
    });
    this.jobs.push(job);
  }

  private async autoCheckExpiredSubscriptionPlanAssignments(): Promise<void> {
    const job = new CronJob("0 0 * * *", async () => {
      logger.info("Checking for expired subscription plan assignments...");
      await this.subscriptionPlanAssignmentService.checkExpiredSubscriptionPlanAssignments();
    });
    this.jobs.push(job);
  }
}
