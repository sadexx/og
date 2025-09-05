import { CronJob } from "cron";
import { logger } from "../../../setup/logger";
import { AccountDeletionService } from "../../account-deletion/services";
import { UserSubscriptionsRenewalService } from "../../user-subscriptions/services";

export class CronService {
  private static instance: CronService;
  private readonly jobs: CronJob[] = [];

  constructor(
    private readonly accountDeletionService = new AccountDeletionService(),
    private readonly userSubscriptionsRenewalService = new UserSubscriptionsRenewalService()
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
}
