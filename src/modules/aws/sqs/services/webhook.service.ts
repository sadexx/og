import { Message } from "@aws-sdk/client-sqs";
import { AwsSQSService } from "./aws-sqs.service";
import { logger } from "../../../../setup/logger";
import { EExtWebhookGroupNames } from "../common/enums";
import { AWS_SQS_INTERVAL_TIME_MIN, ENVIRONMENT } from "../../../../common/configs/config";
import { NUMBER_OF_MILLISECONDS_IN_MINUTE } from "../../../../common/constants";
import { EEnvironment } from "../../../../common/enums";
import { BadRequestException } from "../../../../common/exceptions";
import { QueueService } from "../../../queue/services";

export class WebhookService {
  constructor(
    private readonly awsSQSService = new AwsSQSService(),
    private readonly queueService = new QueueService()
  ) {}

  public async startCheckStatusWebhook(): Promise<void> {
    await this.processAwsSqsQueue();

    const interval =
      AWS_SQS_INTERVAL_TIME_MIN * NUMBER_OF_MILLISECONDS_IN_MINUTE +
      Math.floor(Math.random() * NUMBER_OF_MILLISECONDS_IN_MINUTE);

    setTimeout(() => void this.startCheckStatusWebhook(), interval);
  }

  public async getManualStatusCheckWebhook(): Promise<void> {
    if (ENVIRONMENT === EEnvironment.PRODUCTION) {
      throw new BadRequestException("Manual status checks can only be run in development or local environments.");
    }

    logger.info("Starting: Manual status checks");
    await this.processAwsSqsQueue();
    logger.info("Finished: Manual status checks");
  }

  public async processAwsSqsQueue(): Promise<void> {
    const sqsMessages = await this.awsSQSService.pollMessages();
    console.log(sqsMessages);

    if (sqsMessages.length > 0) {
      const appleMessages: Message[] = [];

      for (const message of sqsMessages) {
        if (!message.Attributes) {
          logger.error(`Message does not have attributes: ${JSON.stringify(message)}`);
          continue;
        }

        switch (message.Attributes.MessageGroupId) {
          case EExtWebhookGroupNames.APPLE:
            appleMessages.push(message);
            break;
          default:
            logger.error(`Unknown message group id: ${message.Attributes.MessageGroupId}`);
            break;
        }
      }

      logger.info(`Received ${appleMessages.length} Apple messages.`);

      await this.queueService.addProcessAppleWebhookJob({ sqsMessages: appleMessages });

      await this.processAwsSqsQueue();
    }

    if (sqsMessages.length === 0) {
      return;
    }
  }
}
