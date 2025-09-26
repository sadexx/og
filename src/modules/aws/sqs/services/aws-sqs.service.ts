import {
  DeleteMessageBatchCommand,
  DeleteMessageBatchCommandInput,
  DeleteMessageBatchRequestEntry,
  Message,
  QueueAttributeName,
  ReceiveMessageCommand,
  ReceiveMessageCommandInput,
  SQSClient,
  SQSClientConfig
} from "@aws-sdk/client-sqs";
import {
  AWS_ACCESS_KEY_ID,
  AWS_REGION,
  AWS_SECRET_ACCESS_KEY,
  AWS_SQS_QUEUE_URL,
  ENVIRONMENT
} from "../../../../common/configs/config";
import { EEnvironment } from "../../../../common/enums";
import { logger } from "../../../../setup/logger";
import { InternalServerError } from "../../../../common/exceptions";

export class AwsSQSService {
  private static instance: AwsSQSService;
  private readonly sqsClient: SQSClient;
  private readonly queueUrl: string;

  constructor() {
    const sqsClientOptions: SQSClientConfig = { region: AWS_REGION };

    if (ENVIRONMENT === EEnvironment.LOCAL) {
      sqsClientOptions.credentials = {
        accessKeyId: AWS_ACCESS_KEY_ID,
        secretAccessKey: AWS_SECRET_ACCESS_KEY
      };
    }

    this.sqsClient = new SQSClient(sqsClientOptions);
    this.queueUrl = AWS_SQS_QUEUE_URL;
  }

  public static getInstance(): AwsSQSService {
    if (!AwsSQSService.instance) {
      AwsSQSService.instance = new AwsSQSService();
    }

    return AwsSQSService.instance;
  }

  public async pollMessages(): Promise<Message[]> {
    try {
      const params: ReceiveMessageCommandInput = {
        MessageSystemAttributeNames: [QueueAttributeName.All],
        QueueUrl: this.queueUrl,
        MaxNumberOfMessages: 10,
        WaitTimeSeconds: 20
      };

      const { Messages } = await this.sqsClient.send(new ReceiveMessageCommand(params));

      if (Messages && Messages.length > 0) {
        logger.info(`Received ${Messages.length} messages.`);
        const receiptHandlers = Messages.map((message) => message.ReceiptHandle!);
        await this.deleteMessages(receiptHandlers);

        return Messages;
      }

      return [];
    } catch (error) {
      logger.error(`Failed to receive AWS-SQS messages: ${(error as Error).message}`);
      throw new InternalServerError((error as Error).message);
    }
  }

  private async deleteMessages(receiptHandlers: string[]): Promise<void> {
    try {
      const entries: DeleteMessageBatchRequestEntry[] = receiptHandlers.map((receiptHandler, index) => ({
        Id: index.toString(),
        ReceiptHandle: receiptHandler
      }));

      const params: DeleteMessageBatchCommandInput = {
        QueueUrl: this.queueUrl,
        Entries: entries
      };

      await this.sqsClient.send(new DeleteMessageBatchCommand(params));
      logger.info("AWS-SQS Messages deleted successfully");
    } catch (error) {
      logger.error(`Failed to delete AWS-SQS messages: ${(error as Error).message}`);
      throw new InternalServerError((error as Error).message);
    }
  }
}
